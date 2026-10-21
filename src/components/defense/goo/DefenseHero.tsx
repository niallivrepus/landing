import { useTheme } from "@jokuh/gooey";
import { useReducedMotion } from "motion/react";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import {
  DEFENSE_HERO,
  DEFENSE_HERO_BACKGROUND,
  DEFENSE_HERO_FACTS,
  DEFENSE_HERO_JUMPS,
  DEFENSE_MAP,
  DEFENSE_SOLUTION,
} from "../../../data/defense";
import { SiteLink } from "../../SiteLink";
import { GooCornerFrame } from "../../landing/gooey-home/GooCornerFrame";
import { HeroBackgroundText } from "../../landing/gooey-home/GooHero";
import { GooNexus } from "../../landing/gooey-home/GooNexus";
import { DEFENSE_NODE_ENERGY } from "./defense-energy";
import { GooStage, type GooBead, type GooLink } from "./GooStage";
import { useNarrow } from "./use-narrow";
import { useScrollProgress } from "./use-scroll-progress";

/**
 * **Purpose:** `/defense` hero, shaped like the homepage (the app's home on the web): the goo corner frame (ID, Spine,
 * Call, Text) and the Nexus around the squircle column, the claim as the giant background type, and in the centre —
 * where the home has its Glyph mark — a living goo system you can play with. Identity is the hub;
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

/** Phones: a portrait cluster with bigger beads (finger-sized). */
const NARROW = { w: 600, h: 660 };
const NARROW_POS: Record<string, [number, number, number]> = {
  identity: [310, 330, 92],
  messages: [150, 150, 62],
  spine: [460, 140, 62],
  calls: [130, 470, 58],
  docs: [490, 460, 56],
  oo: [320, 580, 60],
  bubbles: [62, 300, 42],
};
const NARROW_BEADS: GooBead[] = BEADS.map((b) => {
  const [x, y, r] = NARROW_POS[b.id]!;
  return { ...b, x, y, r };
});

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
  const narrow = useNarrow();
  const [picked, setPicked] = useState<string | null>(null);
  const line = useMemo(() => (picked ? DEFENSE_MAP.nodes.find((n) => n.id === picked) : null), [picked]);

  return (
    <>
      <section ref={ref} className="gh-hero dgoo-hero" aria-labelledby="defense-hero-title" style={{ "--leave": leave } as CSSProperties}>
        <HeroBackgroundText headline={DEFENSE_HERO_BACKGROUND.headline} valueLine="" />
        <h1 id="defense-hero-title" className="sr-only">
          {DEFENSE_HERO.title}
        </h1>

        <GooCornerFrame scheme={scheme} nexus={<GooNexus scheme={scheme} />} />

        <div className="dgoo-hero__center">
          <p className="gh-eyebrow gh-slab gh-slab--pill dgoo-hero__eyebrow">
            <span aria-hidden className="gh-eyebrow__dot" />
            {DEFENSE_HERO.eyebrow}
          </p>
          <div className="dgoo-hero__stage">
            <GooStage
              key={narrow ? "narrow" : "wide"}
              width={narrow ? NARROW.w : W}
              height={narrow ? NARROW.h : H}
              beads={narrow ? NARROW_BEADS : BEADS}
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
          </div>
          <p className="dgoo-hero__line gh-slab gh-slab--pill" aria-live="polite" data-on={line ? "true" : "false"} style={{ "--energy": line?.energy } as CSSProperties}>
            {line ? (
              <>
                <strong>{line.label}.</strong> {line.body}
              </>
            ) : (
              <>{DEFENSE_HERO_BACKGROUND.valueLine}</>
            )}
          </p>
          <div className="gh-chips dgoo-hero__chips" role="list" aria-label="Jump to">
            {DEFENSE_HERO_JUMPS.map((j) => (
              <a key={j.href} role="listitem" className="gh-chip gh-slab gh-slab--pill" href={j.href}>
                {j.label}
              </a>
            ))}
          </div>
          <div className="gh-hero__cta dgoo-hero__cta">
            <SiteLink className="gh-go gh-go--md" href={DEFENSE_HERO.primary.href}>
              {DEFENSE_HERO.primary.label}
            </SiteLink>
            <SiteLink className="gh-link" href={DEFENSE_HERO.secondary.href}>
              {DEFENSE_HERO.secondary.label} <span aria-hidden>→</span>
            </SiteLink>
          </div>
        </div>
      </section>

      <section className="gh-intro dgoo-solution" aria-labelledby="defense-solution-title">
        <h2 id="defense-solution-title" className="gh-intro__title">
          {DEFENSE_SOLUTION.title}
        </h2>
        <div className="dgoo-solution__grid">
          <div className="gh-slab dgoo-solution__card">
            <p className="defense-solution__label">{DEFENSE_SOLUTION.problem.label}</p>
            <p className="defense-solution__body">{DEFENSE_SOLUTION.problem.body}</p>
          </div>
          <div className="gh-slab dgoo-solution__card">
            <p className="defense-solution__label">{DEFENSE_SOLUTION.solution.label}</p>
            <p className="defense-solution__body">{DEFENSE_SOLUTION.solution.body}</p>
          </div>
        </div>
        <ul className="gh-feature__points dgoo-solution__facts">
          {DEFENSE_HERO_FACTS.map((fact) => (
            <li key={fact} className="gh-slab gh-slab--pill">
              {fact}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
