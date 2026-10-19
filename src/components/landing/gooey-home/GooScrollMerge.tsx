import { useEffect, useId, useRef } from "react";
import { GooFilter } from "./GooFilter";
import { GOO_ENV_PARAMS, prefersReducedMotion, roleColor, splexSpec, type GooScheme } from "./goo-kit";

const W = 360;
const H = 96;

/**
 * **Purpose:** A small goo moment between sections, driven by scroll: two Splex drops slide in from the sides,
 * neck together and merge into one bead as the strip crosses the middle of the screen, then pinch apart again.
 * Only listens to scroll while on screen; under Reduce Motion it rests merged.
 * **Connects to:** `GooeyHome`, goo recipe in `goo-kit.ts` / `GooFilter`.
 */
export function GooScrollMerge({ scheme, tint = "base" }: { scheme: GooScheme; tint?: "base" | "go" | "accent" }) {
  const uid = useId().replace(/[:]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const a = useRef<SVGCircleElement>(null);
  const b = useRef<SVGCircleElement>(null);
  const mid = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the strip enters at the bottom, 1 when it leaves at the top; 0.5 = screen middle.
      const p = prefersReducedMotion() ? 0.5 : Math.min(1, Math.max(0, 1 - (r.top + r.height / 2) / vh));
      const near = 1 - Math.min(1, Math.abs(p - 0.5) / 0.5); // 0 far → 1 merged
      const spread = (1 - near) * (W / 2 - 34);
      const cx = W / 2;
      a.current?.setAttribute("cx", (cx - spread).toFixed(2));
      b.current?.setAttribute("cx", (cx + spread).toFixed(2));
      const rr = 14 + 8 * near;
      a.current?.setAttribute("r", rr.toFixed(2));
      b.current?.setAttribute("r", rr.toFixed(2));
      mid.current?.setAttribute("r", (near > 0.55 ? (near - 0.55) * 40 : 0).toFixed(2));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    let listening = false;
    const io = new IntersectionObserver((entries) => {
      const on = entries[entries.length - 1]?.isIntersecting ?? false;
      if (on && !listening) {
        window.addEventListener("scroll", onScroll, { passive: true });
        listening = true;
        onScroll();
      } else if (!on && listening) {
        window.removeEventListener("scroll", onScroll);
        listening = false;
      }
    });
    io.observe(el);
    paint();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const fill = roleColor(scheme, tint);
  return (
    <div ref={ref} className="gh-merge" aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} className="gh-merge__svg">
        <defs>
          <GooFilter id={`gh-m-${uid}`} x={0} y={0} width={W} height={H} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
        </defs>
        <g filter={`url(#gh-m-${uid})`}>
          <circle ref={a} cx={34} cy={H / 2 - 6} r={14} fill={fill} />
          <circle ref={b} cx={W - 34} cy={H / 2 - 6} r={14} fill={fill} />
          <circle ref={mid} cx={W / 2} cy={H / 2 - 6} r={0} fill={fill} />
        </g>
      </svg>
    </div>
  );
}
