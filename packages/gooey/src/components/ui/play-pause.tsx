import * as React from "react";
import { cn } from "../../lib/utils";

interface PlayButtonProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size in pixels
   * @default 24
   */
  size?: number;
  /**
   * onClick handler
   */
  onClick?: () => void;
}

/**
 * Play - Play button icon with hover glow effect
 *
 * - Default: Gray (#4F4F4F) triangle
 * - Hover: White with subtle glow
 */
function Play({ className, size = 24, onClick }: PlayButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const filterId = React.useId();

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200",
        onClick && "cursor-pointer",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-200"
      >
        {isHovered && (
          <defs>
            <filter
              id={filterId}
              x="0"
              y="-3"
              width="27"
              height="30"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="2.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
          </defs>
        )}
        <path
          d="M5 22V2L22 12L5 22Z"
          fill={isHovered ? "white" : "#4F4F4F"}
          filter={isHovered ? `url(#${filterId})` : undefined}
          className="transition-all duration-200"
        />
      </svg>
    </button>
  );
}

interface PauseButtonProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size in pixels
   * @default 24
   */
  size?: number;
  /**
   * onClick handler
   */
  onClick?: () => void;
}

/**
 * Pause - Pause button icon with hover effect
 *
 * - Default: Gray (#4F4F4F) bars
 * - Hover: White bars
 */
function Pause({ className, size = 24, onClick }: PauseButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200",
        onClick && "cursor-pointer",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-200"
      >
        <path
          d="M4 3V21H10V3H4Z"
          fill={isHovered ? "white" : "#4F4F4F"}
          className="transition-all duration-200"
        />
        <path
          d="M14 3V21H20V3H14Z"
          fill={isHovered ? "white" : "#4F4F4F"}
          className="transition-all duration-200"
        />
      </svg>
    </button>
  );
}

interface PlayPauseProps {
  /**
   * Whether the media is playing
   * @default false
   */
  playing?: boolean;
  /**
   * Callback when play/pause is clicked
   */
  onToggle?: (playing: boolean) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size in pixels
   * @default 24
   */
  size?: number;
}

/**
 * PlayPause - Combined play/pause toggle button
 *
 * Automatically switches between play and pause based on playing state.
 *
 * Usage:
 * ```tsx
 * // Uncontrolled
 * <PlayPause onToggle={(playing) => console.log(playing)} />
 *
 * // Controlled
 * <PlayPause playing={isPlaying} onToggle={setIsPlaying} />
 * ```
 */
function PlayPause({ playing: controlledPlaying, onToggle, className, size = 24 }: PlayPauseProps) {
  const [internalPlaying, setInternalPlaying] = React.useState(false);

  // Use controlled state if provided, otherwise use internal state
  const playing = controlledPlaying !== undefined ? controlledPlaying : internalPlaying;

  const handleClick = () => {
    const newPlaying = !playing;

    // Update internal state if uncontrolled
    if (controlledPlaying === undefined) {
      setInternalPlaying(newPlaying);
    }

    // Call callback
    onToggle?.(newPlaying);
  };

  return playing ? (
    <Pause className={className} size={size} onClick={handleClick} />
  ) : (
    <Play className={className} size={size} onClick={handleClick} />
  );
}

interface BackwardProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size in pixels
   * @default 24
   */
  size?: number;
  /**
   * onClick handler
   */
  onClick?: () => void;
}

/**
 * Backward - Rewind button icon with hover glow effect
 *
 * - Default: Gray (#4F4F4F) double left triangles
 * - Hover: White with subtle glow
 */
function Backward({ className, size = 24, onClick }: BackwardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const filterId = React.useId();

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200",
        onClick && "cursor-pointer",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-200"
      >
        {isHovered && (
          <defs>
            <filter
              id={filterId}
              x="0"
              y="0"
              width="24"
              height="24"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="2.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
          </defs>
        )}
        <g filter={isHovered ? `url(#${filterId})` : undefined}>
          {/* First triangle (left) */}
          <path
            d="M11 12L18.5 4V20L11 12Z"
            fill={isHovered ? "white" : "#4F4F4F"}
            className="transition-all duration-200"
          />
          {/* Second triangle (right) */}
          <path
            d="M4 12L11.5 4V20L4 12Z"
            fill={isHovered ? "white" : "#4F4F4F"}
            className="transition-all duration-200"
          />
        </g>
      </svg>
    </button>
  );
}

interface ForwardProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size in pixels
   * @default 24
   */
  size?: number;
  /**
   * onClick handler
   */
  onClick?: () => void;
}

/**
 * Forward - Fast-forward button icon with hover glow effect
 *
 * - Default: Gray (#4F4F4F) double right triangles
 * - Hover: White with subtle glow
 */
function Forward({ className, size = 24, onClick }: ForwardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const filterId = React.useId();

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200",
        onClick && "cursor-pointer",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-200"
      >
        {isHovered && (
          <defs>
            <filter
              id={filterId}
              x="0"
              y="0"
              width="24"
              height="24"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="2.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
          </defs>
        )}
        <g filter={isHovered ? `url(#${filterId})` : undefined}>
          {/* First triangle (left) */}
          <path
            d="M5.5 4V20L13 12L5.5 4Z"
            fill={isHovered ? "white" : "#4F4F4F"}
            className="transition-all duration-200"
          />
          {/* Second triangle (right) */}
          <path
            d="M12.5 4V20L20 12L12.5 4Z"
            fill={isHovered ? "white" : "#4F4F4F"}
            className="transition-all duration-200"
          />
        </g>
      </svg>
    </button>
  );
}

export {
  Play,
  Pause,
  PlayPause,
  Backward,
  Forward,
  type PlayButtonProps,
  type PauseButtonProps,
  type PlayPauseProps,
  type BackwardProps,
  type ForwardProps,
};
