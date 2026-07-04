import * as React from "react";
import { cn } from "../../lib/utils";

interface PowerButtonProps {
  /**
   * Whether the button is in the "on" state
   * @default false
   */
  powered?: boolean;
  /**
   * Callback when the button is clicked
   */
  onToggle?: (powered: boolean) => void;
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size in pixels
   * @default 98
   */
  size?: number;
}

/**
 * PowerButton - Interactive power button with on/off states
 *
 * Features:
 * - Toggle between on (green glow) and off (gray) states
 * - Different hover states for on vs off
 * - Click/active states
 * - Smooth transitions between states
 *
 * Usage:
 * ```tsx
 * // Uncontrolled (manages its own state)
 * <PowerButton onToggle={(powered) => console.log(powered)} />
 *
 * // Controlled
 * <PowerButton powered={isPowered} onToggle={setIsPowered} />
 * ```
 */
function PowerButton({
  powered: controlledPowered,
  onToggle,
  disabled = false,
  className,
  size = 98,
}: PowerButtonProps) {
  const [internalPowered, setInternalPowered] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  // Use controlled state if provided, otherwise use internal state
  const powered = controlledPowered !== undefined ? controlledPowered : internalPowered;

  const handleClick = () => {
    if (disabled) return;

    const newPowered = !powered;

    // Update internal state if uncontrolled
    if (controlledPowered === undefined) {
      setInternalPowered(newPowered);
    }

    // Call callback
    onToggle?.(newPowered);
  };

  const iconSize = 80; // Fixed 80×80px container
  const svgContainerSize = 27; // Fixed 27×27px SVG wrapper

  // Detect dark mode from .dark class on <html>
  const [isDark, setIsDark] = React.useState(() =>
    document.documentElement.classList.contains("dark")
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  let iconColor = isDark ? "#6B7280" : "#B0B5BC"; // off default
  let glowColor = isDark ? "#6B7280" : "#B0B5BC";
  let glowIntensity = isDark ? 0.3 : 0;
  let glowRadius = 2;

  if (powered) {
    // On states — light mode: white icon on green button
    iconColor = isDark ? "#A7FF38" : "#FFFFFF";
    glowColor = isDark ? "#8CFF19" : "#FFFFFF";
    glowIntensity = isDark ? 0.6 : 0;
    glowRadius = 6;

    if (isActive) {
      iconColor = isDark ? "#CCFF70" : "#FFFFFF";
      glowIntensity = isDark ? 0.9 : 0;
      glowRadius = 8;
    } else if (isHovered) {
      iconColor = isDark ? "#B8FF52" : "#FFFFFF";
      glowIntensity = isDark ? 0.8 : 0;
      glowRadius = 7;
    }
  } else {
    // Off states
    if (isActive) {
      iconColor = isDark ? "#E5E7EB" : "#8B919A";
      glowIntensity = isDark ? 0.5 : 0;
      glowRadius = 4;
    } else if (isHovered) {
      iconColor = isDark ? "#9CA3AF" : "#9CA3AF";
      glowIntensity = isDark ? 0.4 : 0;
      glowRadius = 3;
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      disabled={disabled}
      data-powered={powered}
      data-state={powered ? "on" : "off"}
      className={cn(
        "relative rounded-full overflow-hidden transition-all duration-200",
        isDark ? "bg-black" : "",
        !disabled && "cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        width: size,
        height: size,
        ...(isDark
          ? {
              boxShadow: "0px 0.5px 1px 0px white, 0px -0.5px 1px 0px rgba(0,0,0,0.5)",
            }
          : powered
            ? {
                background: "linear-gradient(145deg, #5CB519, #4A9614)",
                boxShadow: "0px 2px 6px 0px rgba(74,150,20,0.4), 0px 0.5px 1px 0px rgba(0,0,0,0.1)",
              }
            : {
                background: "linear-gradient(145deg, #FFFFFF, #F0F1F3)",
                boxShadow: "0px 2px 6px 0px rgba(0,0,0,0.08), 0px 0px 0px 1px rgba(0,0,0,0.06)",
              }),
      }}
    >
      {/* Power icon */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: iconSize,
          height: iconSize,
        }}
      >
        {/* 27×27px SVG wrapper */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          style={{
            width: svgContainerSize,
            height: svgContainerSize,
          }}
        >
          <PowerIcon
            color={iconColor}
            glowColor={glowColor}
            glowIntensity={glowIntensity}
            glowRadius={glowRadius}
            powered={powered}
          />
        </div>
      </div>
    </button>
  );
}

interface PowerIconProps {
  color: string;
  glowColor: string;
  glowIntensity: number;
  glowRadius: number;
  powered: boolean;
}

function PowerIcon({ color, glowColor, glowIntensity, glowRadius, powered }: PowerIconProps) {
  const glowFilterId = React.useId();
  const iconFilterId = React.useId();

  return (
    <svg
      width="25.74"
      height="27"
      viewBox="0 0 28 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all duration-200"
    >
      <defs>
        {/* Glow filter for powered states */}
        <filter id={glowFilterId} x="-150%" y="-150%" width="400%" height="400%">
          {/* Inner glow */}
          <feGaussianBlur stdDeviation={glowRadius} result="blur1" />
          <feFlood floodColor={glowColor} floodOpacity={glowIntensity} />
          <feComposite in2="blur1" operator="in" result="glow1" />

          {/* Outer glow (only for powered state) */}
          {powered && (
            <>
              <feGaussianBlur in="SourceGraphic" stdDeviation={glowRadius * 4} result="blur2" />
              <feFlood floodColor={glowColor} floodOpacity={glowIntensity * 0.25} />
              <feComposite in2="blur2" operator="in" result="glow2" />
            </>
          )}

          <feMerge>
            {powered && <feMergeNode in="glow2" />}
            <feMergeNode in="glow1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Original embossed filter from Figma */}
        <filter
          id={iconFilterId}
          x="0"
          y="0"
          width="27.7373"
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
          <feOffset dy="-0.5" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.5" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="overlay" in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
        </filter>
      </defs>

      <g filter={`url(#${glowFilterId})`}>
        <g filter={`url(#${iconFilterId})`}>
          <path
            d="M1 15.6318C1 11.1544 3.28836 7.21208 6.75195 4.90918L8.00098 4.07812L9.66211 6.57617L8.41211 7.40723C5.74952 9.17775 4 12.201 4 15.6318C4.00014 21.0818 8.41819 25.4999 13.8682 25.5C19.3183 25.5 23.7372 21.0819 23.7373 15.6318C23.7373 12.2008 21.987 9.17772 19.3242 7.40723L18.0752 6.57617L19.7363 4.07812L20.9854 4.90918C24.4488 7.2121 26.7373 11.1545 26.7373 15.6318C26.7372 22.7388 20.9751 28.5 13.8682 28.5C6.76133 28.4999 1.00014 22.7387 1 15.6318ZM12.3682 1.5H15.3682V10.8154H12.3682V1.5Z"
            fill={color}
            className="transition-all duration-200"
          />
        </g>
      </g>
    </svg>
  );
}

export { PowerButton, type PowerButtonProps };
