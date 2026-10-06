import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { DefenseStop } from "./defense-stops";

/**
 * **Purpose:** Auto-play for the `/defense` doc: holds each stop for its `dwellMs`, then eases the doc scroller to the
 * next one (and, inside a stop taller than the view, glides down through it halfway). Tracks the active stop from the
 * scroll position when the reader scrolls themselves. Any reader input — wheel, touch, a press on the doc, scroll
 * keys — pauses it; the toggle resumes from the current section. Timers freeze while the tab is hidden. At the end it
 * stops and offers Replay. `enabled: false` (reduced motion) = never plays; the doc is a static read.
 * **Connects to:** `DefenseAppShell` (toggle + progress pill), `defense-stops.ts`, stops marked `data-stop` in
 * `DefenseDoc` inside the `[data-defense-scroller]` element.
 */

const START_DELAY_MS = 1400;
const SCROLL_MS = 900;
/** The reading line: a stop is active once its top passes this fraction of the scroller's height. */
const READ_LINE = 0.34;
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export type DefenseAutoplay = {
  activeIndex: number;
  playing: boolean;
  ended: boolean;
  /** Changes whenever the current stop's dwell restarts (keys the progress bar animation). */
  runKey: number;
  hidden: boolean;
  toggle: () => void;
  goTo: (index: number) => void;
  /** Back to the top and play through again (plays only when enabled). */
  replay: () => void;
};

