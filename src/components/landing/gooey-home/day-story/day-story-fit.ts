import { useEffect, type RefObject } from "react";

export const DAY_STAGE_W = 390;
export const DAY_STAGE_H = 720;
/** The desktop window / phone frame overhang above and below the 390 × 720 column. */
const FRAME_PAD = 34;

/**
 * **Purpose:** Scales the day-story stage to fit its host box (largest scale that fits, capped at `max`), centred on
 * the 390 × 720 center column (plus the frame overhang above and below). Also reports the **desktop extent**: how far
 * (stage units) the desktop window can reach beyond each side of the column in this host, so the desktop beats fill a
 * wide screen and stay just wider than the column on a phone. ResizeObserver only, never per frame; the scale is also
 * written to `data-k` (canvases read it to draw sharp).
 * **Connects to:** `DayStoryPlayer`, `DayStoryScroll`.
 */
export function useFitStage(
  host: RefObject<HTMLElement | null>,
  fit: RefObject<HTMLElement | null>,
  max = 1.15,
  onExtent?: (ext: number) => void,
) {
  useEffect(() => {
    const h = host.current;
    if (!h) return undefined;
    let lastExt = -1;
    const apply = (w: number, hh: number) => {
      const el = fit.current;
      if (!el) return;
      const k = Math.max(0.3, Math.min(max, w / (DAY_STAGE_W + 24), hh / (DAY_STAGE_H + FRAME_PAD * 2)));
      const x = (w - DAY_STAGE_W * k) / 2;
      const y = (hh - DAY_STAGE_H * k) / 2;
      el.dataset.k = k.toFixed(3);
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${k.toFixed(4)})`;
      const ext = Math.round(Math.max(20, Math.min(460, (w / k - DAY_STAGE_W) / 2 - 18)));
      if (ext !== lastExt) {
        lastExt = ext;
        onExtent?.(ext);
      }
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
  }, []);
}
