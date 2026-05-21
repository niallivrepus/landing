import * as React from "react";
import { cn } from "../../lib/utils";
import { AlbumArtCover } from "./album-art-cover";
import { PlayPause } from "./play-pause";
import { Plus } from "./plus";

interface MusicCoverTitleProps {
  /**
   * Song/track title
   */
  title: string;
  /**
   * Artist name
   */
  artist: string;
  /**
   * Album art image URL (optional - shows placeholder when empty)
   */
  coverSrc?: string;
  /**
   * Layout variant:
   * - "large": Cover (48px) on left, stacked title on right
   * - "small": Inline title on left, small cover (24px) on right
   * @default "large"
   */
  variant?: "large" | "small";
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether the song is currently playing (large variant only)
   */
  playing?: boolean;
  /**
   * Callback when play/pause is clicked (large variant only)
   */
  onPlayPauseClick?: () => void;
  /**
   * Show plus icon instead of play/pause (large variant only)
   * @default false
   */
  showAddButton?: boolean;
  /**
   * Callback when add button is clicked (large variant only)
   */
  onAddClick?: () => void;
}

/**
 * MusicCoverTitle - Displays album art alongside song title and artist
 *
 * Two layout variants:
 * - Large: Cover image on left, title stacked vertically on right (with optional hover overlay)
 * - Small: Inline title on left, small placeholder cover on right
 */
function MusicCoverTitle({
  title,
  artist,
  coverSrc,
  variant = "large",
  className,
  playing,
  onPlayPauseClick,
  showAddButton = false,
  onAddClick,
}: MusicCoverTitleProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  if (variant === "small") {
    return (
      <div
        className={cn("flex items-center gap-3", className)}
        data-slot="music-cover-title"
      >
        {/* Inline title: "Song - Artist" */}
        <div className="flex items-center gap-2 text-base leading-[1.56]">
          <span className="font-bold text-light-space">{title} -</span>
          <span className="font-normal text-light-space/40">{artist}</span>
        </div>
        {/* Small cover placeholder on right */}
        <AlbumArtCover size="small" src={coverSrc} alt={`${title} by ${artist}`} />
      </div>
    );
  }

  // Large variant (default)
  const hasInteraction = showAddButton ? !!onAddClick : !!onPlayPauseClick;

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      data-slot="music-cover-title"
    >
      {/* Album art on left with hover overlay */}
      <div
        className="relative"
        onMouseEnter={() => hasInteraction && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AlbumArtCover size="large" src={coverSrc} alt={`${title} by ${artist}`} />

        {/* Hover overlay with play/pause or add button */}
        {hasInteraction && isHovered && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer transition-opacity duration-200"
            style={{ borderRadius: 12 }}
            onClick={showAddButton ? onAddClick : onPlayPauseClick}
          >
            {showAddButton ? (
              <Plus size={24} className="text-light-space" />
            ) : (
              <PlayPause playing={playing} size={24} />
            )}
          </div>
        )}
      </div>

      {/* Stacked title on right */}
      <div className="flex flex-col justify-center text-base leading-[1.56]">
        <span className="font-bold text-light-space">{title}</span>
        <span className="font-normal text-light-space/40">{artist}</span>
      </div>
    </div>
  );
}

export { MusicCoverTitle, type MusicCoverTitleProps };
