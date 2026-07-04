import { InteractivePromptBar } from "@jokuh/gooey";
import { useCallback, useState, type ComponentProps } from "react";
import { LandingBubblesOverlay } from "./LandingBubblesOverlay";

type LandingPromptBarProps = Omit<ComponentProps<typeof InteractivePromptBar>, "libraryAffordance" | "onLibrary"> & {
  /** Optional override — default opens the Bubbles explainer overlay. */
  onBubbleOpen?: () => void;
};

/**
 * **Purpose:** Landing prompt bar with **Bubbles** leading affordance and explainer overlay (not command library).
 * **Connects to:** immersive shells, `LandingBubblesOverlay`, Gooey `InteractivePromptBar`.
 */
export function LandingPromptBar({ onBubbleOpen, ...props }: LandingPromptBarProps) {
  const [bubblesOpen, setBubblesOpen] = useState(false);

  const handleBubbleOpen = useCallback(() => {
    if (onBubbleOpen) {
      onBubbleOpen();
      return;
    }
    setBubblesOpen(true);
  }, [onBubbleOpen]);

  return (
    <>
      <InteractivePromptBar
        {...props}
        libraryAffordance="bubbles"
        onLibrary={handleBubbleOpen}
      />
      <LandingBubblesOverlay open={bubblesOpen} onClose={() => setBubblesOpen(false)} />
    </>
  );
}
