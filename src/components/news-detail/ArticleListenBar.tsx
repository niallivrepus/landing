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
    <div className="flex flex-col gap-4 border-y border-white/[0.1] py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {speechOk ? (
          <button
            type="button"
            onClick={togglePlay}
            className={cn(
              "flex items-center gap-3 rounded-full font-sans text-sm text-white transition-opacity",
              "hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30",
            )}
            aria-pressed={playing}
          >
            <span className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/5">
              {playing ? <Pause className="size-4 text-white" aria-hidden /> : <Play className="ml-0.5 size-4 text-white" aria-hidden />}
            </span>
            <span className="text-white/85">{playing ? "Stop" : "Listen to article"}</span>
            <span className="tabular-nums text-white/45">{durationLabel}</span>
          </button>
        ) : (
          <p className="font-sans text-sm text-white/45">Listening isn&apos;t supported in this browser.</p>
        )}
      </div>
      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-2 self-start font-sans text-sm text-white/80 transition-colors hover:text-white sm:self-auto"
      >
        <Link2 className="size-4 opacity-70" aria-hidden />
        {copied ? "Link copied" : "Share"}
      </button>
    </div>
  );
}
