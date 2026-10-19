import { useEffect, useRef, useState } from "react";
import { JokuhOO, type JokuhOOLook } from "../../brand/JokuhOO";
import { prefersReducedMotion } from "./goo-kit";
import {
  HERO_BABIES,
  SWARM_ACTIONS,
  SWARM_ICON_PATHS,
  swarmFrame,
  swarmPos,
  swarmRestPos,
  swarmRng,
  type BabyLook,
  type SwarmFrame,
  type SwarmIcon,
} from "./oo-swarm-model";
import { useGooLoop } from "./use-goo-loop";

export function babyOOLook(look: BabyLook): JokuhOOLook {
  return look === "oo" ? "oo" : `baby-${look}`;
}

export function SwarmIconSvg({ icon, size = 12 }: { icon: SwarmIcon; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={SWARM_ICON_PATHS[icon]} />
    </svg>
  );
}

const LABEL_SHOW_MS = 2800;
const LABEL_GAP_MIN_MS = 2400;
const LABEL_GAP_SPREAD_MS = 2200;

/**
 * **Purpose:** The hero's background swarm: eight small real baby OOs (`JokuhOO` baby looks) drifting slowly round the
 * squircle column, behind the tagline and outside a clear zone round the logo, bar, pills and CTA. Each carries a tiny
 * task icon and now and then pops a label of a real Jokuh action (`SWARM_ACTIONS`). Faint and `aria-hidden`.
 * **Perf:** one rAF loop (`useGooLoop`) that runs only while the hero is on screen and the tab is visible, writing
 * one `transform` (+ `opacity` on narrow screens) per baby. Size is read by a ResizeObserver, never in the loop.
 * Lazy-loaded after first paint (`GooHero`). Reduce Motion: babies rest on fixed seats, no labels, no loop.
 * **Dims** while the visitor focuses or types in the bar (`dim`, CSS opacity transition).
 * **Parity:** jokuh-live `frontend/src/guest-home/GuestHeroSwarm.tsx` (same model file).
 */
export default function GooHeroSwarm({ dim }: { dim: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const frame = useRef<SwarmFrame>(swarmFrame(1200, 800));
  const [reduced] = useState(prefersReducedMotion);
  const [label, setLabel] = useState<{ i: number; text: string } | null>(null);
  const fades = useRef<number[]>(HERO_BABIES.map(() => 1));
  /** Last label per baby, kept so the pop can fade out with its text. */
  const texts = useRef<string[]>([]);

  const place = (t: number, rest: boolean) => {
    const f = frame.current;
    HERO_BABIES.forEach((b, i) => {
      const el = items.current[i];
      if (!el) return;
      const p = rest ? swarmRestPos(b, f) : swarmPos(b, t, f);
      el.style.transform = `translate3d(${(p.x - b.size / 2).toFixed(1)}px, ${(p.y - b.size / 2).toFixed(1)}px, 0) rotate(${rest ? 0 : p.tilt.toFixed(2)}deg)`;
      const prev = fades.current[i]!;
      if (Math.abs(prev - p.fade) > 0.02 || (p.fade === 0 && prev !== 0) || (p.fade === 1 && prev !== 1)) {
        fades.current[i] = p.fade;
        el.style.opacity = p.fade.toFixed(2);
      }
    });
  };

  const { wake } = useGooLoop(root, (_dt, t) => {
    place(t, false);
    return true;
  });

  // Size: ResizeObserver only (no layout reads per frame).
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const ro = new ResizeObserver((entries) => {
      const r = entries[entries.length - 1]?.contentRect;
      if (!r) return;
      frame.current = swarmFrame(r.width, r.height);
      if (reduced) place(0, true);
    });
    ro.observe(el);
    if (reduced) place(0, true);
    else wake();
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Pop labels: one baby at a time, only while the swarm is visible to the visitor (not dimmed, tab visible).
  useEffect(() => {
    if (reduced || dim) {
      setLabel(null);
      return undefined;
    }
    const rnd = swarmRng(7);
    const used: Partial<Record<SwarmIcon, number>> = {};
    let timer = 0;
    let last = -1;
    const next = () => {
      if (document.visibilityState === "visible") {
        const visible = HERO_BABIES.map((_, i) => i).filter((i) => i !== last && (fades.current[i] ?? 1) > 0.9);
        if (visible.length) {
          const i = visible[Math.floor(rnd() * visible.length)]!;
          const pool = SWARM_ACTIONS[HERO_BABIES[i]!.icon];
          const n = used[HERO_BABIES[i]!.icon] ?? 0;
          used[HERO_BABIES[i]!.icon] = n + 1;
          last = i;
          texts.current[i] = pool[n % pool.length]!;
          setLabel({ i, text: pool[n % pool.length]! });
          timer = window.setTimeout(() => {
            setLabel(null);
            timer = window.setTimeout(next, LABEL_GAP_MIN_MS + rnd() * LABEL_GAP_SPREAD_MS);
          }, LABEL_SHOW_MS);
          return;
        }
      }
      timer = window.setTimeout(next, 1200);
    };
    timer = window.setTimeout(next, 1600);
    return () => window.clearTimeout(timer);
  }, [reduced, dim]);

  return (
    <div ref={root} className={`gh-swarm${dim ? " is-dim" : ""}`} aria-hidden>
      {HERO_BABIES.map((b, i) => (
        <div
          key={i}
          ref={(el) => {
            items.current[i] = el;
          }}
          className="gh-swarm__baby"
          style={{ width: b.size, height: b.size }}
        >
          <JokuhOO size={b.size} look={babyOOLook(b.look)} />
          <span className="gh-swarm__task">
            <SwarmIconSvg icon={b.icon} size={Math.round(b.size * 0.3)} />
          </span>
          <span className={`gh-swarm__pop${label?.i === i ? " is-on" : ""}`}>{texts.current[i] ?? ""}</span>
        </div>
      ))}
    </div>
  );
}
