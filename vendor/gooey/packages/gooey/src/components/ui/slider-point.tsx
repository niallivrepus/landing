import { cn } from "../../lib/utils";

interface SliderPointProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SliderPoint - Circular thumb/handle for sliders
 *
 * Features:
 * - Smoke gray background
 * - White border (3px)
 * - Drop shadow for depth
 * - 24px diameter
 */
function SliderPoint({ className }: SliderPointProps) {
  return (
    <div
      className={cn(
        "size-6 rounded-full border-[3px] border-white",
        "bg-[var(--shades-smoke-5,#d9d9d9)]",
        className,
      )}
      style={{
        boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.15)",
      }}
    />
  );
}

export { SliderPoint, type SliderPointProps };
