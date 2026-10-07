/**
 * **Purpose:** `/concepts/agent-court` as the app itself, built from the `/defense` parts: full-bleed scene
 * (`ConsoleStage`), the four corner pills + Nexus (`ImmersiveAppChrome`), and one center column holding a Jokuh Docs
 * sheet (`DefenseDocSheet`) whose doc embeds the animated OO thread. Each step lights its corner (Nexus for OO) and
 * the scene follows. Wide screens add the steps (left) and "what GenLayer does" for the current step (right).
 * Reduced motion: every step shown, no auto-play.
 * **Connects to:** `pages/AgentCourtConceptPage.tsx`, `agent-court-steps.ts`, `AgentCourtDemo.tsx`,
 * `landing-console-home.css` + `defense-app.css` (shell, doc, gutters, auto-play bar), `agent-court-concept.css`.
 */
import { GooeyViewportProvider, cn, useTheme } from "@jokuh/gooey";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { CONSOLE_PRODUCTS, type ConsoleProductId } from "../../data/console-home-products";
import { DefenseDocSheet } from "../defense/DefenseDocSheet";
import { ConsoleStage, useConsoleParallax } from "../landing/console/ConsoleScene";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { AgentCourtThread } from "./AgentCourtDemo";
import { AGENT_COURT_STEPS } from "./agent-court-steps";

const STAGE_PRODUCTS = CONSOLE_PRODUCTS.filter((p) =>
  (["oo", "spine", "messages"] as ConsoleProductId[]).includes(p.id),
);
const LAST = AGENT_COURT_STEPS.length - 1;
const LOOP_HOLD_MS = 2600;

export function AgentCourtAppShell() {
  return (
    <GooeyViewportProvider>
      <AgentCourtAppShellInner />
    </GooeyViewportProvider>
  );
}

/** Steps through the thread; loops after a hold on the last step; pauses while the tab is hidden. */
function useAgentCourtPlayer(enabled: boolean) {
  const [step, setStep] = useState(enabled ? 0 : LAST);
  const [playing, setPlaying] = useState(enabled);
  const [hidden, setHidden] = useState(typeof document !== "undefined" && document.hidden);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!playing || hidden) return;
    const current = AGENT_COURT_STEPS[step]!;
    const wait = current.dwellMs + (step === LAST ? LOOP_HOLD_MS : 0);
    const id = window.setTimeout(() => {
      setStep((s) => (s >= LAST ? 0 : s + 1));
      setRunKey((k) => k + 1);
    }, wait);
    return () => window.clearTimeout(id);
  }, [playing, hidden, step, runKey]);

  const goTo = useCallback((index: number) => {
    setStep(index);
    setPlaying(false);
    setRunKey((k) => k + 1);
  }, []);
  const toggle = useCallback(() => {
    setPlaying((p) => !p);
    setRunKey((k) => k + 1);
  }, []);

  return { step, playing, hidden, runKey, goTo, toggle };
}

