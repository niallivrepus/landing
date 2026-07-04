/**
 * **Purpose:** Spine highlight carousel slides using **real** app UI — Gooey timeline, mood rings, capsules.
 * **Connects to:** `ProductDetailMedia`, `LandingDayYearCapsules`, `LandingSpineTodayBriefPreview`, `@jokuh/gooey` SpineTimeline.
 * **Parity:** `SpinePage.tsx`, `SpineTodayMoodCarousel.tsx`, `spine-year-timeline.swift`.
 */

import { cn, SAMPLE_SPINE_EVENTS, SpineTimeline } from "@jokuh/gooey";
import { useMemo, useState } from "react";
import {
  LANDING_DEFAULT_DAY_ID,
  LANDING_SPINE_DAYS,
  LANDING_SPINE_HOURS_BY_DAY,
} from "../../data/landing-spine-capsules";
import { LandingDayYearCapsules } from "./LandingDayYearCapsules";
import { LandingSpineTodayBriefPreview } from "./LandingSpineTodayBriefPreview";

export type SpineHighlightVariant =
  | "todayBrief"
  | "timeline"
  | "memories"
  | "planner"
  | "moodSky"
  | "lifelog"
  | "search"
  | "recap";

type SpineHighlightVisualProps = {
  variant: SpineHighlightVariant;
  active?: boolean;
  className?: string;
};

function OoContextChip({ children }: { children: string }) {
  return (
    <div className="spine-highlight-visual__oo-chip">
      <span className="spine-highlight-visual__oo-chip-dot" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

/** Today Brief + adjacent mood rings — production carousel chrome. */
function TodayBriefHighlight() {
  return (
    <div className="spine-highlight-visual__stage">
      <LandingSpineTodayBriefPreview savedMoodId="calm" />
      <OoContextChip>OO reads your day before you do</OoContextChip>
    </div>
  );
}

/** Year/day/hour capsules — same component as the immersive hero. */
function TimelineHighlight() {
  const [selectedDayId, setSelectedDayId] = useState(LANDING_DEFAULT_DAY_ID);
  const [expandedHourId, setExpandedHourId] = useState<string | null>(null);

  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__capsules-wrap">
        <LandingDayYearCapsules
          layout="timeline"
          days={LANDING_SPINE_DAYS}
          hoursByDay={LANDING_SPINE_HOURS_BY_DAY}
          selectedDayId={selectedDayId}
          expandedHourId={expandedHourId}
          onSelectDay={(dayId) => {
            setSelectedDayId(dayId);
            setExpandedHourId(null);
          }}
          onToggleHour={(hourId) =>
            setExpandedHourId((current) => (current === hourId ? null : hourId))
          }
        />
      </div>
      <OoContextChip>Every day of your life, on one timeline</OoContextChip>
    </div>
  );
}

/** Gooey SpineTimeline — real memory chips from Pattern Library. */
function MemoriesHighlight() {
  const events = useMemo(() => SAMPLE_SPINE_EVENTS.slice(0, 5), []);

  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__timeline-wrap">
        <SpineTimeline events={events} className="spine-highlight-visual__scaled-timeline" />
      </div>
      <OoContextChip>Calls, captures, and wallet moves land automatically</OoContextChip>
    </div>
  );
}

/** Planner via hour capsules on an expanded day — mirrors day planner tabs in-app. */
function PlannerHighlight() {
  const [selectedDayId] = useState(LANDING_DEFAULT_DAY_ID);
  const [expandedHourId, setExpandedHourId] = useState("h-2");

  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__capsules-wrap">
        <LandingDayYearCapsules
          layout="timeline"
          days={LANDING_SPINE_DAYS.filter((day) => day.isToday)}
          hoursByDay={LANDING_SPINE_HOURS_BY_DAY}
          selectedDayId={selectedDayId}
          expandedHourId={expandedHourId}
          onSelectDay={() => undefined}
          onToggleHour={(hourId) =>
            setExpandedHourId((current) => (current === hourId ? null : hourId))
          }
        />
      </div>
      <OoContextChip>Notes, tasks, reminders, and files — per day</OoContextChip>
    </div>
  );
}

