/**
 * **Ported verbatim (keep in sync)** from jokuh-live `frontend/src/components/profile-live/orb/goo-orb-full-geometry.ts`
 * for the landing's day story (`DayStoryOrb.tsx`); only this header differs. Original header follows.
 *
 * The Orb in goo (Gooey on) — stage geometry for the full Orb on a real live (pure, no DOM).
 *
 * **Owns:** where the orb, the colosseum seats and the VIP chairs sit for one canvas, sized like the classic Orb:
 * the orb is `min(W − 24, 720)` wide at 1.7 : 1 (× 0.95 so the goo rim + voice ripple stay on screen), centred in
 * the band between the top chrome and the composer. Back tiers climb from the orb's top arc to the top band (faces
 * 22 → 14 wide, ≤ 9 rings); front tiers fill from the orb's bottom rim to the composer with 38 → 48 faces grown
 * (≤ × 1.45) to fill. Every tier is a goo ring round the orb (front and back halves have their own radii) so the
 * stands hang off the rim. Fill order = front tiers centre-out, then back tiers centre-out (slot 0 = front centre =
 * you). The 12 VIP chairs ride two curved rows on the orb's upper shoulders, hugging the rim (inner row 22 out,
 * outer row 54 out) on a curved goo table between them, chair 0 nearest the top centre.
 * **Stadium:** Tier A = face `slots` (≤ `cap`), Tier B = `beads` (people-dots nested outside Tier A out to every
 * screen edge, ≤ `beadCap`). Everyone past face + bead capacity is a count only. (iOS also paints a Tier C crowd
 * "sea" for very large rooms — not ported to web yet.)
 * **Units:** design points. `gooOrbFullFit` maps the real view to design points (phones: width / 390; wide
 * screens: height / 700 caps the scale and the canvas widens).
 * **Connects to:** `ProfileLiveGooOrb.tsx`. **Parity:** Swift
 * `Sources/gooey/gallery/demos/orb-full/goo-lab-orb-full-geometry.swift` (`GooOrbFullGeometry.make`),
 * `Sources/profile-live-orb/profile-live-orb-goo-full.swift` (`ProfileLiveGooOrbFit`).
 */

export type GooOrbEllipse = { cx: number; cy: number; rx: number; ry: number };
export type GooOrbPoint = { x: number; y: number };

export type GooOrbStandRing = {
  rxFront: number;
  ryFront: number | null;
  rxBack: number;
  ryBack: number | null;
  backW: number;
  frontW: number;
};

export type GooOrbSlot = { ring: number; angle: number; front: boolean };
export type GooOrbChair = { left: boolean; index: number; x: number; y: number };
export type GooOrbBead = { x: number; y: number; w: number; front: boolean };
export type GooOrbSeat = {
  ring: number;
  index: number;
  x: number;
  y: number;
  /** 0 = very back, 1 = very front. */
  depth: number;
  /** Face width (design pt). */
  w: number;
  /** Behind the orb (back half, inside the rim): not drawn. */
  behind: boolean;
  front: boolean;
};

export type GooOrbGeometry = {
  w: number;
  h: number;
  orb: GooOrbEllipse;
  rings: GooOrbStandRing[];
  slots: GooOrbSlot[];
  chairs: GooOrbChair[];
  /** Goo table beads under each side's chairs: [left, right]. */
  tables: [GooOrbPoint[], GooOrbPoint[]];
  vipTag: GooOrbPoint;
  /** Stand sway amplitude (radians). */
  sway: number;
  beads: GooOrbBead[];
  backSwayR: number;
  frontSwayR: number;
};

