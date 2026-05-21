import * as React from "react";
import { cn } from "../../lib/utils";

interface MineralEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Strength of the overlay effect
   * @default "normal" (33% opacity)
   */
  strength?: "subtle" | "normal" | "strong";
  /**
   * Which gradient layers to apply
   * @default "both"
   */
  layers?: "both" | "linear-only" | "radial-only";
  /**
   * Base background color/gradient (mineral or material)
   */
  background: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Children to render inside the effect container
   */
  children?: React.ReactNode;
}

/**
 * MineralEffect - Applies Figma-style multi-layer gradient overlays
 *
 * Creates a sophisticated depth effect with two overlay gradients:
 * 1. Linear gradient from bottom to middle (bottom shimmer)
 * 2. Radial gradient from center to right (center glow)
 *
 * Both use overlay blend mode at 33% opacity by default.
 *
 * @example
 * ```tsx
 * // Apply to a mineral color
 * <MineralEffect background="bg-rulgor-4">
 *   Content here
 * </MineralEffect>
 *
 * // With custom strength
 * <MineralEffect background="bg-kaleidyx-3" strength="strong">
 *   Content here
 * </MineralEffect>
 *
 * // Only radial gradient
 * <MineralEffect background="linear-gradient(...)" layers="radial-only">
 *   Content here
 * </MineralEffect>
 * ```
 */
export function MineralEffect({
  strength = "normal",
  layers = "both",
  background,
  className,
  children,
  ...props
}: MineralEffectProps) {
  const effectClass = cn(
    "mineral-effect",
    {
      "mineral-effect-subtle": strength === "subtle",
      "mineral-effect-strong": strength === "strong",
      "mineral-effect-linear-only": layers === "linear-only",
      "mineral-effect-radial-only": layers === "radial-only",
    },
    className
  );

  return (
    <div className={cn(effectClass, background)} {...props}>
      {children}
    </div>
  );
}

/**
 * MaterialEffect - Alias for MineralEffect
 * (Materials and minerals use the same overlay effect)
 */
export const MaterialEffect = MineralEffect;
