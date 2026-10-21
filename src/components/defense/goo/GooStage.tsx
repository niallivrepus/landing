import { cn } from "@jokuh/gooey";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { GooMaterialFilter } from "./GooMaterialFilter";
import { gooParams, splexSpec, viscositySpring, type GooScheme, type SpringParams } from "./goo-material";
import { GooGL, resolveRgb, type GlFrame } from "./goo-gl";

/**
 * **Purpose:** A living goo stage: beads of Splex glass you can poke, reach for, drag and fling. Each bead is a 2-D
 * spring toward its home; the pointer nearby makes beads lean in (reach); grabbing one pulls it out, its links
 * stretch and thin, and past a limit they snap (drip) — let go and it springs home with a wobble while the links
 * merge back. Optional zone membranes (goo skins in a zone's colour) follow their member beads, so dragging a part
 * out of "sealed end to end" visibly stretches that boundary. Idle is still: the frame loop stops once every spring
 * rests. Labels are crisp HTML buttons (keyboard: Enter picks, arrows nudge). Reduced motion: static, click only.
 * **Connects to:** `goo-material.ts` (Splex + springs), `GooMaterialFilter.tsx`, `DefenseHero`, `DefenseSystemMap`.
 */

export type GooBead = {
  id: string;
  x: number;
  y: number;
  r: number;
  color: string;
  label?: string;
  sub?: string;
  /** Drawn as a dashed ghost outside the goo (roadmap): not draggable, never merges. */
  ghost?: boolean;
};

export type GooLink = { a: string; b: string; w: number };
export type GooZone = { id: string; members: string[]; color: string; pad: number };

type Sim = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  vs: number;
};

const SPRING: SpringParams = viscositySpring(35);
const DRAG_SPRING: SpringParams = { stiffness: 900, damping: 48, mass: 1 };
const SCALE_SPRING: SpringParams = viscositySpring(20);
const MAX_DT = 0.05;
/** Membrane bridge circles between consecutive zone members, so a zone reads as one skin. */
const BRIDGE = 4;
/** The GPU canvas bleeds past the stage on every side (fraction of the stage), so glows and drops are never clipped. */
const BLEED = 0.18;

function step(x: number, v: number, target: number, p: SpringParams, dt: number): [number, number] {
  let left = Math.min(dt, MAX_DT);
  while (left > 1e-6) {
    const h = Math.min(1 / 120, left);
    const a = (-p.stiffness * (x - target) - p.damping * v) / p.mass;
    v += a * h;
    x += v * h;
    left -= h;
  }
  return [x, v];
}

