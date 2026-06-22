import { cn } from "../../lib/utils";

interface TimerProps {
  /**
   * Time value in seconds
   * @default 0
   */
  seconds?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * NumberColumn - A vertical slider of numbers 0-9
 * Height: 336px (34px per digit × 10 digits)
 * Width: 15px
 */
function NumberColumn({ value, className }: { value: number; className?: string }) {
  // Each number is 34px apart (from Figma: 0, 34, 68, 102, etc.)
  const offset = -value * 34 - 1; // -1 is the initial top offset from Figma

  return (
    <div className={cn("relative h-full w-[15px] shrink-0 overflow-hidden", className)}>
      <div
        className="absolute left-0 font-mono text-2xl leading-normal text-light-space transition-all duration-300 ease-out"
        style={{
          top: `${offset}px`,
          width: "15px",
          height: "336px",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <p
            key={num}
            className="absolute left-0"
            style={{
              top: `${num * 34}px`,
            }}
          >
            {num}
          </p>
        ))}
      </div>
    </div>
  );
}

/**
 * Timer - Digital timer display with vertically sliding numbers
 *
 * Features:
 * - Displays time in MM:SS format
 * - Each digit is a vertical slider showing 0-9
 * - Smooth transitions when numbers change
 * - Monospace font (Geist Mono)
 * - 15px wide × 28px tall viewport per digit
 */
function Timer({ seconds = 0, className }: TimerProps) {
  // Convert seconds to MM:SS format
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  // Get individual digits
  const minuteTens = Math.floor(minutes / 10);
  const minuteOnes = minutes % 10;
  const secondTens = Math.floor(secs / 10);
  const secondOnes = secs % 10;

  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      <div className="flex h-7 items-center justify-center gap-0 overflow-hidden rounded px-1">
        {/* Minutes tens */}
        <NumberColumn value={minuteTens} />

        {/* Minutes ones */}
        <NumberColumn value={minuteOnes} />

        {/* Colon separator */}
        <div className="relative h-[26px] w-[15px] shrink-0 overflow-hidden">
          <p
            className="absolute left-0 font-mono text-2xl leading-normal text-light-space"
            style={{
              top: "-4.55px",
              width: "15px",
              height: "26.734px",
            }}
          >
            :
          </p>
        </div>

        {/* Seconds tens */}
        <NumberColumn value={secondTens} />

        {/* Seconds ones */}
        <NumberColumn value={secondOnes} />
      </div>
    </div>
  );
}

export { Timer, type TimerProps };
