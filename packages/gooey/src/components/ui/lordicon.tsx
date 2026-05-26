import * as React from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../hooks/use-theme";

/** Context for parent components (e.g. ActionButton) to drive icon hover state */
export const IconHoverContext = React.createContext<boolean>(false);

interface LordiconIconProps {
  /** Lottie JSON animation data (import the .json file directly) */
  animationData: unknown;
  /** Optional filled variant — shown on hover while outline shows at rest */
  hoverAnimationData?: unknown;
  /** Icon size in pixels (default 32) */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** CSS color to apply via filter — for simple tinting */
  color?: string;
  /** Invert colors to white via CSS filter (default true) */
  invert?: boolean;
}

/**
 * Animated Lottie icon (Lordicon-style).
 * Plays on hover, resets on mouse leave.
 * When hoverAnimationData is provided, shows outline at rest and filled on hover.
 * Responds to parent hover via IconHoverContext or its own mouse events.
 */
export function LordiconIcon({
  animationData,
  hoverAnimationData,
  size = 32,
  className,
  color,
  invert = true,
}: LordiconIconProps) {
  const { isDarkMode } = useTheme();
  const lottieRef = React.useRef<LottieRefCurrentProps>(null);
  const hoverLottieRef = React.useRef<LottieRefCurrentProps>(null);
  const [localHover, setLocalHover] = React.useState(false);
  const parentHover = React.useContext(IconHoverContext);
  const isHovered = parentHover || localHover;
  const prevHovered = React.useRef(false);

  React.useEffect(() => {
    if (isHovered && !prevHovered.current) {
      if (hoverAnimationData) {
        hoverLottieRef.current?.goToAndPlay(0);
      } else {
        lottieRef.current?.goToAndPlay(0);
      }
    } else if (!isHovered && prevHovered.current) {
      if (hoverAnimationData) {
        hoverLottieRef.current?.stop();
      } else {
        lottieRef.current?.stop();
      }
    }
    prevHovered.current = isHovered;
  }, [isHovered, hoverAnimationData]);

  return (
    <div
      onMouseEnter={() => setLocalHover(true)}
      onMouseLeave={() => setLocalHover(false)}
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      style={{
        width: size,
        height: size,
        color,
        filter: invert
          ? isDarkMode ? "brightness(0) invert(1)" : "brightness(0)"
          : undefined,
      }}
    >
      {hoverAnimationData ? (
        <>
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop={false}
            autoplay={false}
            style={{ width: size, height: size, display: isHovered ? "none" : "block" }}
          />
          <Lottie
            lottieRef={hoverLottieRef}
            animationData={hoverAnimationData}
            loop={false}
            autoplay={false}
            style={{ width: size, height: size, display: isHovered ? "block" : "none" }}
          />
        </>
      ) : (
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={false}
          autoplay={false}
          style={{ width: size, height: size }}
        />
      )}
    </div>
  );
}
