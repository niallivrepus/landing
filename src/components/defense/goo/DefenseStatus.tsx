import { useTheme } from "@jokuh/gooey";
import { useReducedMotion } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import {
  DEFENSE_BUILT_TODAY,
  DEFENSE_CLOSING,
  DEFENSE_DOC_FOOTER_LINKS,
  DEFENSE_PRINCIPLES,
  DEFENSE_PRINCIPLES_HEADING,
  DEFENSE_ROADMAP,
  DEFENSE_SIGNATURE_TEXT,
  DEFENSE_USE_CASES,
  DEFENSE_WORKING_WITH_US,
} from "../../../data/defense";
import { JokuhButton } from "../../system/JokuhButton";
import { SiteLink } from "../../SiteLink";
import { GooStage, type GooBead, type GooLink } from "./GooStage";
import { useScrollProgress } from "./use-scroll-progress";

const PRINCIPLE_BEADS: { id: string; label: string; color: string }[] = [
  { id: "private-by-default", label: "Private", color: "var(--color-green-4)" },
  { id: "you-hold-the-keys", label: "Your keys", color: "var(--color-purple-4)" },
  { id: "speech-not-altered", label: "Unaltered", color: "var(--color-cyan-4)" },
  { id: "built-for-the-field", label: "Field-ready", color: "var(--color-blue-5)" },
];

/**
 * **Purpose:** The honest back half of `/defense`: principles, where it fits (intent, not deployments), what's built
 * today vs. on the roadmap, the plain government status, and the closing call. Copy and the accuracy rules live in
 * `data/defense.ts`; `tests/defense.spec.ts` pins the load-bearing sentences.
 * **Connects to:** `data/defense.ts`, `defense-goo.css`.
 */
