import * as React from "react";

import { useHaptics } from "../../hooks/use-haptics";
import { GooeyGlass } from "./gooey-glass";

/**
 * ActionCircleButton — 42×42px icon-only circle button with glass morphism.
 *
 * Used for call actions (join/exit), notifications (silent), counters,
 * connections (connect/disconnect), and approvals (approve/decline).
 *
 * Two variants:
 *   standard  — passive (white) ↔ active (energy-colored) toggle
 *   secondary — dark energy bg with colored border, pressed = bright fill
 */

type Energy = "red" | "green" | "purple" | "orange";

interface EnergyConfig {
  dark1: string;
  dark2: string;
  bright: string;
  accent: string;
  activeIconColor: string;
}

const ENERGY_MAP: Record<Energy, EnergyConfig> = {
  red: {
    dark1: "var(--color-red-1)",
    dark2: "var(--color-red-2)",
    bright: "var(--color-red-4)",
    accent: "var(--color-red-5)",
    activeIconColor: "#FFFFFF",
  },
  green: {
    dark1: "var(--color-green-1)",
    dark2: "var(--color-green-2)",
    bright: "var(--color-green-4)",
    accent: "var(--color-green-5)",
    activeIconColor: "#FFFFFF",
  },
  purple: {
    dark1: "var(--color-purple-1)",
    dark2: "var(--color-purple-2)",
    bright: "var(--color-purple-4)",
    accent: "var(--color-purple-5)",
    activeIconColor: "#FFFFFF",
  },
  orange: {
    dark1: "var(--color-orange-1)",
    dark2: "var(--color-orange-2)",
    bright: "var(--color-orange-4)",
    accent: "var(--color-orange-5)",
    activeIconColor: "#FFFFFF",
  },
};

/** Simplified crypto token SVG paths (20×20 viewBox, fill currentColor). */
const CRYPTO_TOKENS: { name: string; d: string }[] = [
  { name: "Bitcoin", d: "M14.5 8.5c.3-1.8-1.1-2.8-3-3.4l.6-2.5-1.5-.4-.6 2.4c-.4-.1-.8-.2-1.2-.3l.6-2.4-1.5-.4-.6 2.5c-.3-.1-.6-.2-1-.2l-2-.5-.4 1.6s1.1.3 1.1.3c.6.2.7.6.7 1l-.7 2.8c0 0 .1 0 .1 0l-.1 0-1 4c-.1.2-.3.5-.7.4 0 0-1.1-.3-1.1-.3L2 12.9l1.9.5c.4.1.7.2 1 .3l-.6 2.5 1.5.4.6-2.5c.4.1.8.2 1.2.3l-.6 2.5 1.5.4.6-2.5c2.6.5 4.5.3 5.3-2 .7-1.9 0-2.9-1.4-3.6 1-.2 1.7-1 1.9-2.4zm-3.4 4.8c-.5 2-3.8.9-4.9.6l.9-3.5c1.1.3 4.5.8 4 2.9zm.5-4.8c-.4 1.8-3.2.9-4.1.7l.8-3.2c.9.2 3.8.6 3.3 2.5z" },
  { name: "Ethereum", d: "M10 1L4.5 10.2 10 13.4l5.5-3.2L10 1zm-5.5 10.8L10 19l5.5-7.2L10 15l-5.5-3.2z" },
  { name: "Solana", d: "M4.2 14.3c.1-.1.3-.2.5-.2h11.6c.3 0 .5.4.3.6l-2.1 2.1c-.1.1-.3.2-.5.2H2.4c-.3 0-.5-.4-.3-.6l2.1-2.1zm0-11.2c.1-.1.3-.2.5-.2h11.6c.3 0 .5.4.3.6l-2.1 2.1c-.1.1-.3.2-.5.2H2.4c-.3 0-.5-.4-.3-.6L4.2 3.1zm11.6 4c-.1-.1-.3-.2-.5-.2H3.7c-.3 0-.5.4-.3.6l2.1 2.1c.1.1.3.2.5.2h11.6c.3 0 .5-.4.3-.6l-2.1-2.1z" },
  { name: "Avalanche", d: "M15.4 14.5H17c.4 0 .6-.2.6-.4 0-.1 0-.2-.1-.3L11 3.3c-.2-.3-.5-.3-.7 0L8.5 6.5c-.1.2-.1.4 0 .6l3.4 5.8-1.3 2.2c-.1.2-.1.4 0 .6.1.1.2.2.4.2h1.6c.3 0 .5-.1.6-.3l.7-1.2 1.5.1zm-6.3 0H3c-.4 0-.6-.2-.6-.4 0-.1 0-.2.1-.3L9.1 3.3c.2-.3.5-.3.7 0l1 1.7-3.5 6.1-.7 1.2h5.8c.3 0 .5.1.6.3l-3.9-.1z" },
  { name: "XRP", d: "M5.3 3h-2l3.9 3.8c1.6 1.5 4 1.5 5.6 0L16.7 3h-2l-3 2.9c-.9.9-2.4.9-3.4 0L5.3 3zm0 14h-2l3.9-3.8c1.6-1.5 4-1.5 5.6 0L16.7 17h-2l-3-2.9c-.9-.9-2.4-.9-3.4 0L5.3 17z" },
  { name: "Toncoin", d: "M10 2L3 7.5l2.5 8.5h9L17 7.5 10 2zm0 2.5l4.5 4H5.5L10 4.5zm-3.5 6h7l-1.5 5h-4l-1.5-5z" },
];

