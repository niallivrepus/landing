import { forwardRef, useId, useImperativeHandle, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { JokuhOO } from "../../../brand/JokuhOO";
import { GooFilter } from "../GooFilter";
import { GooGlyphMark } from "../GooGlyphMark";
import { openGetJokuh } from "../GetJokuh";
import { babyOOLook, SwarmIconSvg } from "../GooHeroSwarm";
import { GOO_ENV_PARAMS, roleColor, splexSpec, type GooScheme } from "../goo-kit";
import type { BabyLook, SwarmIcon } from "../oo-swarm-model";
import { DAY_BEAT_COUNT, DAY_BEATS, DAY_STARTS, dayBeatAt } from "./day-story-beats";
import { backOut, beatEnd, clamp01, easeOut, Face, FACE, I, IC, Icon, lerp, N, parseItems, paintItem, T } from "./day-story-engine";
import DayStoryOrb, { DAY_ORB_ELLIPSE, type DayStoryOrbHandle } from "./DayStoryOrb";
import "../../../../styles/day-story.css";

/**
 * **Purpose:** The "day in the life" stage: one 390 × 720 scene (scaled to fit by its host) that plays the whole day
 * from `day-story-beats.ts` as a pure function of time. Every app surface is the app's own squircle sheet (the center
 * column with its Nexus pill and header beads), drawn by one Splex goo body (`A`) that morphs beat to beat: Nexus pill
 * → call sheet → Spine sheet → your profile's portrait card → DM sheet → … → the Orb → the Glyph mark. A second body
 * (`P`, same goo layer) buds off it (username plinth, OO sheet, agents' answer) and melts back. An inner goo layer on
 * top holds the Spine cord, the profile pods, OOpolis buildings and the drips between them.
 * **API:** `seek(t)` paints second `t` (0 … `DAY_TOTAL`). No loop of its own: the overlay player drives it from one
 * rAF, the scroll section from scroll progress. HTML elements are timed in JSX (`day-story-engine.tsx`) and written as
 * transform / opacity / visibility only; goo bodies are squircle paths rewritten only while they move.
 * **Rules:** real OO art only (`JokuhOO` OO, baby and Queen looks); the Glyph mark is the frozen `GooGlyphMark`, only
 * placed and faded; the Orb is the app's goo Orb geometry (`DayStoryOrb`). Faces and photos are demo images
 * (`public/day-story/`). Decorative (`aria-hidden`) except the finale's Get Jokuh button; hosts show captions as text.
 * **Connects to:** `DayStoryPlayer` (auto-play over the hero), `DayStoryScroll` (scroll-scrubbed section).
 */

export type DayStoryHandle = { seek: (t: number) => void };

const W = 390;
const H = 720;
const ORB_BEAT = DAY_BEATS.findIndex((b) => b.id === "orb");

/* ── Squircle goo bodies ── */

type Rect = [x: number, y: number, w: number, h: number, r: number];

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

/** The app's center column: every sheet in the story is this squircle. */
const S: Rect = [10, 8, 370, 704, 54];
const IDLE_PILL: Rect = [139, 18, 112, 34, 17];
const ORB_R: Rect = [
  DAY_ORB_ELLIPSE.cx - DAY_ORB_ELLIPSE.rx,
  DAY_ORB_ELLIPSE.cy - DAY_ORB_ELLIPSE.ry,
  DAY_ORB_ELLIPSE.rx * 2,
  DAY_ORB_ELLIPSE.ry * 2,
  DAY_ORB_ELLIPSE.ry,
];

/** Body A per beat. */
const KA: Rect[] = [
  [60, 14, 270, 62, 31], // call out of the Nexus
  S, // call sheet
  S, // Spine sheet
  S, // Spine + Maya's ID
  [66, 92, 258, 270, 52], // profile: the portrait card's goo rim
  S, // DM
  S, // DM (wallet)
  S, // group chat → Spine
  S, // Doc
  [24, 642, 342, 56, 28], // Ask OO bar
  [150, 262, 90, 90, 45], // Queen OO's disc
  S, // Bubble
  S, // Arcade
  S, // Blurbs
  ORB_R, // the Orb (the Orb scene draws on top; A fades)
  S, // night Spine
  [182, 286, 26, 26, 13], // melts into the Glyph mark
];

/** Body P (same layer as A, so it necks into it) per beat; null = melted back into A. */
const KP: (Rect | null)[] = [];
KP[4] = [122, 346, 146, 44, 22]; // username plinth under the portrait
KP[9] = [10, 36, 370, 590, 54]; // OO sheet rising off the bar
KP[10] = [36, 540, 318, 128, 34]; // the agents' one answer

/** Body B (inner layer: the Spine cord) per beat, with an optional delay into the beat. */
const KB: ({ r: Rect; at?: number } | null)[] = [];
KB[2] = { r: [84, 112, 10, 576, 5] };
KB[3] = { r: [84, 112, 10, 576, 5] };
KB[7] = { r: [84, 112, 10, 576, 5], at: 1.8 };
KB[15] = { r: [84, 100, 10, 590, 5] };

const MORPH = 0.9;

const mixRect = (p: Rect, q: Rect, k: number): Rect => [lerp(p[0], q[0], k), lerp(p[1], q[1], k), lerp(p[2], q[2], k), lerp(p[3], q[3], k), lerp(p[4], q[4], k)];
const centerOf = (r: Rect): Rect => [r[0] + r[2] / 2, r[1] + r[3] / 2, 0, 0, 0];

function bodyA(t: number): Rect {
  const i = dayBeatAt(t);
  const u = t - DAY_STARTS[i]!;
  if (i === 0) {
    const r = mixRect(IDLE_PILL, KA[0]!, backOut(clamp01((u - 0.4) / 0.8)));
    const ring = (s: number) => (u > s ? Math.sin((u - s) * 22) * 7 * Math.exp(-(u - s) * 3) : 0);
    const wob = ring(0.25) + ring(1.5);
    return [r[0] - wob / 2, r[1] + wob / 6, r[2] + wob, r[3] - wob / 3, r[4]];
  }
  return mixRect(KA[i - 1]!, KA[i]!, backOut(clamp01(u / MORPH)));
}

function bodyP(t: number, a: Rect): Rect {
  const i = dayBeatAt(t);
  const u = t - DAY_STARTS[i]!;
  const prev = i > 0 ? KP[i - 1] ?? null : null;
  const next = KP[i] ?? null;
  if (!prev && !next) return centerOf(a);
  const k = next ? backOut(clamp01((u - 0.3) / MORPH)) : easeOut(clamp01(u / (MORPH * 0.8)));
  return mixRect(prev ?? centerOf(a), next ?? centerOf(a), k);
}

function bodyB(t: number): Rect {
  const i = dayBeatAt(t);
  const u = t - DAY_STARTS[i]!;
  const prev = i > 0 ? KB[i - 1] ?? null : null;
  const next = KB[i] ?? null;
  const flat = (r: Rect): Rect => [r[0], r[1] + r[3] / 2, r[2], 0, r[4]];
  if (!prev && !next) return [0, 0, 0, 0, 0];
  if (next) {
    const from = prev && !next.at ? prev.r : flat(next.r);
    return mixRect(from, next.r, easeOut(clamp01((u - (next.at ?? 0)) / 0.7)));
  }
  // Leaving: the cord pours into the next surface.
  return mixRect(prev!.r, flat(prev!.r), easeOut(clamp01(u / 0.5)));
}

/** Inner goo rects (profile pods, OOpolis buildings): snap in with their HTML, melt out at the end of `e`. */
type GooRect = { b: number; e?: number; a: number; x: number; y: number; w: number; h: number; r: number; dx?: number; dy?: number };
const PODS: GooRect[] = [
  { b: 4, a: 0.6, x: 26, y: 410, w: 108, h: 92, r: 26, dx: -60, dy: -30 },
  { b: 4, a: 0.75, x: 141, y: 410, w: 108, h: 92, r: 26, dy: -40 },
  { b: 4, a: 0.9, x: 256, y: 410, w: 108, h: 92, r: 26, dx: 60, dy: -30 },
  { b: 4, a: 1.05, x: 26, y: 510, w: 108, h: 92, r: 26, dx: -60 },
  { b: 4, a: 1.2, x: 141, y: 510, w: 108, h: 92, r: 26, dy: 40 },
  { b: 4, a: 1.35, x: 256, y: 510, w: 108, h: 92, r: 26, dx: 60 },
  { b: 4, a: 1.5, x: 26, y: 610, w: 338, h: 42, r: 21, dy: 40 },
];
const BUILDINGS: GooRect[] = [
  { b: 10, a: 0.3, x: 36, y: 136, w: 100, h: 74, r: 22, dx: -30 },
  { b: 10, a: 0.4, x: 254, y: 136, w: 100, h: 74, r: 22, dx: 30 },
  { b: 10, a: 0.5, x: 36, y: 404, w: 100, h: 74, r: 22, dx: -30 },
  { b: 10, a: 0.6, x: 254, y: 404, w: 100, h: 74, r: 22, dx: 30 },
];
const GOO_RECTS: GooRect[] = [...PODS, ...BUILDINGS];

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

const DROPS: Drop[] = [
  { b: 0, a: 0.9, z: 1.9, x0: 195, y0: 92, r: 13, mode: "bulge" },
  { b: 0, a: 1.9, z: 2.8, x0: 195, y0: 92, r: 10, mode: "bulge" },
  // The transcript drips into the Spine cord at 8 AM.
  { b: 2, a: 0, z: 0.75, x0: 170, y0: 300, x1: 89, y1: 232, r: 11, mode: "fall" },
  { b: 2, a: 0.12, z: 0.9, x0: 250, y0: 350, x1: 89, y1: 232, r: 9, mode: "fall" },
  { b: 2, a: 0.25, z: 1.05, x0: 300, y0: 400, x1: 89, y1: 232, r: 7, mode: "fall" },
  { b: 2, e: 3, a: 0.7, x0: 89, y0: 232, r: 13, mode: "sit" },
  // 10:30: the call note lands on the cord.
  { b: 7, a: 2.2, x0: 89, y0: 412, r: 13, mode: "sit" },
  { b: 7, a: 2.0, z: 2.5, x0: 220, y0: 230, x1: 89, y1: 412, r: 10, mode: "fall" },
  // OOpolis streets (bead chains Queen → buildings) and babies budding off the Queen.
  ...BLDG_DOORS.flatMap((d, n) =>
    [0.25, 0.42, 0.59, 0.76].map((q, j) => ({ b: 10, a: 0.35 + n * 0.08 + j * 0.05, x0: lerp(QUEEN.x, d.x, q), y0: lerp(QUEEN.y, d.y, q), r: 5.5, mode: "sit" as const })),
  ),
  ...BLDG_DOORS.map((d, n) => ({ b: 10, a: 0.9 + n * 0.1, z: 1.7 + n * 0.1, x0: QUEEN.x, y0: QUEEN.y, x1: lerp(QUEEN.x, d.x, 0.75), y1: lerp(QUEEN.y, d.y, 0.75), r: 12, mode: "move" as const })),
  // Night: the day's moments drip onto the cord.
  ...[0, 1, 2, 3, 4, 5, 6].flatMap((n) => [
    { b: 15, a: 0.1 + n * 0.26, z: 0.55 + n * 0.26, x0: 250 + (n % 2) * 60, y0: 60 + n * 82, x1: 89, y1: 140 + n * 82, r: 8, mode: "fall" as const },
    { b: 15, a: 0.5 + n * 0.26, x0: 89, y0: 140 + n * 82, r: 10, mode: "sit" as const },
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

/** A sheet's header: left bead, centre title (or pill), right bead. */
function Head({ b, e, a = 0.3, z, left, right, children }: { b: number; e?: number; a?: number; z?: number; left?: ReactNode; right?: ReactNode; children: ReactNode }) {
  return (
    <>
      {left ? (
        <I b={b} e={e} a={a} z={z} fx="pop" x={24} y={46} w={42} h={42}>
          {left}
        </I>
      ) : null}
      {right ? (
        <I b={b} e={e} a={a + 0.05} z={z} fx="pop" x={324} y={46} w={42} h={42}>
          {right}
        </I>
      ) : null}
      <I b={b} e={e} a={a + 0.05} z={z} fx="down" x={74} y={44} w={242} h={46} className="gds-shead">
        {children}
      </I>
    </>
  );
}

const HOURS = ["7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM"];

const BABIES: { look: BabyLook; icon: SwarmIcon; label: string }[] = [
  { look: "aether", icon: "calendar", label: "Checked your calendar" },
  { look: "flame", icon: "message", label: "Drafted the invite" },
  { look: "spirit", icon: "note", label: "Saved to Spine" },
  { look: "solar", icon: "calendar", label: "Set a reminder" },
];
const BLDG = [
  { label: "Calendar", d: IC.calendar },
  { label: "Mail", d: IC.mail },
  { label: "Spine", d: IC.spine },
  { label: "Reminders", d: IC.bell },
];

const FOLD = ["8 AM · Call with Maya", "9 AM · Paid Maya 6 USDC", "10 AM · Design sync note", "12 PM · Thursday, planned", "3 PM · Tulum moodboard", "6 PM · Lake loop, 24 Fire", "9 PM · Live in the Orb"];

/* ── The stage ── */

const DayStoryStage = forwardRef<DayStoryHandle, { scheme: GooScheme; onBeat?: (i: number) => void }>(function DayStoryStage({ scheme, onBeat }, ref) {
  const uid = useId().replace(/[:]/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<SVGPathElement>(null);
  const pRef = useRef<SVGPathElement>(null);
  const bRef = useRef<SVGPathElement>(null);
  const sheetRef = useRef<SVGGElement>(null);
  const innerRef = useRef<SVGGElement>(null);
  const gooRects = useRef<(SVGPathElement | null)[]>([]);
  const drops = useRef<(SVGCircleElement | null)[]>([]);
  const orbRef = useRef<DayStoryOrbHandle | null>(null);
  const parsed = useRef<ReturnType<typeof parseItems> | null>(null);
  const lastBeat = useRef(-1);
  const lastT = useRef(0);
  const lastD = useRef(new Map<Element, string>());
  const onBeatRef = useRef(onBeat);
  onBeatRef.current = onBeat;
  const [beat, setBeat] = useState(0);

  /** Rewrite a goo path only when its shape changed (goo repaints are the expensive part). */
  const putD = (el: Element | null, d: string) => {
    if (!el || lastD.current.get(el) === d) return;
    lastD.current.set(el, d);
    el.setAttribute("d", d);
  };

  const seek = (raw: number) => {
    const t = Math.max(0, raw);
    lastT.current = t;
    const p = parsed.current;
    if (!p) return;
    const a = bodyA(t);
    putD(aRef.current, squircle(a));
    putD(pRef.current, squircle(bodyP(t, a)));
    putD(bRef.current, squircle(bodyB(t)));
    GOO_RECTS.forEach((g, i) => putD(gooRects.current[i] ?? null, squircle(gooRectAt(g, t) ?? [0, 0, 0, 0, 0])));
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
    const so = sheetOpacity(t).toFixed(2);
    if (sheetRef.current && sheetRef.current.style.opacity !== so) sheetRef.current.style.opacity = so;
    const fin = DAY_STARTS[DAY_BEAT_COUNT - 1]!;
    const io = (1 - clamp01((t - fin - 0.5) / 0.7)).toFixed(2);
    if (innerRef.current && innerRef.current.style.opacity !== io) innerRef.current.style.opacity = io;
    // The Orb scene paints only while it is on stage.
    const o0 = DAY_STARTS[ORB_BEAT]!;
    if (t >= o0 && t <= beatEnd(ORB_BEAT)) orbRef.current?.paint(t - o0);
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

  useImperativeHandle(ref, () => ({ seek }), []);

  // Heavy pieces mount only near their beat: the Orb scene and the (frozen) Glyph mark.
  const orbOn = beat >= ORB_BEAT - 1 && beat <= ORB_BEAT + 1;
  const glyphOn = beat >= DAY_BEAT_COUNT - 2;
  const fill = roleColor(scheme, "base");

  return (
    <div ref={rootRef} className="gds" style={{ width: W, height: H }}>
      <div className="gds-art" aria-hidden>
        <svg className="gds-goo" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <GooFilter id={`gds-a-${uid}`} x={-20} y={-20} width={W + 40} height={H + 40} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
            <GooFilter id={`gds-b-${uid}`} x={-20} y={-20} width={W + 40} height={H + 40} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
          </defs>
          <g ref={sheetRef} filter={`url(#gds-a-${uid})`}>
            <path ref={aRef} fill={fill} />
            <path ref={pRef} fill={fill} />
          </g>
          <g ref={innerRef} filter={`url(#gds-b-${uid})`}>
            <path ref={bRef} fill={fill} />
            {GOO_RECTS.map((_, i) => (
              <path key={i} ref={(el) => void (gooRects.current[i] = el)} fill={fill} />
            ))}
            {DROPS.map((_, i) => (
              <circle key={i} ref={(el) => void (drops.current[i] = el)} r={0} fill={fill} />
            ))}
          </g>
        </svg>

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

        {/* The Nexus pill at the top of the column, all day. */}
        <I b={1} e={ORB_BEAT - 1} a={0.5} x={155} y={20} w={80} h={28} className="gds-nexuspill" />
        <I b={ORB_BEAT + 1} a={0.3} x={155} y={20} w={80} h={28} className="gds-nexuspill" />

        {/* 0 · 7:58 am: Maya calls out of the Nexus */}
        <I b={0} a={0.95} x={60} y={14} w={270} h={62} className="gds-callpill">
          <Face name="maya" size={42} />
          <span className="gds-callpill__who">
            <strong>Maya</strong>
            <small>Incoming call</small>
          </span>
          <span className="gds-dot gds-dot--red">
            <Icon d={IC.hang} size={16} />
          </span>
          <span className="gds-dot gds-dot--go">
            <Icon d={IC.phone} size={15} />
          </span>
        </I>

        {/* 1 · 7:59 am: the call sheet, transcribed as you talk */}
        <Head b={1} left={<Bead d={IC.chevDown} />}>
          <strong>Maya</strong>
          <small>
            <N b={1} a={0.4} d={3.2} from={1} to={4} clock /> · <span className="gds-live">Transcribing</span>
          </small>
        </Head>
        <I b={1} a={0.4} fx="pop" x={137} y={112} w={116} h={116} className="gds-goorim">
          <Face name="maya" size={116} />
        </I>
        <I b={1} a={0.6} fx="left" x={32} y={258} w={326} className="gds-row">
          <span className="gds-bub">
            <T b={1} a={0.65} d={0.6} text="Free this week?" />
          </span>
        </I>
        <I b={1} a={1.35} fx="right" x={32} y={306} w={326} className="gds-row gds-row--me">
          <span className="gds-bub gds-bub--me">
            <T b={1} a={1.4} d={0.7} text="Thursday morning works." />
          </span>
        </I>
        <I b={1} a={2.15} fx="left" x={32} y={354} w={326} className="gds-row">
          <span className="gds-bub">
            <T b={1} a={2.2} d={0.9} text="Coffee Thursday? 9 at Blue Bottle." />
          </span>
        </I>
        <I b={1} a={0.5} fx="up" x={40} y={616} w={310} h={66} className="gds-controls-capsule gds-sq">
          <Bead d={IC.mic} />
          <Bead d={IC.video} />
          <Bead d={IC.speaker} />
          <span className="gds-hbead gds-hbead--hang">
            <Icon d={IC.hang} size={20} />
          </span>
        </I>

        {/* 2 · 8:06 am: the Spine sheet; the call drips onto the cord */}
        <Head
          b={2}
          e={3}
          left={
            <Bead>
              <JokuhOO size={30} />
            </Bead>
          }
          right={<Bead d={IC.moon} />}
        >
          <span className="gds-datepill gds-sq">
            <strong>Mon, Oct 20</strong>
            <small>Busy Monday</small>
          </span>
        </Head>
        {HOURS.map((h, n) => (
          <I key={h} b={2} e={3} a={0.3 + n * 0.06} fx="fade" x={24} y={124 + n * 90} w={52} className="gds-hourlabel">
            {h}
          </I>
        ))}
        <I b={2} e={3} a={0.85} fx="right" x={108} y={218} w={160} h={30} className="gds-pill gds-sq">
          <Icon d={IC.phone} size={13} /> +1 Call · Maya
        </I>
        <I b={2} e={3} a={1.15} fx="up" x={108} y={256} w={258} className="gds-card gds-slab gds-sq">
          <span className="gds-card__meta">Call with Maya · 6 min · transcript saved</span>
          <span className="gds-quote">
            “
            <span className="gds-hl">
              <I b={2} e={3} a={1.7} fx="wipe" className="gds-hl__bar" />
              <span className="gds-hl__text">Coffee Thursday?</span>
            </span>{" "}
            9 at Blue Bottle.”
          </span>
        </I>

        {/* 3 · 8:07 am: Maya's ID, threaded to the memory */}
        <I b={3} a={0.5} fx="pop" x={108} y={396} w={258} h={124} className="gds-idcard gds-slab gds-sq">
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
        <I b={3} a={1.0} fx="fade" x={0} y={0} w={W} h={H} className="gds-threads">
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <path d="M168 396 C 160 380, 186 372, 190 346" className="gds-thread" />
            <path d="M290 432 C 330 410, 330 370, 300 346" className="gds-thread" />
            <circle cx={168} cy={396} r={3.5} className="gds-thread-dot" />
            <circle cx={290} cy={432} r={3.5} className="gds-thread-dot" />
          </svg>
        </I>
        <I b={3} a={1.7} fx="up" x={108} y={532} w={258} className="gds-oonote gds-slab gds-sq">
          <JokuhOO size={22} />
          <span>OO knows: Maya's your Thursday coffee. Want it on the calendar?</span>
        </I>

        {/* 4 · 8:15 am: your profile, its own surface (not a sheet): portrait in its goo rim, plinth, pods */}
        <I b={4} a={0.3} fx="pop" x={22} y={36} w={42} h={42}>
          <Bead d={IC.gear} />
        </I>
        <I b={4} a={0.35} fx="pop" x={326} y={36} w={42} h={42}>
          <Bead d={IC.close} red />
        </I>
        <I b={4} a={0.35} fx="down" x={95} y={44} w={200} className="gds-center">
          <strong className="gds-profname">You</strong>
        </I>
        <I b={4} a={0.55} fx="fade" x={74} y={100} w={242} h={254} className="gds-portrait">
          <img src={FACE("you-portrait")} alt="" draggable={false} />
          <I b={4} a={1.2} fx="pop" className="gds-walletchip">
            <strong>$1,284.20</strong>
            <small>↗ 2.1%</small>
          </I>
        </I>
        <I b={4} a={0.9} fx="up" x={122} y={350} w={146} h={44} className="gds-plinth">
          <strong>@you</strong>
        </I>
        <I b={4} a={0.6} fx="snap" dx={-60} dy={-30} x={26} y={410} w={108} h={92} className="gds-pod gds-pod--img">
          <img src={FACE("gallery")} alt="" />
          <span className="gds-pod__tag">Gallery</span>
        </I>
        <I b={4} a={0.75} fx="snap" dy={-40} x={141} y={410} w={108} h={92} className="gds-pod gds-pod--center">
          <img className="gds-pod__disc" src={FACE("music")} alt="" />
          <span className="gds-pod__label">Music</span>
        </I>
        <I b={4} a={0.9} fx="snap" dx={60} dy={-30} x={256} y={410} w={108} h={92} className="gds-pod gds-pod--img">
          <img src={FACE("map")} alt="" />
          <span className="gds-pod__tag">
            <Icon d={IC.pin} size={10} /> Echo Park
          </span>
        </I>
        <I b={4} a={1.05} fx="snap" dx={-60} x={26} y={510} w={108} h={92} className="gds-pod gds-pod--center">
          <span className="gds-pod__bars">
            <i />
            <i />
            <i />
          </span>
          <span className="gds-pod__label">Spine</span>
        </I>
        <I b={4} a={1.2} fx="snap" dy={40} x={141} y={510} w={108} h={92} className="gds-pod gds-pod--center">
          <strong className="gds-pod__title">Tulum crew</strong>
          <span className="gds-pod__label">Bubble</span>
        </I>
        <I b={4} a={1.35} fx="snap" dx={60} x={256} y={510} w={108} h={92} className="gds-pod gds-pod--center">
          <span className="gds-contact">
            <span>
              <Icon d={IC.chat} size={11} /> Chat
            </span>
            <span>
              <Icon d={IC.mail} size={11} /> Mail
            </span>
          </span>
          <span className="gds-pod__label">Contact</span>
        </I>
        <I b={4} a={1.5} fx="snap" dy={40} x={26} y={610} w={338} h={42} className="gds-pod gds-pod--row">
          <span className="gds-pod__label">Blurbs</span>
          <span className="gds-pod__blurb">Lake loop after a good day.</span>
          <span className="gds-fire">
            <Icon d={IC.fire} size={12} /> 12
          </span>
        </I>
        <I b={4} a={1.9} fx="up" x={56} y={666} w={130} h={42} className="gds-editpill gds-sq">
          Edit profile
        </I>
        <I b={4} a={2.0} fx="up" x={198} y={662} w={136} h={48} className="gds-golive">
          <Icon d={IC.radio} size={18} /> Go Live
        </I>

        {/* 5 · 9:12 am: DM sheet; OO's coach turns it into a meeting */}
        <Head b={5} e={6} left={<Bead d={IC.chevLeft} />} right={<Bead d={IC.phone} />}>
          <span className="gds-namepill gds-sq">
            <Face name="maya" size={26} />
            <span>
              <strong>Maya</strong>
              <small>online</small>
            </span>
          </span>
        </Head>
        <I b={5} e={6} a={0.45} fx="left" x={30} y={118} w={330} className="gds-row">
          <span className="gds-bub">So, Thursday?</span>
        </I>
        <I b={5} e={6} a={0.85} fx="right" x={30} y={166} w={330} className="gds-row gds-row--me">
          <span className="gds-bub gds-bub--me">Yes! 9 at Blue Bottle?</span>
        </I>
        <I b={5} a={1.3} z={2.3} fx="pop" x={30} y={222} w={330} className="gds-row gds-row--me">
          <span className="gds-coach gds-slab">
            <JokuhOO size={22} />
            Lock in Thursday?
          </span>
        </I>
        <I b={5} e={6} a={2.35} fx="pop" x={30} y={218} w={330} className="gds-meet gds-slab gds-sq">
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
        <I b={5} e={6} a={0.4} fx="up" x={24} y={640} w={342} h={52} className="gds-composer gds-sq">
          <Icon d={IC.plus} size={16} /> <span>Message</span> <Icon d={IC.mic} size={16} />
        </I>

        {/* 6 · 9:13 am: wallet request → Paid, in the chat */}
        <I b={6} a={0.2} fx="left" x={30} y={302} w={330} className="gds-row">
          <span className="gds-bub">You still owe me last week's coffee.</span>
        </I>
        <I b={6} a={0.65} fx="pop" x={30} y={354} w={300} h={128} className="gds-pay gds-slab gds-sq">
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

        {/* 7 · 10:30 am: group chat join card → the call note lands in Spine */}
        <Head b={7} z={1.8} left={<Bead d={IC.chevLeft} />} right={<Bead d={IC.phone} />}>
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
        <I b={7} a={0.4} z={1.8} fx="left" x={30} y={120} w={330} className="gds-row">
          <span className="gds-bub">Starting now, hop in</span>
        </I>
        <I b={7} a={0.7} z={1.8} fx="pop" x={30} y={172} w={330} h={76} className="gds-joincard gds-slab gds-sq">
          <span className="gds-faces">
            <Face name="leo" size={34} />
            <Face name="june" size={34} />
            <Face name="kenji" size={34} />
          </span>
          <span>
            <strong>Design sync is live</strong>
            <small>Jokuh Meet · 10:30</small>
          </span>
          <I b={7} a={1.1} z={1.8} fx="pop" className="gds-joinbtn">
            Join
          </I>
        </I>
        <Head b={7} a={1.9} left={<Bead>{<JokuhOO size={30} />}</Bead>} right={<Bead d={IC.moon} />}>
          <span className="gds-datepill gds-sq">
            <strong>Mon, Oct 20</strong>
            <small>Busy Monday</small>
          </span>
        </Head>
        {HOURS.map((h, n) => (
          <I key={`m${h}`} b={7} a={1.9 + n * 0.04} fx="fade" x={24} y={124 + n * 90} w={52} className="gds-hourlabel">
            {h}
          </I>
        ))}
        <I b={7} a={2.0} fx="right" x={108} y={218} w={160} h={30} className="gds-pill gds-sq">
          <Icon d={IC.phone} size={13} /> +1 Call · Maya
        </I>
        <I b={7} a={2.4} fx="right" x={108} y={398} w={210} h={30} className="gds-pill gds-pill--blue gds-sq">
          <Icon d={IC.doc} size={13} /> Call note · Design sync
        </I>
        <I b={7} a={2.7} fx="up" x={108} y={436} w={258} className="gds-card gds-slab gds-sq">
          <ul className="gds-list">
            <li>Ship the new onboarding Thursday</li>
            <li>June owns the copy pass</li>
          </ul>
        </I>

        {/* 8 · 11:20 am: Doc sheet, shared to a Space, mailed out */}
        <Head b={8} left={<Bead d={IC.doc} />} right={<Bead d={IC.share} />}>
          <strong>Thursday plan</strong>
          <small>Doc · edited now</small>
        </Head>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
          <I key={n} b={8} a={0.5 + n * 0.08} fx="wipe" x={40} y={128 + n * 30} w={n === 7 ? 140 : n % 3 === 1 ? 250 : 300} h={11} className="gds-line" />
        ))}
        <I b={8} a={1.3} fx="pop" x={40} y={392} w={250} className="gds-space">
          <span className="gds-faces gds-faces--sm">
            <Face name="maya" size={24} />
            <Face name="leo" size={24} />
          </span>
          Shared to Space · Weekend crew
        </I>
        <I b={8} a={1.9} fx="up" x={30} y={600} w={330} className="gds-mail gds-slab gds-sq">
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

        {/* 9 · 12:30 pm: Ask OO; the OO sheet rises off the bar */}
        <I b={9} a={0.4} x={24} y={642} w={342} h={56} className="gds-ask">
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
        <Head b={9} a={1.4} left={<Bead d={IC.chevDown} />}>
          <span className="gds-oohead">
            <JokuhOO size={26} label="OO" />
            <strong>OO</strong>
          </span>
        </Head>
        <I b={9} a={1.6} fx="fade" x={36} y={108} w={318} className="gds-oo__lead">
          Here's your Thursday:
        </I>
        {[
          ["9:00 am", "Coffee with Maya · Blue Bottle"],
          ["10:30 am", "Design sync"],
          ["12:00 pm", "Lunch, kept free"],
          ["6:00 pm", "Pack for Tulum"],
        ].map(([time, what], n) => (
          <I key={time} b={9} a={1.8 + n * 0.15} fx="up" x={36} y={150 + n * 64} w={318} h={54} className="gds-slot gds-slab gds-sq">
            <b>{time}</b>
            <span>{what}</span>
          </I>
        ))}
        <I b={9} a={2.6} fx="fade" x={36} y={420} w={318} className="gds-muted gds-small">
          Want me to send Maya an invite?
        </I>

        {/* 10 · 12:31 pm: OOpolis; babies walk to the buildings, Queen OO hands back one answer */}
        <I b={10} a={0.15} fx="down" x={60} y={66} w={270} className="gds-center">
          <strong className="gds-h3">OOpolis</strong>
          <small className="gds-muted gds-small">4 agents at work · they ask before they act</small>
        </I>
        {BUILDINGS.map((g, n) => (
          <I key={`b${n}`} b={10} a={g.a + 0.1} fx="pop" x={g.x} y={g.y} w={g.w} h={g.h} className="gds-bldg">
            <Icon d={BLDG[n]!.d} size={18} />
            <small>{BLDG[n]!.label}</small>
          </I>
        ))}
        <I b={10} a={0.2} fx="pop" x={QUEEN.x - 38} y={QUEEN.y - 38} w={76} h={76}>
          <JokuhOO size={76} look="queen" />
        </I>
        {BABIES.map((bb, n) => {
          const d = BLDG_DOORS[n]!;
          return (
            <I
              key={n}
              b={10}
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
            <I key={`l${n}`} b={10} a={1.9 + n * 0.12} z={3.7} fx="pop" x={d.x - 70} y={d.y < QUEEN.y ? d.y + 44 : d.y - 64} w={140} className="gds-center">
              <span className="gds-pop">{bb.label}</span>
            </I>
          );
        })}
        <I b={10} a={2.5} x={36} y={540} w={318} h={128} className="gds-answer">
          <span className="gds-answer__text">
            <JokuhOO size={24} look="queen" />
            <span>Invite ready for Maya, Thu 9:00 am. Reminder set for 8:30. Send it?</span>
          </span>
          <span className="gds-answer__btns">
            <span className="gds-btn gds-btn--go">Send</span>
            <span className="gds-btn">Edit</span>
          </span>
        </I>

        {/* 11 · 3:00 pm: Bubble sheet; friends drop images on the moodboard, one made in Studio */}
        <Head b={11} left={<Bead d={IC.chevLeft} />} right={<Bead d={IC.plus} />}>
          <strong>Tulum trip</strong>
          <span className="gds-faces gds-faces--sm">
            <Face name="maya" size={20} />
            <Face name="leo" size={20} />
            <Face name="june" size={20} />
          </span>
        </Head>
        {[
          { img: "mood-coast", x: 28, y: 108, a: 0.7 },
          { img: "mood-bungalow", x: 200, y: 108, a: 1.1 },
          { img: "mood-kitchen", x: 28, y: 254, a: 1.5 },
          { img: "mood-walk", x: 200, y: 254, a: 1.9 },
        ].map((tile) => (
          <I key={tile.img} b={11} a={tile.a} fx="pop" x={tile.x} y={tile.y} w={162} h={136} className="gds-tile gds-sq">
            <img src={FACE(tile.img)} alt="" />
          </I>
        ))}
        <I b={11} a={2.05} z={2.7} fx="pop" x={28} y={400} w={162} h={136} className="gds-tile gds-tile--prompt gds-sq">
          <span>
            <Icon d={IC.sparkle} size={13} /> Studio
          </span>
          <T b={11} a={2.1} d={0.5} text="sunset poster, film grain" />
        </I>
        <I b={11} a={2.7} fx="pop" x={28} y={400} w={162} h={136} className="gds-tile gds-sq">
          <img src={FACE("studio-src")} alt="" />
          <span className="gds-pod__tag">
            <Icon d={IC.sparkle} size={11} /> Made in Studio
          </span>
        </I>
        <I b={11} a={3.0} fx="pop" x={200} y={400} w={162} h={136} className="gds-tile gds-tile--note gds-sq">
          Fly Fri, back Mon?
        </I>
        <I b={11} a={1.3} fx="left" x={30} y={560} w={330} className="gds-row">
          <span className="gds-bub">The bungalow!!</span>
        </I>
        <I b={11} a={0.4} fx="up" x={24} y={640} w={342} h={52} className="gds-composer gds-sq">
          <Icon d={IC.plus} size={16} /> <span>Message the Bubble</span> <Icon d={IC.mic} size={16} />
        </I>
        {[
          { name: "Maya", x: 360, y: 130, dx: -260, dy: 70, a: 0.2, c: "pink" },
          { name: "Leo", x: 380, y: 330, dx: -110, dy: -150, a: 0.6, c: "blue" },
          { name: "June", x: -20, y: 520, dx: 110, dy: -200, a: 1.0, c: "green" },
        ].map((c) => (
          <I key={c.name} b={11} a={c.a} fd={0.75} fx="float" dx={c.dx} dy={c.dy} x={c.x} y={c.y} className={`gds-cursor gds-cursor--${c.c}`}>
            <Icon d={IC.cursor} size={16} stroke={1.6} />
            <span>{c.name}</span>
          </I>
        ))}

        {/* 12 · 5:20 pm: Arcade sheet, a quick match */}
        <Head b={12} left={<Bead d={IC.chevLeft} />}>
          <strong>Arcade</strong>
          <small>Round 3 · Kenji</small>
        </Head>
        <I b={12} a={0.3} x={40} y={112} w={310} h={300} className="gds-screen gds-sq">
          <span className="gds-vs">
            <span>
              <Face name="you" size={56} ring />
              <small>You</small>
            </span>
            <strong className="gds-score">
              <N b={12} a={0.4} d={1.2} from={2} to={3} />
              <span>–</span>2
            </strong>
            <span>
              <Face name="kenji" size={56} ring />
              <small>Kenji</small>
            </span>
          </span>
        </I>
        <I b={12} a={1.5} fx="pop" x={95} y={440} w={200} className="gds-center">
          <span className="gds-win">You win · +9 Fuel</span>
        </I>
        <I b={12} a={0.4} fx="pop" x={128} y={520} w={44} h={44} className="gds-key" />
        <I b={12} a={0.45} fx="pop" x={218} y={520} w={44} h={44} className="gds-key gds-key--b" />

        {/* 13 · 6:40 pm: Blurbs sheet: the lake loop, Fire rolls in */}
        <Head b={13} left={<Bead d={IC.chevLeft} />} right={<Bead d={IC.plus} />}>
          <strong>Blurbs</strong>
          <small>Your people</small>
        </Head>
        <I b={13} a={0.3} x={30} y={110} w={330} className="gds-blurbhead">
          <Face name="you" size={32} />
          <strong>You</strong>
          <small>now</small>
        </I>
        <I b={13} a={0.35} fx="pop" x={30} y={154} w={330} h={248} className="gds-tile gds-tile--big gds-sq">
          <img src={FACE("blurb-lake")} alt="" />
        </I>
        <I b={13} a={0.6} x={30} y={414} w={330} className="gds-blurbtext">
          Lake loop after a good day.
        </I>
        <I b={13} a={0.8} x={30} y={460} w={330} className="gds-reacts">
          <span className="gds-fire">
            <Icon d={IC.fire} size={16} /> <N b={13} a={1.0} d={1.8} from={0} to={24} />
          </span>
          <span className="gds-ice">
            <Icon d={IC.ice} size={16} /> 2
          </span>
        </I>
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <I key={n} b={13} a={1.0 + n * 0.25} z={2.0 + n * 0.25} fd={1.0} fx="float" dx={(n % 3) * 14 - 14} dy={-200 - (n % 2) * 60} x={300 + (n % 3) * 14} y={430} className="gds-flame">
            <Icon d={IC.fire} size={20 + (n % 2) * 6} />
          </I>
        ))}

        {/* 14 · 9:00 pm: the Orb's island */}
        <I b={ORB_BEAT} a={0.3} fx="down" x={105} y={18} w={180} h={32} className="gds-island">
          <span className="gds-livebadge">LIVE</span>
          <span>
            <N b={ORB_BEAT} a={0.4} d={4} from={3} to={128} /> watching
          </span>
        </I>

        {/* 15 · 11:40 pm: the day folds into the Spine */}
        <Head b={15} left={<Bead>{<JokuhOO size={30} />}</Bead>} right={<Bead d={IC.moon} />}>
          <span className="gds-datepill gds-sq">
            <strong>Mon, Oct 20</strong>
            <small>Full day</small>
          </span>
        </Head>
        {FOLD.map((label, n) => (
          <I key={label} b={15} a={0.45 + n * 0.26} fx="right" x={108} y={124 + n * 82} w={258} h={34} className="gds-pill gds-sq">
            {label}
          </I>
        ))}

        {/* 16 · 11:41 pm: everything melts into the Glyph mark */}
        <I b={16} a={0.45} x={45} y={225} w={300} h={150} className="gds-glyph">
          {glyphOn ? <GooGlyphMark scheme={scheme} /> : null}
        </I>
        <I b={16} a={1.0} fx="up" x={20} y={404} w={350} className="gds-center">
          <strong className="gds-final">This was your day.</strong>
        </I>
      </div>
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
