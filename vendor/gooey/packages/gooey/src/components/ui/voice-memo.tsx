import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

/** Minimum height for unrecorded (grey) bars */
const MIN_BAR_HEIGHT = 5;
/** Maximum height for recorded bars at full volume */
const MAX_BAR_HEIGHT = 27;
/** Gap between bars in pixels */
const BAR_GAP = 1.5;
/** Bar width in pixels */
const BAR_WIDTH = 2;

interface VoiceMemoProps {
  /**
   * Position of the recording head (0-50).
   * 0 = head at left edge (not visible yet)
   * 50 = head at center (final recording position)
   * @default 0
   */
  headPosition?: number;
  /**
   * Array of volume levels (0-1) representing the recorded waveform.
   * These are the bars to the LEFT of the recording head (blue bars).
   * Index 0 is the oldest (leftmost), last index is newest (closest to head).
   */
  recordedVolumes?: number[];
  /**
   * CSS gradient for recorded bars. Defaults to blue.
   */
  barGradient?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  theme?: "default" | "dark";
}

/**
 * VoiceMemo - Audio recording waveform visualization
 *
 * Behavior:
 * - Grey bars fill the ENTIRE container at all times
 * - White recording line is positioned at `headPosition`% (0-50)
 * - Before recording: white line animates from left (0%) to center (50%)
 * - Bars to the LEFT of white line are blue with dB-based heights
 * - Bars to the RIGHT of white line stay grey (short)
 * - Once at 50%, grey bars flow right-to-left, becoming blue as they pass
 */
function VoiceMemo({
  headPosition = 0,
  recordedVolumes = [],
  barGradient,
  className,
  theme = "default",
}: VoiceMemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barCount, setBarCount] = useState(19);

  // Calculate bar count based on container width
  useEffect(() => {
    const updateBarCount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const padding = 24; // px-3 = 12px each side
        const availableWidth = containerWidth - padding;
        const count = Math.floor(availableWidth / (BAR_WIDTH + BAR_GAP));
        setBarCount(Math.max(1, count));
      }
    };

    updateBarCount();
    const observer = new ResizeObserver(updateBarCount);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Calculate which bar index the head has FULLY passed
  // Account for padding: bars start at ~6% of container (12px of 190px)
  // Subtract 1 extra as buffer to ensure blue never appears on right of white line
  const paddingPercent = 6.3; // ~12px / 190px
  const effectivePosition = Math.max(0, headPosition - paddingPercent);
  const barAreaPercent = 50 - paddingPercent; // The percentage range where bars exist (left half)
  const rawBarIndex = Math.floor((effectivePosition / barAreaPercent) * (barCount / 2));
  const headBarIndex = Math.max(0, rawBarIndex - 1); // Extra buffer to stay behind white line
  const showHead = headPosition > 0;

  // Build the bar data - grey bars fill entire container
  const bars = Array.from({ length: barCount }, (_, index) => {
    const isLeftOfHead = index < headBarIndex;

    // For recorded bars (left of head), get height from volumes
    let height = MIN_BAR_HEIGHT;
    if (isLeftOfHead && recordedVolumes.length > 0) {
      // Map bar index to volume array
      // headBarIndex - 1 is newest (last in array), 0 is oldest (first in array that fits)
      const volumeIndex = recordedVolumes.length - (headBarIndex - index);
      if (volumeIndex >= 0 && volumeIndex < recordedVolumes.length) {
        const volume = recordedVolumes[volumeIndex]!;
        height = MIN_BAR_HEIGHT + volume * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);
      }
    }

    return { index, height, isRecorded: isLeftOfHead };
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-10 w-[190px] items-center rounded-full",
        theme === "dark"
          ? "border border-white/10 bg-[var(--color-dark-space)] px-3"
          : "border border-light-glass-20 bg-light-glass-5 px-3",
        className,
      )}
      style={{ gap: `${BAR_GAP}px` }}
    >
      {bars.map(({ index, height, isRecorded }) => (
        <div
          key={index}
          className="relative shrink-0 rounded-full"
          style={{
            width: `${BAR_WIDTH}px`,
            height: `${height}px`,
            background: isRecorded
              ? (barGradient ?? "linear-gradient(89deg, rgb(0, 47, 255) 0%, rgb(61, 126, 255) 100%)")
              : theme === "dark"
                ? "rgba(255,255,255,0.18)"
                : "var(--color-light-glass-30, rgba(255,255,255,0.3))",
            transition: "height 120ms ease-out, background 150ms ease-out",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ boxShadow: "none" }}
          />
        </div>
      ))}

      {/* White recording head - starts small like grey bars, grows to full height */}
      {showHead && (
        <div
          className="absolute w-0.5 rounded-full bg-white"
          style={{
            left: `${headPosition}%`,
            top: "50%",
            // Interpolate height: starts at MIN_BAR_HEIGHT, grows to full (40px) by 20%
            height: `${Math.min(40, MIN_BAR_HEIGHT + (headPosition / 20) * (40 - MIN_BAR_HEIGHT))}px`,
            transform: "translateX(-50%) translateY(-50%)",
            transition: "left 100ms linear, height 100ms ease-out",
            boxShadow:
              "0px 0px 6px 0px rgba(255, 255, 255, 0.6), 0px 0px 25px 0px rgba(255, 255, 255, 0.15)",
          }}
        />
      )}

      {/* Container rimlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ boxShadow: "none" }}
      />
    </div>
  );
}

interface VoiceMemoSimulationProps {
  /**
   * Whether the simulation is running
   * @default true
   */
  isRecording?: boolean;
  /**
   * Speed of the simulation in ms per tick
   * @default 100
   */
  speed?: number;
  /**
   * CSS gradient for recorded bars.
   */
  barGradient?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  theme?: "default" | "dark";
}