function AgentCourtAppShellInner() {
  const reduceMotion = useReducedMotion() ?? false;
  const parallax = useConsoleParallax(reduceMotion);
  const { resolvedTheme } = useTheme();
  const light = resolvedTheme === "light";
  const player = useAgentCourtPlayer(!reduceMotion);
  const current = AGENT_COURT_STEPS[player.step]!;
  const running = player.playing && !player.hidden;

  const progressStyle = useMemo(() => ({ "--dwell": `${current.dwellMs}ms` }) as CSSProperties, [current.dwellMs]);

  return (
    <section className="console-home defense-app agent-court-app" aria-label="Agent agreements on GenLayer" data-playing={running ? "true" : "false"}>
      <ConsoleStage products={STAGE_PRODUCTS} activeId={current.stage} reduceMotion={reduceMotion} light={light} parallax={parallax} />

      <div className="defense-column-wrap">
        <div className="defense-column">
          <DefenseDocSheet
            onReplay={() => player.goTo(0)}
            sharePath="/concepts/agent-court"
            shareTitle="Agent agreements, settled by GenLayer"
            menuLinks={[{ label: "Talk to our team", href: "/contact" }]}
          >
            <div className="jd-root defense-doc" data-theme={light ? "light" : "dark"} data-surface="host">
              <div className="jd-scroll defense-doc__scroll" tabIndex={-1}>
                <article className="jd-paper">
                  <div className="jd-inner">
                    <section className="defense-stop defense-hero" data-active="true">
                      <span className="jd-emoji" aria-hidden>
                        ⚖️
                      </span>
                      <h1 className="jd-title">Agent agreements, settled by GenLayer</h1>
                      <p className="jd-meta">Concept · not in the app yet · Jokuh × GenLayer</p>
                      <div className="jd-body jd-prose">
                        <figure className="defense-block agent-court-block" data-active="true">
                          <AgentCourtThread step={player.step} reduceMotion={reduceMotion} />
                          <figcaption className="defense-media__caption">
                            Concept animation. The chat is Jokuh's real message UI; the deal cards are proposed.
                          </figcaption>
                        </figure>
                        <p className="defense-lede">
                          Your OO can hire another agent and pay it. If the work isn't what you agreed, GenLayer
                          settles it: independent AI reviewers read the deal and decide. Jokuh never reads your data,
                          and we don't pick the winner.
                        </p>
                      </div>
                    </section>

                    <div className="jd-prose defense-prose">
                      <section className="defense-stop">
                        <h2>How it works</h2>
                        <ol className="agent-court-doc-steps">
                          {AGENT_COURT_STEPS.map((s, i) => (
                            <li key={s.title}>
                              <button
                                type="button"
                                className={cn("agent-court-doc-step", i === player.step && "is-current")}
                                aria-current={i === player.step ? "step" : undefined}
                                onClick={() => player.goTo(i)}
                              >
                                <span className="defense-step__num" aria-hidden>
                                  {i + 1}
                                </span>
                                <span className="agent-court-doc-step__body">
                                  <strong>{s.title}.</strong> {s.plain}
                                  <span className="agent-court-doc-step__layer">GenLayer: {s.layer}</span>
                                </span>
                              </button>
                            </li>
                          ))}
                        </ol>
                      </section>

                      <section className="defense-stop">
                        <h2>What stays private</h2>
                        <div className="defense-callout">
                          <p className="defense-callout__label">Never leaves your Spine</p>
                          <p>Your memories, chats, files and contacts stay end-to-end encrypted. A dispute sends only the agreement and the evidence you choose.</p>
                        </div>
                      </section>

                      <section className="defense-stop">
                        <h2>What's real today</h2>
                        <p>
                          OO, encrypted chats, the Wallet and the Spine are live in Jokuh. Agent agreements, escrow and
                          GenLayer verdicts are what we're building in the GenLayer accelerator.
                        </p>
                      </section>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </DefenseDocSheet>
        </div>
      </div>

      <nav className="defense-gutter defense-gutter--left" aria-label="Steps">
        <p className="defense-gutter__eyebrow">How it works</p>
        <ol className="defense-toc">
          {AGENT_COURT_STEPS.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                className="defense-toc__item"
                aria-current={i === player.step ? "step" : undefined}
                onClick={() => player.goTo(i)}
              >
                <span aria-hidden className="defense-toc__dot" />
                {s.title}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <aside className="defense-gutter defense-gutter--right" aria-label="What GenLayer does">
        <p className="defense-gutter__eyebrow">What GenLayer does</p>
        <p className="agent-court-gutter__layer" aria-live="polite">
          {current.layer}
        </p>
        <p className="defense-gutter__now">{current.title}</p>
      </aside>

      <ImmersiveAppChrome
        showLibraryRail={false}
        highlightAction={current.corner ?? null}
        highlightNexus={!current.corner}
        bottomCenter={
          reduceMotion ? null : (
            <div className="defense-autoplay" style={progressStyle}>
              <button type="button" className="defense-autoplay__toggle" aria-pressed={player.playing} onClick={player.toggle}>
                <span aria-hidden className={cn("defense-autoplay__icon", player.playing && "is-playing")} />
                <span className="defense-autoplay__label">Auto-play</span>
              </button>
              <span
                className="defense-autoplay__track"
                role="progressbar"
                aria-label="Concept progress"
                aria-valuemin={1}
                aria-valuemax={AGENT_COURT_STEPS.length}
                aria-valuenow={player.step + 1}
                aria-valuetext={`${current.title}, ${player.step + 1} of ${AGENT_COURT_STEPS.length}`}
              >
                {AGENT_COURT_STEPS.map((s, i) => (
                  <span
                    key={s.title}
                    className="defense-autoplay__seg"
                    data-state={i < player.step ? "done" : i === player.step ? "now" : "next"}
                  >
                    {i === player.step ? (
                      <span key={player.runKey} className="defense-autoplay__fill" data-running={running ? "true" : "false"} />
                    ) : null}
                  </span>
                ))}
              </span>
            </div>
          )
        }
      />
    </section>
  );
}