export function GooStage({
  width,
  height,
  beads,
  links = [],
  zones = [],
  picked = null,
  onPick,
  scheme,
  reduceMotion,
  spread = 0,
  converge = 0,
  goo = 55,
  edge = 50,
  labels = "inside",
  glow = 0,
  reach = 0.16,
  className,
  ariaLabel,
  hint,
  children,
}: {
  width: number;
  height: number;
  beads: GooBead[];
  links?: GooLink[];
  zones?: GooZone[];
  picked?: string | null;
  onPick?: (id: string) => void;
  scheme: GooScheme;
  reduceMotion: boolean;
  /** 0…1: beads fly out from the centre (scroll split). */
  spread?: number;
  /** 0…1: beads gather into the centre and merge into one (scroll merge). */
  converge?: number;
  goo?: number;
  edge?: number;
  labels?: "inside" | "below";
  /** 0…1: light under the glass — each bead's energy as a soft glow that moves with it (the Splex needs light behind it). */
  glow?: number;
  /** How far beads lean toward the pointer (0 = not at all). */
  reach?: number;
  className?: string;
  ariaLabel: string;
  hint?: ReactNode;
  children?: ReactNode;
}) {
  const uid = useId().replace(/:/g, "");
  const filterId = `goo-${uid}`;
  const zoneFilterId = `goo-zone-${uid}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef(new Map<string, SVGCircleElement>());
  const zoneRefs = useRef(new Map<string, SVGCircleElement>());
  const glowRefs = useRef(new Map<string, SVGCircleElement>());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const glRef = useRef<GooGL | null>(null);
  const [useGl, setUseGl] = useState(false);
  const rgb = useRef(new Map<string, [number, number, number]>());
  const linkRefs = useRef(new Map<string, SVGLineElement>());
  const labelRefs = useRef(new Map<string, HTMLElement>());
  const sims = useRef(new Map<string, Sim>());
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const drag = useRef<{ id: string; x: number; y: number; moved: boolean; pointerId: number } | null>(null);
  const raf = useRef(0);
  const last = useRef(0);
  const props = useRef({ beads, links, zones, picked, spread, converge, reach, scheme, goo, glow });
  props.current = { beads, links, zones, picked, spread, converge, reach, scheme, goo, glow };

  const params = useMemo(() => gooParams(goo, edge), [goo, edge]);
  const glowScale = 1.5;
  const glowId = `goo-glow-${uid}`;
  const spec = useMemo(() => splexSpec(scheme), [scheme]);
  const zoneParams = useMemo(() => gooParams(85, 60), []);

  const cx = width / 2;
  const cy = height / 2;
  const homeOf = useCallback(
    (b: GooBead) => {
      const k = (1 + props.current.spread * 0.9) * (1 - props.current.converge);
      return { x: cx + (b.x - cx) * k, y: cy + (b.y - cy) * k };
    },
    [cx, cy],
  );

  // Seed sims for new beads (keep existing ones so re-renders never snap).
  for (const b of beads) {
    if (!sims.current.has(b.id)) {
      const h = homeOf(b);
      sims.current.set(b.id, { x: h.x, y: h.y, vx: 0, vy: 0, s: 1, vs: 0 });
    }
  }

  const linkWidth = useCallback(
    (lk: GooLink, a: Sim, b: Sim) => {
      const bs = props.current.beads;
      const ba = bs.find((x) => x.id === lk.a);
      const bb = bs.find((x) => x.id === lk.b);
      if (!ba || !bb) return 0;
      const ha = homeOf(ba);
      const hb = homeOf(bb);
      const rest = Math.hypot(ha.x - hb.x, ha.y - hb.y);
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      // Stretch thins the neck; past 1.6× its rest length it has snapped (drip).
      const stretch = Math.max(0, d - rest) / Math.max(1, rest * 0.6);
      return lk.w * Math.max(0, 1 - stretch) * (0.75 + 0.25 * Math.min(a.s, b.s));
    },
    [homeOf],
  );

  const paint = useCallback(() => {
    const { beads: bs, links: ls, zones: zs } = props.current;
    const gl = glRef.current;
    const canvas = canvasRef.current;
    if (gl && canvas) {
      const solidIds = bs.filter((b) => !b.ghost).map((b) => b.id);
      const index = new Map(solidIds.map((id, i) => [id, i]));
      const frame: GlFrame = {
        scale: canvas.width / (width * (1 + 2 * BLEED)),
        ox: width * BLEED,
        oy: height * BLEED,
        light: props.current.scheme === "light",
        goo: gooParams(props.current.goo, 50).blur * 3,
        glow: props.current.glow,
        beads: solidIds.map((id) => {
          const b = bs.find((x) => x.id === id)!;
          const s = sims.current.get(id)!;
          return { x: s.x, y: s.y, r: Math.max(0, b.r * s.s), rgb: rgb.current.get(id) ?? [0.5, 0.5, 0.5] };
        }),
        links: ls.flatMap((lk) => {
          const a = sims.current.get(lk.a);
          const b = sims.current.get(lk.b);
          const ia = index.get(lk.a);
          const ib = index.get(lk.b);
          if (!a || !b || ia == null || ib == null) return [];
          return [{ ax: a.x, ay: a.y, bx: b.x, by: b.y, w: linkWidth(lk, a, b), a: ia, b: ib }];
        }),
        zones: zs.map((z) => ({
          members: z.members.map((m) => index.get(m) ?? -1).filter((i) => i >= 0),
          pad: z.pad,
          rgb: rgb.current.get(`zone:${z.id}`) ?? [0.5, 0.5, 0.5],
        })),
      };
      gl.draw(frame);
    }
    for (const b of bs) {
      const s = sims.current.get(b.id);
      if (!s) continue;
      const g = glowRefs.current.get(b.id);
      if (g) {
        g.setAttribute("cx", s.x.toFixed(2));
        g.setAttribute("cy", s.y.toFixed(2));
        g.setAttribute("r", Math.max(0, b.r * s.s * glowScale).toFixed(2));
      }
      const c = circleRefs.current.get(b.id);
      if (c) {
        c.setAttribute("cx", s.x.toFixed(2));
        c.setAttribute("cy", s.y.toFixed(2));
        c.setAttribute("r", Math.max(0, b.r * s.s).toFixed(2));
      }
      const l = labelRefs.current.get(b.id);
      if (l) {
        l.style.left = `${(s.x / width) * 100}%`;
        l.style.top = `${(s.y / height) * 100}%`;
        l.style.setProperty("--bead-d", `${((b.r * 2 * s.s) / width) * 100}cqi`);
      }
    }
    for (const z of zs) {
      for (let i = 0; i + 1 < z.members.length; i += 1) {
        const a = sims.current.get(z.members[i]!);
        const b = sims.current.get(z.members[i + 1]!);
        const ba = bs.find((x) => x.id === z.members[i]);
        const bb = bs.find((x) => x.id === z.members[i + 1]);
        if (!a || !b || !ba || !bb) continue;
        for (let k = 1; k <= BRIDGE; k += 1) {
          const c = zoneRefs.current.get(`${z.id}:b${i}:${k}`);
          if (!c) continue;
          const t = k / (BRIDGE + 1);
          c.setAttribute("cx", (a.x + (b.x - a.x) * t).toFixed(2));
          c.setAttribute("cy", (a.y + (b.y - a.y) * t).toFixed(2));
          c.setAttribute("r", (Math.min(ba.r, bb.r) * z.pad * 0.72).toFixed(2));
        }
      }
      for (const m of z.members) {
        const s = sims.current.get(m);
        const c = zoneRefs.current.get(`${z.id}:${m}`);
        const b = bs.find((x) => x.id === m);
        if (s && c && b) {
          c.setAttribute("cx", s.x.toFixed(2));
          c.setAttribute("cy", s.y.toFixed(2));
          c.setAttribute("r", (b.r * z.pad * Math.max(1, s.s)).toFixed(2));
        }
      }
    }
    for (const lk of ls) {
      const a = sims.current.get(lk.a);
      const b = sims.current.get(lk.b);
      const el = linkRefs.current.get(`${lk.a}-${lk.b}`);
      const ba = bs.find((x) => x.id === lk.a);
      const bb = bs.find((x) => x.id === lk.b);
      if (!a || !b || !el || !ba || !bb) continue;
      const w = linkWidth(lk, a, b);
      el.setAttribute("x1", a.x.toFixed(2));
      el.setAttribute("y1", a.y.toFixed(2));
      el.setAttribute("x2", b.x.toFixed(2));
      el.setAttribute("y2", b.y.toFixed(2));
      el.setAttribute("stroke-width", w.toFixed(2));
    }
  }, [height, homeOf, width, glowScale, linkWidth]);

  const tick = useCallback(
    (now: number) => {
      const dt = last.current ? (now - last.current) / 1000 : 1 / 60;
      last.current = now;
      const { beads: bs, picked: pk, reach: rc } = props.current;
      let moving = false;
      const p = pointer.current;
      for (const b of bs) {
        const s = sims.current.get(b.id);
        if (!s) continue;
        const home = homeOf(b);
        let tx = home.x;
        let ty = home.y;
        let ts = b.id === pk ? 1.14 : 1;
        let sp = SPRING;
        const d = drag.current;
        if (d && d.id === b.id) {
          tx = d.x;
          ty = d.y;
          ts *= 1.08;
          sp = DRAG_SPRING;
        } else if (p && !b.ghost && rc > 0) {
          // Reach: lean toward the pointer, strongest near the bead, nothing past ~3 radii.
          const dx = p.x - home.x;
          const dy = p.y - home.y;
          const dist = Math.hypot(dx, dy);
          const range = b.r * 3.2;
          if (dist < range) {
            const f = (1 - dist / range) ** 2;
            tx += dx * rc * f * 1.6;
            ty += dy * rc * f * 1.6;
            ts *= 1 + 0.1 * f;
          }
        }
        [s.x, s.vx] = step(s.x, s.vx, tx, sp, dt);
        [s.y, s.vy] = step(s.y, s.vy, ty, sp, dt);
        [s.s, s.vs] = step(s.s, s.vs, ts, SCALE_SPRING, dt);
        if (
          Math.abs(s.x - tx) > 0.05 ||
          Math.abs(s.y - ty) > 0.05 ||
          Math.abs(s.vx) > 0.5 ||
          Math.abs(s.vy) > 0.5 ||
          Math.abs(s.s - ts) > 0.002 ||
          Math.abs(s.vs) > 0.02
        )
          moving = true;
      }
      paint();
      if (moving || drag.current) raf.current = requestAnimationFrame(tick);
      else {
        raf.current = 0;
        last.current = 0;
      }
    },
    [homeOf, paint],
  );

  const wake = useCallback(() => {
    if (reduceMotion) {
      // Snap to targets, no motion.
      for (const b of props.current.beads) {
        const s = sims.current.get(b.id);
        if (!s) continue;
        const h = homeOf(b);
        Object.assign(s, { x: h.x, y: h.y, vx: 0, vy: 0, s: b.id === props.current.picked ? 1.14 : 1, vs: 0 });
      }
      paint();
      return;
    }
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  }, [homeOf, paint, reduceMotion, tick]);

  // GPU renderer (falls back to the SVG filters when WebGL2 is unavailable).
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const gl = GooGL.create(canvas);
    glRef.current = gl;
    setUseGl(Boolean(gl));
    return () => {
      glRef.current = null;
    };
  }, []);

  // Resolve library colours (CSS vars) to RGB for the shader; again when the theme changes.
  useLayoutEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;
    for (const b of beads) rgb.current.set(b.id, resolveRgb(probe, b.color));
    for (const z of zones) rgb.current.set(`zone:${z.id}`, resolveRgb(probe, z.color));
    paint();
  }, [beads, zones, scheme, paint]);

  // Canvas backing size follows the stage (device pixels, capped at 2×).
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || !useGl) return undefined;
    const fit = () => {
      // CPU rasterisers get a lighter canvas (upscaled by CSS); real GPUs render at up to 2× device pixels.
      const dpr = glRef.current?.software ? 0.6 : Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(wrap.clientWidth * (1 + 2 * BLEED) * dpr));
      const h = Math.max(1, Math.round(wrap.clientHeight * (1 + 2 * BLEED) * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      paint();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [paint, useGl]);

  useEffect(() => {
    wake();
  }, [wake, picked, spread, converge, beads]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      last.current = 0;
    },
    [],
  );

  const toStage = (e: { clientX: number; clientY: number }) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: ((e.clientX - rect.left) / rect.width) * width, y: ((e.clientY - rect.top) / rect.height) * height };
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    // No GPU (software WebGL or the SVG fallback): skip the idle reach so a CPU only renders while someone drags.
    if (!drag.current && (!glRef.current || glRef.current.software)) return;
    const p = toStage(e);
    if (!p) return;
    pointer.current = p;
    const d = drag.current;
    if (d && d.pointerId === e.pointerId) {
      const moved = Math.hypot(p.x - d.x, p.y - d.y) > 0.5;
      drag.current = { ...d, x: p.x, y: p.y, moved: d.moved || moved };
    }
    wake();
  };

  const onLeave = () => {
    pointer.current = null;
    wake();
  };

  const onBeadDown = (e: PointerEvent<HTMLButtonElement>, b: GooBead) => {
    if (reduceMotion || b.ghost || e.button !== 0) return;
    const p = toStage(e);
    if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: b.id, x: p.x, y: p.y, moved: false, pointerId: e.pointerId };
    wake();
  };

  const onBeadUp = (b: GooBead) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== b.id) return;
    const s = sims.current.get(b.id);
    const home = homeOf(b);
    const pulled = s ? Math.hypot(s.x - home.x, s.y - home.y) : 0;
    if (s) s.vs -= 2.2; // wobble on release
    if (pulled < b.r * 0.35) onPick?.(b.id);
    wake();
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, b: GooBead) => {
    const s = sims.current.get(b.id);
    if (!s || reduceMotion) return;
    const kick = 260;
    const map: Record<string, [number, number]> = {
      ArrowLeft: [-kick, 0],
      ArrowRight: [kick, 0],
      ArrowUp: [0, -kick],
      ArrowDown: [0, kick],
    };
    const k = map[e.key];
    if (!k) return;
    e.preventDefault();
    s.vx += k[0];
    s.vy += k[1];
    s.vs += 1.4;
    wake();
  };

  const solid = beads.filter((b) => !b.ghost);
  const ghosts = beads.filter((b) => b.ghost);
  const margin = 80;

  return (
    <div
      ref={wrapRef}
      className={cn("goo-stage", className)}
      style={{ aspectRatio: `${width} / ${height}`, "--converge": converge, "--spread": spread } as CSSProperties}
      data-labels={labels}
      data-motion={reduceMotion ? "off" : "on"}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      role="group"
      aria-label={ariaLabel}
    >
      <canvas
        ref={canvasRef}
        className="goo-stage__canvas"
        aria-hidden
        data-on={useGl ? "true" : "false"}
        style={{ inset: `${-BLEED * 100}% ${-BLEED * 100}%`, width: `${(1 + 2 * BLEED) * 100}%`, height: `${(1 + 2 * BLEED) * 100}%` }}
      />
      <span ref={probeRef} aria-hidden className="goo-stage__probe" />
      <svg className="goo-stage__svg" viewBox={`0 0 ${width} ${height}`} aria-hidden focusable="false">
        <defs>
          <GooMaterialFilter id={filterId} spec={spec} params={params} region={{ x: -margin, y: -margin, width: width + margin * 2, height: height + margin * 2 }} />
          <filter id={zoneFilterId} x={-margin} y={-margin} width={width + margin * 2} height={height + margin * 2} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation={zoneParams.blur * 2.2} result="sb" />
            <feColorMatrix in="sb" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${zoneParams.k} ${-zoneParams.t}`} result="goo" />
            <feGaussianBlur in="SourceGraphic" stdDeviation={zoneParams.blur * 2.2} result="cb" />
            <feColorMatrix in="cb" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1" result="cc" />
            <feComposite in="cc" in2="goo" operator="in" result="tint" />
            <feColorMatrix in="tint" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.09 0" result="fill" />
            <feMorphology in="goo" operator="erode" radius={1.4} result="inner" />
            <feComposite in="goo" in2="inner" operator="out" result="rimm" />
            <feComposite in="tint" in2="rimm" operator="in" result="rimc" />
            <feColorMatrix in="rimc" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.55 0" result="rim" />
            <feMerge>
              <feMergeNode in="fill" />
              <feMergeNode in="rim" />
            </feMerge>
          </filter>
          <filter id={glowId} x={-margin * 2} y={-margin * 2} width={width + margin * 4} height={height + margin * 4} filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation={Math.round(width * 0.035)} />
          </filter>
        </defs>

        {!useGl && glow > 0 ? (
          <g filter={`url(#${glowId})`} opacity={glow} className="goo-stage__glow">
            {solid.map((b) => (
              <circle
                key={b.id}
                ref={(el) => {
                  if (el) glowRefs.current.set(b.id, el);
                  else glowRefs.current.delete(b.id);
                }}
                cx={b.x}
                cy={b.y}
                r={b.r * glowScale}
                style={{ fill: b.color }}
              />
            ))}
          </g>
        ) : null}

        {(useGl ? [] : zones).map((z) => (
          <g key={z.id} filter={`url(#${zoneFilterId})`} className="goo-stage__zone" data-zone={z.id}>
            {z.members.slice(0, -1).flatMap((m, i) => {
              const a = beads.find((x) => x.id === m);
              const b = beads.find((x) => x.id === z.members[i + 1]);
              if (!a || !b) return [];
              return Array.from({ length: BRIDGE }, (_, j) => {
                const t = (j + 1) / (BRIDGE + 1);
                return (
                  <circle
                    key={`b${i}:${j + 1}`}
                    ref={(el) => {
                      if (el) zoneRefs.current.set(`${z.id}:b${i}:${j + 1}`, el);
                      else zoneRefs.current.delete(`${z.id}:b${i}:${j + 1}`);
                    }}
                    cx={a.x + (b.x - a.x) * t}
                    cy={a.y + (b.y - a.y) * t}
                    r={Math.min(a.r, b.r) * z.pad * 0.72}
                    style={{ fill: z.color }}
                  />
                );
              });
            })}
            {z.members.map((m) => {
              const b = beads.find((x) => x.id === m);
              if (!b) return null;
              const s = sims.current.get(m);
              return (
                <circle
                  key={m}
                  ref={(el) => {
                    if (el) zoneRefs.current.set(`${z.id}:${m}`, el);
                    else zoneRefs.current.delete(`${z.id}:${m}`);
                  }}
                  cx={s?.x ?? b.x}
                  cy={s?.y ?? b.y}
                  r={b.r * z.pad}
                  style={{ fill: z.color }}
                />
              );
            })}
          </g>
        ))}

        {ghosts.map((b) => (
          <circle
            key={b.id}
            ref={(el) => {
              if (el) circleRefs.current.set(b.id, el);
              else circleRefs.current.delete(b.id);
            }}
            cx={b.x}
            cy={b.y}
            r={b.r}
            className="goo-stage__ghost"
          />
        ))}

        {useGl ? null : (
        <g filter={`url(#${filterId})`}>
          {links.map((lk) => {
            const a = beads.find((x) => x.id === lk.a);
            const b = beads.find((x) => x.id === lk.b);
            if (!a || !b) return null;
            return (
              <line
                key={`${lk.a}-${lk.b}`}
                ref={(el) => {
                  if (el) linkRefs.current.set(`${lk.a}-${lk.b}`, el);
                  else linkRefs.current.delete(`${lk.a}-${lk.b}`);
                }}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={lk.w}
                strokeLinecap="round"
                style={{ stroke: lk.a === picked || lk.b === picked ? (lk.a === picked ? b.color : a.color) : a.color }}
              />
            );
          })}
          {solid.map((b) => {
            const s = sims.current.get(b.id);
            return (
              <circle
                key={b.id}
                ref={(el) => {
                  if (el) circleRefs.current.set(b.id, el);
                  else circleRefs.current.delete(b.id);
                }}
                cx={s?.x ?? b.x}
                cy={s?.y ?? b.y}
                r={b.r}
                style={{ fill: b.color }}
              />
            );
          })}
        </g>
        )}
      </svg>

      {beads.map((b) => (
        <button
          key={b.id}
          type="button"
          ref={(el) => {
            if (el) labelRefs.current.set(b.id, el);
            else labelRefs.current.delete(b.id);
          }}
          className={cn("goo-stage__bead", b.id === picked && "is-picked", b.ghost && "is-ghost")}
          style={{ left: `${(b.x / width) * 100}%`, top: `${(b.y / height) * 100}%`, "--bead-d": `${((b.r * 2) / width) * 100}cqi`, "--energy": b.color } as CSSProperties}
          aria-pressed={onPick && b.label && labels === "below" ? b.id === picked : undefined}
          aria-hidden={b.label ? undefined : true}
          tabIndex={b.label ? undefined : -1}
          onPointerDown={(e) => onBeadDown(e, b)}
          onPointerUp={() => onBeadUp(b)}
          onPointerCancel={() => {
            drag.current = null;
            wake();
          }}
          onClick={(e) => {
            // Keyboard / assistive activation (pointer clicks are handled on pointer up).
            if (e.detail === 0) onPick?.(b.id);
          }}
          onKeyDown={(e) => onKey(e, b)}
          onFocus={() => {
            if (!drag.current && onPick && labels === "below") onPick(b.id);
          }}
        >
          {b.label ? <span className="goo-stage__label">{b.label}</span> : null}
          {b.sub ? <span className="goo-stage__sub">{b.sub}</span> : null}
        </button>
      ))}
      {hint ? <div className="goo-stage__hint">{hint}</div> : null}
      {children}
    </div>
  );
}