/** Four principles, one material: the beads gather and merge into one as the section scrolls in. */
export function DefensePrinciples() {
  const reduceMotion = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const ref = useRef<HTMLElement>(null);
  const pass = useScrollProgress(ref, "pass", !reduceMotion);
  const converge = reduceMotion ? 0.62 : Math.min(1, Math.max(0, (pass - 0.25) / 0.6)) * 0.62;
  const beads: GooBead[] = PRINCIPLE_BEADS.map((b, i) => ({ id: b.id, x: 140 + i * 240, y: 150, r: 62, color: b.color, label: b.label }));
  return (
    <section ref={ref} className="defense-section dgoo-merge" aria-labelledby="defense-principles-title" style={{ "--merge": converge / 0.62 } as CSSProperties}>
      <div className="defense-section__head">
        <h2 id="defense-principles-title" className="defense-h2">
          {DEFENSE_PRINCIPLES_HEADING.title}
        </h2>
        <p className="defense-lede">{DEFENSE_PRINCIPLES_HEADING.intro}</p>
      </div>
      <GooStage
        width={1000}
        height={300}
        beads={beads}
        converge={converge}
        scheme={resolvedTheme === "light" ? "light" : "dark"}
        reduceMotion={reduceMotion}
        goo={70}
        edge={50}
        reach={0.18}
        glow={resolvedTheme === "light" ? 0.25 : 0.5}
        className="dgoo-merge__stage"
        ariaLabel="Four principles merging into one app."
      >
        <span aria-hidden className="dgoo-merge__one">
          One app
        </span>
      </GooStage>
      <ul className="defense-cards">
        {DEFENSE_PRINCIPLES.map((p, i) => (
          <li key={p.id} className="defense-card" style={{ "--energy": PRINCIPLE_BEADS[i]?.color } as CSSProperties}>
            <span aria-hidden className="defense-card__dot" />
            <h3 className="defense-card__title">{p.title}</h3>
            <p className="defense-card__body">{p.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DefenseFits() {
  return (
    <section className="defense-section" aria-labelledby="defense-fits-title">
      <div className="defense-section__head">
        <h2 id="defense-fits-title" className="defense-h2">
          {DEFENSE_USE_CASES.title}
        </h2>
        <p className="defense-lede">{DEFENSE_USE_CASES.intro}</p>
      </div>
      <ul className="defense-cards defense-cards--three">
        {DEFENSE_USE_CASES.items.map((u) => (
          <li key={u.id} className="defense-card">
            <h3 className="defense-card__title">{u.title}</h3>
            <p className="defense-card__body">{u.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DefenseBuilt() {
  return (
    <section className="defense-section" aria-labelledby="defense-built-title">
      <div className="defense-split">
        <div className="defense-panel">
          <h2 id="defense-built-title" className="defense-h2 defense-h2--sm">
            {DEFENSE_BUILT_TODAY.title}
          </h2>
          <p className="defense-lede">{DEFENSE_BUILT_TODAY.intro}</p>
          <ul className="defense-checks">
            {DEFENSE_BUILT_TODAY.items.map((item) => (
              <li key={item}>
                <span aria-hidden className="defense-check" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="defense-panel defense-panel--roadmap">
          <span className="defense-badge" data-status="roadmap">
            {DEFENSE_ROADMAP.badge}
          </span>
          <h2 className="defense-h2 defense-h2--sm">{DEFENSE_ROADMAP.title}</h2>
          <p className="defense-lede">{DEFENSE_ROADMAP.intro}</p>
          <ul className="defense-roadmap">
            {DEFENSE_ROADMAP.items.map((item) => (
              <li key={item.id}>
                <h3 className="defense-card__title">{item.title}</h3>
                <p className="defense-card__body">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function DefenseGovernment() {
  return (
    <section className="defense-section defense-gov" aria-labelledby="defense-gov-title">
      <div className="defense-gov__card">
        <h2 id="defense-gov-title" className="defense-h2 defense-h2--sm">
          {DEFENSE_WORKING_WITH_US.title}
        </h2>
        <p className="defense-gov__body">{DEFENSE_WORKING_WITH_US.body}</p>
        <div className="defense-hero__ctas">
          <JokuhButton href={DEFENSE_WORKING_WITH_US.buttonHref} variant="primary">
            {DEFENSE_WORKING_WITH_US.buttonLabel}
          </JokuhButton>
          <JokuhButton href="/defense/capability-statement.pdf" variant="secondary" download>
            Capability statement (PDF)
          </JokuhButton>
        </div>
      </div>
      <div className="defense-close">
        <ClosingBead />
        <p className="defense-close__headline">{DEFENSE_CLOSING.headline}</p>
        <p className="defense-close__sig" aria-label={DEFENSE_SIGNATURE_TEXT}>
          <strong>{DEFENSE_CLOSING.signature.wordmark}</strong>
          <span aria-hidden> · </span>
          {DEFENSE_CLOSING.signature.words.join(" ")}
        </p>
        <nav className="defense-close__links" aria-label="Related">
          {DEFENSE_DOC_FOOTER_LINKS.map((l) => (
            <SiteLink key={l.href} href={l.href}>
              {l.label}
            </SiteLink>
          ))}
        </nav>
      </div>
    </section>
  );
}

const CLOSE_BEADS: GooBead[] = [
  { id: "talk", x: 300, y: 160, r: 104, color: "var(--color-purple-4)", label: DEFENSE_CLOSING.buttonLabel },
  { id: "s1", x: 150, y: 92, r: 22, color: "var(--color-red-4)" },
  { id: "s2", x: 458, y: 96, r: 18, color: "var(--color-yellow-4)" },
  { id: "s3", x: 430, y: 262, r: 24, color: "var(--color-green-4)" },
];
const CLOSE_LINKS: GooLink[] = [
  { a: "talk", b: "s1", w: 10 },
  { a: "talk", b: "s2", w: 8 },
  { a: "talk", b: "s3", w: 10 },
];

/** The last call as a goo bead: it leans toward the cursor, its drops tug on their necks; tap opens Contact. */
function ClosingBead() {
  const reduceMotion = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  return (
    <GooStage
      width={600}
      height={320}
      beads={CLOSE_BEADS}
      links={CLOSE_LINKS}
      onPick={(id) => {
        if (id === "talk") navigate(DEFENSE_CLOSING.buttonHref);
      }}
      scheme={resolvedTheme === "light" ? "light" : "dark"}
      reduceMotion={reduceMotion}
      goo={60}
      edge={50}
      reach={0.35}
      glow={resolvedTheme === "light" ? 0.3 : 0.6}
      className="dgoo-close__stage"
      ariaLabel="Talk to our team"
    />
  );
}
