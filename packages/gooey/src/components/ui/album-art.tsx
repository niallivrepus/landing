import * as React from "react";
import { getSvgPath } from "figma-squircle";

import { cn } from "../../lib/utils";

/**
 * AlbumArt - Album cover artwork display component
 *
 * Displays album artwork with glass morphism effects and 100% corner smoothing.
 * Uses figma-squircle for iOS-style smooth corners.
 *
 * Sizes:
 * - large: 48x48px, 12px radius
 * - medium: 32x32px, 8px radius
 * - small: 24x24px, 6px radius
 */

type AlbumArtSize = "large" | "medium" | "small";

interface AlbumArtProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Size variant */
  size?: AlbumArtSize;
  className?: string;
}

const SIZE_CONFIG: Record<AlbumArtSize, { size: number; radius: number }> = {
  large: { size: 48, radius: 12 },
  medium: { size: 32, radius: 8 },
  small: { size: 24, radius: 6 },
};

function AlbumArt({ src, alt = "Album artwork", size = "large", className }: AlbumArtProps) {
  const config = SIZE_CONFIG[size];

  // Generate squircle path with 100% corner smoothing
  const squirclePath = React.useMemo(() => {
    return getSvgPath({
      width: config.size,
      height: config.size,
      cornerRadius: config.radius,
      cornerSmoothing: 1, // 100% smoothing
    });
  }, [config.size, config.radius]);

  return (
    <div
      className={cn("relative", className)}
      style={{
        width: config.size,
        height: config.size,
        clipPath: `path('${squirclePath}')`,
        boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Album art image */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 size-full object-cover"
      />
      {/* Squircle border overlay */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={config.size}
        height={config.size}
        style={{ zIndex: 1 }}
      >
        <path
          d={squirclePath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={1}
        />
      </svg>
      {/* Inner highlight effect */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={config.size}
        height={config.size}
        style={{ zIndex: 2 }}
      >
        <defs>
          <filter id={`album-art-inner-shadow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="white" floodOpacity="0.15" />
          </filter>
        </defs>
        <path
          d={squirclePath}
          fill="none"
          stroke="transparent"
          strokeWidth={4}
          filter={`url(#album-art-inner-shadow-${size})`}
          style={{ clipPath: `path('${squirclePath}')` }}
        />
      </svg>
    </div>
  );
}

export { AlbumArt, type AlbumArtProps, type AlbumArtSize };
