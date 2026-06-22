import * as React from "react";

import { type Variants, motion } from "motion/react";

import { useHaptics } from "../../hooks/use-haptics";
import { useShouldAnimate } from "../../hooks/use-reduced-motion";
import { getSpringTransition } from "../../lib/utils/animations";
import { cn } from "../../lib/utils/cn";
import { GooeyGlass } from "./gooey-glass";
import { IconHoverContext } from "./lordicon";

const actionButtonVariants: Variants = {
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

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element (20x20 container). Any HugeIcons icon or custom SVG. */
  icon: React.ReactNode;
  /** Pill tilt: "right" = -45deg (\), "left" = +45deg (/) */
  orientation?: "right" | "left";
  /** Optional notification dot */
  notification?: {
    color: "green" | "red";
    position?: "top-left" | "top-right";
  };
  /** Inner pill width in px (default 40) */
  pillWidth?: number;
  /** Inner pill height in px (default 54) */
  pillHeight?: number;
  /** Border thickness in px (default 1) */
  strokeWidth?: number;
  /** Accessible label — required for icon-only buttons (WCAG 4.1.2) */
  "aria-label"?: string;
}

/**
 * ActionButton — 50x50 glass-morphism button with a rotated inner pill (40x54)
 * and counter-rotated icon (20x20). The most important button on the platform,
 * used throughout the spine, corner navigation, and key interactions.
 */
export function ActionButton({
  icon,
  orientation = "right",
  notification,
  pillWidth = 40,
  pillHeight = 54,
  strokeWidth = 1,
  onClick,
  className,
  disabled,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  onKeyDown,
  onKeyUp,
  ...props
}: ActionButtonProps) {
  const haptics = useHaptics();
  const shouldAnimate = useShouldAnimate();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const rotation = orientation === "right" ? -45 : 45;

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      haptics.light();
      // Briefly pulse hover state to replay Lordicon animation on click
      if (!isHovered) {
        setIsHovered(true);
        setTimeout(() => setIsHovered(false), 50);
      }
      onClick?.(e);
    },
    [onClick, haptics, disabled, isHovered],
  );

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!disabled) setIsPressed(true);
      onPointerDown?.(e);
    },
    [disabled, onPointerDown],
  );

  const clearPressed = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onPointerUp?.(e);
    },
    [onPointerUp],
  );

  const handlePointerCancel = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onPointerCancel?.(e);
    },
    [onPointerCancel],
  );

  const handlePointerLeave = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onPointerLeave?.(e);
    },
    [onPointerLeave],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!disabled && (e.key === " " || e.key === "Enter")) setIsPressed(true);
      onKeyDown?.(e);
    },
    [disabled, onKeyDown],
  );

  const handleKeyUp = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onKeyUp?.(e);
    },
    [onKeyUp],
  );

  const dotPosition = notification?.position
    ?? (orientation === "right" ? "top-left" : "top-right");

  const dotPositionStyle: React.CSSProperties =
    dotPosition === "top-left"
      ? { left: 0, top: 0 }
      : { right: -1, top: -1 };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative flex items-center justify-center shrink-0 cursor-pointer rounded-full outline-none",
        disabled && "cursor-not-allowed",
        className,
      )}
      style={{
        width: 50,
        height: 50,
        filter: "drop-shadow(0px 1px 4px rgba(0,0,0,0.1))",
        ...(disabled ? { opacity: 0.4, cursor: "default" } : {}),
      }}
      variants={actionButtonVariants}
      initial="initial"
      whileHover={disabled || !shouldAnimate ? undefined : "hover"}
      whileTap={disabled || !shouldAnimate ? undefined : "tap"}
      transition={getSpringTransition("microPop")}
      onHoverStart={() => !disabled && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={clearPressed}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      disabled={disabled}
      data-slot="action-button"
      {...(props as any)}
    >
      {/* Inner pill — rotated glass morphism (default 40x54) */}
      <GooeyGlass
        className="flex items-center justify-center shrink-0"
        lens={{
          width: pillWidth,
          height: pillHeight,
          borderRadius: 999,
          scale: 8,
          depth: 1.25,
          curvature: 2.55,
          chroma: 0.16,
          glow: 0.18,
          edgeHighlight: 0.42,
        }}
        style={{
          width: pillWidth,
          height: pillHeight,
          borderRadius: 999,
          border: `${strokeWidth}px solid var(--color-light-glass-20)`,
          background: isPressed
            ? "var(--color-light-glass-20)"
            : isHovered
              ? "var(--color-light-glass-10)"
              : "var(--color-light-glass-5)",
          boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
          transform: `rotate(${rotation}deg)`,
          transition: "background 0.15s ease, border-color 0.15s ease",
        }}
      >
        {/* Icon container — 20x20, counter-rotated */}
        <span
          className="flex items-center justify-center"
          style={{
            width: 20,
            height: 20,
            transform: `rotate(${-rotation}deg)`,
          }}
        >
          <IconHoverContext.Provider value={isHovered}>
            {icon}
          </IconHoverContext.Provider>
        </span>
      </GooeyGlass>

      {/* Notification dot — 11x11, absolute positioned */}
      {notification && (
        <div
          className="absolute z-10"
          style={{ width: 11, height: 11, ...dotPositionStyle }}
        >
          <div
            className="size-full rounded-full"
            style={{
              backgroundColor:
                notification.color === "green"
                  ? "var(--color-green-4)"
                  : "var(--color-red-4)",
              boxShadow: "none",
            }}
          />
          {isHovered && (
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 3,
                height: 3,
                backgroundColor:
                  notification.color === "green"
                    ? "var(--color-green-4)"
                    : "var(--color-red-4)",
                left: "50%",
                top: "50%",
                marginLeft: -1.5,
                marginTop: -1.5,
              }}
              animate={{
                // wide elliptical orbit — bubbles way further out, saturn-ring style.
                x: [12, 4.4, -6, -13, -12, -4.4, 6, 13, 12],
                y: [7.5, 8, 3.8, -2.7, -7.5, -8, -3.8, 2.7, 7.5],
                opacity: [0, 1, 1, 1, 1, 1, 1, 0.5, 0],
              }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0.1, 1] }}
            />
          )}
        </div>
      )}
    </motion.button>
  );
}
