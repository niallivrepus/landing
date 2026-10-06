import { cn } from "@jokuh/gooey";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { DefenseCaptureSurface } from "../../data/defense";
import { SquircleBox } from "../system/squircle";
import { useDefenseCapture, type DefenseCaptureFiles } from "./defense-captures";
import { useNearScroller } from "./useNearScroller";

/**
 * **Purpose:** A real-app recording embedded in the `/defense` doc like an image block in a Jokuh Doc: a true
 * squircle (`SquircleBox`) holding the app column recording, uncropped (object-fit contain). Poster first; the muted
 * loop mounts only once the block nears the doc's viewport and plays only while its section is the one playing.
 * Two surfaces = a sequence: the second takes over halfway (e.g. Spine → the briefing opening in Docs).
 * While active, a ring in the section's energy colour hugs the squircle (the cursor-less "this is what we mean").
 * Reduced motion: posters only.
 * **Connects to:** `DefenseDoc` (walkthrough steps), `defense-captures.ts` (manifest), `defense-app.css`.
 */
export function DefenseCapture({
  surfaces,
  active,
  playing,
  light,
  energy,
  reduceMotion,
  switchAfterMs = 3200,
  label,
}: {
  surfaces: readonly DefenseCaptureSurface[];
  active: boolean;
  playing: boolean;
  light: boolean;
  energy: string;
  reduceMotion: boolean;
  switchAfterMs?: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearScroller(ref);
  const [index, setIndex] = useState(0);
  // The frame hugs the recording (its measured crop), like the app column it is: the widest of the sequence.
  const first = useDefenseCapture(surfaces[0]!, light);
  const second = useDefenseCapture(surfaces[1] ?? surfaces[0]!, light);
  const ratio = Math.max(aspectOf(first), aspectOf(second));

  // Sequence: advance once while playing; back to the first recording when the section is left.
  useEffect(() => {
    if (!active) {
      setIndex(0);
      return undefined;
    }
    if (surfaces.length < 2 || !playing) return undefined;
    const id = window.setTimeout(() => setIndex(1), switchAfterMs);
    return () => window.clearTimeout(id);
  }, [active, playing, surfaces.length, switchAfterMs]);

  return (
    <figure className="defense-media" data-active={active ? "true" : "false"}>
      <div ref={ref} className="defense-media__frame" style={{ "--energy": energy, "--ratio": ratio } as CSSProperties}>
        <SquircleBox
          radius={22}
          className="defense-media__box"
          fillClassName="defense-media__fill"
          ring={{ offset: 4, className: "defense-media__ring" }}
        >
          {surfaces.map((surface, i) => (
            <CaptureLayer
              key={surface}
              surface={surface}
              current={i === index}
              near={near || active}
              playing={playing && i === index}
              light={light}
              reduceMotion={reduceMotion}
            />
          ))}
        </SquircleBox>
      </div>
      <figcaption className="defense-media__caption">{label}</figcaption>
    </figure>
  );
}

/** Width ÷ height of a recording's crop; a phone-column default until the manifest lands. */
function aspectOf(files: DefenseCaptureFiles | null | undefined): number {
  const size = files?.size;
  return size && size.width > 0 && size.height > 0 ? size.width / size.height : 0.62;
}

function CaptureLayer({
  surface,
  current,
  near,
  playing,
  light,
  reduceMotion,
}: {
  surface: DefenseCaptureSurface;
  current: boolean;
  near: boolean;
  playing: boolean;
  light: boolean;
  reduceMotion: boolean;
}) {
  const files = useDefenseCapture(surface, light);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [mountVideo, setMountVideo] = useState(false);
  const hasVideo = Boolean(files?.webm || files?.mp4) && !reduceMotion;

  // Mount the loop the first time this layer is near the viewport (or asked to play); keep it after that.
  useEffect(() => {
    if (hasVideo && (near || playing)) setMountVideo(true);
  }, [hasVideo, near, playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) void video.play().catch(() => {});
    else video.pause();
  }, [playing, mountVideo]);

  return (
    <div className={cn("defense-media__layer")} data-current={current ? "true" : "false"} aria-hidden>
      {files?.poster && near ? (
        <img className="defense-media__poster" src={files.poster} alt="" decoding="async" />
      ) : null}
      {mountVideo && files ? (
        <video
          ref={videoRef}
          className="defense-media__video"
          data-ready={ready ? "true" : "false"}
          poster={files.poster}
          muted
          loop
          playsInline
          preload={playing ? "auto" : "metadata"}
          disablePictureInPicture
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
        >
          {files.webm ? <source src={files.webm} type="video/webm" /> : null}
          {files.mp4 ? <source src={files.mp4} type="video/mp4" /> : null}
        </video>
      ) : null}
    </div>
  );
}
