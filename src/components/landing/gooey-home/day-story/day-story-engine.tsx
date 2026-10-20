import type { CSSProperties, ReactNode } from "react";
import { DAY_BEAT_COUNT, DAY_BEATS, DAY_STARTS } from "./day-story-beats";

/**
 * **Purpose:** The day story's tiny timeline engine. Every element of the stage is declared once in JSX with its
 * timing (`<I b a z fx>`: appears `a` s into beat `b`, leaves `z` s into beat `e`, with an entrance effect), typed
 * text (`<T>`) and counters (`<N>`); `parseItems` reads them once on mount and `paintItem` writes each frame as
 * `transform` / `opacity` / `visibility` only, and only when the value changed.
 * **Connects to:** `DayStoryStage.tsx` (the only user).
 */

/* ── Timing helpers ── */

export type Fx = "fade" | "pop" | "up" | "down" | "left" | "right" | "drop" | "snap" | "float" | "wipe";

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
export const backOut = (k: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * (k - 1) ** 3 + c1 * (k - 1) ** 2;
};
export const easeOut = (k: number) => 1 - (1 - k) ** 3;
export const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const beatEnd = (i: number) => (i >= DAY_BEAT_COUNT - 1 ? Number.POSITIVE_INFINITY : DAY_STARTS[i]! + DAY_BEATS[i]!.dur);

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
export function I({ b, e, a, z, fx = "fade", dx, dy, sc, fd, x, y, w, h, className, style, hidden, children }: ItemProps) {
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

/**
 * Text typed in over `d` seconds from `a` into beat `b` (a caret rides the end while there is text). With `z` the
 * field clears at `z` (sent); with `ph` the empty field shows that placeholder, like a real input.
 */
export function T({ b, a, d = 0.9, z, ph, text }: { b: number; a: number; d?: number; z?: number; ph?: string; text: string }) {
  return <span className={`gds-type${ph != null ? " gds-type--field" : ""}`} data-tb={b} data-ta={a} data-td={d} data-tz={z} data-ph={ph} data-text={text} />;
}

/** A number counting from `from` to `to` (or a m:ss clock with `clock`). */
export function N({ b, a, d = 1.2, from, to, clock }: { b: number; a: number; d?: number; from: number; to: number; clock?: boolean }) {
  return <span className="gds-count" data-cb={b} data-ca={a} data-cd={d} data-from={from} data-to={to} data-clock={clock ? 1 : undefined} />;
}

/* ── Parsed timeline items ── */

export type Item = {
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
type Typer = { el: HTMLElement; s: number; d: number; z: number; text: string; n: number };
type Counter = { el: HTMLElement; s: number; d: number; from: number; to: number; clock: boolean; last: string };

const num = (v: string | undefined, fallback: number) => (v == null || v === "" ? fallback : Number(v));

/** Characters of a typed field showing at `t` (0 before it starts and after it is sent). */
export function typedCount(ty: Typer, t: number): number {
  if (t < ty.s || t >= ty.z) return 0;
  return Math.min(ty.text.length, Math.ceil(((t - ty.s) / ty.d) * ty.text.length));
}

export function parseItems(root: HTMLElement): { items: Item[]; typers: Typer[]; counters: Counter[] } {
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
      vis: false,
    });
  });
  const typers: Typer[] = [];
  root.querySelectorAll<HTMLElement>("[data-text]").forEach((el) => {
    const d = el.dataset;
    const beat = num(d.tb, 0);
    const z = d.tz != null && d.tz !== "" ? DAY_STARTS[beat]! + Number(d.tz) : Number.POSITIVE_INFINITY;
    typers.push({ el, s: DAY_STARTS[beat]! + num(d.ta, 0), d: num(d.td, 0.9), z, text: d.text ?? "", n: -1 });
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

export function paintItem(it: Item, t: number) {
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

export const FACE = (name: string) => `/day-story/${name}.webp`;

export function Face({ name, size, ring }: { name: string; size: number; ring?: boolean }) {
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

export function Icon({ d, size = 16, stroke = 2 }: { d: string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export const IC = {
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
  calendar: "M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  chevDown: "M6 9l6 6 6-6",
  chevLeft: "M15 5l-7 7 7 7",
  moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z",
  share: "M14 5l6 6-6 6M20 11H9a5 5 0 0 0-5 5v3",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z",
  close: "M6 6l12 12M18 6L6 18",
  radio: "M12 12h.01M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7M5.6 18.4a9 9 0 0 1 0-12.8M18.4 5.6a9 9 0 0 1 0 12.8",
  video: "M3 7h12v10H3zM15 10l6-3v10l-6-3",
  mic: "M12 15a3.5 3.5 0 0 0 3.5-3.5v-5a3.5 3.5 0 0 0-7 0v5A3.5 3.5 0 0 0 12 15zM6 11.5a6 6 0 0 0 12 0M12 17.5V21",
  speaker: "M4 9h4l5-4v14l-5-4H4zM17 9a4 4 0 0 1 0 6",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0",
  chat: "M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.3-4.4A7.5 7.5 0 1 1 20 11.5z",
};

