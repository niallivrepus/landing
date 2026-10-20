import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion, type GooScheme } from "../goo-kit";
import { DAY_BEAT_COUNT, DAY_BEATS, DAY_TOTAL, dayStillTime } from "./day-story-beats";
import { useFitStage } from "./day-story-fit";
import type { DayStoryHandle } from "./DayStoryStage";

/** The stage is its own chunk, fetched when the section is ~1.5 screens away. */
const DayStoryStage = lazy(() => import("./DayStoryStage"));

/** Scroll length per moment (svh). */
const PER_BEAT_SVH = 55;

/**
 * **Purpose:** "A day with Jokuh", scroll-driven: a tall section with a sticky, full-height stage; scrolling scrubs the
 * same day story (`DayStoryStage`) forward and back. The rest of the page carries on after it.
 * Light by design: this shell (heights, captions, screen-reader list) is in the main bundle; the stage chunk loads
 * only when the section nears the viewport, and scroll is only listened to while the section is on screen.
 * **Reduce Motion:** the scrub snaps to one still frame per moment, so scrolling steps through them.
 * **A11y:** the visible caption is decorative; an ordered list of every moment's time + caption is in the section
 * for screen readers. Get Jokuh is a real button in the stage's finale (hidden, so unfocusable, until then).
 * **Connects to:** `GooeyHome` (after the hero), `day-story-beats.ts`, `day-story-fit.ts`.
 */
export function DayStoryScroll({ scheme }: { scheme: GooScheme }) {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const stage = useRef<DayStoryHandle | null>(null);
  const [near, setNear] = useState(false);
  const [beat, setBeat] = useState(0);
  const [reduced] = useState(prefersReducedMotion);

  useFitStage(hostRef, fitRef, 1.7);

  const paint = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
    const t = reduced ? dayStillTime(Math.min(DAY_BEAT_COUNT - 1, Math.floor(p * DAY_BEAT_COUNT))) : p * DAY_TOTAL;
    stage.current?.seek(t);
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
  }, [reduced]);

  // Load the stage chunk when the section is near.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || near) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  // Scrub: listen to scroll only while the section is on screen; one rAF per scroll burst.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    let raf = 0;
    let listening = false;
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          paint();
        });
    };
    const io = new IntersectionObserver((entries) => {
      const on = entries[entries.length - 1]?.isIntersecting ?? false;
      if (on && !listening) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        listening = true;
        onScroll();
      } else if (!on && listening) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        listening = false;
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [paint]);

  const b = DAY_BEATS[beat]!;
  return (
    <section
      ref={sectionRef}
      className="gh-day"
      aria-labelledby="gh-day-title"
      style={{ height: `calc(${DAY_BEAT_COUNT * PER_BEAT_SVH}svh + 100svh)` }}
    >
      <h2 id="gh-day-title" className="sr-only">
        A day with Jokuh
      </h2>
      <ol className="sr-only">
        {DAY_BEATS.map((x) => (
          <li key={x.id}>
            {x.time}. {x.caption}
          </li>
        ))}
      </ol>
      <div className="gh-day__pin">
        <div className="gh-day__bg" aria-hidden>
          <p>Your mind.</p>
          <p>Your machine.</p>
        </div>
        <div className="gh-day__top" aria-hidden>
          <span className="gh-day__eyebrow">A day with Jokuh</span>
          <span className="gh-day__time gh-slab gh-slab--pill">{b.time}</span>
        </div>
        <div ref={hostRef} className="gh-day__stage">
          <div ref={fitRef} className="gh-day__fit">
            {near ? (
              <Suspense fallback={null}>
                <DayStoryStage
                  ref={(h) => {
                    stage.current = h;
                    if (h) paint();
                  }}
                  scheme={scheme}
                  onBeat={setBeat}
                />
              </Suspense>
            ) : null}
          </div>
        </div>
        <div className="gh-day__bottom">
          <p className="gh-day__caption" aria-hidden>
            {b.caption}
          </p>
          <span className="gh-day__rail" aria-hidden>
            <span ref={fillRef} className="gh-day__fill" />
          </span>
        </div>
      </div>
    </section>
  );
}
