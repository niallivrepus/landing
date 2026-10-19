/**
 * **Purpose:** The goo maths the Gooey homepage needs, ported verbatim from the app's web goo kit so the landing
 * draws the same Splex goo as the real Gooey environment: filter numbers, the Splex material per scheme, springs,
 * the corner-pill lean, the Glyph mark's ripple and its glyph cells.
 * Pure (no React, no DOM except the one-off mask raster in `buildGlyphLogoCells`).
 * **Ported from (jokuh-live, keep in sync):** `frontend/src/components/gooey/goo-env/goo-kit.ts` (gooParams,
 * gooMatrix, materialSpec 'splex', splexLightSpec, roleColor, inkOn, viscositySpring, springStep, stretchToward),
 * `goo-env/goo-env-core.ts` (house knobs 55/50/35, cornerLean, cornerRotation),
 * `gooey-labs/goo-lab-home-state.ts` (rippleAt, rippleFrontPassing),
 * `home/HomeGlyphLogo.tsx` + `home/HomeHologramLogo.tsx` (Glyph mark cells, hash, charset). The Glyph mark is frozen:
 * same grid, hash, rates and alphabet as the app; never restyle it here.
 */
import { LOGO_GLOB_PATH_D } from "../HomeLogoGlobGlass";

export type GooScheme = "dark" | "light";
export type GooRole = "base" | "knob" | "accent" | "danger" | "go";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

/* ── Springs ── */

export type Spring = { x: number; v: number };
export type SpringParams = { stiffness: number; damping: number; mass: number };
const MAX_SUBSTEP = 1 / 120;
export const MAX_FRAME_DT = 0.064;

export function springStep(s: Spring, target: number, p: SpringParams, dt: number): Spring {
  let x = s.x;
  let v = s.v;
  let left = Math.min(Math.max(dt, 0), MAX_FRAME_DT);
  while (left > 1e-9) {
    const h = Math.min(MAX_SUBSTEP, left);
    const a = (-p.stiffness * (x - target) - p.damping * v) / p.mass;
    v += a * h;
    x += v * h;
    left -= h;
  }
  return { x, v };
}

export function springSettled(s: Spring, target: number, eps = 0.004): boolean {
  return Math.abs(s.x - target) < eps && Math.abs(s.v) < eps * 12;
}

export function viscositySpring(viscosity: number): SpringParams {
  const t = clamp01(viscosity / 100);
  const stiffness = lerp(560, 120, t);
  const zeta = lerp(0.32, 0.92, t);
  return { stiffness: round(stiffness, 1), damping: round(2 * zeta * Math.sqrt(stiffness), 2), mass: 1 };
}

/* ── Goo filter numbers (house knobs: goo 55, edge 50, viscosity 35) ── */

export type GooParams = { blur: number; k: number; t: number };

export function gooParams(goo: number, edge: number): GooParams {
  const blur = round(1.5 + clamp01(goo / 100) * 10.5, 1);
  const k = round(10 + clamp01(edge / 100) * 30, 1);
  return { blur, k, t: round(k * 0.45, 1) };
}

export function gooMatrix(p: GooParams): string {
  return `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${p.k} ${-p.t}`;
}

export const GOO_ENV_PARAMS = gooParams(55, 50);
export const GOO_ENV_SPRING = viscositySpring(35);

/* ── Splex material ── */

type Layer = { dy: number; blur: number; color: string; a: number };
export type MaterialSpec = {
  rim: { w: number; color: string; a: number };
  rimOut: { w: number; color: string; a: number } | null;
  hi: Layer;
  hi2: Layer | null;
  shade: Layer | null;
  gradient: Layer | null;
  drop: Layer;
  contact: Layer | null;
  caustic: { dy: number; blur: number; alphaRow: string } | null;
  spec: { a: number; exponent: number; surface: number; elevation: number } | null;
  alphaRow: string;
};

const SPLEX_GLASS_K = 0.24;
const SPLEX_LIGHT_BODY = { k: 0.16, offset: 0.3 } as const;
const SPLEX_LIGHT_CAUSTIC_K = 0.12;
export const PAPER_INK = "#3c2d14";

