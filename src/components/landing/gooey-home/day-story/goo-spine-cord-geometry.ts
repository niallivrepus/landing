/**
 * **Ported verbatim (keep in sync)** from jokuh-live `frontend/src/components/gooey/goo-spine/goo-spine-cord-geometry.ts`
 * for the landing's day story (`DaySpine.tsx`); only the two imports are inlined. Original header follows.
 *
 * Goo Spine · cord geometry (pure) — rows → layout + goo blobs for one level of the nested rib cage, and the cut of a
 * scene into runs between open holes. No Solid, no DOM (unit-tested in `goo-spine-geometry.test.ts`).
 *
 * **Owns:** the date pill (vertebra) sizes, the mirrored stubby ribs (ONE smooth piece per side, plain goo, gentle
 * droop, capped so the rib + tip stays inside the column), the cord (thick behind now, thin ahead, gaps where an open
 * row's inline content draws its own cord), the taffy pull of a day pill, and `splitSegments` (one goo layer per run).
 * **Parity:** Sources/gooey/spine/goo-spine-cord-overview.swift (`GooSpineCordMetrics`, `GooSpineCordGeometry`,
 * `GooSpineCordSegments`, `GooSpineCordRuns`) — numbers verbatim.
 */
/** From jokuh-live `goo-env/goo-kit.ts` (`segmentNeck`), verbatim apart from the rounding helper. */
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
function segmentNeck(L: number, R: number, segW: number, h: number): { capR: number; barH: number; stretch: number } {
  const span = Math.max(0, R - L);
  const stretch = Math.max(0, span - segW) / Math.max(1, segW);
  const barH = h * Math.max(0.26, 1 - 0.8 * stretch);
  const capR = (h / 2) * Math.max(0.72, 1 - 0.22 * stretch);
  return { capR: round(capR, 3), barH: round(barH, 3), stretch: round(stretch, 4) };
}
/** From jokuh-live `goo-spine-palette.ts`. */
export interface GooSpineCategoryShare {
  category: string;
  count: number;
}

/** A goo blob: rounded rect (centre-less, top-left) or circle. `fill` = colour in the goo (default: base glass). */
export type GooBlob =
  | { t: 'rect'; x: number; y: number; w: number; h: number; r: number; fill?: string }
  | { t: 'circle'; cx: number; cy: number; r: number; fill?: string };

export const rectBlob = (x: number, y: number, w: number, h: number, r: number, fill?: string): GooBlob => ({ t: 'rect', x, y, w, h, r, fill });
export const circleBlob = (cx: number, cy: number, r: number, fill?: string): GooBlob => ({ t: 'circle', cx, cy, r, fill });
export const capsuleBlob = (cx: number, cy: number, w: number, h: number, fill?: string): GooBlob =>
  rectBlob(cx - w / 2, cy - h / 2, w, h, Math.min(w, h) / 2, fill);

export const CORD = {
  dayRowH: 24,
  monthRowH: 30,
  yearRowH: 34,
  padTop: 16,
  padBottom: 16,
  embeddedPad: 6,
  cordThick: 7,
  cordThin: 3.5,
  tipGutter: 8,
  inlineGapAbove: 2,
  inlineGapBelow: 6,
  blur: 3,
} as const;

export interface CordRow {
  magnitude: number;
  mix: readonly GooSpineCategoryShare[];
  isCurrent: boolean;
  isFuture: boolean;
}

export interface CordOpen {
  index: number;
  progress: number;
  height: number;
}

export interface CordPull {
  index: number;
  headX: number;
}

export interface CordRowLayout {
  top: number;
  height: number;
  cy: number;
  vw: number;
  vh: number;
  ribStart: number;
  ribLength: number;
  magnitudeT: number;
  open: CordOpen | null;
}

export const cordPadTop = (embedded: boolean) => (embedded ? CORD.embeddedPad : CORD.padTop);
export const cordPadBottom = (embedded: boolean) => (embedded ? CORD.embeddedPad : CORD.padBottom);

export function vertebraSize(row: CordRow, rowH: number): { w: number; h: number } {
  const isMonth = rowH >= CORD.monthRowH;
  if (isMonth) return row.isCurrent ? { w: 58, h: rowH * 0.74 } : { w: 50, h: rowH * 0.64 };
  if (row.isCurrent) return { w: 56, h: rowH * 0.84 };
  if (row.magnitude === 0) return { w: 42, h: rowH * 0.7 };
  return { w: 46, h: rowH * 0.78 };
}

export function ribThickness(t: number, rowH: number): number {
  const isMonth = rowH >= CORD.monthRowH;
  return Math.min(isMonth ? 12 : 10, rowH * 0.24 + rowH * 0.2 * t);
}

export const tipRadius = (h: number) => h * 0.58 + 0.8;

export function openExtra(o: CordOpen): number {
  const p = Math.max(0, o.progress);
  return (CORD.inlineGapAbove + o.height + CORD.inlineGapBelow) * p;
}

