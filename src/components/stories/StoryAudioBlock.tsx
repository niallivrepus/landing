import { cn } from "@jokuh/gooey";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { isFreedomDayAudio } from "../../lib/freedom-day-audio";
import { FreedomDayFireworksOverlay } from "./FreedomDayFireworksOverlay";

/** **Purpose:** Format seconds as `m:ss` for editorial audio scrubbers. */
export function formatStoryAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * **Purpose:** Reusable editorial MP3 player for story pages and Spine inline memories.
 * **Connects to:** `stories-detail.ts` audio sections, `StoryDetailPage`, `SpineJuly4Memory`.
 */
export function StoryAudioBlock({
  src,
  title,
  attribution,
  variant = "editorial",
  storySlug,
  className,
}: {
  src: string;
  title: string;
  attribution?: string;
  variant?: "editorial" | "spine";
  /** Optional slug for freedom-day fireworks detection when `src` is aliased. */
  storySlug?: string;
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const showFreedomDayFireworks = isFreedomDayAudio(src, storySlug);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onError = () => setPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isSpine = variant === "spine";
  const fireworksActive = showFreedomDayFireworks && playing;

  return (
    <>
      <div
        className={cn(
          isSpine
            ? "rounded-[18px] border border-white/10 bg-white/[0.05] px-4 py-4 light:border-black/10 light:bg-black/[0.03]"
            : "rounded-[10px] border border-light-space/[0.1] bg-smoke-2/35 px-5 py-5 md:px-6 md:py-6 light:border-black/[0.08] light:bg-section-grey-light",
          className,
        )}
      >
        <audio ref={audioRef} src={src} preload="metadata" className="sr-only" />
        <div className={cn("flex flex-col gap-4", !isSpine && "sm:flex-row sm:items-center sm:justify-between")}>
          <div className="min-w-0">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-light-space/45 light:text-zinc-500">
              Audio essay
            </p>
            <p
              className={cn(
                "mt-1 font-sans font-semibold leading-snug text-light-space light:text-zinc-950",
                isSpine ? "text-[14px]" : "text-[1.05rem] md:text-[1.12rem]",
              )}
            >
              {title}
            </p>
            {attribution ? (
              <p className="mt-1 font-sans text-[13px] text-light-space/55 light:text-zinc-600">{attribution}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={togglePlay}
            className={cn(
              "inline-flex shrink-0 items-center gap-3 rounded-full font-sans text-sm font-semibold text-light-space transition-opacity",
              "hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 light:focus-visible:outline-black/25",
              isSpine && "self-start",
            )}
            aria-pressed={playing}
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-zinc-200 light:bg-zinc-200">
              {playing ? (
                <Pause className="size-4 fill-black text-black" aria-hidden />
              ) : (
                <Play className="ml-0.5 size-4 fill-black text-black" aria-hidden />
              )}
            </span>
            <span className="text-light-space light:text-zinc-950">{playing ? "Pause" : "Play"}</span>
          </button>
        </div>
        <div className="mt-5">
          <div className="h-1 overflow-hidden rounded-full bg-light-space/10 light:bg-zinc-300" aria-hidden>
            <div
              className="h-full rounded-full bg-light-space/70 transition-[width] duration-150 ease-linear light:bg-zinc-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between font-sans text-[11px] tabular-nums text-light-space/45 light:text-zinc-500">
            <span>{formatStoryAudioTime(currentTime)}</span>
            <span>{formatStoryAudioTime(duration)}</span>
          </div>
        </div>
      </div>

      {showFreedomDayFireworks && typeof document !== "undefined"
        ? createPortal(<FreedomDayFireworksOverlay active={fireworksActive} />, document.body)
        : null}
    </>
  );
}
