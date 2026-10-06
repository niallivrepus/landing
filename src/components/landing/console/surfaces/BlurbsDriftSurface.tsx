import { useEffect, useRef } from "react";
import { PublicBlurbsFeed } from "../../PublicBlurbsFeed";

/** Drift speed in CSS px per second — slow enough to read a post as it passes. */
const DRIFT_PX_PER_SEC = 16;
/** Hold at the top/bottom before drifting on / looping. */
const DRIFT_HOLD_MS = 1800;

/**
 * **Purpose:** The Blurbs feed as a console home scene: the real public feed (`PublicBlurbsFeed` →
 * `/api/public-blurbs-feed`, the same source `/blurbs` uses; bundled samples only when the API is unreachable),
 * drifting slowly upward in a fixed-height column and looping. Pauses when not playing or the tab is hidden.
 * **Connects to:** `ConsoleStage` (`console/surfaces`), `PublicBlurbsFeed`, `landing-console-home.css`.
 */
export function BlurbsDriftSurface({ playing }: { playing: boolean }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !playing) return undefined;
    let raf = 0;
    let last = performance.now();
    let holdUntil = last + DRIFT_HOLD_MS;
    let position = scroller.scrollTop;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!document.hidden && now >= holdUntil) {
        const max = scroller.scrollHeight - scroller.clientHeight;
        if (max > 0) {
          position += DRIFT_PX_PER_SEC * dt;
          if (position >= max) {
            position = max;
            holdUntil = now + DRIFT_HOLD_MS;
            scroller.scrollTop = position;
            window.setTimeout(() => {
              position = 0;
              scroller.scrollTo({ top: 0, behavior: "smooth" });
            }, DRIFT_HOLD_MS);
            holdUntil = now + DRIFT_HOLD_MS * 2.5;
          } else {
            scroller.scrollTop = position;
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <div ref={scrollerRef} className="console-blurbs-drift">
      <PublicBlurbsFeed limit={12} />
    </div>
  );
}