export const GOO_ORB_DESIGN_W = 390;
export const GOO_ORB_MAX_SEATS = 240;
export const GOO_ORB_LOW_SEATS = 96;
export const GOO_ORB_BACK_RINGS_A = 9;
export const GOO_ORB_BEAD_ASPECT = 1.2;
export const GOO_ORB_BEAD_CAP_FULL = 2600;
export const GOO_ORB_BEAD_CAP_LOW = 1200;
export const GOO_ORB_BEAD_MARGIN = 28;
export const GOO_ORB_CHAIR_SCALE = 1.15;
/** Seat rect / face aspect (classic avatar 64 / 47). */
export const GOO_ORB_SEAT_ASPECT = 1.35;
export const GOO_ORB_VIP_CHAIRS = 12;

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export function gooOrbEllipseNorm(e: GooOrbEllipse, x: number, y: number): number {
  const dx = (x - e.cx) / Math.max(1e-6, e.rx);
  const dy = (y - e.cy) / Math.max(1e-6, e.ry);
  return dx * dx + dy * dy;
}

export function gooOrbFaceWidth(r: GooOrbStandRing, depth: number): number {
  return r.backW + (r.frontW - r.backW) * Math.pow(clamp(depth, 0, 1), 1.3);
}

/** Screen ↔ design: scale = min(W / 390, H / 700) in [0.4, 2]; the design canvas fills the whole view. */
export function gooOrbFullFit(w: number, h: number): { s: number; cw: number; ch: number } {
  const fit = w > 0 && h > 0 ? Math.min(w / GOO_ORB_DESIGN_W, h / 700) : 1;
  const s = clamp(fit, 0.4, 2);
  return { s, cw: w / s, ch: h / s };
}

/** The chair index for a VIP seat (0 = left 0, 1 = right 0, 2 = left 1 …). */
export function gooOrbChairIndex(left: boolean, seatIndex: number): number {
  return seatIndex * 2 + (left ? 0 : 1);
}

/** Seats `0..<count` at this sway (radians). */
export function gooOrbSeats(g: GooOrbGeometry, count: number, rotation: number): GooOrbSeat[] {
  const n = Math.min(count, g.slots.length);
  const grown: GooOrbEllipse = { cx: g.orb.cx, cy: g.orb.cy, rx: g.orb.rx + 4, ry: g.orb.ry + 4 };
  const out: GooOrbSeat[] = [];
  for (let i = 0; i < n; i += 1) {
    const sl = g.slots[i]!;
    const r = g.rings[sl.ring]!;
    const a = sl.angle + rotation * (sl.front ? 1 : -1);
    const rx = sl.front ? r.rxFront : r.rxBack;
    const ry = (sl.front ? r.ryFront : r.ryBack) ?? 0;
    const x = g.orb.cx + Math.cos(a) * rx;
    const y = g.orb.cy + Math.sin(a) * ry;
    const depth = (Math.sin(a) + 1) / 2;
    out.push({
      ring: sl.ring,
      index: i,
      x,
      y,
      depth,
      w: gooOrbFaceWidth(r, depth),
      behind: !sl.front && gooOrbEllipseNorm(grown, x, y) <= 1,
      front: sl.front,
    });
  }
  return out;
}

/** Tier B bead `j` at this sway (the bead layers slide as one). */
export function gooOrbBeadPoint(g: GooOrbGeometry, j: number, rotation: number): GooOrbPoint | null {
  const b = g.beads[j];
  if (!b) return null;
  return { x: b.x - rotation * (b.front ? g.frontSwayR : g.backSwayR), y: b.y };
}

/**
 * Build the stage for a `w × h` design canvas with `top` / `bottom` chrome bands. `cap` = Tier A face seats
 * (96 on low power / Reduce Motion), `beadCap` = Tier B beads.
 */
