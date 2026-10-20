import { forwardRef, useId, useImperativeHandle, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { JokuhOO } from "../../../brand/JokuhOO";
import { GooFilter } from "../GooFilter";
import { GooGlyphMark } from "../GooGlyphMark";
import { openGetJokuh } from "../GetJokuh";
import { babyOOLook, SwarmIconSvg } from "../GooHeroSwarm";
import { GOO_ENV_PARAMS, roleColor, splexSpec, type GooScheme } from "../goo-kit";
import type { BabyLook, SwarmIcon } from "../oo-swarm-model";
import { DAY_BEAT_COUNT, DAY_BEATS, DAY_STARTS, dayBeatAt } from "./day-story-beats";
import "../../../../styles/day-story.css";

/**
 * **Purpose:** The "day in the life" stage: one 390 × 720 scene (scaled to fit by its host) that plays the whole day
 * from `day-story-beats.ts` as a pure function of time. A single Splex goo body (`A`) morphs from beat to beat (Nexus
 * pill → call screen → Spine cord → profile tray → DM → … → Glyph mark) with a second body (`B`) that buds off it and
 * melts back, plus goo drops that drip between them; the HTML content of each beat rides on top and squishes in.
 * **API:** `seek(t)` paints second `t` (0 … `DAY_TOTAL`). It has no loop of its own: the overlay player drives it from
 * one rAF, the scroll section from scroll progress. Every element is described once in JSX by `data-*` timing
 * (`<I b a z fx>`), parsed once on mount, and written per frame as `transform` / `opacity` / `visibility` only, and
 * only when the value changed (a few typing / counter text nodes and the goo rect attributes are the exceptions).
 * **Rules:** real OO art only (`JokuhOO` OO, baby and Queen looks); the Glyph mark is the frozen `GooGlyphMark`, only
 * placed and faded. Faces and photos are demo images (`public/day-story/`). Decorative: `aria-hidden`; the host shows
 * the caption as text.
 * **Connects to:** `DayStoryPlayer` (auto-play over the hero), `DayStoryScroll` (scroll-scrubbed section).
 */

export type DayStoryHandle = { seek: (t: number) => void };

const W = 390;
const H = 720;

/* ── Timing helpers ── */

type Fx = "fade" | "pop" | "up" | "down" | "left" | "right" | "drop" | "snap" | "float" | "wipe";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const backOut = (k: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * (k - 1) ** 3 + c1 * (k - 1) ** 2;
};
const easeOut = (k: number) => 1 - (1 - k) ** 3;
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const beatEnd = (i: number) => (i >= DAY_BEAT_COUNT - 1 ? Number.POSITIVE_INFINITY : DAY_STARTS[i]! + DAY_BEATS[i]!.dur);

const FX_DEFAULT: Record<Fx, { dx: number; dy: number; sc: number }> = {
  fade: { dx: 0, dy: 0, sc: 1 },
  pop: { dx: 0, dy: 0, sc: 0.55 },
  up: { dx: 0, dy: 18, sc: 1 },
  down: { dx: 0, dy: -18, sc: 1 },
  left: { dx: -30, dy: 0, sc: 1 },
  right: { dx: 30, dy: 0, sc: 1 },
  drop: { dx: 0, dy: -48, sc: 0.9 },
  snap: { dx: 0, dy: 0, sc: 0.7 },
  float: { dx: 0, dy: 0, sc: 1 },
  wipe: { dx: 0, dy: 0, sc: 0 },
};

type ItemProps = {
  /** Beat it appears in. */
  b: number;
  /** Beat it lasts through (default `b`). */
  e?: number;
  /** Appear, seconds into beat `b` (default 0.15). */
  a?: number;
  /** Leave, seconds into beat `e` (default: the end of beat `e`). */
  z?: number;
  fx?: Fx;
  dx?: number;
  dy?: number;
  sc?: number;
  /** `float`: seconds the move takes (default: the whole visible window). */
  fd?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  className?: string;
  style?: CSSProperties;
  /** Decorative to assistive tech (the host shows the caption as text). */
  hidden?: boolean;
  children?: ReactNode;
};

/** One timed element of the stage. Absolutely placed in stage units; the writer animates it. */
function I({ b, e, a, z, fx = "fade", dx, dy, sc, fd, x, y, w, h, className, style, hidden, children }: ItemProps) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className={`gds-i${className ? ` ${className}` : ""}`}
      data-b={b}
      data-e={e}
      data-a={a}
      data-z={z}
      data-fx={fx}
      data-dx={dx}
      data-dy={dy}
      data-sc={sc}
      data-fd={fd}
      style={{ left: x, top: y, width: w, height: h, ...style }}
    >
      {children}
    </div>
  );
}

/** Text typed in over `d` seconds from `a` into beat `b`. */
function T({ b, a, d = 0.9, text }: { b: number; a: number; d?: number; text: string }) {
  return <span className="gds-type" data-tb={b} data-ta={a} data-td={d} data-text={text} />;
}

/** A number counting from `from` to `to` (or a m:ss clock with `clock`). */
function N({ b, a, d = 1.2, from, to, clock }: { b: number; a: number; d?: number; from: number; to: number; clock?: boolean }) {
  return <span className="gds-count" data-cb={b} data-ca={a} data-cd={d} data-from={from} data-to={to} data-clock={clock ? 1 : undefined} />;
}

/* ── Goo bodies ── */

type Rect = [x: number, y: number, w: number, h: number, r: number];

