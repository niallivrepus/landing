import * as React from "react";
import { cn } from "../../lib/utils";
import { getOriginHexes } from "../../lib/design-colors";

/**
 * HumanSpeech - Pill-shaped indicator with marching ants animation
 *
 * Features:
 * - Animated dashed border that rotates continuously
 * - Three sizes: large (53×70px), medium (46×60px), small (30×38px)
 * - Default colors: large=insight, medium=aether, small=life
 * - Smooth marching ants effect using SVG stroke animation
 *
 * Usage:
 * ```tsx
 * // Default sizes with preset colors
 * <HumanSpeech size="large" />   // insight purple
 * <HumanSpeech size="medium" />  // aether blue
 * <HumanSpeech size="small" />   // life green
 *
 * // Custom color
 * <HumanSpeech size="large" color="flame" />
 * ```
 */

type OriginColor = "life" | "aether" | "fruta" | "flame" | "solar" | "insight" | "spirit";

interface HumanSpeechProps {
  /**
   * Size variant
   * @default "large"
   */
  size?: "large" | "medium" | "small";
  /**
   * Origin color (defaults based on size: large=insight, medium=aether, small=life)
   */
  color?: OriginColor;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const SIZE_CONFIG = {
  large: { width: 53, height: 70, defaultColor: "insight" as OriginColor },
  medium: { width: 46, height: 60, defaultColor: "aether" as OriginColor },
  small: { width: 30, height: 38, defaultColor: "life" as OriginColor },
} as const;

function HumanSpeech({ size = "large", color, className }: HumanSpeechProps) {
  const config = SIZE_CONFIG[size];
  const finalColor = color || config.defaultColor;

  // Get color from origin colors
  const originColors = getOriginHexes(finalColor);
  const strokeColor = originColors ? originColors["1"] : "#7700FF";

  const { width, height } = config;
  const borderRadius = 999; // Full pill shape

  // SVG dimensions with padding for stroke
  const strokeWidth = 2;
  const padding = strokeWidth * 2;
  const svgWidth = width + padding;
  const svgHeight = height + padding;

  // Rectangle dimensions (centered in SVG)
  const rectX = strokeWidth;
  const rectY = strokeWidth;
  const rectWidth = width - strokeWidth;
  const rectHeight = height - strokeWidth;
  const rectRx = Math.min(rectWidth, rectHeight) / 2; // Pill shape

  // Dash configuration for marching ants
  const dashLength = 4;
  const gapLength = 4;
  const dashArray = `${dashLength} ${gapLength}`;

  return (
    <div
      className={cn("relative", className)}
      style={{
        width,
        height,
        filter: "drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.1))",
      }}
      data-slot="human-speech"
      data-size={size}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
        style={{
          left: -padding / 2,
          top: -padding / 2,
        }}
      >
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          rx={rectRx}
          ry={rectRx}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
        >
          {/* Marching ants animation */}
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to={dashLength + gapLength}
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
}

export { HumanSpeech, type HumanSpeechProps };
