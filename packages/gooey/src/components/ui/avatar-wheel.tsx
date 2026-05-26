import { cn } from "../../lib/utils";
import { useEffect } from "react";
import { Avatar, type AvatarProps } from "./avatar";

// Origin colors that cycle through for the wheel
const ORIGIN_COLORS: AvatarProps["originColor"][] = [
  "aether",   // #002fff - blue
  "life",     // #77ff00 - green
  "solar",    // #ff9d00 - yellow/orange
  "flame",    // #ff4d00 - orange
  "spirit",   // #ff00d9 - pink
  "fruta",    // #cb0b03 - red
  "insight",  // #7700ff - purple
];

interface AvatarWheelItem {
  /** Avatar image URL */
  src: string;
  /** Alt text for the image */
  alt?: string;
  /** Optional username */
  username?: string;
  /** Optional userId */
  userId?: string;
  /** Override the origin color (otherwise cycles through ORIGIN_COLORS) */
  originColor?: AvatarProps["originColor"];
}

interface AvatarWheelProps {
  /** Array of avatar items to display around the wheel */
  avatars: AvatarWheelItem[];
  /**
   * Size of the wheel in pixels
   * @default 900
   */
  size?: number;
  /**
   * Avatar size preset
   * @default "large"
   */
  avatarSize?: AvatarProps["size"];
  /**
   * Opacity of the wheel (0-1)
   * @default 1
   */
  opacity?: number;
  /**
   * Animation duration in seconds (for one full rotation)
   * Set to 0 to disable animation
   * @default 60
   */
  animationDuration?: number;
  /**
   * Animation direction
   * @default "clockwise"
   */
  animationDirection?: "clockwise" | "counterclockwise";
  /** Additional CSS classes for the outer container */
  className?: string;
}

/**
 * Single avatar positioned on the wheel
 */
function WheelAvatar({
  item,
  angle,
  radius,
  avatarSize,
  index,
}: {
  item: AvatarWheelItem;
  angle: number;
  radius: number;
  avatarSize: AvatarProps["size"];
  index: number;
}) {
  // Convert angle to radians for positioning
  const angleRad = (angle * Math.PI) / 180;

  // Calculate position on the circle
  const x = radius * Math.sin(angleRad);
  const y = -radius * Math.cos(angleRad);

  // Cycle through origin colors
  const originColor = item.originColor ?? ORIGIN_COLORS[index % ORIGIN_COLORS.length];

  return (
    <div
      className="absolute"
      style={{
        // Position from center, multiplied by --wheel-spread for 3D parallax effect
        left: `calc(50% + calc(${x}px * var(--wheel-spread, 1)))`,
        top: `calc(50% + calc(${y}px * var(--wheel-spread, 1)))`,
        // Center the avatar on the position
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      }}
    >
      <Avatar
        src={item.src}
        alt={item.alt}
        username={item.username}
        userId={item.userId}
        size={avatarSize}
        borderStyle="origins"
        originColor={originColor}
        disableNavigation
        showStoryRing={false}
        ignoreProfileImage
      />
    </div>
  );
}

/**
 * AvatarWheel - Circular arrangement of Avatar components
 *
 * Structure:
 * - Outer container div (static, size x size) - for positioning control
 * - Inner rotating div (size x size) - contains the avatars and animates
 */
