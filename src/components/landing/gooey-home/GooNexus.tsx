import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { GooFilter } from "./GooFilter";
import { GOO_ENV_PARAMS, GOO_ENV_SPRING, roleColor, springSettled, springStep, splexSpec, type GooScheme, type Spring } from "./goo-kit";
import { useGooLoop } from "./use-goo-loop";

type Feed = { weeks?: { headline?: string; url?: string; slug?: string; week?: number }[] };

const PAD = 24;
const IDLE_W = 112;
const IDLE_H = 34;

/**
 * **Purpose:** The Nexus pill on top of the frame: a Splex goo capsule that springs to its content (it wobbles on
 * every change, like the app's center pill). Idle it is the empty home pill; once the public build log loads
 * (`/shipped-feed.json`, fetched after first paint) it carries the newest week as a message banner, linking to it.
 * **Parity (jokuh-live):** `frontend/src/components/gooey/goo-env/GooNexus.tsx`, `nexusLayout(0)` = 112 × 34 idle.
 */
export function GooNexus({ scheme }: { scheme: GooScheme }) {
  const uid = useId().replace(/[:]/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const [post, setPost] = useState<{ headline: string; href: string; week?: number } | null>(null);
  const [box, setBox] = useState({ w: IDLE_W + PAD * 2, h: IDLE_H + PAD * 2 });
  const s = useRef<{ w: Spring; h: Spring }>({ w: { x: IDLE_W, v: 0 }, h: { x: IDLE_H, v: 0 } });
  const t = useRef({ w: IDLE_W, h: IDLE_H });

  const write = () => {
    const r = rectRef.current;
    if (!r) return;
    const w = s.current.w.x;
    const h = s.current.h.x;
    const bw = box.w;
    const bh = box.h;
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

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/shipped-feed.json")
        .then((r) => (r.ok ? (r.json() as Promise<Feed>) : null))
        .then((feed) => {
          const w = feed?.weeks?.[0];
          if (!cancelled && w?.headline && w.slug) setPost({ headline: w.headline, href: `/shipped/${w.slug}`, week: w.week });
        })
        .catch(() => {});
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const id = idle ? idle(load) : window.setTimeout(load, 1200);
    return () => {
      cancelled = true;
      if (!idle) window.clearTimeout(id);
    };
  }, []);

  useLayoutEffect(() => {
    const el = textRef.current;
    const w = post && el ? Math.ceil(el.getBoundingClientRect().width) + 30 : IDLE_W;
    const h = post ? 38 : IDLE_H;
    t.current = { w, h };
    setBox({ w: Math.max(w, IDLE_W) + PAD * 2, h: h + PAD * 2 });
    loop.wake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  useLayoutEffect(() => {
    write();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box]);

  return (
    <div ref={wrapRef} className="gh-nexus" style={{ width: box.w, height: box.h }}>
      <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden className="gh-nexus__svg">
        <defs>
          <GooFilter id={`gh-n-${uid}`} x={0} y={0} width={box.w} height={box.h} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
        </defs>
        <g filter={`url(#gh-n-${uid})`}>
          <rect ref={rectRef} fill={roleColor(scheme, "base")} />
        </g>
      </svg>
      {post ? (
        <a className="gh-nexus__link" href={post.href} aria-label={`New on Shipped: ${post.headline}`}>
          <span ref={textRef} className="gh-nexus__text">
            <span aria-hidden className="gh-nexus__dot" />
            <span className="gh-nexus__label">New · {post.headline}</span>
          </span>
        </a>
      ) : null}
    </div>
  );
}
