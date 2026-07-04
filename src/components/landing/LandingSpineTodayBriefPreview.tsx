/**
 * **Purpose:** Static Today Brief + mood adjacent rails for landing carousels — real app chrome.
 * **Connects to:** `spine-day-mood.css`, `spine-today-brief-tiers.css`, `LandingSpineEmotionPill`.
 * **Parity:** `SpineTodayMoodCarousel` + `SpineBriefing` center page.
 */

import { cn } from "@jokuh/gooey";
import {
  LANDING_SPINE_MOOD_DEFINITIONS,
  LANDING_SPINE_MOODS_LEFT,
  LANDING_SPINE_MOODS_RIGHT,
  type LandingSpineMoodId,
} from "../../data/landing-spine-mood-catalog";
import { LandingSpineEmotionPill } from "./LandingSpineEmotionPill";

function MoodAdjacentRail({
  moods,
  side,
  savedMoodId,
}: {
  moods: LandingSpineMoodId[];
  side: "left" | "right";
  savedMoodId?: LandingSpineMoodId | null;
}) {
  return (
    <div
      className={cn(
        "spine-mood-adjacent-rail",
        side === "left" ? "spine-mood-adjacent-rail--left" : "spine-mood-adjacent-rail--right",
      )}
      role="group"
      aria-label={side === "left" ? "Moods before brief" : "Moods after brief"}
    >
      <div className="spine-mood-adjacent-rail__track">
        {moods.map((moodId) => (
          <LandingSpineEmotionPill
            key={moodId}
            mood={LANDING_SPINE_MOOD_DEFINITIONS[moodId]}
            compact
            selected={savedMoodId === moodId}
          />
        ))}
      </div>
    </div>
  );
}

/** Today Brief card body — uses production brief tier classes. */
function TodayBriefCardBody() {
  return (
    <div className="id-pod-squircle landing-spine-brief-card">
      <div className="spine-brief-tier spine-brief-lead" data-centered="false">
        <div className="spine-brief-lead__copy">
          <p className="landing-spine-brief-kicker">For today</p>
          <p className="landing-spine-brief-greeting">
            Good morning, Sean — 2 calls, 3 tasks, 1 reminder ahead.
          </p>
        </div>
        <button type="button" className="spine-streak-chip spine-streak-chip--inline" data-milestone="false">
          <span className="spine-streak-chip__well" aria-hidden>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M13.1 2.4c.3 2.1-.4 3.6-1.9 5.2-1.2 1.3-2.6 2.6-3.5 4.5-1.6 3.4-.4 7.4 2.9 9.3.6.3 1.3.6 2 .7-1.4-1.3-1.9-3.4-1-5 .5-.9 1.3-1.6 1.8-2.5.3-.5.5-1.1.5-1.7 1 1 1.9 2 2.4 3.4.6 1.7.4 3.7-.9 5.5 1.1-.3 2.1-.9 3-1.7 2.4-2.3 3-6 1.5-9C18.4 7.7 15.4 4 13.1 2.4Z" />
            </svg>
          </span>
          <span className="spine-streak-chip__label">Day 14</span>
        </button>
      </div>

      <div className="spine-brief-tier spine-brief-moment">
        <p className="landing-spine-brief-insight">
          One thing needs you today: reply to Dad before your 9 AM block.
        </p>
      </div>

      <div className="spine-brief-tier spine-brief-quick-actions">
        <button type="button" className="spine-brief-quick-pill" style={{ borderColor: "rgba(239,68,68,0.45)" }}>
          Unread from Dad
        </button>
        <button type="button" className="spine-brief-quick-pill">
          Take medicine
        </button>
        <button type="button" className="spine-brief-quick-pill">
          TBV Ventures
        </button>
      </div>
    </div>
  );
}

type LandingSpineTodayBriefPreviewProps = {
  /** When set, carousel shows a focused mood page instead of the brief. */
  focusMoodId?: LandingSpineMoodId | null;
  savedMoodId?: LandingSpineMoodId | null;
  className?: string;
};

/**
 * **Renders** the Today Brief center snap with adjacent mood rings — static snapshot for marketing.
 */
export function LandingSpineTodayBriefPreview({
  focusMoodId = null,
  savedMoodId = "calm",
  className,
}: LandingSpineTodayBriefPreviewProps) {
  if (focusMoodId) {
    const mood = LANDING_SPINE_MOOD_DEFINITIONS[focusMoodId];
    return (
      <div className={cn("spine-today-mood-carousel landing-spine-brief-preview", className)}>
        <div className="spine-today-mood-carousel__mood-focus">
          <LandingSpineEmotionPill mood={mood} selected={savedMoodId === focusMoodId} />
          <p className="spine-today-mood-carousel__hint">Tap to log how you feel today</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("spine-today-mood-carousel landing-spine-brief-preview", className)}>
      <div className="spine-today-mood-carousel__viewport">
        <div className="spine-today-mood-carousel__track" style={{ transform: "translateX(0)" }}>
          <div className="spine-today-mood-carousel__page spine-today-mood-carousel__page--brief">
            <div className="spine-today-mood-carousel__brief-page">
              <div className="spine-today-mood-carousel__brief-rails">
                <MoodAdjacentRail moods={LANDING_SPINE_MOODS_LEFT} side="left" savedMoodId={savedMoodId} />
                <MoodAdjacentRail moods={LANDING_SPINE_MOODS_RIGHT} side="right" savedMoodId={savedMoodId} />
              </div>
              <div
                className="spine-today-mood-carousel__brief-slot"
                style={{ maxWidth: "min(100%, 320px)", ["--spine-today-brief-card-max" as string]: "320px" }}
              >
                <TodayBriefCardBody />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
