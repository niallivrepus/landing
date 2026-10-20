import { forwardRef, useId, useImperativeHandle, useRef, type ReactNode } from "react";
import { JokuhOO } from "../../../brand/JokuhOO";
import { GooFilter } from "../GooFilter";
import { gooParams, roleColor, splexSpec, type GooScheme } from "../goo-kit";
import { FACE, IC, Icon } from "./day-story-engine";
import { CORD, cordLayout, cordScene, type CordRow, type GooBlob } from "./goo-spine-cord-geometry";

/**
 * **Purpose:** The real Gooey Spine, scripted for the day story. One centred goo cord: OO dangling under the Nexus with
 * the Spaces pill beside it; date pills with stubby mirrored goo ribs ("19 TODAY" accent-filled), drawn by the app's
 * own cord geometry (`goo-spine-cord-geometry.ts`, a verbatim port); the open day as an hourly rib cage (hour pills on
 * the cord, the now hour in accent, coloured beads and chips split to both sides by category in the library palette,
 * quiet hours as nubs, the blue now-bead riding the cord with its time); the open hour unfurling its panel in place
 * (the call memory, or the violet meeting slab with its action well); and at night the hours folding back into the
 * day pill, then the days into the month.
 * **Modes:** `land` (8:06: Maya's call lands as a bead at 8 AM, the hour opens on "Coffee Thursday?"), `meet` (10:30:
 * the meeting slab and its call note on the cord), `fold` (11:40 pm: the day folds up). `paint(mode, u)` is a pure
 * function of time; there is no loop here (the stage calls it from `seek`).
 * **Parity (jokuh-live):** `components/gooey/goo-spine/` (`GooSpineCordColumn`, `GooSpineRibDay`, `goo-spine-rib-
 * geometry.ts` RIB numbers, `goo-spine-hour-beads.ts` BEAD numbers, `goo-spine-palette.ts`, `GooSpineMeetingSlab`,
 * `GooSpineOODangle`), Swift `Sources/gooey/spine/`. References: 5207 `dev-spine.html?hour=8`, the Spine corner.
 */

export type DaySpineMode = "land" | "meet" | "fold";
export type DaySpineHandle = { paint: (mode: DaySpineMode, u: number) => void };

const W = 390;
const CX = 195;
const ACCENT = "#0066FF";
/** Rib-day numbers (`goo-spine-rib-geometry.ts` RIB, `goo-spine-hour-beads.ts` BEAD). */
const RIB = { pillRowH: 36, quietRowH: 12, nowExtra: 16, pill: { w: 50, h: 22 }, nowPill: { w: 58, h: 24 }, ribGap: 7, cordThick: 7, cordThin: 3.5, nowBeadR: 6.5 };
const BEAD = { chipHeight: 26, beadSize: 22, charW: 6.4 };
const chipWidth = (chars: number) => 8 + 12 + 5 + chars * BEAD.charW + 11;

type Cat = "people" | "social" | "plans" | "health" | "web" | "oo" | "mood" | "money" | "meeting" | "fire" | "other";
const DARK: Record<Cat, string> = {
  people: "#FF312B",
  social: "#FF5CF4",
  plans: "#FFB800",
  health: "#21DC11",
  web: "#2C81FF",
  oo: "#B56FFF",
  mood: "#43FDFF",
  money: "#FF6B00",
  meeting: "#B56FFF",
  fire: "#FF4D00",
  other: "#B3B3B3",
};
const LIGHT: Record<Cat, string> = {
  people: "#FF0700",
  social: "#FF00EE",
  plans: "#FF9D00",
  health: "#0A8200",
  web: "#0066FF",
  oo: "#9327FF",
  mood: "#008789",
  money: "#BC3800",
  meeting: "#9327FF",
  fire: "#FF4D00",
  other: "#757575",
};
/** The chip fill: the library colour at the Spine's fill alpha (dark 0.62 / light 0.5), flattened onto the page so
 *  the colour layer's metaball threshold keeps it (an alpha fill would be thresholded to solid). */
