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
import { backOut, beatEnd, clamp01, easeOut, Face, FACE, I, IC, Icon, lerp, N, parseItems, paintItem, T, typedCount } from "./day-story-engine";
import DayStoryOrb, { DAY_ORB_ELLIPSE, type DayStoryOrbHandle } from "./DayStoryOrb";
import DaySpine, { type DaySpineHandle } from "./DaySpine";
import "../../../../styles/day-story.css";

/**
 * **Purpose:** The "day in the life" stage, played as a pure function of time from `day-story-beats.ts`. The morning
 * is the **desktop web app** as it really looks (references: the 5207 build at 1440 × 900): a black screen, the four goo
 * corner pills in the screen corners, the goo Nexus pill top centre, the Glyph mark + "ask anything" bar on home, sheets
 * as a wide squircle column, the Spine as the full-screen centre cord with hour beads and branching events, and the ID
 * page as the big portrait card with its pods in a bento around it. At "Heading out" the screen squeezes into a phone
 * and the rest of the day plays on mobile; the finale melts everything back into the Glyph mark on the open stage.
 * **Goo:** ONE Splex body (`A`) carries the whole day: Nexus pill → incoming call (drops bulge out of it) → call column
 * → melts down into the Spine cord → portrait card → home bar → DM column (rising out of the bar) → … → the Orb → a dot
 * that becomes the Glyph mark. Same-shape beats squish between them. `P` buds off `A` (plinth, OO sheet, answer, bud);
 * an inner layer holds pods, OOpolis, the call's Splex toolbar, Blurbs arches, cord beads and drips; each corner pill
 * and the Nexus have their own small goo layer. Every goo shape is a continuous-corner squircle, rewritten only while
 * it moves. Inputs type for real (characters + caret, then send).
 * **API:** `seek(t)`; no loop of its own (the player drives it from one rAF, the scroll section from scroll). HTML is
 * timed in JSX (`day-story-engine.tsx`) and written as transform / opacity / visibility only.
 * **Rules:** real OO art only; the Glyph mark is the frozen `GooGlyphMark` (placed and faded only); the Orb is the
 * app's goo Orb geometry (`DayStoryOrb`); the Blurbs heat rim is the app's painter (`blurb-heat-rim.ts`); the call
 * screens follow `call-field/`. Faces / photos are demo images (`public/day-story/`). Decorative except the finale's
 * Get Jokuh button. **Connects to:** `DayStoryPlayer`, `DayStoryScroll`.
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
const same = (p: Rect, q: Rect) => p.every((v, i) => Math.abs(v - q[i]!) < 0.01);
const local = (t: number) => {
  const i = dayBeatAt(t);
  return { i, u: t - DAY_STARTS[i]! };
};

/* ── The screen: desktop → phone ── */

const MOBILE_AT = DB.mobile!;
const FINALE = DAY_BEAT_COUNT - 1;
const desktopRect = (ext: number): Rect => [-ext, -40, W + 2 * ext, H + 80, 18];
const PHONE: Rect = [-14, -18, W + 28, H + 36, 60];

/** 0 = desktop screen, 1 = phone (the squeeze plays inside the "Heading out" beat). */
function mobileK(t: number): number {
  const s = DAY_STARTS[MOBILE_AT]!;
  if (t < s + 0.5) return 0;
  return backOut(clamp01((t - s - 0.5) / 1.2));
}
const shellRect = (t: number, ext: number): Rect => mixRect(desktopRect(ext), PHONE, mobileK(t));
const finFade = (t: number) => 1 - clamp01((t - DAY_STARTS[FINALE]! - 0.3) / 0.7);

