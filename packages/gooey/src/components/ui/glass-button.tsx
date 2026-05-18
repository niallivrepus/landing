import * as React from "react";

import { type Variants, motion } from "motion/react";

import { useHaptics } from "../../hooks/use-haptics";
import { useShouldAnimate } from "../../hooks/use-reduced-motion";
import { getSpringTransition } from "../../lib/utils/animations";
import { cn } from "../../lib/utils/cn";

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
    outline: "2px solid var(--color-light-glass-20)",
    outlineOffset: "-2px",
    background: "var(--color-light-glass-5)",
    backdropFilter: "blur(25px)",
    WebkitBackdropFilter: "blur(25px)",
    boxShadow:
      "0 1px 1px 0 rgba(255, 255, 255, 0.15) inset, 0 10px 20px 0 rgba(0, 0, 0, 0.10), 0 2px 3px 0 rgba(255, 255, 255, 0.15) inset",
    ...(disabled ? { opacity: 0.4, cursor: "default" } : {}),
  };

  const disabledClass = disabled && "cursor-not-allowed";

  const buttonContent = (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex p-0 justify-center items-center shrink-0 rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none",
        "liquid-glass",
        sizeClasses[size],
        disabledClass,
        className
      )}
      style={baseStyle}
      disabled={disabled}
      {...props}
    >
      {children}
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
        "flex p-0 justify-center items-center shrink-0 rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none",
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
      {children}
    </MotionButton>
  );
}
