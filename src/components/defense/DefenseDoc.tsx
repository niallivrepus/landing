import { cn } from "@jokuh/gooey";
import { Check } from "lucide-react";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import {
  DEFENSE_BUILT_TODAY,
  DEFENSE_CAPABILITIES,
  DEFENSE_CLOSING,
  DEFENSE_CONNECTED,
  DEFENSE_DOC,
  DEFENSE_DOC_FOOTER_LINKS,
  DEFENSE_HERO,
  DEFENSE_ROADMAP,
  DEFENSE_SIGNATURE_TEXT,
  DEFENSE_SOLUTION,
  DEFENSE_SYSTEM_NODES,
  DEFENSE_USE_CASES,
  DEFENSE_WALKTHROUGH,
  DEFENSE_WORKING_WITH_US,
  type DefenseNodeId,
  type DefenseTrustNodeId,
} from "../../data/defense";
import { JokuhButton } from "../system/JokuhButton";
import { SiteLink } from "../SiteLink";
import { DefenseCapabilities } from "./DefenseCapabilities";
import { DefenseCapture } from "./DefenseCapture";
import { DEFENSE_NODE_ENERGY, DefenseSystemGraph } from "./DefenseSystemGraph";
import { DefenseTrustDiagram } from "./DefenseTrustDiagram";

/**
 * **Purpose:** The `/defense` page's content, written as a Jokuh Doc: the `jokuh-doc-page` writing surface (emoji
 * icon, title, meta line, prose — headings, paragraphs, lists, callouts) with real-app recordings and the animated
 * diagrams embedded as blocks, the way images sit in a Doc. Every section is a `data-stop` the auto-play walks
 * through; `activeStop` lights that section (highlighted phrase, playing recording, pulsing diagram).
 * Copy and accuracy rules: `data/defense.ts`.
 * **Connects to:** `DefenseDocSheet` (paper card + header), `useDefenseAutoplay` (stops), `DefenseCapture`,
 * `DefenseSystemGraph`, `DefenseTrustDiagram`, `DefenseCapabilities`. Styles: `defense-app.css` (port of the web app's
 * `docs/jokuh-doc-page.css`). **Parity:** web app `frontend/src/docs/jokuh-doc-page.ts` (read-only page).
 */

export type DefenseDocProps = {
  activeStop: string;
  /** Auto-play is running (recordings play while their section is active). */
  playing: boolean;
  /** The tab is hidden: recordings pause. */
  pageHidden: boolean;
  light: boolean;
  reduceMotion: boolean;
  onTrustFocus: (id: DefenseTrustNodeId | null) => void;
  onCapabilityFocus: (node: DefenseNodeId | null) => void;
};

function Stop({ id, activeStop, children, className }: { id: string; activeStop: string; children: ReactNode; className?: string }) {
  return (
    <section data-stop={id} data-active={activeStop === id ? "true" : "false"} className={cn("defense-stop", className)}>
      {children}
    </section>
  );
}

/** Body copy with one phrase marked — the doc's highlighter sweeps across it while the section plays. */
function Marked({ text, mark }: { text: string; mark: string }) {
  const at = text.indexOf(mark);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="defense-mark">{mark}</mark>
      {text.slice(at + mark.length)}
    </>
  );
}

function NodePath({ nodes }: { nodes: readonly DefenseNodeId[] }) {
  return (
    <p className="defense-path" aria-label={`Connects ${nodes.map((n) => DEFENSE_SYSTEM_NODES[n].label).join(", ")}`}>
      {nodes.map((node, i) => (
        <span key={node} className="defense-path__item">
          {i > 0 ? <span aria-hidden className="defense-path__arrow">→</span> : null}
          <span className="defense-path__chip" style={{ "--energy": DEFENSE_NODE_ENERGY[node] } as CSSProperties}>
            <span aria-hidden className="defense-path__dot" />
            {DEFENSE_SYSTEM_NODES[node].label}
          </span>
        </span>
      ))}
    </p>
  );
}

