/**
 * **Purpose:** The embedded "recording" for the agent-court concept, built from real Jokuh art so it reads as the app:
 * left, a Text-sheet conversation with OO (gooey `MessageBubble` / `IncomingMessageBubble`, gooey `OO` mascot);
 * right, an OOpolis view — Queen OO (white "yang") with your hired agent as a baby (villain pixel avatar, round with an
 * origin rim), status chips + hive speech bubbles (OOpolis copy style), and five hive "enclave" cells that act as the
 * GenLayer validators (ping while reviewing, green when they agree). Pure view of `step`.
 * **Concept only:** agent deals + GenLayer verdicts are not in the app yet; cards are proposed UI, labelled on the page.
 * **Parity (look, not code):** jokuh-live web `components/sheets/TextSheet.tsx` (thread), `agents/oopolis/oopolis.css`
 * (chips, cards, round avatar), `agents/oopolis/OopolisHiveBackdrop.tsx` (enclave palette).
 * **Connects to:** `AgentCourtAppShell.tsx`, `agent-court-steps.ts`, `styles/agent-court-concept.css`.
 */
import { IncomingMessageBubble, MessageBubble, OO, cn } from "@jokuh/gooey";
import { useEffect, useRef, type ReactNode } from "react";

/** Pixel, the design agent — one of the house villain avatars. */
const PIXEL_AVATAR = "/villains/villain-0042.png";

type AgentState = "working" | "needsYou" | "resting" | "sleeping";

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

/** Queen OO — the user's OO in OOpolis ("yang": white body, black eyes). */
function QueenOO({ size = 1 }: { size?: number }) {
  return (
    <span className="agent-court__oo" style={{ transform: `scale(${size})` }} aria-hidden>
      <OO
        backgroundColor="transparent"
        borderColor="transparent"
        bodyGradientStart="#ffffff"
        bodyGradientEnd="#e9e9e9"
        bodyStrokeColor="rgba(0,0,0,0.12)"
        eyeColor="#000000"
      />
    </span>
  );
}

function PixelAvatar({ size }: { size: number }) {
  return (
    <span className="agent-court__villain" style={{ width: size, height: size }} aria-hidden>
      <img src={PIXEL_AVATAR} alt="" width={size} height={size} />
    </span>
  );
}

function StateChip({ state, label }: { state: AgentState; label: string }) {
  return (
    <span className="agent-court__chip" data-state={state}>
      <span className="agent-court__chip-dot" aria-hidden />
      {label}
    </span>
  );
}

/** What OOpolis shows per step: Queen + Pixel bubbles, Pixel's state, validator cells. */
const CITY: Array<{
  queen?: string;
  pixel?: string;
  pixelState: AgentState;
  pixelLabel: string;
  cells: "idle" | "reviewing" | "agreed";
}> = [
  { queen: "Finding a designer", pixelState: "sleeping", pixelLabel: "Not hired", cells: "idle" },
  { queen: "Found Pixel", pixel: "Deal?", pixelState: "needsYou", pixelLabel: "Waiting on you", cells: "idle" },
  { queen: "$40 held", pixel: "Drawing", pixelState: "working", pixelLabel: "Working", cells: "idle" },
  { pixel: "Delivered", pixelState: "resting", pixelLabel: "Done", cells: "idle" },
  { queen: "Opening a review", pixelState: "needsYou", pixelLabel: "In review", cells: "idle" },
  { queen: "Reviewers reading", pixelState: "needsYou", pixelLabel: "In review", cells: "reviewing" },
  { queen: "$28 / $12", pixel: "Fair", pixelState: "resting", pixelLabel: "Settled", cells: "agreed" },
  { queen: "Saved to Spine", pixelState: "resting", pixelLabel: "Settled", cells: "agreed" },
];

/** Hex cell centres (du) for the small honeycomb behind the city; five marked as validators. */
const HEX = (() => {
  const cells: Array<{ x: number; y: number; v: boolean }> = [];
  const w = 30;
  const h = 26;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 12; c++) {
      cells.push({ x: c * w + (r % 2 ? w / 2 : 0) + 10, y: r * h + 10, v: false });
    }
  }
  // Validators: a short arc under the Queen.
  for (const idx of [76, 77, 78, 79, 80]) cells[idx]!.v = true;
  return cells;
})();

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