function splexLightSpec(): MaterialSpec {
  const K = SPLEX_LIGHT_BODY.k;
  const C = SPLEX_LIGHT_CAUSTIC_K;
  return {
    rim: { w: 1, color: "#ffffff", a: 0.85 },
    rimOut: { w: 1, color: PAPER_INK, a: 0.2 },
    hi: { dy: 2.5, blur: 1.2, color: "#ffffff", a: 1 },
    hi2: { dy: 1, blur: 0.4, color: "#ffffff", a: 0.9 },
    shade: { dy: -3, blur: 2, color: PAPER_INK, a: 0.16 },
    gradient: { dy: -14, blur: 10, color: "#8a7a60", a: 0.14 },
    drop: { dy: 9, blur: 8, color: "#5b4526", a: 0.2 },
    contact: { dy: 1.5, blur: 1.2, color: "#2a2014", a: 0.22 },
    caustic: { dy: 7, blur: 6, alphaRow: `${-C} ${-C} ${-C} 0 ${round(3 * C, 3)}` },
    spec: { a: 0.55, exponent: 26, surface: 3, elevation: 58 },
    alphaRow: `${K} ${K} ${K} 0 ${SPLEX_LIGHT_BODY.offset}`,
  };
}

/** Splex goo material: dark = the emoji splex `filter0_dii` numbers; light = the designed Gooey Light glass. */
export function splexSpec(scheme: GooScheme): MaterialSpec {
  if (scheme === "light") return splexLightSpec();
  return {
    rimOut: null,
    gradient: null,
    contact: null,
    caustic: null,
    rim: { w: 2, color: "#ffffff", a: 0.2 },
    hi: { dy: 2, blur: 1.5, color: "#ffffff", a: 0.15 },
    hi2: { dy: 1, blur: 0.5, color: "#ffffff", a: 0.15 },
    shade: null,
    drop: { dy: 10, blur: 5, color: "#000000", a: 0.05 },
    spec: null,
    alphaRow: `${-SPLEX_GLASS_K} ${-SPLEX_GLASS_K} ${-SPLEX_GLASS_K} 0 ${round(0.05 + 3 * SPLEX_GLASS_K, 3)}`,
  };
}

const BLUE = "#2c81ff";
const RED = "#ff2a1f";
const GREEN = "#21dc11";

export function roleColor(scheme: GooScheme, role: GooRole): string {
  if (role === "accent") return BLUE;
  if (role === "danger") return RED;
  if (role === "go") return GREEN;
  if (scheme === "dark") return role === "knob" ? "#bdbdbd" : "#ffffff";
  return role === "knob" ? "#ebe7df" : "#ffffff";
}

export function inkOn(scheme: GooScheme, role: GooRole): string {
  if (scheme === "dark") return "#ffffff";
  return role === "accent" ? "#0a46c2" : role === "danger" ? "#b0140c" : role === "go" ? "#11690a" : "#000000";
}

/* ── Corner pills ── */

export type CornerQuad = "topLeading" | "topTrailing" | "bottomLeading" | "bottomTrailing";

export function cornerRotation(q: CornerQuad): number {
  switch (q) {
    case "topLeading":
      return -45;
    case "topTrailing":
      return -135;
    case "bottomLeading":
      return 45;
    case "bottomTrailing":
      return 135;
  }
}

export function stretchToward(ax: number, ay: number, px: number, py: number, reach: number, radius: number) {
  const dx = px - ax;
  const dy = py - ay;
  const d = Math.hypot(dx, dy);
  if (d < 1e-6 || d > radius) return { x: ax, y: ay, pull: 0 };
  const pull = 1 - d / radius;
  const len = Math.min(reach, d * 0.55) * (0.35 + 0.65 * pull);
  return { x: ax + (dx / d) * len, y: ay + (dy / d) * len, pull };
}

export const CORNER_REACH_REST_R = 15;
export type CornerLean = { rx: number; ry: number; rr: number; ox: number; oy: number };

/** Hover: reach 46 within 150 px (app `cornerLean`, `grab` = false). */
export function cornerLean(cx: number, cy: number, px: number, py: number): CornerLean {
  const s = stretchToward(cx, cy, px, py, 46, 150);
  const d = Math.hypot(s.x - cx, s.y - cy);
  if (s.pull <= 0) return { rx: cx, ry: cy, rr: CORNER_REACH_REST_R, ox: 0, oy: 0 };
  const drift = Math.min(6, d * 0.12) / Math.max(1, d);
  return { rx: s.x, ry: s.y, rr: Math.max(8, 17 - d * 0.1), ox: (s.x - cx) * drift, oy: (s.y - cy) * drift };
}

/* ── Glyph mark ripple (app `rippleAt` / `rippleFrontPassing`) ── */

