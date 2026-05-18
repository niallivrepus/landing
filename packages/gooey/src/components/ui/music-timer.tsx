import * as React from "react";

import { cn } from "../../lib/utils";

interface MusicTimerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current playback time in seconds
   */
  currentTime?: number;
  /**
   * Total duration in seconds
   */
  duration?: number;
  /**
   * Whether to show remaining time or total duration on the right
   * @default "remaining"
   */
  rightDisplay?: "remaining" | "total";
  /**
   * Whether to show the time labels
   * @default true
   */
  showTimeLabels?: boolean;
  /**
   * Optional callback when progress changes (for integration with audio players)
   */
  onProgressChange?: (progress: number) => void;
}

/**
 * Formats seconds into MM:SS format
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const MusicTimer = React.forwardRef<HTMLDivElement, MusicTimerProps>(
  (
    {
      className,
      currentTime = 85, // 01:25 in seconds (default from design)
      duration = 214, // 3:34 in seconds (default from design)
      rightDisplay = "remaining",
      showTimeLabels = true,
      onProgressChange,
      ...props
    },
    ref
  ) => {
    const progressWidth = duration > 0 ? (currentTime / duration) * 230 : 0; // 230px is approximate bar width (258px - 28px padding)
    const remainingTime = Math.max(0, duration - currentTime);
    const rightTime = rightDisplay === "remaining" ? remainingTime : duration;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2",
          showTimeLabels ? "w-64" : "w-auto",
          className
        )}
        data-slot="music-timer"
        {...props}
      >
        {/* Left Timer - Current Position */}
        {showTimeLabels && (
          <p
            className="text-sm font-medium text-foreground/40 shrink-0 tabular-nums"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
              width: "40px",
              textAlign: "left",
            }}
            data-node-id="3:88071"
          >
            {formatTime(currentTime)}
          </p>
        )}

        {/* Progress Bar */}
        <div
          className="flex-1 h-1 bg-black/10 dark:bg-smoke-1 rounded-full relative overflow-hidden"
          style={{
            height: "3px",
          }}
          data-node-id="3:88072"
        >
          {/* Progress Fill with Gradient and Glow */}
          <div
            className="absolute h-1 rounded-full transition-all duration-100"
            style={{
              height: "3px",
              width: `${progressWidth}px`,
              backgroundImage:
                "linear-gradient(15.8213deg, rgb(119, 0, 255) 0%, rgb(178, 0, 255) 100%)",
              boxShadow:
                "0px 0px 6px rgba(135, 40, 255, 0.6), 0px 0px 25px rgba(177, 140, 255, 0.15), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.15)",
              borderRadius: "16px",
            }}
            data-node-id="I3:88072;3:88079"
          />
        </div>

        {/* Right Timer - Duration or Remaining */}
        {showTimeLabels && (
          <p
            className="text-sm font-medium text-foreground/40 shrink-0 tabular-nums"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
              width: "40px",
              textAlign: "right",
            }}
            data-node-id="3:88073"
          >
            {formatTime(rightTime)}
          </p>
        )}
      </div>
    );
  }
);

MusicTimer.displayName = "MusicTimer";

export { MusicTimer, type MusicTimerProps };
