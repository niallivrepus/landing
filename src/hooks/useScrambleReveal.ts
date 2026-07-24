import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Letters + digits — case/bank follows the target glyph. */
const SCRAMBLE_GLYPHS_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SCRAMBLE_GLYPHS_LOWER = "abcdefghijklmnopqrstuvwxyz";
const SCRAMBLE_GLYPHS_DIGIT = "0123456789";

export type ScrambleCellState = "locked" | "shimmer" | "pending";

export type ScrambleCell = {
  /** Glyph to render (target letter, shimmer substitute, or space). */
  display: string;
  state: ScrambleCellState;
};

export type ScrambleRevealPhase = "idle" | "scrambling" | "complete";

export type ScrambleRevealState = {
  /** Per-line cells for cinematic opacity / color styling. */
  lines: ScrambleCell[][];
  phase: ScrambleRevealPhase;
  reduceMotion: boolean;
  resolvedCount: number;
};

type UseScrambleRevealOptions = {
  /** When false, stays idle until enabled. */
  enabled?: boolean;
  /** Milliseconds between locking each scrambleable character. */
  stepMs?: number;
  /** How many unresolved glyphs ahead of the cursor keep shimmering. */
  shimmerWindow?: number;
};

/**
 * **Purpose:** Soft 007-style decrypt — a narrow shimmer window locks left→right;
 * the rest of the card stays dim until the cursor arrives (not a full-block matrix).
 * **Connects to:** `MissionIntroOverlay`, `landing-mission-intro.ts`.
 */
export function useScrambleReveal(
  sourceLines: readonly string[],
  { enabled = true, stepMs = 36, shimmerWindow = 3 }: UseScrambleRevealOptions = {},
): ScrambleRevealState {
  const reduceMotion = useReducedMotion();
  const flat = useMemo(() => sourceLines.join("\n"), [sourceLines]);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState<ScrambleRevealPhase>("idle");

  useEffect(() => {
    if (!enabled) {
      setResolvedCount(0);
      setPhase("idle");
      return;
    }

    if (reduceMotion) {
      setResolvedCount(flat.length);
      setPhase("complete");
      return;
    }

    let index = 0;
    let tickCount = 0;
    let lastStepAt = performance.now();
    let lastFlickerAt = performance.now();
    let raf = 0;
    let active = true;

    setResolvedCount(0);
    setPhase("scrambling");

    const loop = (now: number) => {
      if (!active) return;

      // Soft shimmer cadence — slower than a hacker terminal.
      if (now - lastFlickerAt >= 48) {
        lastFlickerAt = now;
        tickCount += 1;
        setTick(tickCount);
      }

      if (now - lastStepAt >= stepMs) {
        lastStepAt = now;
        while (index < flat.length && !isScrambleable(flat[index]!)) {
          index += 1;
        }
        if (index < flat.length) {
          index += 1;
        }
        setResolvedCount(index);
        if (index >= flat.length) {
          setPhase("complete");
          return;
        }
      }

      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);

    return () => {
      active = false;
      window.cancelAnimationFrame(raf);
    };
  }, [enabled, flat, reduceMotion, stepMs]);

  const lines = useMemo(() => {
    if (!enabled && phase === "idle") {
      return sourceLines.map((line) =>
        [...line].map((ch) => ({ display: ch === " " ? " " : "\u00A0", state: "pending" as const })),
      );
    }
    if (reduceMotion || phase === "complete") {
      return sourceLines.map((line) =>
        [...line].map((ch) => ({ display: ch, state: "locked" as const })),
      );
    }
    return buildScrambleCells(sourceLines, resolvedCount, tick, shimmerWindow);
  }, [enabled, phase, reduceMotion, resolvedCount, shimmerWindow, sourceLines, tick]);

  return { lines, phase, reduceMotion: !!reduceMotion, resolvedCount };
}

/** True when the character should pass through the shimmer window before locking. */
function isScrambleable(char: string): boolean {
  return /[A-Za-z0-9]/.test(char);
}

/**
 * Builds per-glyph cells: locked prefix, narrow shimmer veil, dim pending remainder.
 * Newlines in the flat string map 1:1 to `sourceLines` boundaries.
 */
function buildScrambleCells(
  sourceLines: readonly string[],
  resolvedCount: number,
  tick: number,
  shimmerWindow: number,
): ScrambleCell[][] {
  let cursor = 0;
  return sourceLines.map((line) => {
    const cells: ScrambleCell[] = [];
    for (let i = 0; i < line.length; i += 1) {
      const globalIndex = cursor + i;
      const target = line[i]!;
      if (target === " ") {
        cells.push({ display: " ", state: "locked" });
        continue;
      }
      if (globalIndex < resolvedCount) {
        cells.push({ display: target, state: "locked" });
      } else if (globalIndex < resolvedCount + shimmerWindow) {
        const bank = /[0-9]/.test(target)
          ? SCRAMBLE_GLYPHS_DIGIT
          : /[a-z]/.test(target)
            ? SCRAMBLE_GLYPHS_LOWER
            : SCRAMBLE_GLYPHS_UPPER;
        cells.push({
          display: bank[(tick * 11 + globalIndex * 17) % bank.length]!,
          state: "shimmer",
        });
      } else {
        // Reserve width with the true glyph so the card doesn’t reflow; CSS keeps it dim.
        cells.push({ display: target, state: "pending" });
      }
    }
    cursor += line.length + 1;
    return cells;
  });
}
