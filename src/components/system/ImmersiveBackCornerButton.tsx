import { ActionButton, cn } from "@jokuh/gooey";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";

const SCREEN_CORNER_INSET = "max(12px, env(safe-area-inset-left, 12px))";

/**
 * **Purpose:** Top-leading back affordance for immersive marketing pages — same capsule chrome as corner pills.
 * **Connects to:** `ImmersiveAppChrome.topLeadingSlot`, Swift `onboardingBackCornerPill`, web `NavBackChevronIcon`.
 * **Parity:** `Sources/action-buttons.swift` (`onboardingBackAction`), `frontend/src/utils/icons.tsx`.
 */
export function ImmersiveBackCornerButton({
  onBack,
  "aria-label": ariaLabel = "Back",
  className,
}: {
  onBack: () => void;
  "aria-label"?: string;
  className?: string;
}) {
  const cornerHoverSound = useGentleHoverSound(true, "gentle");

  return (
    <div
      className={cn("group pointer-events-auto absolute left-3 top-3", className)}
      {...cornerHoverSound}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        marginLeft: SCREEN_CORNER_INSET,
      }}
    >
      <ActionButton
        aria-label={ariaLabel}
        orientation="right"
        icon={
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="text-light-space/72 light:text-zinc-900/72"
          >
            <path
              d="M15 5L9 12L15 19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        onClick={onBack}
      />
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-light-space/40 opacity-0 transition-opacity group-hover:opacity-100 light:text-zinc-500",
        )}
      >
        Back
      </span>
    </div>
  );
}
