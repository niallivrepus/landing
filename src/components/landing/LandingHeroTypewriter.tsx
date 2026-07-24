import { useCallback, useState } from "react";
import { cn } from "@jokuh/gooey";
import { useTypewriterHeadline } from "../../hooks/useTypewriterHeadline";

type LandingHeroTypewriterProps = {
  /** Full headline string — always exposed to assistive tech via `aria-label`. */
  text: string;
  /** When false, defers typing until the mission intro finishes. */
  enabled?: boolean;
};

/**
 * **Purpose:** Homepage hero h1 with a one-shot typewriter reveal and branded caret.
 * **Connects to:** `LandingImmersiveShell`, `landing-home-prompt.css`, `landing-hero-copy.ts`.
 */
export function LandingHeroTypewriter({ text, enabled = true }: LandingHeroTypewriterProps) {
  const { displayText, phase, reduceMotion } = useTypewriterHeadline(text, { enabled });
  const [caretVisible, setCaretVisible] = useState(!reduceMotion);

  const handleCaretAnimationEnd = useCallback(() => {
    if (phase === "complete") {
      setCaretVisible(false);
    }
  }, [phase]);

  return (
    <h1
      className="landing-hero-headline font-sans font-semibold leading-[1.02] tracking-[-0.03em] text-light-space light:text-zinc-950"
      aria-label={text}
    >
      <span aria-hidden="true">
        {displayText}
        {enabled && !reduceMotion && caretVisible ? (
          <span
            className={cn(
              "landing-hero-typewriter-caret",
              phase === "typing" && "landing-hero-typewriter-caret--typing",
              phase === "complete" && "landing-hero-typewriter-caret--complete",
            )}
            onAnimationEnd={handleCaretAnimationEnd}
          />
        ) : null}
      </span>
    </h1>
  );
}
