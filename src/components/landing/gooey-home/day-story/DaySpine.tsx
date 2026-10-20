import { forwardRef, useId, useImperativeHandle, useRef, type ReactNode } from "react";
import { JokuhOO } from "../../../brand/JokuhOO";
import { GooFilter } from "../GooFilter";
import { gooParams, roleColor, splexSpec, type GooScheme } from "../goo-kit";
import { FACE, IC, Icon } from "./day-story-engine";
import { CORD, cordInlineTop, cordLayout, cordScene, cordTotalHeight, type CordOpen, type CordRow, type GooBlob } from "./goo-spine-cord-geometry";

/**
 * **Purpose:** The real Gooey Spine, scripted for the day story: ONE centred goo cord holding the nested levels the app
 * unfurls in place: years → months → days → the open day's hourly rib cage → an open hour's panel. Each level is the
 * app's own cord geometry (`goo-spine-cord-geometry.ts`, verbatim): a row opening grows a hole under its pill (its
 * ribs retract as it opens, grow back as it closes) and the child level is revealed inside it from the top, pushing the
 * rows below down; closing runs it backwards. OO dangles under the Nexus with the Spaces pill.
 * **Modes:** `land` (8:06: today unfurls into hours, Maya's call lands at 8 AM, the hour opens its panel), `meet`
 * (10:30: the 10 AM hour opens on the violet meeting slab + the call note row), `fold` (11:40 pm: the day folds back
 * into "19 TODAY", then October folds back into its pill). `paint(mode, u)` is a pure function of time.
 * **Parity (jokuh-live):** `components/gooey/goo-spine/` (`GooSpineCordColumn` nested opens, `GooSpineRibDay` +
 * `goo-spine-rib-geometry.ts` RIB numbers, `goo-spine-hour-beads.ts` BEAD numbers, `goo-spine-palette.ts`, the open
 * hour panel's rows, `GooSpineMeetingSlab`, `GooSpineOODangle`); Swift `goo-spine-cord-overview.swift` (inline day
 * unfurl). References: 5207 `dev-spine.html` (month / day / hour open and fold states).
 */

export type DaySpineMode = "land" | "meet" | "fold";
export type DaySpineHandle = { paint: (mode: DaySpineMode, u: number) => void };

const W = 390;
const CX = 195;
const ACCENT = "#0066FF";
const RIB = { pillRowH: 36, quietRowH: 12, nowExtra: 16, pill: { w: 50, h: 22 }, nowPill: { w: 58, h: 24 }, ribGap: 7, cordThick: 7, cordThin: 3.5, nowBeadR: 6.5, panelGap: 10 };
const BEAD = { chipHeight: 26, beadSize: 22, charW: 6.4 };
const chipWidth = (chars: number) => 8 + 12 + 5 + chars * BEAD.charW + 11;

type Cat = "people" | "social" | "plans" | "health" | "web" | "oo" | "mood" | "money" | "meeting" | "fire" | "other";
const DARK: Record<Cat, string> = { people: "#FF312B", social: "#FF5CF4", plans: "#FFB800", health: "#21DC11", web: "#2C81FF", oo: "#B56FFF", mood: "#43FDFF", money: "#FF6B00", meeting: "#B56FFF", fire: "#FF4D00", other: "#B3B3B3" };
const LIGHT: Record<Cat, string> = { people: "#FF0700", social: "#FF00EE", plans: "#FF9D00", health: "#0A8200", web: "#0066FF", oo: "#9327FF", mood: "#008789", money: "#BC3800", meeting: "#9327FF", fire: "#FF4D00", other: "#757575" };
/** Library colour at the Spine's fill alpha (dark 0.62 / light 0.5), flattened so the colour layer's threshold keeps it. */
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
type Hour = { id: string; n: string; ap: "AM" | "PM"; phase: "past" | "now" | "future"; quiet?: boolean; left?: Chip[]; right?: Chip[]; panel?: number };

const WALK = "M13 4a1.5 1.5 0 1 0 0 .01M10 21l2-6 3 3v3M9 12l3-3 3 2 2 3M8 15l2-3";