/** Renders a random crypto token SVG icon (stable per mount). */
export function CryptoTokenIcon() {
  const token = React.useMemo(
    () => CRYPTO_TOKENS[Math.floor(Math.random() * CRYPTO_TOKENS.length)],
    [],
  );
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" aria-label={token.name}>
      <path d={token.d} />
    </svg>
  );
}

export interface ActionCircleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon (rendered in 20×20 container). Ignored when count is set. */
  icon?: React.ReactNode;
  /** Diameter in pixels (default 44) */
  size?: number;
  /** "standard" = passive/active toggle. "secondary" = dark bg + colored border. */
  variant?: "standard" | "secondary";
  /** Energy color: red, green, purple, or orange */
  energy?: Energy;
  /** Standard variant only: shows colored active state when true */
  active?: boolean;
  /** Counter mode: shows number instead of icon */
  count?: number;
  /** Custom gradient bg for active state (e.g. Connect button) */
  gradient?: string;
  /** Pin to hover appearance for showcase */
  forceHover?: boolean;
  /** Pin to pressed appearance for showcase */
  forceActive?: boolean;
  /** Accessible label — required for icon-only buttons (WCAG 4.1.2) */
  "aria-label"?: string;
}

export function ActionCircleButton({
  icon,
  size = 44,
  variant = "standard",
  energy = "green",
  active = false,
  count,
  gradient,
  onClick,
  forceHover,
  forceActive,
  ...props
}: ActionCircleButtonProps) {
  const haptics = useHaptics();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const config = ENERGY_MAP[energy];

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

  const { style, iconColor, textShadow } = React.useMemo(() => {
    const base: React.CSSProperties = {
      width: size,
      height: size,
      borderRadius: 999,
      boxShadow: "0px 1px 4px rgba(0,0,0,0.16)",
      ...(pinned ? { pointerEvents: "none" as const } : {}),
    };

    let color: string;
    let shadow: string | undefined;

    if (variant === "secondary") {
      // Secondary: dark energy bg + colored border
      if (effectiveActive) {
        // Pressed: bright fill, dark icon
        return {
          style: {
            ...base,
            background: config.bright,
            border: `1px solid ${config.accent}`,
          },
          iconColor: config.dark1,
          textShadow: undefined,
        };
      }
      if (effectiveHover) {
        // Hover: slightly brighter bg, white icon
        return {
          style: {
            ...base,
            background: config.dark2,
            border: `1px solid ${config.accent}`,
          },
          iconColor: "#FFFFFF",
          textShadow: undefined,
        };
      }
      // Default: dark bg, colored border, white icon
      return {
        style: {
          ...base,
          background: config.dark1,
          border: `1px solid ${config.accent}`,
        },
        iconColor: "#FFFFFF",
        textShadow: undefined,
      };
    }

    // Standard variant
    if (!active) {
      // Passive state (white bg, gray icon)
      color = "#757575";
      return {
        style: {
          ...base,
          background: "#FFFFFF",
          border: "1px solid rgba(0,0,0,0.1)",
        },
        iconColor: color,
        textShadow: undefined,
      };
    }

    // Active states
    if (effectiveActive) {
      // Pressed (white bg, black icon)
      color = "#000000";
      return {
        style: {
          ...base,
          background: "#FFFFFF",
          border: "1px solid rgba(0,0,0,0.1)",
        },
        iconColor: color,
        textShadow: undefined,
      };
    }

    if (effectiveHover) {
      // Hover (energy bg, brighter border)
      color = config.activeIconColor;
      shadow = config.activeIconColor === "#000000" ? undefined :
        "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px white";
      return {
        style: {
          ...base,
          background: gradient || config.bright,
          border: "1px solid rgba(255,255,255,0.3)",
        },
        iconColor: color,
        textShadow: shadow,
      };
    }

    // Active default
    color = config.activeIconColor;
    shadow = config.activeIconColor === "#000000" ? undefined :
      "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px white";
    return {
      style: {
        ...base,
        background: gradient || config.bright,
        border: "1px solid rgba(255,255,255,0.2)",
      },
      iconColor: color,
      textShadow: shadow,
    };
  }, [variant, energy, active, gradient, effectiveHover, effectiveActive, config, pinned, size]);

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
      className="relative flex items-center justify-center shrink-0 cursor-pointer overflow-hidden rounded-full focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
      style={style}
      {...props}
    >
      <GooeyGlass
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        lens={{ width: size, height: size, borderRadius: 999, scale: 10, depth: 1.2, curvature: 2.45, chroma: 0.16, glow: 0.18, edgeHighlight: 0.4 }}
      >
        <span className="block size-full rounded-full" style={{ background: style.background }} />
      </GooeyGlass>
      {count !== undefined ? (
        <span
          className="relative z-10 font-sans font-bold text-[16px] leading-[1.4]"
          style={{ color: iconColor, textShadow }}
        >
          {count}
        </span>
      ) : (
        <span
          className="relative z-10 flex items-center justify-center size-[20px] shrink-0"
          style={{ color: iconColor }}
        >
          {icon}
        </span>
      )}
    </button>
  );
}
