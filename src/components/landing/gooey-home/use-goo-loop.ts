import { useEffect, useRef } from "react";

/**
 * **Purpose:** A frame loop that only runs while `active()` says so, the element is on screen and the tab is
 * visible. `frame(dt, t)` returns `true` to keep going; return `false` and the loop parks itself until `wake()`.
 * Idle goo is still (app rule, `docs/gooey-experience.md`), so nothing spins when nothing moves.
 */
export function useGooLoop(
  ref: React.RefObject<Element | null>,
  frame: (dt: number, t: number) => boolean,
): { wake: () => void } {
  const frameRef = useRef(frame);
  frameRef.current = frame;
  const api = useRef<{ wake: () => void }>({ wake: () => {} });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    let last = 0;
    let t = 0;
    let onScreen = true;
    let wanted = false;
    const run = (now: number) => {
      const dt = last ? Math.min(0.064, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      const more = frameRef.current(dt, t);
      if (more && onScreen && document.visibilityState === "visible") raf = requestAnimationFrame(run);
      else {
        raf = 0;
        last = 0;
        wanted = more;
      }
    };
    const wake = () => {
      wanted = true;
      if (!raf && onScreen && document.visibilityState === "visible") {
        last = 0;
        raf = requestAnimationFrame(run);
      }
    };
    api.current.wake = wake;
    const io = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
      if (onScreen && wanted) wake();
    });
    io.observe(el);
    const onVis = () => {
      if (document.visibilityState === "visible" && wanted) wake();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (raf) cancelAnimationFrame(raf);
      api.current.wake = () => {};
    };
  }, [ref]);

  return { wake: () => api.current.wake() };
}
