/**
 * **Purpose:** The two goo pieces of the Docs sheet that the landing's corner frame does not have: the sheet-header
 * pebble (`GooSheetHeaderPill`) and the Nexus pill that springs to any content (`GooNexusPill`). React ports of the
 * Solid components in jokuh-live `frontend/src/components/gooey/goo-env/GooCornerFrame.tsx`, on the landing's own goo
 * engine (`gooey-home/goo-kit.ts`, `GooFilter`, `useGooLoop`): same Splex material, same 34 x 46 diagonal pebble
 * (leading -45 deg, trailing -135 deg), same calm hover swell (a 4 px reach bead, 1.5 px drift, 3 % lift) and tap squish.
 * **Connects to:** `DocSheetFrame.tsx`. **Parity:** jokuh-live `GooSheetHeaderPill` / `GooNexusPill`, Swift `headerActionPill`.
 */
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { GooFilter } from "../landing/gooey-home/GooFilter";
import {
  CORNER_REACH_REST_R,
  GOO_ENV_PARAMS,
  GOO_ENV_SPRING,
  prefersReducedMotion,
  roleColor,
  springSettled,
  springStep,
  splexSpec,
  type GooScheme,
  type Spring,
} from "../landing/gooey-home/goo-kit";
import { useGooLoop } from "../landing/gooey-home/use-goo-loop";

const HB = 100;
const HB_C = HB / 2;
/** `WalletLiquidPillMetrics`: 34 x 46 diagonal pill. */
const HB_W = 34;
const HB_H = 46;
const HB_HOVER_RANGE = 80;
const HB_HOVER_REACH = 4;
const HB_HOVER_DRIFT = 1.5;
const HB_HOVER_LIFT = 1.03;
/** The inner pill of a flank sits 12 px up on the arc (`innerArcLift`). */
const INNER_ARC_LIFT = 12;

type Keys = "rx" | "ry" | "rr" | "ox" | "oy" | "sx" | "sy";

function headerPillHover(dx: number, dy: number): Record<Keys, number> {
  const d = Math.hypot(dx, dy);
  if (d > HB_HOVER_RANGE) return { rx: HB_C, ry: HB_C, rr: CORNER_REACH_REST_R, ox: 0, oy: 0, sx: 1, sy: 1 };
  const k = 1 - d / HB_HOVER_RANGE;
  const ux = d > 0 ? dx / d : 0;
  const uy = d > 0 ? dy / d : 0;
  const lift = d < HB_H / 2 ? HB_HOVER_LIFT : 1;
  return {
    rx: HB_C + ux * HB_HOVER_REACH * k,
    ry: HB_C + uy * HB_HOVER_REACH * k,
    rr: CORNER_REACH_REST_R,
    ox: ux * HB_HOVER_DRIFT * k,
    oy: uy * HB_HOVER_DRIFT * k,
    sx: lift,
    sy: lift,
  };
}

