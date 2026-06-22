import { cn } from "../../lib/utils";
import { Backward, PlayPause, Forward } from "./play-pause";

interface MusicControlsProps {
  /**
   * Whether the media is currently playing
   * @default false
   */
  playing?: boolean;
  /**
   * Callback when play/pause is toggled
   */
  onPlayPauseToggle?: (playing: boolean) => void;
  /**
   * Callback when backward/rewind is clicked
   */
  onBackward?: () => void;
  /**
   * Callback when forward/fast-forward is clicked
   */
  onForward?: () => void;
  /**
   * Size of each control icon in pixels
   * @default 24
   */
  size?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * MusicControls - Backward, Play/Pause, Forward control group
 *
 * Layout: [Rewind] [Play/Pause] [Fast-forward]
 * 12px gap between controls
 */
function MusicControls({
  playing,
  onPlayPauseToggle,
  onBackward,
  onForward,
  size = 24,
  className,
}: MusicControlsProps) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      data-slot="music-controls"
    >
      <Backward size={size} onClick={onBackward} />
      <PlayPause playing={playing} onToggle={onPlayPauseToggle} size={size} />
      <Forward size={size} onClick={onForward} />
    </div>
  );
}

export { MusicControls, type MusicControlsProps };
