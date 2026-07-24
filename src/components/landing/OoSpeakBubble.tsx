import { IncomingMessageBubble, cn } from "@jokuh/gooey";
import type { KeyboardEvent } from "react";
import { useOoSpeak } from "../../hooks/useOoSpeak";

type OoSpeakBubbleProps = {
  /** Full OO line — always exposed via `aria-label` for assistive tech. */
  message: string;
  /** Display name in the bubble chrome (OO / 00). */
  name?: string;
  className?: string;
  showTime?: boolean;
  /**
   * When true (default), types the line out. When false, shows the full string
   * immediately — use for older bubbles that already spoke.
   */
  speak?: boolean;
  /** Pulse / thinking state — skips typewriter and shows the raw message. */
  thinking?: boolean;
  /** Called once when the spoken line finishes. */
  onSpeakComplete?: () => void;
};

/**
 * **Purpose:** Gooey incoming bubble whose body types out like Pokémon NPC dialogue —
 * character-by-character with punctuation pauses and a soft speaking caret.
 * **Connects to:** `useOoSpeak`, `LandingDemoChat`, `MessagesImmersiveShell`, product prompt scenes.
 * Click (or Enter/Space) while speaking to skip to the full line.
 */
export function OoSpeakBubble({
  message,
  name = "OO",
  className,
  showTime = false,
  speak = true,
  thinking = false,
  onSpeakComplete,
}: OoSpeakBubbleProps) {
  const shouldSpeak = speak && !thinking;
  const { displayText, phase, reduceMotion, skip } = useOoSpeak(message, {
    speak: shouldSpeak,
    onComplete: onSpeakComplete,
  });

  const isSpeaking = phase === "speaking" && !reduceMotion;
  const shown = thinking
    ? message
    : isSpeaking
      ? `${displayText}▌`
      : displayText || message;

  const handleSkip = () => {
    if (isSpeaking) skip();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isSpeaking) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      skip();
    }
  };

  return (
    <div
      className={cn(
        "oo-speak-bubble max-w-[85%]",
        isSpeaking && "oo-speak-bubble--speaking",
        className,
      )}
      onClick={handleSkip}
      onKeyDown={handleKeyDown}
      role={isSpeaking ? "button" : undefined}
      tabIndex={isSpeaking ? 0 : undefined}
      aria-label={thinking ? `${name} is thinking` : `${name} says: ${message}`}
      aria-busy={isSpeaking || thinking || undefined}
    >
      <IncomingMessageBubble
        name={name}
        message={shown}
        showTime={showTime}
        className={cn(
          "max-w-none !shadow-none",
          thinking && "animate-pulse",
          isSpeaking && "oo-speak-bubble__body--typing",
        )}
      />
    </div>
  );
}