export function rippleAt(d: number, t: number, amp = 7, speed = 210, wl = 34, decay = 1.4, width = 46): number {
  if (t <= 0) return 0;
  const behind = speed * t - d;
  if (behind < 0 || behind > width) return 0;
  const env = Math.sin((behind / width) * Math.PI);
  return amp * env * Math.exp(-decay * t) * Math.cos((behind / wl) * Math.PI * 2);
}

export function rippleFrontPassing(d: number, t: number, speed = 210, band = 8): boolean {
  return t > 0 && Math.abs(speed * t - d) <= band;
}

/* ── Glyph mark cells (app `HomeGlyphLogo.tsx`, frozen) ── */

export const GLYPH_LOGO_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=<>/?$@";
export const GLYPH_LOGO_COLUMNS = 40;
export const GLYPH_LOGO_ROWS = 14;
const MASK_W = 172;
const MASK_H = 77;

export type GlyphLogoCell = { col: number; row: number; depth: number; rate: number; offset: number; seed: number };

export function hologramParticleHash(index: number): number {
  let n = index >>> 0;
  n = (Math.imul(n, 747796405) + 2891336453) >>> 0;
  const shift = (n >>> 28) + 4;
  n = Math.imul((n >>> shift) ^ n, 277803737) >>> 0;
  n = ((n >>> 22) ^ n) >>> 0;
  return n / 4294967295;
}

let cachedCells: GlyphLogoCell[] | null = null;

export function buildGlyphLogoCells(): GlyphLogoCell[] {
  if (cachedCells) return cachedCells;
  if (typeof document === "undefined") return [];
  const cols = GLYPH_LOGO_COLUMNS;
  const rows = GLYPH_LOGO_ROWS;
  const sub = 4;
  const canvas = document.createElement("canvas");
  canvas.width = cols * sub;
  canvas.height = rows * sub;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return (cachedCells = []);
  ctx.setTransform((cols * sub) / MASK_W, 0, 0, (rows * sub) / MASK_H, 0, 0);
  ctx.fillStyle = "#fff";
  ctx.fill(new Path2D(LOGO_GLOB_PATH_D), "evenodd");
  const data = ctx.getImageData(0, 0, cols * sub, rows * sub).data;
  const filled = new Array<boolean>(cols * rows).fill(false);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let hits = 0;
      for (let y = 0; y < sub; y++) {
        for (let x = 0; x < sub; x++) {
          if (data[((r * sub + y) * cols * sub + c * sub + x) * 4 + 3]! > 127) hits++;
        }
      }
      filled[r * cols + c] = hits >= (sub * sub) / 2;
    }
  }
  cachedCells = cellsFromMask(filled, cols, rows);
  return cachedCells;
}

function cellsFromMask(filled: boolean[], cols: number, rows: number): GlyphLogoCell[] {
  const dist = filled.map((f) => (f ? Number.POSITIVE_INFINITY : 0));
  const at = (c: number, r: number) => (c < 0 || r < 0 || c >= cols || r >= rows ? 0 : dist[r * cols + c]!);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (dist[i]! > 0) dist[i] = Math.min(dist[i]!, at(c - 1, r) + 1, at(c, r - 1) + 1);
    }
  for (let r = rows - 1; r >= 0; r--)
    for (let c = cols - 1; c >= 0; c--) {
      const i = r * cols + c;
      if (dist[i]! > 0) dist[i] = Math.min(dist[i]!, at(c + 1, r) + 1, at(c, r + 1) + 1);
    }
  let maxDist = 1;
  for (const d of dist) if (Number.isFinite(d) && d > maxDist) maxDist = d;
  const out: GlyphLogoCell[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (!filled[i]) continue;
      const depth = Math.min(1, (dist[i]! - 1) / Math.max(1, maxDist - 1));
      const keep = 0.42 + 0.58 * Math.pow(depth, 0.55);
      if (hologramParticleHash(i * 3 + 1) > keep) continue;
      const speed = hologramParticleHash(i * 3 + 2);
      out.push({
        col: c,
        row: r,
        depth,
        rate: 0.35 + Math.pow(speed, 3) * 7,
        offset: hologramParticleHash(i * 5 + 11) * 10,
        seed: i,
      });
    }
  return out;
}

export function glyphLogoIndex(cell: GlyphLogoCell, time: number): number {
  const tick = Math.floor(time * cell.rate + cell.offset);
  return (
    Math.floor(hologramParticleHash(cell.seed * 977 + tick * 131) * GLYPH_LOGO_CHARSET.length) % GLYPH_LOGO_CHARSET.length
  );
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}
