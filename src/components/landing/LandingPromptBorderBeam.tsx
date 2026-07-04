import { BorderBeam } from "border-beam";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type LandingPromptBorderBeamProps = {
  /** Prompt bar subtree — typically `LandingPromptBar` with Gooey `InteractivePromptBar`. */
  children: ReactNode;
  /** Outer stack class — defaults to home prompt bar shell. */
  className?: string;
};

/** Jokuh brand blue beam tuned for the home hero prompt pill. */
const HOME_PROMPT_BEAM = {
  /** Full perimeter travel (Magic UI style), not bottom-only `line`. */
  size: "md" as const,
  /** Blue-purple palette closest to Jokuh `#0066ff`. */
  colorVariant: "ocean" as const,
  /** Match landing cinema / light theme surfaces. */
  theme: "auto" as const,
  /** Slow, ambient loop — user spec 6–8s. */
  duration: 7,
  /**
   * Exact radius of the Gooey prompt frame (`h-[50px]` `rounded-full` → 25px, and
   * `rounded-[24px]/[25px]` in the focused/expanded frames). Using the real 25px
   * value (instead of `9999`) keeps the packaged base layers on the frame's true
   * corner so the traveling stroke traces the input's own border, not an
   * over-rounded stadium when the frame grows. The `landing-home-prompt.css`
   * override then insets the ring by 1px so it rides *inside* the border groove.
   */
  borderRadius: 25,
  /** Subtle but visible — thin stroke + low bloom. */
  strength: 0.42,
  brightness: 0.78,
  saturation: 1.05,
  /** Keep hue near brand blue instead of rainbow drift. */
  hueRange: 10,
};

/**
 * **Purpose:** Home-only border beam on the Gooey prompt frame — light travels the
 * perimeter via `border-beam`, replacing the rejected CSS conic-gradient spin.
 * **Connects to:** `LandingImmersiveShell`, `landing-home-prompt.css`, `[data-slot="prompt-frame"]`.
 * **Parity:** Decorative only; respects `prefers-reduced-motion` via `active={false}`.
 */
export function LandingPromptBorderBeam({
  children,
  className = "landing-home-prompt-bar",
}: LandingPromptBorderBeamProps) {
  const reduceMotion = useReducedMotion();

  return (
    <BorderBeam
      className={className}
      size={HOME_PROMPT_BEAM.size}
      colorVariant={HOME_PROMPT_BEAM.colorVariant}
      theme={HOME_PROMPT_BEAM.theme}
      duration={HOME_PROMPT_BEAM.duration}
      borderRadius={HOME_PROMPT_BEAM.borderRadius}
      strength={HOME_PROMPT_BEAM.strength}
      brightness={HOME_PROMPT_BEAM.brightness}
      saturation={HOME_PROMPT_BEAM.saturation}
      hueRange={HOME_PROMPT_BEAM.hueRange}
      active={!reduceMotion}
    >
      {children}
    </BorderBeam>
  );
}
