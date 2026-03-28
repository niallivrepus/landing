import { cn } from "@jokuh/gooey";
import { Link2, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  speechText: string;
  durationLabel: string;
  shareTitle: string;
};

export function ArticleListenBar({ speechText, durationLabel, shareTitle }: Props) {
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setPlaying(false);
    utterRef.current = null;
  }, []);

  const togglePlay = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (playing) {
      stop();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(speechText);
    u.rate = 1;
    u.onend = () => {
      setPlaying(false);
      utterRef.current = null;
    };
    u.onerror = () => {
      setPlaying(false);
      utterRef.current = null;
    };
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setPlaying(true);
  }, [playing, speechText, stop]);

  useEffect(() => {
    return () => stop();
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

  const speechOk = typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <div className="flex flex-col gap-4 border-y border-light-space/[0.1] py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {speechOk ? (
          <button
            type="button"
            onClick={togglePlay}
            className={cn(
              "flex items-center gap-3 rounded-full font-sans text-sm text-light-space transition-opacity",
              "hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 light:focus-visible:outline-black/25",
            )}
            aria-pressed={playing}
          >
            <span className="flex size-10 items-center justify-center rounded-full border border-light-space/20 bg-white/5 light:border-black/12 light:bg-black/[0.04]">
              {playing ? <Pause className="size-4 text-light-space light:text-zinc-900" aria-hidden /> : <Play className="ml-0.5 size-4 text-light-space light:text-zinc-900" aria-hidden />}
            </span>
            <span className="text-light-space/85 light:text-zinc-900">{playing ? "Stop" : "Listen to article"}</span>
            <span className="tabular-nums text-light-space/45 light:text-zinc-500">{durationLabel}</span>
          </button>
        ) : (
          <p className="font-sans text-sm text-light-space/45 light:text-zinc-500">Listening isn&apos;t supported in this browser.</p>
        )}
      </div>
      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-2 self-start font-sans text-sm text-light-space/80 transition-colors hover:text-light-space light:text-zinc-700 light:hover:text-zinc-950 sm:self-auto"
      >
        <Link2 className="size-4 opacity-70" aria-hidden />
        {copied ? "Link copied" : "Share"}
      </button>
    </div>
  );
}
