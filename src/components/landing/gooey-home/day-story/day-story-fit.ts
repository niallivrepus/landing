import { useEffect, type RefObject } from "react";

export const DAY_STAGE_W = 390;
export const DAY_STAGE_H = 720;

/**
 * **Purpose:** Scales the 390 × 720 day-story stage to fit its host box (largest scale that fits, capped at `max`),
 * centred. ResizeObserver only, never per frame: the result is one CSS `transform` on `fit`.
 * **Connects to:** `DayStoryPlayer`, `DayStoryScroll`.
 */
export function useFitStage(host: RefObject<HTMLElement | null>, fit: RefObject<HTMLElement | null>, max = 1.15, deps: unknown[] = []) {
  useEffect(() => {
    const h = host.current;
    if (!h) return undefined;
    const apply = (w: number, hh: number) => {
      const el = fit.current;
      if (!el) return;
      const k = Math.max(0.3, Math.min(max, w / DAY_STAGE_W, hh / DAY_STAGE_H));
      const x = (w - DAY_STAGE_W * k) / 2;
      const y = (hh - DAY_STAGE_H * k) / 2;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${k.toFixed(4)})`;
    };
    const ro = new ResizeObserver((entries) => {
      const r = entries[entries.length - 1]?.contentRect;
      if (r) apply(r.width, r.height);
    });
    ro.observe(h);
    const r = h.getBoundingClientRect();
    apply(r.width, r.height);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
