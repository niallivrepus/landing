import { cn } from "@jokuh/gooey";
import { Link2, Loader2, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getArticleAudio,
  hasCachedArticleAudio,
  isArticleAudioConfigured,
  preloadArticleAudio,
} from "../../lib/article-audio";

type Props = {
  speechText: string;
  durationLabel: string;
  shareTitle: string;
};

export function ArticleListenBar({ speechText, durationLabel, shareTitle }: Props) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errored, setErrored] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackUtterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Kick off preload as soon as the bar mounts so click-to-play feels instant.
  useEffect(() => {
    preloadArticleAudio(speechText);
  }, [speechText]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    fallbackUtterRef.current = null;
    setPlaying(false);
  }, []);

  const playFallback = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(speechText);
    u.rate = 1;
    u.onend = () => {
      setPlaying(false);
      fallbackUtterRef.current = null;
    };
    u.onerror = () => {
      setPlaying(false);
      fallbackUtterRef.current = null;
    };
    fallbackUtterRef.current = u;
    window.speechSynthesis.speak(u);
    setPlaying(true);
  }, [speechText]);

  const togglePlay = useCallback(async () => {
    if (playing || loading) {
      stop();
      setLoading(false);
      return;
    }
    if (!isArticleAudioConfigured()) {
      playFallback();
      return;
    }

    setErrored(false);
    const cachedHit = hasCachedArticleAudio(speechText);
    if (!cachedHit) setLoading(true);

    try {
      const url = await getArticleAudio(speechText);
      const audio = audioRef.current ?? new Audio();
      audioRef.current = audio;
      audio.src = url;
      audio.onended = () => setPlaying(false);
      audio.onerror = () => {
        setPlaying(false);
        setErrored(true);
      };
      await audio.play();
      setPlaying(true);
    } catch {
      setErrored(true);
      playFallback();
    } finally {
      setLoading(false);
    }
  }, [loading, playFallback, playing, speechText, stop]);

  useEffect(() => {
    return () => {
      stop();
      if (audioRef.current) {
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [stop]);

  const share = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* user cancelled share */
    }
  }, [shareTitle]);

  const speechOk =
    isArticleAudioConfigured() ||
    (typeof window !== "undefined" && "speechSynthesis" in window);

  const label = loading ? "Loading…" : playing ? "Stop" : errored ? "Try again" : "Listen to article";

  return (
    <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {speechOk ? (
          <button
            type="button"
            onClick={togglePlay}
            className={cn(
              "flex items-center gap-3 rounded-full font-sans text-sm font-semibold text-light-space transition-opacity",
              "hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 light:focus-visible:outline-black/25",
            )}
            aria-pressed={playing}
            aria-busy={loading}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-zinc-200 light:bg-zinc-200">
              {loading ? (
                <Loader2 className="size-4 animate-spin fill-black text-black" aria-hidden />
              ) : playing ? (
                <Pause className="size-4 fill-black text-black" aria-hidden />
              ) : (
                <Play className="ml-0.5 size-4 fill-black text-black" aria-hidden />
              )}
            </span>
            <span className="text-light-space light:text-zinc-950">{label}</span>
            <span className="h-4 w-px bg-light-space/20 light:bg-zinc-300" aria-hidden />
            <span className="tabular-nums text-light-space light:text-zinc-950">{durationLabel}</span>
          </button>
        ) : (
          <p className="font-sans text-sm text-light-space/45 light:text-zinc-500">Listening isn&apos;t supported in this browser.</p>
        )}
      </div>
      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-2 self-start font-sans text-sm font-semibold text-light-space transition-colors hover:opacity-85 light:text-zinc-950 sm:self-auto"
      >
        <Link2 className="size-4 text-light-space light:text-zinc-950" aria-hidden />
        {copied ? "Link copied" : "Share"}
      </button>
    </div>
  );
}
