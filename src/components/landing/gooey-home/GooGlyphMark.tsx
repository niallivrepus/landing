import { useEffect, useId, useMemo, useRef } from "react";
import { GooFilter } from "./GooFilter";
import {
  buildGlyphLogoCells,
  GLYPH_LOGO_CHARSET,
  GLYPH_LOGO_COLUMNS,
  GLYPH_LOGO_ROWS,
  GOO_ENV_PARAMS,
  glyphLogoIndex,
  inkOn,
  prefersReducedMotion,
  rippleAt,
  rippleFrontPassing,
  roleColor,
  splexSpec,
  type GooScheme,
} from "./goo-kit";
import { useGooLoop } from "./use-goo-loop";
import {
  createMatrixScheduler,
  makeMatrixBurst,
  matrixBurstDone,
  matrixCellAll,
  matrixGlowColor,
  matrixMix,
  type MatrixBurst,
  type MatrixCellState,
} from "./glyph-matrix-burst";

/** Stage + mask box: the lab card's numbers (`GooGlyph`: W 320, H 210, mask 300 wide). */
const W = 320;
const H = 160;
const LW = 300;
const LH = (LW * 77) / 172;
const OX = (W - LW) / 2;
const OY = (H - LH) / 2;
const CW = LW / GLYPH_LOGO_COLUMNS;
const CH = LH / GLYPH_LOGO_ROWS;
const LIFETIME = 2.6;
/** Reused matrix cell state (no per-cell allocation). */
const mx: MatrixCellState = { glyph: -1, green: 0, glow: 0 };

type Ripple = { x: number; y: number; t: number; amp: number; id: number };

let fontRequested = false;
/** The Glyph mark's `skeleton` mono face, fetched after first paint (never render-blocking). */
function requestSkeletonFont(onReady: () => void) {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  const done = () => document.fonts.check("700 12px skeleton") && onReady();
  if (fontRequested) {
    void document.fonts.ready.then(done);
    return;
  }
  fontRequested = true;
  const face = new FontFace("skeleton", "url(/fonts/skeleton/skeleton-bold.woff2) format('woff2')", { weight: "700", display: "swap" });
  face
    .load()
    .then((f) => {
      document.fonts.add(f);
      onReady();
    })
    .catch(() => {});
}

/**
 * **Purpose:** The Home logo with Gooey on: the Jokuh mask as a pool of liquid glyphs — one Splex goo bead per glyph
 * cell, merged by the goo filter, with the house mono glyphs on top. Touch or drag and a ripple runs out from the
 * pointer, pushing cells outward and re-rolling every glyph its front passes. Idle is still; one gentle ripple on
 * appear. Reduce Motion: no displacement, a touch just re-rolls once.
 * **Matrix shimmer** (Sean 2026-10-19, the one sanctioned addition): every 4–9 s a patch / band of cells decodes and
 * flashes matrix green (`glyph-matrix-burst.ts`); tap or hover bursts from the pointer. Reduce Motion: a gentle
 * green fade every 15 s. Timers stop off-screen / hidden tab; the frame loop only runs while a burst or ripple lives.
 * **Frozen:** same cells, hash, alphabet and ripple numbers as the app; do not restyle.
 * **Parity (jokuh-live):** `Sources/gooey/goo-home-glyph-mark.swift` (`GooHomeGlyphMark`, the real Home logo),
 * web lab `frontend/src/components/gooey-labs/goo-lab-home-demos-home.tsx` (`GooGlyph`).
 */
