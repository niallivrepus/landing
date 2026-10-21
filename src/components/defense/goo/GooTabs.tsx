import { cn } from "@jokuh/gooey";
import { motion } from "motion/react";
import { useId, type KeyboardEvent } from "react";

/**
 * **Purpose:** The goo segmented control: a liquid bead slides between labels (`layoutId`), stretching as it goes.
 * Reduced motion: the bead snaps. Keyboard: arrow keys move, Home/End jump (roving tabindex, WAI-ARIA tabs).
 * **Connects to:** `DefenseExplorer`. **Parity:** `GooSegmented` in the Solid app's goo kit.
 */
export function GooTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  reduceMotion,
  idPrefix,
}: {
  tabs: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  reduceMotion: boolean;
  idPrefix: string;
}) {
  const group = useId();
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight" ? (index + 1) % tabs.length
      : event.key === "ArrowLeft" ? (index - 1 + tabs.length) % tabs.length
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : -1;
    if (next < 0) return;
    event.preventDefault();
    onChange(tabs[next]!.id);
    document.getElementById(`${idPrefix}-tab-${tabs[next]!.id}`)?.focus();
  };
  return (
    <div className="defense-tabs" role="tablist" aria-label={label}>
      {tabs.map((tab, index) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            id={`${idPrefix}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            className={cn("defense-tabs__tab", selected && "is-selected")}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKey(event, index)}
          >
            {selected ? (
              <span aria-hidden className="defense-tabs__goo">
                <motion.span
                  layoutId={`${group}-bead`}
                  className="defense-tabs__bead"
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30, mass: 0.9 }}
                />
              </span>
            ) : null}
            <span className="defense-tabs__label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