/** **Purpose:** Rows → per-row geometry (shared by the goo and the crisp labels). Pure. */
export function cordLayout(rows: readonly CordRow[], width: number, rowH: number, opens: readonly CordOpen[], embedded = false): CordRowLayout[] {
  const cx = Math.round(width / 2);
  const isMonth = rowH >= CORD.monthRowH;
  const busiest = rows.reduce((m, r) => Math.max(m, r.magnitude), 0);
  const cap = Math.max(isMonth ? 24 : 8, busiest);
  const byIndex = new Map<number, CordOpen>();
  for (const o of opens) if (o.progress > 0.001) byIndex.set(o.index, o);
  const out: CordRowLayout[] = [];
  let y = cordPadTop(embedded);
  rows.forEach((row, i) => {
    const v = vertebraSize(row, rowH);
    const m = row.magnitude;
    const t = m > 0 ? Math.sqrt(Math.min(m, cap) / cap) : 0;
    const open = byIndex.get(i) ?? null;
    const p = Math.min(1, Math.max(0, open?.progress ?? 0));
    const start = v.w / 2 - 2;
    const tip = tipRadius(ribThickness(t, rowH)) + CORD.blur;
    const reach = Math.min(isMonth ? 52 : 46, Math.max(10, cx - CORD.tipGutter - tip - start));
    const length = m > 0 ? (8 + (reach - 8) * t) * (1 - p) : 0;
    const extra = open ? openExtra(open) : 0;
    out.push({ top: y, height: rowH + extra, cy: y + rowH / 2, vw: v.w, vh: v.h, ribStart: start, ribLength: length, magnitudeT: t, open });
    y += rowH + extra;
  });
  return out;
}

export function cordTotalHeight(layouts: readonly CordRowLayout[], embedded = false): number {
  const last = layouts[layouts.length - 1];
  return (last ? last.top + last.height : cordPadTop(embedded)) + cordPadBottom(embedded);
}

/** Where an open row's inline content starts. */
export const cordInlineTop = (l: CordRowLayout) => l.top + (l.cy - l.top) * 2 + CORD.inlineGapAbove;

/** A centred cord split into runs around holes. Pure. */
export function cordRuns(top: number, bottom: number, holes: readonly [number, number][]): [number, number][] {
  const out: [number, number][] = [];
  let y = top;
  for (const h of [...holes].sort((a, b) => a[0] - b[0])) {
    if (h[0] > y + 0.5) out.push([y, h[0]]);
    y = Math.max(y, h[1]);
  }
  if (bottom > y + 0.5) out.push([y, bottom]);
  return out;
}

export function appendCord(
  blobs: GooBlob[],
  runs: readonly [number, number][],
  cx: number,
  split: number,
  thick: number,
  thin: number,
  radius: number,
): void {
  for (const [a, b] of runs) {
    if (b <= a) continue;
    if (split > a) {
      const e = Math.min(b, split);
      blobs.push(rectBlob(cx - thick / 2, a, thick, e - a, Math.min(radius, thick / 2)));
    }
    if (b > split) {
      const y0 = Math.max(a, split - 6);
      blobs.push(rectBlob(cx - thin / 2, y0, thin, b - y0, Math.min(radius, thin / 2)));
    }
  }
}

/** The pulled day pill as taffy: an anchored cap where it was, the head under the finger, a thinning neck. Pure. */
export function taffyBlobs(cx: number, cy: number, w: number, h: number, headX: number, fill?: string): GooBlob[] {
  const headCX = cx + headX;
  const neck = segmentNeck(Math.min(cx, headCX) - w / 2, Math.max(cx, headCX) + w / 2, w, h);
  const stretch = Math.min(1, Math.abs(headX) / (80 * 0.62));
  const capW = Math.max(h * 0.9, w * (1 - 0.7 * stretch));
  const capX = cx + (headCX < cx ? 1 : -1) * ((w - capW) / 2);
  return [
    capsuleBlob(capX, cy, capW, neck.capR * 2, fill),
    capsuleBlob(headCX, cy, w, h, fill),
    capsuleBlob((capX + headCX) / 2, cy, Math.abs(headCX - capX), neck.barH * 0.7, fill),
  ];
}

export interface CordScene {
  blobs: GooBlob[];
  /** Holes (inline content spans) the scene leaves out — where segments may be cut. */
  holes: [number, number][];
}

/**
 * **Purpose:** The level as ONE goo scene: cord, date pills (today accent), plain mirrored ribs with a round tip and
 * a slight droop. `embedded` = a level inside another (cord edge to edge, no end caps). Pure.
 */
