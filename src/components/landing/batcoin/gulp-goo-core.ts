/**
 * Gulp+ goo body pose (pure): one frame of the rest pill ↔ open bar melt.
 *
 * `o` 0 = rest pill, 1 = open bar. The bar grows out of the pill and thins mid-melt (volume-keeping, iOS `morphRect`
 * hump), the blue slides from the pill into the send bead (caret while typing, round Enter bead on a pause), the two
 * droplets orbit the pill and are swallowed, the + drop buds out of the bar's left end.
 * **Ported verbatim from (jokuh-live):** `frontend/src/components/gooey/goo-home/gulp-goo-core.ts`.
 * **Parity:** Sources/gooey/home-bar/goo-home-bar-gulp-plus.swift (`pose`, orbit droplets),
 * goo-home-bar-gulp-plus-parts.swift (`GooHomeBarGulpPlusLayout`: pill 160 × 60), landing
 * `day-story/gulp-plus.ts` (`gulpShapes`, same numbers).
 */

export const GULP_PILL_W = 160;
export const GULP_PILL_H = 60;

export type GulpBox = { cx: number; cy: number; w: number; h: number };
export type GulpGooPose = {
  bar: GulpBox;
  accent: GulpBox;
  plusR: number;
  plus: { cx: number; cy: number };
  drops: { x: number; y: number; r: number }[];
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export function gulpGooPose(input: {
  o: number;
  bar: GulpBox;
  send: { cx: number; cy: number };
  plus: { cx: number; cy: number };
  typing: boolean;
  breath: number;
  orbit: number;
}): GulpGooPose {
  const o = clamp01(input.o);
  const { bar } = input;
  const pillW = GULP_PILL_W * (1 + input.breath);
  const pillH = GULP_PILL_H * (1 + input.breath * 0.5);
  const thin = 1 - 0.16 * Math.sin(Math.PI * o);
  const barBox: GulpBox = {
    cx: bar.cx,
    cy: bar.cy,
    w: lerp(pillW * 0.6, bar.w, o),
    h: lerp(pillH * 0.6, bar.h, o) * thin,
  };
  const beadW = input.typing ? 14 : 36;
  const beadH = input.typing ? 42 : 36;
  const accent: GulpBox = {
    cx: lerp(bar.cx, input.send.cx, o),
    cy: lerp(bar.cy, input.send.cy, o),
    w: lerp(pillW, beadW, o),
    h: lerp(pillH, beadH, o),
  };
  const plusR = 15 * clamp01((o - 0.45) / 0.55);
  const drops = [0, 1].map(i => {
    const ang = input.orbit * (0.55 + i * 0.18) + i * Math.PI;
    const ex = pillW / 2 + 8 + 6 * Math.sin(input.orbit * 0.9 + i);
    const ey = pillH / 2 + 7;
    return { x: bar.cx + Math.cos(ang) * ex, y: bar.cy + Math.sin(ang) * ey, r: (5.5 + i * 1.5) * (1 - o) };
  });
  return { bar: barBox, accent, plusR, plus: input.plus, drops };
}
