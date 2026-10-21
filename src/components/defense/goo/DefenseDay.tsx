import { cn } from "@jokuh/gooey";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DEFENSE_DAY, DEFENSE_SYSTEM_NODES } from "../../../data/defense";
import { DEFENSE_NODE_ENERGY } from "./defense-energy";
import { GooCapture } from "./GooCapture";

/**
 * **Purpose:** "A day in the life": one operator's shift as a scroll-driven goo timeline. A sticky real-app recording
 * follows the beat in view; each beat has its own goo bead on a rail (the active one swells and merges with the line).
 * Below `md` each beat carries its own recording instead. Reduced motion: posters only, beads don't animate.
 * **Connects to:** `GooCapture`, `GooDefs` (`#dg-splex-juicy`), `data/defense.ts` (`DEFENSE_DAY`), `defense-goo.css`.
 */
export function DefenseDay() {
  const reduceMotion = useReducedMotion() ?? false;
  const { beats, title, intro, label } = DEFENSE_DAY;
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    for (const el of refs.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  const beat = beats[active] ?? beats[0];
  return (
    <section className="defense-section defense-day" aria-labelledby="defense-day-title" id="day">
      <div className="defense-section__head">
        <p className="defense-eyebrow">{label}</p>
        <h2 id="defense-day-title" className="defense-h2">
          {title}
        </h2>
        <p className="defense-lede">{intro}</p>
      </div>
      <div className="defense-day__grid">
        <div className="defense-day__sticky" aria-hidden={false}>
          <GooCapture
            surface={beat.surface}
            playing={!reduceMotion}
            energy={DEFENSE_NODE_ENERGY[beat.node]}
            reduceMotion={reduceMotion}
            label={`Recording: ${beat.title}`}
          />
          <p className="defense-day__now">
            <span aria-hidden className="defense-dot" style={{ background: DEFENSE_NODE_ENERGY[beat.node] }} />
            {beat.time} · {DEFENSE_SYSTEM_NODES[beat.node].label}
          </p>
        </div>
        <ol className="defense-day__list">
          {beats.map((b, i) => (
            <li
              key={b.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className={cn("defense-beat", i === active && "is-active", i < active && "is-past")}
              style={{ "--energy": DEFENSE_NODE_ENERGY[b.node] } as CSSProperties}
            >
              <span aria-hidden className="defense-beat__rail">
                <span className="defense-beat__line" />
                <span className="defense-beat__bead" />
              </span>
              <div className="defense-beat__body">
                <p className="defense-beat__time">{b.time}</p>
                <h3 className="defense-beat__title">{b.title}</h3>
                <p className="defense-beat__text">{b.body}</p>
                <div className="defense-beat__cap">
                  <GooCapture surface={b.surface} playing={i === active && !reduceMotion} energy={DEFENSE_NODE_ENERGY[b.node]} reduceMotion={reduceMotion} label={`Recording: ${b.title}`} className="defense-cap--small" />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
