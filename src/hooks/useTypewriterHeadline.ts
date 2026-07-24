import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Per-character delay — 24 chars × 58ms ≈ 1.39s total (within 1.2–1.8s target). */
export const TYPEWRITER_CHAR_DELAY_MS = 58;

export type TypewriterHeadlinePhase = "typing" | "complete";

export type TypewriterHeadlineState = {
  /** Visible substring while typing; full string when complete or reduced-motion. */
  displayText: string;
  /** `typing` while characters reveal; `complete` after the full headline is shown. */
  phase: TypewriterHeadlinePhase;
  /** True when `prefers-reduced-motion: reduce` — skips animation and caret. */
  reduceMotion: boolean;
};

type UseTypewriterHeadlineOptions = {
  /** When false, stays blank until enabled (e.g. after mission intro completes). */
  enabled?: boolean;
};

/**
 * **Purpose:** Reveal a hero headline one character at a time on first mount.
 * **Connects to:** `LandingHeroTypewriter`, `landing-hero-copy.ts`.
 */
export function useTypewriterHeadline(
  text: string,
  { enabled = true }: UseTypewriterHeadlineOptions = {},
): TypewriterHeadlineState {
  const reduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(() =>
    enabled && reduceMotion ? text : "",
  );
  const [phase, setPhase] = useState<TypewriterHeadlinePhase>(() =>
    enabled && reduceMotion ? "complete" : "typing",
  );

  useEffect(() => {
    if (!enabled) {
      setDisplayText("");
      setPhase("typing");
      return;
    }

    if (reduceMotion) {
      setDisplayText(text);
      setPhase("complete");
      return;
    }

    setDisplayText("");
    setPhase("typing");

    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setDisplayText(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(id);
        setPhase("complete");
      }
    }, TYPEWRITER_CHAR_DELAY_MS);

    return () => window.clearInterval(id);
  }, [text, reduceMotion, enabled]);

  return { displayText, phase, reduceMotion: !!reduceMotion };
}
