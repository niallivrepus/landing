/**
 * **Purpose:** Draws the Batcoin city's goo bats with WebGL2, in the app's look: every bat is one outline; the frame is
 * blurred and cut at the goo surface so neighbouring bats neck together into a living swarm and separate again.
 * Gooey Light = deep ink bats with a glass rim (white → smoke-5) over a paper-ink shadow; Gooey Dark = true-black
 * bats with a violet → teal rim light over a purple glow; optional Thermal rim (white-hot → ember).
 * **Pipeline (one frame):**
 * 1. Mask: every bat, droplet and blob as an instanced sprite from a silhouette atlas (`GooBatSilhouette` outline,
 *    rasterised once per flap step) into an alpha target.
 * 2. Goo pass: separable Gaussian blur of the mask (σ 3.2 pt, at half resolution).
 * 3. Field: goo pass over the crisp mask (the app's two-pass `field`: σ 3.2 grows necks, the crisp pass keeps ears
 *    and wing scallops), cut at alpha 0.45 (house `surfaceAlpha`) with a ~1 px antialiased edge from the alpha
 *    gradient (the `gooField` shader idea), body + constant-width rim band + glow / shadow + light highlight.
 * 4. Coins, glints and pop rings as colour sprites on top (not goo: they never merge with the bats).
 * **Ported from (jokuh-live):** `Sources/gooey/celebrations/goo-bat-swarm.swift` (`GooBatSwarmLook`,
 * `GooBatSwarmRenderer.draw` colours, widths and alphas, `drawGlint`), `Sources/gooey/goo-kit.swift` (surface 0.45).
 * **Perf:** three small instanced draws + three full-screen passes; nothing allocates per frame.
 */
import { BAT_POINTS, newBatBuf, traceBat } from "./bat-silhouette";

export type BatLook = { dark: boolean; thermal: boolean };

/** Flap steps in the silhouette atlas (flap −1 … 1). */
export const FLAP_FRAMES = 48;
const CELL = 96;
/** Wingspan of the atlas bat in cell pixels; the bat origin sits at (48, 58) in its cell. */
const ATLAS_SPAN = 80;
const ORIGIN_X = 48;
const ORIGIN_Y = 58;
const ATLAS_COLS = 8;
const ATLAS_FRAMES = FLAP_FRAMES + 1; // + one circle (droplets, blobs)
const ATLAS_ROWS = Math.ceil(ATLAS_FRAMES / ATLAS_COLS);
export const CIRCLE_FRAME = FLAP_FRAMES;

const FX_CELL = 128;
export const FX_COIN = 0;
export const FX_GLINT = 1;
export const FX_RING = 2;
const FX_COLS = 4;

const MAX_INST = 512;
const FLOATS = 6;

const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** `GooeyDesignPalette` values used by the bat look. */
const PAL = {
  smoke2: hex("#141414"),
  smoke5: hex("#B3B3B3"),
  purple4: hex("#9327FF"),
  purple5: hex("#B56FFF"),
  cyan4: hex("#43FDFF"),
  yellow4: hex("#FFB800"),
  yellow5: hex("#FFC633"),
  yellow7: hex("#FFF8E7"),
  orange4: hex("#FF4D00"),
  red1: hex("#200400"),
  red4: hex("#FF0700"),
  paperInk: hex("#3C2D14"),
  white: [1, 1, 1] as [number, number, number],
  black: [0, 0, 0] as [number, number, number],
};

const SPRITE_VS = `#version 300 es
layout(location=0) in vec2 aCorner;
layout(location=1) in vec4 aInst;   // x, y, size, rot
layout(location=2) in vec2 aInst2;  // frame, alpha
uniform vec2 uRes;
uniform vec2 uGrid;      // cols, rows
uniform vec2 uOrigin;    // origin in the cell, 0..1
uniform float uSpanFrac; // span / cell
out vec2 vUv;
out float vAlpha;
void main() {
  vec2 local = (aCorner - uOrigin) / uSpanFrac * aInst.z;
  float c = cos(aInst.w), s = sin(aInst.w);
  vec2 p = vec2(c * local.x - s * local.y, s * local.x + c * local.y) + aInst.xy;
  vec2 clip = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  float f = aInst2.x;
  vec2 cell = vec2(mod(f, uGrid.x), floor(f / uGrid.x));
  vUv = (cell + aCorner) / uGrid;
  vAlpha = aInst2.y;
}`;

