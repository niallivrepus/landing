/**
 * **Purpose:** React port of `SpineEmotionPill` — real Pattern Library mood rings (Figma 4410:6645).
 * **Connects to:** `spine-day-mood.css`, `landing-spine-mood-catalog.ts`.
 * **Parity:** `SpineTodayMoodCarousel.tsx` / `spine-day-mood-rail.swift`.
 */

import { cn } from "@jokuh/gooey";
import type { LandingSpineMoodDefinition } from "../../data/landing-spine-mood-catalog";

/** Decorative icon inside the emotion pill — matches web `SpineEmotionPillIcon`. */
function SpineEmotionPillIcon({ iconKey }: { iconKey: LandingSpineMoodDefinition["iconKey"] }) {
  const path = (() => {
    switch (iconKey) {
      case "head":
        return "M12 4a4 4 0 0 1 4 4v2h1a3 3 0 0 1 3 3v5H4v-5a3 3 0 0 1 3-3h1V8a4 4 0 0 1 4-4z";
      case "scissors":
        return "M8 4l2 4m4-4l-2 4M6 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM10 12h4";
      case "pulse":
        return "M4 12h3l2-6 4 12 2-6h5";
      case "palette":
        return "M12 3c-4 0-7 2.5-7 6.5a5.5 5.5 0 0 0 5.5 5.5c.8 0 1.2.4 1.2 1.2 0 .8-.4 1.3-1.2 1.3H9v2h6c3.5 0 6-2.5 6-6.5S15.5 3 12 3z";
      case "star":
        return "M12 2l2.8 5.7L21 9l-4.5 4.4L18 20l-6-3.2L6 20l1.5-6.6L3 9l6.2-1.3L12 2z";
      case "group":
        return "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a5 5 0 0 1 10 0H3zm14 0h4a5 5 0 0 0-8-3.5";
      case "target":
        return "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z";
      case "heartCluster":
        return "M8 6a2.5 2.5 0 0 1 4 2 2.5 2.5 0 0 1 4-2c1.8 0 3 1.4 3 3.2 0 3.5-4.5 6.8-7 8.8-2.5-2-7-5.3-7-8.8C5 7.4 6.2 6 8 6z";
      default: {
        const _exhaustive: never = iconKey;
        return _exhaustive;
      }
    }
  })();

  return (
    <svg className="spine-emotion-pill__glyph" viewBox="0 0 24 24" aria-hidden>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LandingSpineEmotionPillProps = {
  mood: LandingSpineMoodDefinition;
  selected?: boolean;
  compact?: boolean;
  peek?: boolean;
  className?: string;
};

/**
 * **Renders** a single vertical emotion pill using production `spine-emotion-pill` classes.
 */
export function LandingSpineEmotionPill({
  mood,
  selected = false,
  compact = false,
  peek = false,
  className,
}: LandingSpineEmotionPillProps) {
  return (
    <button
      type="button"
      className={cn(
        "spine-emotion-pill",
        selected && "spine-emotion-pill--selected",
        compact && "spine-emotion-pill--compact",
        peek && "spine-emotion-pill--peek",
        className,
      )}
      style={
        {
          "--spine-emotion-border": mood.borderColor,
          "--spine-emotion-fill": mood.fillColor,
        } as React.CSSProperties
      }
      aria-label={`Feeling ${mood.label}`}
      aria-pressed={selected}
    >
      <span className="spine-emotion-pill__emoji" aria-hidden>
        {mood.emoji}
      </span>
      {!peek ? (
        <>
          <SpineEmotionPillIcon iconKey={mood.iconKey} />
          <span className="spine-emotion-pill__label">{mood.label}</span>
        </>
      ) : null}
    </button>
  );
}
