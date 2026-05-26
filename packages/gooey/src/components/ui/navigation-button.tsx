import * as React from "react";

import { type Variants, motion } from "motion/react";

import { useTheme } from "../../hooks/use-theme";
import { useHaptics } from "../../hooks/use-haptics";
import { getSpringTransition } from "../../lib/utils/animations";
import { cn } from "../../lib/utils/cn";

const navigationButtonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.06,
    transition: { type: "spring" as const, damping: 30, stiffness: 800 },
  },
  tap: {
    scale: 0.92,
    transition: { type: "spring" as const, damping: 30, stiffness: 900 },
  },
};

export interface NavigationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction?: "left" | "right";
  /** Pin to hover or active scale (for showcase) */
  forceState?: "hover" | "active";
}

/**
 * NavigationButton - Tall, narrow glass pill with a centered chevron icon.
 * Used for directional navigation (back/forward).
 */
export function NavigationButton({
  direction = "left",
  onClick,
  className,
  disabled,
  forceState,
  ...props
}: NavigationButtonProps) {
  const { isDarkMode } = useTheme();
  const haptics = useHaptics();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      haptics.light();
      onClick?.(e);
    },
    [onClick, haptics, disabled],
  );

  const baseStyle: React.CSSProperties = {
    width: 24,
    height: 54,
    borderRadius: "999px",
    outline: "2px solid var(--glass-light-glass-20, rgba(255, 255, 255, 0.20))",
    outlineOffset: "-2px",
    background: "var(--glass-light-glass-5, rgba(255, 255, 255, 0.05))",
    backdropFilter: "blur(25px)",
    WebkitBackdropFilter: "blur(25px)",
    boxShadow:
      "0px 1px 4px rgba(0, 0, 0, 0.1), inset 0px 2px 4px rgba(255, 255, 255, 0.15)",
    ...(disabled ? { opacity: 0.4, cursor: "default" } : {}),
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex p-0 justify-center items-center shrink-0 cursor-pointer",
        !isDarkMode && "liquid-glass",
        disabled && "cursor-not-allowed",
        className,
      )}
      style={{ ...baseStyle, ...(forceState ? { pointerEvents: "none" as const } : {}) }}
      variants={navigationButtonVariants}
      initial="initial"
      animate={forceState === "hover" ? "hover" : forceState === "active" ? "tap" : "initial"}
      whileHover={disabled || forceState ? undefined : "hover"}
      whileTap={disabled || forceState ? undefined : "tap"}
      transition={getSpringTransition("microPop")}
      disabled={disabled}
      {...(props as any)}
    >
      <svg
        width={20}
        height={20}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        style={direction === "right" ? { transform: "rotate(180deg)" } : undefined}
      >
        <path
          d="M8.5 10L4.5 6.00001L8.5 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
