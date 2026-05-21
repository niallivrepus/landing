import * as React from "react";

import { type Variants, motion } from "motion/react";

import { useTheme } from "../../hooks/use-theme";
import { useHaptics } from "../../hooks/use-haptics";
import { useShouldAnimate } from "../../hooks/use-reduced-motion";
import { getSpringTransition } from "../../lib/utils/animations";
import { cn } from "../../lib/utils/cn";
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
  onClick,
  className,
  disabled,
  ...props
}: ActionButtonProps) {
  const { isDarkMode } = useTheme();
  const haptics = useHaptics();
  const shouldAnimate = useShouldAnimate();
  const [isHovered, setIsHovered] = React.useState(false);

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
        !isDarkMode && "liquid-glass",
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
      disabled={disabled}
      data-slot="action-button"
      {...(props as any)}
    >
      {/* Inner pill — 40x54, rotated, glass morphism */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 40,
          height: 54,
          borderRadius: 999,
          border: "2px solid var(--color-light-glass-20)",
          background: isHovered
            ? "var(--color-light-glass-10)"
            : "var(--color-light-glass-5)",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          boxShadow: "0 1px 1px 0 rgba(255, 255, 255, 0.15) inset, 0 2px 3px 0 rgba(255, 255, 255, 0.15) inset",
          transform: `rotate(${rotation}deg)`,
          transition: "background 0.15s ease",
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
      </div>

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
              boxShadow: "inset 0px 1px 1px rgba(255, 255, 255, 0.15)",
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
                x: [5, 1.8, -2.5, -5.3, -5, -1.8, 2.5, 5.3, 5],
                y: [5, 5.3, 2.5, -1.8, -5, -5.3, -2.5, 1.8, 5],
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
