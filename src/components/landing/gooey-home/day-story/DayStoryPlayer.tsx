import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion, type GooScheme } from "../goo-kit";
import { DAY_BEAT_COUNT, DAY_BEATS, DAY_STARTS, DAY_TOTAL, dayBeatAt, dayStillTime } from "./day-story-beats";
import { useFitStage } from "./day-story-fit";
import DayStoryStage, { type DayStoryHandle } from "./DayStoryStage";

function PlayGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" />
    </svg>
  );
}
function PauseGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <rect x="6" y="5" width="4.2" height="14" rx="1.4" />
      <rect x="13.8" y="5" width="4.2" height="14" rx="1.4" />
    </svg>
  );
}
function Chevron({ back }: { back?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {back ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}
function ReplayGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" />
    </svg>
  );
}
function CloseGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/**
 * **Purpose:** "Watch a day" auto-play: the day story plays in place over the hero (the hero's tagline stays as the
 * backdrop), with pause / play, skip to the next moment, back, exit (X or Esc), a segmented progress rail and the
 * caption as live text. At the end: Replay + Get Jokuh.
 * **Perf:** one rAF loop drives `DayStoryStage.seek(t)`; it stops while paused, when the hero is scrolled off screen
 * and while the tab is hidden. **Reduce Motion:** nothing auto-plays: each moment is a still frame, stepped with
 * Next / Back (or the arrow keys).
 * **Keys:** Esc closes, Space pauses, ← / → step. **Connects to:** `GooHero` (lazy; opened by the bar's ▶ bead).
 */
export default function DayStoryPlayer({ scheme, onClose }: { scheme: GooScheme; onClose: () => void }) {
  const [reduced] = useState(prefersReducedMotion);
  const [playing, setPlaying] = useState(!reduced);
  const [beat, setBeat] = useState(0);
  const [ended, setEnded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const stage = useRef<DayStoryHandle | null>(null);
  const t = useRef(reduced ? dayStillTime(0) : 0);
  const playRef = useRef<HTMLButtonElement>(null);
  const onScreen = useRef(true);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useFitStage(hostRef, fitRef, 1.2);

  const paint = useCallback(() => {
    stage.current?.seek(t.current);
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${(t.current / DAY_TOTAL).toFixed(4)})`;
  }, []);

  const seekTo = useCallback(
    (s: number) => {
      t.current = Math.min(DAY_TOTAL, Math.max(0, s));
      setEnded(t.current >= DAY_TOTAL - 0.01);
      paint();
    },
    [paint],
  );

  // The one frame loop.
  useEffect(() => {
    if (!playing) return undefined;
    let raf = 0;
    let last = 0;
    const run = (now: number) => {
      raf = 0;
      if (!playingRef.current) return;
      if (!onScreen.current || document.visibilityState !== "visible") {
        last = 0;
        return;
      }
      const dt = last ? Math.min(0.064, (now - last) / 1000) : 0;
      last = now;
      t.current += dt;
      if (t.current >= DAY_TOTAL) {
        t.current = DAY_TOTAL;
        paint();
        setPlaying(false);
        setEnded(true);
        return;
      }
      paint();
      raf = requestAnimationFrame(run);
    };
    const kick = () => {
      if (!raf && playingRef.current && onScreen.current && document.visibilityState === "visible") {
        last = 0;
        raf = requestAnimationFrame(run);
      }
    };
    const io = new IntersectionObserver((entries) => {
      onScreen.current = entries[entries.length - 1]?.isIntersecting ?? true;
      kick();
    });
    if (rootRef.current) io.observe(rootRef.current);
    document.addEventListener("visibilitychange", kick);
    kick();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [playing, paint]);

  useEffect(() => {
    playRef.current?.focus({ preventScroll: true });
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      const i = dayBeatAt(t.current);
      const target = Math.min(DAY_BEAT_COUNT - 1, Math.max(0, i + dir));
      if (reduced || !playingRef.current) seekTo(dayStillTime(target));
      else seekTo(DAY_STARTS[target]!);
    },
    [reduced, seekTo],
  );

  const toggle = useCallback(() => {
    if (ended) {
      seekTo(reduced ? dayStillTime(0) : 0);
      setEnded(false);
      if (!reduced) setPlaying(true);
      return;
    }
    if (reduced) {
      step(1);
      return;
    }
    setPlaying((p) => !p);
  }, [ended, reduced, seekTo, step]);

  // Esc anywhere closes; the other keys only while focus is inside the player (never hijack page scrolling).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (e.key === " " && tag !== "BUTTON" && tag !== "A") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const b = DAY_BEATS[beat]!;
  const last = beat === DAY_BEAT_COUNT - 1;
  const playLabel = ended ? "Replay the day" : reduced ? "Next moment" : playing ? "Pause the story" : "Play the story";

  return (
    <div ref={rootRef} className="gds-player" role="region" aria-label="A day with Jokuh" onKeyDown={onKeyDown}>
      <div className="gds-player__top">
        <span className="gds-time gh-slab gh-slab--pill" aria-hidden>
          {b.time}
        </span>
        <button type="button" className="gh-bead gh-bead--sm" aria-label="Close the story" onClick={onClose}>
          <CloseGlyph />
        </button>
      </div>

      <div ref={hostRef} className="gds-player__stage">
        <div ref={fitRef} className="gds-fit">
          <DayStoryStage
            ref={(h) => {
              stage.current = h;
              if (h) paint();
            }}
            scheme={scheme}
            onBeat={setBeat}
          />
        </div>
      </div>

      <div className="gds-player__bottom">
        <p className="gds-caption" aria-live="polite" aria-atomic="true">
          <span className="sr-only">{b.time}. </span>
          {b.caption}
        </p>
        <div className="gds-controls">
          <button type="button" className="gh-bead gh-bead--sm" aria-label="Previous moment" onClick={() => step(-1)} disabled={beat === 0}>
            <Chevron back />
          </button>
          <button ref={playRef} type="button" className="gh-bead gds-play" aria-label={playLabel} onClick={toggle}>
            {ended ? <ReplayGlyph /> : reduced ? <Chevron /> : playing ? <PauseGlyph /> : <PlayGlyph />}
          </button>
          {reduced ? null : (
            <button type="button" className="gh-bead gh-bead--sm" aria-label="Skip to the next moment" onClick={() => step(1)} disabled={last}>
              <Chevron />
            </button>
          )}
          <span className="gds-rail" aria-hidden>
            {DAY_BEATS.map((x, i) => (
              <span key={x.id} className="gds-rail__seg" style={{ flex: x.dur }} data-on={i <= beat || undefined} />
            ))}
            <span ref={fillRef} className="gds-rail__fill" />
          </span>
        </div>
      </div>
    </div>
  );
}