/**
 * VoiceMemoSimulation - Animated demo showing full recording flow
 *
 * Animation phases:
 * 1. Intro: White line smoothly enters from left, travels to 50% center
 * 2. Recording: Line stays at 50%, grey bars flow right-to-left becoming blue
 *
 * Click to reset the animation.
 */
function VoiceMemoSimulation({
  isRecording = true,
  speed = 120,
  barGradient,
  className,
  theme = "default",
}: VoiceMemoSimulationProps) {
  const [headPosition, setHeadPosition] = useState(0);
  const [recordedVolumes, setRecordedVolumes] = useState<number[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const maxHistoryRef = useRef(50); // Max volumes to keep in memory

  // Reset animation to initial state
  const resetAnimation = () => {
    setHeadPosition(0);
    setRecordedVolumes([]);
    lastTickRef.current = 0;
  };

  useEffect(() => {
    if (!isRecording) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (timestamp - lastTickRef.current >= speed) {
        lastTickRef.current = timestamp;

        setHeadPosition((prev) => {
          // Phase 1: Head travels smoothly from 0 to 50
          if (prev < 50) {
            // Smaller increments for smoother motion
            return Math.min(50, prev + 1);
          }
          return 50; // Stay at 50 permanently
        });

        setRecordedVolumes((prev) => {
          // Generate random volume with smoother transitions
          const lastVolume = prev[prev.length - 1] ?? 0.5;
          // Smaller delta for gentler waveform changes
          const randomDelta = (Math.random() - 0.5) * 0.35;
          const newVolume = Math.max(0.2, Math.min(0.95, lastVolume + randomDelta));

          const newVolumes = [...prev, newVolume];

          // Keep only the last N volumes to prevent memory growth
          return newVolumes.slice(-maxHistoryRef.current);
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, speed]);

  return (
    <div onClick={resetAnimation} className="cursor-pointer">
      <VoiceMemo
        headPosition={headPosition}
        recordedVolumes={recordedVolumes}
        barGradient={barGradient}
        className={className}
        theme={theme}
      />
    </div>
  );
}

export { VoiceMemo, VoiceMemoSimulation, type VoiceMemoProps, type VoiceMemoSimulationProps };