export function makeGooOrbGeometry(
  wIn: number,
  hIn: number,
  top: number,
  bottom: number,
  cap: number = GOO_ORB_MAX_SEATS,
  beadCap: number = GOO_ORB_BEAD_CAP_FULL,
): GooOrbGeometry {
  const w = Math.max(200, wIn);
  const h = Math.max(300, hIn);
  const cx = w / 2;
  // Landscape / desktop: the orb also caps at 30 % of the band's height so the stands keep room to climb and fill
  // (web-only; phones and the iOS canvas never hit it).
  const band0 = Math.max(0, h - bottom - top);
  const rx = Math.min((Math.min(w - 24, 720) / 2) * 0.95, w > h ? band0 * 0.3 * 1.7 : Infinity);
  const ry = rx / 1.7;
  const bandTop = top;
  const bandBottom = Math.max(bandTop + 2 * ry + 40, h - bottom);
  const cy = (bandTop + bandBottom) / 2;
  const orb: GooOrbEllipse = { cx, cy, rx, ry };
  const aspect = GOO_ORB_SEAT_ASPECT;
  const CS = GOO_ORB_CHAIR_SCALE;

  // Back tiers: the orb's top arc up to the top band, shrinking with distance.
  const back: Array<{ ry: number; w: number }> = [];
  let bw = 22;
  let by = ry + 16;
  while (back.length < GOO_ORB_BACK_RINGS_A) {
    back.push({ ry: by, w: bw });
    const nw = Math.max(14, bw - 0.9);
    const ny = by + 0.8 * nw * aspect;
    if (cy - ny - nw * aspect * 0.5 < bandTop - nw * aspect * 0.25) break;
    bw = nw;
    by = ny;
  }

  // Front tiers: the orb's bottom rim to the composer; row count + growth chosen to fill.
  const widths = [38, 40, 42, 44, 46, 48];
  const start = cy + ry - 8;
  const avail = Math.max(0, bandBottom - start);
  const span = (hs: number[]) => hs.slice(0, -1).reduce((a, b) => a + b * 0.62, 0) + (hs[hs.length - 1] ?? 0);
  let best = { n: 2, grow: 1, fill: 0 };
  const maxRows = h >= 900 ? 6 : 5;
  for (let n = 2; n <= maxRows; n += 1) {
    const hs = widths.slice(0, n).map(x => x * aspect);
    const base = span(hs);
    const grow = Math.min(1.45, Math.max(1, avail / Math.max(base, 1)));
    const fill = base * grow;
    if (fill <= avail + 0.5 && fill > best.fill) best = { n, grow, fill };
  }
  const extra = best.n > 1 ? Math.max(0, avail - best.fill) / (best.n - 1) : 0;
  const front: Array<{ ry: number; w: number }> = [];
  let fy = start;
  for (const w0 of widths.slice(0, best.n)) {
    const fw = w0 * best.grow;
    const fh = fw * aspect;
    front.push({ ry: fy + fh / 2 - cy, w: fw });
    fy += fh * 0.62 + Math.min(extra, fh * 0.25);
  }

  // Landscape: tiers flare wider (the stands spread out to the screen sides instead of stacking up). Web-only.
  const nRings = Math.max(back.length, front.length);
  const flare = w > h ? Math.max(1, Math.min(4, (w / 2 - rx - 24) / Math.max(1, 26 * nRings))) : 1;
  const rings: GooOrbStandRing[] = [];
  for (let j = 0; j < nRings; j += 1) {
    const b = back[j];
    const f = front[j];
    rings.push({
      rxFront: rx + 24 + 30 * j * flare,
      ryFront: f?.ry ?? null,
      rxBack: rx + 24 + 22 * j * flare,
      ryBack: b?.ry ?? null,
      backW: b?.w ?? back[back.length - 1]?.w ?? 14,
      frontW: f?.w ?? front[front.length - 1]?.w ?? 48,
    });
  }

  // VIP: two curved rows hugging the orb's upper shoulders.
  const inner = [-0.35, -0.26, -0.17].map(a => a * Math.PI);
  const outer = [-0.395, -0.305, -0.215].map(a => a * Math.PI);
  const chairHalfW = 12 * CS;
  const shoulder = (a: number, off: number): GooOrbPoint => ({
    x: Math.min(w - chairHalfW - 4, cx + Math.cos(a) * (rx + off)),
    y: cy + Math.sin(a) * (ry + off),
  });
  const rightSeats: GooOrbPoint[] = [...inner.map(a => shoulder(a, 22)), ...outer.map(a => shoulder(a, 54))];
  const chairs: GooOrbChair[] = [];
  for (let k = 0; k < GOO_ORB_VIP_CHAIRS; k += 1) {
    const left = k % 2 === 0;
    const index = Math.floor(k / 2);
    const p = rightSeats[Math.min(index, rightSeats.length - 1)]!;
    chairs.push({ left, index, x: left ? 2 * cx - p.x : p.x, y: p.y });
  }
  const rightTable: GooOrbPoint[] = [];
  const tR = { x: rx + 38, y: ry + 38 };
  for (let a = -0.425 * Math.PI; a <= -0.14 * Math.PI; ) {
    rightTable.push({ x: Math.min(w - 10, cx + Math.cos(a) * tR.x), y: cy + Math.sin(a) * tR.y });
    const ds = Math.max(1, Math.hypot(tR.x * Math.sin(a), tR.y * Math.cos(a)));
    a += 11 / ds;
  }
  const tables: [GooOrbPoint[], GooOrbPoint[]] = [rightTable.map(p => ({ x: 2 * cx - p.x, y: p.y })), rightTable];
  const topChair = rightSeats[3]!;
  const vipTag = { x: topChair.x, y: topChair.y - 15 * CS - 12 };

  // Seats: walk each tier at the seats' own width, centre-out; keep on-screen ones clear of orb, chairs, tag.
  const orbGrow6: GooOrbEllipse = { cx, cy, rx: rx + 6, ry: ry + 6 };
  const keep = (x: number, y: number, fw: number, isFront: boolean) => {
    const fh = fw * aspect;
    if (x - fw / 2 < 0 || x + fw / 2 > w || y - fh / 2 < 0 || y + fh / 2 > h) return false;
    if (isFront) return gooOrbEllipseNorm(orb, x, y) > 1.05;
    if (gooOrbEllipseNorm(orbGrow6, x, y) <= 1) return false;
    for (const c of chairs) if (Math.hypot(c.x - x, c.y - y) < 15 * CS + fw * 0.55) return false;
    if (Math.abs(x - vipTag.x) < 38 + fw / 2 && Math.abs(y - vipTag.y) < 8 + fh / 2) return false;
    return true;
  };
  const walk = (j: number, isFront: boolean): GooOrbSlot[] => {
    const r = rings[j]!;
    const ryr = isFront ? r.ryFront : r.ryBack;
    if (ryr == null) return [];
    const rxr = isFront ? r.rxFront : r.rxBack;
    const mid = isFront ? Math.PI / 2 : 1.5 * Math.PI;
    const dir = isFront ? -1 : 1;
    const right: number[] = [];
    let a = mid;
    for (let steps = 0; steps < 80; steps += 1) {
      const s = Math.sin(a);
      if (isFront ? s < 0.06 : s > -0.06) break;
      const fw = gooOrbFaceWidth(r, (s + 1) / 2);
      if (cx + Math.cos(a) * rxr + fw / 2 > w) break;
      right.push(a);
      const ds = Math.max(1, Math.hypot(rxr * Math.sin(a), ryr * Math.cos(a)));
      a += (dir * fw) / ds;
    }
    const out: GooOrbSlot[] = [];
    right.forEach((ar, n) => {
      const pair = n === 0 ? [ar] : [ar, (isFront ? Math.PI : 3 * Math.PI) - ar];
      for (const an of pair) {
        const x = cx + Math.cos(an) * rxr;
        const y = cy + Math.sin(an) * ryr;
        if (keep(x, y, gooOrbFaceWidth(r, (Math.sin(an) + 1) / 2), isFront)) out.push({ ring: j, angle: an, front: isFront });
      }
    });
    return out;
  };
  let slots: GooOrbSlot[] = [];
  for (let j = 0; j < rings.length; j += 1) slots.push(...walk(j, true));
  for (let j = 0; j < rings.length; j += 1) slots.push(...walk(j, false));
  slots = slots.slice(0, GOO_ORB_MAX_SEATS);
  const keepA = Math.min(slots.length, Math.max(1, cap));

  // Tier B: Tier A slots past the cap first (low power), a touch smaller; then nested bead rings.
  const beads: GooOrbBead[] = slots.slice(keepA).map(sl => {
    const r = rings[sl.ring]!;
    const rxr = sl.front ? r.rxFront : r.rxBack;
    const ryr = (sl.front ? r.ryFront : r.ryBack) ?? 0;
    return {
      x: cx + Math.cos(sl.angle) * rxr,
      y: cy + Math.sin(sl.angle) * ryr,
      w: gooOrbFaceWidth(r, (Math.sin(sl.angle) + 1) / 2) * 0.8,
      front: sl.front,
    };
  });
  slots = slots.slice(0, keepA);
  const lastBack = back[back.length - 1] ?? { ry: ry + 16, w: 22 };
  const lastBackRx = rx + 24 + 22 * Math.max(0, back.length - 1) * flare;
  const lastFront = front[front.length - 1] ?? { ry: ry + 30, w: 48 };
  const lastFrontH = lastFront.w * aspect;
  const lastFrontRx = rx + 24 + 30 * Math.max(0, front.length - 1) * flare;
  const margin = GOO_ORB_BEAD_MARGIN;
  const BA = GOO_ORB_BEAD_ASPECT;
  const orbGrow8: GooOrbEllipse = { cx, cy, rx: rx + 8, ry: ry + 8 };
  const beadOK = (x: number, y: number, bw2: number) => {
    const bh = bw2 * BA;
    if (x < -margin || x > w + margin || y + bh / 2 < 0 || y - bh / 2 > h) return false;
    if (gooOrbEllipseNorm(orbGrow8, x, y) <= 1) return false;
    for (const c of chairs) if (Math.hypot(c.x - x, c.y - y) < 15 * CS + bw2 * 0.6) return false;
    if (Math.abs(x - vipTag.x) < 38 + bw2 / 2 && Math.abs(y - vipTag.y) < 8 + bh / 2) return false;
    return true;
  };
  const beadRing = (rxr: number, ryr: number, bw2: number, isFront: boolean): GooOrbBead[] => {
    const mid = isFront ? Math.PI / 2 : 1.5 * Math.PI;
    const dir = isFront ? -1 : 1;
    let a = mid;
    const right: number[] = [];
    for (let steps = 0; steps < 400; steps += 1) {
      const s = Math.sin(a);
      if (isFront ? s < 0.06 : s > -0.06) break;
      if (cx + Math.cos(a) * rxr > w + margin) break;
      right.push(a);
      const ds = Math.max(1, Math.hypot(rxr * Math.sin(a), ryr * Math.cos(a)));
      a += (dir * bw2 * 1.1) / ds;
    }
    const out: GooOrbBead[] = [];
    right.forEach((ar, n) => {
      for (const an of n === 0 ? [ar] : [ar, (isFront ? Math.PI : 3 * Math.PI) - ar]) {
        const x = cx + Math.cos(an) * rxr;
        const y = cy + Math.sin(an) * ryr;
        if (beadOK(x, y, bw2)) out.push({ x, y, w: bw2, front: isFront });
      }
    });
    return out;
  };
  const backRows: GooOrbBead[][] = [];
  let bw2 = Math.min(13, lastBack.w - 3);
  let bry = lastBack.ry + lastBack.w * aspect * 0.5 + bw2 * BA * 0.55;
  const firstBackRx = lastBackRx + (bry - lastBack.ry);
  while (backRows.length < 60) {
    const brx = lastBackRx + (bry - lastBack.ry);
    const side = Math.min(1, (w / 2 + margin) / brx);
    if (cy - bry * Math.sqrt(1 - side * side) + bw2 < 0) break;
    backRows.push(beadRing(brx, bry, bw2, false));
    const nw = Math.max(4.5, bw2 - 0.45);
    bry += (0.88 * (bw2 + nw)) / 2 * BA;
    bw2 = nw;
  }
  const frontRows: GooOrbBead[][] = [];
  const fbw = 12;
  let fry = lastFront.ry + lastFrontH * 0.5 + fbw * BA * 0.45;
  const firstFrontRx = lastFrontRx + (fry - lastFront.ry) * 0.6;
  while (frontRows.length < 30 && cy + fry - (fbw * BA) / 2 <= h) {
    const frx = lastFrontRx + (fry - lastFront.ry) * 0.6;
    frontRows.push(beadRing(frx, fry, fbw, true));
    fry += 0.9 * fbw * BA;
  }
  // Fill order: one row per step, outward on both halves at the same relative depth (back first on ties).
  const order: Array<{ front: boolean; k: number; depth: number }> = [];
  backRows.forEach((_, k) => order.push({ front: false, k, depth: (k + 1) / backRows.length }));
  frontRows.forEach((_, k) => order.push({ front: true, k, depth: (k + 1) / frontRows.length }));
  order.sort((a, b) => (a.depth !== b.depth ? a.depth - b.depth : !a.front && b.front ? -1 : a.front && !b.front ? 1 : 0));
  for (const o of order) beads.push(...(o.front ? frontRows[o.k]! : backRows[o.k]!));

  return {
    w,
    h,
    orb,
    rings,
    slots,
    chairs,
    tables,
    vipTag,
    sway: 0.045,
    beads: beads.slice(0, Math.max(0, beadCap)),
    backSwayR: firstBackRx,
    frontSwayR: firstFrontRx,
  };
}

