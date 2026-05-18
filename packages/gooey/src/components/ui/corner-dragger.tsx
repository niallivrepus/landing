import { useState } from "react";
import { cn } from "../../lib/utils";

interface CornerDraggerProps {
  /**
   * Whether the dragger is in hover state
   */
  isHovered?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Mouse down handler for drag start
   */
  onMouseDown?: (e: React.MouseEvent) => void;
}

/**
 * CornerDragger - A corner resize handle component
 *
 * Shows a curved corner indicator used for resizing elements.
 * Has default and hover states with different opacity.
 */
function CornerDragger({ isHovered, className, onMouseDown }: CornerDraggerProps) {
  const [internalHover, setInternalHover] = useState(false);
  const hovered = isHovered ?? internalHover;

  return (
    <div
      className={cn(
        "relative cursor-nwse-resize",
        className
      )}
      style={{
        width: 20,
        height: 20,
      }}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      onMouseDown={onMouseDown}
    >
      <svg
        width="20"
        height="20"
        viewBox="-1.5 -1.5 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        {/* Exact 90° arc, r=17, centered at corner (0,0), from (0,17) to (17,0) */}
        <path
          d="M 0 17 A 17 17 0 0 0 17 0"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.15s ease",
          }}
        />
      </svg>
    </div>
  );
}

export { CornerDragger, type CornerDraggerProps };
