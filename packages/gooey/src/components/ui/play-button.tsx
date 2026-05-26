import * as React from "react";

import { useHaptics } from "../../hooks/use-haptics";
import { cn } from "../../lib/utils";

/**
 * PlayButton — Origin-colored play/pause circle button (40×40).
 *
 * Default: energy-1 fill + origin-1 border, origin-1 icon with glow
 * Hover:   origin gradient fill + light-glass-10 border, black icon
 * Active:  energy-4 fill + light-glass-10 border, black icon
 * Disabled: energy-1 fill, no border, energy-2 icon (dim)
 */

export type PlayButtonOrigin =
  | "fruta"
  | "flame"
  | "solar"
  | "life"
  | "aether"
  | "insight"
  | "spirit";

interface OriginConfig {
  energy1: string;
  energy2: string;
  energy4: string;
  origin1: string;
  gradient: string;
  glowInner: string; // 60% opacity — for icon glow
  glowOuter: string; // 15% opacity — for icon glow
  /** Default-state icon color — origin-1 for each origin. */
  iconColor: string;
  /** Hover-state icon color. Dark for bright origins (solar, life); white for the rest. */
  hoverIconColor: string;
}

const ORIGIN_CONFIG: Record<PlayButtonOrigin, OriginConfig> = {
  fruta: {
    energy1: "var(--color-red-1)",
    energy2: "var(--color-red-2)",
    energy4: "var(--color-red-4)",
    origin1: "var(--color-origin-fruta-1)",
    gradient: "var(--gradient-fruta)",
    glowInner: "rgba(203, 11, 3, 0.6)",
    glowOuter: "rgba(203, 11, 3, 0.15)",
    iconColor: "var(--color-origin-fruta-1)",
    hoverIconColor: "#fff",
  },
  flame: {
    energy1: "var(--color-orange-1)",
    energy2: "var(--color-orange-2)",
    energy4: "var(--color-orange-4)",
    origin1: "var(--color-origin-flame-1)",
    gradient: "var(--gradient-flame)",
    glowInner: "rgba(255, 77, 0, 0.6)",
    glowOuter: "rgba(255, 77, 0, 0.15)",
    iconColor: "var(--color-origin-flame-1)",
    hoverIconColor: "#fff",
  },
  solar: {
    energy1: "var(--color-yellow-1)",
    energy2: "var(--color-yellow-2)",
    energy4: "var(--color-yellow-4)",
    origin1: "var(--color-origin-solar-1)",
    gradient: "var(--gradient-solar)",
    glowInner: "rgba(255, 157, 0, 0.6)",
    glowOuter: "rgba(255, 157, 0, 0.15)",
    iconColor: "var(--color-origin-solar-1)",
    hoverIconColor: "var(--color-dark-space)",
  },
  life: {
    energy1: "var(--color-green-1)",
    energy2: "var(--color-green-2)",
    energy4: "var(--color-green-4)",
    origin1: "var(--color-origin-life-1)",
    gradient: "var(--gradient-life)",
    glowInner: "rgba(119, 255, 0, 0.6)",
    glowOuter: "rgba(119, 255, 0, 0.15)",
    iconColor: "var(--color-origin-life-1)",
    hoverIconColor: "var(--color-dark-space)",
  },
  aether: {
    energy1: "var(--color-blue-1)",
    energy2: "var(--color-blue-2)",
    energy4: "var(--color-blue-4)",
    origin1: "var(--color-origin-aether-1)",
    gradient: "var(--gradient-aether)",
    glowInner: "rgba(0, 47, 255, 0.6)",
    glowOuter: "rgba(0, 47, 255, 0.15)",
    iconColor: "var(--color-origin-aether-1)",
    hoverIconColor: "#fff",
  },
  insight: {
    energy1: "var(--color-purple-1)",
    energy2: "var(--color-purple-2)",
    energy4: "var(--color-purple-4)",
    origin1: "var(--color-origin-insight-1)",
    gradient: "var(--gradient-insight)",
    glowInner: "rgba(119, 0, 255, 0.6)",
    glowOuter: "rgba(119, 0, 255, 0.15)",
    iconColor: "var(--color-origin-insight-1)",
    hoverIconColor: "#fff",
  },
  spirit: {
    energy1: "var(--color-pink-1)",
    energy2: "var(--color-pink-2)",
    energy4: "var(--color-pink-4)",
    origin1: "var(--color-origin-spirit-1)",
    gradient: "var(--gradient-spirit)",
    glowInner: "rgba(255, 0, 217, 0.6)",
    glowOuter: "rgba(255, 0, 217, 0.15)",
    iconColor: "var(--color-origin-spirit-1)",
    hoverIconColor: "#fff",
  },
};