function AgentCourtCity({ step }: { step: number }) {
  const scene = CITY[Math.min(step, CITY.length - 1)]!;
  let validator = 0;
  return (
    <div className="agent-court__city" aria-hidden>
      <svg className="agent-court__hive" viewBox="0 0 370 230" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="agent-court-enclave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#121212" />
            <stop offset="1" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
        {HEX.map((cell, i) => {
          const n = cell.v ? validator++ : -1;
          return (
            <g key={i} className={cn("agent-court__cell", cell.v && "is-validator", cell.v && `is-${scene.cells}`)}>
              <polygon points={hexPoints(cell.x, cell.y, 14)} fill="url(#agent-court-enclave)" />
              {cell.v ? <circle cx={cell.x} cy={cell.y} r={3.2} style={{ animationDelay: `${n * 180}ms` }} /> : null}
            </g>
          );
        })}
      </svg>

      <div className="agent-court__city-hud">
        <span className="agent-court__city-title">OOpolis</span>
        <StateChip state={scene.pixelState} label={`Pixel · ${scene.pixelLabel}`} />
      </div>

      <div className="agent-court__queen">
        {scene.queen ? (
          <span key={scene.queen} className="agent-court__bubble">
            {scene.queen}
          </span>
        ) : null}
        <QueenOO size={1.35} />
        <span className="agent-court__name">Your OO</span>
      </div>

      <div className={cn("agent-court__baby", scene.pixelState === "sleeping" && "is-asleep")} data-state={scene.pixelState}>
        {scene.pixel ? (
          <span key={scene.pixel} className="agent-court__bubble agent-court__bubble--small">
            {scene.pixel}
          </span>
        ) : null}
        <PixelAvatar size={34} />
        <span className="agent-court__name">Pixel</span>
      </div>

      <p className="agent-court__validators-label">
        {scene.cells === "agreed" ? "GenLayer validators agreed" : scene.cells === "reviewing" ? "GenLayer validators voting" : "GenLayer validators"}
      </p>
    </div>
  );
}

function AgentCourtThread({ step, reduceMotion }: { step: number; reduceMotion: boolean }) {
  const threadRef = useRef<HTMLDivElement>(null);

  // Keep the newest row in view, like a real thread. Waits out the row expand (420ms) so scrollHeight is final.
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    const id = window.setTimeout(
      // Hidden tabs run no animation frames, so a smooth scroll there would never move.
      () =>
        el.scrollTo({
          top: step === 0 ? 0 : el.scrollHeight,
          behavior: reduceMotion || document.hidden ? "auto" : "smooth",
        }),
      reduceMotion ? 0 : 440,
    );
    return () => window.clearTimeout(id);
  }, [step, reduceMotion]);

  const at = (n: number) => step >= n;

  return (
    <div className="agent-court__chat" aria-hidden>
      <header className="agent-court__chat-head">
        <span className="agent-court__chat-avatar">
          <QueenOO size={0.86} />
        </span>
        <span className="agent-court__chat-who">
          <span className="agent-court__chat-name">OO</span>
          <span className="agent-court__chat-sub">End-to-end encrypted</span>
        </span>
      </header>

      <div className="agent-court__thread" ref={threadRef}>
        <Row show={at(0)} side="out">
          <MessageBubble message="Get a design agent to make my launch poster. $40 max, due by 6." color="aether" showTime={false} />
        </Row>

        <Row show={at(1)} side="in">
          <IncomingMessageBubble name="OO" message="Found Pixel. Here's the deal. Nothing is paid until it's delivered." showTime={false} />
        </Row>

        <Row show={at(1)} side="card">
          <section className="agent-court__card">
            <div className="agent-court__card-top">
              <span className="agent-court__card-id">
                <PixelAvatar size={28} />
                <span>
                  <span className="agent-court__card-title">Pixel</span>
                  <span className="agent-court__card-sub">Design agent</span>
                </span>
              </span>
              <GenLayerBadge />
            </div>
            <ul className="agent-court__terms">
              <li>Launch poster, 1080 × 1350</li>
              <li>Brand colors and the Jokuh logo</li>
              <li>Two rounds of changes, due 6:00 PM</li>
            </ul>
            <div className={cn("agent-court__escrow", at(2) && "is-locked")}>
              <span className="agent-court__lock" aria-hidden />
              <span>{at(2) ? "$40 held in escrow" : "$40 to hold"}</span>
            </div>
          </section>
        </Row>

        <Row show={at(3)} side="in">
          <IncomingMessageBubble name="Pixel" message="Done. Here's your poster." showTime={false} />
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

        <Row show={at(6)} side="card">
          <section className="agent-court__card">
            <div className="agent-court__card-top">
              <span className="agent-court__card-title">Verdict</span>
              <GenLayerBadge />
            </div>
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
            <span className="agent-court__receipt">Wallet · +$12 refunded</span>
            <span className="agent-court__receipt agent-court__receipt--spine">Spine · Poster deal settled</span>
          </div>
        </Row>
      </div>
    </div>
  );
}

/** Chat + OOpolis side by side on a wide page; stacked on a phone. */
export function AgentCourtStage({ step, reduceMotion }: { step: number; reduceMotion: boolean }) {
  return (
    <div className="agent-court__stage" role="img" aria-label="Concept animation: OO hires a design agent, and GenLayer settles the dispute">
      <AgentCourtThread step={step} reduceMotion={reduceMotion} />
      <AgentCourtCity step={step} />
    </div>
  );
}