/** Rim beads round the orb with the host's voice ripple (lab `orbRimBeads`, simplified). */
export function gooOrbRimBeads(n: number, o: GooOrbEllipse, r: number, level: number, phase: number): Array<GooOrbPoint & { r: number }> {
  const out: Array<GooOrbPoint & { r: number }> = [];
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2;
    const wob = level > 0 ? Math.sin(a * 6 + phase) * level * 5 : 0;
    out.push({ x: o.cx + Math.cos(a) * (o.rx + wob), y: o.cy + Math.sin(a) * (o.ry + wob * 0.7), r: r * (1 + level * 0.35) });
  }
  return out;
}

/** Neck beads from the orb rim to a front seat hanging under it ([] when the seat is far). */
export function gooOrbFrontNeck(seat: GooOrbPoint, o: GooOrbEllipse, reach = 46): Array<GooOrbPoint & { r: number }> {
  const a = Math.atan2((seat.y - o.cy) / o.ry, (seat.x - o.cx) / o.rx);
  const rim = { x: o.cx + Math.cos(a) * o.rx, y: o.cy + Math.sin(a) * o.ry };
  const d = Math.hypot(seat.x - rim.x, seat.y - rim.y);
  if (d > reach || d < 1) return [];
  const out: Array<GooOrbPoint & { r: number }> = [];
  for (let k = 0; k < 2; k += 1) {
    const u = (k + 1) / 3;
    out.push({ x: rim.x + (seat.x - rim.x) * u, y: rim.y + (seat.y - rim.y) * u, r: 6.5 * (1 - 0.45 * Math.sin(Math.PI * u)) * (1 - (d / reach) * 0.35) });
  }
  return out;
}

/** Initials for a seat without a photo ("@" dropped, two words max). */
export function gooOrbInitials(name: string): string {
  return name
    .replace(/@/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => (w[0] ?? '').toUpperCase())
    .join('');
}