const IDLE_PILL: Rect = [139, 35, 112, 34, 17];
/** Body A per beat: the one goo surface the whole day morphs through. */
const KA: Rect[] = [
  [70, 22, 250, 60, 30], // call pill out of the Nexus
  [24, 22, 342, 520, 44], // call screen
  [64, 96, 14, 560, 7], // Spine cord
  [64, 96, 14, 560, 7], // cord (ID)
  [24, 140, 342, 470, 40], // profile pods tray
  [24, 70, 342, 560, 40], // DM
  [24, 70, 342, 560, 40], // DM (wallet)
  [40, 170, 310, 230, 40], // meeting card
  [54, 80, 282, 440, 30], // doc page
  [24, 604, 342, 58, 29], // Ask OO bar
  [150, 240, 90, 90, 45], // Queen OO disc
  [24, 100, 342, 500, 40], // Bubble moodboard
  [60, 130, 270, 420, 40], // arcade cabinet
  [45, 100, 300, 460, 36], // blurb
  [115, 150, 160, 160, 80], // the Orb
  [64, 60, 14, 620, 7], // night Spine cord
  [182, 286, 26, 26, 13], // melts into the Glyph mark
];
/** Body B per beat (null = melted back into A). */
const KB: (Rect | null)[] = [
  null,
  null,
  null,
  [100, 30, 266, 142, 30], // ID card
  null,
  null,
  null,
  null,
  null,
  [24, 136, 342, 448, 40], // OO sheet
  [40, 476, 310, 132, 34], // agents' answer
  null,
  null,
  null,
  [30, 352, 330, 170, 85], // colosseum floor
  null,
  null,
];

/** Morph window at the start of each beat (s). */
const MORPH = 0.9;

function mixRect(p: Rect, q: Rect, k: number): Rect {
  return [lerp(p[0], q[0], k), lerp(p[1], q[1], k), lerp(p[2], q[2], k), lerp(p[3], q[3], k), lerp(p[4], q[4], k)];
}
function centerOf(r: Rect): Rect {
  return [r[0] + r[2] / 2, r[1] + r[3] / 2, 0, 0, 0];
}

function bodyA(t: number): Rect {
  const i = dayBeatAt(t);
  const u = t - DAY_STARTS[i]!;
  if (i === 0) {
    const k = backOut(clamp01((u - 0.4) / 0.8));
    const r = mixRect(IDLE_PILL, KA[0]!, k);
    // Ringing: the pill wobbles twice.
    const ring = (s: number) => (u > s ? Math.sin((u - s) * 22) * 7 * Math.exp(-(u - s) * 3) : 0);
    const wob = ring(0.25) + ring(1.5);
    return [r[0] - wob / 2, r[1] + wob / 6, r[2] + wob, r[3] - wob / 3, r[4] - wob / 6];
  }
  const k = backOut(clamp01(u / MORPH));
  return mixRect(KA[i - 1]!, KA[i]!, k);
}

function bodyB(t: number, a: Rect): Rect {
  const i = dayBeatAt(t);
  const u = t - DAY_STARTS[i]!;
  const prev = i > 0 ? KB[i - 1] ?? null : null;
  const next = KB[i] ?? null;
  if (!prev && !next) return centerOf(a);
  // Budding off A takes a moment longer than A's own morph, so B visibly comes out of it.
  const k = next ? backOut(clamp01((u - 0.25) / MORPH)) : easeOut(clamp01(u / (MORPH * 0.8)));
  return mixRect(prev ?? centerOf(a), next ?? centerOf(a), k);
}

type Drop = {
  b: number;
  e?: number;
  a: number;
  z?: number;
  x0: number;
  y0: number;
  x1?: number;
  y1?: number;
  r: number;
  mode: "fall" | "bulge" | "sit" | "move";
};

