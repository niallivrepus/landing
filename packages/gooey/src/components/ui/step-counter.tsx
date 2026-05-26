import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { getOriginHexes } from "../../lib/design-colors";

/**
 * Step Counter - Animated progress indicator with bouncy fill animation
 *
 * Features:
 * - Animated bar that fills from left to right
 * - Bouncy spring animations for playful feel
 * - Supports all origin colors (life, aether, fruta, flame, solar, insight, spirit)
 * - Glass container with rimlight effects
 *
 * Size: 72×40px (fixed)
 *
 * Usage:
 * ```tsx
 * // Uncontrolled (cycles through steps automatically)
 * <StepCounter />
 *
 * // Controlled with specific step (1-5)
 * <StepCounter step={currentStep} color="life" />
 *
 * // With percentage (0-100)
 * <StepCounter percentage={75} color="aether" />
 * ```
 */

type OriginColor = "life" | "aether" | "fruta" | "flame" | "solar" | "insight" | "spirit";

interface StepCounterProps {
  /**
   * Current step (1-5)
   * @default 1
   */
  step?: 1 | 2 | 3 | 4 | 5;
  /**
   * Alternative: percentage (0-100)
   */
  percentage?: number;
  /**
   * Origin color theme
   * @default "life"
   */
  color?: OriginColor;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Optional inline styles merged onto the root element
   */
  style?: React.CSSProperties;
}

// Bar configurations for each step
// Position and size values create smooth progression from small circle to full pill
const STEP_CONFIGS = {
  1: { left: -34, width: 32, height: 32 }, // Small circle, mostly off-screen
  2: { left: -14, width: 42, height: 40 }, // Growing circle
  3: { left: -16, width: 60, height: 40 }, // Medium pill
  4: { left: -12, width: 69, height: 40 }, // Large pill
  5: { left: -2, width: 72, height: 40 }, // Full fill
} as const;

function StepCounter({
  step = 1,
  percentage,
  color = "life",
  className,
  style: styleProp,
}: StepCounterProps) {
  // Convert percentage to step if provided
  const currentStep = React.useMemo(() => {
    if (percentage !== undefined) {
      if (percentage <= 0) return 1;
      if (percentage <= 20) return 1;
      if (percentage <= 40) return 2;
      if (percentage <= 60) return 3;
      if (percentage <= 80) return 4;
      return 5;
    }
    return step;
  }, [percentage, step]);

  const config = STEP_CONFIGS[currentStep];

  // Get gradient colors from origin
  const originColors = getOriginHexes(color);
  const gradient = originColors
    ? `linear-gradient(180deg, ${originColors["1"]} 0%, ${originColors["2"]} 100%)`
    : "linear-gradient(180deg, #77FF00 0%, #D8FF3D 100%)";

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        width: 72,
        height: 40,
        borderRadius: 999,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "2px solid rgba(255, 255, 255, 0.1)",
        ...styleProp,
      }}
      data-slot="step-counter"
    >
      {/* Animated fill bar */}
      <motion.div
        className="absolute"
        style={{
          top: "50%",
          borderRadius: currentStep === 2 ? 999 : 99,
          background: gradient,
        }}
        initial={false}
        animate={{
          left: config.left,
          width: config.width,
          height: config.height,
          y: "-50%",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.8,
        }}
      >
        {/* Gradient overlay with plus-lighter blend */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "inherit",
            mixBlendMode: "plus-lighter",
          }}
        />
        {/* Inner rimlight */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "inherit",
            boxShadow: "inset 0px 2px 2px 0px rgba(255, 255, 255, 0.15)",
          }}
        />
      </motion.div>

      {/* Container rimlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 999,
          boxShadow: "inset 0px 1px 1px 0px rgba(255, 255, 255, 0.15)",
        }}
      />
    </div>
  );
}

export { StepCounter, type StepCounterProps, type OriginColor };
