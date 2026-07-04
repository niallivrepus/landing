import * as React from "react";

import { useHaptics } from "../../hooks/use-haptics";
import { cn } from "../../lib/utils";
import { GooeyGlass } from "./gooey-glass";

/**
 * ColorOnlyButton — Glass-shell circle with a material/origin color swatch.
 *
 * Same glass shell as IconOnlyButton (sm/md/lg) but the center shows a filled
 * inner circle with the caller-supplied gradient or solid color, plus a rim
 * light and radial sheen effect.
 */

const SIZE_MAP = {
  small: { button: 40, padding: 6, paddingInactive: 3 },
  medium: { button: 50, padding: 8, paddingInactive: 4 },
  large: { button: 64, padding: 10, paddingInactive: 5 },
} as const;

const SIZE_CLASSES = {
  small: "size-10",
  medium: "size-[50px]",
  large: "size-16",
} as const;

export interface ColorOnlyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** CSS background value for the inner circle (gradient string or solid color) */
  fill: string;
  /** Button size — matches IconOnlyButton sizes */
  size?: "small" | "medium" | "large";
  /** Pin to a visual state for showcase */
  forceState?: "hover" | "active" | "inactive";
}

export function ColorOnlyButton({
  fill,
  size = "medium",
  onClick,
  className,
  forceState,
  children,
  ...props
}: ColorOnlyButtonProps) {
  const haptics = useHaptics();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const pinned = !!forceState;
  const effectiveHover = forceState === "hover" || (!pinned && isHovered);
  const effectiveActive = forceState === "active" || (!pinned && isActive);
  const effectiveInactive = forceState === "inactive";

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      haptics.light();
      onClick?.(e);
    },
    [onClick, haptics],
  );

  const dims = SIZE_MAP[size];
  const padding = effectiveInactive ? dims.paddingInactive : dims.padding;

  const buttonStyle = React.useMemo((): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: dims.button,
      height: dims.button,
      borderRadius: 999,
      boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
      padding,
      ...(pinned ? { pointerEvents: "none" as const } : {}),
    };

    if (effectiveActive) {
      return {
        ...base,
        background: "var(--color-light-glass-5)",
        border: "1px solid var(--color-light-glass-20)",
      };
    }

    if (effectiveHover) {
      return {
        ...base,
        background: "var(--color-light-glass-20)",
        border: "1px solid var(--color-light-glass-20)",
      };
    }

    // Default & Inactive share the same shell
    return {
      ...base,
      background: "var(--color-light-glass-5)",
      border: "1px solid var(--color-light-glass-20)",
    };
  }, [effectiveHover, effectiveActive, effectiveInactive, dims, padding, pinned]);

  const innerOpacity = effectiveInactive ? 0.25 : 1.0;
  const rimLight = effectiveInactive
    ? "none"
    : "none";

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
        "relative inline-flex items-center justify-center overflow-hidden rounded-full cursor-pointer",
        SIZE_CLASSES[size],
        className,
      )}
      style={buttonStyle}
      data-slot="color-only-button"
      {...props}
    >
      <GooeyGlass
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        lens={{ width: dims.button, height: dims.button, borderRadius: 999, scale: 10, depth: 1.2, curvature: 2.45, chroma: 0.16, glow: 0.18, edgeHighlight: 0.4 }}
      >
        <span className="block size-full rounded-full" style={{ background: buttonStyle.background }} />
      </GooeyGlass>
      <div
        className="relative z-10 w-full h-full rounded-full overflow-hidden"
        style={{ opacity: innerOpacity }}
      >
        {/* Layer 1: Fill */}
        <div className="absolute inset-0 rounded-full" style={{ background: fill }} />
        {/* Layer 2: Radial sheen */}
        <div
          className="absolute inset-0 rounded-full mix-blend-overlay"
          style={{
            background: "radial-gradient(circle, transparent 0%, rgba(255,255,255,1) 100%)",
            opacity: 0.33,
          }}
        />
        {/* Layer 3: Rim light */}
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: rimLight }} />
      </div>
    </button>
  );
}