export interface PlayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  origin?: PlayButtonOrigin;
  icon?: React.ReactNode;
  /** Pin to a visual state for showcase */
  forceState?: "hover" | "active";
  /** Force a dark shell treatment regardless of app theme */
  forceTheme?: "default" | "dark";
  /** Controlled playing state. When provided, the component is controlled. */
  isPlaying?: boolean;
  /** Called when play/pause is toggled */
  onPlayingChange?: (playing: boolean) => void;
}

export function PlayButton({
  origin = "life",
  icon,
  onClick,
  className,
  disabled,
  forceState,
  forceTheme = "default",
  isPlaying: controlledPlaying,
  onPlayingChange,
  children,
  ...props
}: PlayButtonProps) {
  const haptics = useHaptics();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const [internalPlaying, setInternalPlaying] = React.useState(false);
  const config = ORIGIN_CONFIG[origin];

  const isControlled = controlledPlaying !== undefined;
  const playing = isControlled ? controlledPlaying : internalPlaying;

  const pinned = !!forceState;
  const effectiveHover = forceState === "hover" || (!pinned && !disabled && isHovered);
  const effectiveActive = forceState === "active" || (!pinned && !disabled && isActive);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      haptics.light();
      const next = !playing;
      if (!isControlled) setInternalPlaying(next);
      onPlayingChange?.(next);
      onClick?.(e);
    },
    [onClick, haptics, playing, isControlled, onPlayingChange],
  );

  // Icon glow shadow — only in default state
  const showGlow = !effectiveHover && !effectiveActive && !disabled;
  const iconGlow = showGlow
    ? `0px 0px 4px 0px ${config.glowInner}, 0px 0px 16.667px 0px ${config.glowOuter}`
    : "none";

  const style = React.useMemo((): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: "999px",
      boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.1)",
      ...(pinned ? { pointerEvents: "none" as const } : {}),
    };

    if (disabled && !pinned) {
      return {
        ...base,
        background: config.energy1,
        border: "2px solid transparent",
        color: config.energy2,
        cursor: "default",
      };
    }

    if (effectiveActive) {
      return {
        ...base,
        background: config.energy4,
        border: "none",
        outline: "none",
        color: "var(--color-dark-space)",
      };
    }

    if (effectiveHover) {
      return {
        ...base,
        background: config.gradient,
        border: "none",
        outline: "none",
        color: config.hoverIconColor,
      };
    }

    return {
      ...base,
      background: config.energy1,
      border: `2px solid ${config.origin1}`,
      color: config.iconColor,
    };
  }, [effectiveHover, effectiveActive, disabled, config, pinned]);

  const resolvedStyle = React.useMemo((): React.CSSProperties => {
    if (forceTheme !== "dark") {
      return style;
    }

    return {
      ...style,
      background: "var(--color-dark-space)",
      border: "2px solid rgba(255,255,255,0.08)",
      color: config.energy4,
      boxShadow: "none",
    };
  }, [config.energy4, forceTheme, style]);

  const defaultPlayIcon = (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.804a1 1 0 0 1 1.53-.848l8.4 5.196a1 1 0 0 1 0 1.696l-8.4 5.196A1 1 0 0 1 4 13.196V2.804Z" />
    </svg>
  );

  const defaultPauseIcon = (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="2" width="4" height="12" rx="1" />
      <rect x="9" y="2" width="4" height="12" rx="1" />
    </svg>
  );

  const defaultIcon = playing ? defaultPauseIcon : defaultPlayIcon;

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
        "inline-flex items-center justify-center rounded-full cursor-pointer size-10",
        className,
      )}
      style={resolvedStyle}
      disabled={disabled}
      data-slot="play-button"
      {...props}
    >
      <span
        className="flex items-center justify-center size-4"
        style={{ filter: showGlow ? `drop-shadow(0px 0px 4px ${config.glowInner}) drop-shadow(0px 0px 8px ${config.glowOuter})` : "none" }}
      >
        {icon ?? children ?? defaultIcon}
      </span>
    </button>
  );
}
