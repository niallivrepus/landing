import * as React from "react";

import { useHaptics } from "../../hooks/use-haptics";
import { cn } from "../../lib/utils";

/**
 * SpecialButton — Origin-colored pill button (insight/life/flame).
 *
 * Default: dark energy fill + origin border, white text
 * Hover:   full origin gradient fill + light-glass-20% border
 * Active:  white fill, black text, no visible border
 */

type SpecialOrigin = "insight" | "life" | "flame";

interface OriginConfig {
  fill: string;
  border: string;
  gradient: string;
  hoverText: string;
}

const ORIGIN_CONFIG: Record<SpecialOrigin, OriginConfig> = {
  insight: {
    fill: "var(--color-purple-1)",
    border: "var(--color-origin-insight-1)",
    gradient: "var(--gradient-insight)",
    hoverText: "var(--color-light-space)",
  },
  life: {
    fill: "var(--color-green-1)",
    border: "var(--color-origin-life-1)",
    gradient: "var(--gradient-life)",
    hoverText: "var(--color-dark-space)",
  },
  flame: {
    fill: "var(--color-orange-1)",
    border: "var(--color-origin-flame-1)",
    gradient: "var(--gradient-flame)",
    hoverText: "var(--color-dark-space)",
  },
};

export interface SpecialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  origin?: SpecialOrigin;
  /** Pin to hover appearance (for showcase) */
  forceHover?: boolean;
  /** Pin to active/pressed appearance (for showcase) */
  forceActive?: boolean;
}

export function SpecialButton({
  origin = "insight",
  onClick,
  className,
  children,
  disabled,
  forceHover,
  forceActive,
  ...props
}: SpecialButtonProps) {
  const haptics = useHaptics();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const config = ORIGIN_CONFIG[origin];

  const pinned = forceHover || forceActive;
  const effectiveHover = forceHover || (!pinned && isHovered);
  const effectiveActive = forceActive || (!pinned && isActive);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      haptics.light();
      onClick?.(e);
    },
    [onClick, haptics],
  );

  const style = React.useMemo((): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: "999px",
      backdropFilter: "blur(25px)",
      WebkitBackdropFilter: "blur(25px)",
      boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.1)",
      textShadow: "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px white",
      ...(pinned ? { pointerEvents: "none" as const } : {}),
    };

    if (disabled) {
      return {
        ...base,
        background: config.fill,
        border: `1px solid ${config.border}`,
        color: "var(--color-light-space)",
        opacity: 0.4,
        cursor: "default",
      };
    }

    if (effectiveActive) {
      return {
        ...base,
        background: "var(--color-light-space)",
        border: "1px solid transparent",
        color: "var(--color-dark-space)",
      };
    }

    if (effectiveHover) {
      return {
        ...base,
        background: config.gradient,
        border: "1px solid rgba(255,255,255,0.2)",
        color: config.hoverText,
      };
    }

    return {
      ...base,
      background: config.fill,
      border: `1px solid ${config.border}`,
      color: "var(--color-light-space)",
    };
  }, [effectiveHover, effectiveActive, disabled, config, pinned]);

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      className={cn(
        "inline-flex h-[50px] px-5 items-center justify-center shrink-0 rounded-full font-bold text-sm cursor-pointer",
        className,
      )}
      style={style}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
