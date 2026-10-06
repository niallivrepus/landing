import { useEffect, useState, type RefObject } from "react";

/**
 * **Purpose:** True once an element inside the `/defense` doc scroller comes within `margin` px of its viewport
 * (sticky: never flips back). Media mounts lazily off it, so the doc's first paint only loads what's on screen.
 * The scroller is the nearest `[data-defense-scroller]` ancestor; without IntersectionObserver it reports near.
 * **Connects to:** `DefenseCapture`, `DefenseCapabilities`.
 */
export function useNearScroller(ref: RefObject<HTMLElement | null>, margin = 600): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || near) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return undefined;
    }
    const root = node.closest<HTMLElement>("[data-defense-scroller]");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { root, rootMargin: `${margin}px 0px` },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [margin, near, ref]);
  return near;
}