const QUADS: CornerQuad[] = ["topLeading", "topTrailing", "bottomLeading", "bottomTrailing"];
const CORNER_INSET = 40;
function cornerAt(r: Rect, q: CornerQuad): { x: number; y: number } {
  const left = q === "topLeading" || q === "bottomLeading";
  const top = q === "topLeading" || q === "topTrailing";
  return { x: left ? r[0] + CORNER_INSET : r[0] + r[2] - CORNER_INSET, y: top ? r[1] + CORNER_INSET : r[1] + r[3] - CORNER_INSET };
}
/** Beats that start from a corner: that pill presses as the beat begins. */
const PRESSES: { beat: number; quad: CornerQuad; at: number }[] = [
  { beat: DB.call!, quad: "bottomLeading", at: 2.4 },
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

/* ── The one body ── */

/** Desktop sheet column (the 5207 web app: ≈ 0.67 wide-to-tall, near full height) and the phone column. */
const S_D: Rect = [-45, 37, 480, 716, 50];
const S_M: Rect = [10, 8, 370, 704, 54];
/** The Spine's cord (the real cord is 7 thick behind now): the one body melts into it, `DaySpine` draws the rest. */
const CORD_D: Rect = [191.5, 96, 7, 640, 3.5];
const CORD_M: Rect = [191.5, 120, 7, 560, 3.5];
const FOLD_STUB: Rect = [191.5, 150, 7, 160, 3.5];
const NEX_IDLE_D: Rect = [137, -12, 116, 36, 18];
const NEX_IDLE_M: Rect = [139, 16, 112, 34, 17];
const INCOMING: Rect = [55, -16, 280, 172, 42];
const BAR_D: Rect = [-50, 332, 490, 56, 28];
const BAR_M: Rect = [24, 332, 342, 56, 28];
const ASK_BAR: Rect = [24, 642, 342, 56, 28];
const ORB_R: Rect = [DAY_ORB_ELLIPSE.cx - DAY_ORB_ELLIPSE.rx, DAY_ORB_ELLIPSE.cy - DAY_ORB_ELLIPSE.ry, DAY_ORB_ELLIPSE.rx * 2, DAY_ORB_ELLIPSE.ry * 2, DAY_ORB_ELLIPSE.ry];
const PORTRAIT_W: Rect = [42, 100, 300, 300, 44];
/** A narrow host shows the phone ID: the full-width portrait card, then the first pods full width (as 5207 at 375). */
const PORTRAIT_N: Rect = [14, 84, 362, 300, 44];
const CARD: Rect = [52, 190, 286, 286, 40];
const DOT: Rect = [182, 286, 26, 26, 13];

/** Where A rests during beat `i`. */
function keyA(i: number, wide: boolean): Rect {
  switch (i) {
    case DB.call:
      return INCOMING;
    case DB.transcript:
      return S_D;
    case DB.spine:
      return CORD_D;
    case DB.profile:
      return wide ? PORTRAIT_W : PORTRAIT_N;
    case DB.mobile:
      return BAR_M;
    case DB.ask:
      return ASK_BAR;
    case DB.agents:
      return [150, 262, 90, 90, 45];
    case DB.blurb:
      return CARD;
    case DB.orb:
      return ORB_R;
    case DB.fold:
      return FOLD_STUB;
    case FINALE:
      return DOT;
    default:
      return S_M;
  }
}
/** Where A ends beat `i` (the 10:30 group chat melts into the Spine cord before the Doc). */
const endA = (i: number, wide: boolean): Rect => (i === DB.meet ? CORD_M : keyA(i, wide));
const MORPH = 0.9;

function bodyA(t: number, wide: boolean): Rect {
  const { i, u } = local(t);
  if (i === DB.call) {
    // The Nexus wobbles, then the incoming call goos out of it.
    const r = mixRect(NEX_IDLE_D, INCOMING, backOut(clamp01((u - 0.9) / 0.8)));
    const ring = (s: number) => (u > s ? Math.sin((u - s) * 22) * 7 * Math.exp(-(u - s) * 3) : 0);
    const wob = ring(0.35) + ring(1.9);
    return [r[0] - wob / 2, r[1] + wob / 6, r[2] + wob, r[3] - wob / 3, r[4]];
  }
  if (i === DB.meet && u >= 1.8) return mixRect(S_M, CORD_M, backOut(clamp01((u - 1.8) / 0.8)));
  const from = endA(i - 1, wide);
  const to = keyA(i, wide);
  if (same(from, to)) {
    // Same surface again: it squishes and settles, so the change still reads as liquid.
    const b = Math.sin(Math.PI * clamp01(u / 0.75)) * 0.5;
    const sq: Rect = [to[0] + 26, to[1] + 70, to[2] - 52, to[3] - 140, to[4] * 1.2];
    return mixRect(to, sq, b);
  }
  return mixRect(from, to, backOut(clamp01(u / MORPH)));
}

function keyP(i: number, _wide: boolean): Rect | null {
  switch (i) {
    case DB.profile:
      return [140, 80, 110, 8, 4];
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
function bodyP(t: number, a: Rect, wide: boolean): Rect {
  const { i, u } = local(t);
  const prev = i > 0 ? keyP(i - 1, wide) : null;
  const next = keyP(i, wide);
  if (!prev && !next) return centerOf(a);
  const k = next ? backOut(clamp01((u - 0.3) / MORPH)) : easeOut(clamp01(u / (MORPH * 0.8)));
  return mixRect(prev ?? centerOf(a), next ?? centerOf(a), k);
}

/** The Nexus pill (own goo): ∞ when idle, the call pill while you talk, the title on Spine, the Orb's island. */
const NEX_CALL_D: Rect = [120, -12, 150, 36, 18];
const NEX_TITLE_D: Rect = [130, -12, 130, 36, 18];
const NEX_TITLE_M: Rect = [130, 16, 130, 34, 17];
const NEX_LIVE: Rect = [105, 16, 180, 34, 17];
function nexusRect(i: number, t: number): Rect {
  switch (i) {
    case DB.call:
      return [195, 6, 0, 0, 0];
    case DB.transcript:
      return NEX_CALL_D;
    case DB.spine:
      return NEX_TITLE_D;
    case DB.profile:
      return NEX_IDLE_D;
    case DB.mobile:
      return mixRect(NEX_IDLE_D, NEX_IDLE_M, mobileK(t));
    case DB.orb:
      return NEX_LIVE;
    case DB.fold:
      return NEX_TITLE_M;
    case FINALE:
      return [195, 33, 0, 0, 0];
    default:
      return NEX_IDLE_M;
  }
}
function bodyN(t: number): Rect {
  const { i, u } = local(t);
  const to = nexusRect(i, t);
  if (i === 0) return to;
  const from = nexusRect(i - 1, DAY_STARTS[i]! - 0.001);
  return mixRect(from, to, backOut(clamp01(u / 0.6)));
}

/** Inner goo rects (profile pods, OOpolis buildings): snap in with their HTML, melt out at the end of `e`. */
type GooRect = { b: number; e?: number; a: number; x: number; y: number; w: number; h: number; r: number; dx?: number; dy?: number };

type PodKey = "music" | "gallery" | "location" | "spine" | "bubble" | "page" | "blurbs" | "contact";
type Pod = { key: PodKey; a: number; dx: number; dy: number; n: [number, number, number, number]; w: [number, number, number, number] };
/**
 * The ID page's pods filling the real bento (`utils/profile-pod-bento-layout.ts`: 4 × 3 lattice, the profile hero over
 * cols 1–2 / rows 0–1, eight companion slots L0–L2 · B0 B1 · R0–R2), every slot taken by a real pod kind from
 * `PROFILE_POD_CATALOG`. `n` = a narrow host: the phone stack with half-width pairs (`phoneSpan` 1).
 * Each pod is its own tile; goo only drips them into place.
 */
const TILE = 146;
const COL = [-112, 42, 196, 350];
const ROW = [100, 254, 408];
const PODS: Pod[] = [
  { key: "music", a: 0.7, dx: -80, dy: -20, w: [COL[0]!, ROW[0]!, TILE, TILE], n: [14, 392, 177, 96] },
  { key: "gallery", a: 0.8, dx: -80, dy: 0, w: [COL[0]!, ROW[1]!, TILE, TILE], n: [199, 392, 177, 96] },
  { key: "location", a: 0.9, dx: -80, dy: 20, w: [COL[0]!, ROW[2]!, TILE, TILE], n: [14, 494, 177, 96] },
  { key: "bubble", a: 1.0, dx: -20, dy: 50, w: [COL[1]!, ROW[2]!, TILE, TILE], n: [14, 596, 177, 96] },
  { key: "page", a: 1.1, dx: 20, dy: 50, w: [COL[2]!, ROW[2]!, TILE, TILE], n: [199, 596, 177, 96] },
  { key: "spine", a: 1.2, dx: 80, dy: -20, w: [COL[3]!, ROW[0]!, TILE, TILE], n: [199, 494, 177, 96] },
  { key: "contact", a: 1.3, dx: 80, dy: 0, w: [COL[3]!, ROW[1]!, TILE, TILE], n: [14, 392, 0, 0] },
  { key: "blurbs", a: 1.4, dx: 80, dy: 20, w: [COL[3]!, ROW[2]!, TILE, TILE], n: [14, 392, 0, 0] },
];
const podBox = (p: Pod, wide: boolean) => {
  const b = wide ? p.w : p.n;
  return b[2] > 0 ? b : null;
};

const BUILDINGS: GooRect[] = [
  { b: DB.agents!, a: 0.3, x: 36, y: 136, w: 100, h: 74, r: 22, dx: -30 },
  { b: DB.agents!, a: 0.4, x: 254, y: 136, w: 100, h: 74, r: 22, dx: 30 },
  { b: DB.agents!, a: 0.5, x: 36, y: 404, w: 100, h: 74, r: 22, dx: -30 },
  { b: DB.agents!, a: 0.6, x: 254, y: 404, w: 100, h: 74, r: 22, dx: 30 },
];

function gooRects(_wide: boolean): GooRect[] {
  return [...BUILDINGS];
}

function gooRectAt(g: GooRect, t: number): Rect | null {
  const s = DAY_STARTS[g.b]! + g.a;
  const end = beatEnd(g.e ?? g.b);
  if (t < s || t > end) return null;
  const k = backOut(clamp01((t - s) / 0.5));
  const out = Number.isFinite(end) ? clamp01((end - t) / 0.3) : 1;
  const sc = (0.35 + 0.65 * k) * out;
  const cx = g.x + g.w / 2 + (g.dx ?? 0) * (1 - k);
  const cy = g.y + g.h / 2 + (g.dy ?? 0) * (1 - k);
  return [cx - (g.w * sc) / 2, cy - (g.h * sc) / 2, g.w * sc, g.h * sc, g.r * sc];
}

type Drop = { b: number; e?: number; a: number; z?: number; x0: number; y0: number; x1?: number; y1?: number; r: number; mode: "fall" | "bulge" | "sit" | "move" };

const QUEEN = { x: 195, y: 307 };
const BLDG_DOORS = BUILDINGS.map((g) => ({ x: g.x + g.w / 2, y: g.y + g.h / 2 }));
/** The call's Splex toolbar: five Ø 40 cups at 3.25·R pitch with pinched necks (`controls/CallSelfSplex.tsx`). */
const SPLEX_Y = 652;
const SPLEX_X = [65, 130, 195, 260, 325];
const DROPS: Drop[] = [
  // The incoming call goos out of the Nexus: drops bulge under it while it rings.
  { b: DB.call!, a: 1.1, z: 2.0, x0: 195, y0: 170, r: 14, mode: "bulge" },
  { b: DB.call!, a: 1.9, z: 2.9, x0: 195, y0: 170, r: 11, mode: "bulge" },
  { b: DB.call!, a: 1.4, z: 2.4, x0: 120, y0: 166, r: 9, mode: "bulge" },
  { b: DB.call!, a: 1.6, z: 2.6, x0: 270, y0: 166, r: 9, mode: "bulge" },
  ...SPLEX_X.map((x, n) => ({ b: DB.transcript!, a: 0.5 + n * 0.06, x0: x, y0: SPLEX_Y, r: 20, mode: "sit" as const })),
  ...SPLEX_X.slice(0, 4).map((x, n) => ({ b: DB.transcript!, a: 0.6 + n * 0.06, x0: x + 32.5, y0: SPLEX_Y, r: 8, mode: "sit" as const })),
  // OOpolis streets (bead chains Queen → buildings) and babies budding off the Queen.
  ...BLDG_DOORS.flatMap((d, n) =>
    [0.25, 0.42, 0.59, 0.76].map((q, j) => ({ b: DB.agents!, a: 0.35 + n * 0.08 + j * 0.05, x0: lerp(QUEEN.x, d.x, q), y0: lerp(QUEEN.y, d.y, q), r: 5.5, mode: "sit" as const })),
  ),
  ...BLDG_DOORS.map((d, n) => ({ b: DB.agents!, a: 0.9 + n * 0.1, z: 1.7 + n * 0.1, x0: QUEEN.x, y0: QUEEN.y, x1: lerp(QUEEN.x, d.x, 0.75), y1: lerp(QUEEN.y, d.y, 0.75), r: 12, mode: "move" as const })),
  // Profile: pods drip out of the portrait card on their way to the bento.
  { b: DB.profile!, a: 0.55, z: 1.25, x0: 120, y0: 250, x1: -35, y1: 190, r: 12, mode: "move" },
  { b: DB.profile!, a: 0.75, z: 1.45, x0: 270, y0: 250, x1: 425, y1: 250, r: 12, mode: "move" },
  { b: DB.profile!, a: 0.95, z: 1.65, x0: 195, y0: 390, x1: 195, y1: 470, r: 12, mode: "move" },
  // Blurbs: the author's pearl pours its tail.
  { b: DB.blurb!, a: 1.0, x0: 77, y0: 166, r: 22, mode: "sit" },
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

/** Blurbs: you type the caption, send, the card lands, then Fire rolls in. */
const BLURB_BEAT = DB.blurb!;
const POST_AT = 0.85;
const FIRE_AT = 1.4;
const FIRE_DUR = 2.2;
const fireCount = (u: number) => Math.round(24 * easeOut(clamp01((u - FIRE_AT) / FIRE_DUR)));
const ORB_BEAT = DB.orb!;

/** The sheet layer steps aside while the Orb scene is up, and melts away at the finale. */
function sheetOpacity(t: number): number {
  const o0 = DAY_STARTS[ORB_BEAT]!;
  const o1 = beatEnd(ORB_BEAT);
  let op = 1;
  if (t >= o0 && t < o1) op = 1 - clamp01((t - o0 - 0.2) / 0.5);
  else if (t >= o1 && t < o1 + 0.6) op = clamp01((t - o1) / 0.5);
  return Math.min(op, 1 - clamp01((t - DAY_STARTS[FINALE]! - 0.9) / 0.6));
}

/* ── Chrome pieces ── */

function Bead({ d, red, children }: { d?: string; red?: boolean; children?: ReactNode }) {
  return <span className={`gds-hbead${red ? " gds-hbead--red" : ""}`}>{children ?? <Icon d={d!} size={18} />}</span>;
}

/** A phone sheet's header: left bead, centre title (or pill), right bead (clear of the corner pills). */
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

/** A composer that types for real: placeholder → characters + caret → send bead → sent (empty again). */
function Composer({ b, e, z, a = 0.4, x, y, w, h = 48, ph, text, ta, td = 0.7, send, plus = true }: {
  b: number;
  e?: number;
  z?: number;
  a?: number;
  x: number;
  y: number;
  w: number;
  h?: number;
  ph: string;
  text?: string;
  ta?: number;
  td?: number;
  send?: number;
  plus?: boolean;
}) {
  return (
    <I b={b} e={e} z={z} a={a} fx="up" x={x} y={y} w={w} h={h} className="gds-composer gds-sq">
      {plus ? <Icon d={IC.plus} size={16} /> : null}
      <span className="gds-composer__field">{text ? <T b={b} a={ta ?? a + 0.2} d={td} z={send} ph={ph} text={text} /> : <span className="gds-composer__ph">{ph}</span>}</span>
      {text && send != null ? (
        <I b={b} a={(ta ?? a + 0.2) + td} z={send + 0.15} fx="pop" className="gds-sendbead">
          <Icon d="M12 19V5M6 11l6-6 6 6" size={14} stroke={2.4} />
        </I>
      ) : null}
      <Icon d={IC.mic} size={16} />
    </I>
  );
}

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
  const wide = ext >= 140;
  const rootRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<SVGPathElement>(null);
  const shellSvg = useRef<SVGSVGElement>(null);
  const aRef = useRef<SVGPathElement>(null);
  const pRef = useRef<SVGPathElement>(null);
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
  const spineRef = useRef<DaySpineHandle | null>(null);
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
  const css = (el: HTMLElement | SVGElement | null, prop: "opacity" | "transform", v: string) => {
    if (el && el.style[prop] !== v) el.style[prop] = v;
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
    paintHeat(ctx, "fire", clamp01((fire - 6) / 18), CARD[2], CARD[3], 40, u, clamp01((u - FIRE_AT - 0.3) / 1.0), light);
  };

  const seek = (raw: number) => {
    const t = Math.max(0, raw);
    lastT.current = t;
    const p = parsed.current;
    if (!p) return;
    const g = geoRef.current;
    const { i: bi } = local(t);
    const ff = finFade(t);
    // Screen + corners.
    const shell = shellRect(t, g.ext);
    put(shellRef.current, "d", squircle(shell));
    css(shellSvg.current, "opacity", ff.toFixed(2));
    const blurbSwap = t >= DAY_STARTS[BLURB_BEAT]! + 0.2 && t <= beatEnd(BLURB_BEAT) - 0.1;
    QUADS.forEach((q, n) => {
      const c = cornerAt(shell, q);
      const pk = pressAt(t, q);
      put(
        cornerGoo.current[n] ?? null,
        "transform",
        `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${cornerRotation(q)}) scale(${(1 + 0.16 * pk).toFixed(3)} ${(1 - 0.2 * pk).toFixed(3)}) translate(-20 -27)`,
      );
      const ic = cornerIcons.current[n] ?? null;
      css(ic, "transform", `translate3d(${(c.x - 28).toFixed(1)}px, ${(c.y - 28).toFixed(1)}px, 0)`);
      css(ic, "opacity", blurbSwap ? "0" : ff.toFixed(2));
      const gl = cornerGlows.current[n] ?? null;
      css(gl, "transform", `translate3d(${(c.x - 40).toFixed(1)}px, ${(c.y - 40).toFixed(1)}px, 0) scale(${(0.8 + 0.5 * (1 - pk)).toFixed(3)})`);
      css(gl, "opacity", pk.toFixed(2));
    });
    put(nRef.current, "d", squircle(bodyN(t)));
    // The one body + its bud.
    const a = bodyA(t, g.wide);
    put(aRef.current, "d", squircle(a));
    put(pRef.current, "d", squircle(bodyP(t, a, g.wide)));
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
    css(sheetRef.current, "opacity", sheetOpacity(t).toFixed(2));
    css(innerRef.current, "opacity", ff.toFixed(2));
    css(chromeRef.current, "opacity", ff.toFixed(2));
    // Scenes with their own painters.
    const o0 = DAY_STARTS[ORB_BEAT]!;
    if (t >= o0 && t <= beatEnd(ORB_BEAT)) orbRef.current?.paint(t - o0);
    if (bi === BLURB_BEAT) paintHeatRim(t);
    // The real Spine paints while one of its moments is up.
    const su = t - DAY_STARTS[bi]!;
    if (bi === DB.spine) spineRef.current?.paint("land", su);
    else if (bi === DB.meet && su >= 1.7) spineRef.current?.paint("meet", su - 1.8);
    else if (bi === DB.fold) spineRef.current?.paint("fold", su);
    for (const it of p.items) paintItem(it, t);
    for (const ty of p.typers) {
      const n = typedCount(ty, t);
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
  const spineOn = Math.abs(beat - DB.spine!) <= 1 ? "land" : Math.abs(beat - DB.meet!) <= 1 ? "meet" : Math.abs(beat - DB.fold!) <= 1 ? "fold" : null;
  const homeGlyphOn = beat <= DB.call! + 1 || Math.abs(beat - MOBILE_AT) <= 1;
  const finaleGlyphOn = beat >= FINALE - 1;
  const fill = roleColor(scheme, "base");
  const padX = ext + 90;
  const vb = { x: -padX, y: -90, w: W + 2 * padX, h: H + 180 };
  const innerX = wide ? -200 : -20;
  const desk = desktopRect(ext);
  const portrait = wide ? PORTRAIT_W : PORTRAIT_N;

  return (
    <div ref={rootRef} className="gds" style={{ width: W, height: H }}>
      <div className="gds-art" aria-hidden>
        {/* The screen: the desktop app's black screen, squeezing into a phone at "Heading out". */}
        <svg ref={shellSvg} className="gds-shell" style={{ left: vb.x, top: vb.y }} width={vb.w} height={vb.h} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}>
          <path ref={shellRef} className="gds-shell__frame" />
        </svg>
        <I b={MOBILE_AT} e={DB.fold} a={1.2} x={145} y={726} w={100} h={5} className="gds-homebar" />

        <svg className="gds-goo" style={{ left: vb.x, top: vb.y }} width={vb.w} height={vb.h} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}>
          <defs>
            <GooFilter id={`gds-a-${uid}`} x={-70} y={-60} width={W + 140} height={H + 120} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
            <GooFilter id={`gds-b-${uid}`} x={innerX} y={-60} width={W - innerX * 2} height={H + 120} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
            <GooFilter id={`gds-n-${uid}`} x={60} y={-40} width={W - 120} height={110} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
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

        {/* Nexus contents: ∞ when idle, titles, the call pill. */}
        <I b={DB.profile!} e={MOBILE_AT} z={0.5} a={0.4} x={NEX_IDLE_D[0]} y={NEX_IDLE_D[1]} w={NEX_IDLE_D[2]} h={NEX_IDLE_D[3]} className="gds-nexusglyph">
          <Infinity />
        </I>
        <I b={MOBILE_AT} e={BLURB_BEAT} a={1.5} x={NEX_IDLE_M[0]} y={NEX_IDLE_M[1]} w={NEX_IDLE_M[2]} h={NEX_IDLE_M[3]} className="gds-nexusglyph">
          <Infinity />
        </I>
        <I b={DB.spine!} a={0.5} x={NEX_TITLE_D[0]} y={NEX_TITLE_D[1]} w={NEX_TITLE_D[2]} h={NEX_TITLE_D[3]} className="gds-nexustitle">
          October
        </I>
        <I b={DB.fold!} a={0.5} x={NEX_TITLE_M[0]} y={NEX_TITLE_M[1]} w={NEX_TITLE_M[2]} h={NEX_TITLE_M[3]} className="gds-nexustitle">
          October
        </I>

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

        {/* 0 · 7:58 am (desktop home): Glyph mark + "ask anything", you start typing, then Maya calls out of the Nexus. */}
        <I b={DB.call!} z={2.9} a={0} x={45} y={285} w={300} h={150} className="gds-glyph">
          {homeGlyphOn ? <GooGlyphMark scheme={scheme} /> : null}
        </I>
        <I b={DB.call!} z={2.9} a={0} x={BAR_D[0]} y={BAR_D[1]} w={BAR_D[2]} h={BAR_D[3]} className="gds-ask gds-ask--home">
          <span className="gds-ask__plus">
            <Icon d={IC.plus} size={16} />
          </span>
          <span className="gds-ask__text">
            <T b={DB.call!} a={0.2} d={0.7} z={1.2} ph="ask anything" text="what's on today?" />
          </span>
          <span className="gds-ask__plus">
            <Icon d={IC.mic} size={16} />
          </span>
        </I>
        <I b={DB.call!} a={1.4} z={3.3} x={INCOMING[0]} y={INCOMING[1]} w={INCOMING[2]} h={INCOMING[3]} className="gds-incoming">
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

        {/* 1 · 7:59 am (desktop): the call field in the wide column */}
        <I b={DB.transcript!} a={0.4} x={NEX_CALL_D[0]} y={NEX_CALL_D[1]} w={NEX_CALL_D[2]} h={NEX_CALL_D[3]} className="gds-callpill">
          <span className="gds-livedot" />
          <N b={DB.transcript!} a={0} d={4} from={4} to={42} clock />
          <span className="gds-muted">Maya</span>
        </I>
        <I b={DB.transcript!} a={0.35} fx="pop" sc={0.85} x={0} y={70} w={390} h={400} className="gds-callsq">
          <img src={FACE("maya-call")} alt="" />
          <span className="gds-callsq__name">Maya</span>
        </I>
        <I b={DB.transcript!} a={0.5} fx="fade" x={0} y={70} w={390} h={400} className="gds-speakring" />
        <I b={DB.transcript!} a={0.7} fx="pop" x={296} y={392} w={90} h={108} className="gds-callsq gds-callsq--pip">
          <img src={FACE("you-portrait")} alt="" />
        </I>
        {[
          { a: 0.8, who: "maya", me: false, text: "Free this week?" },
          { a: 1.5, who: "you", me: true, text: "Thursday morning works." },
          { a: 2.2, who: "maya", me: false, text: "Coffee Thursday? 9 at Blue Bottle." },
        ].map((l, n) => (
          <I key={n} b={DB.transcript!} a={l.a} fx="up" x={0} y={510 + n * 38} w={390} className={`gds-tline${l.me ? " gds-tline--me" : ""}`}>
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
        <Composer b={DB.transcript!} a={0.5} x={-20} y={692} w={430} h={44} ph="Message" text="Sending you the Blue Bottle pin" ta={2.9} td={0.8} send={3.85} />

        {/* 2 · 8:06 am (desktop): the real Spine; Maya's call lands as a bead at 8 AM and the hour opens */}
        <I b={DB.spine!} a={0} x={0} y={0} w={W} h={H + 40} className="gds-spineitem">
          {spineOn === "land" ? <DaySpine ref={spineRef} scheme={scheme} mode="land" height={H + 40} /> : null}
        </I>

        {/* 4 · 8:15 am (desktop ID page, as the real one renders): your name, the portrait card in its goo rim with
            the OO capsule and wallet chip on the photo and the Network strip under it, the pods in the bento, then
            Edit profile and Go Live. */}
        <I b={DB.profile!} a={0.4} fx="down" x={95} y={50} w={200} h={26} className="gds-center gds-profname">
          You
        </I>
        <I b={DB.profile!} a={0.6} fx="fade" x={portrait[0] + 6} y={portrait[1] + 6} w={portrait[2] - 12} h={portrait[3] - 82} className="gds-portrait">
          <img src={FACE("you-portrait")} alt="" draggable={false} />
          <I b={DB.profile!} a={1.1} fx="pop" className="gds-avatarcap">
            <JokuhOO size={30} />
            <span>
              <i />
              <i />
            </span>
          </I>
          <I b={DB.profile!} a={1.2} fx="pop" className="gds-walletchip">
            <strong>$1,284.20</strong>
            <small>↗ 2.1%</small>
          </I>
        </I>
        <I b={DB.profile!} a={1.35} fx="up" x={portrait[0] + 6} y={portrait[1] + portrait[3] - 70} w={portrait[2] - 12} h={62} className="gds-network">
          {["maya", "leo", "june"].map((n) => (
            <img key={n} className="gds-network__bead" src={FACE(n)} alt="" />
          ))}
          <span className="gds-network__label">
            <strong>Network</strong>
            <small>8 connections</small>
          </span>
          {["kenji", "lyra", "malik"].map((n) => (
            <img key={n} className="gds-network__bead" src={FACE(n)} alt="" />
          ))}
        </I>
        {PODS.map((pod) => {
          const box = podBox(pod, wide);
          if (!box) return null;
          const [x, y, w, h] = box;
          return (
            <I key={pod.key} b={DB.profile!} a={pod.a + 0.1} fx="snap" sc={0.4} dx={pod.dx} dy={pod.dy} x={x} y={y} w={w} h={h} className={`gds-pod gds-pod--${pod.key}${w > h * 1.6 ? " is-row" : ""}`}>
              {pod.key === "music" ? (
                <>
                  <span className="gds-vinyl">
                    <img src={FACE("music")} alt="" />
                  </span>
                  <span className="gds-track">
                    <span>
                      <strong>Blue Hour</strong>
                      <small>Loma</small>
                    </span>
                    <span className="gds-track__play">
                      <Icon d="M8 5.5v13l10.5-6.5z" size={10} />
                    </span>
                  </span>
                </>
              ) : pod.key === "gallery" ? (
                <>
                  <span className="gds-strip">
                    <img src={FACE("mood-walk")} alt="" />
                  </span>
                  <span className="gds-strip__thumbs">
                    <img src={FACE("mood-coast")} alt="" />
                    <img src={FACE("gallery")} alt="" />
                  </span>
                </>
              ) : pod.key === "location" ? (
                <>
                  <svg className="gds-map" viewBox="0 0 150 140" preserveAspectRatio="xMidYMid slice" aria-hidden>
                    <rect width="150" height="140" fill="#2b2f33" />
                    <path d="M-10 30 C 40 60, 90 20, 160 50" stroke="#1d2024" strokeWidth="16" fill="none" />
                    <path d="M20 -10 C 30 60, 10 100, 40 150" stroke="#1d2024" strokeWidth="12" fill="none" />
                    <path d="M-10 110 C 50 80, 110 120, 160 90" stroke="#5b6066" strokeWidth="7" fill="none" />
                    <path d="M110 -10 C 100 50, 130 90, 120 150" stroke="#3a3f44" strokeWidth="5" fill="none" />
                  </svg>
                  <span className="gds-map__dot" />
                  <span className="gds-map__city">Echo Park</span>
                </>
              ) : pod.key === "spine" ? (
                <>
                  <strong className="gds-podtitle">Spine</strong>
                  <span className="gds-spinepod">
                    <span className="gds-spinepod__day">
                      <small>Sun</small>
                      <i />
                      18
                    </span>
                    <span className="gds-spinepod__day is-today">
                      <small>Mon</small>
                      <i />
                      19
                    </span>
                    <span className="gds-spinepod__dots">
                      {Array.from({ length: 11 }, (_, i) => (
                        <i key={i} className={i === 8 || i === 9 ? "is-on" : undefined} />
                      ))}
                    </span>
                    <span className="gds-spinepod__day">
                      <small>Tue</small>
                      <i />
                      20
                    </span>
                  </span>
                  <small className="gds-spinepod__foot">Activity · Book a time</small>
                </>
              ) : pod.key === "bubble" ? (
                <>
                  <span className="gds-bubbledisc">
                    <Icon d="M12 12m-1 0a1 1 0 1 0 2 0a3 3 0 1 0-6 0a5 5 0 1 0 10 0" size={22} />
                  </span>
                  <span className="gds-bubblepill">
                    <strong>Tulum crew</strong>
                    <small>3 members</small>
                  </span>
                </>
              ) : pod.key === "page" ? (
                <>
                  <strong className="gds-podtitle">My page</strong>
                  <small className="gds-page__text">Trips, film photos and the coffee spots I keep going back to.</small>
                  <span className="gds-page__open">
                    <span className="gds-contactpod__icon">
                      <Icon d={IC.doc} size={12} />
                    </span>
                    Open page
                  </span>
                </>
              ) : pod.key === "blurbs" ? (
                <>
                  <span className="gds-orbits">
                    <i />
                    <i />
                    <i />
                    <img src={FACE("you")} alt="" />
                  </span>
                  <span className="gds-orbits__bubble">Lake loop after a good day.</span>
                </>
              ) : (
                <span className="gds-contactpod">
                  <span className="gds-contactpod__half">
                    <span className="gds-contactpod__icon">
                      <Icon d={IC.chat} size={13} />
                    </span>
                    <span>
                      <strong>Chat</strong>
                      <small>No connection needed</small>
                    </span>
                  </span>
                  <span className="gds-contactpod__link" />
                  <span className="gds-contactpod__half">
                    <span className="gds-contactpod__icon">
                      <Icon d={IC.mail} size={13} />
                    </span>
                    <strong>Mail</strong>
                  </span>
                </span>
              )}
            </I>
          );
        })}
        <I b={DB.profile!} a={2.0} fx="up" x={wide ? 138 : 50} y={wide ? 566 : 702} w={wide ? 114 : 130} h={wide ? 34 : 40} className="gds-editpill gds-sq">
          Edit profile
        </I>
        <I b={DB.profile!} a={2.1} fx="up" x={wide ? 126 : 196} y={wide ? 606 : 700} w={wide ? 138 : 144} h={wide ? 46 : 44} className="gds-golive">
          <Icon d={IC.radio} size={18} /> Go Live
        </I>

        {/* 5 · 8:52 am: "Heading out": the screen squeezes into a phone; the home bar types */}
        <I b={MOBILE_AT} a={0.2} x={45} y={285} w={300} h={150} className="gds-glyph">
          {homeGlyphOn ? <GooGlyphMark scheme={scheme} /> : null}
        </I>
        <I b={MOBILE_AT} a={0.3} x={BAR_M[0]} y={BAR_M[1]} w={BAR_M[2]} h={BAR_M[3]} className="gds-ask gds-ask--home">
          <span className="gds-ask__plus">
            <Icon d={IC.plus} size={16} />
          </span>
          <span className="gds-ask__text">
            <T b={MOBILE_AT} a={1.4} d={0.9} ph="ask anything" text="message Maya" />
          </span>
          <span className="gds-ask__plus">
            <Icon d={IC.mic} size={16} />
          </span>
        </I>
        <I b={MOBILE_AT} a={0.2} x={45} y={440} w={300} className="gds-center">
          <small className="gds-muted gds-small">Going mobile…</small>
        </I>

        {/* 6 · 9:12 am: DM sheet rises out of the bar; you type, send, OO's coach turns it into a meeting */}
        <Head b={DB.dm!} e={DB.wallet} left={<Bead d={IC.chevLeft} />} right={<Bead d={IC.phone} />}>
          <span className="gds-namepill gds-sq">
            <Face name="maya" size={26} />
            <span>
              <strong>Maya</strong>
              <small>online</small>
            </span>
          </span>
        </Head>
        <I b={DB.dm!} e={DB.wallet} a={0.35} fx="left" x={30} y={118} w={330} className="gds-row">
          <span className="gds-bub">Still on for Thursday?</span>
        </I>
        <I b={DB.dm!} e={DB.wallet} a={1.3} fx="right" x={30} y={166} w={330} className="gds-row gds-row--me">
          <span className="gds-bub gds-bub--me">Yes! 9 at Blue Bottle</span>
        </I>
        <I b={DB.dm!} a={1.7} z={2.5} fx="pop" x={30} y={222} w={330} className="gds-row gds-row--me">
          <span className="gds-coach gds-slab">
            <JokuhOO size={22} />
            Lock in Thursday?
          </span>
        </I>
        <I b={DB.dm!} e={DB.wallet} a={2.55} fx="pop" x={30} y={218} w={330} className="gds-meet gds-slab gds-sq">
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
        <Composer b={DB.dm!} a={0.3} x={24} y={644} w={342} ph="Message" text="Yes! 9 at Blue Bottle" ta={0.5} td={0.6} send={1.25} />

        {/* 7 · 9:13 am: wallet request → you type, pay → Paid, in the chat */}
        <I b={DB.wallet!} a={0.2} fx="left" x={30} y={302} w={330} className="gds-row">
          <span className="gds-bub">And you still owe me last week's coffee.</span>
        </I>
        <I b={DB.wallet!} a={0.55} fx="pop" x={30} y={354} w={300} h={128} className="gds-pay gds-slab gds-sq">
          <span className="gds-pay__top">
            <span className="gds-pay__coin">
              <Icon d={IC.coin} size={18} />
            </span>
            <small>Maya requested</small>
          </span>
          <strong className="gds-pay__amt">6 USDC</strong>
          <small className="gds-muted">Coffee, last week</small>
          <I b={DB.wallet!} a={0.8} z={1.95} fx="fade" className="gds-pay__btn">
            Pay
          </I>
          <I b={DB.wallet!} a={1.95} fx="pop" className="gds-pay__btn gds-pay__btn--done">
            <Icon d={IC.check} size={14} stroke={2.6} /> Paid
          </I>
        </I>
        <I b={DB.wallet!} a={2.15} fx="right" x={30} y={496} w={330} className="gds-row gds-row--me">
          <span className="gds-bub gds-bub--me">Paid. See you Thursday!</span>
        </I>
        <Composer b={DB.wallet!} a={0} x={24} y={644} w={342} ph="Message" text="Paid. See you Thursday!" ta={1.2} td={0.7} send={2.05} />

        {/* 8 · 10:30 am: group chat join card; you type "joining", the call; its note lands on the Spine cord */}
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
        <I b={DB.meet!} a={0.3} z={1.8} fx="left" x={30} y={120} w={330} className="gds-row">
          <span className="gds-bub">Starting now, hop in</span>
        </I>
        <I b={DB.meet!} a={0.5} z={1.8} fx="pop" x={30} y={172} w={330} h={76} className="gds-joincard gds-slab gds-sq">
          <span className="gds-faces">
            <Face name="leo" size={34} />
            <Face name="june" size={34} />
            <Face name="kenji" size={34} />
          </span>
          <span>
            <strong>Design sync is live</strong>
            <small>Jokuh Meet · 10:30</small>
          </span>
          <I b={DB.meet!} a={0.8} z={1.8} fx="pop" className="gds-joinbtn">
            Join
          </I>
        </I>
        <I b={DB.meet!} a={1.25} z={1.8} fx="right" x={30} y={262} w={330} className="gds-row gds-row--me">
          <span className="gds-bub gds-bub--me">Joining!</span>
        </I>
        <Composer b={DB.meet!} z={1.8} a={0.3} x={24} y={644} w={342} ph="Message" text="Joining!" ta={0.7} td={0.4} send={1.2} />
        <I b={DB.meet!} a={1.8} x={0} y={0} w={W} h={H} className="gds-spineitem">
          {spineOn === "meet" ? <DaySpine ref={spineRef} scheme={scheme} mode="meet" height={H} /> : null}
        </I>

        {/* 9 · 11:20 am: the note becomes a Doc (typed), shared to the Space, mailed out */}
        <Head b={DB.docs!} left={<Bead d={IC.doc} />} right={<Bead d={IC.share} />}>
          <strong>Design sync notes</strong>
          <small>Doc · editing</small>
        </Head>
        <I b={DB.docs!} a={0.3} fx="fade" x={40} y={116} w={310} className="gds-docline">
          <T b={DB.docs!} a={0.4} d={1.0} text="Ship the new onboarding Thursday at 11. June owns the copy pass." />
        </I>
        {[0, 1, 2, 3, 4].map((n) => (
          <I key={n} b={DB.docs!} a={0.9 + n * 0.08} fx="wipe" x={40} y={200 + n * 30} w={n === 4 ? 140 : n % 3 === 1 ? 250 : 300} h={11} className="gds-line" />
        ))}
        <I b={DB.docs!} a={1.4} fx="pop" x={40} y={392} w={250} className="gds-space">
          <span className="gds-faces gds-faces--sm">
            <Face name="leo" size={24} />
            <Face name="june" size={24} />
          </span>
          Shared to Space · Design crew
        </I>
        <I b={DB.docs!} a={1.8} fx="up" x={30} y={560} w={330} h={110} className="gds-mailcompose gds-slab gds-sq">
          <span className="gds-mailcompose__row">
            <small>From</small> you@jokuh.com
          </span>
          <span className="gds-mailcompose__row">
            <small>To</small>
            <T b={DB.docs!} a={2.0} d={0.5} ph="" text="Leo, June" />
          </span>
          <span className="gds-mailcompose__row">
            <small>Subject</small> Design sync notes
            <I b={DB.docs!} a={2.7} fx="pop" className="gds-mailsent">
              <Icon d={IC.check} size={12} stroke={2.6} /> Sent
            </I>
          </span>
        </I>

        {/* 10 · 12:30 pm: Ask OO types; the OO sheet rises off the bar */}
        <I b={DB.ask!} a={0.4} x={ASK_BAR[0]} y={ASK_BAR[1]} w={ASK_BAR[2]} h={ASK_BAR[3]} className="gds-ask">
          <span className="gds-ask__plus">
            <Icon d={IC.plus} size={16} />
          </span>
          <span className="gds-ask__text">
            <T b={DB.ask!} a={0.5} d={0.8} z={1.45} ph="ask anything" text="plan my Thursday" />
          </span>
          <I b={DB.ask!} a={1.3} z={1.55} fx="pop" className="gds-ask__send">
            <Icon d="M12 19V5M6 11l6-6 6 6" size={16} stroke={2.4} />
          </I>
        </I>
        <Head b={DB.ask!} a={1.5} left={<Bead d={IC.chevDown} />}>
          <span className="gds-oohead">
            <JokuhOO size={26} label="OO" />
            <strong>OO</strong>
          </span>
        </Head>
        <I b={DB.ask!} a={1.6} fx="right" x={30} y={108} w={330} className="gds-row gds-row--me">
          <span className="gds-bub gds-bub--me">plan my Thursday</span>
        </I>
        <I b={DB.ask!} a={1.8} fx="fade" x={36} y={156} w={318} className="gds-oo__lead">
          Here's your Thursday:
        </I>
        {[
          ["9:00 am", "Coffee with Maya · Blue Bottle"],
          ["11:00 am", "Ship the new onboarding"],
          ["12:30 pm", "Lunch, kept free"],
          ["6:00 pm", "Pack for Tulum"],
        ].map(([time, what], n) => (
          <I key={time} b={DB.ask!} a={1.95 + n * 0.14} fx="up" x={36} y={196 + n * 60} w={318} h={50} className="gds-slot gds-slab gds-sq">
            <b>{time}</b>
            <span>{what}</span>
          </I>
        ))}
        <I b={DB.ask!} a={2.6} fx="fade" x={36} y={444} w={318} className="gds-muted gds-small">
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

        {/* 12 · 3:00 pm: Bubble sheet; friends drop images on the moodboard, one made in Studio; you reply */}
        <Head b={DB.bubble!} left={<Bead d={IC.chevLeft} />} right={<Bead d={IC.plus} />}>
          <strong>Tulum trip</strong>
          <span className="gds-faces gds-faces--sm">
            <Face name="maya" size={20} />
            <Face name="leo" size={20} />
            <Face name="june" size={20} />
          </span>
        </Head>
        {[
          { img: "mood-coast", x: 28, y: 112, a: 0.6 },
          { img: "mood-bungalow", x: 200, y: 112, a: 1.0 },
          { img: "mood-kitchen", x: 28, y: 258, a: 1.4 },
          { img: "mood-walk", x: 200, y: 258, a: 1.8 },
        ].map((tile) => (
          <I key={tile.img} b={DB.bubble!} a={tile.a} fx="pop" x={tile.x} y={tile.y} w={162} h={136} className="gds-tile gds-sq">
            <img src={FACE(tile.img)} alt="" />
          </I>
        ))}
        <I b={DB.bubble!} a={1.95} z={2.6} fx="pop" x={28} y={404} w={162} h={136} className="gds-tile gds-tile--prompt gds-sq">
          <span>
            <Icon d={IC.sparkle} size={13} /> Studio
          </span>
          <T b={DB.bubble!} a={2.0} d={0.5} text="sunset poster, film grain" />
        </I>
        <I b={DB.bubble!} a={2.6} fx="pop" x={28} y={404} w={162} h={136} className="gds-tile gds-sq">
          <img src={FACE("studio-src")} alt="" />
          <span className="gds-pod__tag">
            <Icon d={IC.sparkle} size={11} /> Made in Studio
          </span>
        </I>
        <I b={DB.bubble!} a={2.9} fx="pop" x={200} y={404} w={162} h={136} className="gds-tile gds-tile--note gds-sq">
          Fly Fri, back Mon?
        </I>
        <I b={DB.bubble!} a={3.25} fx="right" x={30} y={560} w={330} className="gds-row gds-row--me">
          <span className="gds-bub gds-bub--me">The bungalow!!</span>
        </I>
        <Composer b={DB.bubble!} a={0.4} x={24} y={644} w={342} ph="Message the Bubble" text="The bungalow!!" ta={2.5} td={0.55} send={3.15} />
        {[
          { name: "Maya", x: 360, y: 130, dx: -260, dy: 70, a: 0.15, c: "pink" },
          { name: "Leo", x: 380, y: 330, dx: -110, dy: -150, a: 0.5, c: "blue" },
          { name: "June", x: -20, y: 520, dx: 110, dy: -200, a: 0.9, c: "green" },
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

        {/* 14 · 6:40 pm: Blurbs rim feed: you type the caption and post; the card lands in the glass rim, arches with the
            neighbouring authors' pearls, your pearl + poured tail, the caption bud, the heat rim growing with Fire,
            and the feed's own corners (Reblurb, Close, Fire, Ice). */}
        <I b={BLURB_BEAT} a={0.5} fx="pop" x={182} y={98} w={26} h={26} className="gds-pearl">
          <img src={FACE("maya")} alt="" />
        </I>
        <I b={BLURB_BEAT} a={0.5} fx="pop" x={182} y={606} w={26} h={26} className="gds-pearl">
          <img src={FACE("leo")} alt="" />
        </I>
        <I b={BLURB_BEAT} a={POST_AT + 0.1} fx="right" x={58} y={146} w={290} h={40} className="gds-author">
          <img className="gds-author__pearl" src={FACE("you")} alt="" />
          <strong>You</strong>
          <small>now</small>
          <span className="gds-author__tail" />
        </I>
        <I b={BLURB_BEAT} a={POST_AT} fx="fade" x={CARD[0] - 46} y={CARD[1] - 46} w={CARD[2] + 92} h={CARD[3] + 92} className="gds-heat">
          <canvas ref={heatRef} />
        </I>
        <I b={BLURB_BEAT} a={POST_AT} fx="drop" x={CARD[0] + 6} y={CARD[1] + 6} w={CARD[2] - 12} h={CARD[3] - 12} className="gds-rimphoto">
          <img src={FACE("blurb-lake")} alt="" />
        </I>
        <I b={BLURB_BEAT} a={POST_AT + 0.25} fx="up" x={82} y={498} w={228} h={64} className="gds-bud">
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
        <Composer b={BLURB_BEAT} a={0} x={30} y={652} w={262} h={44} ph="What's on your mind?" text="Lake loop after a good day." ta={0.1} td={0.6} send={POST_AT - 0.05} plus={false} />
        <I b={BLURB_BEAT} a={0.2} fx="pop" x={306} y={650} w={48} h={48} className="gds-micbead">
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
            a={FIRE_AT + n * 0.38}
            z={FIRE_AT + n * 0.38 + 0.8}
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

        {/* 16 · 11:40 pm: the day's hours fold back into the day pill, then the month */}
        <I b={DB.fold!} a={0} x={0} y={0} w={W} h={H} className="gds-spineitem">
          {spineOn === "fold" ? <DaySpine ref={spineRef} scheme={scheme} mode="fold" height={H} /> : null}
        </I>

        {/* 17 · 11:41 pm: everything melts into the Glyph mark, on the open stage */}
        <I b={FINALE} a={0.6} x={45} y={225} w={300} h={150} className="gds-glyph">
          {finaleGlyphOn ? <GooGlyphMark scheme={scheme} /> : null}
        </I>
        <I b={FINALE} a={1.1} fx="up" x={20} y={404} w={350} className="gds-center">
          <strong className="gds-final">This was your day.</strong>
        </I>
      </div>
      <I b={FINALE} a={1.6} fx="pop" x={95} y={470} w={200} className="gds-center gds-cta">
        {/* The one real control in the stage: hidden (so not focusable) until the finale. */}
        <button type="button" className="gh-go" onClick={() => openGetJokuh()} aria-haspopup="dialog">
          Get Jokuh
        </button>
      </I>
    </div>
  );
});

function Infinity() {
  return (
    <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
      <path d="M13 7c-2.2-3-4-4.6-6.3-4.6A4.6 4.6 0 0 0 2.2 7a4.6 4.6 0 0 0 4.5 4.6C9 11.6 10.8 10 13 7zm0 0c2.2 3 4 4.6 6.3 4.6A4.6 4.6 0 0 0 23.8 7a4.6 4.6 0 0 0-4.5-4.6C17 2.4 15.2 4 13 7z" />
    </svg>
  );
}

export default DayStoryStage;
