import { InteractivePromptBar } from "@jokuh/gooey";
import { useCallback, useEffect, useRef, useState, type ComponentProps } from "react";
import { LANDING_HERO_PREVIEW_PROMPT } from "../../lib/landing-demo-seed";
import { LandingBubblesOverlay } from "./LandingBubblesOverlay";

type LandingPromptBarProps = Omit<ComponentProps<typeof InteractivePromptBar>, "libraryAffordance" | "onLibrary"> & {
  /** Optional override — default opens the Bubbles explainer overlay. */
  onBubbleOpen?: () => void;
};

/**
 * **Purpose:** Landing prompt bar with **Bubbles** leading affordance and explainer overlay (not command library).
 * Empty send (idle “see OO work” preview) still fires `onSend` so the hero is not a dead control.
 * **Connects to:** immersive shells, `LandingBubblesOverlay`, Gooey `InteractivePromptBar`.
 */
export function LandingPromptBar({ onBubbleOpen, onSend, previewText, ...props }: LandingPromptBarProps) {
  const [bubblesOpen, setBubblesOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const fallbackPrompt = previewText?.trim() || LANDING_HERO_PREVIEW_PROMPT;

  const handleBubbleOpen = useCallback(() => {
    if (onBubbleOpen) {
      onBubbleOpen();
      return;
    }
    setBubblesOpen(true);
  }, [onBubbleOpen]);

  const handleSend = useCallback(
    (text: string) => {
      onSend?.(text.trim() || fallbackPrompt);
    },
    [fallbackPrompt, onSend],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !onSend) return;

    const activateIfEmpty = () => {
      const field = root.querySelector("input, textarea") as HTMLInputElement | HTMLTextAreaElement | null;
      if (field && field.value.trim()) return;
      onSend(fallbackPrompt);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const sendButton = target?.closest("button[aria-label='Send message']");
      if (!sendButton) return;
      const field = root.querySelector("input, textarea") as HTMLInputElement | HTMLTextAreaElement | null;
      if (field && field.value.trim()) return;
      event.preventDefault();
      event.stopPropagation();
      activateIfEmpty();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.shiftKey) return;
      const field = root.querySelector("input, textarea") as HTMLInputElement | HTMLTextAreaElement | null;
      if (field && field.value.trim()) return;
      event.preventDefault();
      event.stopPropagation();
      activateIfEmpty();
    };

    root.addEventListener("click", onClick, true);
    root.addEventListener("keydown", onKeyDown, true);
    return () => {
      root.removeEventListener("click", onClick, true);
      root.removeEventListener("keydown", onKeyDown, true);
    };
  }, [fallbackPrompt, onSend]);

  return (
    <div ref={rootRef}>
      <InteractivePromptBar
        {...props}
        previewText={previewText}
        libraryAffordance="bubbles"
        onLibrary={handleBubbleOpen}
        onSend={handleSend}
      />
      <LandingBubblesOverlay open={bubblesOpen} onClose={() => setBubblesOpen(false)} />
    </div>
  );
}
