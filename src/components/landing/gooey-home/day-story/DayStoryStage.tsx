import { forwardRef, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { JokuhOO } from "../../../brand/JokuhOO";
import { CORNER_PILLS } from "../GooCornerFrame";
import { GooFilter } from "../GooFilter";
import { GooGlyphMark } from "../GooGlyphMark";
import { openGetJokuh } from "../GetJokuh";
import { babyOOLook, SwarmIconSvg } from "../GooHeroSwarm";
import { cornerRotation, GOO_ENV_PARAMS, roleColor, splexSpec, type CornerQuad, type GooScheme } from "../goo-kit";
import type { BabyLook, SwarmIcon } from "../oo-swarm-model";
import { paintHeat } from "./blurb-heat-rim";
import { DAY_BEAT_COUNT, DAY_STARTS, DB, dayBeatAt } from "./day-story-beats";
import { backOut, beatEnd, clamp01, easeOut, Face, FACE, I, IC, Icon, lerp, N, parseItems, paintItem, T } from "./day-story-engine";
import DayStoryOrb, { DAY_ORB_ELLIPSE, type DayStoryOrbHandle } from "./DayStoryOrb";
import "../../../../styles/day-story.css";

/**
 * **Purpose:** The "day in the life" stage: a 390 × 720 center column (scaled to fit by its host) inside the real app
 * shell, played as a pure function of time from `day-story-beats.ts`. The morning happens in the **desktop** app (a
 * wide window: the column in the middle, the four goo corner pills in the window's corners, the Nexus on top); at
 * "Heading out" the window squeezes into a **phone** and the rest of the day plays on mobile. The corner pills (ID,
 * Spine, Call, Text, at their real diagonal angles) are on screen in every app beat and press when a beat starts from
 * them; on Blurbs they become the feed's Reblurb / Close / Fire / Ice corners, as in the app.
 * **Goo:** the column's sheet is one Splex body (`A`) that morphs beat to beat, with `P` budding off it (plinth, OO
 * sheet, caption bud, answer card); an inner layer holds the Spine cord, profile pods, the call's Splex toolbar,
 * OOpolis, Blurbs arches and drips; each corner pill and the Nexus have their own small goo layer (so a press repaints
 * only that corner). Every goo shape is a continuous-corner squircle rewritten only while it moves.
 * **API:** `seek(t)` paints second `t`; no loop of its own (the player drives it from one rAF, the scroll section from
 * scroll). HTML is timed in JSX (`day-story-engine.tsx`) and written as transform / opacity / visibility only.
 * **Rules:** real OO art only; the Glyph mark is the frozen `GooGlyphMark` (placed and faded only); the Orb is the
 * app's goo Orb geometry (`DayStoryOrb`); the Blurbs heat rim is the app's painter (`blurb-heat-rim.ts`); the call
 * screens follow the app's call field (`call-field/`: incoming Nexus card, floating squircles, Splex toolbar,
 * transcript bubbles). Faces / photos are demo images (`public/day-story/`). Decorative except the finale's button.
 * **Connects to:** `DayStoryPlayer` (auto-play over the hero), `DayStoryScroll` (scroll-scrubbed section).
 */

export type DayStoryHandle = { seek: (t: number) => void };

const W = 390;
const H = 720;

/* ── Squircle goo bodies ── */

type Rect = [x: number, y: number, w: number, h: number, r: number];
const ZERO: Rect = [0, 0, 0, 0, 0];

/** A continuous-corner (iOS-style) squircle: longer corner run, control points pulled toward the corner. */
function squircle(r: Rect): string {
  const [x, y, w, h, rad] = r;
  if (w < 0.5 || h < 0.5) return "M0 0Z";
  const a = Math.min(rad * 1.28, w / 2, h / 2);
  const c = a * 0.22;
  const R = x + w;
  const B = y + h;
  const f = (n: number) => n.toFixed(1);
  return (
    `M${f(x + a)} ${f(y)}H${f(R - a)}C${f(R - c)} ${f(y)} ${f(R)} ${f(y + c)} ${f(R)} ${f(y + a)}` +
    `V${f(B - a)}C${f(R)} ${f(B - c)} ${f(R - c)} ${f(B)} ${f(R - a)} ${f(B)}` +
    `H${f(x + a)}C${f(x + c)} ${f(B)} ${f(x)} ${f(B - c)} ${f(x)} ${f(B - a)}` +
    `V${f(y + a)}C${f(x)} ${f(y + c)} ${f(x + c)} ${f(y)} ${f(x + a)} ${f(y)}Z`
  );
}

const mixRect = (p: Rect, q: Rect, k: number): Rect => [lerp(p[0], q[0], k), lerp(p[1], q[1], k), lerp(p[2], q[2], k), lerp(p[3], q[3], k), lerp(p[4], q[4], k)];
const centerOf = (r: Rect): Rect => [r[0] + r[2] / 2, r[1] + r[3] / 2, 0, 0, 0];
const local = (t: number) => {
  const i = dayBeatAt(t);
  return { i, u: t - DAY_STARTS[i]! };
};

/* ── The shell: desktop window → phone ── */

const MOBILE_AT = DB.mobile!;
const desktopRect = (ext: number): Rect => [-ext, -30, W + 2 * ext, H + 60, 28];
const PHONE: Rect = [-14, -18, W + 28, H + 36, 60];

/** 0 = desktop window, 1 = phone (the squeeze plays inside the "Heading out" beat). */
function mobileK(t: number): number {
  const s = DAY_STARTS[MOBILE_AT]!;
  if (t < s + 0.5) return 0;
  return backOut(clamp01((t - s - 0.5) / 1.2));
}
const shellRect = (t: number, ext: number): Rect => mixRect(desktopRect(ext), PHONE, mobileK(t));

const QUADS: CornerQuad[] = ["topLeading", "topTrailing", "bottomLeading", "bottomTrailing"];
const CORNER_INSET = 40;
function cornerAt(r: Rect, q: CornerQuad): { x: number; y: number } {
  const left = q === "topLeading" || q === "bottomLeading";
  const top = q === "topLeading" || q === "topTrailing";
  return { x: left ? r[0] + CORNER_INSET : r[0] + r[2] - CORNER_INSET, y: top ? r[1] + CORNER_INSET : r[1] + r[3] - CORNER_INSET };
}
/** Beats that start from a corner: that pill presses as the beat begins. */
const PRESSES: { beat: number; quad: CornerQuad; at: number }[] = [
  { beat: DB.call!, quad: "bottomLeading", at: 2.7 },
  { beat: DB.spine!, quad: "topTrailing", at: 0.05 },
  { beat: DB.profile!, quad: "topLeading", at: 0.05 },
  { beat: DB.dm!, quad: "bottomTrailing", at: 0.05 },
  { beat: DB.meet!, quad: "bottomTrailing", at: 0.05 },
  { beat: DB.fold!, quad: "topTrailing", at: 0.05 },
];
function pressAt(t: number, q: CornerQuad): number {
  let k = 0;
  for (const p of PRESSES) {
    if (p.quad !== q) continue;
    const d = t - (DAY_STARTS[p.beat]! + p.at);
    if (d >= 0 && d < 1.2) k = Math.max(k, Math.exp(-d * 4) * (d < 0.12 ? d / 0.12 : 1));
  }
  return k;
}

/* ── Column bodies ── */

/** The app's center column: every sheet in the story is this squircle. */
const S: Rect = [10, 8, 370, 704, 54];
const ORB_R: Rect = [DAY_ORB_ELLIPSE.cx - DAY_ORB_ELLIPSE.rx, DAY_ORB_ELLIPSE.cy - DAY_ORB_ELLIPSE.ry, DAY_ORB_ELLIPSE.rx * 2, DAY_ORB_ELLIPSE.ry * 2, DAY_ORB_ELLIPSE.ry];
const PORTRAIT_M: Rect = [66, 92, 258, 270, 52];
const PORTRAIT_W: Rect = [64, 92, 262, 300, 54];
const CARD: Rect = [52, 190, 286, 286, 40];

/** Body A per beat (portrait swaps for the wide desktop profile). */
function keyA(i: number, wide: boolean): Rect {
  switch (i) {
    case DB.profile:
      return wide ? PORTRAIT_W : PORTRAIT_M;
    case DB.ask:
      return [24, 642, 342, 56, 28];
    case DB.agents:
      return [150, 262, 90, 90, 45];
    case DB.blurb:
      return CARD;
    case DB.orb:
      return ORB_R;
    case DB.finale:
      return [182, 286, 26, 26, 13];
    default:
      return S;
  }
}
function keyP(i: number, wide: boolean): Rect | null {
  switch (i) {
    case DB.profile:
      return wide ? [122, 384, 146, 42, 21] : [122, 346, 146, 44, 22];
    case DB.ask:
      return [10, 36, 370, 590, 54];
    case DB.agents:
      return [36, 540, 318, 128, 34];
    case DB.blurb:
      return [70, 490, 250, 80, 30];
    default:
      return null;
  }
}
const MORPH = 0.9;

function bodyA(t: number, wide: boolean): Rect {
  const { i, u } = local(t);
  if (i === 0) return S;
  return mixRect(keyA(i - 1, wide), keyA(i, wide), backOut(clamp01(u / MORPH)));
}
function bodyP(t: number, a: Rect, wide: boolean): Rect {
  const { i, u } = local(t);
  const prev = i > 0 ? keyP(i - 1, wide) : null;
  const next = keyP(i, wide);
  if (!prev && !next) return centerOf(a);
  const k = next ? backOut(clamp01((u - 0.3) / MORPH)) : easeOut(clamp01(u / (MORPH * 0.8)));
  return mixRect(prev ?? centerOf(a), next ?? centerOf(a), k);
}

/** The Nexus: idle pill; opens into the incoming-call card; the call pill while you talk; the Orb's island. */
const NEX_IDLE: Rect = [155, 18, 80, 30, 15];
const NEX_CARD: Rect = [45, 14, 300, 176, 44];
const NEX_CALL: Rect = [120, 16, 150, 34, 17];
const NEX_LIVE: Rect = [105, 16, 180, 34, 17];
function bodyN(t: number): Rect {
  const { i, u } = local(t);
  if (i === DB.call) {
    if (u < 3.1) {
      const r = mixRect(NEX_IDLE, NEX_CARD, backOut(clamp01((u - 0.3) / 0.8)));
      const ring = (s: number) => (u > s ? Math.sin((u - s) * 20) * 5 * Math.exp(-(u - s) * 3) : 0);
      const wob = ring(1.2) + ring(2.0);
      return [r[0] - wob / 2, r[1], r[2] + wob, r[3] - wob / 3, r[4]];
    }
    return mixRect(NEX_CARD, NEX_CALL, backOut(clamp01((u - 3.1) / 0.5)));
  }
  if (i === DB.transcript) return NEX_CALL;
  if (i === DB.spine) return mixRect(NEX_CALL, NEX_IDLE, backOut(clamp01(u / 0.6)));
  if (i === DB.orb) return mixRect(NEX_IDLE, NEX_LIVE, backOut(clamp01(u / 0.6)));
  if (i === DB.fold) return mixRect(NEX_LIVE, NEX_IDLE, backOut(clamp01(u / 0.6)));
  if (i === DB.finale) return mixRect(NEX_IDLE, [195, 33, 0, 0, 0], easeOut(clamp01((u - 0.4) / 0.6)));
  return NEX_IDLE;
}

/** Body B (inner layer: the Spine cord) per beat, with an optional delay into the beat. */
const KB: ({ r: Rect; at?: number } | null)[] = [];
KB[DB.spine!] = { r: [84, 112, 10, 576, 5] };
KB[DB.id!] = { r: [84, 112, 10, 576, 5] };
KB[DB.meet!] = { r: [84, 112, 10, 576, 5], at: 1.8 };
KB[DB.fold!] = { r: [84, 100, 10, 590, 5] };

function bodyB(t: number): Rect {
  const { i, u } = local(t);
  const prev = i > 0 ? KB[i - 1] ?? null : null;
  const next = KB[i] ?? null;
  const flat = (r: Rect): Rect => [r[0], r[1] + r[3] / 2, r[2], 0, r[4]];
  if (!prev && !next) return ZERO;
  if (next) return mixRect(prev && !next.at ? prev.r : flat(next.r), next.r, easeOut(clamp01((u - (next.at ?? 0)) / 0.7)));
  return mixRect(prev!.r, flat(prev!.r), easeOut(clamp01(u / 0.5)));
}

/** Inner goo rects (profile pods, OOpolis buildings): snap in with their HTML, melt out at the end of `e`. */
type GooRect = { b: number; e?: number; a: number; x: number; y: number; w: number; h: number; r: number; dx?: number; dy?: number };

type Pod = { key: string; a: number; dx: number; dy: number; m: [number, number, number, number]; w: [number, number, number, number] };
/** Pods: `m` = phone bento below the portrait; `w` = wide desktop bento around it (the web app's desktop ID). */
const PODS: Pod[] = [
  { key: "gallery", a: 0.6, dx: -60, dy: -30, m: [26, 410, 108, 92], w: [-152, 92, 136, 136] },
  { key: "music", a: 0.75, dx: -60, dy: 0, m: [141, 410, 108, 92], w: [-152, 240, 136, 136] },
  { key: "location", a: 0.9, dx: -60, dy: 30, m: [256, 410, 108, 92], w: [-152, 388, 136, 136] },
  { key: "spine", a: 1.05, dx: 60, dy: -30, m: [26, 510, 108, 92], w: [406, 92, 136, 136] },
  { key: "bubble", a: 1.2, dx: 60, dy: 0, m: [141, 510, 108, 92], w: [406, 240, 136, 136] },
  { key: "contact", a: 1.35, dx: 60, dy: 30, m: [256, 510, 108, 92], w: [406, 388, 136, 136] },
  { key: "blurbs", a: 1.5, dx: 0, dy: 40, m: [26, 610, 338, 42], w: [40, 446, 310, 46] },
];
const podBox = (p: Pod, wide: boolean) => (wide ? p.w : p.m);

const BUILDINGS: GooRect[] = [
  { b: DB.agents!, a: 0.3, x: 36, y: 136, w: 100, h: 74, r: 22, dx: -30 },
  { b: DB.agents!, a: 0.4, x: 254, y: 136, w: 100, h: 74, r: 22, dx: 30 },
  { b: DB.agents!, a: 0.5, x: 36, y: 404, w: 100, h: 74, r: 22, dx: -30 },
  { b: DB.agents!, a: 0.6, x: 254, y: 404, w: 100, h: 74, r: 22, dx: 30 },
];

function gooRects(wide: boolean): GooRect[] {
  return [
    ...PODS.map((p) => {
      const [x, y, w, h] = podBox(p, wide);
      return { b: DB.profile!, a: p.a, x, y, w, h, r: h > 60 ? 28 : 21, dx: p.dx, dy: p.dy };
    }),
    ...BUILDINGS,
  ];
}

function gooRectAt(g: GooRect, t: number): Rect | null {
  const s = DAY_STARTS[g.b]! + g.a;
  const end = beatEnd(g.e ?? g.b);
  if (t < s || t > end) return null;
  const k = backOut(clamp01((t - s) / 0.45));
  const out = Number.isFinite(end) ? clamp01((end - t) / 0.3) : 1;
  const sc = (0.5 + 0.5 * k) * out;
  const cx = g.x + g.w / 2 + (g.dx ?? 0) * (1 - k);
  const cy = g.y + g.h / 2 + (g.dy ?? 0) * (1 - k);
  return [cx - (g.w * sc) / 2, cy - (g.h * sc) / 2, g.w * sc, g.h * sc, g.r * sc];
}

type Drop = { b: number; e?: number; a: number; z?: number; x0: number; y0: number; x1?: number; y1?: number; r: number; mode: "fall" | "bulge" | "sit" | "move" };

const QUEEN = { x: 195, y: 307 };
const BLDG_DOORS = BUILDINGS.map((g) => ({ x: g.x + g.w / 2, y: g.y + g.h / 2 }));
/** The call's Splex toolbar: five Ø 40 cups at 3.25·R pitch with pinched necks (`controls/CallSelfSplex.tsx`). */
const SPLEX_Y = 614;
const SPLEX_X = [65, 130, 195, 260, 325];

const DROPS: Drop[] = [
  ...SPLEX_X.map((x, n) => ({ b: DB.transcript!, a: 0.5 + n * 0.06, x0: x, y0: SPLEX_Y, r: 20, mode: "sit" as const })),
  ...SPLEX_X.slice(0, 4).map((x, n) => ({ b: DB.transcript!, a: 0.6 + n * 0.06, x0: x + 32.5, y0: SPLEX_Y, r: 8, mode: "sit" as const })),
  // The transcript drips into the Spine cord at 8 AM.
  { b: DB.spine!, a: 0, z: 0.75, x0: 170, y0: 470, x1: 89, y1: 232, r: 11, mode: "fall" },
  { b: DB.spine!, a: 0.12, z: 0.9, x0: 250, y0: 510, x1: 89, y1: 232, r: 9, mode: "fall" },
  { b: DB.spine!, a: 0.25, z: 1.05, x0: 300, y0: 550, x1: 89, y1: 232, r: 7, mode: "fall" },
  { b: DB.spine!, e: DB.id, a: 0.7, x0: 89, y0: 232, r: 13, mode: "sit" },
  // 10:30: the call note lands on the cord.
  { b: DB.meet!, a: 2.2, x0: 89, y0: 412, r: 13, mode: "sit" },
  { b: DB.meet!, a: 2.0, z: 2.5, x0: 220, y0: 230, x1: 89, y1: 412, r: 10, mode: "fall" },
  // OOpolis streets (bead chains Queen → buildings) and babies budding off the Queen.
  ...BLDG_DOORS.flatMap((d, n) =>
    [0.25, 0.42, 0.59, 0.76].map((q, j) => ({ b: DB.agents!, a: 0.35 + n * 0.08 + j * 0.05, x0: lerp(QUEEN.x, d.x, q), y0: lerp(QUEEN.y, d.y, q), r: 5.5, mode: "sit" as const })),
  ),
  ...BLDG_DOORS.map((d, n) => ({ b: DB.agents!, a: 0.9 + n * 0.1, z: 1.7 + n * 0.1, x0: QUEEN.x, y0: QUEEN.y, x1: lerp(QUEEN.x, d.x, 0.75), y1: lerp(QUEEN.y, d.y, 0.75), r: 12, mode: "move" as const })),
  // Blurbs: the author's pearl pours its tail.
  { b: DB.blurb!, a: 0.5, x0: 77, y0: 166, r: 22, mode: "sit" },
  // Night: the day's moments drip onto the cord.
  ...[0, 1, 2, 3, 4, 5, 6].flatMap((n) => [
    { b: DB.fold!, a: 0.1 + n * 0.26, z: 0.55 + n * 0.26, x0: 250 + (n % 2) * 60, y0: 60 + n * 82, x1: 89, y1: 140 + n * 82, r: 8, mode: "fall" as const },
    { b: DB.fold!, a: 0.5 + n * 0.26, x0: 89, y0: 140 + n * 82, r: 10, mode: "sit" as const },
  ]),
];

function dropAt(d: Drop, t: number): { x: number; y: number; r: number } | null {
  const s = DAY_STARTS[d.b]! + d.a;
  const endBeat = d.e ?? d.b;
  const end = d.z != null ? DAY_STARTS[endBeat]! + d.z : beatEnd(endBeat);
  if (t < s || t > end) return null;
  const q = clamp01((t - s) / Math.max(0.01, end - s));
  if (d.mode === "bulge") return { x: d.x0, y: d.y0, r: d.r * Math.sin(Math.PI * q) };
  if (d.mode === "sit") {
    const grow = backOut(clamp01((t - s) / 0.35));
    const shrink = Number.isFinite(end) ? clamp01((end - t) / 0.3) : 1;
    return { x: d.x0, y: d.y0, r: d.r * grow * shrink };
  }
  const k = d.mode === "fall" ? q * q : easeOut(q);
  return { x: lerp(d.x0, d.x1 ?? d.x0, k), y: lerp(d.y0, d.y1 ?? d.y0, k), r: d.r * (d.mode === "move" ? 1 - 0.4 * q : 1) };
}

/** Blurbs' glass arches (the previous / next card peeking), as goo strokes that swell in. */
const ARCHES = ["M40 128 Q195 92 350 128", "M40 602 Q195 640 350 602"];
const archWidth = (t: number) => {
  const s = DAY_STARTS[DB.blurb!]!;
  const e = beatEnd(DB.blurb!);
  if (t < s || t > e) return 0;
  return 30 * backOut(clamp01((t - s - 0.3) / 0.5)) * clamp01((e - t) / 0.3);
};

/** Fire on your blurb: the count and the heat level the rim burns at. */
const FIRE_AT = 0.9;
const FIRE_DUR = 2.4;
const fireCount = (u: number) => Math.round(24 * easeOut(clamp01((u - FIRE_AT) / FIRE_DUR)));

const ORB_BEAT = DB.orb!;
const BLURB_BEAT = DB.blurb!;

/** The sheet layer steps aside while the Orb scene is up, and melts away at the finale. */
function sheetOpacity(t: number): number {
  const o0 = DAY_STARTS[ORB_BEAT]!;
  const o1 = beatEnd(ORB_BEAT);
  const fin = DAY_STARTS[DAY_BEAT_COUNT - 1]!;
  let op = 1;
  if (t >= o0 && t < o1) op = 1 - clamp01((t - o0 - 0.2) / 0.5);
  else if (t >= o1 && t < o1 + 0.6) op = clamp01((t - o1) / 0.5);
  return Math.min(op, 1 - clamp01((t - fin - 0.5) / 0.7));
}

/* ── Sheet chrome ── */

function Bead({ d, red, children }: { d?: string; red?: boolean; children?: ReactNode }) {
  return <span className={`gds-hbead${red ? " gds-hbead--red" : ""}`}>{children ?? <Icon d={d!} size={18} />}</span>;
}

/** A sheet's header: left bead, centre title (or pill), right bead (inside the column, clear of the corner pills). */
function Head({ b, e, a = 0.3, z, left, right, children }: { b: number; e?: number; a?: number; z?: number; left?: ReactNode; right?: ReactNode; children: ReactNode }) {
  return (
    <>
      {left ? (
        <I b={b} e={e} a={a} z={z} fx="pop" x={56} y={54} w={42} h={42}>
          {left}
        </I>
      ) : null}
      {right ? (
        <I b={b} e={e} a={a + 0.05} z={z} fx="pop" x={292} y={54} w={42} h={42}>
          {right}
        </I>
      ) : null}
      <I b={b} e={e} a={a + 0.05} z={z} fx="down" x={102} y={52} w={186} h={46} className="gds-shead">
        {children}
      </I>
    </>
  );
}

const HOURS = ["7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM"];

const BABIES: { look: BabyLook; icon: SwarmIcon; label: string }[] = [
  { look: "aether", icon: "calendar", label: "Checked your calendar" },
  { look: "flame", icon: "message", label: "Drafted the team note" },
  { look: "spirit", icon: "note", label: "Saved the plan to Spine" },
  { look: "solar", icon: "calendar", label: "Set an 8:30 reminder" },
];
const BLDG = [
  { label: "Calendar", d: IC.calendar },
  { label: "Mail", d: IC.mail },
  { label: "Spine", d: IC.spine },
  { label: "Reminders", d: IC.bell },
];

const FOLD = ["8 AM · Call with Maya", "9 AM · Paid Maya 6 USDC", "10 AM · Design sync note", "12 PM · Thursday, planned", "3 PM · Tulum moodboard", "6 PM · Lake loop, 24 Fire", "9 PM · Live in the Orb"];
const DATE = "Mon, Oct 19";
const PHONE_CORNERS = Object.fromEntries(QUADS.map((q) => [q, cornerAt(PHONE, q)])) as Record<CornerQuad, { x: number; y: number }>;
const SPLEX_ICONS = [IC.mic, IC.video, IC.share, "M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM4 20c0-3 3.6-5 8-5M18 14v6M15 17h6", "M6 12h.01M12 12h.01M18 12h.01"];
const RIM_CORNERS = [
  ["topLeading", "Reblurb", "M4 9h12l-3-3M20 15H8l3 3", ""],
  ["topTrailing", "Close", IC.close, " gds-rimcorner--close"],
  ["bottomLeading", "Fire", IC.fire, " gds-rimcorner--fire"],
  ["bottomTrailing", "Ice", IC.ice, " gds-rimcorner--ice"],
] as const;

/* ── The stage ── */

const DayStoryStage = forwardRef<DayStoryHandle, { scheme: GooScheme; ext?: number; onBeat?: (i: number) => void }>(function DayStoryStage(
  { scheme, ext: extIn = 40, onBeat },
  ref,
) {
  const uid = useId().replace(/[:]/g, "");
  const ext = Math.max(20, Math.round(extIn));
  const wide = ext >= 178;
  const rootRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<SVGPathElement>(null);
  const aRef = useRef<SVGPathElement>(null);
  const pRef = useRef<SVGPathElement>(null);
  const bRef = useRef<SVGPathElement>(null);
  const nRef = useRef<SVGPathElement>(null);
  const sheetRef = useRef<SVGGElement>(null);
  const innerRef = useRef<SVGGElement>(null);
  const chromeRef = useRef<SVGGElement>(null);
  const cornerGoo = useRef<(SVGRectElement | null)[]>([]);
  const cornerIcons = useRef<(HTMLDivElement | null)[]>([]);
  const cornerGlows = useRef<(HTMLDivElement | null)[]>([]);
  const gooEls = useRef<(SVGPathElement | null)[]>([]);
  const drops = useRef<(SVGCircleElement | null)[]>([]);
  const arches = useRef<(SVGPathElement | null)[]>([]);
  const heatRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<DayStoryOrbHandle | null>(null);
  const parsed = useRef<ReturnType<typeof parseItems> | null>(null);
  const attrCache = useRef(new WeakMap<Element, Record<string, string>>());
  const lastBeat = useRef(-1);
  const lastT = useRef(0);
  const onBeatRef = useRef(onBeat);
  onBeatRef.current = onBeat;
  const geo = useMemo(() => ({ ext, wide, rects: gooRects(wide) }), [ext, wide]);
  const geoRef = useRef(geo);
  geoRef.current = geo;
  const [beat, setBeat] = useState(0);
  const light = scheme === "light";

  /** Write an attribute only when it changed (goo repaints are the expensive part). */
  const put = (el: Element | null, name: string, v: string) => {
    if (!el) return;
    let rec = attrCache.current.get(el);
    if (!rec) {
      rec = {};
      attrCache.current.set(el, rec);
    }
    if (rec[name] === v) return;
    rec[name] = v;
    el.setAttribute(name, v);
  };

  const paintHeatRim = (t: number) => {
    const cv = heatRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const u = t - DAY_STARTS[BLURB_BEAT]!;
    const fitK = Number((cv.closest("[data-k]") as HTMLElement | null)?.dataset.k || 1);
    const dpr = Math.min(3, (window.devicePixelRatio || 1) * fitK);
    const pad = 46;
    const cw = CARD[2] + pad * 2;
    const ch = CARD[3] + pad * 2;
    if (cv.width !== Math.round(cw * dpr)) {
      cv.width = Math.round(cw * dpr);
      cv.height = Math.round(ch * dpr);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    const fire = fireCount(u);
    if (fire < 6) return;
    ctx.setTransform(dpr, 0, 0, dpr, (cw / 2) * dpr, (ch / 2) * dpr);
    // The ignite sweep plays once as the blurb crosses the line, then the flames grow with the count.
    paintHeat(ctx, "fire", clamp01((fire - 6) / 18), CARD[2], CARD[3], 40, u, clamp01((u - FIRE_AT - 0.3) / 1.0), light);
  };

  const seek = (raw: number) => {
    const t = Math.max(0, raw);
    lastT.current = t;
    const p = parsed.current;
    if (!p) return;
    const g = geoRef.current;
    // Shell + corners.
    const shell = shellRect(t, g.ext);
    put(shellRef.current, "d", squircle(shell));
    const { i: bi } = local(t);
    const blurbSwap = t >= DAY_STARTS[BLURB_BEAT]! + 0.2 && t <= beatEnd(BLURB_BEAT) - 0.1;
    const finFade = 1 - clamp01((t - DAY_STARTS[DAY_BEAT_COUNT - 1]! - 0.5) / 0.7);
    QUADS.forEach((q, n) => {
      const c = cornerAt(shell, q);
      const pk = pressAt(t, q);
      put(
        cornerGoo.current[n] ?? null,
        "transform",
        `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${cornerRotation(q)}) scale(${(1 + 0.16 * pk).toFixed(3)} ${(1 - 0.2 * pk).toFixed(3)}) translate(-20 -27)`,
      );
      const ic = cornerIcons.current[n];
      if (ic) {
        const tf = `translate3d(${(c.x - 28).toFixed(1)}px, ${(c.y - 28).toFixed(1)}px, 0)`;
        if (ic.style.transform !== tf) ic.style.transform = tf;
        const op = blurbSwap ? "0" : finFade.toFixed(2);
        if (ic.style.opacity !== op) ic.style.opacity = op;
      }
      const gl = cornerGlows.current[n];
      if (gl) {
        const tf = `translate3d(${(c.x - 40).toFixed(1)}px, ${(c.y - 40).toFixed(1)}px, 0) scale(${(0.8 + 0.5 * (1 - pk)).toFixed(3)})`;
        if (gl.style.transform !== tf) gl.style.transform = tf;
        const op = pk.toFixed(2);
        if (gl.style.opacity !== op) gl.style.opacity = op;
      }
    });
    put(nRef.current, "d", squircle(bodyN(t)));
    // Column bodies.
    const a = bodyA(t, g.wide);
    put(aRef.current, "d", squircle(a));
    put(pRef.current, "d", squircle(bodyP(t, a, g.wide)));
    put(bRef.current, "d", squircle(bodyB(t)));
    g.rects.forEach((gr, n) => put(gooEls.current[n] ?? null, "d", squircle(gooRectAt(gr, t) ?? ZERO)));
    const aw = archWidth(t).toFixed(1);
    arches.current.forEach((el) => put(el, "stroke-width", aw));
    DROPS.forEach((d, n) => {
      const el = drops.current[n] ?? null;
      const at = dropAt(d, t);
      if (!at || at.r < 0.3) {
        put(el, "r", "0");
        return;
      }
      put(el, "cx", at.x.toFixed(1));
      put(el, "cy", at.y.toFixed(1));
      put(el, "r", at.r.toFixed(1));
    });
    const so = sheetOpacity(t).toFixed(2);
    if (sheetRef.current && sheetRef.current.style.opacity !== so) sheetRef.current.style.opacity = so;
    const fin = DAY_STARTS[DAY_BEAT_COUNT - 1]!;
    const io = (1 - clamp01((t - fin - 0.5) / 0.7)).toFixed(2);
    if (innerRef.current && innerRef.current.style.opacity !== io) innerRef.current.style.opacity = io;
    if (chromeRef.current && chromeRef.current.style.opacity !== io) chromeRef.current.style.opacity = io;
    // Scenes with their own painters.
    const o0 = DAY_STARTS[ORB_BEAT]!;
    if (t >= o0 && t <= beatEnd(ORB_BEAT)) orbRef.current?.paint(t - o0);
    if (bi === BLURB_BEAT) paintHeatRim(t);
    for (const it of p.items) paintItem(it, t);
    for (const ty of p.typers) {
      const n = t < ty.s ? 0 : Math.min(ty.text.length, Math.ceil(((t - ty.s) / ty.d) * ty.text.length));
      if (n !== ty.n) {
        ty.n = n;
        ty.el.textContent = ty.text.slice(0, n);
      }
    }
    for (const c of p.counters) {
      const v = Math.round(lerp(c.from, c.to, easeOut(clamp01((t - c.s) / c.d))));
      const s = c.clock ? `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}` : String(v);
      if (s !== c.last) {
        c.last = s;
        c.el.textContent = s;
      }
    }
    if (bi !== lastBeat.current) {
      lastBeat.current = bi;
      setBeat(bi);
      onBeatRef.current?.(bi);
    }
  };

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    parsed.current = parseItems(rootRef.current);
    seek(lastT.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A resize changes the desktop extent: repaint once at the current time.
  useLayoutEffect(() => {
    seek(lastT.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo]);

  useImperativeHandle(ref, () => ({ seek }), []);

  const orbOn = beat >= ORB_BEAT - 1 && beat <= ORB_BEAT + 1;
  const glyphOn = beat >= DAY_BEAT_COUNT - 2;
  const fill = roleColor(scheme, "base");
  const padX = ext + 90;
  const vb = { x: -padX, y: -80, w: W + 2 * padX, h: H + 160 };
  const innerX = wide ? -180 : -20;
  const desk = desktopRect(ext);
  const portrait = wide ? PORTRAIT_W : PORTRAIT_M;

  return (
    <div ref={rootRef} className="gds" style={{ width: W, height: H }}>
      <div className="gds-art" aria-hidden>
        {/* The shell: desktop window, squeezing into a phone at "Heading out". */}
        <svg className="gds-shell" style={{ left: vb.x, top: vb.y }} width={vb.w} height={vb.h} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}>
          <path ref={shellRef} className="gds-shell__frame" />
        </svg>
        <I b={0} e={MOBILE_AT} z={0.6} a={0} x={desk[0] + 18} y={-24} w={desk[2] - 36} h={20} className="gds-browserbar">
          <span className="gds-browserbar__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="gds-browserbar__url">app.jokuh.com</span>
        </I>
        <I b={MOBILE_AT} a={1.2} x={145} y={706} w={100} h={5} className="gds-homebar" />

        <svg className="gds-goo" style={{ left: vb.x, top: vb.y }} width={vb.w} height={vb.h} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}>
          <defs>
            <GooFilter id={`gds-a-${uid}`} x={-20} y={-20} width={W + 40} height={H + 40} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
            <GooFilter id={`gds-b-${uid}`} x={innerX} y={-20} width={W - innerX * 2} height={H + 40} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
            <GooFilter id={`gds-n-${uid}`} x={20} y={-10} width={W - 40} height={220} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
            {QUADS.map((q) => {
              const d = cornerAt(desk, q);
              const m = PHONE_CORNERS[q];
              return (
                <GooFilter
                  key={q}
                  id={`gds-c-${q}-${uid}`}
                  x={Math.min(d.x, m.x) - 60}
                  y={Math.min(d.y, m.y) - 60}
                  width={Math.abs(d.x - m.x) + 120}
                  height={Math.abs(d.y - m.y) + 120}
                  spec={splexSpec(scheme)}
                  params={GOO_ENV_PARAMS}
                />
              );
            })}
          </defs>
          <g ref={sheetRef} filter={`url(#gds-a-${uid})`}>
            <path ref={aRef} fill={fill} />
            <path ref={pRef} fill={fill} />
          </g>
          <g ref={innerRef} filter={`url(#gds-b-${uid})`}>
            <path ref={bRef} fill={fill} />
            {geo.rects.map((_, n) => (
              <path key={n} ref={(el) => void (gooEls.current[n] = el)} fill={fill} />
            ))}
            {ARCHES.map((d, n) => (
              <path key={d} ref={(el) => void (arches.current[n] = el)} d={d} fill="none" stroke={fill} strokeLinecap="round" strokeWidth={0} />
            ))}
            {DROPS.map((_, n) => (
              <circle key={n} ref={(el) => void (drops.current[n] = el)} r={0} fill={fill} />
            ))}
          </g>
          <g ref={chromeRef}>
            <g filter={`url(#gds-n-${uid})`}>
              <path ref={nRef} fill={fill} />
            </g>
            {QUADS.map((q, n) => (
              <g key={q} filter={`url(#gds-c-${q}-${uid})`}>
                <rect ref={(el) => void (cornerGoo.current[n] = el)} width={40} height={54} rx={20} fill={fill} />
              </g>
            ))}
          </g>
        </svg>

        {/* Corner pill glyphs (upright) and their press glow; Blurbs swaps them for its own corners. */}
        {CORNER_PILLS.map((c) => {
          const n = QUADS.indexOf(c.quad);
          return (
            <div key={c.quad}>
              <div ref={(el) => void (cornerGlows.current[n] = el)} className="gds-cornerglow" style={{ opacity: 0 }} />
              <div ref={(el) => void (cornerIcons.current[n] = el)} className="gds-cornericon">
                {c.icon}
              </div>
            </div>
          );
        })}

        {/* The Orb scene: its own goo + canvas, painted by `seek`. */}
        <I b={ORB_BEAT} a={0} x={0} y={0} w={W} h={H} className="gds-orbitem">
          {orbOn ? (
            <DayStoryOrb
              ref={(h) => {
                orbRef.current = h;
                if (h) seek(lastT.current);
              }}
              scheme={scheme}
            />
          ) : null}
        </I>

        {/* Home column under the incoming call (desktop). */}
        <I b={DB.call!} z={3.3} a={0} x={24} y={642} w={342} h={56} className="gds-ask gds-ask--home">
          <span className="gds-ask__plus">
            <Icon d={IC.plus} size={16} />
          </span>
          <span className="gds-ask__text gds-muted">Ask OO…</span>
          <span className="gds-ask__plus">
            <Icon d={IC.mic} size={16} />
          </span>
        </I>
        <I b={DB.call!} z={3.3} a={0} x={45} y={300} w={300} className="gds-center">
          <strong className="gds-hello">Good morning</strong>
        </I>

        {/* 0 · 7:58 am (desktop): the incoming call opens out of the Nexus (`JokuhIncomingNexus`). */}
        <I b={DB.call!} a={1.0} z={3.15} x={NEX_CARD[0]} y={NEX_CARD[1]} w={NEX_CARD[2]} h={NEX_CARD[3]} className="gds-incoming">
          <span className="gds-incoming__top">
            <span className="gds-ringface">
              <i />
              <i />
              <img src={FACE("maya")} alt="" />
            </span>
            <span>
              <strong>Maya</strong>
              <small>
                <JokuhOO size={14} /> Coffee friend · last call Sunday
              </small>
            </span>
          </span>
          <span className="gds-incoming__btns">
            <span className="gds-callbtn gds-callbtn--decline">
              <Icon d={IC.hang} size={16} /> Decline
            </span>
            <span className="gds-callbtn gds-callbtn--answer">
              <Icon d={IC.phone} size={15} /> Answer
            </span>
          </span>
        </I>

        {/* 1 · 7:59 am (desktop): the call field: Maya's squircle, your PiP, Splex toolbar, transcript bubbles. */}
        <I b={DB.call!} e={DB.transcript} a={3.3} x={NEX_CALL[0]} y={NEX_CALL[1]} w={NEX_CALL[2]} h={NEX_CALL[3]} className="gds-callpill">
          <span className="gds-livedot" />
          <N b={DB.transcript!} a={0} d={4} from={4} to={42} clock />
          <span className="gds-muted">Maya</span>
        </I>
        <I b={DB.transcript!} a={0.2} fx="pop" sc={0.85} x={40} y={74} w={310} h={360} className="gds-callsq">
          <img src={FACE("maya-call")} alt="" />
          <span className="gds-callsq__name">Maya</span>
        </I>
        <I b={DB.transcript!} a={0.35} fx="fade" x={40} y={74} w={310} h={360} className="gds-speakring" />
        <I b={DB.transcript!} a={0.6} fx="pop" x={270} y={372} w={84} h={100} className="gds-callsq gds-callsq--pip">
          <img src={FACE("you-portrait")} alt="" />
        </I>
        {[
          { a: 0.8, who: "maya", me: false, text: "Free this week?" },
          { a: 1.6, who: "you", me: true, text: "Thursday morning works." },
          { a: 2.4, who: "maya", me: false, text: "Coffee Thursday? 9 at Blue Bottle." },
        ].map((l, n) => (
          <I key={n} b={DB.transcript!} a={l.a} fx="up" x={40} y={446 + n * 40} w={310} className={`gds-tline${l.me ? " gds-tline--me" : ""}`}>
            <img className="gds-tface" src={FACE(l.who)} alt="" />
            <span>
              <T b={DB.transcript!} a={l.a + 0.05} d={0.6} text={l.text} />
            </span>
          </I>
        ))}
        {SPLEX_ICONS.map((d, n) => (
          <I key={n} b={DB.transcript!} a={0.6 + n * 0.06} fx="pop" x={SPLEX_X[n]! - 14} y={SPLEX_Y - 14} w={28} h={28} className="gds-splexicon">
            <Icon d={d} size={18} />
          </I>
        ))}
        <I b={DB.transcript!} a={0.5} fx="up" x={24} y={650} w={342} h={46} className="gds-composer gds-sq">
          <span>Message</span> <Icon d={IC.send} size={16} />
        </I>

        {/* 2 · 8:06 am: the Spine sheet; the call drips onto the cord */}
        <Head
          b={DB.spine!}
          e={DB.id}
          left={
            <Bead>
              <JokuhOO size={30} />
            </Bead>
          }
          right={<Bead d={IC.moon} />}
        >
          <span className="gds-datepill gds-sq">
            <strong>{DATE}</strong>
            <small>Busy Monday</small>
          </span>
        </Head>
        {HOURS.map((h, n) => (
          <I key={h} b={DB.spine!} e={DB.id} a={0.3 + n * 0.06} fx="fade" x={24} y={124 + n * 90} w={52} className="gds-hourlabel">
            {h}
          </I>
        ))}
        <I b={DB.spine!} e={DB.id} a={0.85} fx="right" x={108} y={218} w={160} h={30} className="gds-pill gds-sq">
          <Icon d={IC.phone} size={13} /> +1 Call · Maya
        </I>
        <I b={DB.spine!} e={DB.id} a={1.15} fx="up" x={108} y={256} w={258} className="gds-card gds-slab gds-sq">
          <span className="gds-card__meta">Call with Maya · 6 min · transcript saved</span>
          <span className="gds-quote">
            “
            <span className="gds-hl">
              <I b={DB.spine!} e={DB.id} a={1.7} fx="wipe" className="gds-hl__bar" />
              <span className="gds-hl__text">Coffee Thursday?</span>
            </span>{" "}
            9 at Blue Bottle.”
          </span>
        </I>

        {/* 3 · 8:07 am: Maya's ID, threaded to the memory */}
        <I b={DB.id!} a={0.5} fx="pop" x={108} y={396} w={258} h={124} className="gds-idcard gds-slab gds-sq">
          <span className="gds-idcard__top">
            <Face name="maya" size={46} ring />
            <span>
              <strong>Maya</strong>
              <small>@maya · close friend</small>
            </span>
          </span>
          <span className="gds-idcard__chips">
            <span className="gds-chip">
              <Icon d={IC.pin} size={13} /> Blue Bottle
            </span>
            <span className="gds-chip">
              <Icon d={IC.phone} size={12} /> 3 calls this month
            </span>
          </span>
        </I>
        <I b={DB.id!} a={1.0} fx="fade" x={0} y={0} w={W} h={H} className="gds-threads">
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <path d="M168 396 C 160 380, 186 372, 190 346" className="gds-thread" />
            <path d="M290 432 C 330 410, 330 370, 300 346" className="gds-thread" />
            <circle cx={168} cy={396} r={3.5} className="gds-thread-dot" />
            <circle cx={290} cy={432} r={3.5} className="gds-thread-dot" />
          </svg>
        </I>
        <I b={DB.id!} a={1.7} fx="up" x={108} y={532} w={258} className="gds-oonote gds-slab gds-sq">
          <JokuhOO size={22} />
          <span>OO knows: Maya's your Thursday coffee. Want it on the calendar?</span>
        </I>

        {/* 4 · 8:15 am (desktop): your ID, its own surface: portrait in its goo rim, plinth, pods around it */}
        <I b={DB.profile!} a={0.35} fx="down" x={95} y={52} w={200} className="gds-center">
          <strong className="gds-profname">You</strong>
        </I>
        <I b={DB.profile!} a={0.55} fx="fade" x={portrait[0] + 8} y={portrait[1] + 8} w={portrait[2] - 16} h={portrait[3] - 16} className="gds-portrait">
          <img src={FACE("you-portrait")} alt="" draggable={false} />
          <I b={DB.profile!} a={1.2} fx="pop" className="gds-walletchip">
            <strong>$1,284.20</strong>
            <small>↗ 2.1%</small>
          </I>
        </I>
        <I b={DB.profile!} a={0.9} fx="up" x={122} y={wide ? 384 : 346} w={146} h={wide ? 42 : 44} className="gds-plinth">
          <strong>@you</strong>
        </I>
        {PODS.map((pod) => {
          const [x, y, w, h] = podBox(pod, wide);
          const img = pod.key === "gallery" || pod.key === "location";
          const cls = img ? " gds-pod--img" : pod.key === "blurbs" ? " gds-pod--row" : " gds-pod--center";
          return (
            <I key={pod.key} b={DB.profile!} a={pod.a} fx="snap" dx={pod.dx} dy={pod.dy} x={x} y={y} w={w} h={h} className={`gds-pod${cls}`}>
              {pod.key === "gallery" ? (
                <>
                  <img src={FACE("gallery")} alt="" />
                  <span className="gds-pod__tag">Gallery</span>
                </>
              ) : pod.key === "location" ? (
                <>
                  <img src={FACE("map")} alt="" />
                  <span className="gds-pod__tag">
                    <Icon d={IC.pin} size={10} /> Echo Park
                  </span>
                </>
              ) : pod.key === "music" ? (
                <>
                  <img className="gds-pod__disc" src={FACE("music")} alt="" />
                  <span className="gds-pod__label">Music</span>
                </>
              ) : pod.key === "spine" ? (
                <>
                  <span className="gds-pod__bars">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="gds-pod__label">Spine</span>
                </>
              ) : pod.key === "bubble" ? (
                <>
                  <strong className="gds-pod__title">Tulum crew</strong>
                  <span className="gds-pod__label">Bubble</span>
                </>
              ) : pod.key === "contact" ? (
                <>
                  <span className="gds-contact">
                    <span>
                      <Icon d={IC.chat} size={11} /> Chat
                    </span>
                    <span>
                      <Icon d={IC.mail} size={11} /> Mail
                    </span>
                  </span>
                  <span className="gds-pod__label">Contact</span>
                </>
              ) : (
                <>
                  <span className="gds-pod__label">Blurbs</span>
                  <span className="gds-pod__blurb">Lake loop after a good day.</span>
                  <span className="gds-fire">
                    <Icon d={IC.fire} size={12} /> 12
                  </span>
                </>
              )}
            </I>
          );
        })}
        <I b={DB.profile!} a={1.9} fx="up" x={56} y={662} w={130} h={42} className="gds-editpill gds-sq">
          Edit profile
        </I>
        <I b={DB.profile!} a={2.0} fx="up" x={198} y={658} w={136} h={48} className="gds-golive">
          <Icon d={IC.radio} size={18} /> Go Live
        </I>

        {/* 5 · 8:52 am: "Heading out": the window squeezes into a phone */}
        <I b={MOBILE_AT} a={0.1} x={45} y={290} w={300} className="gds-center">
          <strong className="gds-hello">Going mobile…</strong>
          <small className="gds-muted gds-small">Same app, same day, in your pocket.</small>
        </I>
        <I b={MOBILE_AT} a={0.3} x={24} y={642} w={342} h={56} className="gds-ask gds-ask--home">
          <span className="gds-ask__plus">
            <Icon d={IC.plus} size={16} />
          </span>
          <span className="gds-ask__text gds-muted">Ask OO…</span>
          <span className="gds-ask__plus">
            <Icon d={IC.mic} size={16} />
          </span>
        </I>

        {/* 6 · 9:12 am: DM sheet; OO's coach turns it into a meeting */}
        <Head b={DB.dm!} e={DB.wallet} left={<Bead d={IC.chevLeft} />} right={<Bead d={IC.phone} />}>
          <span className="gds-namepill gds-sq">
            <Face name="maya" size={26} />
            <span>
              <strong>Maya</strong>
              <small>online</small>
            </span>
          </span>
        </Head>
        <I b={DB.dm!} e={DB.wallet} a={0.45} fx="left" x={30} y={118} w={330} className="gds-row">
          <span className="gds-bub">Still on for Thursday?</span>
        </I>
        <I b={DB.dm!} e={DB.wallet} a={0.85} fx="right" x={30} y={166} w={330} className="gds-row gds-row--me">
          <span className="gds-bub gds-bub--me">Yes! 9 at Blue Bottle</span>
        </I>
        <I b={DB.dm!} a={1.3} z={2.3} fx="pop" x={30} y={222} w={330} className="gds-row gds-row--me">
          <span className="gds-coach gds-slab">
            <JokuhOO size={22} />
            Lock in Thursday?
          </span>
        </I>
        <I b={DB.dm!} e={DB.wallet} a={2.35} fx="pop" x={30} y={218} w={330} className="gds-meet gds-slab gds-sq">
          <span className="gds-meet__icon">
            <Icon d={IC.calendar} size={18} />
          </span>
          <span>
            <strong>Coffee with Maya</strong>
            <small>Thu 9:00 am · Blue Bottle</small>
          </span>
          <span className="gds-tick">
            <Icon d={IC.check} size={14} stroke={2.6} />
          </span>
        </I>
        <I b={DB.dm!} e={DB.wallet} a={0.4} fx="up" x={24} y={640} w={342} h={52} className="gds-composer gds-sq">
          <Icon d={IC.plus} size={16} /> <span>Message</span> <Icon d={IC.mic} size={16} />
        </I>

        {/* 7 · 9:13 am: wallet request → Paid, in the chat */}
        <I b={DB.wallet!} a={0.2} fx="left" x={30} y={302} w={330} className="gds-row">
          <span className="gds-bub">And you still owe me last week's coffee.</span>
        </I>
        <I b={DB.wallet!} a={0.65} fx="pop" x={30} y={354} w={300} h={128} className="gds-pay gds-slab gds-sq">
          <span className="gds-pay__top">
            <span className="gds-pay__coin">
              <Icon d={IC.coin} size={18} />
            </span>
            <small>Maya requested</small>
          </span>
          <strong className="gds-pay__amt">6 USDC</strong>
          <small className="gds-muted">Coffee, last week</small>
          <I b={DB.wallet!} a={0.9} z={1.75} fx="fade" className="gds-pay__btn">
            Pay
          </I>
          <I b={DB.wallet!} a={1.75} fx="pop" className="gds-pay__btn gds-pay__btn--done">
            <Icon d={IC.check} size={14} stroke={2.6} /> Paid
          </I>
        </I>

        {/* 8 · 10:30 am: group chat join card → the call note lands in Spine */}
        <Head b={DB.meet!} z={1.8} left={<Bead d={IC.chevLeft} />} right={<Bead d={IC.phone} />}>
          <span className="gds-namepill gds-sq">
            <span className="gds-faces gds-faces--sm">
              <Face name="leo" size={22} />
              <Face name="june" size={22} />
            </span>
            <span>
              <strong>Design crew</strong>
              <small>5 people</small>
            </span>
          </span>
        </Head>
        <I b={DB.meet!} a={0.4} z={1.8} fx="left" x={30} y={120} w={330} className="gds-row">
          <span className="gds-bub">Starting now, hop in</span>
        </I>
        <I b={DB.meet!} a={0.7} z={1.8} fx="pop" x={30} y={172} w={330} h={76} className="gds-joincard gds-slab gds-sq">
          <span className="gds-faces">
            <Face name="leo" size={34} />
            <Face name="june" size={34} />
            <Face name="kenji" size={34} />
          </span>
          <span>
            <strong>Design sync is live</strong>
            <small>Jokuh Meet · 10:30</small>
          </span>
          <I b={DB.meet!} a={1.1} z={1.8} fx="pop" className="gds-joinbtn">
            Join
          </I>
        </I>
        <Head b={DB.meet!} a={1.9} left={<Bead>{<JokuhOO size={30} />}</Bead>} right={<Bead d={IC.moon} />}>
          <span className="gds-datepill gds-sq">
            <strong>{DATE}</strong>
            <small>Busy Monday</small>
          </span>
        </Head>
        {HOURS.map((h, n) => (
          <I key={`m${h}`} b={DB.meet!} a={1.9 + n * 0.04} fx="fade" x={24} y={124 + n * 90} w={52} className="gds-hourlabel">
            {h}
          </I>
        ))}
        <I b={DB.meet!} a={2.0} fx="right" x={108} y={218} w={160} h={30} className="gds-pill gds-sq">
          <Icon d={IC.phone} size={13} /> +1 Call · Maya
        </I>
        <I b={DB.meet!} a={2.4} fx="right" x={108} y={398} w={210} h={30} className="gds-pill gds-pill--blue gds-sq">
          <Icon d={IC.doc} size={13} /> Call note · Design sync
        </I>
        <I b={DB.meet!} a={2.7} fx="up" x={108} y={436} w={258} className="gds-card gds-slab gds-sq">
          <ul className="gds-list">
            <li>Ship the new onboarding Thursday</li>
            <li>June owns the copy pass</li>
          </ul>
        </I>

        {/* 9 · 11:20 am: the note becomes a Doc, shared to the Space, mailed out */}
        <Head b={DB.docs!} left={<Bead d={IC.doc} />} right={<Bead d={IC.share} />}>
          <strong>Design sync notes</strong>
          <small>Doc · edited now</small>
        </Head>
        <I b={DB.docs!} a={0.4} fx="fade" x={40} y={116} w={310} className="gds-docline">
          Ship the new onboarding Thursday. June owns the copy pass.
        </I>
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <I key={n} b={DB.docs!} a={0.6 + n * 0.08} fx="wipe" x={40} y={176 + n * 30} w={n === 5 ? 140 : n % 3 === 1 ? 250 : 300} h={11} className="gds-line" />
        ))}
        <I b={DB.docs!} a={1.3} fx="pop" x={40} y={392} w={250} className="gds-space">
          <span className="gds-faces gds-faces--sm">
            <Face name="leo" size={24} />
            <Face name="june" size={24} />
          </span>
          Shared to Space · Design crew
        </I>
        <I b={DB.docs!} a={1.9} fx="up" x={30} y={600} w={330} className="gds-mail gds-slab gds-sq">
          <span className="gds-mail__icon">
            <Icon d={IC.mail} size={16} />
          </span>
          <span>
            <strong>you@jokuh.com</strong>
            <small>To Leo, June · Design sync notes</small>
          </span>
          <span className="gds-tick">
            <Icon d={IC.check} size={14} stroke={2.6} />
          </span>
        </I>

        {/* 10 · 12:30 pm: Ask OO; the OO sheet rises off the bar */}
        <I b={DB.ask!} a={0.4} x={24} y={642} w={342} h={56} className="gds-ask">
          <span className="gds-ask__plus">
            <Icon d={IC.plus} size={16} />
          </span>
          <span className="gds-ask__text">
            <T b={DB.ask!} a={0.5} d={0.9} text="plan my Thursday" />
            <span className="gds-caret" />
          </span>
          <I b={DB.ask!} a={1.3} fx="pop" className="gds-ask__send">
            <Icon d="M12 19V5M6 11l6-6 6 6" size={16} stroke={2.4} />
          </I>
        </I>
        <Head b={DB.ask!} a={1.4} left={<Bead d={IC.chevDown} />}>
          <span className="gds-oohead">
            <JokuhOO size={26} label="OO" />
            <strong>OO</strong>
          </span>
        </Head>
        <I b={DB.ask!} a={1.6} fx="fade" x={36} y={112} w={318} className="gds-oo__lead">
          Here's your Thursday:
        </I>
        {[
          ["9:00 am", "Coffee with Maya · Blue Bottle"],
          ["11:00 am", "Ship the new onboarding"],
          ["12:30 pm", "Lunch, kept free"],
          ["6:00 pm", "Pack for Tulum"],
        ].map(([time, what], n) => (
          <I key={time} b={DB.ask!} a={1.8 + n * 0.15} fx="up" x={36} y={154 + n * 64} w={318} h={54} className="gds-slot gds-slab gds-sq">
            <b>{time}</b>
            <span>{what}</span>
          </I>
        ))}
        <I b={DB.ask!} a={2.6} fx="fade" x={36} y={424} w={318} className="gds-muted gds-small">
          Want a reminder before coffee, and a heads-up to the team?
        </I>

        {/* 11 · 12:31 pm: OOpolis; babies walk to the buildings, Queen OO hands back one answer */}
        <I b={DB.agents!} a={0.15} fx="down" x={60} y={60} w={270} className="gds-center">
          <strong className="gds-h3">OOpolis</strong>
          <small className="gds-muted gds-small">4 agents at work · they ask before they act</small>
        </I>
        {BUILDINGS.map((g, n) => (
          <I key={`b${n}`} b={DB.agents!} a={g.a + 0.1} fx="pop" x={g.x} y={g.y} w={g.w} h={g.h} className="gds-bldg">
            <Icon d={BLDG[n]!.d} size={18} />
            <small>{BLDG[n]!.label}</small>
          </I>
        ))}
        <I b={DB.agents!} a={0.2} fx="pop" x={QUEEN.x - 38} y={QUEEN.y - 38} w={76} h={76}>
          <JokuhOO size={76} look="queen" />
        </I>
        {BABIES.map((bb, n) => {
          const d = BLDG_DOORS[n]!;
          return (
            <I
              key={n}
              b={DB.agents!}
              a={0.9 + n * 0.1}
              fd={0.9}
              fx="float"
              dx={(d.x - QUEEN.x) * 0.62}
              dy={(d.y - QUEEN.y) * 0.62 + (d.y < QUEEN.y ? 30 : -30)}
              x={QUEEN.x - 15}
              y={QUEEN.y - 15}
              w={30}
              h={30}
              className="gds-baby"
            >
              <JokuhOO size={30} look={babyOOLook(bb.look)} />
              <span className="gds-baby__task">
                <SwarmIconSvg icon={bb.icon} size={9} />
              </span>
            </I>
          );
        })}
        {BABIES.map((bb, n) => {
          const d = BLDG_DOORS[n]!;
          return (
            <I key={`l${n}`} b={DB.agents!} a={1.9 + n * 0.12} z={3.7} fx="pop" x={d.x - 70} y={d.y < QUEEN.y ? d.y + 44 : d.y - 64} w={140} className="gds-center">
              <span className="gds-pop">{bb.label}</span>
            </I>
          );
        })}
        <I b={DB.agents!} a={2.5} x={36} y={540} w={318} h={128} className="gds-answer">
          <span className="gds-answer__text">
            <JokuhOO size={24} look="queen" />
            <span>Reminder set for 8:30. Draft to Leo and June: “Onboarding ships Thursday at 11.” Send it?</span>
          </span>
          <span className="gds-answer__btns">
            <span className="gds-btn gds-btn--go">Send</span>
            <span className="gds-btn">Edit</span>
          </span>
        </I>

        {/* 12 · 3:00 pm: Bubble sheet; friends drop images on the moodboard, one made in Studio */}
        <Head b={DB.bubble!} left={<Bead d={IC.chevLeft} />} right={<Bead d={IC.plus} />}>
          <strong>Tulum trip</strong>
          <span className="gds-faces gds-faces--sm">
            <Face name="maya" size={20} />
            <Face name="leo" size={20} />
            <Face name="june" size={20} />
          </span>
        </Head>
        {[
          { img: "mood-coast", x: 28, y: 112, a: 0.7 },
          { img: "mood-bungalow", x: 200, y: 112, a: 1.1 },
          { img: "mood-kitchen", x: 28, y: 258, a: 1.5 },
          { img: "mood-walk", x: 200, y: 258, a: 1.9 },
        ].map((tile) => (
          <I key={tile.img} b={DB.bubble!} a={tile.a} fx="pop" x={tile.x} y={tile.y} w={162} h={136} className="gds-tile gds-sq">
            <img src={FACE(tile.img)} alt="" />
          </I>
        ))}
        <I b={DB.bubble!} a={2.05} z={2.7} fx="pop" x={28} y={404} w={162} h={136} className="gds-tile gds-tile--prompt gds-sq">
          <span>
            <Icon d={IC.sparkle} size={13} /> Studio
          </span>
          <T b={DB.bubble!} a={2.1} d={0.5} text="sunset poster, film grain" />
        </I>
        <I b={DB.bubble!} a={2.7} fx="pop" x={28} y={404} w={162} h={136} className="gds-tile gds-sq">
          <img src={FACE("studio-src")} alt="" />
          <span className="gds-pod__tag">
            <Icon d={IC.sparkle} size={11} /> Made in Studio
          </span>
        </I>
        <I b={DB.bubble!} a={3.0} fx="pop" x={200} y={404} w={162} h={136} className="gds-tile gds-tile--note gds-sq">
          Fly Fri, back Mon?
        </I>
        <I b={DB.bubble!} a={1.3} fx="left" x={30} y={560} w={330} className="gds-row">
          <span className="gds-bub">The bungalow!!</span>
        </I>
        <I b={DB.bubble!} a={0.4} fx="up" x={24} y={640} w={342} h={52} className="gds-composer gds-sq">
          <Icon d={IC.plus} size={16} /> <span>Message the Bubble</span> <Icon d={IC.mic} size={16} />
        </I>
        {[
          { name: "Maya", x: 360, y: 130, dx: -260, dy: 70, a: 0.2, c: "pink" },
          { name: "Leo", x: 380, y: 330, dx: -110, dy: -150, a: 0.6, c: "blue" },
          { name: "June", x: -20, y: 520, dx: 110, dy: -200, a: 1.0, c: "green" },
        ].map((c) => (
          <I key={c.name} b={DB.bubble!} a={c.a} fd={0.75} fx="float" dx={c.dx} dy={c.dy} x={c.x} y={c.y} className={`gds-cursor gds-cursor--${c.c}`}>
            <Icon d={IC.cursor} size={16} stroke={1.6} />
            <span>{c.name}</span>
          </I>
        ))}

        {/* 13 · 5:20 pm: Arcade sheet, a quick match with Leo */}
        <Head b={DB.arcade!} left={<Bead d={IC.chevLeft} />}>
          <strong>Arcade</strong>
          <small>Round 3 · Leo</small>
        </Head>
        <I b={DB.arcade!} a={0.3} x={40} y={116} w={310} h={300} className="gds-screen gds-sq">
          <span className="gds-vs">
            <span>
              <Face name="you" size={56} ring />
              <small>You</small>
            </span>
            <strong className="gds-score">
              <N b={DB.arcade!} a={0.4} d={1.2} from={2} to={3} />
              <span>–</span>2
            </strong>
            <span>
              <Face name="leo" size={56} ring />
              <small>Leo</small>
            </span>
          </span>
        </I>
        <I b={DB.arcade!} a={1.5} fx="pop" x={95} y={444} w={200} className="gds-center">
          <span className="gds-win">You win · +9 Fuel</span>
        </I>
        <I b={DB.arcade!} a={0.4} fx="pop" x={128} y={524} w={44} h={44} className="gds-key" />
        <I b={DB.arcade!} a={0.45} fx="pop" x={218} y={524} w={44} h={44} className="gds-key gds-key--b" />

        {/* 14 · 6:40 pm: Blurbs rim feed: one card in the glass rim, arches with the next / previous author's pearl,
            your pearl + poured tail, the caption bud on its neck, the heat rim growing as Fire comes in, and the
            feed's own corners (Reblurb, Close, Fire, Ice). */}
        <I b={BLURB_BEAT} a={0.5} fx="pop" x={182} y={98} w={26} h={26} className="gds-pearl">
          <img src={FACE("maya")} alt="" />
        </I>
        <I b={BLURB_BEAT} a={0.5} fx="pop" x={182} y={606} w={26} h={26} className="gds-pearl">
          <img src={FACE("leo")} alt="" />
        </I>
        <I b={BLURB_BEAT} a={0.45} fx="right" x={58} y={146} w={290} h={40} className="gds-author">
          <img className="gds-author__pearl" src={FACE("you")} alt="" />
          <strong>You</strong>
          <small>now</small>
          <span className="gds-author__tail" />
        </I>
        <I b={BLURB_BEAT} a={0.3} fx="fade" x={CARD[0] - 46} y={CARD[1] - 46} w={CARD[2] + 92} h={CARD[3] + 92} className="gds-heat">
          <canvas ref={heatRef} />
        </I>
        <I b={BLURB_BEAT} a={0.35} fx="fade" x={CARD[0] + 6} y={CARD[1] + 6} w={CARD[2] - 12} h={CARD[3] - 12} className="gds-rimphoto">
          <img src={FACE("blurb-lake")} alt="" />
        </I>
        <I b={BLURB_BEAT} a={0.7} fx="up" x={82} y={498} w={228} h={64} className="gds-bud">
          <span>Lake loop after a good day.</span>
          <span className="gds-bud__counts">
            <span className="gds-fire">
              <Icon d={IC.fire} size={12} /> <N b={BLURB_BEAT} a={FIRE_AT} d={FIRE_DUR} from={0} to={24} />
            </span>
            <span className="gds-muted">
              <Icon d={IC.ice} size={11} /> 2
            </span>
            <span className="gds-muted">
              <Icon d={IC.chat} size={11} /> 3
            </span>
          </span>
        </I>
        <I b={BLURB_BEAT} a={0.6} fx="up" x={30} y={652} w={250} h={44} className="gds-composer gds-sq">
          <span>What's on your mind?</span>
        </I>
        <I b={BLURB_BEAT} a={0.65} fx="pop" x={306} y={650} w={48} h={48} className="gds-micbead">
          <Icon d={IC.mic} size={18} />
        </I>
        {RIM_CORNERS.map(([q, label, d, cls]) => {
          const c = PHONE_CORNERS[q];
          return (
            <I key={q} b={BLURB_BEAT} a={0.25} fx="pop" x={c.x - 28} y={c.y - 28} w={56} h={56} className={`gds-rimcorner${cls}`}>
              <Icon d={d} size={18} />
              <small>{label}</small>
              {q === "bottomLeading" ? (
                <b>
                  <N b={BLURB_BEAT} a={FIRE_AT} d={FIRE_DUR} from={0} to={24} />
                </b>
              ) : q === "bottomTrailing" ? (
                <b>2</b>
              ) : null}
            </I>
          );
        })}
        {[0, 1, 2, 3, 4].map((n) => (
          <I
            key={`fl${n}`}
            b={BLURB_BEAT}
            a={FIRE_AT + n * 0.4}
            z={FIRE_AT + n * 0.4 + 0.8}
            fd={0.8}
            fx="float"
            dx={120 + n * 22}
            dy={-300 - (n % 2) * 40}
            x={PHONE_CORNERS.bottomLeading.x - 10}
            y={PHONE_CORNERS.bottomLeading.y - 30}
            className="gds-flame"
          >
            <Icon d={IC.fire} size={22} />
          </I>
        ))}

        {/* 15 · 9:00 pm: the Orb's island */}
        <I b={ORB_BEAT} a={0.3} fx="fade" x={NEX_LIVE[0]} y={NEX_LIVE[1]} w={NEX_LIVE[2]} h={NEX_LIVE[3]} className="gds-island">
          <span className="gds-livebadge">LIVE</span>
          <span>
            <N b={ORB_BEAT} a={0.4} d={4} from={3} to={128} /> watching
          </span>
        </I>

        {/* 16 · 11:40 pm: the day folds into the Spine */}
        <Head b={DB.fold!} left={<Bead>{<JokuhOO size={30} />}</Bead>} right={<Bead d={IC.moon} />}>
          <span className="gds-datepill gds-sq">
            <strong>{DATE}</strong>
            <small>Full day</small>
          </span>
        </Head>
        {FOLD.map((label, n) => (
          <I key={label} b={DB.fold!} a={0.45 + n * 0.26} fx="right" x={108} y={124 + n * 82} w={258} h={34} className="gds-pill gds-sq">
            {label}
          </I>
        ))}

        {/* 17 · 11:41 pm: everything melts into the Glyph mark */}
        <I b={DB.finale!} a={0.45} x={45} y={225} w={300} h={150} className="gds-glyph">
          {glyphOn ? <GooGlyphMark scheme={scheme} /> : null}
        </I>
        <I b={DB.finale!} a={1.0} fx="up" x={20} y={404} w={350} className="gds-center">
          <strong className="gds-final">This was your day.</strong>
        </I>
      </div>
      <I b={DB.finale!} a={1.5} fx="pop" x={95} y={470} w={200} className="gds-center gds-cta">
        {/* The one real control in the stage: hidden (so not focusable) until the finale. */}
        <button type="button" className="gh-go" onClick={() => openGetJokuh()} aria-haspopup="dialog">
          Get Jokuh
        </button>
      </I>
    </div>
  );
});

export default DayStoryStage;