/** The open day per mode (story data on the app's rib-cage rules). */
const LAND_HOURS: Hour[] = [
  { id: "l6", n: "6", ap: "AM", phase: "past", right: [{ cat: "mood", icon: IC.moon }] },
  { id: "l7", n: "7", ap: "AM", phase: "past", left: [{ cat: "health", icon: WALK }] },
  { id: "l8", n: "8", ap: "AM", phase: "now", right: [{ cat: "people", icon: IC.phone, label: "Maya", at: 0.95 }], panel: 176 },
  { id: "l9", n: "9", ap: "AM", phase: "future", quiet: true },
  { id: "l10", n: "10", ap: "AM", phase: "future", right: [{ cat: "meeting", icon: IC.calendar, label: "Design sync" }] },
  { id: "l11", n: "11", ap: "AM", phase: "future", quiet: true },
  { id: "l12", n: "12", ap: "PM", phase: "future", right: [{ cat: "plans", icon: IC.bell, label: "Lunch" }] },
  { id: "l1", n: "1", ap: "PM", phase: "future", quiet: true },
  { id: "l2", n: "2", ap: "PM", phase: "future", quiet: true },
];
const MEET_HOURS: Hour[] = [
  { id: "m7", n: "7", ap: "AM", phase: "past", left: [{ cat: "health", icon: WALK }] },
  { id: "m8", n: "8", ap: "AM", phase: "past", right: [{ cat: "people", icon: IC.phone, label: "Maya" }] },
  { id: "m9", n: "9", ap: "AM", phase: "past", left: [{ cat: "money", icon: IC.coin, label: "Paid Maya" }] },
  { id: "m10", n: "10", ap: "AM", phase: "now", right: [{ cat: "meeting", icon: IC.calendar, label: "Design sync" }], panel: 236 },
  { id: "m11", n: "11", ap: "AM", phase: "future", quiet: true },
  { id: "m12", n: "12", ap: "PM", phase: "future", right: [{ cat: "plans", icon: IC.bell, label: "Lunch" }] },
];
const FOLD_HOURS: Hour[] = [
  { id: "f8", n: "8", ap: "AM", phase: "past", right: [{ cat: "people", icon: IC.phone, label: "Maya" }] },
  { id: "f9", n: "9", ap: "AM", phase: "past", left: [{ cat: "money", icon: IC.coin, label: "Paid Maya" }] },
  { id: "f10", n: "10", ap: "AM", phase: "past", left: [{ cat: "oo", icon: IC.doc }], right: [{ cat: "meeting", icon: IC.calendar, label: "Design sync" }] },
  { id: "f11", n: "11", ap: "AM", phase: "past", right: [{ cat: "web", icon: IC.doc, label: "Doc" }] },
  { id: "f12", n: "12", ap: "PM", phase: "past", left: [{ cat: "oo", icon: IC.sparkle, label: "Thursday" }] },
  { id: "f1", n: "1", ap: "PM", phase: "past", quiet: true },
  { id: "f3", n: "3", ap: "PM", phase: "past", right: [{ cat: "social", icon: IC.bubble, label: "Tulum trip" }] },
  { id: "f5", n: "5", ap: "PM", phase: "past", left: [{ cat: "other", icon: IC.joy }] },
  { id: "f6", n: "6", ap: "PM", phase: "past", right: [{ cat: "fire", icon: IC.fire, label: "24" }] },
  { id: "f7", n: "7", ap: "PM", phase: "past", quiet: true },
  { id: "f9p", n: "9", ap: "PM", phase: "past", left: [{ cat: "social", icon: IC.radio, label: "Live" }] },
  { id: "f10p", n: "10", ap: "PM", phase: "past", quiet: true },
  { id: "f11p", n: "11", ap: "PM", phase: "now" },
];
const HOURS: Record<DaySpineMode, Hour[]> = { land: LAND_HOURS, meet: MEET_HOURS, fold: FOLD_HOURS };
const NOW_MIN: Record<DaySpineMode, string> = { land: "8:06", meet: "10:31", fold: "11:40" };

