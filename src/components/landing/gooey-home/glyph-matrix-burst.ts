/**
 * **Purpose:** The Glyph mark's "matrix shimmer" moment (Sean 2026-10-19, the one sanctioned addition to the frozen
 * mark). Every 4–9 s (and once on appear) a contiguous patch or a sweeping band of ~8–20% of the cells scrambles
 * through random glyphs for ~380 ms like a decode, lands on its own glyph, flashes matrix green with a soft glow for
 * ~200 ms, then fades back to the ink over ~400 ms. A tap / hover sends a ripple-shaped burst from the pointer.
 * Reduce Motion: no scramble, only a gentle green fade every ~15 s.
 * Cells, hash, alphabet, ink and size are untouched; this only overrides a burst cell's glyph and tint while it runs.
 * Pure (no React / DOM) apart from the scheduler's timers.
 * **Parity (keep in sync, byte-for-byte logic):** jokuh-live `frontend/src/components/home/glyph-matrix-burst.ts`,
 * Swift `Sources/home-glyph-logo-mark.swift` (`HomeGlyphMatrixBurst`).
 */

/** Scramble (decode) length, s. */
export const MATRIX_SCRAMBLE = 0.38;
/** Green flash hold, s. */
export const MATRIX_FLASH = 0.2;
/** Fade back to ink, s. */
export const MATRIX_FADE = 0.4;
/** One scramble glyph lasts this long, s. */
const SCRAMBLE_STEP = 0.042;
/** Auto bursts: random gap in [MIN, MAX] s; Reduce Motion: fixed gentle period. */
export const MATRIX_GAP_MIN = 4;
export const MATRIX_GAP_MAX = 9;
export const MATRIX_GENTLE_PERIOD = 15;
/** First burst after the mark appears (after the appear ripple), s. */
export const MATRIX_FIRST_DELAY = 1.1;

/** Matrix green: classic phosphor on dark; a deeper green on light so it still reads on white. */
export const MATRIX_GREEN_DARK: [number, number, number] = [0, 255, 65];
export const MATRIX_GREEN_LIGHT: [number, number, number] = [0, 168, 46];

export type MatrixCellRef = { col: number; row: number };

export type MatrixBurst = {
  /** Start time, s (same clock as `matrixCellAt`'s `now`). */
  start: number;
  /** Per-cell start delay, s; negative = not in this burst. */
  delay: Float32Array;
  /** Last cell finishes at start + end. */
  end: number;
  gentle: boolean;
  seed: number;
};

/** Output of `matrixCellAt` (reused, no allocation per cell). */
export type MatrixCellState = {
  /** Scramble glyph index, or -1 = draw the cell's own glyph. */
  glyph: number;
  /** 0 = ink … 1 = full matrix green. */
  green: number;
  /** Glow strength 0…1. */
  glow: number;
};

function hash(index: number): number {
  let n = index >>> 0;
  n = (Math.imul(n, 747796405) + 2891336453) >>> 0;
  const shift = (n >>> 28) + 4;
  n = Math.imul((n >>> shift) ^ n, 277803737) >>> 0;
  n = ((n >>> 22) ^ n) >>> 0;
  return n / 4294967295;
}

/** Rows are taller than columns are wide (~1.3×); measure distance in column units. */
const ROW_ASPECT = 1.3;

/**
 * **Purpose:** Pick a burst's cells. `origin` (grid units, fractional ok) = pointer ripple from that point;
 * otherwise a random contiguous patch or a sweeping band. `gentle` = Reduce Motion fade (no scramble, no delay).
 */
