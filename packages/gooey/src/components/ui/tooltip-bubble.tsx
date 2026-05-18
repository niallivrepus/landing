import { cn } from "../../lib/utils";

interface TooltipBubbleProps {
  /**
   * Tooltip text content
   */
  children: React.ReactNode;
  /**
   * Direction where the tooltip appears relative to the content it describes.
   * The arrow will point toward the content.
   * - "top" = tooltip above content, arrow points down
   * - "bottom" = tooltip below content, arrow points up
   * - "left" = tooltip to the left, arrow points right
   * - "right" = tooltip to the right, arrow points left
   * @default "left"
   */
  direction?: "top" | "bottom" | "left" | "right";
  /**
   * Visual variant
   * @default "light"
   */
  variant?: "light" | "dark";
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * TooltipBubble - A static tooltip/popover bubble component
 *
 * Features a rounded container with monospace text, drop shadow,
 * and a small arrow pointer that points toward the content.
 *
 * Direction indicates where the tooltip appears relative to content:
 * - direction="top" → tooltip above, arrow at bottom pointing down
 * - direction="bottom" → tooltip below, arrow at top pointing up
 * - direction="left" → tooltip on left, arrow on right pointing right
 * - direction="right" → tooltip on right, arrow on left pointing left
 *
 * This is a static/visual component. For interactive tooltips,
 * use the Tooltip component from tooltip.tsx which uses Radix UI.
 */
function TooltipBubble({
  children,
  direction = "left",
  variant = "light",
  className,
}: TooltipBubbleProps) {
  const isLight = variant === "light";

  // Arrow positioning - arrow appears opposite to direction, pointing toward content
  const arrowStyles: Record<string, React.CSSProperties> = {
    // Tooltip above content → arrow at bottom
    top: {
      bottom: -5,
      left: "50%",
      transform: "translateX(-50%) rotate(45deg)",
    },
    // Tooltip below content → arrow at top
    bottom: {
      top: -5,
      left: "50%",
      transform: "translateX(-50%) rotate(45deg)",
    },
    // Tooltip to the left → arrow on right side
    left: {
      right: -5,
      top: "50%",
      transform: "translateY(-50%) rotate(45deg)",
    },
    // Tooltip to the right → arrow on left side
    right: {
      left: -5,
      top: "50%",
      transform: "translateY(-50%) rotate(45deg)",
    },
  };

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: isLight
          ? "var(--color-light-space, white)"
          : "var(--color-dark-space, black)",
        boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.15)",
      }}
      data-slot="tooltip-bubble"
    >
      {/* Text content */}
      <span
        style={{
          fontFamily: "var(--font-mono), 'Geist Mono', monospace",
          fontSize: 12,
          lineHeight: "normal",
          color: isLight
            ? "var(--color-dark-space, black)"
            : "var(--color-light-space, white)",
        }}
      >
        {children}
      </span>

      {/* Arrow pointer */}
      <div
        className="absolute"
        style={{
          width: 8.485,
          height: 8.485,
          borderRadius: 1.212,
          backgroundColor: isLight
            ? "var(--color-light-space, white)"
            : "var(--color-dark-space, black)",
          ...arrowStyles[direction],
        }}
      />
    </div>
  );
}

export { TooltipBubble, type TooltipBubbleProps };
