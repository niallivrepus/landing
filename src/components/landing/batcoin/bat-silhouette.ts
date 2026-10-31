/**
 * **Purpose:** The goo bat outline, ported verbatim from the iOS app: ONE closed contour per bat (right half traced
 * out, left half mirrored back) so every bat in a frame shares one winding and overlapping bats union cleanly under
 * the goo blur. Unit space: wingspan 1 (tips at x ±0.5), y down; `flap` −1 (down) … 1 (up).
 * **Ported from (jokuh-live, keep in sync):** `Sources/gooey/celebrations/goo-bat-swarm-sim.swift`
 * (`GooBatSilhouette.half` and `.append`, same 13 points, same controls, same mirror order).
 * Pure (no DOM): `batHalf` fills a reused buffer; `traceBat` writes the contour into any path sink (Path2D, canvas).
 */

/** Right-half outline: (anchor x, anchor y, control x, control y) for 13 points, starting at the head top. */
export const BAT_POINTS = 13;

export type BatBuf = Float64Array;

export function newBatBuf(): BatBuf {
  return new Float64Array(BAT_POINTS * 4);
}

/** `GooBatSilhouette.half(flap:into:)`. */
export function batHalf(f: number, buf: BatBuf): void {
  const lift = f;
  const k = 1 - 0.16 * Math.abs(lift);
  const tipY = -0.17 - 0.36 * lift;
  const wristY = -0.22 - 0.2 * lift;
  const p1y = 0.0 - 0.28 * lift;
  const p2y = 0.07 - 0.2 * lift;
  const p3y = 0.11 - 0.1 * lift;
  let i = 0;
  const put = (x: number, y: number, cx: number, cy: number) => {
    buf[i++] = x;
    buf[i++] = y;
    buf[i++] = cx;
    buf[i++] = cy;
  };
  // 0 head top centre (moveTo; control unused)
  put(0, -0.19, 0, -0.19);
  // 1 inner ear base
  put(0.028, -0.2, 0.014, -0.2);
  // 2 ear tip (sharp)
  put(0.075, -0.33, 0.045, -0.27);
  // 3 outer ear base
  put(0.085, -0.17, 0.085, -0.25);
  // 4 cheek → shoulder (round head)
  put(0.06, -0.1, 0.1, -0.12);
  // 5 wrist hump (leading edge)
  put(0.24, wristY, 0.13, wristY + 0.02);
  // 6 wing tip (pointed)
  put(0.5 * k, tipY, 0.38 * k, wristY - 0.02);
  // 7–10 trailing-edge scallops: each anchor reached by a curve bowed up toward the leading edge.
  put(0.4 * k, p1y, 0.42 * k, (tipY + p1y) / 2 - 0.01);
  put(0.27, p2y, 0.35 * k, (p1y + p2y) / 2 - 0.075);
  put(0.15, p3y, 0.215, (p2y + p3y) / 2 - 0.07);
  put(0.055, 0.1, 0.1, (p3y + 0.1) / 2 - 0.06);
  // 11 hip → tail tip
  put(0.03, 0.17, 0.06, 0.15);
  put(0, 0.19, 0.012, 0.19);
}

export type PathSink = {
  moveTo(x: number, y: number): void;
  quadraticCurveTo(cx: number, cy: number, x: number, y: number): void;
  closePath(): void;
};

/** `GooBatSilhouette.append(to:x:y:span:flap:bank:buf:)`: one bat into `path`. */
export function traceBat(path: PathSink, x: number, y: number, span: number, flap: number, bank: number, buf: BatBuf): void {
  batHalf(flap, buf);
  const ca = Math.cos(bank) * span;
  const sa = Math.sin(bank) * span;
  const mx = (px: number, py: number) => x + ca * px - sa * py;
  const my = (px: number, py: number) => y + sa * px + ca * py;
  const n = BAT_POINTS;
  path.moveTo(mx(buf[0]!, buf[1]!), my(buf[0]!, buf[1]!));
  for (let i = 1; i < n; i++) {
    const o = i * 4;
    path.quadraticCurveTo(mx(buf[o + 2]!, buf[o + 3]!), my(buf[o + 2]!, buf[o + 3]!), mx(buf[o]!, buf[o + 1]!), my(buf[o]!, buf[o + 1]!));
  }
  // Left half, traced back from the tail to the head: segment i ran (i−1 → i) with control c_i; reversed it runs
  // (i → i−1) with the same control, mirrored.
  for (let i = n - 1; i >= 1; i--) {
    const o = i * 4;
    const p = (i - 1) * 4;
    path.quadraticCurveTo(mx(-buf[o + 2]!, buf[o + 3]!), my(-buf[o + 2]!, buf[o + 3]!), mx(-buf[p]!, buf[p + 1]!), my(-buf[p]!, buf[p + 1]!));
  }
  path.closePath();
}

/** Flap value for a bat's wing phase (the app draws `sin(phase)`). */
export function flapOf(phase: number): number {
  return Math.sin(phase);
}

/** The app's bank: `clamp(vx / 700, −1, 1) · 0.5` radians. */
export function bankOf(vx: number): number {
  return Math.max(-1, Math.min(1, vx / 700)) * 0.5;
}
