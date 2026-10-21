import { cn, useTheme } from "@jokuh/gooey";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { DefenseCaptureSurface } from "../../../data/defense";
import { useDefenseCapture } from "../defense-captures";

/**
 * **Purpose:** A real-app recording in a squircle glass frame. Poster first; the muted loop mounts only once the frame
 * is near the viewport and plays only while `playing`. Honest by construction: it only ever shows the recorded
 * `/demo` app on demo data (`public/defense/captures/`). Reduced motion: poster only. An energy ring hugs the frame.
 * **Connects to:** `DefenseExplorer`, `DefenseDay`, `defense-captures.ts` (manifest hook).
 */
export function GooCapture({
  surface,
  playing,
  energy,
  reduceMotion,
  label,
  className,
}: {
  surface: DefenseCaptureSurface;
  playing: boolean;
  energy: string;
  reduceMotion: boolean;
  label: string;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  // Splat: a new recording arrives as goo — blobs in the part's energy bud over the frame, the recording swaps under
  // them at the peak, and they drip away. Reduced motion: an instant swap.
  const [shown, setShown] = useState(surface);
  const [splat, setSplat] = useState(0);
  useEffect(() => {
    if (surface === shown) return undefined;
    if (reduceMotion) {
      setShown(surface);
      return undefined;
    }
    setSplat((n) => n + 1);
    const id = window.setTimeout(() => setShown(surface), 300);
    return () => window.clearTimeout(id);
  }, [reduceMotion, shown, surface]);
  const files = useDefenseCapture(shown, resolvedTheme === "light");
  const frameRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setNear(Boolean(entry?.isIntersecting)), { rootMargin: "240px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => setReady(false), [shown]);

  const ratio = files?.size ? files.size.width / files.size.height : 0.64;
  const showVideo = near && playing && !reduceMotion && Boolean(files?.webm || files?.mp4);
  return (
    <figure className={cn("defense-cap", className)} aria-label={label}>
      <div ref={frameRef} className="defense-cap__frame" style={{ "--energy": energy, "--ratio": ratio } as CSSProperties}>
        <span aria-hidden className="defense-cap__ring" />
        {splat > 0 ? (
          <span key={splat} aria-hidden className="defense-cap__splat">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="defense-cap__blob" style={{ "--i": i } as CSSProperties} />
            ))}
          </span>
        ) : null}
        <div className="defense-cap__clip">
          {files?.poster ? <img className="defense-cap__img" src={files.poster} alt="" draggable={false} /> : null}
          {showVideo ? (
            <video
              key={`${shown}-${resolvedTheme}`}
              className="defense-cap__video"
              data-ready={ready ? "true" : "false"}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              poster={files?.poster}
              onLoadedData={() => setReady(true)}
              aria-hidden
            >
              {files?.webm ? <source src={files.webm} type="video/webm" /> : null}
              {files?.mp4 ? <source src={files.mp4} type="video/mp4" /> : null}
            </video>
          ) : null}
        </div>
      </div>
      <figcaption className="defense-cap__caption">Real app recording · demo data</figcaption>
    </figure>
  );
}
