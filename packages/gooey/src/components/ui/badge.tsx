import * as React from "react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../hooks/use-theme";

/**
 * Badge — pill-shaped label with glass morphism.
 *
 * Colors map to the energy-scale design tokens (--color-{name}-{1..4}).
 * Two variants: outline (colored border + text on dark bg) and filled (colored bg + contrasting text).
 * Three content types: text, icon, icon-text.
 * Two sizes: default (24px) and tag (32px, used in Active Calls).
 */

type BadgeColor = "red" | "blue" | "green" | "yellow" | "purple" | "neutral";
type BadgeVariant = "outline" | "filled";
type BadgeType = "text" | "icon" | "icon-text";
type BadgeSize = "default" | "tag";

interface BadgeProps {
  label?: string;
  color?: BadgeColor;
  variant?: BadgeVariant;
  type?: BadgeType;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
}

// Color token mapping: [outlineBg, outlineBorder, outlineText, filledBg, filledText]
// Dark mode uses original glass tokens; light mode neutral uses white bg + gray border + dark text
const COLOR_MAP_DARK: Record<BadgeColor, [string, string, string, string, string]> = {
  red: [
    "var(--color-red-1)",
    "var(--color-red-3)",
    "var(--color-red-4)",
    "var(--color-red-4)",
    "white",
  ],
  blue: [
    "var(--color-blue-1)",
    "var(--color-blue-3)",
    "var(--color-blue-4)",
    "var(--color-blue-4)",
    "white",
  ],
  green: [
    "var(--color-green-1)",
    "var(--color-green-3)",
    "var(--color-green-4)",
    "var(--color-green-4)",
    "black",
  ],
  yellow: [
    "var(--color-yellow-1)",
    "var(--color-yellow-3)",
    "var(--color-yellow-4)",
    "var(--color-yellow-4)",
    "black",
  ],
  purple: [
    "var(--color-purple-1)",
    "var(--color-purple-3)",
    "var(--color-purple-4)",
    "var(--color-purple-4)",
    "white",
  ],
  neutral: [
    "var(--color-light-glass-20)",
    "var(--color-light-glass-40)",
    "white",
    "var(--color-light-glass-20)",
    "white",
  ],
};

const COLOR_MAP_LIGHT_NEUTRAL: [string, string, string, string, string] = [
  "white",
  "rgba(0, 0, 0, 0.15)",
  "rgba(0, 0, 0, 0.7)",
  "white",
  "rgba(0, 0, 0, 0.7)",
];

const SHARED_SHADOW =
  "0px 1px 4px 0px rgba(0,0,0,0.1), inset 0px 2px 4px 0px rgba(255,255,255,0.15)";
const TEXT_SHADOW =
  "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px white";

export function Badge({
  label,
  color = "neutral",
  variant = "outline",
  type = "text",
  size = "default",
  icon,
  className,
}: BadgeProps) {
  const { isDarkMode } = useTheme();
  const colorMap = (!isDarkMode && color === "neutral") ? COLOR_MAP_LIGHT_NEUTRAL : COLOR_MAP_DARK[color];
  const [outlineBg, outlineBorder, outlineText, filledBg, filledText] = colorMap;

  const isOutline = variant === "outline";
  const isIconOnly = type === "icon";
  const isTag = size === "tag";

  const bg = isOutline ? outlineBg : filledBg;
  const textColor = isOutline ? outlineText : filledText;
  const border = isOutline ? outlineBorder : "transparent";

  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center justify-center rounded-full border backdrop-blur-[25px] font-mono text-xs font-normal leading-none select-none",
        // Size & type-specific dimensions
        isIconOnly
          ? isTag ? "size-8" : "size-6"
          : type === "icon-text"
            ? isTag
              ? "h-8 pl-2 pr-3 gap-1"
              : "h-6 pl-1.5 pr-2.5 gap-0.5"
            : isTag
              ? "h-8 px-3"
              : "h-6 px-2.5",
        className,
      )}
      style={{
        backgroundColor: bg,
        borderColor: border,
        color: textColor,
        boxShadow: SHARED_SHADOW,
        textShadow: TEXT_SHADOW,
        fontSize: "12px",
      }}
    >
      {(type === "icon" || type === "icon-text") && icon && (
        <span className="flex items-center justify-center size-4 shrink-0">{icon}</span>
      )}
      {(type === "text" || type === "icon-text") && label && (
        <span>{label}</span>
      )}
    </span>
  );
}
