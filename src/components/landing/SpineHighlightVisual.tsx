/**
 * **Purpose:** Miniature Spine UI mockups for `/spine` highlight and closer-look carousels.
 * **Connects to:** `ProductDetailMedia`, `product-detail-blueprints.ts`, real app parity (`Sources/spine/`, `SpinePage.tsx`).
 * **Variants:** todayBrief, timeline, memories, planner, moodSky, lifelog, search, recap.
 */

import { cn } from "@jokuh/gooey";
import { LANDING_SPINE_DAYS } from "../../data/landing-spine-capsules";

/** Carousel slide variants — each depicts a real Spine surface from the product app. */
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

/** Floating OO context chip beneath mockups. */
function OoContextChip({ children }: { children: string }) {
  return (
    <div className="spine-highlight-visual__oo-chip">
      <span className="spine-highlight-visual__oo-chip-dot" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

/** Today Brief — greeting, counts, action queue (parity `SpineBriefing.tsx`). */
function TodayBriefHighlightMockup({ active }: { active: boolean }) {
  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__squircle">
        <p className="spine-highlight-visual__brief-kicker">For today</p>
        <p className="spine-highlight-visual__brief-title">Friday, July 4</p>
        <p className="spine-highlight-visual__brief-oo">
          {active ? "OO is prioritizing your day…" : "OO is reading your day…"}
        </p>
        <div className="spine-highlight-visual__brief-counts">
          <span>2 calls</span>
          <span>3 tasks</span>
          <span>1 reminder</span>
          <span>4 memories</span>
        </div>
        <div className="spine-highlight-visual__brief-actions">
          <span className="spine-highlight-visual__brief-pill spine-highlight-visual__brief-pill--hot">
            Unread from Dad
          </span>
          <span className="spine-highlight-visual__brief-pill">Take medicine · 6 AM</span>
        </div>
      </div>
      <OoContextChip>One warm daily brief — tasks, reminders, and what&apos;s ahead</OoContextChip>
    </div>
  );
}

/** Year timeline — day pills + hour rail (parity `spine-year-timeline.swift`). */
function TimelineHighlightMockup() {
  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__squircle">
        <p className="spine-highlight-visual__section-label">July 2026</p>
        <div className="spine-highlight-visual__day-strip">
          {LANDING_SPINE_DAYS.map((day) => (
            <div
              key={day.id}
              className={cn(
                "spine-highlight-visual__day-pill",
                day.isToday && "spine-highlight-visual__day-pill--today",
              )}
            >
              <span className="spine-highlight-visual__day-weekday">{day.weekday}</span>
              <span className="spine-highlight-visual__day-num">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="spine-highlight-visual__hour-rail">
          <span className="spine-highlight-visual__hour-tick spine-highlight-visual__hour-tick--memory" />
          <span className="spine-highlight-visual__hour-tick spine-highlight-visual__hour-tick--note" />
          <span className="spine-highlight-visual__hour-tick spine-highlight-visual__hour-tick--call" />
          <span className="spine-highlight-visual__hour-tick spine-highlight-visual__hour-tick--task" />
          <span className="spine-highlight-visual__hour-tick spine-highlight-visual__hour-tick--reminder" />
        </div>
        <p className="spine-highlight-visual__timeline-caption">
          Jump months, expand a day, drag planner items across the week.
        </p>
      </div>
      <OoContextChip>Every day of your life, on one timeline</OoContextChip>
    </div>
  );
}

/** Memory chips — lifelog kinds from `SpineActivityEvent.Kind`. */
function MemoriesHighlightMockup() {
  const chips = [
    { tone: "call", label: "Call · Dad", detail: "Transcript saved to Spine" },
    { tone: "capture", label: "Screenshot", detail: "3s hold capture · 2:14 AM" },
    { tone: "wallet", label: "Wallet · sent", detail: "0.4 SOL · memo attached" },
  ] as const;

  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__squircle">
        <p className="spine-highlight-visual__section-label">Memories</p>
        <ul className="spine-highlight-visual__chip-list">
          {chips.map((chip) => (
            <li
              key={chip.label}
              className={cn(
                "spine-highlight-visual__memory-chip",
                `spine-highlight-visual__memory-chip--${chip.tone}`,
              )}
            >
              <span className="spine-highlight-visual__memory-chip-label">{chip.label}</span>
              <span className="spine-highlight-visual__memory-chip-detail">{chip.detail}</span>
            </li>
          ))}
        </ul>
        <p className="spine-highlight-visual__timeline-caption">
          30+ memory kinds — calls, meetings, browser, wallet, Arcade, and more.
        </p>
      </div>
      <OoContextChip>Everything you do can land in Spine automatically</OoContextChip>
    </div>
  );
}

/** Day planner tabs — Notes · Files · Memories · Tasks · Reminders. */
function PlannerHighlightMockup({ active }: { active: boolean }) {
  const tabs = ["Notes", "Files", "Memories", "Tasks", "Reminders"] as const;

  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__squircle">
        <div className="spine-highlight-visual__planner-tabs">
          {tabs.map((tab) => (
            <span
              key={tab}
              className={cn(
                "spine-highlight-visual__planner-tab",
                tab === "Notes" && "spine-highlight-visual__planner-tab--active",
              )}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="spine-highlight-visual__sticky-note">
          <p className="spine-highlight-visual__sticky-label">Sticky note</p>
          <p className="spine-highlight-visual__sticky-body">
            Ship Spine hour capsules + Today Brief before standup.
            {active ? <span className="spine-highlight-visual__sticky-cursor" aria-hidden /> : null}
          </p>
        </div>
        <div className="spine-highlight-visual__task-row">
          <span className="spine-highlight-visual__task-check" aria-hidden />
          <span>TBV Ventures prep</span>
        </div>
      </div>
      <OoContextChip>Planner tabs per day — drag items across the timeline</OoContextChip>
    </div>
  );
}

/** Mood rail + Sky Lens teaser (parity `spine-day-mood-rail`, Sky Lens sheet). */
function MoodSkyHighlightMockup() {
  const moods = ["😤", "😔", "😰", "😊", "😜", "😌", "🎉", "🥰"];

  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__squircle">
        <p className="spine-highlight-visual__section-label">How you feel</p>
        <div className="spine-highlight-visual__mood-rail">
          {moods.map((mood, index) => (
            <span
              key={mood}
              className={cn(
                "spine-highlight-visual__mood-dot",
                index === 5 && "spine-highlight-visual__mood-dot--active",
              )}
              aria-hidden
            >
              {mood}
            </span>
          ))}
        </div>
        <div className="spine-highlight-visual__sky-card">
          <p className="spine-highlight-visual__sky-title">Daily sky lens</p>
          <p className="spine-highlight-visual__sky-line">
            Waxing gibbous · Leo rising · Do: ship the thing you keep postponing.
          </p>
        </div>
      </div>
      <OoContextChip>Mood check-ins + ephemeris readings stay on your timeline</OoContextChip>
    </div>
  );
}

/** Lifelog funnel — calendar, photos, captures sync locally. */
function LifelogHighlightMockup() {
  const sources = [
    { label: "Calendar", detail: "30 days back · 14 forward" },
    { label: "Photos", detail: "Moments placed on the right day" },
    { label: "Capture", detail: "3s screenshot · 6s screen record" },
  ] as const;

  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__squircle">
        <p className="spine-highlight-visual__section-label">Life context import</p>
        <ul className="spine-highlight-visual__lifelog-list">
          {sources.map((source) => (
            <li key={source.label} className="spine-highlight-visual__lifelog-row">
              <span className="spine-highlight-visual__lifelog-source">{source.label}</span>
              <span className="spine-highlight-visual__lifelog-arrow" aria-hidden>
                →
              </span>
              <span className="spine-highlight-visual__lifelog-target">Spine</span>
              <span className="spine-highlight-visual__lifelog-detail">{source.detail}</span>
            </li>
          ))}
        </ul>
        <p className="spine-highlight-visual__timeline-caption">
          Local-first manifest syncs across devices when you sign in.
        </p>
      </div>
      <OoContextChip>Calendar + photos + captures — pattern from your timeline</OoContextChip>
    </div>
  );
}

/** Memory search — AND-token search across summaries and transcripts. */
function SearchHighlightMockup({ active }: { active: boolean }) {
  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__squircle">
        <div className="spine-highlight-visual__search-bar">
          <span className="spine-highlight-visual__search-icon" aria-hidden>
            ⌕
          </span>
          <span className="spine-highlight-visual__search-query">
            dad call transcript
            {active ? <span className="spine-highlight-visual__sticky-cursor" aria-hidden /> : null}
          </span>
        </div>
        <ul className="spine-highlight-visual__search-results">
          <li>Incoming call · Dad · Jul 4 · transcript attached</li>
          <li>Voice memo · 0:42 · Pepper close prep</li>
          <li>Deal room · Sean · “really great work”</li>
        </ul>
      </div>
      <OoContextChip>Search memories across your whole timeline</OoContextChip>
    </div>
  );
}

/** Retention — streak, on-this-day, month recap. */
function RecapHighlightMockup() {
  return (
    <div className="spine-highlight-visual__stage">
      <div className="spine-highlight-visual__squircle">
        <div className="spine-highlight-visual__streak-chip">Day 14 · Best streak 30</div>
        <p className="spine-highlight-visual__years-ago">3 years ago today</p>
        <p className="spine-highlight-visual__recap-line">
          Independence Day essay · first Spine prototype shipped.
        </p>
        <div className="spine-highlight-visual__recap-stats">
          <span>47 memories</span>
          <span>12 notes</span>
          <span>Top mood: calm</span>
        </div>
      </div>
      <OoContextChip>Streaks, on-this-day, and month-in-review keep context alive</OoContextChip>
    </div>
  );
}

/**
 * **Renders** the Spine highlight mini-mockup for a carousel slide variant.
 * **Inputs:** `variant` selects which Spine UI replica to show; `active` drives subtle motion cues.
 */
export function SpineHighlightVisual({
  variant,
  active = false,
  className,
}: SpineHighlightVisualProps) {
  return (
    <div className={cn("spine-highlight-visual", className)} aria-hidden>
      {variant === "todayBrief" ? <TodayBriefHighlightMockup active={active} /> : null}
      {variant === "timeline" ? <TimelineHighlightMockup /> : null}
      {variant === "memories" ? <MemoriesHighlightMockup /> : null}
      {variant === "planner" ? <PlannerHighlightMockup active={active} /> : null}
      {variant === "moodSky" ? <MoodSkyHighlightMockup /> : null}
      {variant === "lifelog" ? <LifelogHighlightMockup /> : null}
      {variant === "search" ? <SearchHighlightMockup active={active} /> : null}
      {variant === "recap" ? <RecapHighlightMockup /> : null}
    </div>
  );
}