function AvatarWheel({
  avatars,
  size = 900,
  avatarSize = "large",
  opacity = 1,
  animationDuration = 60,
  animationDirection = "clockwise",
  className,
}: AvatarWheelProps) {
  // Avatar dimensions for radius calculation
  const avatarHeights: Record<string, number> = {
    tiny: 26,
    small: 42,
    medium: 54,
    large: 64,
    xlarge: 120,
  };
  const avatarHeight = avatarHeights[avatarSize] || 64;

  // Radius from center to avatar center
  const radius = (size / 2) - (avatarHeight / 2) - 4;

  // Calculate angle step based on number of avatars
  const angleStep = 360 / avatars.length;

  // Animation style for the inner rotating div
  const animationStyle = animationDuration > 0 ? {
    animation: `avatarWheelSpin ${animationDuration}s linear infinite ${animationDirection === "counterclockwise" ? "reverse" : "normal"}`,
  } : {};

  return (
    // Outer container - static, for positioning
    <div
      className={cn("relative", className)}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Inner rotating div - contains avatars */}
      <div
        className="absolute inset-0"
        style={{
          width: size,
          height: size,
          opacity,
          ...animationStyle,
        }}
      >
        {avatars.map((avatar, index) => (
          <WheelAvatar
            key={index}
            item={avatar}
            angle={index * angleStep}
            radius={radius}
            avatarSize={avatarSize}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

// CSS keyframes for the wheel animations
const WHEEL_KEYFRAMES_ID = "avatar-wheel-keyframes";
const WHEEL_KEYFRAMES_CSS = `
/* Register custom property for smooth animation interpolation */
@property --wheel-spread {
  syntax: '<number>';
  initial-value: 1;
  inherits: true;
}

@keyframes avatarWheelSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes avatarWheelZoom {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  40% {
    /* At 640px (scale 0.71), still fading in */
    transform: scale(0.71);
    opacity: 0.5;
  }
  56% {
    /* At 900px (scale 1.0), full opacity, at viewport edge */
    transform: scale(1);
    opacity: 1;
  }
  100% {
    /* At 1600px (scale 1.78), fully faded out */
    transform: scale(1.78);
    opacity: 0;
  }
}

/* 3D parallax spread: avatars move apart faster than scale
   Formula: spread = 1 + k × (scale - 1), where k = 0.3 */
@keyframes avatarWheelSpread {
  0% { --wheel-spread: 0.7; }
  40% { --wheel-spread: 0.91; }
  56% { --wheel-spread: 1.0; }
  100% { --wheel-spread: 1.23; }
}
`;

function injectWheelStyles() {
  if (typeof document === "undefined") return;
  // Always update the styles to ensure latest keyframes (fixes HMR issues)
  const existing = document.getElementById(WHEEL_KEYFRAMES_ID);
  if (existing) {
    existing.textContent = WHEEL_KEYFRAMES_CSS;
    return;
  }
  const style = document.createElement("style");
  style.id = WHEEL_KEYFRAMES_ID;
  style.textContent = WHEEL_KEYFRAMES_CSS;
  document.head.appendChild(style);
}

// Inject styles on module load
if (typeof document !== "undefined") {
  injectWheelStyles();
}

/**
 * PillWheelZoom - Infinite zoom animation with 4 counter-rotating avatar wheels
 *
 * Structure:
 * - Main container (900x900, clips content)
 * - 4 staggered AvatarWheels that scale from 0% to 178% (0 to 1600px)
 * - Each wheel is at a different phase of the zoom animation
 * - Creates continuous "zooming out from center" effect
 * - Slow fade-in (50% opacity at 640px), full opacity at 900px, fade-out to 1600px
 *
 * @example
 * <PillWheelZoom avatars={avatarList} />
 */
interface PillWheelZoomProps {
  /** Array of avatar items (will be distributed across the wheels) */
  avatars: AvatarWheelItem[];
  /**
   * Duration for one complete zoom cycle in seconds
   * @default 20
   */
  zoomDuration?: number;
  /**
   * Rotation duration in seconds (for one full spin)
   * @default 60
   */
  rotationDuration?: number;
  /** Additional CSS classes */
  className?: string;
}

function PillWheelZoom({
  avatars,
  zoomDuration = 20,
  rotationDuration = 60,
  className,
}: PillWheelZoomProps) {
  // Ensure styles are injected on mount (more reliable than module-level for HMR)
  useEffect(() => {
    injectWheelStyles();
  }, []);

  // Ensure we have enough avatars (24 per wheel × 4 wheels = 96)
  const extendedAvatars = [...avatars];
  while (extendedAvatars.length < 96) {
    extendedAvatars.push(...avatars);
  }

  // 4 wheels, each staggered by 25% of the animation cycle
  // Using negative animation-delay to start each wheel at a different phase
  const wheels = [
    { avatars: extendedAvatars.slice(0, 24), delayPercent: 0, direction: "clockwise" as const },
    { avatars: extendedAvatars.slice(24, 48), delayPercent: 0.25, direction: "counterclockwise" as const },
    { avatars: extendedAvatars.slice(48, 72), delayPercent: 0.5, direction: "clockwise" as const },
    { avatars: extendedAvatars.slice(72, 96), delayPercent: 0.75, direction: "counterclockwise" as const },
  ];

  return (
    // Main container - 900x900, clips content
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        width: 900,
        height: 900,
      }}
    >
      {wheels.map((wheel, i) => (
        // Centering wrapper - positions the wheel's center at container's center
        <div
          key={i}
          className="absolute inset-0 flex items-center justify-center"
          style={{ pointerEvents: "none" }}
        >
          {/* Scaling wrapper - animates scale, opacity, and spread for 3D parallax */}
          <div
            className="avatar-wheel-zoom-item"
            style={{
              willChange: "transform, opacity, --wheel-spread",
              animationName: "avatarWheelZoom, avatarWheelSpread",
              animationDuration: `${zoomDuration}s, ${zoomDuration}s`,
              animationTimingFunction: "linear, linear",
              animationIterationCount: "infinite, infinite",
              animationDelay: `-${wheel.delayPercent * zoomDuration}s, -${wheel.delayPercent * zoomDuration}s`,
            }}
          >
            <AvatarWheel
              avatars={wheel.avatars}
              size={900}
              avatarSize="large"
              animationDuration={rotationDuration}
              animationDirection={wheel.direction}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Legacy PillWheel for backwards compatibility
interface PillWheelProps {
  avatars: AvatarWheelItem[];
  animationDuration?: number;
  className?: string;
}

function PillWheel({
  avatars,
  animationDuration = 120,
  className,
}: PillWheelProps) {
  const extendedAvatars = [...avatars];
  while (extendedAvatars.length < 72) {
    extendedAvatars.push(...avatars);
  }

  const outerAvatars = extendedAvatars.slice(0, 24);
  const middleAvatars = extendedAvatars.slice(24, 48);
  const innerAvatars = extendedAvatars.slice(48, 72);

  return (
    <div className={cn("relative", className)} style={{ width: 900, height: 900 }}>
      <div className="absolute inset-0">
        <AvatarWheel
          avatars={outerAvatars}
          size={900}
          avatarSize="large"
          opacity={1}
          animationDuration={animationDuration}
          animationDirection="clockwise"
        />
      </div>
      <div className="absolute" style={{ left: 130, top: 130 }}>
        <AvatarWheel
          avatars={middleAvatars}
          size={640}
          avatarSize="small"
          opacity={0.5}
          animationDuration={animationDuration * 0.85}
          animationDirection="counterclockwise"
        />
      </div>
      <div className="absolute" style={{ left: 220, top: 220 }}>
        <AvatarWheel
          avatars={innerAvatars}
          size={460}
          avatarSize="tiny"
          opacity={0.2}
          animationDuration={animationDuration * 0.7}
          animationDirection="clockwise"
        />
      </div>
    </div>
  );
}

export {
  AvatarWheel,
  PillWheel,
  PillWheelZoom,
  type AvatarWheelProps,
  type AvatarWheelItem,
  type PillWheelProps,
  type PillWheelZoomProps,
};