/** Goo drops: they bulge, drip and travel between the bodies (all inside the same goo filter, so they neck and merge). */
const DROPS: Drop[] = [
  { b: 0, a: 0.9, z: 1.9, x0: 195, y0: 94, r: 13, mode: "bulge" },
  { b: 0, a: 1.9, z: 2.8, x0: 195, y0: 94, r: 10, mode: "bulge" },
  // Transcript drips down into the Spine at 8 AM.
  { b: 2, a: 0, z: 0.75, x0: 150, y0: 250, x1: 71, y1: 253, r: 11, mode: "fall" },
  { b: 2, a: 0.12, z: 0.9, x0: 230, y0: 310, x1: 71, y1: 253, r: 9, mode: "fall" },
  { b: 2, a: 0.25, z: 1.05, x0: 290, y0: 350, x1: 71, y1: 253, r: 7, mode: "fall" },
  { b: 2, e: 3, a: 0.7, x0: 71, y0: 253, r: 14, mode: "sit" },
  // Agents bud off Queen OO and walk away.
  { b: 10, a: 0.8, z: 1.6, x0: 195, y0: 285, x1: 92, y1: 212, r: 12, mode: "move" },
  { b: 10, a: 0.9, z: 1.7, x0: 195, y0: 285, x1: 298, y1: 212, r: 12, mode: "move" },
  { b: 10, a: 1.0, z: 1.8, x0: 195, y0: 285, x1: 92, y1: 380, r: 12, mode: "move" },
  { b: 10, a: 1.1, z: 1.9, x0: 195, y0: 285, x1: 298, y1: 380, r: 12, mode: "move" },
  // Night: the day's moments drip onto the cord.
  ...[0, 1, 2, 3, 4, 5, 6].flatMap((n) => [
    { b: 15, a: 0.1 + n * 0.26, z: 0.55 + n * 0.26, x0: 240 + (n % 2) * 60, y0: 40 + n * 84, x1: 71, y1: 98 + n * 84, r: 8, mode: "fall" as const },
    { b: 15, a: 0.5 + n * 0.26, x0: 71, y0: 98 + n * 84, r: 10, mode: "sit" as const },
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

/* ── Parsed timeline items ── */

type Item = {
  el: HTMLElement;
  s: number;
  end: number;
  fx: Fx;
  dx: number;
  dy: number;
  sc: number;
  fd: number;
  op: string;
  tf: string;
  vis: boolean;
};
type Typer = { el: HTMLElement; s: number; d: number; text: string; n: number };
type Counter = { el: HTMLElement; s: number; d: number; from: number; to: number; clock: boolean; last: string };

const num = (v: string | undefined, fallback: number) => (v == null || v === "" ? fallback : Number(v));

function parseItems(root: HTMLElement): { items: Item[]; typers: Typer[]; counters: Counter[] } {
  const items: Item[] = [];
  root.querySelectorAll<HTMLElement>("[data-b]").forEach((el) => {
    const d = el.dataset;
    const b = num(d.b, 0);
    const e = num(d.e, b);
    const fx = (d.fx as Fx) || "fade";
    const def = FX_DEFAULT[fx];
    const s = DAY_STARTS[b]! + num(d.a, 0.15);
    const end = d.z != null && d.z !== "" ? DAY_STARTS[e]! + Number(d.z) : beatEnd(e);
    items.push({
      el,
      s,
      end,
      fx,
      dx: num(d.dx, def.dx),
      dy: num(d.dy, def.dy),
      sc: num(d.sc, def.sc),
      fd: num(d.fd, Number.isFinite(end) ? end - s : 1),
      op: "",
      tf: "",
      vis: true,
    });
  });
  const typers: Typer[] = [];
  root.querySelectorAll<HTMLElement>("[data-text]").forEach((el) => {
    const d = el.dataset;
    typers.push({ el, s: DAY_STARTS[num(d.tb, 0)]! + num(d.ta, 0), d: num(d.td, 0.9), text: d.text ?? "", n: -1 });
  });
  const counters: Counter[] = [];
  root.querySelectorAll<HTMLElement>("[data-from]").forEach((el) => {
    const d = el.dataset;
    counters.push({
      el,
      s: DAY_STARTS[num(d.cb, 0)]! + num(d.ca, 0),
      d: num(d.cd, 1.2),
      from: num(d.from, 0),
      to: num(d.to, 0),
      clock: d.clock === "1",
      last: "",
    });
  });
  return { items, typers, counters };
}

const IN = 0.42;
const OUT = 0.3;

function paintItem(it: Item, t: number) {
  const visible = t >= it.s && t <= it.end;
  if (!visible) {
    if (it.vis) {
      it.vis = false;
      it.el.style.visibility = "hidden";
      it.el.style.opacity = "0";
      it.op = "0";
    }
    return;
  }
  if (!it.vis) {
    it.vis = true;
    it.el.style.visibility = "visible";
  }
  const pout = Number.isFinite(it.end) ? clamp01((it.end - t) / OUT) : 1;
  let op: number;
  let tf: string;
  if (it.fx === "float") {
    const q = easeInOut(clamp01((t - it.s) / Math.max(0.01, it.fd)));
    op = Math.min(clamp01((t - it.s) / 0.25), pout);
    tf = `translate3d(${(it.dx * q).toFixed(1)}px,${(it.dy * q).toFixed(1)}px,0)`;
  } else if (it.fx === "wipe") {
    const k = easeOut(clamp01((t - it.s) / 0.5));
    op = pout;
    tf = `scaleX(${k.toFixed(3)})`;
  } else {
    const pin = clamp01((t - it.s) / IN);
    const k = backOut(pin);
    const sc = (it.sc + (1 - it.sc) * k) * (0.96 + 0.04 * pout);
    op = Math.min(easeOut(pin), pout);
    tf = `translate3d(${(it.dx * (1 - k)).toFixed(1)}px,${(it.dy * (1 - k)).toFixed(1)}px,0) scale(${sc.toFixed(3)})`;
  }
  const ops = op.toFixed(2);
  if (ops !== it.op) {
    it.op = ops;
    it.el.style.opacity = ops;
  }
  if (tf !== it.tf) {
    it.tf = tf;
    it.el.style.transform = tf;
  }
}

/* ── Small pieces ── */

const FACE = (name: string) => `/day-story/${name}.webp`;

function Face({ name, size, ring }: { name: string; size: number; ring?: boolean }) {
  return (
    <img
      className={`gds-face${ring ? " gds-face--ring" : ""}`}
      src={FACE(name)}
      alt=""
      width={size}
      height={size}
      decoding="async"
      draggable={false}
      style={{ width: size, height: size }}
    />
  );
}

function Icon({ d, size = 16, stroke = 2 }: { d: string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const IC = {
  phone: "M7 4h2.5l1.3 4-2 1.3a11 11 0 0 0 5.9 5.9l1.3-2 4 1.3V17a2 2 0 0 1-2.2 2A15 15 0 0 1 5 6.2 2 2 0 0 1 7 4z",
  hang: "M3 14.5c5-4.5 13-4.5 18 0l-2.2 2.6-3.3-1.5v-2.4a12 12 0 0 0-5 0v2.4l-3.3 1.5z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  pin: "M12 21s-6-5.6-6-11a6 6 0 1 1 12 0c0 5.4-6 11-6 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  doc: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5",
  send: "M5 12h14M13 6l6 6-6 6",
  plus: "M12 5v14M5 12h14",
  bubble: "M12 4a8 8 0 1 0 0 16 8 8 0 1 0 0-16zM9 9.5a3 3 0 0 1 3-2",
  music: "M9 18V6l10-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM19 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z",
  spine: "M8 18h5M5 13h12M5 6h12M2 9.5h18",
  fire: "M12 22c4 0 7-2.8 7-7 0-3.5-2.4-5.6-3.6-7.7-.5 1.8-1.6 3-3 3.4.5-3-1-6.2-3.9-8.2.2 3.2-1.5 5.3-3 7.1C4.4 11 5 12.5 5 15c0 4.2 3 7 7 7z",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  ice: "M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9",
  cursor: "M5 3l14 7-6 2-2 6z",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  coin: "M12 4a8 8 0 1 0 0 16 8 8 0 1 0 0-16zM12 7.5v9M14.6 9.6c-.4-.9-1.4-1.4-2.6-1.4-1.5 0-2.6.8-2.6 1.9 0 2.6 5.3 1.4 5.3 4 0 1.1-1.1 1.9-2.7 1.9-1.3 0-2.3-.5-2.7-1.5",
  joy: "M8 3h8v4H8zM5 7h14v13H5zM9 13h.01M15 13h.01",
};

/* Orb seats: two tiers on the colosseum floor round the orb. */
const SEAT_FACES = ["maya", "leo", "june", "kenji", "lyra", "malik", "sloane", "rowan", "lekishon", "june", "kenji", "lyra"];
const SEATS: { x: number; y: number; s: number }[] = [
  ...[200, 235, 270, 305, 340].map((deg) => ({ deg, rx: 128, ry: 78 })),
  ...[192, 214, 236, 258, 282, 304, 326, 348].map((deg) => ({ deg, rx: 166, ry: 120 })),
]
  .map(({ deg, rx, ry }) => {
    const a = (deg * Math.PI) / 180;
    return { x: 195 + Math.cos(a) * rx, y: 400 - Math.sin(a) * ry * 0.9, s: rx > 140 ? 30 : 34 };
  });

const BABIES: { look: BabyLook; icon: SwarmIcon; dx: number; dy: number; label: string }[] = [
  { look: "aether", icon: "calendar", dx: -103, dy: -73, label: "Checking your calendar" },
  { look: "flame", icon: "message", dx: 103, dy: -73, label: "Drafting the invite" },
  { look: "spirit", icon: "note", dx: -103, dy: 95, label: "Saving to Spine" },
  { look: "solar", icon: "calendar", dx: 103, dy: 95, label: "Setting a reminder" },
];

const FOLD = ["8 AM · Call with Maya", "9 AM · Paid Maya 6 USDC", "10 AM · Design sync recap", "12 PM · Thursday, planned", "3 PM · Tulum moodboard", "6 PM · Blurb, 24 Fire", "9 PM · Live in the Orb"];

/* ── The stage ── */

const DayStoryStage = forwardRef<DayStoryHandle, { scheme: GooScheme; onBeat?: (i: number) => void }>(function DayStoryStage({ scheme, onBeat }, ref) {
  const uid = useId().replace(/[:]/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<SVGRectElement>(null);
  const bRef = useRef<SVGRectElement>(null);
  const gooRef = useRef<SVGGElement>(null);
  const drops = useRef<(SVGCircleElement | null)[]>([]);
  const parsed = useRef<ReturnType<typeof parseItems> | null>(null);
  const lastBeat = useRef(-1);
  const lastT = useRef(0);
  const gooOp = useRef("");
  const onBeatRef = useRef(onBeat);
  onBeatRef.current = onBeat;
  const [beat, setBeat] = useState(0);

  const writeRect = (el: SVGRectElement | null, r: Rect) => {
    if (!el) return;
    const w = Math.max(0, r[2]);
    const h = Math.max(0, r[3]);
    el.setAttribute("x", r[0].toFixed(1));
    el.setAttribute("y", r[1].toFixed(1));
    el.setAttribute("width", w.toFixed(1));
    el.setAttribute("height", h.toFixed(1));
    el.setAttribute("rx", Math.max(0, Math.min(r[4], w / 2, h / 2)).toFixed(1));
  };

  const seek = (raw: number) => {
    const t = Math.max(0, raw);
    lastT.current = t;
    const p = parsed.current;
    if (!p) return;
    const a = bodyA(t);
    writeRect(aRef.current, a);
    writeRect(bRef.current, bodyB(t, a));
    DROPS.forEach((d, i) => {
      const el = drops.current[i];
      if (!el) return;
      const at = dropAt(d, t);
      if (!at || at.r < 0.3) {
        if (el.getAttribute("r") !== "0") el.setAttribute("r", "0");
        return;
      }
      el.setAttribute("cx", at.x.toFixed(1));
      el.setAttribute("cy", at.y.toFixed(1));
      el.setAttribute("r", at.r.toFixed(1));
    });
    // Finale: the goo melts away as the Glyph mark comes in.
    const fin = DAY_STARTS[DAY_BEAT_COUNT - 1]!;
    const go = (1 - clamp01((t - fin - 0.5) / 0.7)).toFixed(2);
    if (go !== gooOp.current && gooRef.current) {
      gooOp.current = go;
      gooRef.current.style.opacity = go;
    }
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
    const i = dayBeatAt(t);
    if (i !== lastBeat.current) {
      lastBeat.current = i;
      setBeat(i);
      onBeatRef.current?.(i);
    }
  };

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    parsed.current = parseItems(rootRef.current);
    seek(lastT.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The Glyph mark mounts (and later re-parses nothing: it has no timing attributes) only near the finale.
  const glyphOn = beat >= DAY_BEAT_COUNT - 2;

  useImperativeHandle(ref, () => ({ seek }), []);

  const fill = roleColor(scheme, "base");

  return (
    <div ref={rootRef} className="gds" style={{ width: W, height: H }}>
      <div className="gds-art" aria-hidden>
      <svg className="gds-goo" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <GooFilter id={`gds-${uid}`} x={-20} y={-20} width={W + 40} height={H + 40} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
        </defs>
        <g ref={gooRef} filter={`url(#gds-${uid})`}>
          <rect ref={aRef} fill={fill} />
          <rect ref={bRef} fill={fill} />
          {DROPS.map((_, i) => (
            <circle
              key={i}
              ref={(el) => {
                drops.current[i] = el;
              }}
              r={0}
              fill={fill}
            />
          ))}
        </g>
      </svg>

      {/* 0 · 7:58 am: Maya calls out of the Nexus */}
      <I b={0} a={0.95} x={70} y={22} w={250} h={60} className="gds-callpill">
        <Face name="maya" size={40} />
        <span className="gds-callpill__who">
          <strong>Maya</strong>
          <small>Incoming call</small>
        </span>
        <span className="gds-dot gds-dot--red">
          <Icon d={IC.hang} size={16} />
        </span>
        <span className="gds-dot gds-dot--go gds-dot--ringing">
          <Icon d={IC.phone} size={15} />
        </span>
      </I>

      {/* 1 · 7:59 am: on the call, live captions */}
      <I b={1} a={0.35} fx="pop" x={153} y={54} w={84} h={84}>
        <Face name="maya" size={84} ring />
      </I>
      <I b={1} a={0.45} x={24} y={146} w={342} className="gds-center">
        <strong className="gds-h3">Maya</strong>
        <span className="gds-muted">
          <N b={1} a={0.4} d={3.2} from={1} to={4} clock /> · <span className="gds-live">Live captions</span>
        </span>
      </I>
      <I b={1} a={0.6} fx="left" x={44} y={214} w={302} className="gds-row">
        <span className="gds-bub">
          <T b={1} a={0.65} d={0.6} text="Free this week?" />
        </span>
      </I>
      <I b={1} a={1.35} fx="right" x={44} y={262} w={302} className="gds-row gds-row--me">
        <span className="gds-bub gds-bub--me">
          <T b={1} a={1.4} d={0.7} text="Thursday morning works." />
        </span>
      </I>
      <I b={1} a={2.15} fx="left" x={44} y={310} w={302} className="gds-row">
        <span className="gds-bub">
          <T b={1} a={2.2} d={0.9} text="Coffee Thursday? 9 at Blue Bottle." />
        </span>
      </I>
      <I b={1} a={0.5} fx="pop" x={171} y={462} w={48} h={48} className="gds-dot gds-dot--red gds-dot--lg">
        <Icon d={IC.hang} size={22} />
      </I>

      {/* 2 · 8:06 am: the call drips into the Spine */}
      {["7 AM", "8 AM", "9 AM", "10 AM", "11 AM"].map((h, n) => (
        <I key={h} b={2} e={3} a={0.35 + n * 0.08} fx="pop" x={41} y={128 + n * 100} w={60} h={26} className="gds-hour">
          {h}
        </I>
      ))}
      <I b={2} e={3} a={0.95} fx="right" x={102} y={208} w={264} className="gds-card gds-slab">
        <span className="gds-card__meta">
          <Icon d={IC.phone} size={13} /> Call with Maya · 6 min
        </span>
        <span className="gds-quote">
          “
          <span className="gds-hl">
            <I b={2} e={3} a={1.6} fx="wipe" className="gds-hl__bar" />
            <span className="gds-hl__text">Coffee Thursday?</span>
          </span>{" "}
          9 at Blue Bottle.”
        </span>
      </I>

      {/* 3 · 8:07 am: ID, people and places threaded to the memory */}
      <I b={3} a={0.55} x={100} y={30} w={266} h={142} className="gds-id">
        <span className="gds-id__top">
          <Face name="you" size={44} />
          <span>
            <strong>You</strong>
            <small>@you · ID</small>
          </span>
        </span>
        <span className="gds-id__chips">
          <I b={3} a={0.9} fx="pop" className="gds-chip">
            <Face name="maya" size={20} /> Maya
          </I>
          <I b={3} a={1.1} fx="pop" className="gds-chip">
            <Icon d={IC.pin} size={13} /> Blue Bottle
          </I>
        </span>
      </I>
      <I b={3} a={1.3} fx="fade" x={0} y={0} w={W} h={H} className="gds-threads">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <path d="M160 150 C 150 180, 185 185, 190 210" className="gds-thread" />
          <path d="M262 150 C 280 178, 300 188, 300 210" className="gds-thread" />
          <circle cx={160} cy={150} r={3.5} className="gds-thread-dot" />
          <circle cx={262} cy={150} r={3.5} className="gds-thread-dot" />
        </svg>
      </I>
      <I b={3} a={1.9} fx="up" x={102} y={330} w={264} className="gds-oonote gds-slab">
        <JokuhOO size={22} />
        <span>Maya: close friend, coffee person, 3 calls this month.</span>
      </I>

      {/* 4 · 8:15 am: profile pods snap into the bento */}
      <I b={4} a={0.2} fx="up" x={40} y={58} w={310} className="gds-prof">
        <Face name="you" size={56} ring />
        <span>
          <strong>You</strong>
          <small>@you · Profile</small>
        </span>
      </I>
      <I b={4} a={0.4} fx="snap" dx={-70} dy={-40} x={38} y={154} w={150} h={130} className="gds-pod gds-slab">
        <span className="gds-pod__label">
          <Icon d={IC.music} size={12} /> Music
        </span>
        <span className="gds-pod__music">
          <img src={FACE("music")} alt="" width={52} height={52} />
          <span>
            <strong>Blue Hour</strong>
            <small>Now playing</small>
          </span>
        </span>
        <span className="gds-eq" />
      </I>
      <I b={4} a={0.6} fx="snap" dx={70} dy={-40} x={202} y={154} w={150} h={130} className="gds-pod gds-pod--img gds-slab">
        <img src={FACE("gallery")} alt="" />
        <span className="gds-pod__tag">Gallery</span>
      </I>
      <I b={4} a={0.8} fx="snap" dx={-70} x={38} y={298} w={150} h={130} className="gds-pod gds-pod--img gds-slab">
        <img src={FACE("map")} alt="" />
        <span className="gds-pod__tag">
          <Icon d={IC.pin} size={11} /> Echo Park
        </span>
      </I>
      <I b={4} a={1.0} fx="snap" dx={70} x={202} y={298} w={150} h={130} className="gds-pod gds-slab">
        <span className="gds-pod__label">
          <Icon d={IC.spine} size={12} /> Spine
        </span>
        <span className="gds-pod__lines">
          <span>
            <b>8 AM</b> Call with Maya
          </span>
          <span>
            <b>9 AM</b> Coffee plan
          </span>
          <span>
            <b>6 PM</b> Gym
          </span>
        </span>
      </I>
      <I b={4} a={1.2} fx="snap" dx={-70} dy={40} x={38} y={442} w={150} h={130} className="gds-pod gds-slab">
        <span className="gds-pod__label">
          <Icon d={IC.bubble} size={12} /> Bubble
        </span>
        <span className="gds-faces">
          <Face name="maya" size={34} />
          <Face name="leo" size={34} />
          <Face name="june" size={34} />
        </span>
        <small className="gds-pod__foot">Tulum trip · 3 here</small>
      </I>
      <I b={4} a={1.4} fx="snap" dx={70} dy={40} x={202} y={442} w={150} h={130} className="gds-pod gds-slab">
        <span className="gds-pod__label">
          <Icon d={IC.fire} size={12} /> Blurbs
        </span>
        <span className="gds-pod__blurb">Golden hour by the lake.</span>
        <small className="gds-pod__foot gds-fire">
          <Icon d={IC.fire} size={12} /> 12
        </small>
      </I>

      {/* 5 · 9:12 am: DM with Maya, OO's coach turns it into a meeting */}
      <I b={5} e={6} a={0.3} x={44} y={86} w={302} className="gds-dmhead">
        <Face name="maya" size={36} />
        <span>
          <strong>Maya</strong>
          <small>
            <Icon d={IC.lock} size={10} /> End-to-end encrypted
          </small>
        </span>
      </I>
      <I b={5} e={6} a={0.45} fx="left" x={44} y={146} w={302} className="gds-row">
        <span className="gds-bub">So, Thursday?</span>
      </I>
      <I b={5} e={6} a={0.85} fx="right" x={44} y={192} w={302} className="gds-row gds-row--me">
        <span className="gds-bub gds-bub--me">Yes! 9 at Blue Bottle?</span>
      </I>
      <I b={5} a={1.3} z={2.3} fx="pop" x={44} y={248} w={302} className="gds-row gds-row--me">
        <span className="gds-coach gds-slab">
          <JokuhOO size={22} />
          Lock in Thursday?
        </span>
      </I>
      <I b={5} e={6} a={2.35} fx="pop" x={44} y={244} w={302} className="gds-meet gds-slab">
        <span className="gds-meet__icon">
          <Icon d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" size={18} />
        </span>
        <span>
          <strong>Coffee with Maya</strong>
          <small>Thu 9:00 am · Blue Bottle</small>
        </span>
        <span className="gds-tick">
          <Icon d={IC.check} size={14} stroke={2.6} />
        </span>
      </I>
      <I b={5} e={6} a={0.4} x={44} y={570} w={302} h={44} className="gds-composer gds-slab">
        Message
      </I>

      {/* 6 · 9:13 am: wallet request → Paid, in the chat */}
      <I b={6} a={0.2} fx="left" x={44} y={344} w={302} className="gds-row">
        <span className="gds-bub">You still owe me last week's coffee.</span>
      </I>
      <I b={6} a={0.65} fx="pop" x={44} y={394} w={302} h={128} className="gds-pay gds-slab">
        <span className="gds-pay__top">
          <span className="gds-pay__coin">
            <Icon d={IC.coin} size={18} />
          </span>
          <small>Maya requested</small>
        </span>
        <strong className="gds-pay__amt">6 USDC</strong>
        <small className="gds-muted">Coffee, last week</small>
        <I b={6} a={0.9} z={1.75} fx="fade" className="gds-pay__btn">
          Pay
        </I>
        <I b={6} a={1.75} fx="pop" className="gds-pay__btn gds-pay__btn--done">
          <Icon d={IC.check} size={14} stroke={2.6} /> Paid
        </I>
      </I>

      {/* 7 · 10:30 am: meeting join card → recap in Spine */}
      <I b={7} a={0.35} z={1.9} x={40} y={170} w={310} h={230} className="gds-join">
        <small className="gds-muted">10:30 am · Jokuh Meet</small>
        <strong className="gds-h3">Design sync</strong>
        <span className="gds-faces">
          <Face name="leo" size={34} />
          <Face name="june" size={34} />
          <Face name="kenji" size={34} />
          <span className="gds-more">+2</span>
        </span>
        <I b={7} a={0.8} z={1.9} fx="pop" className="gds-joinbtn">
          Join
        </I>
      </I>
      <I b={7} a={2.0} fx="pop" x={40} y={170} w={310} h={230} className="gds-join">
        <span className="gds-card__meta">
          <Icon d={IC.spine} size={13} /> Saved to Spine · Recap
        </span>
        <strong className="gds-h3">Design sync</strong>
        <ul className="gds-list">
          <li>Ship the new onboarding Thursday</li>
          <li>June owns the copy pass</li>
          <li>Next sync Monday 10:30</li>
        </ul>
      </I>

      {/* 8 · 11:20 am: a Doc in a Space, mailed out */}
      <I b={8} a={0.35} x={76} y={104} w={240} className="gds-doc">
        <span className="gds-card__meta">
          <Icon d={IC.doc} size={13} /> Doc
        </span>
        <strong className="gds-h3">Thursday plan</strong>
      </I>
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <I key={n} b={8} a={0.55 + n * 0.1} fx="wipe" x={76} y={186 + n * 26} w={n === 5 ? 120 : n % 2 ? 200 : 236} h={10} className="gds-line" />
      ))}
      <I b={8} a={1.3} fx="pop" x={76} y={392} w={236} className="gds-space">
        <span className="gds-faces gds-faces--sm">
          <Face name="maya" size={24} />
          <Face name="leo" size={24} />
        </span>
        Shared to Space · Weekend crew
      </I>
      <I b={8} a={1.9} fx="up" x={54} y={540} w={282} className="gds-mail gds-slab">
        <span className="gds-mail__icon">
          <Icon d={IC.mail} size={16} />
        </span>
        <span>
          <strong>you@jokuh.com</strong>
          <small>To Maya, Leo · Thursday plan</small>
        </span>
        <span className="gds-tick">
          <Icon d={IC.check} size={14} stroke={2.6} />
        </span>
      </I>

      {/* 9 · 12:30 pm: Ask OO */}
      <I b={9} a={0.4} x={24} y={604} w={342} h={58} className="gds-ask">
        <span className="gds-ask__plus">
          <Icon d={IC.plus} size={16} />
        </span>
        <span className="gds-ask__text">
          <T b={9} a={0.5} d={0.9} text="plan my Thursday" />
          <span className="gds-caret" />
        </span>
        <I b={9} a={1.3} fx="pop" className="gds-ask__send">
          <Icon d="M12 19V5M6 11l6-6 6 6" size={16} stroke={2.4} />
        </I>
      </I>
      <I b={9} a={1.5} x={44} y={156} w={302} className="gds-oo">
        <span className="gds-oo__head">
          <JokuhOO size={28} label="OO" />
          <strong>OO</strong>
        </span>
        <span className="gds-oo__lead">Here's your Thursday:</span>
      </I>
      {[
        ["9:00 am", "Coffee with Maya · Blue Bottle"],
        ["10:30 am", "Design sync"],
        ["12:00 pm", "Lunch, kept free"],
        ["6:00 pm", "Pack for Tulum"],
      ].map(([time, what], n) => (
        <I key={time} b={9} a={1.8 + n * 0.15} fx="up" x={44} y={240 + n * 62} w={302} h={52} className="gds-slot gds-slab">
          <b>{time}</b>
          <span>{what}</span>
        </I>
      ))}
      <I b={9} a={2.6} fx="fade" x={44} y={500} w={302} className="gds-muted gds-small">
        Want me to send Maya an invite?
      </I>

      {/* 10 · 12:31 pm: agents in OOpolis, Queen OO hands back one answer */}
      <I b={10} a={0.1} x={44} y={74} w={302} className="gds-center gds-muted gds-small">
        Connected
      </I>
      {[
        ["Calendar", "M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z", -60],
        ["Mail", IC.mail, 0],
        ["Spine", IC.spine, 60],
      ].map(([label, d, dx], n) => (
        <I key={label as string} b={10} a={0.3 + n * 0.14} fx="snap" dx={dx as number} dy={-30} x={52 + n * 98} y={100} w={90} h={34} className="gds-tool gds-slab">
          <Icon d={d as string} size={14} /> {label as string}
        </I>
      ))}
      <I b={10} a={0.2} fx="pop" x={157} y={247} w={76} h={76}>
        <JokuhOO size={76} look="queen" />
      </I>
      {BABIES.map((bb, n) => (
        <I key={n} b={10} a={0.8 + n * 0.1} fd={0.9} fx="float" dx={bb.dx} dy={bb.dy} x={180} y={270} w={30} h={30} className="gds-baby">
          <JokuhOO size={30} look={babyOOLook(bb.look)} />
          <span className="gds-baby__task">
            <SwarmIconSvg icon={bb.icon} size={9} />
          </span>
        </I>
      ))}
      {BABIES.map((bb, n) => (
        <I key={`l${n}`} b={10} a={1.8 + n * 0.12} z={3.6} fx="pop" x={195 + bb.dx - 70} y={270 + bb.dy + 34} w={140} className="gds-center">
          <span className="gds-pop">{bb.label}</span>
        </I>
      ))}
      <I b={10} a={2.5} x={40} y={476} w={310} h={132} className="gds-answer">
        <span className="gds-answer__text">
          <JokuhOO size={24} look="queen" />
          <span>Invite ready for Maya, Thu 9:00 am. Reminder set for 8:30. Send it?</span>
        </span>
        <span className="gds-answer__btns">
          <span className="gds-btn gds-btn--go">Send</span>
          <span className="gds-btn">Edit</span>
        </span>
      </I>

      {/* 11 · 3:00 pm: Bubble moodboard, friends drop images; one made in Studio */}
      <I b={11} a={0.2} x={44} y={116} w={302} className="gds-boardhead">
        <span>
          <Icon d={IC.bubble} size={14} /> <strong>Tulum trip</strong> <small>· Bubble</small>
        </span>
        <span className="gds-faces gds-faces--sm">
          <Face name="maya" size={24} />
          <Face name="leo" size={24} />
          <Face name="june" size={24} />
        </span>
      </I>
      <I b={11} a={0.75} fx="pop" x={44} y={160} w={146} h={124} className="gds-tile">
        <img src={FACE("mood-coast")} alt="" />
      </I>
      <I b={11} a={1.15} fx="pop" x={200} y={160} w={146} h={124} className="gds-tile">
        <img src={FACE("mood-bungalow")} alt="" />
      </I>
      <I b={11} a={1.55} fx="pop" x={44} y={294} w={146} h={124} className="gds-tile">
        <img src={FACE("mood-kitchen")} alt="" />
      </I>
      <I b={11} a={1.95} fx="pop" x={200} y={294} w={146} h={124} className="gds-tile">
        <img src={FACE("mood-walk")} alt="" />
      </I>
      <I b={11} a={2.1} z={2.75} fx="pop" x={44} y={428} w={146} h={124} className="gds-tile gds-tile--prompt">
        <span>
          <Icon d={IC.sparkle} size={13} /> Studio
        </span>
        <T b={11} a={2.15} d={0.5} text="sunset poster, film grain" />
      </I>
      <I b={11} a={2.75} fx="pop" x={44} y={428} w={146} h={124} className="gds-tile gds-tile--studio">
        <img src={FACE("studio-src")} alt="" />
        <span className="gds-pod__tag">
          <Icon d={IC.sparkle} size={11} /> Made in Studio
        </span>
      </I>
      <I b={11} a={3.0} fx="pop" x={200} y={428} w={146} h={124} className="gds-tile gds-tile--note">
        Fly Fri, back Mon?
      </I>
      {[
        { name: "Maya", x: 360, y: 150, dx: -240, dy: 80, a: 0.2 },
        { name: "Leo", x: 380, y: 330, dx: -110, dy: -110, a: 0.6 },
        { name: "June", x: -20, y: 520, dx: 120, dy: -170, a: 1.0 },
      ].map((c) => (
        <I key={c.name} b={11} a={c.a} fd={0.75} fx="float" dx={c.dx} dy={c.dy} x={c.x} y={c.y} className="gds-cursor">
          <Icon d={IC.cursor} size={16} stroke={1.6} />
          <span>{c.name}</span>
        </I>
      ))}

      {/* 12 · 5:20 pm: a quick Arcade match */}
      <I b={12} a={0.3} x={80} y={154} w={230} h={230} className="gds-screen">
        <small className="gds-arcade__title">
          <Icon d={IC.joy} size={12} /> Arcade · Round 3
        </small>
        <span className="gds-vs">
          <span>
            <Face name="you" size={48} ring />
            <small>You</small>
          </span>
          <strong className="gds-score">
            <N b={12} a={0.4} d={1.2} from={2} to={3} />
            <span>–</span>2
          </strong>
          <span>
            <Face name="kenji" size={48} ring />
            <small>Kenji</small>
          </span>
        </span>
      </I>
      <I b={12} a={1.5} fx="pop" x={95} y={404} w={200} className="gds-center">
        <span className="gds-win">You win · +9 Fuel</span>
      </I>
      <I b={12} a={0.4} fx="pop" x={130} y={480} w={36} h={36} className="gds-key" />
      <I b={12} a={0.45} fx="pop" x={224} y={480} w={36} h={36} className="gds-key gds-key--b" />

      {/* 13 · 6:40 pm: the Blurb, Fire rolls in */}
      <I b={13} a={0.25} x={65} y={118} w={260} className="gds-blurbhead">
        <Face name="you" size={32} />
        <strong>You</strong>
        <small>now</small>
      </I>
      <I b={13} a={0.35} fx="pop" x={65} y={162} w={260} h={236} className="gds-tile gds-tile--big">
        <img src={FACE("blurb-park")} alt="" />
      </I>
      <I b={13} a={0.6} x={65} y={410} w={260} className="gds-blurbtext">
        Coffee locked in, trip on the board. Good day.
      </I>
      <I b={13} a={0.8} x={65} y={500} w={260} className="gds-reacts">
        <span className="gds-fire">
          <Icon d={IC.fire} size={16} /> <N b={13} a={1.0} d={1.7} from={0} to={24} />
        </span>
        <span className="gds-ice">
          <Icon d={IC.ice} size={16} /> 2
        </span>
      </I>
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <I key={n} b={13} a={1.0 + n * 0.25} z={1.0 + n * 0.25 + 1.0} fd={1.0} fx="float" dx={(n % 3) * 14 - 14} dy={-170 - (n % 2) * 50} x={268 + (n % 3) * 12} y={496} className="gds-flame">
          <Icon d={IC.fire} size={20 + (n % 2) * 6} />
        </I>
      ))}

      {/* 14 · 9:00 pm: live in the Orb */}
      <I b={14} a={0.2} fx="pop" x={95} y={104} w={200} className="gds-center">
        <span className="gds-livebadge">LIVE</span>
        <span className="gds-muted gds-small">
          <N b={14} a={0.4} d={3} from={3} to={128} /> watching
        </span>
      </I>
      <I b={14} a={0.35} fx="pop" x={140} y={175} w={110} h={110} className="gds-orb">
        <Face name="you" size={110} />
      </I>
      {SEATS.map((s, n) => (
        <I key={n} b={14} a={0.6 + n * 0.11} fx="drop" x={s.x - s.s / 2} y={s.y - s.s / 2} w={s.s} h={s.s}>
          <Face name={SEAT_FACES[n % SEAT_FACES.length]!} size={s.s} />
        </I>
      ))}
      {[
        { x: 38, face: "malik" },
        { x: 252, face: "sloane" },
      ].map((v, n) => (
        <I key={v.face} b={14} a={2.0 + n * 0.15} fx="pop" x={v.x} y={548} w={100} h={44} className="gds-vip">
          <Face name={v.face} size={28} />
          <span>VIP</span>
        </I>
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
        <I
          key={n}
          b={14}
          a={1.3 + n * 0.3}
          z={1.3 + n * 0.3 + 1.0}
          fd={1.0}
          fx="float"
          dx={(n % 2 ? -1 : 1) * (20 + (n % 3) * 12)}
          dy={-150}
          x={SEATS[(n * 3) % SEATS.length]!.x - 10}
          y={SEATS[(n * 3) % SEATS.length]!.y - 30}
          className={`gds-react gds-react--${n % 3}`}
        >
          <Icon d={[IC.fire, IC.heart, IC.star][n % 3]!} size={18} />
        </I>
      ))}

      {/* 15 · 11:40 pm: the day folds into the Spine */}
      {FOLD.map((label, n) => (
        <I key={label} b={15} a={0.45 + n * 0.26} fx="right" x={96} y={82 + n * 84} w={270} h={34} className="gds-fold gds-slab">
          {label}
        </I>
      ))}

      {/* 16 · 11:41 pm: everything melts into the Glyph mark */}
      </div>
      <I b={16} a={0.45} x={45} y={225} w={300} h={150} className="gds-glyph" hidden>
        {glyphOn ? <GooGlyphMark scheme={scheme} /> : null}
      </I>
      <I b={16} a={1.0} fx="up" x={20} y={404} w={350} className="gds-center" hidden>
        <strong className="gds-final">This was your day.</strong>
      </I>
      <I b={16} a={1.5} fx="pop" x={95} y={470} w={200} className="gds-center gds-cta">
        {/* The one real control in the stage: hidden (so not focusable) until the finale. */}
        <button type="button" className="gh-go" onClick={() => openGetJokuh()} aria-haspopup="dialog">
          Get Jokuh
        </button>
      </I>
    </div>
  );
});

export default DayStoryStage;
