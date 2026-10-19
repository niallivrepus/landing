import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { GooFilter } from "./GooFilter";
import {
  CORNER_REACH_REST_R,
  cornerLean,
  cornerRotation,
  GOO_ENV_PARAMS,
  GOO_ENV_SPRING,
  prefersReducedMotion,
  roleColor,
  springSettled,
  springStep,
  splexSpec,
  type CornerQuad,
  type GooScheme,
  type Spring,
} from "./goo-kit";
import { useGooLoop } from "./use-goo-loop";

/* Corner glyphs: the app's own SVG paths (jokuh-live `frontend/src/utils/icons.tsx`). */
function CallIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 14 17" fill="none" aria-hidden>
      <path
        d="M12.8333 8.45833V9.91667C12.8333 11.2974 11.714 12.4167 10.3333 12.4167H2.625C1.58947 12.4167 0.75 13.2561 0.75 14.2917C0.75 15.3272 1.58947 16.1667 2.625 16.1667H5.125M4.08333 4.29167H9.5M4.08333 7.625H7M2.41667 0.75H10.3333C11.714 0.75 12.8333 1.86929 12.8333 3.25V13.6667C12.8333 15.0474 11.714 16.1667 10.3333 16.1667H2.41667C1.49619 16.1667 0.75 15.4205 0.75 14.5V2.41667C0.75 1.49619 1.49619 0.75 2.41667 0.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TextIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.6.376 3.112 1.043 4.453c.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.591l2.226-.595a1.634 1.634 0 0 1 1.149.133A9.958 9.958 0 0 0 12 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IdIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="6" r="4" />
      <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" />
    </svg>
  );
}
function SpineIcon() {
  return (
    <svg width="21" height="22" viewBox="0 0 15 17" fill="none" aria-hidden>
      <path
        d="M5.75004 14.5H9.08337M4.08337 10.3333C8.63949 10.3333 6.19392 10.3333 10.75 10.3333M4.08337 2H10.75M1.58337 6.16667C6.13949 6.16667 8.69392 6.16667 13.25 6.16667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** App layout: ID top-left, Spine top-right, Call bottom-left, Text bottom-right (`FS_CORNERS`). */
export const CORNER_PILLS: { quad: CornerQuad; label: string; target: string; icon: ReactNode }[] = [
  { quad: "topLeading", label: "ID", target: "id", icon: <IdIcon /> },
  { quad: "topTrailing", label: "Spine", target: "spine", icon: <SpineIcon /> },
  { quad: "bottomLeading", label: "Call", target: "calls", icon: <CallIcon /> },
  { quad: "bottomTrailing", label: "Text", target: "text", icon: <TextIcon /> },
];

const BOX = 200;
/** The app capsule is 40 × 54 (width across, length along the diagonal); drawn 1.1× here. */
const PILL_W = 44;
const PILL_H = 60;

type Keys = "rx" | "ry" | "rr" | "ox" | "oy" | "sx" | "sy";

/**
 * **Purpose:** One goo corner pill: a Splex capsule at the corner's diagonal (the app's four diagonal corner
 * pills), a reach bead that leans toward a nearby pointer on a neck of goo (the pill drifts ≤ 6 px after it), and a
 * tap squish into the corner. The real button + upright glyph ride on top.
 * **Parity (jokuh-live):** `frontend/src/components/gooey/goo-env/GooCornerPill.tsx` (real web chrome under the
 * Gooey environment), `Sources/gooey/` `GooCornerPill`, numbers from `goo-env-core.ts` (`cornerLean`).
 */
function GooCorner({
  quad,
  label,
  icon,
  scheme,
  onActivate,
}: {
  quad: CornerQuad;
  label: string;
  icon: ReactNode;
  scheme: GooScheme;
  onActivate: () => void;
}) {
  const uid = useId().replace(/[:]/g, "");
  const boxRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<SVGRectElement>(null);
  const reachRef = useRef<SVGCircleElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const cx = BOX / 2;
  const cy = BOX / 2;
  const springs = useRef<Record<Keys, Spring>>({
    rx: { x: cx, v: 0 },
    ry: { x: cy, v: 0 },
    rr: { x: CORNER_REACH_REST_R, v: 0 },
    ox: { x: 0, v: 0 },
    oy: { x: 0, v: 0 },
    sx: { x: 1, v: 0 },
    sy: { x: 1, v: 0 },
  });
  const target = useRef<Record<Keys, number>>({ rx: cx, ry: cy, rr: CORNER_REACH_REST_R, ox: 0, oy: 0, sx: 1, sy: 1 });
  const rot = cornerRotation(quad);

  const write = () => {
    const s = springs.current;
    const w = PILL_W * s.sx.x;
    const h = PILL_H * s.sy.x;
    const body = bodyRef.current;
    if (body) {
      body.setAttribute("x", (cx + s.ox.x - w / 2).toFixed(2));
      body.setAttribute("y", (cy + s.oy.x - h / 2).toFixed(2));
      body.setAttribute("width", w.toFixed(2));
      body.setAttribute("height", h.toFixed(2));
      body.setAttribute("rx", (Math.min(w, h) / 2).toFixed(2));
      body.setAttribute("transform", `rotate(${rot} ${(cx + s.ox.x).toFixed(2)} ${(cy + s.oy.x).toFixed(2)})`);
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
      if (prefersReducedMotion() || e.pointerType === "touch") return;
      const box = boxRef.current;
      if (!box) return;
      const r = box.getBoundingClientRect();
      const lean = cornerLean(cx, cy, e.clientX - r.left, e.clientY - r.top);
      const t = target.current;
      if (Math.abs(t.rx - lean.rx) + Math.abs(t.ry - lean.ry) < 0.3) return;
      Object.assign(t, lean);
      loop.wake();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const squish = () => {
    if (prefersReducedMotion()) return;
    const kx = quad === "topLeading" || quad === "bottomLeading" ? -1 : 1;
    const ky = quad === "topLeading" || quad === "topTrailing" ? -1 : 1;
    const t = target.current;
    Object.assign(t, { sx: 1.14, sy: 0.8, ox: kx * 5, oy: ky * 5 });
    loop.wake();
    window.setTimeout(() => {
      Object.assign(t, { sx: 1, sy: 1, ox: 0, oy: 0 });
      loop.wake();
    }, 140);
  };

  return (
    <div ref={boxRef} className={`gh-corner gh-corner--${quad}`} style={{ width: BOX, height: BOX }}>
      <svg width={BOX} height={BOX} viewBox={`0 0 ${BOX} ${BOX}`} className="gh-corner__svg" aria-hidden>
        <defs>
          <GooFilter id={`gh-c-${uid}`} x={0} y={0} width={BOX} height={BOX} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
        </defs>
        <g filter={`url(#gh-c-${uid})`}>
          <rect ref={bodyRef} fill={roleColor(scheme, "base")} />
          <circle ref={reachRef} fill={roleColor(scheme, "base")} />
        </g>
      </svg>
      <button
        ref={btnRef}
        type="button"
        className="gh-corner__btn"
        aria-label={`${label}: jump to ${label}`}
        onPointerDown={squish}
        onClick={onActivate}
      >
        {icon}
      </button>
    </div>
  );
}

/**
 * **Purpose:** The goo corner-pill frame around the hero's centred column (Call, Text, ID, Spine) with the Nexus
 * pill on top, exactly where they sit in the app shell. Each corner jumps to its section below.
 * **Connects to:** `GooeyHome` hero, `GooNexus`.
 */
export function GooCornerFrame({ scheme, nexus }: { scheme: GooScheme; nexus: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const jump = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  };
  return (
    <div className="gh-frame" data-ready={ready || undefined}>
      <div className="gh-frame__nexus">{nexus}</div>
      {CORNER_PILLS.map((c) => (
        <GooCorner key={c.quad} quad={c.quad} label={c.label} icon={c.icon} scheme={scheme} onActivate={() => jump(c.target)} />
      ))}
    </div>
  );
}