/* The nested calendar: 2025 · 2026 (open) → Jan … Dec (Oct open) → Oct 1 … 31 (19 open). */
const YEARS = ["2025", "2026"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_M = [9, 12, 8, 14, 10, 16, 13, 11, 15, 18, 0, 0];
const WEEK = ["THU", "FRI", "SAT", "SUN", "MON", "TUE", "WED"];
const DAY_M = [3, 6, 0, 0, 0, 4, 5, 7, 4, 2, 5, 6, 3, 6, 4, 7, 3, 6, 5];
const TODAY = 18;
const OCT = 9;
const yearRows: CordRow[] = YEARS.map((_, i) => ({ magnitude: i ? 40 : 30, mix: [], isCurrent: i === 1, isFuture: false }));
const monthRows: CordRow[] = MONTHS.map((_, i) => ({ magnitude: MONTH_M[i]!, mix: [], isCurrent: i === OCT, isFuture: i > OCT }));
const dayRows: CordRow[] = Array.from({ length: 31 }, (_, i) => ({ magnitude: i < TODAY ? DAY_M[i]! : i === TODAY ? 5 : 0, mix: [], isCurrent: i === TODAY, isFuture: i > TODAY }));

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const backOut = (k: number) => {
  if (k <= 0) return 0;
  if (k >= 1) return 1;
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * (k - 1) ** 3 + c1 * (k - 1) ** 2;
};
const easeInOut = (k: number) => {
  const x = clamp01(k);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
};

type Label = { x: number; y: number; s: number; o: number; open?: boolean };
type Frame = { blobs: GooBlob[]; labels: Map<string, Label> };

/** Blobs + labels of a child level, kept only above `clip` (the app reveals an opening level from the top). */
function clipped(dst: Frame, src: Frame, clip: number) {
  for (const b of src.blobs) {
    if (b.t === "rect") {
      if (b.y >= clip) continue;
      // A coloured chip is never shown sliced: it goes as soon as the closing edge reaches it.
      if (b.fill && b.y + b.h > clip) continue;
      dst.blobs.push(b.y + b.h > clip ? { ...b, h: clip - b.y, r: Math.min(b.r, (clip - b.y) / 2) } : b);
    } else if (b.cy - b.r < clip) dst.blobs.push(b);
  }
  src.labels.forEach((l, id) => dst.labels.set(id, l.y < clip - 6 ? l : { ...l, o: 0 }));
}

/** One cord level at `oy` (verbatim geometry), with its labels; returns the row layouts in page coordinates. */
function level(f: Frame, prefix: string, rows: CordRow[], rowH: number, oy: number, opens: CordOpen[], embedded: boolean) {
  const layouts = cordLayout(rows, W, rowH, opens, embedded);
  const scene = cordScene(rows, layouts, W, rowH, { embedded, accent: ACCENT });
  for (const b of scene.blobs) f.blobs.push(b.t === "rect" ? { ...b, y: b.y + oy } : { ...b, cy: b.cy + oy });
  layouts.forEach((l, i) => f.labels.set(`${prefix}${i}`, { x: CX, y: l.cy + oy, s: 1, o: 1, open: !!l.open && l.open.progress > 0.02 }));
  return { layouts, height: cordTotalHeight(layouts, embedded) };
}

/** The open day's rib cage (RIB / BEAD numbers) from `y0`; `openP` opens the hour that carries a panel. Returns height. */
function ribCage(f: Frame | null, hours: Hour[], y0: number, u: number, scheme: GooScheme, openP: number, nowMin: string): number {
  let y = y0 + 6;
  let nowY = -1;
  for (const h of hours) {
    const pill = h.phase === "now" ? RIB.nowPill : RIB.pill;
    const rowH = h.quiet ? RIB.quietRowH : RIB.pillRowH + (h.phase === "now" ? RIB.nowExtra : 0);
    const cy = y + (h.quiet ? RIB.quietRowH / 2 : RIB.pillRowH / 2);
    const isOpen = !!h.panel && openP > 0.001;
    const retract = isOpen ? 1 - openP : 1;
    if (f) {
      if (h.quiet) {
        f.blobs.push({ t: "circle", cx: CX, cy, r: 4 });
        f.labels.set(`${h.id}-nub`, { x: CX - 62, y: cy, s: 1, o: 1 });
      } else {
        // The open hour drops its accent fill for an outline (the app's open-hour pill).
        const fill = h.phase === "now" && !isOpen ? ACCENT : undefined;
        f.blobs.push({ t: "rect", x: CX - pill.w / 2, y: cy - pill.h / 2, w: pill.w, h: pill.h, r: pill.h / 2, fill });
        f.labels.set(`${h.id}-pill`, { x: CX, y: cy, s: 1, o: 1, open: isOpen && openP > 0.4 });
        const start = pill.w / 2 + RIB.ribGap;
        for (const side of [1, -1] as const) {
          let x = start + 10;
          ((side === 1 ? h.right : h.left) ?? []).forEach((c, ci) => {
            const k = (c.at != null ? backOut(clamp01((u - c.at) / 0.45)) : 1) * retract;
            const w = c.label ? chipWidth(Math.min(c.label.length, 16)) : BEAD.beadSize;
            const hh = c.label ? BEAD.chipHeight : BEAD.beadSize;
            const col = fillOf(c.cat, scheme);
            if (k > 0.02) {
              // The rib neck in the bead's colour, then the bead / chip (the rib grows out, and retracts on open).
              const n0 = CX + side * (start - 2);
              const n1 = CX + side * (start - 2 + (x + 6 - start) * k);
              f.blobs.push({ t: "rect", x: Math.min(n0, n1), y: cy - 3.5, w: Math.abs(n1 - n0), h: 7, r: 3.5, fill: col });
              const cw = w * k;
              const ccx = side === 1 ? CX + start + (x - start + w / 2) * k : CX - start - (x - start + w / 2) * k;
              f.blobs.push({ t: "rect", x: ccx - cw / 2, y: cy - (hh / 2) * Math.max(0.4, k), w: cw, h: hh * Math.max(0.4, k), r: (hh / 2) * Math.max(0.4, k), fill: col });
            }
            f.labels.set(`${h.id}-${side}-${ci}`, { x: side === 1 ? CX + start + (x - start + w / 2) * k : CX - start - (x - start + w / 2) * k, y: cy, s: Math.max(0.3, k), o: k > 0.5 ? clamp01((k - 0.5) / 0.4) : 0 });
            x += w + 6;
          });
        }
      }
    }
    if (h.phase === "now") nowY = y + RIB.pillRowH + RIB.nowExtra / 2 - 2;
    y += rowH;
    if (h.panel) {
      const ph = (h.panel + RIB.panelGap) * openP;
      if (f) f.labels.set(`${h.id}-panel`, { x: CX, y: y + 2, s: Math.max(0.02, openP), o: openP > 0.02 ? clamp01(openP * 1.5) : 0 });
      if (nowY > 0 && h.phase === "now") nowY += ph;
      y += ph;
    }
  }
  y += 8;
  if (f) {
    // The cord: thick behind now, thin ahead; the blue now bead rides it with its time.
    const split = nowY > 0 ? nowY : y;
    f.blobs.push({ t: "rect", x: CX - RIB.cordThick / 2, y: y0, w: RIB.cordThick, h: Math.max(0, split - y0), r: RIB.cordThick / 2 });
    f.blobs.push({ t: "rect", x: CX - RIB.cordThin / 2, y: split - 6, w: RIB.cordThin, h: Math.max(0, y - split + 6), r: RIB.cordThin / 2 });
    if (nowY > 0) {
      f.blobs.push({ t: "circle", cx: CX, cy: nowY, r: RIB.nowBeadR, fill: ACCENT });
      f.labels.set("now", { x: CX - 34, y: nowY, s: 1, o: 1 });
      void nowMin;
    }
  }
  return y - y0;
}

/** Everything open as given; `place(todayCy, octCy)` (positions with the year level at 0) returns the scroll offset. */
function spine(mode: DaySpineMode, u: number, scheme: GooScheme, pm: number, pd: number, ph: number, place: (todayCy: number, octCy: number) => number, ooY: number): Frame {
  const hours = HOURS[mode];
  const hoursH = ribCage(null, hours, 0, u, scheme, ph, NOW_MIN[mode]);
  const dayL0 = cordLayout(dayRows, W, CORD.dayRowH, [{ index: TODAY, progress: pd, height: hoursH }], true);
  const daysH = cordTotalHeight(dayL0, true);
  const monthL0 = cordLayout(monthRows, W, CORD.monthRowH, [{ index: OCT, progress: pm, height: daysH }], true);
  const monthsH = cordTotalHeight(monthL0, true);
  // Where the anchor row would sit with the year level at y = 0, then shift so it lands on `anchorY`.
  const yearL0 = cordLayout(yearRows, W, CORD.yearRowH, [{ index: 1, progress: 1, height: monthsH }], false);
  const monthsTop0 = cordInlineTop(yearL0[1]!);
  const octRow = monthL0[OCT]!;
  const daysTop0 = monthsTop0 + cordInlineTop(octRow);
  const oy = place(daysTop0 + dayL0[TODAY]!.cy, monthsTop0 + octRow.cy);

  const f: Frame = { blobs: [], labels: new Map() };
  const years = level(f, "y", yearRows, CORD.yearRowH, oy, [{ index: 1, progress: 1, height: monthsH }], false);
  const monthsTop = oy + cordInlineTop(years.layouts[1]!);
  const months = level(f, "mo", monthRows, CORD.monthRowH, monthsTop, [{ index: OCT, progress: pm, height: daysH }], true);
  if (pm > 0.002) {
    const df: Frame = { blobs: [], labels: new Map() };
    const daysTop = monthsTop + cordInlineTop(months.layouts[OCT]!);
    const days = level(df, "d", dayRows, CORD.dayRowH, daysTop, [{ index: TODAY, progress: pd, height: hoursH }], true);
    if (pd > 0.002) {
      const hf: Frame = { blobs: [], labels: new Map() };
      const hoursTop = daysTop + cordInlineTop(days.layouts[TODAY]!);
      ribCage(hf, hours, hoursTop, u, scheme, ph, NOW_MIN[mode]);
      clipped(df, hf, hoursTop + hoursH * pd);
    }
    clipped(f, df, daysTop + daysH * pm);
  }
  // OO dangles under the Nexus on its string; the rows scroll behind it (masked in CSS).
  f.blobs.push({ t: "rect", x: CX - 2, y: ooY - 60, w: 4, h: 40, r: 2 });
  f.labels.set("oo", { x: CX, y: ooY, s: 1, o: 1 });
  f.labels.set("spaces", { x: CX + 82, y: ooY - 18, s: 1, o: 1 });
  return f;
}

function buildFrame(mode: DaySpineMode, u: number, scheme: GooScheme): Frame {
  if (mode === "land") {
    // 8:06 (desktop): October is open on the cord; today unfurls into its hours, Maya's call lands at 8 AM, the hour opens.
    const pd = easeInOut((u - 0.1) / 0.75);
    const ph = easeInOut((u - 1.45) / 0.5);
    return spine(mode, u, scheme, 1, pd, ph, (today) => 236 - today, 66);
  }
  if (mode === "meet") {
    // 10:30 (phone): the day is open; the 10 AM hour opens on the meeting slab and its call note.
    return spine(mode, u, scheme, 1, 1, easeInOut((u - 0.1) / 0.5), (today) => 150 - today, 92);
  }
  // 11:40 pm: the day folds back into "19 TODAY" (its ribs grow back), then October folds into its pill.
  const pd = 1 - easeInOut((u - 0.3) / 0.9);
  const pm = 1 - easeInOut((u - 1.5) / 0.9);
  const shift = easeInOut((u - 1.3) / 1.2);
  // The view eases from keeping today in place to keeping October in place, so nothing jumps.
  return spine(mode, u, scheme, pm, pd, 0, (today, oct) => (170 - today) * (1 - shift) + (420 - oct) * shift, 92);
}

/* ── Labels (crisp HTML over the goo) ── */

function ChipLabel({ c }: { c: Chip }) {
  return (
    <span className={`dsp-chip${c.label ? "" : " dsp-chip--bead"}`}>
      <Icon d={c.icon} size={c.label ? 13 : 12} />
      {c.label ? <span>{c.label}</span> : null}
    </span>
  );
}

/** The open 8 AM hour, laid out like the app's hour panel: category rows with wells, a memory tile, the time. */
function CallPanel() {
  return (
    <div className="dsp-panel" style={{ height: 176 }}>
      <span className="dsp-row">
        <span className="dsp-row__glyph" style={{ background: "#FF312B" }}>
          <Icon d={IC.phone} size={15} />
        </span>
        <strong>Call with Maya</strong>
        <span className="dsp-row__well">6:12</span>
        <span className="dsp-row__well">Transcript ›</span>
      </span>
      <span className="dsp-tile">
        <Icon d={IC.calendar} size={20} />
        <small>Coffee Thursday?</small>
      </span>
      <small className="dsp-time">8:06 AM</small>
    </div>
  );
}

/** The open 10 AM hour: the violet meeting slab (`GooSpineMeetingSlab`) and the call note row. */
function MeetingPanel() {
  return (
    <div className="dsp-panel" style={{ height: 236 }}>
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
      <span className="dsp-row">
        <span className="dsp-row__glyph" style={{ background: "#B56FFF" }}>
          <Icon d={IC.doc} size={15} />
        </span>
        <strong>Call note</strong>
        <span className="dsp-row__well">Open ›</span>
      </span>
    </div>
  );
}

function labelSet(mode: DaySpineMode): [string, ReactNode][] {
  const out: [string, ReactNode][] = [
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
    ["now", <span className="dsp-now">{NOW_MIN[mode]}</span>],
  ];
  YEARS.forEach((y, i) => out.push([`y${i}`, <span className={`dsp-month dsp-year${i === 1 ? " is-today" : ""}`}>{y}</span>]));
  MONTHS.forEach((m, i) => out.push([`mo${i}`, <span className={`dsp-month${i === OCT ? " is-today" : ""}${i > OCT ? " is-future" : ""}`}>{m}</span>]));
  dayRows.forEach((_, i) =>
    out.push([
      `d${i}`,
      <span className={`dsp-day${i === TODAY ? " is-today" : ""}${i > TODAY ? " is-future" : ""}${dayRows[i]!.magnitude === 0 && i < TODAY ? " is-quiet" : ""}`}>
        <b>{i + 1}</b>
        <small>{i === TODAY ? "TODAY" : WEEK[i % 7]}</small>
      </span>,
    ]),
  );
  for (const h of HOURS[mode]) {
    if (h.quiet) out.push([`${h.id}-nub`, <span className="dsp-nub">{`${h.n} ${h.ap}`}</span>]);
    else
      out.push([
        `${h.id}-pill`,
        <span className="dsp-hour">
          <b>{h.n}</b>
          <small>{h.ap}</small>
        </span>,
      ]);
    (h.left ?? []).forEach((c, i) => out.push([`${h.id}--1-${i}`, <ChipLabel c={c} />]));
    (h.right ?? []).forEach((c, i) => out.push([`${h.id}-1-${i}`, <ChipLabel c={c} />]));
    if (h.panel) out.push([`${h.id}-panel`, mode === "meet" ? <MeetingPanel /> : <CallPanel />]);
  }
  return out;
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

  const draw = (g: SVGGElement | null, rectPool: SVGRectElement[], circlePool: SVGCircleElement[], blobs: GooBlob[]) => {
    const rs = blobs.filter((b) => b.t === "rect") as Extract<GooBlob, { t: "rect" }>[];
    const cs = blobs.filter((b) => b.t === "circle") as Extract<GooBlob, { t: "circle" }>[];
    const R = pool(g, rectPool, "rect", rs.length);
    const C = pool(g, circlePool, "circle", cs.length);
    R.forEach((el, i) => {
      const b = rs[i];
      if (!b || b.y > height + 40 || b.y + b.h < -80) {
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
      if (!b || b.cy > height + 40 || b.cy < -80) {
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
      const vis = l && l.o > 0.01 && l.y > -60 && l.y < height + 30;
      const v = vis ? `${l.x.toFixed(1)},${l.y.toFixed(1)},${l.s.toFixed(3)},${l.o.toFixed(2)},${l.open ? 1 : 0}` : "off";
      if (last.current.get(id) === v) return;
      last.current.set(id, v);
      if (!vis || !l) {
        el.style.visibility = "hidden";
        return;
      }
      const panel = id.endsWith("-panel");
      el.style.visibility = "visible";
      el.style.opacity = l.o.toFixed(2);
      el.classList.toggle("is-open", !!l.open);
      el.style.transform = `translate3d(${l.x.toFixed(1)}px, ${l.y.toFixed(1)}px, 0) translate(-50%, ${panel ? "0" : "-50%"})${panel ? ` scale(1, ${l.s.toFixed(3)})` : ""}`;
    });
  };

  const paint = (m: DaySpineMode, u: number) => {
    const fr = buildFrame(m, u, scheme);
    draw(gRef.current, rects.current, circles.current, fr.blobs.filter((b) => !b.fill));
    draw(tRef.current, tRects.current, tCircles.current, fr.blobs.filter((b) => b.fill));
    placeLabels(fr);
  };

  useImperativeHandle(ref, () => ({ paint }), [scheme]);

  return (
    <div className="dsp" style={{ width: W, height }}>
      <div className="dsp-scroll">
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
        {labelNodes
          .filter(([id]) => id !== "oo" && id !== "spaces")
          .map(([id, node]) => (
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
      {labelNodes
        .filter(([id]) => id === "oo" || id === "spaces")
        .map(([id, node]) => (
          <div
            key={id}
            className="dsp-label"
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