const SPRITE_FS = `#version 300 es
precision mediump float;
uniform sampler2D uTex;
uniform float uColor; // 0 = alpha mask, 1 = premultiplied colour
in vec2 vUv;
in float vAlpha;
out vec4 o;
void main() {
  vec4 t = texture(uTex, vUv);
  o = uColor > 0.5 ? t * vAlpha : vec4(t.a * vAlpha);
}`;

const FULL_VS = `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
  vec2 p = P[gl_VertexID];
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const BLUR_FS = `#version 300 es
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uStep;
uniform float uW[12];
uniform float uO[12];
uniform int uN;
in vec2 vUv;
out vec4 o;
void main() {
  float a = texture(uTex, vUv).a * uW[0];
  for (int i = 1; i < 12; i++) {
    if (i >= uN) break;
    a += texture(uTex, vUv + uStep * uO[i]).a * uW[i];
    a += texture(uTex, vUv - uStep * uO[i]).a * uW[i];
  }
  o = vec4(a);
}`;

const FIELD_FS = `#version 300 es
precision highp float;
uniform sampler2D uMask;
uniform sampler2D uGoo;
uniform vec2 uRes;      // css px
uniform float uDpr;
uniform vec3 uBody;
uniform vec4 uGlow;     // rgb, alpha (dark glow / light shadow / thermal glow)
uniform vec4 uGlow2;    // second thermal glow
uniform vec2 uGlowShift;// css px (light shadow drops 3 pt)
uniform vec3 uRim0;
uniform vec3 uRim1;
uniform vec3 uRim2;
uniform float uRimStops; // 2 or 3
uniform float uRimA;
uniform float uRimW;     // css px
uniform float uHi;       // light top highlight alpha
in vec2 vUv;
out vec4 o;
const float SURFACE = 0.45;
void main() {
  float g = texture(uGoo, vUv).a;
  float c = texture(uMask, vUv).a;
  float a = g + c * (1.0 - g);
  vec2 grad = vec2(dFdx(a), dFdy(a));
  float gl = max(length(grad), 1e-4);
  float d = (a - SURFACE) / gl;              // device px inside the surface
  float body = clamp(0.5 + d / 1.2, 0.0, 1.0);
  float rw = uRimW * uDpr;
  float rim = body * clamp(0.5 - (d - rw) / 1.2, 0.0, 1.0);
  // Glow / shadow: the goo pass reaches ~2σ past the surface, close to the app's post-blurred field.
  vec2 shift = uGlowShift / uRes;
  float gs = texture(uGoo, vUv + vec2(-shift.x, shift.y)).a;
  float glow = smoothstep(0.03, 0.5, gs) * uGlow.a;
  float glow2 = smoothstep(0.0, 0.3, g) * uGlow2.a;
  // Screen-space rim gradient from the top-left to the bottom-right (the app's linear gradient).
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;
  float t = clamp(dot(px, uRes) / dot(uRes, uRes), 0.0, 1.0);
  vec3 rimC = uRimStops > 2.5 ? (t < 0.5 ? mix(uRim0, uRim1, t * 2.0) : mix(uRim1, uRim2, t * 2.0 - 1.0)) : mix(uRim0, uRim1, t);
  // Premultiplied painter's order: glow2, glow, body, rim, highlight.
  vec4 col = vec4(uGlow2.rgb * glow2, glow2);
  col = vec4(uGlow.rgb * glow, glow) + col * (1.0 - glow);
  col = vec4(uBody * body, body) + col * (1.0 - body);
  float ra = rim * uRimA;
  col = vec4(rimC * ra, ra) + col * (1.0 - ra);
  if (uHi > 0.0) {
    float up = clamp(-grad.y / gl, 0.0, 1.0);
    float hb = body * clamp(0.5 - (d - 0.8 * uDpr) / 1.0, 0.0, 1.0) * up * uHi;
    col = vec4(vec3(hb), hb) + col * (1.0 - hb);
  }
  o = col;
}`;

function compile(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  return p;
}

type Target = { fb: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number };

/** The silhouette atlas: one bat per flap step (+ a circle), white on transparent. */
export function buildBatAtlas(): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = ATLAS_COLS * CELL;
  cv.height = ATLAS_ROWS * CELL;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#fff";
  const buf = newBatBuf();
  for (let f = 0; f < FLAP_FRAMES; f++) {
    const flap = -1 + (2 * f) / (FLAP_FRAMES - 1);
    const cx = (f % ATLAS_COLS) * CELL + ORIGIN_X;
    const cy = Math.floor(f / ATLAS_COLS) * CELL + ORIGIN_Y;
    ctx.beginPath();
    traceBat(ctx, cx, cy, ATLAS_SPAN, flap, 0, buf);
    ctx.fill();
  }
  const cf = CIRCLE_FRAME;
  ctx.beginPath();
  ctx.arc((cf % ATLAS_COLS) * CELL + ORIGIN_X, Math.floor(cf / ATLAS_COLS) * CELL + ORIGIN_Y, ATLAS_SPAN / 2, 0, Math.PI * 2);
  ctx.fill();
  void BAT_POINTS;
  return cv;
}

/** Coin (gold disc + the Batcoin mark + halo), the app's four-point glint, and a soft gold pop ring. */
export function buildFxAtlas(token: HTMLImageElement | null, dark: boolean): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = FX_COLS * FX_CELL;
  cv.height = FX_CELL;
  const ctx = cv.getContext("2d")!;
  const h = FX_CELL / 2;
  // Coin: disc r 32 in a 128 cell (the cell is drawn at 4 × the coin radius).
  {
    const cx = h;
    const cy = h;
    const halo = ctx.createRadialGradient(cx, cy, 20, cx, cy, 62);
    halo.addColorStop(0, dark ? "rgba(255,184,0,0.55)" : "rgba(255,184,0,0.35)");
    halo.addColorStop(1, "rgba(255,184,0,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, FX_CELL, FX_CELL);
    const disc = ctx.createLinearGradient(cx - 32, cy - 32, cx + 32, cy + 32);
    disc.addColorStop(0, "#FFF8E7");
    disc.addColorStop(0.35, "#FFC633");
    disc.addColorStop(1, "#E08A00");
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(120,60,0,0.55)";
    ctx.stroke();
    if (token) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 27, 0, Math.PI * 2);
      ctx.clip();
      ctx.globalAlpha = 0.95;
      ctx.drawImage(token, cx - 23, cy - 23.5, 46, 46.5);
      ctx.restore();
    }
  }
  // Glint: the app's eight-point star (alternating r and 0.18 r) in yellow-5 with a yellow-7 core and a soft glow.
  {
    const cx = FX_CELL + h;
    const cy = h;
    const r = 52;
    ctx.save();
    ctx.shadowColor = "rgba(255,184,0,0.8)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#FFC633";
    ctx.beginPath();
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      const rr = k % 2 === 0 ? r : r * 0.18;
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#FFF8E7";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }
  // Pop ring.
  {
    const cx = FX_CELL * 2 + h;
    const cy = h;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(255,198,51,0.9)";
    ctx.shadowColor = "rgba(255,184,0,0.9)";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, 48, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Premultiply for the colour pass.
  return cv;
}

export class BatGooRenderer {
  readonly gl: WebGL2RenderingContext;
  private sprite: WebGLProgram;
  private blur: WebGLProgram;
  private field: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private inst: WebGLBuffer;
  private data = new Float32Array(MAX_INST * FLOATS);
  private atlas: WebGLTexture;
  private fx: WebGLTexture;
  private mask: Target | null = null;
  private goo1: Target | null = null;
  private goo2: Target | null = null;
  private w = 1;
  private h = 1;
  private dpr = 1;
  private count = 0;
  private fxCount = 0;
  private fxData = new Float32Array(MAX_INST * FLOATS);
  private blurW = new Float32Array(12);
  private blurO = new Float32Array(12);
  private blurN = 1;
  private u: Record<string, WebGLUniformLocation | null> = {};
  look: BatLook = { dark: true, thermal: false };

  static create(canvas: HTMLCanvasElement): BatGooRenderer | null {
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: "high-performance" });
    if (!gl) return null;
    try {
      return new BatGooRenderer(gl);
    } catch {
      return null;
    }
  }

  private constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.sprite = compile(gl, SPRITE_VS, SPRITE_FS);
    this.blur = compile(gl, FULL_VS, BLUR_FS);
    this.field = compile(gl, FULL_VS, FIELD_FS);
    for (const [p, names] of [
      [this.sprite, ["uRes", "uGrid", "uOrigin", "uSpanFrac", "uTex", "uColor"]],
      [this.blur, ["uTex", "uStep", "uW", "uO", "uN"]],
      [
        this.field,
        ["uMask", "uGoo", "uRes", "uDpr", "uBody", "uGlow", "uGlow2", "uGlowShift", "uRim0", "uRim1", "uRim2", "uRimStops", "uRimA", "uRimW", "uHi"],
      ],
    ] as const) {
      const prefix = p === this.sprite ? "s" : p === this.blur ? "b" : "f";
      for (const n of names) this.u[prefix + n] = gl.getUniformLocation(p, n);
    }
    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);
    const quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.inst = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.inst);
    gl.bufferData(gl.ARRAY_BUFFER, this.data.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, FLOATS * 4, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, FLOATS * 4, 16);
    gl.vertexAttribDivisor(2, 1);
    gl.bindVertexArray(null);

    this.atlas = this.texFrom(buildBatAtlas(), true);
    this.fx = this.texFrom(buildFxAtlas(null, true), true);
  }

  private texFrom(src: TexImageSource, mip: boolean): WebGLTexture {
    const gl = this.gl;
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    if (mip) gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  /** Swap in the coin art once the Batcoin mark has loaded (or the scheme changed). */
  setFx(canvas: HTMLCanvasElement) {
    const gl = this.gl;
    gl.deleteTexture(this.fx);
    this.fx = this.texFrom(canvas, true);
  }

  private target(w: number, h: number, old: Target | null): Target {
    const gl = this.gl;
    if (old) {
      gl.deleteFramebuffer(old.fb);
      gl.deleteTexture(old.tex);
    }
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { fb, tex, w, h };
  }

  resize(wCss: number, hCss: number, dpr: number) {
    this.w = Math.max(1, wCss);
    this.h = Math.max(1, hCss);
    this.dpr = dpr;
    const gl = this.gl;
    const W = Math.max(1, Math.round(this.w * dpr));
    const H = Math.max(1, Math.round(this.h * dpr));
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.width = W;
    canvas.height = H;
    this.mask = this.target(W, H, this.mask);
    const hw = Math.max(1, Math.round(W / 2));
    const hh = Math.max(1, Math.round(H / 2));
    this.goo1 = this.target(hw, hh, this.goo1);
    this.goo2 = this.target(hw, hh, this.goo2);
    // Gaussian σ 3.2 pt at half resolution, folded into linear-sampling taps.
    const sigma = (3.2 * dpr) / 2;
    const R = Math.min(22, Math.ceil(sigma * 3));
    const wts: number[] = [];
    for (let i = 0; i <= R; i++) wts.push(Math.exp(-(i * i) / (2 * sigma * sigma)));
    const sum = wts[0]! + 2 * wts.slice(1).reduce((a, b) => a + b, 0);
    const norm = wts.map((x) => x / sum);
    this.blurW[0] = norm[0]!;
    this.blurO[0] = 0;
    let n = 1;
    for (let i = 1; i <= R && n < 12; i += 2) {
      const a = norm[i]!;
      const b = norm[i + 1] ?? 0;
      this.blurW[n] = a + b;
      this.blurO[n] = a + b > 0 ? (i * a + (i + 1) * b) / (a + b) : i;
      n++;
    }
    this.blurN = n;
  }

  /** Starts a frame's instance lists. */
  begin() {
    this.count = 0;
    this.fxCount = 0;
  }

  /** One goo shape: a bat (`frame` 0…FLAP_FRAMES−1) or a circle (`CIRCLE_FRAME`, size = diameter). */
  pushMask(x: number, y: number, size: number, rot: number, frame: number, alpha = 1) {
    if (this.count >= MAX_INST) return;
    const o = this.count * FLOATS;
    const d = this.data;
    d[o] = x;
    d[o + 1] = y;
    d[o + 2] = size;
    d[o + 3] = rot;
    d[o + 4] = frame;
    d[o + 5] = alpha;
    this.count++;
  }

  /** One colour sprite (coin, glint, ring); `size` = the cell's size in css px. */
  pushFx(x: number, y: number, size: number, rot: number, frame: number, alpha = 1) {
    if (this.fxCount >= MAX_INST) return;
    const o = this.fxCount * FLOATS;
    const d = this.fxData;
    d[o] = x;
    d[o + 1] = y;
    d[o + 2] = size;
    d[o + 3] = rot;
    d[o + 4] = frame;
    d[o + 5] = alpha;
    this.fxCount++;
  }

  static flapFrame(flap: number): number {
    const f = Math.round(((Math.max(-1, Math.min(1, flap)) + 1) / 2) * (FLAP_FRAMES - 1));
    return f;
  }

  private drawSprites(data: Float32Array, count: number, tex: WebGLTexture, color: boolean, grid: [number, number], origin: [number, number], spanFrac: number) {
    const gl = this.gl;
    gl.useProgram(this.sprite);
    gl.uniform2f(this.u.suRes!, this.w, this.h);
    gl.uniform2f(this.u.suGrid!, grid[0], grid[1]);
    gl.uniform2f(this.u.suOrigin!, origin[0], origin[1]);
    gl.uniform1f(this.u.suSpanFrac!, spanFrac);
    gl.uniform1f(this.u.suColor!, color ? 1 : 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(this.u.suTex!, 0);
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.inst);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data, 0, count * FLOATS);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
    gl.bindVertexArray(null);
  }

  private blurPass(src: WebGLTexture, dst: Target, dx: number, dy: number) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
    gl.viewport(0, 0, dst.w, dst.h);
    gl.disable(gl.BLEND);
    gl.useProgram(this.blur);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, src);
    gl.uniform1i(this.u.buTex!, 0);
    gl.uniform2f(this.u.buStep!, dx / dst.w, dy / dst.h);
    gl.uniform1fv(this.u.buW!, this.blurW);
    gl.uniform1fv(this.u.buO!, this.blurO);
    gl.uniform1i(this.u.buN!, this.blurN);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  render() {
    const gl = this.gl;
    const mask = this.mask!;
    const g1 = this.goo1!;
    const g2 = this.goo2!;
    const W = mask.w;
    const H = mask.h;
    // 1. Mask.
    gl.bindFramebuffer(gl.FRAMEBUFFER, mask.fb);
    gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (this.count > 0) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      this.drawSprites(this.data, this.count, this.atlas, false, [ATLAS_COLS, ATLAS_ROWS], [ORIGIN_X / CELL, ORIGIN_Y / CELL], ATLAS_SPAN / CELL);
    }
    // 2. Goo pass (half resolution).
    this.blurPass(mask.tex, g1, 1, 0);
    this.blurPass(g1.tex, g2, 0, 1);
    // 3. Field.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.BLEND);
    if (this.count > 0) {
      gl.useProgram(this.field);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, mask.tex);
      gl.uniform1i(this.u.fuMask!, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, g2.tex);
      gl.uniform1i(this.u.fuGoo!, 1);
      gl.uniform2f(this.u.fuRes!, this.w, this.h);
      gl.uniform1f(this.u.fuDpr!, this.dpr);
      this.setLookUniforms();
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    // 4. Coins, glints, rings.
    if (this.fxCount > 0) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      this.drawSprites(this.fxData, this.fxCount, this.fx, true, [FX_COLS, 1], [0.5, 0.5], 1);
    }
  }

  /** `GooBatSwarmRenderer.draw` colours per look. */
  private setLookUniforms() {
    const gl = this.gl;
    const { dark, thermal } = this.look;
    const u = this.u;
    const v3 = (loc: WebGLUniformLocation | null, c: [number, number, number]) => gl.uniform3f(loc, c[0], c[1], c[2]);
    const v4 = (loc: WebGLUniformLocation | null, c: [number, number, number], a: number) => gl.uniform4f(loc, c[0], c[1], c[2], a);
    if (thermal) {
      v3(u.fuBody!, PAL.red1);
      v4(u.fuGlow!, PAL.orange4, dark ? 0.75 : 0.55);
      v4(u.fuGlow2!, PAL.red4, 0.5);
      gl.uniform2f(u.fuGlowShift!, 0, 0);
      v3(u.fuRim0!, PAL.yellow7);
      v3(u.fuRim1!, PAL.yellow4);
      v3(u.fuRim2!, PAL.orange4);
      gl.uniform1f(u.fuRimStops!, 3);
      gl.uniform1f(u.fuRimA!, 1);
      gl.uniform1f(u.fuRimW!, 1.6);
      gl.uniform1f(u.fuHi!, 0);
    } else if (dark) {
      v3(u.fuBody!, PAL.black);
      v4(u.fuGlow!, PAL.purple4, 0.42);
      v4(u.fuGlow2!, PAL.black, 0);
      gl.uniform2f(u.fuGlowShift!, 0, 0);
      v3(u.fuRim0!, PAL.purple5);
      v3(u.fuRim1!, PAL.cyan4);
      v3(u.fuRim2!, PAL.cyan4);
      gl.uniform1f(u.fuRimStops!, 2);
      gl.uniform1f(u.fuRimA!, 0.85);
      gl.uniform1f(u.fuRimW!, 1.3);
      gl.uniform1f(u.fuHi!, 0);
    } else {
      v3(u.fuBody!, PAL.smoke2);
      v4(u.fuGlow!, PAL.paperInk, 0.22);
      v4(u.fuGlow2!, PAL.black, 0);
      gl.uniform2f(u.fuGlowShift!, 0, 3);
      v3(u.fuRim0!, PAL.white);
      v3(u.fuRim1!, PAL.smoke5);
      v3(u.fuRim2!, PAL.smoke5);
      gl.uniform1f(u.fuRimStops!, 2);
      gl.uniform1f(u.fuRimA!, 0.5);
      gl.uniform1f(u.fuRimW!, 1.1);
      gl.uniform1f(u.fuHi!, 0.35);
    }
  }

  dispose() {
    const gl = this.gl;
    for (const t of [this.mask, this.goo1, this.goo2]) {
      if (t) {
        gl.deleteFramebuffer(t.fb);
        gl.deleteTexture(t.tex);
      }
    }
    gl.deleteTexture(this.atlas);
    gl.deleteTexture(this.fx);
    gl.deleteBuffer(this.inst);
    gl.deleteProgram(this.sprite);
    gl.deleteProgram(this.blur);
    gl.deleteProgram(this.field);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

/** Atlas cell geometry (for the Canvas 2D fallback and tests). */
export const BAT_ATLAS = { CELL, ATLAS_SPAN, ORIGIN_X, ORIGIN_Y } as const;
