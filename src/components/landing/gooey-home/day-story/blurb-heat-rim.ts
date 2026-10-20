/**
 * **Ported verbatim (keep in sync)** from jokuh-live `frontend/src/components/blurbs/rim/BlurbsRimHeatRim.tsx`
 * (`paintHeat`, `spark`, `hash`; branch `worktree-agent-a69b593ec7c5a6053`), for the day story's Blurbs beat. Only the
 * Solid component and imports are left out. Original notes: the "this blurb is hot" border on a Gooey Blurbs rim card,
 * living flames (deep red → orange → yellow cores) licking up the rim with embers and heat shimmer, or frost crystals.
 * Flames grow outward (the inner edge is ≤ 3 px) so content is never covered.
 * **Parity:** Sources/gooey/goo-blurb-heat-rim.swift (`GooBlurbHeatPainter`, numbers verbatim).
 */
export type RimHeatKind = "normal" | "fire" | "frozen";


const DEEP_RED = [184, 18, 10] as const;
const ORANGE = [255, 107, 26] as const;
const YELLOW = [255, 214, 77] as const;
const ICE = [107, 196, 255] as const;
const CRYSTAL = [199, 235, 255] as const;
const FROST_INK = [77, 158, 224] as const;
const rgba = (c: readonly number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a))})`;

function hash(i: number, salt: number): number {
  let x = Math.imul(i, 73_856_093) ^ Math.imul(salt, 19_349_663);
  x = Math.imul(x ^ (x >>> 15), 0x2c1b3c6d);
  x = Math.imul(x ^ (x >>> 12), 0x297a2d39);
  x ^= x >>> 15;
  return ((x >>> 0) % 10_000) / 10_000;
}

type RimPt = { x: number; y: number; nx: number; ny: number; corner: number };

/** Paints one heat frame centred on (0, 0) for a w×h body with corner r. Pure apart from the context. */
export function paintHeat(ctx: CanvasRenderingContext2D, kind: RimHeatKind, level: number, w: number, h: number, r0: number, t: number, reveal: number, light: boolean): void {
  if (kind === 'normal' || w < 5 || h < 5) return;
  const r = Math.min(r0, w / 2, h / 2);
  const sw = Math.max(0, w - 2 * r);
  const sh = Math.max(0, h - 2 * r);
  const arc = (Math.PI * r) / 2;
  const L = 2 * sw + 2 * sh + 2 * Math.PI * r;
  const hw = w / 2;
  const hh = h / 2;
  const arcPt = (cx: number, cy: number, a0: number, u: number): RimPt => {
    const a = a0 + u / Math.max(0.001, r);
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, nx: Math.cos(a), ny: Math.sin(a), corner: 1 };
  };
  const rim = (s0: number): RimPt => {
    let s = s0 % Math.max(1, L);
    if (s < 0) s += L;
    if (s < sw) return { x: -hw + r + s, y: -hh, nx: 0, ny: -1, corner: 0 };
    s -= sw;
    if (s < arc) return arcPt(hw - r, -hh + r, -Math.PI / 2, s);
    s -= arc;
    if (s < sh) return { x: hw, y: -hh + r + s, nx: 1, ny: 0, corner: 0 };
    s -= sh;
    if (s < arc) return arcPt(hw - r, hh - r, 0, s);
    s -= arc;
    if (s < sw) return { x: hw - r - s, y: hh, nx: 0, ny: 1, corner: 0 };
    s -= sw;
    if (s < arc) return arcPt(-hw + r, hh - r, Math.PI / 2, s);
    s -= arc;
    if (s < sh) return { x: -hw, y: hh - r - s, nx: -1, ny: 0, corner: 0 };
    s -= sh;
    return arcPt(-hw + r, -hh + r, Math.PI, Math.min(s, arc));
  };
  const revealK = (s: number, origin: number) => {
    if (reveal >= 1) return 1;
    let d = Math.abs(s - origin) % L;
    d = Math.min(d, L - d) / (L / 2);
    return Math.max(0, Math.min(1, (reveal * 1.3 - d) / 0.3));
  };
  const body = () => {
    ctx.beginPath();
    ctx.roundRect(-hw, -hh, w, h, r);
  };

  if (kind === 'fire') {
    const spacing = 7.5;
    const n = Math.max(12, Math.floor(L / spacing));
    const baseLen = 9 + 17 * level;
    const origin = 1.5 * sw + sh + Math.PI * r;
    const outer = new Path2D();
    const mid = new Path2D();
    const inner = new Path2D();
    const tongue = (p: Path2D, rp: RimPt, dx: number, dy: number, len: number, half: number, sway: number) => {
      if (len <= 0.8) return;
      const tx = -rp.ny;
      const ty = rp.nx;
      const bx = rp.x - rp.nx * 2;
      const by = rp.y - rp.ny * 2;
      const tipX = bx + dx * len + tx * sway;
      const tipY = by + dy * len + ty * sway;
      const mx = bx + dx * len * 0.45 + tx * sway * 0.5;
      const my = by + dy * len * 0.45 + ty * sway * 0.5;
      p.moveTo(bx - tx * half, by - ty * half);
      p.quadraticCurveTo(mx - tx * half * 0.7, my - ty * half * 0.7, tipX, tipY);
      p.quadraticCurveTo(mx + tx * half * 0.7, my + ty * half * 0.7, bx + tx * half, by + ty * half);
      p.closePath();
    };
    for (let k = 0; k < n; k += 1) {
      const s = (k / n) * L;
      const rp = rim(s);
      const vis = revealK(s, origin);
      if (vis <= 0.02) continue;
      const up = rp.ny < 0.6;
      let dx = up ? rp.nx * 0.8 : rp.nx;
      let dy = up ? rp.ny - 0.85 : rp.ny;
      const m = Math.max(0.001, Math.hypot(dx, dy));
      dx /= m;
      dy /= m;
      const rise = 0.3 + (0.7 * (1 - rp.ny)) / 2;
      const flick = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * (5.1 + hash(k, 1) * 3) + k * 1.7) * Math.cos(t * 2.3 + k * 0.6));
      const len = baseLen * rise * flick * vis * (0.75 + 0.5 * hash(k, 2));
      const sway = Math.sin(t * 3.2 + k * 0.9) * 2.6;
      tongue(outer, rp, dx, dy, len, spacing * 0.95, sway);
      tongue(mid, rp, dx, dy, len * 0.68, spacing * 0.72, sway * 0.7);
      tongue(inner, rp, dx, dy, len * 0.38, spacing * 0.5, sway * 0.4);
    }
    ctx.save();
    ctx.filter = 'blur(1.6px)';
    ctx.fillStyle = rgba(DEEP_RED, light ? 0.82 : 0.9);
    ctx.fill(outer);
    ctx.fillStyle = rgba(ORANGE, 0.92);
    ctx.fill(mid);
    ctx.restore();
    ctx.save();
    if (!light) ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rgba(YELLOW, 0.95);
    ctx.fill(inner);
    ctx.restore();
    const g = ctx.createLinearGradient(0, -hh, 0, hh);
    g.addColorStop(0, rgba(YELLOW, 1));
    g.addColorStop(0.5, rgba(ORANGE, 1));
    g.addColorStop(1, rgba(DEEP_RED, 1));
    body();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = g;
    ctx.stroke();
    for (let m = 0; m < 3; m += 1) {
      const ph = (t * 0.45 + m / 3) % 1;
      const y = -hh - 10 - ph * (34 + 18 * level);
      const span = w * 0.62;
      ctx.beginPath();
      for (let i = 0; i <= 14; i += 1) {
        const x = -span / 2 + (span * i) / 14;
        const yy = y + Math.sin(i * 0.9 + t * 4 + m) * 2.2;
        if (i === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = light ? rgba(ORANGE, 0.12 * Math.sin(ph * Math.PI) * reveal) : `rgba(255,255,255,${0.12 * Math.sin(ph * Math.PI) * reveal})`;
      ctx.stroke();
    }
    const count = 8 + Math.floor(10 * level);
    for (let j = 0; j < count; j += 1) {
      const ph = (t * (0.32 + 0.3 * hash(j, 11)) + hash(j, 12)) % 1;
      const x = -hw + w * (0.06 + 0.88 * hash(j, 13)) + Math.sin(t * 1.4 + j) * 9 * ph;
      const y = -hh - 6 - ph * (36 + 34 * level);
      const sz = (3 + 3.2 * hash(j, 14)) * (1 - ph * 0.5);
      spark(ctx, x, y, sz, YELLOW, Math.sin(ph * Math.PI) * reveal);
    }
    return;
  }

  // Frost.
  const spacing = 13 - 5 * level;
  const n = Math.max(10, Math.floor(L / spacing));
  const ink = light ? FROST_INK : ([255, 255, 255] as const);
  const corners = [sw + arc / 2, 2 * sw + sh + 2.5 * arc, sw + sh + 1.5 * arc, 2 * sw + 2 * sh + 3.5 * arc].map(c => c % Math.max(1, L));
  const g = ctx.createLinearGradient(-hw, -hh, hw, hh);
  g.addColorStop(0, '#fff');
  g.addColorStop(0.5, rgba(CRYSTAL, 1));
  g.addColorStop(1, rgba(ICE, 1));
  body();
  ctx.lineWidth = 2.6;
  ctx.strokeStyle = g;
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(-hw + 3, -hh + 3, Math.max(1, w - 6), Math.max(1, h - 6), Math.max(0, r - 3));
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = `rgba(255,255,255,${light ? 0.55 : 0.35})`;
  ctx.stroke();
  const groups = [new Path2D(), new Path2D(), new Path2D()];
  for (let k = 0; k < n; k += 1) {
    const s = (k / n) * L;
    const rp = rim(s);
    const vis = Math.max(...corners.map(c => revealK(s, c)));
    if (vis <= 0.02) continue;
    const len = (5 + 12 * level) * (0.5 + 0.5 * hash(k, 21)) * (1 + 0.5 * rp.corner) * vis;
    if (len <= 1) continue;
    const a = Math.atan2(rp.ny, rp.nx) + (hash(k, 22) - 0.5) * 0.7;
    const inward = 2 + 2 * hash(k, 23);
    const p = groups[k % 3]!;
    p.moveTo(rp.x - Math.cos(a) * inward, rp.y - Math.sin(a) * inward);
    p.lineTo(rp.x + Math.cos(a) * len, rp.y + Math.sin(a) * len);
    for (const [f, bl] of [
      [0.42, 0.42],
      [0.72, 0.28],
    ] as const) {
      const bx = rp.x + Math.cos(a) * len * f;
      const by = rp.y + Math.sin(a) * len * f;
      p.moveTo(bx, by);
      p.lineTo(bx + Math.cos(a + 1) * len * bl, by + Math.sin(a + 1) * len * bl);
      p.moveTo(bx, by);
      p.lineTo(bx + Math.cos(a - 1) * len * bl, by + Math.sin(a - 1) * len * bl);
    }
  }
  ctx.lineWidth = 1.1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  groups.forEach((p, i) => {
    ctx.strokeStyle = rgba(ink, 0.7 + 0.3 * Math.sin(t * 1.8 + i * 2.1));
    ctx.stroke(p);
  });
  const count = 8 + Math.floor(8 * level);
  for (let j = 0; j < count; j += 1) {
    const h1 = hash(j, 31);
    const ph = (hash(j, 32) + t * 0.05 * (0.6 + h1)) % 1;
    const side = j % 2 === 0 ? -1 : 1;
    const x = side * (hw + 6 + 14 * hash(j, 33)) + Math.sin(t * 0.8 + j) * 4;
    const y = -hh - 16 + ph * (h + 32);
    spark(ctx, x, y, 2.4 + 2.4 * h1, CRYSTAL, Math.sin(ph * Math.PI) * 0.85 * reveal);
  }
}

function spark(ctx: CanvasRenderingContext2D, x: number, y: number, sz: number, c: readonly number[], a: number): void {
  if (a <= 0.01 || sz <= 0.2) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, sz);
  g.addColorStop(0, `rgba(255,255,255,${a})`);
  g.addColorStop(0.45, rgba(c, a));
  g.addColorStop(1, rgba(c, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - sz, y - sz, sz * 2, sz * 2);
}

/**
 * The heat border element. The feed writes `--rim-w` / `--rim-h` / `--rim-r` and the transform every frame through
 * `ref`; `size()` is read when painting. `live` = focused + settled + nothing covering the feed.
 */
