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
  const files = useDefenseCapture(surface, resolvedTheme === "light");
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

  useEffect(() => setReady(false), [surface]);

  const ratio = files?.size ? files.size.width / files.size.height : 0.64;
  const showVideo = near && playing && !reduceMotion && Boolean(files?.webm || files?.mp4);
  return (
    <figure className={cn("defense-cap", className)} aria-label={label}>
      <div ref={frameRef} className="defense-cap__frame" style={{ "--energy": energy, "--ratio": ratio } as CSSProperties}>
        <span aria-hidden className="defense-cap__ring" />
        <div className="defense-cap__clip">
          {files?.poster ? <img className="defense-cap__img" src={files.poster} alt="" draggable={false} /> : null}
          {showVideo ? (
            <video
              key={`${surface}-${resolvedTheme}`}
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