export function GooGlyphMark({ scheme, className }: { scheme: GooScheme; className?: string }) {
  const uid = useId().replace(/[:]/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circlesRef = useRef<(SVGCircleElement | null)[]>([]);
  const cells = useMemo(() => buildGlyphLogoCells(), []);
  const base = useMemo(
    () => cells.map((c) => ({ x: OX + (c.col + 0.5) * CW, y: OY + (c.row + 0.5) * CH, r: 5.2 + 2.6 * c.depth })),
    [cells],
  );
  const state = useRef({
    ripples: [] as Ripple[],
    serial: 0,
    extra: new Float64Array(cells.length),
    lastHit: new Int32Array(cells.length).fill(-1),
    pos: base.map((b) => ({ x: b.x, y: b.y, s: 0 })),
    lastDrag: 0,
    bursts: [] as MatrixBurst[],
    lastHover: 0,
    font: "ui-monospace, SFMono-Regular, Menlo, monospace",
  });
  const schemeRef = useRef(scheme);
  schemeRef.current = scheme;

  const paint = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const pw = Math.max(1, Math.round(rect.width * dpr));
    const ph = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    const k = pw / W;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const st = state.current;
    ctx.font = `700 ${Math.round(CH * 0.95)}px ${st.font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const dark = schemeRef.current === "dark";
    ctx.fillStyle = inkOn(schemeRef.current, "base");
    const now = performance.now() / 1000;
    const live = st.bursts.length > 0;
    const hot: number[] = [];
    for (let i = 0; i < cells.length; i += 1) {
      if (live && matrixCellAll(st.bursts, i, now, GLYPH_LOGO_CHARSET.length, mx)) {
        hot.push(i);
        continue;
      }
      const c = cells[i]!;
      const p = st.pos[i]!;
      ctx.globalAlpha = Math.min(1, 0.4 + 0.5 * c.depth + p.s / 6);
      ctx.fillText(GLYPH_LOGO_CHARSET[glyphLogoIndex(c, st.extra[i]!)] ?? "*", p.x, p.y + 0.5);
    }
    // Matrix burst cells on top: scramble glyph or own glyph, tinted toward green with a soft glow.
    const ink: [number, number, number] = dark ? [255, 255, 255] : [0, 0, 0];
    for (const i of hot) {
      matrixCellAll(st.bursts, i, now, GLYPH_LOGO_CHARSET.length, mx);
      const c = cells[i]!;
      const p = st.pos[i]!;
      const baseA = Math.min(1, 0.4 + 0.5 * c.depth + p.s / 6);
      const lift = Math.max(mx.green, mx.glyph >= 0 ? 0.6 : 0);
      ctx.globalAlpha = baseA + (1 - baseA) * lift;
      ctx.fillStyle = matrixMix(ink, dark, mx.green);
      ctx.shadowColor = matrixGlowColor(dark, (dark ? 0.9 : 0.55) * mx.glow);
      ctx.shadowBlur = mx.glow > 0 ? 7 * mx.glow * k : 0;
      const g = mx.glyph >= 0 ? mx.glyph : glyphLogoIndex(c, st.extra[i]!);
      ctx.fillText(GLYPH_LOGO_CHARSET[g] ?? "*", p.x, p.y + 0.5);
    }
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = 1;
  };

  const step = (dt: number) => {
    const st = state.current;
    const still = prefersReducedMotion();
    if (st.bursts.length) {
      const now = performance.now() / 1000;
      st.bursts = st.bursts.filter((b) => !matrixBurstDone(b, now));
    }
    for (const r of st.ripples) r.t += dt;
    while (st.ripples.length && st.ripples[0]!.t > LIFETIME) st.ripples.shift();
    for (let i = 0; i < base.length; i += 1) {
      const b = base[i]!;
      let dx = 0;
      let dy = 0;
      let s = 0;
      for (const r of st.ripples) {
        const ddx = b.x - r.x;
        const ddy = b.y - r.y;
        const d = Math.hypot(ddx, ddy) || 1;
        const disp = still ? 0 : rippleAt(d, r.t, 7 * r.amp);
        dx += (ddx / d) * disp;
        dy += (ddy / d) * disp;
        s += Math.abs(disp);
        if (st.lastHit[i] !== r.id && rippleFrontPassing(d, r.t)) {
          st.lastHit[i] = r.id;
          st.extra[i] += 1.37 + Math.random();
        }
      }
      const p = st.pos[i]!;
      p.x = b.x + dx;
      p.y = b.y + dy;
      p.s = s;
      const el = circlesRef.current[i];
      if (el) {
        el.setAttribute("cx", p.x.toFixed(2));
        el.setAttribute("cy", p.y.toFixed(2));
        el.setAttribute("r", (b.r * (1 + Math.min(0.8, s / 9))).toFixed(2));
      }
    }
    paint();
    return st.ripples.length > 0 || st.bursts.length > 0;
  };

  const loop = useGooLoop(wrapRef, (dt) => step(dt));

  const poke = (x: number, y: number, amp: number) => {
    const st = state.current;
    st.serial += 1;
    st.ripples.push({ x, y, t: 0, amp, id: st.serial });
    if (st.ripples.length > 7) st.ripples.shift();
    loop.wake();
  };

  /** Matrix burst: random patch / band, or a ripple from `at` (stage units). */
  const burst = (gentle: boolean, at?: { x: number; y: number }) => {
    const st = state.current;
    const origin = at ? { col: (at.x - OX) / CW - 0.5, row: (at.y - OY) / CH - 0.5 } : undefined;
    st.bursts.push(makeMatrixBurst(cells, performance.now() / 1000, { origin, gentle }));
    if (st.bursts.length > 3) st.bursts.shift();
    loop.wake();
  };
  const burstRef = useRef(burst);
  burstRef.current = burst;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const sched = createMatrixScheduler((gentle) => burstRef.current(gentle), prefersReducedMotion);
    let onScreen = true;
    const sync = () => sched.setActive(onScreen && document.visibilityState === "visible");
    const io = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      sched.dispose();
    };
  }, []);

  useEffect(() => {
    paint();
    requestSkeletonFont(() => {
      state.current.font = "skeleton, ui-monospace, monospace";
      paint();
    });
    // One gentle ripple from the centre on appear (app: `GooHomeGlyphMarkModel`).
    const id = window.setTimeout(() => poke(W / 2, H / 2, 0.7), 450);
    const ro = new ResizeObserver(() => paint());
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => {
      window.clearTimeout(id);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheme]);

  const toLocal = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const fill = roleColor(scheme, "base");
  return (
    <div ref={wrapRef} className={`gh-glyph ${className ?? ""}`}>
      <svg className="gh-glyph__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
        <defs>
          <GooFilter id={`gh-glyph-${uid}`} x={-30} y={-30} width={W + 60} height={H + 60} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
        </defs>
        <g filter={`url(#gh-glyph-${uid})`}>
          {base.map((b, i) => (
            <circle
              key={i}
              ref={(el) => {
                circlesRef.current[i] = el;
              }}
              cx={b.x}
              cy={b.y}
              r={b.r}
              fill={fill}
            />
          ))}
        </g>
      </svg>
      <canvas ref={canvasRef} className="gh-glyph__canvas" aria-hidden />
      <div
        className="gh-glyph__hit"
        role="img"
        aria-label="Jokuh"
        onPointerDown={(e) => {
          const p = toLocal(e);
          state.current.lastDrag = performance.now();
          poke(p.x, p.y, 1.2);
          burst(prefersReducedMotion(), p);
        }}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          const now = performance.now();
          if (now - state.current.lastHover < 2000) return;
          state.current.lastHover = now;
          burst(prefersReducedMotion(), toLocal(e));
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse" && e.buttons === 0) return;
          const now = performance.now();
          if (now - state.current.lastDrag > 90) {
            state.current.lastDrag = now;
            const p = toLocal(e);
            poke(p.x, p.y, 0.8);
          }
        }}
      />
    </div>
  );
}
