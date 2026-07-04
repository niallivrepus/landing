import * as React from "react";

import { type Variants, motion } from "motion/react";

import { useHaptics } from "../../hooks/use-haptics";
import { useShouldAnimate } from "../../hooks/use-reduced-motion";
import { getSpringTransition } from "../../lib/utils/animations";
import { cn } from "../../lib/utils/cn";
import { GooeyGlass } from "./gooey-glass";

export const glassButtonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.08,
    transition: { type: "spring" as const, damping: 30, stiffness: 800 },
  },
  tap: {
    scale: 0.92,
    transition: { type: "spring" as const, damping: 30, stiffness: 900 },
  },
};

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "dark";
  size?: "sm" | "md" | "lg";
  useMotion?: boolean;
  tooltip?: string;
  /** Pin to hover or active scale (for showcase) */
  forceState?: "hover" | "active";
}

export function GlassButton({
  onClick,
  children,
  className,
  variant = "default",
  size = "md",
  useMotion = true,
  tooltip,
  disabled,
  forceState,
  ...props
}: GlassButtonProps) {
  const haptics = useHaptics();
  const shouldAnimate = useShouldAnimate();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      haptics.light();
      onClick?.(e);
    },
    [onClick, haptics, disabled]
  );

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const baseStyle: React.CSSProperties = {
    borderRadius: "999px",
    border: "none",
    outline: "1px solid var(--color-light-glass-20)",
    outlineOffset: "-2px",
    background: "var(--color-light-glass-10)",
    boxShadow: "0 10px 20px 0 rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255,255,255,0.32)",
    ...(disabled ? { opacity: 0.4, cursor: "default" } : {}),
  };

  const disabledClass = disabled && "cursor-not-allowed";

  const buttonContent = (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative flex p-0 justify-center items-center shrink-0 overflow-hidden rounded-full cursor-pointer focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none",
        "liquid-glass",
        sizeClasses[size],
        disabledClass,
        className
      )}
      style={baseStyle}
      disabled={disabled}
      {...props}
    >
      <GooeyGlass
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        lens={{ borderRadius: 999, scale: 10, depth: 1.18, curvature: 2.45, chroma: 0.16, glow: 0.18, edgeHighlight: 0.4 }}
      >
        <span className="block size-full rounded-full bg-[var(--color-light-glass-10)]" />
      </GooeyGlass>
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );

  if (!useMotion) {
    return buttonContent;
  }

  const MotionButton = motion.button;
  return (
    <MotionButton
      type="button"
      onClick={handleClick}
      className={cn(
        "relative flex p-0 justify-center items-center shrink-0 overflow-hidden rounded-full cursor-pointer focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none",
        "liquid-glass",
        sizeClasses[size],
        disabledClass,
        className
      )}
      style={{ ...baseStyle, ...(forceState ? { pointerEvents: "none" as const } : {}) }}
      variants={glassButtonVariants}
      initial="initial"
      animate={forceState === "hover" ? "hover" : forceState === "active" ? "tap" : "initial"}
      whileHover={disabled || forceState || !shouldAnimate ? undefined : "hover"}
      whileTap={disabled || forceState || !shouldAnimate ? undefined : "tap"}
      transition={getSpringTransition("microPop")}
      disabled={disabled}
      {...(props as any)}
    >
      <GooeyGlass
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        lens={{ borderRadius: 999, scale: 10, depth: 1.18, curvature: 2.45, chroma: 0.16, glow: 0.18, edgeHighlight: 0.4 }}
      >
        <span className="block size-full rounded-full bg-[var(--color-light-glass-10)]" />
      </GooeyGlass>
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </MotionButton>
  );
}
