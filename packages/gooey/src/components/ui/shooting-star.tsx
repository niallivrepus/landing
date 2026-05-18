import * as React from "react";
import { cn } from "../../lib/utils";
import { Star } from "./star";

interface ShootingStarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Height of the shooting star in pixels
   * @default 150
   */
  height?: number;
}

const ShootingStar = React.forwardRef<HTMLDivElement, ShootingStarProps>(
  ({ height = 150, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative inline-flex flex-col items-center animate-shooting-star", className)}
        style={style}
        data-slot="shooting-star"
        data-node-id="2877:4180"
        {...props}
      >
        {/* Star at the top */}
        <div className="mb-0.5">
          <Star enabled size={12} />
        </div>

        {/* Gradient trail */}
        <div
          style={{
            width: "1px",
            height: `${height}px`,
            background: "linear-gradient(180deg, #ffb800 0%, rgba(255, 107, 0, 0) 100%)",
          }}
        />
      </div>
    );
  }
);

ShootingStar.displayName = "ShootingStar";

export { ShootingStar, type ShootingStarProps };
