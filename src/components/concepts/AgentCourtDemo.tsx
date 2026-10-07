/**
 * **Purpose:** The animated OO thread for the agent-court concept: ask → agreement → escrow → delivery → dispute →
 * validator review → verdict → receipt + Spine memory. Pure view of `step`; `useAgentCourtPlayer` drives it.
 * **Concept only:** none of this is in the app yet; the page says so. Bubbles are the real `@jokuh/gooey` message
 * components; the agreement / review / verdict cards are proposed UI.
 * **Connects to:** `AgentCourtAppShell.tsx` (Docs sheet + corner chrome), `agent-court-steps.ts`,
 * `styles/agent-court-concept.css`.
 */
import { IncomingMessageBubble, MessageBubble, cn } from "@jokuh/gooey";
import { useEffect, useRef, type ReactNode } from "react";

/** One thread row that fades and lifts in once its step is reached. */
function Row({ show, side, children }: { show: boolean; side: "in" | "out" | "card"; children: ReactNode }) {
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

export function AgentCourtThread({ step, reduceMotion }: { step: number; reduceMotion: boolean }) {
  const threadRef = useRef<HTMLDivElement>(null);

  // Keep the newest row in view, like a real thread. Waits out the row expand (420ms) so scrollHeight is final.
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    const id = window.setTimeout(
      () => el.scrollTo({ top: step === 0 ? 0 : el.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" }),
      reduceMotion ? 0 : 440,
    );
    return () => window.clearTimeout(id);
  }, [step, reduceMotion]);

  const at = (n: number) => step >= n;

  return (
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
          <MessageBubble message="Get a design agent to make my launch poster. $40 max, due by 6." color="aether" showTime={false} />
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
            <div className={cn("agent-court__validators", step === 5 && "is-reviewing", at(6) && "is-done")}>
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
          <section className="agent-court__card">
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
  );
}