/** Focused mood ring — real emotion pill at full size. */
function MoodSkyHighlight() {
  return (
    <div className="spine-highlight-visual__stage">
      <LandingSpineTodayBriefPreview focusMoodId="calm" savedMoodId="calm" />
      <OoContextChip>Eight mood rings + Sky Lens on your timeline</OoContextChip>
    </div>
  );
}

/** Lifelog timeline slice — different event window. */
function LifelogHighlight() {
  const events = useMemo(() => SAMPLE_SPINE_EVENTS.slice(4, 9), []);

  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__timeline-wrap">
        <SpineTimeline events={events} />
      </div>
      <OoContextChip>Calendar, photos, and captures sync local-first</OoContextChip>
    </div>
  );
}

/** Search bar chrome above a real timeline filter. */
function SearchHighlight({ active }: { active: boolean }) {
  const events = useMemo(
    () =>
      SAMPLE_SPINE_EVENTS.filter((event) =>
        ["incomingCall", "outgoingCall", "voiceMemo", "meeting"].includes(event.kind),
      ).slice(0, 4),
    [],
  );

  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__search-bar" aria-hidden>
        <span>⌕</span>
        <span>
          dad call transcript
          {active ? <span className="profile-highlight-visual__bio-cursor" aria-hidden /> : null}
        </span>
      </div>
      <div className="spine-highlight-visual__timeline-wrap">
        <SpineTimeline events={events.length > 0 ? events : SAMPLE_SPINE_EVENTS.slice(0, 3)} />
      </div>
      <OoContextChip>Search memories across your whole timeline</OoContextChip>
    </div>
  );
}

/** Streak chip — production `spine-streak-chip` classes. */
function RecapHighlight() {
  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__recap-wrap">
        <button type="button" className="spine-streak-chip" data-milestone="true">
          <span className="spine-streak-chip__well" aria-hidden>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M13.1 2.4c.3 2.1-.4 3.6-1.9 5.2-1.2 1.3-2.6 2.6-3.5 4.5-1.6 3.4-.4 7.4 2.9 9.3.6.3 1.3.6 2 .7-1.4-1.3-1.9-3.4-1-5 .5-.9 1.3-1.6 1.8-2.5.3-.5.5-1.1.5-1.7 1 1 1.9 2 2.4 3.4.6 1.7.4 3.7-.9 5.5 1.1-.3 2.1-.9 3-1.7 2.4-2.3 3-6 1.5-9C18.4 7.7 15.4 4 13.1 2.4Z" />
            </svg>
          </span>
          <span className="spine-streak-chip__label">Day 14</span>
          <span className="spine-streak-chip__detail">Best streak 30 · Next milestone 30 in 16 days</span>
        </button>
      </div>
      <div className="spine-highlight-visual__timeline-wrap" style={{ marginTop: "0.75rem" }}>
        <SpineTimeline events={SAMPLE_SPINE_EVENTS.slice(0, 3)} />
      </div>
      <OoContextChip>On this day, streaks, and month-in-review</OoContextChip>
    </div>
  );
}

/**
 * **Renders** a Spine highlight slide using production UI components and CSS class names.
 */
export function SpineHighlightVisual({
  variant,
  active = false,
  className,
}: SpineHighlightVisualProps) {
  return (
    <div className={cn("spine-highlight-visual", className)} aria-hidden>
      {variant === "todayBrief" ? <TodayBriefHighlight /> : null}
      {variant === "timeline" ? <TimelineHighlight /> : null}
      {variant === "memories" ? <MemoriesHighlight /> : null}
      {variant === "planner" ? <PlannerHighlight /> : null}
      {variant === "moodSky" ? <MoodSkyHighlight /> : null}
      {variant === "lifelog" ? <LifelogHighlight /> : null}
      {variant === "search" ? <SearchHighlight active={active} /> : null}
      {variant === "recap" ? <RecapHighlight /> : null}
    </div>
  );
}
