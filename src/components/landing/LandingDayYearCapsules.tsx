import { cn } from "@jokuh/gooey";
import { useMemo } from "react";
import type { LandingDayCapsule, LandingHourCapsule } from "../../data/landing-spine-capsules";
import { LANDING_SPINE_YEAR } from "../../data/landing-spine-capsules";

/**
 * **Purpose:** Interactive year / day / hour capsules for landing Spine and Calls demos.
 * `timeline` layout mirrors the app: vertical spine rail with day pills outside the squircle.
 * **Connects to:** `landing-spine-capsules.ts`, `SpineImmersiveShell`, `CallsImmersiveShell`.
 */
export function LandingDayYearCapsules({
  days,
  hoursByDay,
  selectedDayId,
  expandedHourId,
  onSelectDay,
  onToggleHour,
  year = LANDING_SPINE_YEAR,
  layout = "timeline",
  className,
}: {
  days: LandingDayCapsule[];
  hoursByDay: Record<string, LandingHourCapsule[]>;
  selectedDayId: string;
  expandedHourId: string | null;
  onSelectDay: (dayId: string) => void;
  onToggleHour: (hourId: string) => void;
  year?: number;
  layout?: "timeline" | "strip";
  className?: string;
}) {
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];
  const hours = useMemo(
    () => (selectedDay ? hoursByDay[selectedDay.id] ?? [] : []),
    [hoursByDay, selectedDay],
  );
  const expandedHour = hours.find((hour) => hour.id === expandedHourId);

  if (layout === "strip") {
    return (
      <div className={cn("landing-spine-capsules landing-spine-capsules--strip", className)}>
        <CapsuleChrome year={year} monthLabel={selectedDay?.monthLabel ?? "Today"} />
        <DayStrip
          days={days}
          selectedDayId={selectedDayId}
          onSelectDay={onSelectDay}
        />
        <HourList
          hours={hours}
          expandedHourId={expandedHourId}
          onToggleHour={onToggleHour}
        />
        {expandedHour ? (
          <p className="landing-spine-capsules__focus" aria-live="polite">
            Focused: {expandedHour.summary}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("landing-spine-capsules landing-spine-capsules--timeline", className)}>
      <div className="landing-spine-capsules__rail" aria-hidden />
      <CapsuleChrome year={year} monthLabel={selectedDay?.monthLabel ?? "Today"} />

      <div className="landing-spine-capsules__timeline-days" role="tablist" aria-label="Days">
        {days.map((day) => {
          const selected = day.id === selectedDayId;
          const dayHours = hoursByDay[day.id] ?? [];
          return (
            <div key={day.id} className="landing-spine-timeline-day">
              <button
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onSelectDay(day.id)}
                className={cn(
                  "landing-day-capsule",
                  selected && "landing-day-capsule--selected",
                  day.isToday && "landing-day-capsule--today",
                )}
              >
                <span className="landing-day-capsule__weekday">{day.weekday}</span>
                <span className="landing-day-capsule__cord" aria-hidden />
                <span className="landing-day-capsule__day">{day.day}</span>
              </button>

              {selected && dayHours.length > 0 ? (
                <HourList
                  hours={dayHours}
                  expandedHourId={expandedHourId}
                  onToggleHour={onToggleHour}
                  className="landing-spine-capsules__hours--under-day"
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {expandedHour ? (
        <p className="landing-spine-capsules__focus" aria-live="polite">
          Focused: {expandedHour.summary}
        </p>
      ) : null}
    </div>
  );
}

function CapsuleChrome({ year, monthLabel }: { year: number; monthLabel: string }) {
  return (
    <>
      <div className="landing-spine-capsules__year" aria-hidden>
        {year}
      </div>
      <p className="landing-spine-capsules__month">{monthLabel}</p>
    </>
  );
}

function DayStrip({
  days,
  selectedDayId,
  onSelectDay,
}: {
  days: LandingDayCapsule[];
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
}) {
  return (
    <div className="landing-spine-capsules__days" role="tablist" aria-label="Days">
      {days.map((day) => {
        const selected = day.id === selectedDayId;
        return (
          <button
            key={day.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelectDay(day.id)}
            className={cn(
              "landing-day-capsule",
              selected && "landing-day-capsule--selected",
              day.isToday && "landing-day-capsule--today",
            )}
          >
            <span className="landing-day-capsule__weekday">{day.weekday}</span>
            <span className="landing-day-capsule__cord" aria-hidden />
            <span className="landing-day-capsule__day">{day.day}</span>
          </button>
        );
      })}
    </div>
  );
}

function HourList({
  hours,
  expandedHourId,
  onToggleHour,
  className,
}: {
  hours: LandingHourCapsule[];
  expandedHourId: string | null;
  onToggleHour: (hourId: string) => void;
  className?: string;
}) {
  if (hours.length === 0) {
    return (
      <p className="landing-spine-capsules__empty">
        Tap another day to browse memories and calls.
      </p>
    );
  }

  return (
    <div className={cn("landing-spine-capsules__hours", className)} role="list" aria-label="Hours">
      {hours.map((hour) => {
        const expanded = hour.id === expandedHourId;
        return (
          <div key={hour.id} className="landing-spine-capsules__hour-wrap" role="listitem">
            <button
              type="button"
              onClick={() => onToggleHour(hour.id)}
              className={cn(
                "landing-hour-capsule",
                `landing-hour-capsule--${hour.tone}`,
                expanded && "landing-hour-capsule--expanded",
              )}
              aria-expanded={expanded}
            >
              <span className="landing-hour-capsule__label">{hour.label}</span>
              <span className="landing-hour-capsule__summary">{hour.summary}</span>
            </button>

            {expanded && hour.detail ? (
              <p className="landing-hour-capsule__detail">{hour.detail}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
