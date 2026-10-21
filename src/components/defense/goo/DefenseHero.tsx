import { useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { DEFENSE_HERO, DEFENSE_HERO_FACTS, DEFENSE_SOLUTION } from "../../../data/defense";
import { JokuhButton } from "../../system/JokuhButton";

/**
 * **Purpose:** `/defense` hero: the claim, two CTAs, and a living goo cluster of the five parts (Identity at the hub,
 * Messages, Calls, Spine, OO budding off it). Goo is the vessel; labels stay crisp. Reduced motion: the cluster is still.
 * **Connects to:** `GooDefs` (`#dg-goo-hero`), `data/defense.ts` (copy), `defense-goo.css`.
 */
type Bead = { id: string; label: string; x: number; y: number; r: number; color: string; drift: number };

const W = 800;
const H = 440;
const HUB: Bead = { id: "identity", label: "Identity", x: 400, y: 220, r: 72, color: "var(--color-purple-4, #9327ff)", drift: 0 };
const BEADS: Bead[] = [
  { id: "messages", label: "Messages", x: 210, y: 96, r: 46, color: "var(--color-red-4, #ff0700)", drift: 1 },
  { id: "calls", label: "Calls", x: 120, y: 280, r: 44, color: "var(--color-green-4, #21dc11)", drift: 2 },
  { id: "spine", label: "Spine", x: 640, y: 100, r: 46, color: "var(--color-yellow-4, #ffb800)", drift: 3 },
  { id: "docs", label: "Docs", x: 706, y: 286, r: 42, color: "#ff4d00", drift: 4 },
  { id: "oo", label: "OO", x: 420, y: 384, r: 48, color: "#8c73ff", drift: 5 },
];

export function DefenseHero() {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <header className="defense-hero" data-motion={reduceMotion ? "off" : "on"}>
      <div className="defense-hero__copy">
        <p className="defense-eyebrow">{DEFENSE_HERO.eyebrow}</p>
        <h1 className="defense-hero__title">{DEFENSE_HERO.title}</h1>
        <p className="defense-hero__sub">{DEFENSE_HERO.subtitle}</p>
        <div className="defense-hero__ctas">
          <JokuhButton href={DEFENSE_HERO.primary.href} variant="primary">
            {DEFENSE_HERO.primary.label}
          </JokuhButton>
          <JokuhButton href={DEFENSE_HERO.secondary.href} variant="secondary">
            {DEFENSE_HERO.secondary.label}
          </JokuhButton>
        </div>
        <ul className="defense-hero__facts">
          {DEFENSE_HERO_FACTS.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>

      <div className="defense-hero__field" role="img" aria-label="Diagram. Identity sits at the hub; Messages, Calls, Spine, Docs and OO bud off it.">
        <svg viewBox={`0 0 ${W} ${H}`} className="defense-hero__svg" aria-hidden>
          <g style={{ filter: "url(#dg-goo-hero)" }}>
            {BEADS.map((b) => (
              <line key={`n-${b.id}`} x1={HUB.x} y1={HUB.y} x2={b.x} y2={b.y} className="defense-hero__neck" style={{ stroke: b.color } as CSSProperties} />
            ))}
            <circle cx={HUB.x} cy={HUB.y} r={HUB.r} style={{ fill: HUB.color }} />
            {BEADS.map((b) => (
              <circle
                key={b.id}
                cx={b.x}
                cy={b.y}
                r={b.r}
                className="defense-hero__bead"
                style={{ fill: b.color, "--d": b.drift } as CSSProperties}
              />
            ))}
          </g>
        </svg>
        {[HUB, ...BEADS].map((b) => (
          <span
            key={`l-${b.id}`}
            className="defense-hero__label"
            style={{ left: `${(b.x / W) * 100}%`, top: `${(b.y / H) * 100}%` }}
          >
            {b.label}
          </span>
        ))}
        <p className="defense-hero__packet">
          <span aria-hidden className="defense-hero__lock" />
          Messages travel sealed end to end
        </p>
      </div>

      <div className="defense-solution">
        <h2 className="defense-solution__title">{DEFENSE_SOLUTION.title}</h2>
        <div>
          <p className="defense-solution__label">{DEFENSE_SOLUTION.problem.label}</p>
          <p className="defense-solution__body">{DEFENSE_SOLUTION.problem.body}</p>
        </div>
        <div>
          <p className="defense-solution__label">{DEFENSE_SOLUTION.solution.label}</p>
          <p className="defense-solution__body">{DEFENSE_SOLUTION.solution.body}</p>
        </div>
      </div>
    </header>
  );
}
