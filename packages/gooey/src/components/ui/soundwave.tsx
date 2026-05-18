import * as React from "react";
import { motion } from "motion/react";

import { cn } from "../../lib/utils";

/**
 * Soundwave - Audio visualization component for music controls
 *
 * Displays animated vertical bars that represent audio input levels.
 * When disabled, bars collapse to zero height. When active, animates between
 * different wave patterns based on decibel levels.
 *
 * Size: 30x27px (fixed)
 */

type SoundwaveColor = "life" | "aether" | "fruta" | "flame" | "solar" | "insight" | "spirit";

interface SoundwaveProps {
  /** Whether the soundwave is disabled (no audio input) */
  disabled?: boolean;
  /** Color theme for active state */
  color?: SoundwaveColor;
  /** Animation intensity level (0-3), controls which pattern is shown */
  level?: 0 | 1 | 2 | 3;
  /** Whether to auto-animate through levels when active */
  animate?: boolean;
  className?: string;
}

// Bar height patterns for each level (9 bars, heights in pixels, max 27)
const BAR_PATTERNS = {
  disabled: [3, 3, 3, 3, 3, 3, 3, 3, 3], // Uniform flat bars when disabled
  low: [3, 3, 9, 19, 21, 15, 9, 3, 3], // Low decibels
  medium: [11, 17, 5, 21, 25, 27, 25, 21, 11], // Medium decibels
  high: [11, 23, 27, 11, 19, 7, 11, 21, 11], // High decibels
};

// Color gradients for each origin color
const COLOR_GRADIENTS: Record<SoundwaveColor, string> = {
  life: "linear-gradient(180deg, #77FF00 0%, #D8FF3D 100%)",
  aether: "linear-gradient(180deg, #002FFF 0%, #3D7EFF 100%)",
  fruta: "linear-gradient(180deg, #CB0B03 0%, #FF0970 100%)",
  flame: "linear-gradient(180deg, #FF4D00 0%, #FFB800 100%)",
  solar: "linear-gradient(180deg, #FF9D00 0%, #F2FF3D 100%)",
  insight: "linear-gradient(180deg, #7700FF 0%, #B200FF 100%)",
  spirit: "linear-gradient(180deg, #FF00D9 0%, #FF58B4 100%)",
};

function Soundwave({
  disabled = false,
  color = "life",
  level = 1,
  animate = true,
  className,
}: SoundwaveProps) {
  const [currentLevel, setCurrentLevel] = React.useState(level);

  // Auto-animate through levels when active
  React.useEffect(() => {
    if (disabled || !animate) {
      setCurrentLevel(level);
      return;
    }

    const interval = setInterval(() => {
      setCurrentLevel((prev) => {
        // Cycle through 1, 2, 3 (skip 0 which is same as low)
        const next = prev >= 3 ? 1 : prev + 1;
        return next as 0 | 1 | 2 | 3;
      });
    }, 150); // Fast animation for responsive feel

    return () => clearInterval(interval);
  }, [disabled, animate, level]);

  // Get current bar heights based on state
  const getBarHeights = (): number[] => {
    if (disabled) return BAR_PATTERNS.disabled;
    switch (currentLevel) {
      case 0:
      case 1:
        return BAR_PATTERNS.low;
      case 2:
        return BAR_PATTERNS.medium;
      case 3:
        return BAR_PATTERNS.high;
      default:
        return BAR_PATTERNS.medium;
    }
  };

  const barHeights = getBarHeights();
  const barBackground = disabled
    ? "rgba(255, 255, 255, 0.2)" // light-glass-20%
    : COLOR_GRADIENTS[color];

  return (
    <div
      className={cn(
        "flex items-center gap-[1.5px]",
        "w-[30px] h-[27px]",
        className
      )}
    >
      {barHeights.map((height, index) => (
        <motion.div
          key={index}
          className="w-[2px] rounded-full shrink-0 relative"
          style={{
            background: barBackground,
          }}
          initial={false}
          animate={{ height }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.5,
          }}
        >
          {/* Inner rim light effect */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: "inset 0px 1px 1px 0px rgba(255, 255, 255, 0.15)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export { Soundwave, type SoundwaveProps, type SoundwaveColor };
