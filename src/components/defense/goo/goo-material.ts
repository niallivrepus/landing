/**
 * **Purpose:** The house goo material for `/defense`, ported verbatim from the app's goo kit so the page's beads are
 * the same Splex glass as the product: the goo threshold numbers, the dark Splex (`filter0_dii`) and the designed
 * Gooey Light Splex, plus the spring the kit uses. Pure (no React, no DOM).
 * **Connects to:** `GooMaterialFilter.tsx` (renders the spec), `goo-physics.ts` (springs), every goo stage.
 * **Parity:** `frontend/src/components/gooey/goo-env/goo-kit.ts` in jokuh-live (`gooParams`, `materialSpec('splex')`,
 * `splexLightSpec`, `viscositySpring`); keep the numbers in step with it.
 */

export type GooParams = { blur: number; k: number; t: number };
export type GooScheme = "dark" | "light";
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

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Goo 0…100 (how far blobs reach) + edge 0…100 (how crisp) → filter numbers. Kit verbatim. */
export function gooParams(goo: number, edge: number): GooParams {
  const blur = round(1.5 + clamp01(goo / 100) * 10.5, 1);
  const k = round(10 + clamp01(edge / 100) * 30, 1);
  return { blur, k, t: round(k * 0.45, 1) };
}

export function gooMatrix(p: GooParams): string {
  return `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${p.k} ${-p.t}`;
}

const SPLEX_GLASS_K = 0.24;
const PAPER_INK = "#3c2d14";

/** The emoji Splex `filter0_dii` (dark) and the designed Gooey Light Splex. Kit verbatim. */
export function splexSpec(scheme: GooScheme): MaterialSpec {
  if (scheme === "light") {
    const K = 0.16;
    const C = 0.12;
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
      alphaRow: `${K} ${K} ${K} 0 0.3`,
    };
  }
  return {
    rim: { w: 2, color: "#ffffff", a: 0.2 },
    rimOut: null,
    hi: { dy: 2, blur: 1.5, color: "#ffffff", a: 0.15 },
    hi2: { dy: 1, blur: 0.5, color: "#ffffff", a: 0.15 },
    shade: null,
    gradient: null,
    drop: { dy: 10, blur: 5, color: "#000000", a: 0.05 },
    contact: null,
    caustic: null,
    spec: null,
    alphaRow: `${-SPLEX_GLASS_K} ${-SPLEX_GLASS_K} ${-SPLEX_GLASS_K} 0 ${round(0.05 + 3 * SPLEX_GLASS_K, 3)}`,
  };
}

export type SpringParams = { stiffness: number; damping: number; mass: number };

/** Viscosity 0…100 → spring (0 = water, 100 = honey). Kit verbatim. */
export function viscositySpring(viscosity: number): SpringParams {
  const t = clamp01(viscosity / 100);
  const stiffness = lerp(560, 120, t);
  const zeta = lerp(0.32, 0.92, t);
  return { stiffness: round(stiffness, 1), damping: round(2 * zeta * Math.sqrt(stiffness), 2), mass: 1 };
}

export function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255].map((v) => Math.round(v * 1000) / 1000) as [
    number,
    number,
    number,
  ];
}
