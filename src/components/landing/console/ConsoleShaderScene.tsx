import { useEffect, useRef, useState } from "react";
import type { ConsoleShaderPalette } from "../../../data/console-home-products";

/**
 * **Purpose:** Generative full-bleed scene for console products without strong photography (OO, Arcade).
 * One tiny WebGL fragment shader, rendered at half resolution (the field is soft, so it upscales cleanly),
 * paused whenever the scene is not focused or the tab is hidden. Reduced motion renders one still frame.
 * Falls back to a CSS gradient (`.console-shader--fallback`) when WebGL is unavailable.
 * **Connects to:** `ConsoleScene`, `console-home-products.ts` (`ConsoleShaderPalette`), `landing-console-home.css`.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uLight;
uniform int uPalette;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

vec3 ooScene(vec2 uv, vec2 p, float t) {
  float aspect = uRes.x / uRes.y;
  // Quiet aurora field behind everything.
  vec2 q = vec2(fbm(p * 1.2 + vec2(0.0, t * 0.04)), fbm(p * 1.2 + vec2(5.2, -t * 0.03)));
  float f = fbm(p * 0.9 + 1.8 * q + vec2(t * 0.02, 0.0));
  vec3 col = vec3(0.006, 0.006, 0.016);
  col += vec3(0.08, 0.14, 0.52) * 0.42 * smoothstep(0.45, 0.95, f);
  col += vec3(0.38, 0.10, 0.72) * 0.30 * smoothstep(0.55, 1.0, q.x * f * 1.7);

  // OO's presence: a glass sphere with living colour inside, rim light and a soft bloom.
  vec2 c = aspect >= 1.0 ? vec2(aspect * 0.68, 0.54) : vec2(aspect * 0.5, 0.7);
  float R = (aspect >= 1.0 ? 0.24 : min(0.2, aspect * 0.32)) * (1.0 + 0.012 * sin(t * 0.8));
  vec2 d = (p - c) / R;
  float dist = length(d);
  col += vec3(0.42, 0.34, 1.0) * 0.32 * exp(-max(dist - 1.0, 0.0) * 2.6);
  col += vec3(0.85, 0.3, 0.75) * 0.06 * exp(-max(dist - 1.0, 0.0) * 1.2);
  if (dist < 1.02) {
    float z = sqrt(max(1.0 - dist * dist, 0.0));
    vec3 n = vec3(d, z);
    vec2 s = d / (1.0 + z) * 1.3;
    float m = fbm(s * 1.5 + vec2(t * 0.05, -t * 0.035) + 1.6 * fbm(s * 2.2 - t * 0.04));
    vec3 inner = mix(vec3(0.07, 0.03, 0.22), vec3(0.30, 0.30, 0.95), smoothstep(0.32, 0.78, m));
    inner = mix(inner, vec3(0.86, 0.40, 0.92), smoothstep(0.6, 0.88, m) * 0.55);
    inner *= 0.30 + 0.70 * z;
    // Glass: bright rim, a caustic pooling opposite the key light, one tight specular.
    float rim = pow(1.0 - z, 2.6);
    inner += vec3(0.72, 0.66, 1.0) * rim * 1.05;
    float caustic = pow(max(dot(n, normalize(vec3(0.38, -0.55, 0.62))), 0.0), 7.0);
    inner += vec3(0.95, 0.45, 0.85) * caustic * 0.32;
    float spec = pow(max(dot(n, normalize(vec3(-0.42, 0.55, 0.72))), 0.0), 140.0);
    inner += vec3(1.0) * spec * 0.85;
    float edge = 1.0 - smoothstep(1.0 - 2.0 / (uRes.y * R), 1.0, dist);
    col = mix(col, inner, edge);
  }
  return col;
}

vec3 arcadeScene(vec2 uv, vec2 p, float t) {
  // Ember horizon glow with a fine perspective grid floor rolling toward the viewer.
  float aspect = uRes.x / uRes.y;
  float horizon = 0.44;
  vec3 col = mix(vec3(0.30, 0.07, 0.015), vec3(0.015, 0.006, 0.004), smoothstep(horizon, 0.95, uv.y));
  float haze = fbm(vec2(p.x * 1.4 + t * 0.02, uv.y * 3.0));
  col += vec3(0.9, 0.3, 0.05) * 0.10 * haze * smoothstep(0.9, horizon, uv.y);
  // Low sun, half-set, soft-edged.
  vec2 sc = vec2(aspect >= 1.0 ? aspect * 0.68 : aspect * 0.5, horizon + 0.01);
  float sd = length(p - sc);
  float sunR = 0.085;
  vec3 sunCol = mix(vec3(0.95, 0.30, 0.06), vec3(1.0, 0.66, 0.24), smoothstep(horizon, horizon + sunR, uv.y));
  col = mix(col, sunCol, 0.85 * (1.0 - smoothstep(sunR - 0.003, sunR + 0.003, sd)) * step(horizon, uv.y));
  col += vec3(1.0, 0.34, 0.05) * 0.32 * exp(-sd * 6.0);
  // Horizon line glow.
  col += vec3(1.0, 0.42, 0.08) * 0.35 * exp(-abs(uv.y - horizon) * 90.0);
  if (uv.y < horizon) {
    float depth = horizon - uv.y;
    float z = 0.5 / max(depth, 0.0005);
    vec2 g = vec2((p.x - sc.x) * z * 8.0, z + t * 0.9);
    // Analytic AA (WebGL1 has no fwidth): the grid's pixel footprint grows with depth.
    vec2 w = vec2(8.0 * z, 2.0 * z * z) * 1.0 / uRes.y;
    vec2 dl = abs(fract(g + 0.5) - 0.5);
    vec2 lines = (1.0 - smoothstep(w * 0.5, w * 1.5, dl)) * (1.0 - smoothstep(0.05, 0.2, w));
    lines *= smoothstep(0.0, 0.06, depth);
    float line = max(lines.x, lines.y);
    col = mix(vec3(0.03, 0.008, 0.003), col, 0.1);
    col += vec3(1.0, 0.40, 0.07) * line * 0.75 * exp(-z * 0.035);
    col += vec3(0.85, 0.24, 0.03) * 0.22 * exp(-depth * 10.0);
    // Sun reflection streak on the floor.
    col += vec3(1.0, 0.45, 0.1) * 0.18 * exp(-abs(p.x - sc.x) * 9.0) * exp(-depth * 4.0);
  }
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv * vec2(uRes.x / uRes.y, 1.0);
  float t = uTime;
  vec3 col = uPalette == 0 ? ooScene(uv, p, t) : arcadeScene(uv, p, t);
  // Light theme: the scene becomes ink on paper. Dark field → paper, emissive colour keeps its hue, so the orb
  // reads as a glass bubble with a coloured rim and the arcade as an ember sketch on a pale horizon.
  vec3 paper = vec3(0.962, 0.962, 0.968);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 ink = col / max(max(col.r, max(col.g, col.b)), 0.001) * 0.78;
  vec3 lightCol = mix(paper, mix(col * 1.2 + 0.06, ink, 0.55), smoothstep(0.03, 0.32, lum));
  col = mix(col, lightCol, uLight);
  // Film grain keeps gradients from banding.
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) * 0.018;
  gl_FragColor = vec4(col, 1.0);
}
`;

const RENDER_SCALE = 0.5;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) console.warn("[console-shader]", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ConsoleShaderScene({
  palette,
  active,
  reduceMotion,
  light,
}: {
  palette: ConsoleShaderPalette;
  /** Only the focused scene animates. */
  active: boolean;
  reduceMotion: boolean;
  light: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const stateRef = useRef({ active, reduceMotion, light });
  stateRef.current = { active, reduceMotion, light };
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      setFailed(true);
      return;
    }
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      setFailed(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uLight = gl.getUniformLocation(program, "uLight");
    const uPalette = gl.getUniformLocation(program, "uPalette");
    gl.uniform1i(uPalette, palette === "oo" ? 0 : 1);

    let raf = 0;
    let disposed = false;
    // Seeded start so the still frame (reduced motion) is a composed moment, not t=0.
    let clock = 14;
    let last = performance.now();

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * RENDER_SCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight * RENDER_SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = () => {
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, clock);
      gl.uniform1f(uLight, stateRef.current.light ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed) return;
      const { active: isActive, reduceMotion: still } = stateRef.current;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!still) clock += dt;
      draw();
      if (isActive && !still && document.visibilityState === "visible") {
        raf = requestAnimationFrame(frame);
      }
    };

    const kick = () => {
      if (raf || disposed) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    kickRef.current = kick;

    const observer = new ResizeObserver(() => kick());
    observer.observe(canvas);
    const onVisibility = () => kick();
    document.addEventListener("visibilitychange", onVisibility);
    kick();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [palette]);

  // Resume / repaint when focus, motion preference or theme changes.
  useEffect(() => {
    kickRef.current();
  }, [active, reduceMotion, light]);

  if (failed) {
    return <div className={`console-shader console-shader--fallback console-shader--${palette}`} aria-hidden />;
  }

  return <canvas ref={canvasRef} className={`console-shader console-shader--${palette}`} aria-hidden />;
}
