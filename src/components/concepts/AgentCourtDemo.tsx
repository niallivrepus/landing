/**
 * **Purpose:** Animated concept of agent-to-agent agreements settled by GenLayer, shown as an OO chat thread:
 * ask → agreement → escrow → delivery → dispute → validator review → verdict → receipt + Spine memory.
 * **Concept only:** none of this is in the app yet; the page says so on screen. Bubbles are the real
 * `@jokuh/gooey` message components; the agreement / review / verdict cards are proposed UI.
 * **Connects to:** `pages/AgentCourtConceptPage.tsx`, `styles/agent-court-concept.css`.
 */
import { IncomingMessageBubble, MessageBubble, cn } from "@jokuh/gooey";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type Step = {
  title: string;
  /** What the person sees. */
  plain: string;
  /** What GenLayer is doing underneath. */
  layer: string;
};

const STEPS: Step[] = [
  {
    title: "Ask",
    plain: "You tell OO what you want and what you'll pay.",
    layer: "Nothing on-chain yet. OO drafts terms from your request.",
  },
  {
    title: "Agree",
    plain: "OO finds a design agent and shows you the deal in plain English.",
    layer: "Both sides sign. The terms become an Intelligent Contract on GenLayer, written in natural language.",
  },
  {
    title: "Escrow",
    plain: "Your $40 is held, not paid. Nobody can spend it yet.",
    layer: "Funds lock in the contract until it reaches a verdict.",
  },
  {
    title: "Deliver",
    plain: "The agent sends the work back in the same chat.",
    layer: "The delivery is submitted to the contract as evidence.",
  },
  {
    title: "Dispute",
    plain: "It's not what you asked for, so you say so. That's it.",
    layer: "OO files the dispute. Only the agreement and the files you chose go out; your Spine and chats stay encrypted.",
  },
  {
    title: "Review",
    plain: "Independent AI reviewers read the deal and the work.",
    layer: "Validators each run their own model and vote (Optimistic Democracy). Either side can appeal.",
  },
  {
    title: "Verdict",
    plain: "A fair split, decided by nobody who works for either side.",
    layer: "The contract pays out per the verdict: part to the agent, the rest back to you.",
  },
  {
    title: "Remember",
    plain: "The refund lands in your Wallet and the deal is saved to your Spine.",
    layer: "Receipt is on-chain; the memory stays private to you.",
  },
];

const STEP_MS = 2800;
const END_HOLD_MS = 4200;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** One thread row that fades and lifts in once its step is reached. */
function Row({
  show,
  side,
  children,
}: {
  show: boolean;
  side: "in" | "out" | "card";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "agent-court__row",
        side === "out" && "agent-court__row--out",
        side === "card" && "agent-court__row--card",
        show && "is-shown",
      )}
      aria-hidden={!show}
    >
      {children}
    </div>
  );
}

function GenLayerBadge() {
  return (
    <span className="agent-court__badge">
      <span className="agent-court__badge-dot" aria-hidden />
      Settled by GenLayer
    </span>
  );
}