export function makeMatrixBurst(
  cells: readonly MatrixCellRef[],
  now: number,
  opts: { origin?: { col: number; row: number }; gentle?: boolean; rand?: () => number } = {},
): MatrixBurst {
  const rand = opts.rand ?? Math.random;
  const n = cells.length;
  const delay = new Float32Array(n).fill(-1);
  const seed = Math.floor(rand() * 1e9);
  const gentle = opts.gentle === true;
  if (n === 0) return { start: now, delay, end: 0, gentle, seed };
  const frac = opts.origin ? 0.14 + rand() * 0.05 : 0.08 + rand() * 0.12;
  const take = Math.max(1, Math.round(n * frac));
  const key = new Float32Array(n);
  const band = !opts.origin && rand() < 0.5;
  let spread: number;
  if (band) {
    // Sweeping band: a contiguous slice of cells along a random direction, swept in that direction.
    const a = rand() * Math.PI * 2;
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    for (let i = 0; i < n; i += 1) key[i] = cells[i]!.col * ux + cells[i]!.row * ROW_ASPECT * uy;
    spread = 0.24;
  } else {
    // Patch / ripple: the cells nearest a centre (slightly ragged edge), revealed outward.
    let cx: number;
    let cy: number;
    if (opts.origin) {
      cx = opts.origin.col;
      cy = opts.origin.row;
    } else {
      const c = cells[Math.floor(rand() * n) % n]!;
      cx = c.col;
      cy = c.row;
    }
    for (let i = 0; i < n; i += 1) {
      const dx = cells[i]!.col - cx;
      const dy = (cells[i]!.row - cy) * ROW_ASPECT;
      key[i] = Math.hypot(dx, dy) + hash(seed + i * 7) * 0.9;
    }
    spread = opts.origin ? 0.26 : 0.16;
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((p, q) => key[p]! - key[q]!);
  const from = band ? Math.floor(rand() * Math.max(1, n - take + 1)) : 0;
  const lo = key[order[from]!]!;
  const hi = key[order[Math.min(n - 1, from + take - 1)]!]!;
  const span = Math.max(1e-3, hi - lo);
  for (let k = from; k < from + take && k < n; k += 1) {
    const i = order[k]!;
    delay[i] = gentle ? 0 : ((key[i]! - lo) / span) * spread;
  }
  const end = gentle ? 1.5 : spread + MATRIX_SCRAMBLE + MATRIX_FLASH + MATRIX_FADE;
  return { start: now, delay, end, gentle, seed };
}

export function matrixBurstDone(b: MatrixBurst, now: number): boolean {
  return now - b.start >= b.end;
}

const smooth = (x: number) => x * x * (3 - 2 * x);

/** **Purpose:** One cell's state inside a burst at `now`; writes `out`, returns `true` when the cell is affected. */
export function matrixCellAt(b: MatrixBurst, i: number, now: number, charsetLen: number, out: MatrixCellState): boolean {
  const d = b.delay[i]!;
  if (d < 0) return false;
  const u = now - b.start - d;
  if (u < 0) return false;
  if (b.gentle) {
    // Reduce Motion: up 0.5 s, hold 0.2 s, down 0.8 s, peak 0.55, faint glow. No glyph change.
    const g = u < 0.5 ? smooth(u / 0.5) : u < 0.7 ? 1 : u < 1.5 ? 1 - smooth((u - 0.7) / 0.8) : 0;
    out.glyph = -1;
    out.green = 0.55 * g;
    out.glow = 0.25 * g;
    return g > 0;
  }
  if (u < MATRIX_SCRAMBLE) {
    const step = Math.floor(u / SCRAMBLE_STEP);
    out.glyph = Math.floor(hash(b.seed + i * 131 + step * 977) * charsetLen) % charsetLen;
    out.green = 0.35 * (u / MATRIX_SCRAMBLE);
    out.glow = 0;
    return true;
  }
  const v = u - MATRIX_SCRAMBLE;
  out.glyph = -1;
  if (v < MATRIX_FLASH) {
    out.green = 1;
    out.glow = 1;
    return true;
  }
  const w = v - MATRIX_FLASH;
  if (w < MATRIX_FADE) {
    const f = 1 - smooth(w / MATRIX_FADE);
    out.green = f;
    out.glow = f;
    return true;
  }
  return false;
}

/** **Purpose:** Combine every live burst for cell `i` (max green; first scramble glyph wins). */
export function matrixCellAll(bursts: readonly MatrixBurst[], i: number, now: number, charsetLen: number, out: MatrixCellState): boolean {
  let hit = false;
  let glyph = -1;
  let green = 0;
  let glow = 0;
  for (const b of bursts) {
    if (!matrixCellAt(b, i, now, charsetLen, out)) continue;
    hit = true;
    if (glyph < 0 && out.glyph >= 0) glyph = out.glyph;
    green = Math.max(green, out.green);
    glow = Math.max(glow, out.glow);
  }
  out.glyph = glyph;
  out.green = green;
  out.glow = glow;
  return hit;
}

/** **Purpose:** `rgb(...)` mixing the ink toward matrix green by `g`. */
export function matrixMix(ink: [number, number, number], dark: boolean, g: number): string {
  const m = dark ? MATRIX_GREEN_DARK : MATRIX_GREEN_LIGHT;
  const r = Math.round(ink[0] + (m[0] - ink[0]) * g);
  const gg = Math.round(ink[1] + (m[1] - ink[1]) * g);
  const b = Math.round(ink[2] + (m[2] - ink[2]) * g);
  return `rgb(${r},${gg},${b})`;
}

export function matrixGlowColor(dark: boolean, a: number): string {
  const m = dark ? MATRIX_GREEN_DARK : MATRIX_GREEN_LIGHT;
  return `rgba(${m[0]},${m[1]},${m[2]},${a.toFixed(3)})`;
}

/**
 * **Purpose:** Fires `onBurst` once shortly after start, then every 4–9 s (Reduce Motion: every 15 s, gentle).
 * Timers are cleared while the mark is off-screen or the tab is hidden (`setActive(false)`), so nothing runs
 * between bursts and nothing at all when unseen.
 */
export function createMatrixScheduler(onBurst: (gentle: boolean) => void, reduced: () => boolean) {
  let timer = 0;
  let active = false;
  let first = true;
  let disposed = false;
  const arm = () => {
    if (timer || !active || disposed) return;
    const gentle = reduced();
    const wait = first
      ? MATRIX_FIRST_DELAY
      : gentle
        ? MATRIX_GENTLE_PERIOD
        : MATRIX_GAP_MIN + Math.random() * (MATRIX_GAP_MAX - MATRIX_GAP_MIN);
    timer = window.setTimeout(() => {
      timer = 0;
      if (!active || disposed) return;
      first = false;
      onBurst(reduced());
      arm();
    }, wait * 1000);
  };
  return {
    setActive(next: boolean) {
      if (next === active) return;
      active = next;
      if (active) arm();
      else if (timer) {
        window.clearTimeout(timer);
        timer = 0;
      }
    },
    dispose() {
      disposed = true;
      if (timer) window.clearTimeout(timer);
      timer = 0;
    },
  };
}