export function cordScene(
  rows: readonly CordRow[],
  layouts: readonly CordRowLayout[],
  width: number,
  rowH: number,
  opts: { embedded?: boolean; pull?: CordPull | null; accent: string },
): CordScene {
  const embedded = !!opts.embedded;
  if (!rows.length || rows.length !== layouts.length || width <= 40) return { blobs: [], holes: [] };
  const blobs: GooBlob[] = [];
  const cx = Math.round(width / 2);
  const top = embedded ? 0 : layouts[0]!.top - 4;
  const lastL = layouts[layouts.length - 1]!;
  const bottom = embedded ? cordTotalHeight(layouts, true) : lastL.top + lastL.height + 4;
  const split = (() => {
    const ci = rows.findIndex(r => r.isCurrent);
    if (ci >= 0) {
      const l = layouts[ci]!;
      return l.open ? cordInlineTop(l) : l.cy;
    }
    let li = -1;
    rows.forEach((r, i) => {
      if (!r.isFuture) li = i;
    });
    if (li >= 0) return li === rows.length - 1 ? bottom : layouts[li]!.top + layouts[li]!.height;
    return top;
  })();
  const holes: [number, number][] = [];
  for (const l of layouts) {
    if (!l.open || l.open.progress <= 0.001) continue;
    const g0 = cordInlineTop(l) + 2;
    const g1 = cordInlineTop(l) + l.open.height * Math.min(1, l.open.progress) - 2;
    if (g1 > g0) holes.push([g0, g1]);
  }
  appendCord(blobs, cordRuns(top, bottom, holes), cx, split, CORD.cordThick, CORD.cordThin, 1.5);
  if (!embedded) {
    blobs.push(circleBlob(cx, top + 3, (split > top ? CORD.cordThick : CORD.cordThin) * 0.7));
    blobs.push(circleBlob(cx, bottom - 3, bottom > split ? CORD.cordThin * 0.9 : CORD.cordThick * 0.7));
  }
  rows.forEach((row, i) => {
    const l = layouts[i]!;
    const cy = l.cy;
    const fill = row.isCurrent ? opts.accent : undefined;
    if (opts.pull && opts.pull.index === i && Math.abs(opts.pull.headX) > 0.5) {
      blobs.push(...taffyBlobs(cx, cy, l.vw, l.vh, opts.pull.headX, fill));
    } else {
      blobs.push(rectBlob(cx - l.vw / 2, cy - l.vh / 2, l.vw, l.vh, l.vh / 2, fill));
    }
    if (row.magnitude <= 0 || l.ribLength <= 2) return;
    // Plain ribs: one smooth piece per side (several welded segments read wavy — Sean 2026-10-18).
    const length = l.ribLength;
    const h0 = ribThickness(l.magnitudeT, rowH);
    const droop = rowH * 0.15;
    const start = l.ribStart;
    for (const side of [1, -1]) {
      const u = 0.5;
      const h = Math.max(3, h0 * (1 - 0.42 * u));
      const dy = droop * Math.pow(u, 1.6);
      const a = cx + side * (start - 1);
      const b = cx + side * (start + length + 1);
      blobs.push(rectBlob(Math.min(a, b), cy + dy - h / 2, Math.abs(b - a), h, h / 2));
      blobs.push(circleBlob(cx + side * (start + length), cy + droop, tipRadius(h)));
    }
  });
  return { blobs, holes };
}

const midY = (b: GooBlob) => (b.t === 'circle' ? b.cy : b.y + b.h / 2);

export interface GooSegment {
  originY: number;
  height: number;
  blobs: GooBlob[];
}

/** A hole must be at least this tall to cut there (past the blur reach and the cast shadow's tail). */
export const MIN_CUT_GAP = 48;

/**
 * **Purpose:** Cuts a scene at its holes into independently positioned pieces (one goo layer per run), each in its
 * own coordinates. Holes shorter than `MIN_CUT_GAP` stay in one piece. Pure.
 */
export function splitSegments(blobs: readonly GooBlob[], holes: readonly [number, number][], height: number): GooSegment[] {
  const cuts = holes.filter(h => h[1] - h[0] >= MIN_CUT_GAP).sort((a, b) => a[0] - b[0]);
  if (!cuts.length) return [{ originY: 0, height, blobs: [...blobs] }];
  const bounds: [number, number][] = [];
  let start = 0;
  for (const c of cuts) {
    bounds.push([start, c[0]]);
    start = c[1];
  }
  bounds.push([start, height]);
  const piece = (y: number) => cuts.reduce((k, c) => (y >= c[1] ? k + 1 : k), 0);
  const out: GooSegment[] = bounds.map(([a, b]) => ({ originY: a, height: Math.max(1, b - a), blobs: [] }));
  for (const bl of blobs) {
    const k = piece(midY(bl));
    const dy = bounds[k]![0];
    out[k]!.blobs.push(bl.t === 'circle' ? { ...bl, cy: bl.cy - dy } : { ...bl, y: bl.y - dy });
  }
  return out;
}

/** iOS rubber band on a signed drag (`GooKit.rubber`, 90 pt). */
export function rubberSigned(d: number, limit = 90): number {
  const s = d < 0 ? -1 : 1;
  const a = Math.abs(d);
  return s * (a <= 0 ? 0 : limit * (1 - Math.exp(-a / limit)));
}

/** Day pill pull past ±54: left = next day (+1), right = previous (−1). */
export function dayPillStep(dx: number, threshold = 54): number {
  if (dx <= -threshold) return 1;
  if (dx >= threshold) return -1;
  return 0;
}

export const ramp = (x: number, a: number, b: number) => Math.min(1, Math.max(0, (x - a) / (b - a)));
