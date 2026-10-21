import { useTheme } from "@jokuh/gooey";
import { useReducedMotion } from "motion/react";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { DEFENSE_HERO, DEFENSE_HERO_FACTS, DEFENSE_MAP, DEFENSE_SOLUTION } from "../../../data/defense";
import { JokuhButton } from "../../system/JokuhButton";
import { DEFENSE_NODE_ENERGY } from "./defense-energy";
import { GooStage, type GooBead, type GooLink } from "./GooStage";
import { useScrollProgress } from "./use-scroll-progress";

/**
 * **Purpose:** `/defense` hero: the claim and CTAs over a living goo system you can play with. Identity is the hub;
 * Messages, Calls, Bubbles, Spine, Docs and OO bud off it on necks of Splex glass. Hover and the parts lean in; grab
 * one and pull — its necks stretch, thin and snap; let go and it springs home and merges back. Tap a part for what it
 * is. Scrolling away splits the system apart. Reduced motion: still, tap only.
 * **Connects to:** `GooStage` (engine + Splex), `data/defense.ts` (copy, part lines), `defense-energy.ts` (library
 * energies), `defense-goo.css`.
 */
const W = 1000;
const H = 640;

const BEADS: GooBead[] = [
  { id: "identity", x: 560, y: 330, r: 96, color: DEFENSE_NODE_ENERGY.identity, label: "Identity" },
  { id: "messages", x: 360, y: 150, r: 60, color: DEFENSE_NODE_ENERGY.messages, label: "Messages" },
  { id: "spine", x: 790, y: 140, r: 62, color: DEFENSE_NODE_ENERGY.spine, label: "Spine" },
  { id: "calls", x: 300, y: 430, r: 56, color: DEFENSE_NODE_ENERGY.calls, label: "Calls" },
  { id: "docs", x: 860, y: 430, r: 52, color: DEFENSE_NODE_ENERGY.docs, label: "Docs" },
  { id: "oo", x: 600, y: 560, r: 60, color: DEFENSE_NODE_ENERGY.oo, label: "OO" },
  { id: "bubbles", x: 150, y: 250, r: 42, color: DEFENSE_NODE_ENERGY.bubbles, label: "Bubbles" },
];

const LINKS: GooLink[] = [
  { a: "identity", b: "messages", w: 30 },
  { a: "identity", b: "spine", w: 30 },
  { a: "identity", b: "calls", w: 30 },
  { a: "identity", b: "docs", w: 26 },
  { a: "identity", b: "oo", w: 30 },
  { a: "calls", b: "bubbles", w: 20 },
  { a: "spine", b: "docs", w: 18 },
];

export function DefenseHero() {
  const reduceMotion = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const scheme = resolvedTheme === "light" ? "light" : "dark";
  const ref = useRef<HTMLElement>(null);
  const leave = useScrollProgress(ref, "leave", !reduceMotion);
  const [picked, setPicked] = useState<string | null>(null);
  const line = useMemo(() => (picked ? DEFENSE_MAP.nodes.find((n) => n.id === picked) : null), [picked]);

  return (
    <header ref={ref} className="dgoo-hero" style={{ "--leave": leave } as CSSProperties}>
      <div className="dgoo-hero__copy">
        <p className="defense-eyebrow">{DEFENSE_HERO.eyebrow}</p>
        <h1 className="dgoo-hero__title">{DEFENSE_HERO.title}</h1>
        <p className="dgoo-hero__sub">{DEFENSE_HERO.subtitle}</p>
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

      <div className="dgoo-hero__stage">
        <GooStage
          width={W}
          height={H}
          beads={BEADS}
          links={LINKS}
          picked={picked}
          onPick={(id) => setPicked((p) => (p === id ? null : id))}
          scheme={scheme}
          reduceMotion={reduceMotion}
          spread={leave}
          goo={62}
          edge={52}
          reach={0.22}
          glow={scheme === "dark" ? 0.55 : 0.3}
          ariaLabel="The Jokuh system. Identity at the hub; Messages, Calls, Bubbles, Spine, Docs and OO connect to it. Select a part to read what it does."
          hint={reduceMotion ? null : <span>Drag a part. Pull it away.</span>}
        />
        <p className="dgoo-hero__line" aria-live="polite" data-on={line ? "true" : "false"} style={{ "--energy": line?.energy } as CSSProperties}>
          {line ? (
            <>
              <strong>{line.label}.</strong> {line.body}
            </>
          ) : (
            <>Tap a part to see what it does. Direct and group messages travel sealed end to end.</>
          )}
        </p>
      </div>

      <div className="defense-solution dgoo-hero__solution">
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
