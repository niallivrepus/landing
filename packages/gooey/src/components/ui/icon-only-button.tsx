import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

const iconOnlyButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none",
  {
    variants: {
      size: {
        small: "size-10",
        medium: "size-[50px]",
        large: "size-16",
      },
      variant: {
        default: "",
        primary: "",
      },
      state: {
        default: "cursor-pointer",
        hover: "cursor-pointer",
        active: "cursor-pointer",
        inactive: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      size: "medium",
      variant: "default",
      state: "default",
    },
  }
);

interface IconOnlyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconOnlyButtonVariants> {
  /**
   * Icon component or SVG to display
   */
  icon?: React.ReactNode;
  /** Pin to hover appearance for showcase */
  forceHover?: boolean;
  /** Pin to pressed appearance for showcase */
  forceActive?: boolean;
}

const IconOnlyButton = React.forwardRef<HTMLButtonElement, IconOnlyButtonProps>(
  ({ className, size, variant, state, icon, style, forceHover, forceActive, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    const pinned = forceHover || forceActive;
    const effectiveHover = forceHover || (!pinned && isHovered);
    const effectiveActive = forceActive || (!pinned && isActive);

    const isInactive = state === "inactive";
    const isPrimary = variant === "primary";

    /**
     * Get icon color based on effective state
     */
    const getIconColor = (): string => {
      if (isInactive) return "var(--color-smoke-3)";
      if (isPrimary) {
        if (effectiveActive) return "var(--color-light-space)";
        return "var(--color-dark-space)";
      }
      if (effectiveActive) return "var(--color-dark-space)";
      return "var(--color-light-space)";
    };

    /**
     * Get background and border styles based on effective state
     */
    const getStateStyles = (): React.CSSProperties => {
      const baseShadow =
        "0px 1px 4px rgba(0, 0, 0, 0.1), inset 0px 1px 1px rgba(255, 255, 255, 0.15), inset 0px 2px 3px rgba(255, 255, 255, 0.15)";
      const bMain =
        "var(--icon-only-button-border-width) solid var(--icon-only-button-border)";
      const bSoft =
        "var(--icon-only-button-border-width) solid var(--icon-only-button-border-soft)";

      if (isInactive) {
        return isPrimary
          ? { backgroundColor: "var(--color-light-glass-30)", border: bSoft, boxShadow: baseShadow }
          : { backgroundColor: "var(--color-light-glass-5)", border: bMain, boxShadow: baseShadow };
      }
      if (effectiveActive) {
        return isPrimary
          ? { backgroundColor: "var(--color-dark-space)", border: bMain, boxShadow: baseShadow }
          : { backgroundColor: "var(--color-light-space)", border: bSoft, boxShadow: baseShadow };
      }
      if (effectiveHover) {
        return isPrimary
          ? { backgroundColor: "var(--color-light-glass-90)", border: bSoft, boxShadow: baseShadow }
          : { backgroundColor: "var(--color-light-glass-20)", border: bMain, boxShadow: baseShadow };
      }
      return isPrimary
        ? { backgroundColor: "var(--color-light-space)", border: bSoft, boxShadow: baseShadow }
        : { backgroundColor: "var(--color-light-glass-5)", border: bMain, boxShadow: baseShadow };
    };

    const mergedStyle: React.CSSProperties = {
      ...getStateStyles(),
      ...style,
      color: getIconColor(),
      ...(pinned ? { pointerEvents: "none" as const } : {}),
    };

    return (
      <button
        ref={ref}
        className={cn(iconOnlyButtonVariants({ size, variant, state: isInactive ? "inactive" : "default", className }))}
        style={mergedStyle}
        data-slot="icon-only-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        disabled={isInactive}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconOnlyButton.displayName = "IconOnlyButton";

export { IconOnlyButton, iconOnlyButtonVariants, type IconOnlyButtonProps };
