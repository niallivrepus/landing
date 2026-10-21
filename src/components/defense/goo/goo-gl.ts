/**
 * **Purpose:** GPU renderer for `GooStage`: one WebGL2 full-stage pass that draws the goo as a smooth-union signed
 * distance field (beads = circles, necks = capsules, merged with a polynomial smooth-min — the metaball look without a
 * per-frame CPU blur) and shades it as the house Splex glass. Numbers follow `goo-material.ts` (the app's goo kit):
 * dark Splex = tinted glass body (alpha 0.77 − 0.24·Σrgb), 2 px white 20 % rim, white 15 % top highlights; designed
 * Gooey Light = frosted body (0.3 + 0.16·Σrgb), white rim + warm outer hairline, white specular top, warm inner shade
 * and bottom gradient, warm drop + contact shadow, dome specular. Also draws the energy glow under the glass and the
 * trust-zone membranes (fill + rim) so a whole stage is one draw call. SVG filters cost ~150 ms a frame on the CPU at
 * 2× DPR; this is a few ms on any GPU.
 * **Connects to:** `GooStage.tsx` (creates it, feeds positions every frame), `goo-material.ts` (the numbers).
 */

export const GL_MAX_BEADS = 12;
export const GL_MAX_LINKS = 12;
export const GL_MAX_ZONES = 3;

export type GlFrame = {
  /** Canvas px per stage unit. */
  scale: number;
  /** Stage-unit offset of the stage's origin inside the (bleeding) canvas. */
  ox: number;
  oy: number;
  light: boolean;
  /** Smooth-union radius in stage units (how far beads reach for each other). */
  goo: number;
  glow: number;
  beads: { x: number; y: number; r: number; rgb: [number, number, number] }[];
  links: { ax: number; ay: number; bx: number; by: number; w: number; a: number; b: number }[];
  zones: { members: number[]; pad: number; rgb: [number, number, number] }[];
};

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
#define MB ${GL_MAX_BEADS}
#define ML ${GL_MAX_LINKS}
#define MZ ${GL_MAX_ZONES}
uniform vec2 uRes;
uniform int uN;
uniform vec4 uB[MB];
uniform vec3 uC[MB];
uniform int uL;
uniform vec4 uLk[ML];
uniform vec3 uLw[ML];
uniform int uZ;
uniform vec4 uZm[MZ];
uniform vec3 uZc[MZ];
uniform float uK;
uniform float uS;
uniform float uGlow;
uniform int uLight;
out vec4 o;

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}
float sdSeg(vec2 p, vec2 a, vec2 b, out float t) {
  vec2 pa = p - a, ba = b - a;
  t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  return length(pa - ba * t);
}

float shape(vec2 p) {
  float d = 1e9;
  float t;
  for (int i = 0; i < MB; i++) {
    if (i >= uN) break;
    vec4 b = uB[i];
    if (b.z <= 0.0) continue;
    d = smin(d, length(p - b.xy) - b.z, uK);
  }
  for (int i = 0; i < ML; i++) {
    if (i >= uL) break;
    float r = uLw[i].x * 0.5;
    if (r <= 0.05) continue;
    d = smin(d, sdSeg(p, uLk[i].xy, uLk[i].zw, t) - r, uK * 0.7);
  }
  return d;
}

float shapeCol(vec2 p, out vec3 col) {
  float d = 1e9;
  vec3 acc = vec3(0.0);
  float ws = 0.0;
  float T = uK * 0.45;
  float t;
  for (int i = 0; i < MB; i++) {
    if (i >= uN) break;
    vec4 b = uB[i];
    if (b.z <= 0.0) continue;
    float di = length(p - b.xy) - b.z;
    d = smin(d, di, uK);
    float w = exp(clamp(-di / T, -30.0, 30.0));
    acc += uC[i] * w;
    ws += w;
  }
  for (int i = 0; i < ML; i++) {
    if (i >= uL) break;
    float r = uLw[i].x * 0.5;
    if (r <= 0.05) continue;
    float di = sdSeg(p, uLk[i].xy, uLk[i].zw, t) - r;
    d = smin(d, di, uK * 0.7);
    int ia = int(uLw[i].y);
    int ib = int(uLw[i].z);
    vec3 c = mix(uC[ia], uC[ib], smoothstep(0.15, 0.85, t));
    float w = exp(clamp(-di / T, -30.0, 30.0)) * 0.6;
    acc += c * w;
    ws += w;
  }
  col = acc / max(ws, 1e-5);
  return d;
}

float zoneField(int z) {
  vec4 m = uZm[z];
  float pad = m.w;
  float d = 1e9;
  float t;
  int ids[3] = int[3](int(m.x), int(m.y), int(m.z));
  for (int j = 0; j < 3; j++) {
    int i = ids[j];
    if (i < 0) continue;
    vec4 b = uB[i];
    d = smin(d, length(gl_FragCoord.xy * vec2(1.0, -1.0) + vec2(0.0, uRes.y) - b.xy) - b.z * pad, uK * 2.2);
  }
  for (int j = 0; j < 2; j++) {
    int ia = ids[j];
    int ib = ids[j + 1];
    if (ia < 0 || ib < 0) continue;
    vec4 a = uB[ia];
    vec4 b = uB[ib];
    vec2 p = gl_FragCoord.xy * vec2(1.0, -1.0) + vec2(0.0, uRes.y);
    d = smin(d, sdSeg(p, a.xy, b.xy, t) - min(a.z, b.z) * pad * 0.72, uK * 2.2);
  }
  return d;
}

