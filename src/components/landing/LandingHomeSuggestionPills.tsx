import { LANDING_HOME_SUGGESTIONS, type LandingHomeSuggestion } from "../../data/landing-home-suggestions";
import type { LandingArcadeGameId } from "../../data/landing-arcade-games";

/**
 * **Purpose:** OO suggestion pills anchored below the homepage prompt bar (app `home-search-suggestion-strip` parity).
 * **Connects to:** `LandingImmersiveShell`, `landing-home-prompt.css`.
 */
export function LandingHomeSuggestionPills({
  onPrompt,
  onOpenGame,
}: {
  onPrompt: (query: string) => void;
  /** Opens a bundled arcade game overlay (e.g. chess). */
  onOpenGame?: (gameId: LandingArcadeGameId) => void;
}) {
  return (
    <div
      className="landing-home-suggestion-strip"
      aria-label="Suggested prompts"
      onPointerDown={(event) => event.stopPropagation()}
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
  onPrompt: (query: string) => void;
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
        onClick={() => onPrompt(suggestion.query)}
      >
        {suggestion.label}
      </button>
    </span>
  );
}