/** One goo sheet-header pebble: real `<button>` + upright glyph over a Splex goo body. `danger` = the red Close. */
export function GooSheetHeaderPill({
  side,
  label,
  icon,
  danger,
  lifted,
  scheme,
  expanded,
  onClick,
}: {
  side: "leading" | "trailing";
  label: string;
  icon: ReactNode;
  danger?: boolean;
  lifted?: boolean;
  scheme: GooScheme;
  /** Set on a menu button (More): `aria-haspopup` + `aria-expanded`. */
  expanded?: boolean;
  onClick: () => void;
}) {
  const uid = useId().replace(/[:]/g, "");
  const rot = side === "leading" ? -45 : -135;
  const boxRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<SVGRectElement>(null);
  const reachRef = useRef<SVGCircleElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const springs = useRef<Record<Keys, Spring>>({
    rx: { x: HB_C, v: 0 },
    ry: { x: HB_C, v: 0 },
    rr: { x: CORNER_REACH_REST_R, v: 0 },
    ox: { x: 0, v: 0 },
    oy: { x: 0, v: 0 },
    sx: { x: 1, v: 0 },
    sy: { x: 1, v: 0 },
  });
  const target = useRef<Record<Keys, number>>({ rx: HB_C, ry: HB_C, rr: CORNER_REACH_REST_R, ox: 0, oy: 0, sx: 1, sy: 1 });

  const write = () => {
    const s = springs.current;
    const w = HB_W * s.sx.x;
    const h = HB_H * s.sy.x;
    const cx = HB_C + s.ox.x;
    const cy = HB_C + s.oy.x;
    const body = bodyRef.current;
    if (body) {
      body.setAttribute("x", (cx - w / 2).toFixed(2));
      body.setAttribute("y", (cy - h / 2).toFixed(2));
      body.setAttribute("width", w.toFixed(2));
      body.setAttribute("height", h.toFixed(2));
      body.setAttribute("rx", (Math.min(w, h) / 2).toFixed(2));
      body.setAttribute("transform", `rotate(${rot} ${cx.toFixed(2)} ${cy.toFixed(2)})`);
    }
    const reach = reachRef.current;
    if (reach) {
      reach.setAttribute("cx", s.rx.x.toFixed(2));
      reach.setAttribute("cy", s.ry.x.toFixed(2));
      reach.setAttribute("r", Math.max(0, s.rr.x).toFixed(2));
    }
    if (btnRef.current) btnRef.current.style.translate = `${s.ox.x.toFixed(2)}px ${s.oy.x.toFixed(2)}px`;
  };

  const loop = useGooLoop(boxRef, (dt) => {
    const s = springs.current;
    const t = target.current;
    let moving = false;
    (Object.keys(s) as Keys[]).forEach((k) => {
      s[k] = springStep(s[k], t[k], GOO_ENV_SPRING, dt);
      if (!springSettled(s[k], t[k], k === "sx" || k === "sy" ? 0.002 : 0.05)) moving = true;
      else s[k] = { x: t[k], v: 0 };
    });
    write();
    return moving;
  });

  useEffect(() => {
    write();
    const onMove = (e: PointerEvent) => {
      const box = boxRef.current;
      if (prefersReducedMotion() || e.pointerType === "touch" || !box) return;
      const r = box.getBoundingClientRect();
      const next = headerPillHover(e.clientX - r.left - HB_C, e.clientY - r.top - HB_C);
      const t = target.current;
      if (Math.abs(t.rx - next.rx) + Math.abs(t.ry - next.ry) + Math.abs(t.sx - next.sx) < 0.05) return;
      Object.assign(t, next);
      loop.wake();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const squish = () => {
    if (prefersReducedMotion()) return;
    const t = target.current;
    Object.assign(t, { sx: 1.12, sy: 0.84 });
    loop.wake();
    window.setTimeout(() => {
      Object.assign(t, { sx: 1, sy: 1, ox: 0, oy: 0 });
      loop.wake();
    }, 140);
  };

  const fill = roleColor(scheme, danger ? "danger" : "base");
  const slotStyle: CSSProperties = lifted ? { position: "relative", top: -INNER_ARC_LIFT, flexShrink: 0 } : { flexShrink: 0 };
  return (
    <div className="da-pill-slot" style={slotStyle}>
      <div className="gcf-hb" data-danger={danger ? "true" : undefined}>
        <div ref={boxRef} className="gcf-hb__box" style={{ width: HB, height: HB }}>
          <svg width={HB} height={HB} viewBox={`0 0 ${HB} ${HB}`} className="gcf-corner__svg" aria-hidden>
            <defs>
              <GooFilter id={`da-hb-${uid}`} x={0} y={0} width={HB} height={HB} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
            </defs>
            <g filter={`url(#da-hb-${uid})`}>
              <rect ref={bodyRef} fill={fill} />
              <circle ref={reachRef} fill={fill} />
            </g>
          </svg>
        </div>
        <button
          ref={btnRef}
          type="button"
          className="gcf-hb__btn"
          aria-label={label}
          aria-haspopup={expanded === undefined ? undefined : "menu"}
          aria-expanded={expanded}
          onPointerDown={squish}
          onClick={onClick}
        >
          {icon}
        </button>
      </div>
    </div>
  );
}

const PAD = 24;
const IDLE_W = 112;
const IDLE_H = 34;

/** The Nexus pill: a Splex goo capsule that springs to its content (the app's centre pill). */
export function GooNexusPill({ scheme, children }: { scheme: GooScheme; children: ReactNode }) {
  const uid = useId().replace(/[:]/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const [box, setBox] = useState({ w: IDLE_W + PAD * 2, h: IDLE_H + PAD * 2 });
  const boxRef = useRef(box);
  boxRef.current = box;
  const s = useRef<{ w: Spring; h: Spring }>({ w: { x: IDLE_W, v: 0 }, h: { x: IDLE_H, v: 0 } });
  const t = useRef({ w: IDLE_W, h: IDLE_H });

  const write = () => {
    const r = rectRef.current;
    if (!r) return;
    const w = s.current.w.x;
    const h = s.current.h.x;
    const { w: bw, h: bh } = boxRef.current;
    r.setAttribute("x", ((bw - w) / 2).toFixed(2));
    r.setAttribute("y", ((bh - h) / 2).toFixed(2));
    r.setAttribute("width", Math.max(0, w).toFixed(2));
    r.setAttribute("height", Math.max(0, h).toFixed(2));
    r.setAttribute("rx", (Math.max(0, h) / 2).toFixed(2));
  };

  const loop = useGooLoop(wrapRef, (dt) => {
    const sp = s.current;
    sp.w = springStep(sp.w, t.current.w, GOO_ENV_SPRING, dt);
    sp.h = springStep(sp.h, t.current.h, GOO_ENV_SPRING, dt);
    write();
    return !(springSettled(sp.w, t.current.w, 0.1) && springSettled(sp.h, t.current.h, 0.1));
  });

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return undefined;
    const measure = () => {
      const w = Math.max(IDLE_W, Math.ceil(el.getBoundingClientRect().width) + 30);
      t.current = { w, h: 38 };
      setBox({ w: w + PAD * 2, h: 38 + PAD * 2 });
      loop.wake();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    write();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box]);

  return (
    <div ref={wrapRef} className="gcf-nexus" style={{ width: box.w, height: box.h }}>
      <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden className="gcf-nexus__svg">
        <defs>
          <GooFilter id={`da-n-${uid}`} x={0} y={0} width={box.w} height={box.h} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
        </defs>
        <g filter={`url(#da-n-${uid})`}>
          <rect ref={rectRef} fill={roleColor(scheme, "base")} />
        </g>
      </svg>
      <div className="gcf-nexus__link">
        <span ref={textRef} className="gcf-nexus__text">
          {children}
        </span>
      </div>
    </div>
  );
}

/** 20 px glyph inside a header pill (the web app's `DocsHeaderIcon`: 24 grid, 2 px round stroke). */
export function DocsHeaderIcon({ path, filled }: { path: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden>
      <path
        d={path}
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const DOCS_ICON_SHARE = "M12 3v12M8 7l4-4 4 4M7 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1";
export const DOCS_ICON_MORE =
  "M5 10.300a1.700 1.700 0 1 0 0 3.400 1.700 1.700 0 0 0 0-3.400zm7 0a1.700 1.700 0 1 0 0 3.400 1.700 1.700 0 0 0 0-3.400zm7 0a1.700 1.700 0 1 0 0 3.400 1.700 1.700 0 0 0 0-3.400z";
export const DOCS_ICON_BACK = "M15 5l-7 7 7 7";
export const DOCS_ICON_CLOSE = "M6 6l12 12M18 6L6 18";