export function AgentCourtDemo() {
  const reduced = useMemo(prefersReducedMotion, []);
  const [step, setStep] = useState(reduced ? STEPS.length - 1 : 0);
  const [playing, setPlaying] = useState(!reduced);
  const [showLayer, setShowLayer] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const atEnd = step >= STEPS.length - 1;
    const id = window.setTimeout(
      () => setStep((s) => (s >= STEPS.length - 1 ? 0 : s + 1)),
      atEnd ? END_HOLD_MS : STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [playing, step]);

  // Keep the newest row in view inside the phone, like a real thread.
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    // Wait out the row expand transition (420ms) so scrollHeight includes the new rows.
    const id = window.setTimeout(
      () => el.scrollTo({ top: step === 0 ? 0 : el.scrollHeight, behavior: reduced ? "auto" : "smooth" }),
      reduced ? 0 : 440,
    );
    return () => window.clearTimeout(id);
  }, [step, reduced]);

  const at = (n: number) => step >= n;
  const reviewing = step === 5;

  return (
    <div className="agent-court">
      <div className="agent-court__device" role="img" aria-label="Animated concept of an OO chat settling an agent dispute">
        <header className="agent-court__head">
          <span className="agent-court__oo" aria-hidden>
            OO
          </span>
          <div>
            <p className="agent-court__head-name">OO</p>
            <p className="agent-court__head-sub">End-to-end encrypted</p>
          </div>
        </header>

        <div className="agent-court__thread" ref={threadRef}>
          <Row show={at(0)} side="out">
            <MessageBubble
              message="Get a design agent to make my launch poster. $40 max, due by 6."
              color="aether"
              showTime={false}
            />
          </Row>

          <Row show={at(1)} side="in">
            <IncomingMessageBubble
              name="OO"
              message="Found Pixel, a design agent. Here's the deal. Nothing is paid until it's delivered."
              showTime={false}
            />
          </Row>

          <Row show={at(1)} side="card">
            <section className="agent-court__card">
              <div className="agent-court__card-top">
                <p className="agent-court__card-eyebrow">Agreement</p>
                <GenLayerBadge />
              </div>
              <ul className="agent-court__terms">
                <li>Poster for the Jokuh Meet launch, 1080 × 1350</li>
                <li>Brand colors and the Jokuh logo</li>
                <li>Two rounds of changes, due 6:00 PM</li>
              </ul>
              <div className="agent-court__parties">
                <span>You</span>
                <span className="agent-court__parties-line" aria-hidden />
                <span>Pixel (agent)</span>
              </div>
              <div className={cn("agent-court__escrow", at(2) && "is-locked")}>
                <span className="agent-court__lock" aria-hidden />
                <span>{at(2) ? "$40 held in escrow" : "$40 to hold"}</span>
              </div>
            </section>
          </Row>

          <Row show={at(3)} side="in">
            <IncomingMessageBubble name="Pixel (agent)" message="Done. Here's your poster." showTime={false} />
          </Row>
          <Row show={at(3)} side="card">
            <div className="agent-court__poster" aria-hidden>
              <span className="agent-court__poster-title">MEET</span>
              <span className="agent-court__poster-size">1080 × 1080</span>
            </div>
          </Row>

          <Row show={at(4)} side="out">
            <MessageBubble message="It's square, not 1080 × 1350. And there's no logo." color="aether" showTime={false} />
          </Row>
          <Row show={at(4)} side="in">
            <IncomingMessageBubble
              name="OO"
              message="Opened a review. Only the agreement and the poster go out, nothing else from your Spine."
              showTime={false}
            />
          </Row>

          <Row show={at(5)} side="card">
            <section className="agent-court__card">
              <div className="agent-court__card-top">
                <p className="agent-court__card-eyebrow">{at(6) ? "Reviewed" : "Under review"}</p>
                <GenLayerBadge />
              </div>
              <div className={cn("agent-court__validators", reviewing && "is-reviewing", at(6) && "is-done")}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="agent-court__validator" style={{ animationDelay: `${i * 220}ms` }} />
                ))}
              </div>
              <p className="agent-court__muted">
                {at(6) ? "Independent reviewers agreed" : "Independent AI reviewers are reading the deal"}
              </p>
            </section>
          </Row>

          <Row show={at(6)} side="card">
            <section className="agent-court__card agent-court__card--verdict">
              <p className="agent-court__card-eyebrow">Verdict</p>
              <p className="agent-court__verdict">Partly delivered: wrong size, logo missing.</p>
              <div className="agent-court__split" aria-hidden>
                <span className="agent-court__split-agent" />
                <span className="agent-court__split-you" />
              </div>
              <div className="agent-court__split-legend">
                <span>$28 to Pixel</span>
                <span>$12 back to you</span>
              </div>
            </section>
          </Row>

          <Row show={at(7)} side="card">
            <div className="agent-court__receipts">
              <span className="agent-court__chip">Wallet · +$12 refunded</span>
              <span className="agent-court__chip agent-court__chip--spine">Spine · Poster deal settled</span>
            </div>
          </Row>
        </div>
      </div>

      <aside className="agent-court__steps">
        <div className="agent-court__controls">
          <button type="button" className="agent-court__btn" onClick={() => setPlaying((p) => !p)}>
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            className={cn("agent-court__btn", showLayer && "is-on")}
            aria-pressed={showLayer}
            onClick={() => setShowLayer((v) => !v)}
          >
            {showLayer ? "Hide the GenLayer layer" : "Show the GenLayer layer"}
          </button>
        </div>
        <ol className="agent-court__list">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                className={cn("agent-court__step", i === step && "is-current", i < step && "is-past")}
                aria-current={i === step ? "step" : undefined}
                onClick={() => {
                  setStep(i);
                  setPlaying(false);
                }}
              >
                <span className="agent-court__step-num">{i + 1}</span>
                <span className="agent-court__step-body">
                  <span className="agent-court__step-title">{s.title}</span>
                  <span className="agent-court__step-text">{s.plain}</span>
                  {showLayer ? <span className="agent-court__step-layer">{s.layer}</span> : null}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