function fillOf(cat: Cat, scheme: GooScheme): string {
  const hex = (scheme === "dark" ? DARK : LIGHT)[cat];
  const n = parseInt(hex.slice(1), 16);
  const a = scheme === "dark" ? 0.62 : 0.5;
  const bg = scheme === "dark" ? 0 : 246;
  const c = (v: number) => Math.round(v * a + bg * (1 - a));
  return `rgb(${c((n >> 16) & 255)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
}
/** The Spine's goo is tighter than the house knobs (`CORD.blur` = 3): ribs and necks are only 7–10 thick. */
const SPINE_GOO = gooParams(14, 50);

type Chip = { cat: Cat; icon: string; label?: string; at?: number };
type Hour = { id: string; n: string; ap: "AM" | "PM"; phase: "past" | "now" | "future"; quiet?: boolean; left?: Chip[]; right?: Chip[]; open?: number; nowMin?: string };
type Day = { n: string; w: string; m: number; current?: boolean };

const MOON = IC.moon;
const WALK = "M13 4a1.5 1.5 0 1 0 0 .01M10 21l2-6 3 3v3M9 12l3-3 3 2 2 3M8 15l2-3";
const CAL = IC.calendar;
const COIN = IC.coin;
const DOC = IC.doc;
const GAME = IC.joy;
const LIVE = IC.radio;

/** The open day for each mode (story data on the app's rib-cage rules). */
const LAND_HOURS: Hour[] = [
  { id: "l6", n: "6", ap: "AM", phase: "past", right: [{ cat: "mood", icon: MOON }] },
  { id: "l7", n: "7", ap: "AM", phase: "past", left: [{ cat: "health", icon: WALK }] },
  { id: "l8", n: "8", ap: "AM", phase: "now", nowMin: "8:06", right: [{ cat: "people", icon: IC.phone, label: "Maya", at: 0.95 }], open: 128 },
  { id: "l9", n: "9", ap: "AM", phase: "future", quiet: true },
  { id: "l10", n: "10", ap: "AM", phase: "future", right: [{ cat: "meeting", icon: CAL, label: "Design sync" }] },
  { id: "l11", n: "11", ap: "AM", phase: "future", quiet: true },
  { id: "l12", n: "12", ap: "PM", phase: "future", right: [{ cat: "plans", icon: IC.bell, label: "Lunch" }] },
  { id: "l1", n: "1", ap: "PM", phase: "future", quiet: true },
  { id: "l2", n: "2", ap: "PM", phase: "future", quiet: true },
];
const MEET_HOURS: Hour[] = [
  { id: "m8", n: "8", ap: "AM", phase: "past", right: [{ cat: "people", icon: IC.phone, label: "Maya" }] },
  { id: "m9", n: "9", ap: "AM", phase: "past", left: [{ cat: "money", icon: COIN, label: "Paid Maya" }] },
  { id: "m10", n: "10", ap: "AM", phase: "now", nowMin: "10:31", left: [{ cat: "oo", icon: DOC, label: "Call note", at: 1.1 }], right: [{ cat: "meeting", icon: CAL, label: "Design sync" }], open: 156 },
  { id: "m11", n: "11", ap: "AM", phase: "future", quiet: true },
  { id: "m12", n: "12", ap: "PM", phase: "future", right: [{ cat: "plans", icon: IC.bell, label: "Lunch" }] },
];
const FOLD_HOURS: Hour[] = [
  { id: "f8", n: "8", ap: "AM", phase: "past", right: [{ cat: "people", icon: IC.phone, label: "Maya" }] },
  { id: "f9", n: "9", ap: "AM", phase: "past", left: [{ cat: "money", icon: COIN, label: "Paid Maya" }] },
  { id: "f10", n: "10", ap: "AM", phase: "past", left: [{ cat: "oo", icon: DOC }], right: [{ cat: "meeting", icon: CAL, label: "Design sync" }] },
  { id: "f11", n: "11", ap: "AM", phase: "past", right: [{ cat: "web", icon: DOC, label: "Doc" }] },
  { id: "f12", n: "12", ap: "PM", phase: "past", left: [{ cat: "oo", icon: IC.sparkle, label: "Thursday" }] },
  { id: "f1", n: "1", ap: "PM", phase: "past", quiet: true },
  { id: "f3", n: "3", ap: "PM", phase: "past", right: [{ cat: "social", icon: IC.bubble, label: "Tulum trip" }] },
  { id: "f5", n: "5", ap: "PM", phase: "past", left: [{ cat: "other", icon: GAME }] },
  { id: "f6", n: "6", ap: "PM", phase: "past", right: [{ cat: "fire", icon: IC.fire, label: "24" }] },
  { id: "f7", n: "7", ap: "PM", phase: "past", quiet: true },
  { id: "f9p", n: "9", ap: "PM", phase: "past", left: [{ cat: "social", icon: LIVE, label: "Live" }] },
  { id: "f10p", n: "10", ap: "PM", phase: "past", quiet: true },
  { id: "f11p", n: "11", ap: "PM", phase: "now", nowMin: "11:40" },
];
const DAYS_LAND: Day[] = [
  { n: "13", w: "TUE", m: 2 },
  { n: "14", w: "WED", m: 6 },
  { n: "15", w: "THU", m: 4 },
  { n: "16", w: "FRI", m: 7 },
  { n: "17", w: "SAT", m: 3 },
  { n: "18", w: "SUN", m: 6 },
  { n: "19", w: "TODAY", m: 5, current: true },
];
const DAYS_SHORT: Day[] = DAYS_LAND.slice(4);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const MONTH_M = [9, 12, 8, 14, 10, 16, 13, 11, 15, 18];

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const backOut = (k: number) => {
  if (k <= 0) return 0;
  if (k >= 1) return 1;
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * (k - 1) ** 3 + c1 * (k - 1) ** 2;
};
const easeOut = (k: number) => 1 - (1 - clamp01(k)) ** 3;

type Label = { x: number; y: number; s: number; o: number };
type Frame = { blobs: GooBlob[]; labels: Map<string, Label> };

const dayRows = (days: Day[]): CordRow[] => days.map((d) => ({ magnitude: d.m, mix: [], isCurrent: !!d.current, isFuture: false }));

/** The date-pill overview (verbatim cord geometry), offset to `oy`; `k` squashes it toward `pivotY` (fold). */
function overview(f: Frame, prefix: string, days: { label: string }[], rows: CordRow[], rowH: number, oy: number, k: number, pivotY: number, op: number) {
  const layouts = cordLayout(rows, W, rowH, [], true);
  const scene = cordScene(rows, layouts, W, rowH, { embedded: true, accent: ACCENT });
  const map = (y: number) => pivotY + (oy + y - pivotY) * k;
  if (op > 0.02)
    for (const b of scene.blobs) {
      if (b.t === "rect") f.blobs.push({ ...b, y: map(b.y), h: b.h * Math.max(0.05, k) });
      else f.blobs.push({ ...b, cy: map(b.cy), r: b.r * (0.4 + 0.6 * k) });
    }
  layouts.forEach((l, i) => f.labels.set(`${prefix}${i}`, { x: CX, y: map(l.cy), s: 0.6 + 0.4 * k, o: op * (days[i] ? 1 : 0) }));
  const last = layouts[layouts.length - 1]!;
  return { bottom: map(last.top + last.height + CORD.embeddedPad), currentCy: map(layouts[rows.findIndex((r) => r.isCurrent)]?.cy ?? 0) };
}

/** The open day's rib cage from `y0` (verbatim RIB / BEAD numbers); `fold` squashes it up into `pivotY`. */
function ribCage(f: Frame, hours: Hour[], y0: number, u: number, scheme: GooScheme, fold: number, pivotY: number, openK: number): number {
  let y = y0;
  let nowY = -1;
  let cordEnd = y0;
  const map = (yy: number) => pivotY + (yy - pivotY) * fold;
  for (const h of hours) {
    const pill = h.phase === "now" ? RIB.nowPill : RIB.pill;
    const rowH = h.quiet ? RIB.quietRowH : RIB.pillRowH + (h.phase === "now" ? RIB.nowExtra : 0);
    const cy = y + (h.quiet ? RIB.quietRowH / 2 : RIB.pillRowH / 2);
    const my = map(cy);
    const o = fold;
    if (h.quiet) {
      // A quiet hour: a nub on the cord and its small label to the left.
      f.blobs.push({ t: "circle", cx: CX, cy: my, r: 4 * fold });
      f.labels.set(`${h.id}-nub`, { x: CX - 62, y: my, s: 1, o });
    } else {
      const fill = h.phase === "now" ? ACCENT : undefined;
      f.blobs.push({ t: "rect", x: CX - pill.w / 2, y: my - (pill.h / 2) * fold, w: pill.w, h: pill.h * fold, r: (pill.h / 2) * fold, fill });
      f.labels.set(`${h.id}-pill`, { x: CX, y: my, s: Math.max(0.3, fold), o });
      const start = pill.w / 2 + RIB.ribGap;
      for (const side of [1, -1] as const) {
        const chips = side === 1 ? h.right : h.left;
        let x = start + 10;
        (chips ?? []).forEach((c, ci) => {
          const grow = c.at != null ? backOut(clamp01((u - c.at) / 0.45)) : 1;
          const w = c.label ? chipWidth(Math.min(c.label.length, 16)) : BEAD.beadSize;
          const hh = c.label ? BEAD.chipHeight : BEAD.beadSize;
          const col = fillOf(c.cat, scheme);
          const k = grow * fold;
          if (k > 0.02) {
            // The rib neck in the bead's colour, then the bead / chip.
            const n0 = CX + side * (start - 2);
            const n1 = CX + side * (x + 4);
            f.blobs.push({ t: "rect", x: Math.min(n0, n1), y: my - 3.5 * k, w: Math.abs(n1 - n0), h: 7 * k, r: 3.5 * k, fill: col });
            const left = side === 1 ? CX + x : CX - x - w;
            const cw = w * (0.4 + 0.6 * k);
            const cx = left + w / 2;
            f.blobs.push({ t: "rect", x: cx - cw / 2, y: my - (hh / 2) * k, w: cw, h: hh * k, r: (hh / 2) * k, fill: col });
          }
          f.labels.set(`${h.id}-${side}-${ci}`, { x: side === 1 ? CX + x + w / 2 : CX - x - w / 2, y: my, s: Math.max(0.3, k), o: k > 0.4 ? clamp01((k - 0.4) / 0.4) : 0 });
          x += w + 6;
        });
      }
    }
    if (h.phase === "now") {
      nowY = map(y + RIB.pillRowH + RIB.nowExtra / 2 - 2);
      f.labels.set(`${h.id}-now`, { x: CX - 34, y: nowY, s: 1, o });
    }
    y += rowH;
    if (h.open) {
      const oh = h.open * openK;
      f.labels.set(`${h.id}-panel`, { x: CX, y: map(y + 4), s: Math.max(0.05, openK * fold), o: openK > 0.05 ? fold : 0 });
      y += oh + (openK > 0 ? 10 : 0);
    }
    cordEnd = y;
  }
  // The cord: thick behind now, thin ahead (verbatim RIB cord widths), the now bead riding it.
  const split = nowY > 0 ? nowY : map(cordEnd);
  const top = map(y0 - 6);
  const end = map(cordEnd + 10);
  if (split > top) f.blobs.push({ t: "rect", x: CX - RIB.cordThick / 2, y: top, w: RIB.cordThick, h: split - top, r: RIB.cordThick / 2 });
  if (end > split) f.blobs.push({ t: "rect", x: CX - RIB.cordThin / 2, y: split - 6, w: RIB.cordThin, h: end - split + 6, r: RIB.cordThin / 2 });
  if (nowY > 0) f.blobs.push({ t: "circle", cx: CX, cy: nowY, r: RIB.nowBeadR * fold, fill: ACCENT });
  return end;
}

/** OO dangling under the Nexus on its goo string, and the Spaces pill beside it. */
function dangle(f: Frame, nexusBottom: number, ooY: number, op: number) {
  if (op < 0.02) return;
  f.blobs.push({ t: "rect", x: CX - 2, y: nexusBottom - 4, w: 4, h: ooY - nexusBottom, r: 2 });
  f.blobs.push({ t: "circle", cx: CX, cy: ooY, r: 30 });
  f.labels.set("oo", { x: CX, y: ooY, s: 1, o: op });
  f.labels.set("spaces", { x: CX + 82, y: ooY - 18, s: 1, o: op });
}

function buildFrame(mode: DaySpineMode, u: number, scheme: GooScheme): Frame {
  const f: Frame = { blobs: [], labels: new Map() };
  if (mode === "land") {
    // Desktop: Nexus at the screen's top; OO hangs under it; the week, then today's rib cage with 8 AM opening.
    dangle(f, 24, 66, clamp01(u / 0.4));
    const ov = overview(f, "d", DAYS_LAND.map((d) => ({ label: d.n })), dayRows(DAYS_LAND), CORD.dayRowH, 104, 1, 0, 1);
    ribCage(f, LAND_HOURS, ov.bottom + 4, u, scheme, 1, 0, easeOut((u - 1.3) / 0.6));
    // The call's drop falls onto the 8 AM rib.
    const q = clamp01((u - 0.35) / 0.6);
    if (q > 0 && q < 1) f.blobs.push({ t: "circle", cx: 330 - 60 * q, cy: 470 - (470 - 372) * q * q, r: 10 });
  } else if (mode === "meet") {
    dangle(f, 50, 92, clamp01(u / 0.4));
    const ov = overview(f, "e", DAYS_SHORT.map((d) => ({ label: d.n })), dayRows(DAYS_SHORT), CORD.dayRowH, 132, 1, 0, 1);
    ribCage(f, MEET_HOURS, ov.bottom + 4, u, scheme, 1, 0, easeOut((u - 0.2) / 0.6));
  } else {
    dangle(f, 50, 92, 1);
    // 0–0.6 the full day; 0.6–1.6 the hours fold up into "19 TODAY"; 1.6–2.3 today slides down as the week folds
    // into it; 2.0–2.8 the months unfurl above it, "Oct" taking today's place.
    const OCT_CY = 430;
    const hk = 1 - easeOut((u - 0.6) / 1.0);
    const slide = easeOut((u - 1.6) / 0.7);
    const dk = 1 - easeOut((u - 1.6) / 0.6);
    const mk = easeOut((u - 2.0) / 0.8);
    const days = DAYS_SHORT;
    const dayLayouts = cordLayout(dayRows(days), W, CORD.dayRowH, [], true);
    const todayCy0 = 132 + dayLayouts[dayLayouts.length - 1]!.cy;
    const pivot = todayCy0 + (OCT_CY - todayCy0) * slide;
    const ov = overview(f, "e", days.map((d) => ({ label: d.n })), dayRows(days), CORD.dayRowH, 132 + (pivot - todayCy0), Math.max(0.02, dk), pivot, Math.max(dk, 1 - mk));
    if (hk > 0.02) ribCage(f, FOLD_HOURS, ov.bottom + 4, u, scheme, hk, todayCy0, 0);
    if (mk > 0.02) {
      const mrows: CordRow[] = MONTHS.map((_, i) => ({ magnitude: MONTH_M[i]!, mix: [], isCurrent: i === MONTHS.length - 1, isFuture: false }));
      const ml = cordLayout(mrows, W, CORD.monthRowH, [], true);
      overview(f, "mo", MONTHS.map((m) => ({ label: m })), mrows, CORD.monthRowH, OCT_CY - ml[ml.length - 1]!.cy, mk, OCT_CY, mk);
    }
  }
  return f;
}

/* ── Labels (crisp HTML over the goo) ── */

function HourLabel({ n, ap }: { n: string; ap: string }) {
  return (
    <span className="dsp-hour">
      <b>{n}</b>
      <small>{ap}</small>
    </span>
  );
}

function ChipLabel({ c }: { c: Chip }) {
  return (
    <span className={`dsp-chip${c.label ? "" : " dsp-chip--bead"}`}>
      <Icon d={c.icon} size={c.label ? 13 : 12} />
      {c.label ? <span>{c.label}</span> : null}
    </span>
  );
}

function hourLabels(hours: Hour[], panel: (h: Hour) => ReactNode): [string, ReactNode][] {
  const out: [string, ReactNode][] = [];
  for (const h of hours) {
    if (h.quiet) out.push([`${h.id}-nub`, <span className="dsp-nub">{`${h.n} ${h.ap}`}</span>]);
    else out.push([`${h.id}-pill`, <HourLabel n={h.n} ap={h.ap} />]);
    (h.left ?? []).forEach((c, i) => out.push([`${h.id}--1-${i}`, <ChipLabel c={c} />]));
    (h.right ?? []).forEach((c, i) => out.push([`${h.id}-1-${i}`, <ChipLabel c={c} />]));
    if (h.nowMin) out.push([`${h.id}-now`, <span className="dsp-now">{h.nowMin}</span>]);
    if (h.open) out.push([`${h.id}-panel`, panel(h)]);
  }
  return out;
}

/** The 8 AM hour opened: the call memory, its pill and the saved line. */
function CallPanel() {
  return (
    <div className="dsp-panel" style={{ height: 128 }}>
      <span className="dsp-entry">
        <span className="dsp-entry__glyph" style={{ background: "#FF312B" }}>
          <Icon d={IC.phone} size={14} />
        </span>
        <strong>Call with Maya</strong>
        <span className="dsp-entry__well">6 min</span>
      </span>
      <span className="dsp-quote">
        “<mark>Coffee Thursday?</mark> 9 at Blue Bottle.”
      </span>
      <small className="dsp-time">8:00 AM</small>
    </div>
  );
}

/** The violet meeting slab (`GooSpineMeetingSlab`): glyph, title, time, tag; faces + "with …"; the action well. */
function MeetingPanel() {
  return (
    <div className="dsp-panel dsp-panel--bare" style={{ height: 156 }}>
      <div className="goo-meeting is-live">
        <div className="goo-meeting__head">
          <span className="goo-meeting__glyph">
            <Icon d={IC.video} size={16} />
          </span>
          <span className="goo-meeting__titles">
            <span className="goo-meeting__title">Design sync</span>
            <span className="goo-meeting__time">10:30–11:00 AM</span>
          </span>
          <span className="goo-meeting__tag is-live">Live</span>
        </div>
        <div className="goo-meeting__people">
          <span className="goo-meeting__faces">
            {["leo", "june", "kenji"].map((n, i) => (
              <span key={n} className="goo-meeting__face" style={{ zIndex: 3 - i }}>
                <img src={FACE(n)} alt="" />
              </span>
            ))}
          </span>
          <span className="goo-meeting__with">with Leo, June +2</span>
        </div>
        <div className="goo-meeting__well">
          <span className="goo-meeting__well-title is-live">Live now</span>
          <span className="goo-meeting__btn is-primary">Join</span>
        </div>
      </div>
    </div>
  );
}

function labelSet(mode: DaySpineMode): [string, ReactNode][] {
  const day = (d: Day) => (
    <span className={`dsp-day${d.current ? " is-today" : ""}`}>
      <b>{d.n}</b>
      <small>{d.w}</small>
    </span>
  );
  const top: [string, ReactNode][] = [
    [
      "oo",
      <span className="dsp-oo">
        <JokuhOO size={50} />
      </span>,
    ],
    [
      "spaces",
      <span className="dsp-spaces">
        <Icon d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" size={12} /> Spaces
      </span>,
    ],
  ];
  if (mode === "land") return [...top, ...DAYS_LAND.map((d, i) => [`d${i}`, day(d)] as [string, ReactNode]), ...hourLabels(LAND_HOURS, () => <CallPanel />)];
  if (mode === "meet") return [...top, ...DAYS_SHORT.map((d, i) => [`e${i}`, day(d)] as [string, ReactNode]), ...hourLabels(MEET_HOURS, () => <MeetingPanel />)];
  return [
    ...top,
    ...DAYS_SHORT.map((d, i) => [`e${i}`, day(d)] as [string, ReactNode]),
    ...hourLabels(FOLD_HOURS, () => null),
    ...MONTHS.map((m, i) => [`mo${i}`, <span className={`dsp-month${i === MONTHS.length - 1 ? " is-today" : ""}`}>{m}</span>] as [string, ReactNode]),
  ];
}

const DaySpine = forwardRef<DaySpineHandle, { scheme: GooScheme; mode: DaySpineMode; height: number }>(function DaySpine({ scheme, mode, height }, ref) {
  const uid = useId().replace(/[:]/g, "");
  const gRef = useRef<SVGGElement>(null);
  const rects = useRef<SVGRectElement[]>([]);
  const circles = useRef<SVGCircleElement[]>([]);
  const tRef = useRef<SVGGElement>(null);
  const tRects = useRef<SVGRectElement[]>([]);
  const tCircles = useRef<SVGCircleElement[]>([]);
  const labelEls = useRef(new Map<string, HTMLDivElement>());
  const last = useRef(new Map<string, string>());
  const base = roleColor(scheme, "base");
  const labelNodes = labelSet(mode);

  const pool = <T extends SVGElement>(g: SVGGElement | null, arr: T[], tag: "rect" | "circle", n: number): T[] => {
    while (g && arr.length < n) {
      const el = document.createElementNS("http://www.w3.org/2000/svg", tag) as unknown as T;
      g.appendChild(el);
      arr.push(el);
    }
    return arr;
  };

  const paint = (m: DaySpineMode, u: number) => {
    const fr = buildFrame(m, u, scheme);
    const glass = fr.blobs.filter((b) => !b.fill);
    const tint = fr.blobs.filter((b) => b.fill);
    draw(gRef.current, rects.current, circles.current, glass);
    draw(tRef.current, tRects.current, tCircles.current, tint);
    placeLabels(fr);
  };

  const draw = (g: SVGGElement | null, rectPool: SVGRectElement[], circlePool: SVGCircleElement[], blobs: GooBlob[]) => {
    const rs = blobs.filter((b) => b.t === "rect") as Extract<GooBlob, { t: "rect" }>[];
    const cs = blobs.filter((b) => b.t === "circle") as Extract<GooBlob, { t: "circle" }>[];
    const R = pool(g, rectPool, "rect", rs.length);
    const C = pool(g, circlePool, "circle", cs.length);
    R.forEach((el, i) => {
      const b = rs[i];
      if (!b) {
        el.setAttribute("width", "0");
        return;
      }
      el.setAttribute("x", b.x.toFixed(1));
      el.setAttribute("y", b.y.toFixed(1));
      el.setAttribute("width", Math.max(0, b.w).toFixed(1));
      el.setAttribute("height", Math.max(0, b.h).toFixed(1));
      el.setAttribute("rx", Math.max(0, Math.min(b.r, b.w / 2, b.h / 2)).toFixed(1));
      el.setAttribute("fill", b.fill ?? base);
    });
    C.forEach((el, i) => {
      const b = cs[i];
      if (!b) {
        el.setAttribute("r", "0");
        return;
      }
      el.setAttribute("cx", b.cx.toFixed(1));
      el.setAttribute("cy", b.cy.toFixed(1));
      el.setAttribute("r", Math.max(0, b.r).toFixed(1));
      el.setAttribute("fill", b.fill ?? base);
    });
  };

  const placeLabels = (fr: Frame) => {
    labelEls.current.forEach((el, id) => {
      const l = fr.labels.get(id);
      const v = l && l.o > 0.01 ? `${l.x.toFixed(1)},${l.y.toFixed(1)},${l.s.toFixed(3)},${l.o.toFixed(2)}` : "off";
      if (last.current.get(id) === v) return;
      last.current.set(id, v);
      if (!l || v === "off") {
        el.style.visibility = "hidden";
        return;
      }
      el.style.visibility = "visible";
      el.style.opacity = l.o.toFixed(2);
      el.style.transform = `translate3d(${l.x.toFixed(1)}px, ${l.y.toFixed(1)}px, 0) translate(-50%, ${id.endsWith("-panel") ? "0" : "-50%"}) scale(${id.endsWith("-panel") ? `1, ${l.s.toFixed(3)}` : l.s.toFixed(3)})`;
    });
  };

  useImperativeHandle(ref, () => ({ paint }), [scheme]);

  return (
    <div className="dsp" style={{ width: W, height }}>
      <svg className="dsp-goo" width={W} height={height + 40} viewBox={`0 -40 ${W} ${height + 40}`} style={{ top: -40 }}>
        <defs>
          <GooFilter id={`dsp-${uid}`} x={0} y={-40} width={W} height={height + 40} spec={splexSpec(scheme)} params={SPINE_GOO} />
          {/* Colour layer: a plain metaball (blur → alpha threshold) so chips, necks and accent pills keep their colour. */}
          <filter id={`dsp-t-${uid}`} x={0} y={-40} width={W} height={height + 40} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={SPINE_GOO.blur} result="b" />
            <feColorMatrix in="b" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${SPINE_GOO.k} ${-SPINE_GOO.t}`} result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="atop" result="s" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="s" />
            </feMerge>
          </filter>
        </defs>
        <g ref={gRef} filter={`url(#dsp-${uid})`} />
        <g ref={tRef} filter={`url(#dsp-t-${uid})`} />
      </svg>
      {labelNodes.map(([id, node]) => (
        <div
          key={id}
          className={`dsp-label${id.endsWith("-panel") ? " dsp-label--panel" : ""}`}
          ref={(el) => {
            if (el) labelEls.current.set(id, el);
            else labelEls.current.delete(id);
          }}
        >
          {node}
        </div>
      ))}
    </div>
  );
});

export default DaySpine;
