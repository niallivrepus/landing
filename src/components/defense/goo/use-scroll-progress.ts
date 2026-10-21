import { useEffect, useState, type RefObject } from "react";

/**
 * **Purpose:** Scroll progress of an element, 0…1, rAF-throttled (one state update per frame at most).
 * `leave`: 0 while the element's top is at or below the viewport top, 1 once it has scrolled fully out the top
 * (hero split). `pass`: 0 when the element's top reaches the bottom of the viewport, 1 when its centre reaches the
 * middle (a section gathering as you arrive). Reduced motion: callers pass `enabled = false` and get 0.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, mode: "leave" | "pass", enabled = true): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!enabled) {
      setProgress(mode === "pass" ? 1 : 0);
      return undefined;
    }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw =
        mode === "leave" ? -rect.top / Math.max(1, rect.height * 0.9) : (vh - rect.top) / Math.max(1, vh * 0.5 + rect.height * 0.5);
      const next = Math.round(Math.min(1, Math.max(0, raw)) * 1000) / 1000;
      setProgress((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled, mode, ref]);
  return progress;
}
