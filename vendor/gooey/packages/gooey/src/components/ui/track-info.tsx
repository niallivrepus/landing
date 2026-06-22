import { cn } from "../../lib/utils";
import { AlbumArtCover } from "./album-art-cover";

interface TrackInfoProps {
  /**
   * Artist name to display
   */
  artist?: string;
  /**
   * Track title to display
   */
  title?: string;
  /**
   * Album art image source URL
   */
  coverSrc?: string;
  /**
   * Size variant affecting album art and text sizing
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * Additional CSS classes
   */
  className?: string;
}

const SIZE_CONFIG = {
  large: {
    albumSize: "large" as const,
    artistFontSize: 14,
    titleFontSize: 14,
    dashFontSize: 14,
    gap: 12,
  },
  medium: {
    albumSize: "medium" as const,
    artistFontSize: 12,
    titleFontSize: 12,
    dashFontSize: 12,
    gap: 8,
  },
  small: {
    albumSize: "small" as const,
    artistFontSize: 11,
    titleFontSize: 11,
    dashFontSize: 11,
    gap: 6,
  },
} as const;

/**
 * TrackInfo - Displays album art with artist name and track title
 *
 * Layout: [Album Art] [Artist] - [Title]
 *
 * Features:
 * - Three sizes: large, medium, small
 * - Album art with music note placeholder when no cover
 * - Artist name in brighter text
 * - Dash separator as standalone element
 * - Track title in slightly dimmer text
 */
function TrackInfo({
  artist = "Unknown Artist",
  title = "Unknown Track",
  coverSrc,
  size = "medium",
  className,
}: TrackInfoProps) {
  const config = SIZE_CONFIG[size];

  return (
    <div
      className={cn("flex items-center", className)}
      style={{ gap: config.gap }}
      data-slot="track-info"
    >
      {/* Album Art Cover */}
      <AlbumArtCover size={config.albumSize} src={coverSrc} alt={`${artist} - ${title}`} />

      {/* Text Container */}
      <div className="flex items-center gap-1 min-w-0">
        {/* Artist Name */}
        <span
          className="truncate shrink-0"
          style={{
            fontSize: config.artistFontSize,
            fontWeight: 500,
            lineHeight: 1.4,
            color: "var(--color-light-space)",
            opacity: 0.9,
          }}
          data-slot="track-info-artist"
        >
          {artist}
        </span>

        {/* Dash Separator */}
        <span
          className="shrink-0"
          style={{
            fontSize: config.dashFontSize,
            fontWeight: 400,
            lineHeight: 1.4,
            color: "var(--color-light-space)",
            opacity: 0.4,
            padding: "0 2px",
          }}
          data-slot="track-info-separator"
        >
          -
        </span>

        {/* Track Title */}
        <span
          className="truncate"
          style={{
            fontSize: config.titleFontSize,
            fontWeight: 400,
            lineHeight: 1.4,
            color: "var(--color-light-space)",
            opacity: 0.6,
          }}
          data-slot="track-info-title"
        >
          {title}
        </span>
      </div>
    </div>
  );
}

export { TrackInfo, type TrackInfoProps };