vec4 over(vec4 dst, vec3 rgb, float a) {
  return vec4(rgb * a + dst.rgb * (1.0 - a), a + dst.a * (1.0 - a));
}

float band(float d, float w) { return 1.0 - smoothstep(-w, w, d); }

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float aa = 0.9;
  vec4 c = vec4(0.0);

  // Light under the glass: each bead's energy as a soft glow.
  if (uGlow > 0.0) {
    vec3 g = vec3(0.0);
    for (int i = 0; i < MB; i++) {
      if (i >= uN) break;
      vec4 b = uB[i];
      if (b.z <= 0.0) continue;
      float q = max(length(p - b.xy) - b.z * 0.2, 0.0) / (b.z * 1.35);
      g += uC[i] * exp(-q * q);
    }
    g *= uGlow;
    float ga = clamp(max(g.r, max(g.g, g.b)), 0.0, 1.0);
    c = vec4(g, ga);
  }

  // Trust membranes.
  for (int z = 0; z < MZ; z++) {
    if (z >= uZ) break;
    float dz = zoneField(z);
    float fill = band(dz, aa);
    float rim = fill * band(-dz - 1.4 * uS, aa);
    c = over(c, uZc[z], fill * 0.09);
    c = over(c, uZc[z], rim * 0.55);
  }

  vec3 col;
  float d = shapeCol(p, col);
  float inside = band(d, aa);

  if (uLight == 1) {
    // Warm cast + contact shadow (cut out of the shape) and the refraction tint under tinted beads.
    float dd = shape(p - vec2(0.0, 9.0 * uS));
    c = over(c, vec3(0.357, 0.271, 0.149), (1.0 - inside) * band(dd, 8.0 * uS) * 0.2);
    float dc = shape(p - vec2(0.0, 1.5 * uS));
    c = over(c, vec3(0.165, 0.125, 0.078), (1.0 - inside) * band(dc, 1.2 * uS) * 0.22);
    float tint = clamp(0.12 * (3.0 - (col.r + col.g + col.b)), 0.0, 1.0);
    float dk = shape(p - vec2(0.0, 7.0 * uS));
    c = over(c, col, (1.0 - inside) * band(dk, 6.0 * uS) * tint);
    // Warm outer hairline.
    c = over(c, vec3(0.235, 0.176, 0.078), (1.0 - inside) * band(d - 1.0 * uS, aa) * 0.2);
  }

  if (inside > 0.001) {
    float lum = col.r + col.g + col.b;
    float ba = uLight == 1 ? clamp(0.3 + 0.16 * lum, 0.0, 1.0) : clamp(0.77 - 0.24 * lum, 0.0, 1.0);
    c = over(c, col, inside * ba);
    if (uLight == 1) {
      // Bottom gradient + warm inner shade.
      float dg = shape(p + vec2(0.0, 14.0 * uS));
      c = over(c, vec3(0.541, 0.478, 0.376), inside * smoothstep(-10.0 * uS, 10.0 * uS, dg) * 0.14);
      float ds = shape(p + vec2(0.0, 3.0 * uS));
      c = over(c, vec3(0.235, 0.176, 0.078), inside * smoothstep(-2.0 * uS, 2.0 * uS, ds) * 0.16);
    }
    // Top highlights: where the pixel just above is outside the shape.
    float hiDy = (uLight == 1 ? 2.5 : 2.0) * uS;
    float hiBlur = (uLight == 1 ? 1.2 : 1.5) * uS;
    float dUp = shape(p - vec2(0.0, hiDy));
    c = over(c, vec3(1.0), inside * smoothstep(-hiBlur, hiBlur, dUp) * (uLight == 1 ? 1.0 : 0.15));
    float dUp2 = shape(p - vec2(0.0, 1.0 * uS));
    c = over(c, vec3(1.0), inside * smoothstep(-(uLight == 1 ? 0.4 : 0.5) * uS, 0.5 * uS, dUp2) * (uLight == 1 ? 0.9 : 0.15));
    // Inside rim.
    float rimW = (uLight == 1 ? 1.0 : 2.0) * uS;
    c = over(c, vec3(1.0), inside * band(-d - rimW, aa) * (uLight == 1 ? 0.85 : 0.2));
    if (uLight == 1) {
      // Dome specular (light from the upper left, as the kit's feDistantLight 235° / 58°).
      float e = 1.5 * uS;
      float R = 7.0 * uS;
      float hx = clamp(-shape(p + vec2(e, 0.0)) / R, 0.0, 1.0) - clamp(-shape(p - vec2(e, 0.0)) / R, 0.0, 1.0);
      float hy = clamp(-shape(p + vec2(0.0, e)) / R, 0.0, 1.0) - clamp(-shape(p - vec2(0.0, e)) / R, 0.0, 1.0);
      vec3 n = normalize(vec3(-hx * 3.0, -hy * 3.0, 2.0 * e / R));
      vec3 L = normalize(vec3(-0.30, -0.43, 0.85));
      vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
      float sp = pow(max(dot(n, H), 0.0), 26.0);
      c = over(c, vec3(1.0), inside * sp * 0.55);
    }
  }
  o = c;
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("[goo-gl]", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export class GooGL {
  /** True on a CPU rasteriser (SwiftShader, llvmpipe…): the stage renders at a lower resolution. */
  readonly software: boolean;
  private gl: WebGL2RenderingContext;
  private prog: WebGLProgram;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private bead = new Float32Array(GL_MAX_BEADS * 4);
  private beadCol = new Float32Array(GL_MAX_BEADS * 3);
  private link = new Float32Array(GL_MAX_LINKS * 4);
  private linkW = new Float32Array(GL_MAX_LINKS * 3);
  private zone = new Float32Array(GL_MAX_ZONES * 4);
  private zoneCol = new Float32Array(GL_MAX_ZONES * 3);

  /** Returns null when WebGL2 or the shader is unavailable (the stage falls back to SVG). One renderer per canvas
   * (a remount — React StrictMode, HMR — reuses it rather than asking the canvas for a second context). */
  static create(canvas: HTMLCanvasElement): GooGL | null {
    const cached = RENDERERS.get(canvas);
    if (cached) return cached;
    try {
      const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false, alpha: true });
      if (!gl) return null;
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return null;
      const prog = gl.createProgram();
      if (!prog) return null;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.warn("[goo-gl]", gl.getProgramInfoLog(prog));
        return null;
      }
      const r = new GooGL(gl, prog);
      RENDERERS.set(canvas, r);
      return r;
    } catch {
      return null;
    }
  }

  private constructor(gl: WebGL2RenderingContext, prog: WebGLProgram) {
    this.gl = gl;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
    this.software = /swiftshader|llvmpipe|software|softpipe/i.test(renderer);
    this.prog = prog;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ["uRes", "uN", "uB", "uC", "uL", "uLk", "uLw", "uZ", "uZm", "uZc", "uK", "uS", "uGlow", "uLight"]) {
      this.u[n] = gl.getUniformLocation(prog, n);
    }
  }

  draw(f: GlFrame): void {
    const gl = this.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    const k = f.scale;
    const n = Math.min(GL_MAX_BEADS, f.beads.length);
    this.bead.fill(0);
    for (let i = 0; i < n; i += 1) {
      const b = f.beads[i]!;
      this.bead.set([(b.x + f.ox) * k, (b.y + f.oy) * k, b.r * k, 0], i * 4);
      this.beadCol.set(b.rgb, i * 3);
    }
    const l = Math.min(GL_MAX_LINKS, f.links.length);
    for (let i = 0; i < l; i += 1) {
      const lk = f.links[i]!;
      this.link.set([(lk.ax + f.ox) * k, (lk.ay + f.oy) * k, (lk.bx + f.ox) * k, (lk.by + f.oy) * k], i * 4);
      this.linkW.set([lk.w * k, lk.a, lk.b], i * 3);
    }
    const z = Math.min(GL_MAX_ZONES, f.zones.length);
    for (let i = 0; i < z; i += 1) {
      const zn = f.zones[i]!;
      this.zone.set([zn.members[0] ?? -1, zn.members[1] ?? -1, zn.members[2] ?? -1, zn.pad], i * 4);
      this.zoneCol.set(zn.rgb, i * 3);
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.prog);
    gl.uniform2f(this.u.uRes!, canvas.width, canvas.height);
    gl.uniform1i(this.u.uN!, n);
    gl.uniform4fv(this.u.uB!, this.bead);
    gl.uniform3fv(this.u.uC!, this.beadCol);
    gl.uniform1i(this.u.uL!, l);
    gl.uniform4fv(this.u.uLk!, this.link);
    gl.uniform3fv(this.u.uLw!, this.linkW);
    gl.uniform1i(this.u.uZ!, z);
    gl.uniform4fv(this.u.uZm!, this.zone);
    gl.uniform3fv(this.u.uZc!, this.zoneCol);
    gl.uniform1f(this.u.uK!, f.goo * k);
    gl.uniform1f(this.u.uS!, k);
    gl.uniform1f(this.u.uGlow!, f.glow);
    gl.uniform1i(this.u.uLight!, f.light ? 1 : 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

}

const RENDERERS = new WeakMap<HTMLCanvasElement, GooGL>();

/** Resolve a CSS colour (including `var(--token)`) to 0…1 sRGB via a probe element. */
export function resolveRgb(probe: HTMLElement, css: string): [number, number, number] {
  probe.style.color = "";
  probe.style.color = css;
  const m = getComputedStyle(probe).color.match(/[\d.]+/g);
  if (!m || m.length < 3) return [0.5, 0.5, 0.5];
  return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
}
