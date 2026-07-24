import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Base delay between characters — RPG-dialogue pace (~28–32 chars/sec peak). */
export const OO_SPEAK_BASE_MS = 28;

/** Extra pause after sentence-ending punctuation so OO feels like it's breathing. */
export const OO_SPEAK_SENTENCE_PAUSE_MS = 220;

/** Extra pause after commas / em-dashes — short catch-breath. */
export const OO_SPEAK_CLAUSE_PAUSE_MS = 90;

export type OoSpeakPhase = "idle" | "speaking" | "complete";

export type OoSpeakState = {
  /** Visible substring while OO is speaking; full string when complete or reduced-motion. */
  displayText: string;
  /** `speaking` while characters reveal; `complete` after the full line is shown. */
  phase: OoSpeakPhase;
  /** True when `prefers-reduced-motion: reduce` — shows full text immediately. */
  reduceMotion: boolean;
  /** Skip remaining characters and show the full line (tap-to-advance parity). */
  skip: () => void;
};

/**
 * **Purpose:** Reveal OO dialogue one character at a time with punctuation pauses
 * (Pokémon-style NPC speech that still feels alive).
 * **Connects to:** `OoSpeakBubble`, `LandingDemoChat`, `MessagesImmersiveShell`, product prompt scenes.
 */
export function useOoSpeak(
  text: string,
  options: {
    /**
     * When true, types the line out. When false, shows the full string immediately
     * (historical bubbles that already “spoke”).
     */
    speak?: boolean;
    /** Fires once when the full line finishes revealing. */
    onComplete?: () => void;
  } = {},
): OoSpeakState {
  const { speak = true, onComplete } = options;
  const reduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(() =>
    reduceMotion || !speak ? text : "",
  );
  const [phase, setPhase] = useState<OoSpeakPhase>(() =>
    reduceMotion || !speak ? "complete" : "idle",
  );
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const skipRequestedRef = useRef(false);

  const skip = useCallback(() => {
    skipRequestedRef.current = true;
    setDisplayText(text);
    setPhase("complete");
    onCompleteRef.current?.();
  }, [text]);

  useEffect(() => {
    skipRequestedRef.current = false;

    if (!speak || reduceMotion) {
      setDisplayText(text);
      setPhase("complete");
      if (speak && reduceMotion) onCompleteRef.current?.();
      return;
    }

    setDisplayText("");
    setPhase("speaking");

    let index = 0;
    let timeoutId = 0;

    const tick = () => {
      if (skipRequestedRef.current) return;

      index += 1;
      setDisplayText(text.slice(0, index));

      if (index >= text.length) {
        setPhase("complete");
        onCompleteRef.current?.();
        return;
      }

      const justTyped = text[index - 1] ?? "";
      let delay = OO_SPEAK_BASE_MS;

      // Slight jitter so it doesn't feel mechanical.
      delay += Math.floor(Math.random() * 12);

      if (/[.!?…]/.test(justTyped)) {
        delay += OO_SPEAK_SENTENCE_PAUSE_MS;
      } else if (/[,;:—–-]/.test(justTyped)) {
        delay += OO_SPEAK_CLAUSE_PAUSE_MS;
      } else if (justTyped === " ") {
        delay += 8;
      }

      timeoutId = window.setTimeout(tick, delay);
    };

    timeoutId = window.setTimeout(tick, 80);

    return () => window.clearTimeout(timeoutId);
  }, [text, speak, reduceMotion]);

  return {
    displayText,
    phase,
    reduceMotion: !!reduceMotion,
    skip,
  };
}
