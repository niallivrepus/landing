import * as React from "react";
import { cn } from "../../lib/utils";

interface LocationPointProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the location point in pixels
   * @default 24
   */
  size?: number;
}

/**
 * LocationPoint - A location marker indicator
 *
 * Features a circular blue dot with white border and drop shadow,
 * used to indicate a location or point of interest on maps.
 */
const LocationPoint = React.forwardRef<HTMLDivElement, LocationPointProps>(
  ({ className, size = 24, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-full border-[3px] border-white", className)}
        style={{
          width: size,
          height: size,
          backgroundColor: "var(--color-blue-4)",
          boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.15)",
        }}
        data-slot="location-point"
        {...props}
      />
    );
  }
);

LocationPoint.displayName = "LocationPoint";

export { LocationPoint, type LocationPointProps };