function NameSignature() {
  const { wordmark, words } = DEFENSE_CLOSING.signature;
  return (
    <p className="defense-signature">
      <span className="sr-only">{DEFENSE_SIGNATURE_TEXT}</span>
      <span aria-hidden>
        <span className="defense-signature__wordmark">{wordmark}</span>
        {": "}
        {words.map((word, index) => (
          <span key={word}>
            <span className="defense-signature__initial">{word.charAt(0)}</span>
            {word.slice(1)}
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </p>
  );
}

export const DefenseDoc = forwardRef<HTMLDivElement, DefenseDocProps>(function DefenseDoc(
  { activeStop, playing, pageHidden, light, reduceMotion, onTrustFocus, onCapabilityFocus },
  scrollerRef,
) {
  return (
    <div className="jd-root defense-doc" data-theme={light ? "light" : "dark"} data-surface="host">
      <div ref={scrollerRef} className="jd-scroll defense-doc__scroll" data-defense-scroller tabIndex={-1}>
        <article className="jd-paper">
          <div className="jd-inner">
            {/* ── Hero ── */}
            <Stop id="hero" activeStop={activeStop} className="defense-hero">
              <span className="jd-emoji" aria-hidden>
                {DEFENSE_DOC.icon}
              </span>
              <h1 className="jd-title">{DEFENSE_HERO.title}</h1>
              <p className="jd-meta">{DEFENSE_DOC.meta}</p>
              <div className="jd-body jd-prose">
                <p className="defense-lede">{DEFENSE_HERO.subtitle}</p>
                <div className="defense-actions">
                  <JokuhButton href={DEFENSE_HERO.primary.href} variant="primary" size="md">
                    {DEFENSE_HERO.primary.label}
                  </JokuhButton>
                  <JokuhButton href={DEFENSE_HERO.secondary.href} variant="secondary" size="md">
                    {DEFENSE_HERO.secondary.label}
                  </JokuhButton>
                </div>
                <figure className="defense-block defense-block--graph" data-active={activeStop === "hero" ? "true" : "false"}>
                  <DefenseSystemGraph
                    reduceMotion={reduceMotion}
                    tour={activeStop === "hero"}
                    title="Diagram of how Jokuh connects: identity at the centre, linked to messages, calls, Bubbles, Spine, Docs and OO."
                  />
                  <figcaption className="defense-media__caption">{DEFENSE_DOC.heroDiagramCaption}</figcaption>
                </figure>
              </div>
            </Stop>

            <div className="jd-prose defense-prose">
              {/* ── What we're building ── */}
              <Stop id="build" activeStop={activeStop}>
                <h2 id="defense-solution">{DEFENSE_SOLUTION.title}</h2>
                {[DEFENSE_SOLUTION.problem, DEFENSE_SOLUTION.solution].map((block) => (
                  <div key={block.label} className="defense-callout">
                    <p className="defense-callout__label">{block.label}</p>
                    <p>{block.body}</p>
                  </div>
                ))}
              </Stop>

              {/* ── See it work ── */}
              <div className="defense-walkthrough">
                <h2 id="defense-walkthrough">{DEFENSE_WALKTHROUGH.title}</h2>
                <p className="defense-label">{DEFENSE_WALKTHROUGH.label}</p>
                <p>{DEFENSE_WALKTHROUGH.intro}</p>
                {DEFENSE_WALKTHROUGH.steps.map((step) => {
                  const id = `step-${step.id}`;
                  const active = activeStop === id;
                  return (
                    <Stop key={step.id} id={id} activeStop={activeStop} className="defense-step">
                      <h3>
                        <span className="defense-step__num" aria-hidden>
                          {step.number}
                        </span>
                        {step.title}
                      </h3>
                      <p>
                        <Marked text={step.body} mark={step.mark} />
                      </p>
                      <DefenseCapture
                        surfaces={step.captures}
                        active={active}
                        playing={active && !reduceMotion && !pageHidden}
                        light={light}
                        energy={DEFENSE_NODE_ENERGY[step.node]}
                        reduceMotion={reduceMotion}
                        switchAfterMs={3400}
                        label={DEFENSE_WALKTHROUGH.captureCaption}
                      />
                      <NodePath nodes={step.path} />
                    </Stop>
                  );
                })}
              </div>

              {/* ── How it's connected ── */}
              <Stop id="connected" activeStop={activeStop}>
                <h2 id="defense-connected">{DEFENSE_CONNECTED.title}</h2>
                <p>{DEFENSE_CONNECTED.intro}</p>
                <div className="defense-block">
                  <DefenseTrustDiagram
                    touring={activeStop === "connected" && playing}
                    reduceMotion={reduceMotion}
                    onFocusChange={onTrustFocus}
                  />
                </div>
              </Stop>

              {/* ── At a glance ── */}
              <Stop id="capabilities" activeStop={activeStop}>
                <h2 id="defense-capabilities">{DEFENSE_CAPABILITIES.title}</h2>
                <p>{DEFENSE_CAPABILITIES.intro}</p>
                <DefenseCapabilities
                  touring={activeStop === "capabilities" && playing}
                  light={light}
                  onFocusChange={onCapabilityFocus}
                />
              </Stop>

              {/* ── Where it fits ── */}
              <Stop id="fits" activeStop={activeStop}>
                <h2 id="defense-use-cases">{DEFENSE_USE_CASES.title}</h2>
                <p>{DEFENSE_USE_CASES.intro}</p>
                <ul>
                  {DEFENSE_USE_CASES.items.map((item) => (
                    <li key={item.id}>
                      <strong>{item.title}.</strong> {item.body}
                    </li>
                  ))}
                </ul>
              </Stop>

              {/* ── Built today + roadmap ── */}
              <Stop id="built" activeStop={activeStop}>
                <h2 id="defense-built">{DEFENSE_BUILT_TODAY.title}</h2>
                <p>{DEFENSE_BUILT_TODAY.intro}</p>
                <ul className="defense-checks">
                  {DEFENSE_BUILT_TODAY.items.map((item) => (
                    <li key={item}>
                      <Check aria-hidden className="defense-checks__icon" strokeWidth={2.4} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="defense-roadmap">
                  <p className="defense-label defense-label--dashed">{DEFENSE_ROADMAP.badge}</p>
                  <h2 id="defense-roadmap">{DEFENSE_ROADMAP.title}</h2>
                  <p>{DEFENSE_ROADMAP.intro}</p>
                  {DEFENSE_ROADMAP.items.map((item) => (
                    <div key={item.id} className="defense-callout defense-callout--dashed">
                      <p className="defense-callout__title">{item.title}</p>
                      <p>{item.body}</p>
                    </div>
                  ))}
                </div>
              </Stop>

              {/* ── Working with government ── */}
              <Stop id="government" activeStop={activeStop}>
                <h2 id="defense-working">{DEFENSE_WORKING_WITH_US.title}</h2>
                <p>{DEFENSE_WORKING_WITH_US.body}</p>
                <div className="defense-actions">
                  <JokuhButton href={DEFENSE_WORKING_WITH_US.buttonHref} variant="secondary" size="md">
                    {DEFENSE_WORKING_WITH_US.buttonLabel}
                  </JokuhButton>
                </div>
              </Stop>

              {/* ── Closing ── */}
              <Stop id="closing" activeStop={activeStop}>
                <div className="defense-closing">
                  <h2>{DEFENSE_CLOSING.headline}</h2>
                  <div className="defense-actions defense-actions--center">
                    <JokuhButton href={DEFENSE_CLOSING.buttonHref} variant="primary" size="lg">
                      {DEFENSE_CLOSING.buttonLabel}
                    </JokuhButton>
                  </div>
                  <NameSignature />
                </div>
                <nav className="defense-doc-footer" aria-label="More from Jokuh">
                  {DEFENSE_DOC_FOOTER_LINKS.map((link) => (
                    <SiteLink key={link.href} href={link.href}>
                      {link.label}
                    </SiteLink>
                  ))}
                </nav>
              </Stop>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
});
