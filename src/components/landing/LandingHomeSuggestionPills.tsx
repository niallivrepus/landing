import { useCallback, useEffect, useRef, useState } from "react";
import { LANDING_HOME_SUGGESTIONS, type LandingHomeSuggestion } from "../../data/landing-home-suggestions";
import type { LandingArcadeGameId } from "../../data/landing-arcade-games";
import type { LandingDemoPowerId } from "../../data/landing-demo-powers";

const SCROLL_FADE_EDGE_PX = 36;
const SCROLL_EDGE_EPSILON = 2;

/** **Builds** a horizontal mask gradient that softens pill edges when the row scrolls. */
function buildSuggestionStripMask(fadeStart: boolean, fadeEnd: boolean): string | undefined {
  if (!fadeStart && !fadeEnd) return undefined;
  const stops: string[] = [];
  if (fadeStart) {
    stops.push("transparent 0", `black ${SCROLL_FADE_EDGE_PX}px`);
  } else {
    stops.push("black 0");
  }
  if (fadeEnd) {
    stops.push(`black calc(100% - ${SCROLL_FADE_EDGE_PX}px)`, "transparent 100%");
  } else {
    stops.push("black 100%");
  }
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

/**
 * **Purpose:** OO suggestion pills anchored below the homepage prompt bar (app `home-search-suggestion-strip` parity).
 * **Connects to:** `LandingImmersiveShell`, `landing-home-prompt.css`.
 */
export function LandingHomeSuggestionPills({
  onPrompt,
  onOpenGame,
}: {
  onPrompt: (query: string, powerId?: LandingDemoPowerId) => void;
  /** Opens a bundled arcade game overlay (e.g. chess). */
  onOpenGame?: (gameId: LandingArcadeGameId) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [fadeStart, setFadeStart] = useState(false);
  const [fadeEnd, setFadeEnd] = useState(false);

  const updateScrollFades = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const overflows = scroller.scrollWidth > scroller.clientWidth + SCROLL_EDGE_EPSILON;
    if (!overflows) {
      setFadeStart(false);
      setFadeEnd(false);
      return;
    }
    setFadeStart(scroller.scrollLeft > SCROLL_EDGE_EPSILON);
    setFadeEnd(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - SCROLL_EDGE_EPSILON);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateScrollFades();
    const observer = new ResizeObserver(updateScrollFades);
    observer.observe(scroller);
    const inner = scroller.firstElementChild;
    if (inner) observer.observe(inner);
    return () => observer.disconnect();
  }, [updateScrollFades]);

  const maskImage = buildSuggestionStripMask(fadeStart, fadeEnd);

  return (
    <div
      className="landing-home-suggestion-strip"
      aria-label="Suggested prompts"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div
        ref={scrollerRef}
        className="landing-home-suggestion-strip__scroller"
        data-fade-start={fadeStart ? "true" : undefined}
        data-fade-end={fadeEnd ? "true" : undefined}
        onScroll={updateScrollFades}
        style={
          maskImage
            ? {
                WebkitMaskImage: maskImage,
                maskImage,
              }
            : undefined
        }
      >
        <div className="landing-home-suggestion-strip__inner">
          {LANDING_HOME_SUGGESTIONS.map((suggestion, index) => (
            <SuggestionPill
              key={suggestion.id}
              suggestion={suggestion}
              index={index}
              onPrompt={onPrompt}
              onOpenGame={onOpenGame}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SuggestionPill({
  suggestion,
  index,
  onPrompt,
  onOpenGame,
}: {
  suggestion: LandingHomeSuggestion;
  index: number;
  onPrompt: (query: string, powerId?: LandingDemoPowerId) => void;
  onOpenGame?: (gameId: LandingArcadeGameId) => void;
}) {
  const className = "landing-home-suggestion-pill landing-control-surface";

  if (suggestion.kind === "link") {
    return (
      <span
        className="landing-home-suggestion-pill-wrap"
        style={{ animationDelay: `${index * 30}ms` }}
      >
        <a href={suggestion.href} className={className}>
          {suggestion.label}
        </a>
      </span>
    );
  }

  if (suggestion.kind === "game") {
    return (
      <span
        className="landing-home-suggestion-pill-wrap"
        style={{ animationDelay: `${index * 30}ms` }}
      >
        <button
          type="button"
          className={className}
          aria-label={`Play ${suggestion.label}`}
          onClick={() => onOpenGame?.(suggestion.gameId)}
        >
          {suggestion.label}
        </button>
      </span>
    );
  }

  return (
    <span
      className="landing-home-suggestion-pill-wrap"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <button
        type="button"
        className={className}
        aria-label={`Suggested prompt: ${suggestion.label}`}
        onClick={() => onPrompt(suggestion.query, suggestion.powerId)}
      >
        {suggestion.label}
      </button>
    </span>
  );
}