export function useDefenseAutoplay(
  scrollerRef: RefObject<HTMLElement | null>,
  stops: readonly DefenseStop[],
  enabled: boolean,
): DefenseAutoplay {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [hidden, setHidden] = useState(false);

  const activeRef = useRef(0);
  activeRef.current = activeIndex;
  const runKeyRef = useRef(0);
  runKeyRef.current = runKey;
  const playingRef = useRef(false);
  playingRef.current = playing;
  const remainingRef = useRef(stops[0]?.dwellMs ?? 5000);
  const programmaticRef = useRef(false);
  const scrollAnimRef = useRef<number | null>(null);
  const interactedRef = useRef(false);

  const stopEls = useCallback((): HTMLElement[] => {
    const scroller = scrollerRef.current;
    if (!scroller) return [];
    return stops.map((s) => scroller.querySelector<HTMLElement>(`[data-stop="${s.id}"]`)).filter(Boolean) as HTMLElement[];
  }, [scrollerRef, stops]);

  const topOf = useCallback(
    (el: HTMLElement) => {
      const scroller = scrollerRef.current!;
      return el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    },
    [scrollerRef],
  );

  const cancelScroll = useCallback(() => {
    if (scrollAnimRef.current !== null) cancelAnimationFrame(scrollAnimRef.current);
    scrollAnimRef.current = null;
    programmaticRef.current = false;
  }, []);

  const scrollToY = useCallback(
    (target: number, ms = SCROLL_MS) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      cancelScroll();
      const max = scroller.scrollHeight - scroller.clientHeight;
      const to = Math.max(0, Math.min(max, target));
      const from = scroller.scrollTop;
      if (Math.abs(to - from) < 2) return;
      programmaticRef.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / ms);
        scroller.scrollTop = from + (to - from) * easeInOutCubic(t);
        if (t < 1) scrollAnimRef.current = requestAnimationFrame(tick);
        else {
          scrollAnimRef.current = null;
          // Let the final scroll event land before reader-scroll tracking resumes.
          window.setTimeout(() => {
            programmaticRef.current = false;
          }, 60);
        }
      };
      scrollAnimRef.current = requestAnimationFrame(tick);
    },
    [cancelScroll, scrollerRef],
  );

  const scrollToStop = useCallback(
    (index: number) => {
      const el = stopEls()[index];
      if (!el) return;
      scrollToY(index === 0 ? 0 : topOf(el) - 20, enabled ? SCROLL_MS : 1);
    },
    [enabled, scrollToY, stopEls, topOf],
  );

  const activate = useCallback(
    (index: number) => {
      remainingRef.current = stops[index]?.dwellMs ?? 5000;
      setActiveIndex(index);
      setRunKey((k) => k + 1);
    },
    [stops],
  );

  // ── Reader scroll → active stop ─────────────────────────────────────────────
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (programmaticRef.current) return;
      const els = stopEls();
      if (els.length === 0) return;
      const line = scroller.scrollTop + scroller.clientHeight * READ_LINE;
      let index = 0;
      els.forEach((el, i) => {
        if (topOf(el) <= line) index = i;
      });
      if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4) index = els.length - 1;
      if (index !== activeRef.current) activate(index);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [activate, scrollerRef, stopEls, topOf]);

  // ── Reader input pauses ─────────────────────────────────────────────────────
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;
    const pause = () => {
      interactedRef.current = true;
      if (!playingRef.current) return;
      cancelScroll();
      setPlaying(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key)) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, [role='button']") && event.key === " ") return;
      pause();
    };
    scroller.addEventListener("wheel", pause, { passive: true });
    scroller.addEventListener("touchstart", pause, { passive: true });
    scroller.addEventListener("pointerdown", pause);
    window.addEventListener("keydown", onKey);
    return () => {
      scroller.removeEventListener("wheel", pause);
      scroller.removeEventListener("touchstart", pause);
      scroller.removeEventListener("pointerdown", pause);
      window.removeEventListener("keydown", onKey);
    };
  }, [cancelScroll, scrollerRef]);

  // ── Tab visibility freezes timers ───────────────────────────────────────────
  useEffect(() => {
    const update = () => setHidden(document.visibilityState === "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // ── Start on its own, shortly after load, unless the reader got there first ──
  useEffect(() => {
    if (!enabled) return undefined;
    const id = window.setTimeout(() => {
      if (interactedRef.current) return;
      remainingRef.current = stops[activeRef.current]?.dwellMs ?? 5000;
      setRunKey((k) => k + 1);
      setPlaying(true);
    }, START_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [enabled, stops]);

  useEffect(() => {
    if (!enabled) setPlaying(false);
  }, [enabled]);

  // ── The dwell timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing || hidden) return undefined;
    const index = activeIndex;
    const key = runKey;
    const startedAt = performance.now();
    const remaining = remainingRef.current;

    const timers: number[] = [];
    // A stop taller than the view glides down through itself halfway through its dwell.
    const els = stopEls();
    const scroller = scrollerRef.current;
    const el = els[index];
    if (el && scroller) {
      const stopTop = topOf(el);
      const nextTop = els[index + 1] ? topOf(els[index + 1]!) : scroller.scrollHeight;
      const overflow = nextTop - stopTop - scroller.clientHeight + 40;
      const elapsed = (stops[index]?.dwellMs ?? remaining) - remaining;
      const glideAt = (stops[index]?.dwellMs ?? remaining) * 0.45 - elapsed;
      if (overflow > 40 && glideAt > 0) {
        timers.push(
          window.setTimeout(() => scrollToY(nextTop - scroller.clientHeight + 20, 1400), glideAt),
        );
      }
    }

    timers.push(
      window.setTimeout(() => {
        const next = index + 1;
        if (next >= stops.length) {
          setPlaying(false);
          setEnded(true);
          return;
        }
        activate(next);
        scrollToStop(next);
      }, remaining),
    );

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      // Paused or hidden mid-stop: keep what's left. (A new stop already set its own full dwell.)
      if (activeRef.current === index && runKeyRef.current === key) {
        remainingRef.current = Math.max(400, remaining - (performance.now() - startedAt));
      }
    };
  }, [activate, activeIndex, hidden, playing, runKey, scrollToStop, scrollToY, scrollerRef, stopEls, stops, topOf]);

  useEffect(() => cancelScroll, [cancelScroll]);

  const toggle = useCallback(() => {
    if (!enabled) return;
    interactedRef.current = true;
    if (playingRef.current) {
      cancelScroll();
      setPlaying(false);
      return;
    }
    // Resume (or replay from the top once it has ended) from the start of the current section.
    const index = ended ? 0 : activeRef.current;
    setEnded(false);
    activate(index);
    scrollToStop(index);
    setPlaying(true);
  }, [activate, cancelScroll, enabled, ended, scrollToStop]);

  const goTo = useCallback(
    (index: number) => {
      interactedRef.current = true;
      setEnded(false);
      activate(index);
      scrollToStop(index);
    },
    [activate, scrollToStop],
  );

  const replay = useCallback(() => {
    interactedRef.current = true;
    setEnded(false);
    activate(0);
    scrollToStop(0);
    setPlaying(enabled);
  }, [activate, enabled, scrollToStop]);

  return { activeIndex, playing, ended, runKey, hidden, toggle, goTo, replay };
}
