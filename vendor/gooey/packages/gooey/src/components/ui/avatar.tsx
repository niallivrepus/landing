import { type CSSProperties, useEffect, useId, useRef, useState } from "react";

import { useTheme } from "../../hooks/use-theme";
import { NexusLogo } from "./nexus-logo";

const AVATAR_KEYFRAMES_ID = "avatar-keyframes";
const AVATAR_KEYFRAMES_CSS = `
@keyframes storyRingPulse {
  0%, 100% {
    filter: brightness(1) saturate(1);
  }
  50% {
    filter: brightness(1.15) saturate(1.2);
  }
}
`;

function injectAvatarStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(AVATAR_KEYFRAMES_ID)) return;
  const style = document.createElement("style");
  style.id = AVATAR_KEYFRAMES_ID;
  style.textContent = AVATAR_KEYFRAMES_CSS;
  document.head.appendChild(style);
}

/** map a same-origin png/jpg avatar to its lighter `.avif` sibling, else null */
function avifSibling(src: string): string | null {
  if (/^(https?:|data:|blob:)/i.test(src)) return null;
  const match = src.match(/^([^?#]+)\.(png|jpe?g)([?#].*)?$/i);
  return match ? `${match[1]}.avif${match[3] ?? ""}` : null;
}

const AVATAR_IMG_STYLE: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

/**
 * avatar image that prefers a smaller `.avif` sibling via `<picture>`, falling
 * back to the original raster automatically if the avif is missing or fails to
 * decode. self-contained so the surrounding avatar render stays unconditional.
 */
function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const avif = avifSibling(src);
  const [avifFailed, setAvifFailed] = useState(false);

  if (!avif || avifFailed) {
    return <img src={src} alt={alt} decoding="async" style={AVATAR_IMG_STYLE} />;
  }

  return (
    <picture style={{ display: "contents" }}>
      <source srcSet={avif} type="image/avif" />
      <img
        src={src}
        alt={alt}
        decoding="async"
        style={AVATAR_IMG_STYLE}
        onError={() => setAvifFailed(true)}
      />
    </picture>
  );
}

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "micro" | "tiny" | "mini" | "small" | "compact" | "medium" | "large" | "xlarge";
  className?: string;
  style?: CSSProperties;
  username?: string;
  userId?: string;
  onClick?: () => void;
  onStoryClick?: () => void;
  borderStyle?: "default" | "wallet" | "none" | "origins" | "materials" | "minerals";
  /**
   * Origin gradient color (only used when borderStyle is "origins")
   * @default "aether"
   */
  originColor?: "fruta" | "flame" | "solar" | "life" | "aether" | "insight" | "spirit";
  /**
   * Material gradient color (only used when borderStyle is "materials")
   * @default "gold"
   */
  materialColor?: "vanadium" | "crude-copper" | "copper" | "bronze" | "steel" | "rose-gold" | "gold" | "silver" | "platinum" | "jaskmarr";
  /**
   * Mineral gradient color (only used when borderStyle is "minerals")
   * @default "rulgor"
   */
  mineralColor?: "rulgor" | "veltryne" | "zharuk" | "kaleidyx";
  disableNavigation?: boolean;
  hasActiveStory?: boolean;
  showStoryRing?: boolean;
  enableStoryPreload?: boolean;
  ignoreProfileImage?: boolean;
  /** Show OO mascot character instead of user image (pairs with originColor) */
  showOO?: boolean;
  /** OO facial expression (only used when showOO is true) */
  ooExpression?: "default" | "happy" | "rainbow-puke";
  /** Whether unviewed stories exist (controls story ring animation) */
  hasUnviewedStories?: boolean;
}

const AVATAR_SIZES = {
  micro: { width: "18px", height: "24px" },
  tiny: { width: "20px", height: "26px" },
  mini: { width: "24px", height: "32px" },
  small: { width: "32px", height: "42px" },
  compact: { width: "30px", height: "40px" },
  medium: { width: "40px", height: "54px" },
  large: { width: "48px", height: "64px" },
  xlarge: { width: "88px", height: "120px" },
};

/** Origins gradient colors (omni-referenced: same in dark and light themes) */
const ORIGINS_GRADIENTS: Record<string, { start: string; end: string }> = {
  fruta: { start: "#CB0B03", end: "#FF0970" },
  flame: { start: "#FF4D00", end: "#FFB800" },
  solar: { start: "#FF9D00", end: "#F2FF3D" },
  life: { start: "#77FF00", end: "#D8FF3D" },
  aether: { start: "#002FFF", end: "#3D7EFF" },
  insight: { start: "#7700FF", end: "#B200FF" },
  spirit: { start: "#FF00D9", end: "#FF58B4" },
};

/** Materials gradient colors (theme-aware: dark and light variants) */
const MATERIALS_GRADIENTS: Record<string, { dark: [string, string]; light: [string, string] }> = {
  vanadium: { dark: ["#0A0A0B", "#202027"], light: ["#0C0C0D", "#33333D"] },
  "crude-copper": { dark: ["#2E221C", "#724E43"], light: ["#4A372D", "#8E6052"] },
  copper: { dark: ["#7E5353", "#D09486"], light: ["#B67878", "#F5AE9F"] },
  bronze: { dark: ["#997468", "#E5AF9E"], light: ["#997468", "#E5AF9E"] },
  steel: { dark: ["#88837B", "#CDCBC8"], light: ["#A09A90", "#E9E7E4"] },
  "rose-gold": { dark: ["#BA8279", "#F9CEC5"], light: ["#E6A398", "#FFE9E5"] },
  gold: { dark: ["#CCAB88", "#FFF1DA"], light: ["#E7C29B", "#FFF5E4"] },
  silver: { dark: ["#CDD7D0", "#F3F0E4"], light: ["#CDD7D0", "#F3F0E4"] },
  platinum: { dark: ["#CCD4E9", "#E7FCF6"], light: ["#CCD4E9", "#E7FCF6"] },
  jaskmarr: { dark: ["#CCC3FF", "#F8E3FF"], light: ["#CCC3FF", "#F8E3FF"] },
};

/** Minerals gradient colors (theme-aware: multi-stop gradients) */
const MINERALS_GRADIENTS: Record<string, { angle: string; dark: { color: string; percent: number }[]; light: { color: string; percent: number }[] }> = {
  rulgor: {
    angle: "135deg",
    dark: [
      { color: "#5F081D", percent: 0 },
      { color: "#2E0208", percent: 16 },
      { color: "#1A0003", percent: 32 },
      { color: "#490009", percent: 56 },
      { color: "#2D0005", percent: 72 },
      { color: "#580000", percent: 100 },
    ],
    light: [
      { color: "#8F0D2C", percent: 0 },
      { color: "#5C0410", percent: 16 },
      { color: "#400108", percent: 32 },
      { color: "#76000E", percent: 56 },
      { color: "#60010B", percent: 72 },
      { color: "#7F0101", percent: 100 },
    ],
  },
  veltryne: {
    angle: "135deg",
    dark: [
      { color: "#085F0C", percent: 0 },
      { color: "#022E09", percent: 16 },
      { color: "#001A0F", percent: 32 },
      { color: "#00490C", percent: 56 },
      { color: "#002D02", percent: 72 },
      { color: "#005809", percent: 100 },
    ],
    light: [
      { color: "#0C7A11", percent: 0 },
      { color: "#035010", percent: 16 },
      { color: "#013E24", percent: 32 },
      { color: "#016611", percent: 56 },
      { color: "#004303", percent: 72 },
      { color: "#00740C", percent: 100 },
    ],
  },
  zharuk: {
    angle: "135deg",
    dark: [
      { color: "#080C5F", percent: 0 },
      { color: "#02072E", percent: 16 },
      { color: "#04001A", percent: 32 },
      { color: "#000349", percent: 56 },
      { color: "#01002D", percent: 72 },
      { color: "#000458", percent: 100 },
    ],
    light: [
      { color: "#0C117D", percent: 0 },
      { color: "#040D52", percent: 16 },
      { color: "#0B0143", percent: 32 },
      { color: "#03076B", percent: 56 },
      { color: "#020055", percent: 72 },
      { color: "#020881", percent: 100 },
    ],
  },
  kaleidyx: {
    angle: "135deg",
    dark: [
      { color: "#B6B1D3", percent: 0 },
      { color: "#BFD8E3", percent: 16 },
      { color: "#EDEDED", percent: 32 },
      { color: "#DFCCD0", percent: 56 },
      { color: "#D3D9CE", percent: 72 },
      { color: "#FFFFFF", percent: 100 },
    ],
    light: [
      { color: "#EAE7FF", percent: 0 },
      { color: "#E4F7FF", percent: 16 },
      { color: "#FFFFFF", percent: 32 },
      { color: "#FFF4F6", percent: 56 },
      { color: "#F6FFF0", percent: 72 },
      { color: "#FFFFFF", percent: 100 },
    ],
  },
};

/** OO mascot colors per origin — fixed hex values, theme-independent */
const OO_ORIGIN_COLORS: Record<string, { bg: string; bodyStart: string; bodyEnd: string; stroke: string; eye: string }> = {
  fruta: { bg: "#480900", bodyStart: "#CB0B03", bodyEnd: "#FF0970", stroke: "#FFB4B1", eye: "#FFFFFF" },
  flame: { bg: "#6B2000", bodyStart: "#FF4D00", bodyEnd: "#FFB800", stroke: "#FFEBDF", eye: "#FFFFFF" },
  solar: { bg: "#673F00", bodyStart: "#FF9D00", bodyEnd: "#F2FF3D", stroke: "#FFE7AB", eye: "#000000" },
  life: { bg: "#0A8200", bodyStart: "#77FF00", bodyEnd: "#D8FF3D", stroke: "#B2FFAB", eye: "#000000" },
  aether: { bg: "#002F76", bodyStart: "#002FFF", bodyEnd: "#3D7EFF", stroke: "#DDEDFF", eye: "#FFFFFF" },
  insight: { bg: "#5D0EAC", bodyStart: "#7700FF", bodyEnd: "#B300FF", stroke: "#E2C5FF", eye: "#FFFFFF" },
  spirit: { bg: "#52004D", bodyStart: "#FF00D9", bodyEnd: "#FF58B4", stroke: "#FFAAF9", eye: "#FFFFFF" },
};

/** OO mascot sizing per avatar size */
const OO_AVATAR_SIZES: Record<string, { width: number; height: number; top: number }> = {
  micro: { width: 12, height: 15, top: 12 },
  tiny: { width: 14, height: 17, top: 14 },
  mini: { width: 17, height: 20, top: 18 },
  small: { width: 21, height: 25, top: 23 },
  compact: { width: 21, height: 24, top: 19 },
  medium: { width: 28, height: 33, top: 25 },
  large: { width: 34, height: 40, top: 27 },
  xlarge: { width: 68, height: 80, top: 52 },
};

export const Avatar = ({
  src,
  alt = "User avatar",
  size = "medium",
  className = "",
  style = {},
  username,
  userId,
  onClick,
  onStoryClick,
  borderStyle = "default",
  originColor = "aether",
  materialColor = "gold",
  mineralColor = "rulgor",
  disableNavigation = false,
  hasActiveStory: hasActiveStoryProp = false,
  showStoryRing = true,
  showOO = false,
  ooExpression = "default",
  hasUnviewedStories: hasUnviewedStoriesProp = false,
}: AvatarProps) => {
  const { isDarkMode } = useTheme();
  const dimensions = AVATAR_SIZES[size] || AVATAR_SIZES.medium;
  const ooId = useId();
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectAvatarStyles();
  }, []);

  const hasActiveStory = hasActiveStoryProp;
  const resolvedHasUnviewedStories = hasUnviewedStoriesProp;

  const effectiveSrc = src;

  const borderSize =
    borderStyle === "none"
      ? 0
      : borderStyle === "wallet"
        ? 2
        : borderStyle === "origins" || borderStyle === "materials" || borderStyle === "minerals"
          ? (size === "micro" || size === "tiny" || size === "mini" || size === "small") ? 2 : 3
          : hasActiveStory
            ? 2
            : 3;

  const getBorderStyles = () => {
    if (borderStyle === "none") {
      return {};
    }
    if (borderStyle === "origins") {
      const gradient = ORIGINS_GRADIENTS[originColor] || ORIGINS_GRADIENTS.aether;
      return {
        background: `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.end} 100%)`,
        boxShadow:
          (size === "micro" || size === "tiny")
            ? "none"
            : "none",
      };
    }
    if (borderStyle === "materials") {
      const gradient = MATERIALS_GRADIENTS[materialColor] || MATERIALS_GRADIENTS.gold;
      const colors = isDarkMode ? gradient.dark : gradient.light;
      return {
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        boxShadow:
          (size === "micro" || size === "tiny")
            ? "none"
            : "none",
      };
    }
    if (borderStyle === "minerals") {
      const gradient = MINERALS_GRADIENTS[mineralColor] || MINERALS_GRADIENTS.rulgor;
      const stops = isDarkMode ? gradient.dark : gradient.light;
      const stopsStr = stops.map((s) => `${s.color} ${s.percent}%`).join(", ");
      return {
        background: `linear-gradient(${gradient.angle}, ${stopsStr})`,
        boxShadow:
          (size === "micro" || size === "tiny")
            ? "none"
            : "none",
      };
    }
    if (hasActiveStory && showStoryRing) {
      const isViewed = resolvedHasUnviewedStories === false;
      if (isViewed) {
        return {
          background: "var(--color-gradient-yin)",
        };
      }
      return {
        background: "var(--color-gradient-flame)",
        animation: "storyRingPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      };
    }
    if (borderStyle === "wallet") {
      return {};
    }
    return {
      background: "var(--gradient-gummy)",
    };
  };

  const handleClick = () => {
    if (hasActiveStory && showStoryRing && onStoryClick) {
      onStoryClick();
      return;
    }
    if (onClick) {
      onClick();
      return;
    }
  };

  const isClickable =
    hasActiveStory && showStoryRing
      ? !!onStoryClick
      : !!onClick;

  const ooColors = OO_ORIGIN_COLORS[originColor] || OO_ORIGIN_COLORS.aether;
  const ooSize = OO_AVATAR_SIZES[size] || OO_AVATAR_SIZES.medium;

  const [ooHovered, setOoHovered] = useState(false);
  const [ooClicked, setOoClicked] = useState(false);
  const activeOoExpression = showOO
    ? ooClicked ? "rainbow-puke" : ooHovered ? "happy" : ooExpression
    : ooExpression;

  const avatarContent = (
    <div
      ref={avatarRef}
      className={`avatar-border ${className} ${borderStyle === "wallet" ? "dark:border-none dark:bg-(--color-dark-glass-85) dark:outline-1 dark:outline-(--color-light-glass-10) dark:-outline-offset-2 dark:shadow-none border border-white/60 bg-[rgba(255,255,255,0.7)] backdrop-blur-[20px] backdrop-saturate-180 shadow-none" : ""}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        padding: borderSize,
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        cursor: isClickable ? "pointer" : undefined,
        position: "relative",
        ...getBorderStyles(),
        ...style,
      }}
      onClick={isClickable ? handleClick : undefined}
    >
      {showOO ? (
        <div
          className="avatar-oo"
          style={{
            width: `calc(${dimensions.width} - ${borderSize * 2}px)`,
            height: `calc(${dimensions.height} - ${borderSize * 2}px)`,
            borderRadius: "999px",
            background: ooColors.bg,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flexShrink: 0,
            zIndex: 1,
            boxShadow:
              borderStyle === "origins" || borderStyle === "materials" || borderStyle === "minerals"
                ? "none"
                : (size === "micro" || size === "tiny")
                  ? "none"
                  : "none",
          }}
          role="img"
          aria-label="OO"
          onMouseEnter={() => setOoHovered(true)}
          onMouseLeave={() => { setOoHovered(false); setOoClicked(false); }}
          onClick={(e) => { e.stopPropagation(); setOoClicked(true); }}
        >
          <svg
            width={ooSize.width}
            height={ooSize.height}
            viewBox="0 0 39 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: ooSize.top + (ooClicked ? -3 : ooHovered ? 2 : 0),
              transition: "top 0.15s ease",
            }}
          >
            <defs>
              <linearGradient
                id={`oo-grad-${ooId}`}
                x1="2" y1="43.882" x2="40.5535" y2="39.8229"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={ooColors.bodyStart} />
                <stop offset="1" stopColor={ooColors.bodyEnd} />
              </linearGradient>
              <filter
                id={`oo-ishadow-${ooId}`}
                x="0" y="0" width="38.5713" height="47.2489"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="1.3671" />
                <feGaussianBlur stdDeviation="0.683548" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
              </filter>
              <filter
                id={`oo-eshadow-${ooId}`}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="-0.341774" />
                <feGaussianBlur stdDeviation="0.341774" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="0.341774" />
                <feGaussianBlur stdDeviation="0.341774" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                <feBlend mode="overlay" in2="effect1_dropShadow" result="effect2_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
              </filter>
              <mask
                id={`oo-mask-${ooId}`}
                maskUnits="userSpaceOnUse"
                x="0" y="0" width="39" height="46"
              >
                <rect fill="white" width="39" height="46" />
                <path d="M14.874 2C15.283 2 15.684 2.03547 16.0742 2.10156C24.2 2.40708 31.1575 7.83523 34.4824 15.6387C35.8145 18.3494 36.5712 21.4563 36.5713 24.7588C36.5713 24.956 36.5669 25.1528 36.5615 25.3486C36.5672 25.5773 36.5713 25.8068 36.5713 26.0371H36.5322C35.9378 36.0024 28.4444 43.8816 19.2861 43.8818C9.73945 43.8818 2 35.3201 2 24.7588C2.0001 19.0454 4.2657 13.9181 7.85645 10.4141C7.7812 9.99873 7.73926 9.57081 7.73926 9.13379C7.73952 5.19375 10.934 2.00016 14.874 2Z" />
              </mask>
              <clipPath id={`oo-rainbow-clip-${ooId}`}>
                <rect x="0.683" y="1.025" width="8" height="16" rx="1" />
              </clipPath>
            </defs>
            {/* Body with inner shadow */}
            <g>
              <path
                d="M14.874 2C15.283 2 15.684 2.03547 16.0742 2.10156C24.2 2.40708 31.1575 7.83523 34.4824 15.6387C35.8145 18.3494 36.5712 21.4563 36.5713 24.7588C36.5713 24.956 36.5669 25.1528 36.5615 25.3486C36.5672 25.5773 36.5713 25.8068 36.5713 26.0371H36.5322C35.9378 36.0024 28.4444 43.8816 19.2861 43.8818C9.73945 43.8818 2 35.3201 2 24.7588C2.0001 19.0454 4.2657 13.9181 7.85645 10.4141C7.7812 9.99873 7.73926 9.57081 7.73926 9.13379C7.73952 5.19375 10.934 2.00016 14.874 2Z"
                fill={`url(#oo-grad-${ooId})`}
              />
            </g>
            {/* Body stroke */}
            <path
              d="M14.874 2V0H14.8739L14.874 2ZM16.0742 2.10156L15.7402 4.07347L15.8688 4.09525L15.9991 4.10015L16.0742 2.10156ZM34.4824 15.6387L32.6425 16.4226L32.6636 16.4723L32.6875 16.5208L34.4824 15.6387ZM36.5713 24.7588H38.5713V24.7588L36.5713 24.7588ZM36.5615 25.3486L34.5623 25.2939L34.5608 25.3461L34.5621 25.3983L36.5615 25.3486ZM36.5713 26.0371V28.0371H38.5713L38.5713 26.0371L36.5713 26.0371ZM36.5322 26.0371V24.0371H34.648L34.5358 25.918L36.5322 26.0371ZM19.2861 43.8818V45.8818H19.2862L19.2861 43.8818ZM2 24.7588L0 24.7588V24.7588H2ZM7.85645 10.4141L9.25327 11.8455L10.0139 11.1032L9.82441 10.0575L7.85645 10.4141ZM7.73926 9.13379L5.73926 9.13366V9.13379H7.73926ZM14.874 2V4C15.1672 4 15.4564 4.02541 15.7402 4.07347L16.0742 2.10156L16.4082 0.129651C15.9116 0.0455333 15.3989 0 14.874 0V2ZM16.0742 2.10156L15.9991 4.10015C23.2312 4.37207 29.5711 9.21416 32.6425 16.4226L34.4824 15.6387L36.3224 14.8547C32.744 6.45631 25.1688 0.442093 16.1494 0.102975L16.0742 2.10156ZM34.4824 15.6387L32.6875 16.5208C33.885 18.9577 34.5712 21.7629 34.5713 24.7588L36.5713 24.7588L38.5713 24.7588C38.5712 21.1497 37.7441 17.7412 36.2774 14.7566L34.4824 15.6387ZM36.5713 24.7588H34.5713C34.5713 24.928 34.5675 25.103 34.5623 25.2939L36.5615 25.3486L38.5608 25.4034C38.5663 25.2027 38.5713 24.984 38.5713 24.7588H36.5713ZM36.5615 25.3486L34.5621 25.3983C34.5676 25.6183 34.5713 25.8297 34.5713 26.0371L36.5713 26.0371L38.5713 26.0371C38.5713 25.7839 38.5668 25.5363 38.5609 25.299L36.5615 25.3486ZM36.5713 26.0371V24.0371H36.5322V26.0371V28.0371H36.5713V26.0371ZM36.5322 26.0371L34.5358 25.918C33.9934 35.0117 27.2103 41.8816 19.2861 41.8818L19.2861 43.8818L19.2862 45.8818C29.6785 45.8815 37.8823 36.993 38.5287 26.1562L36.5322 26.0371ZM19.2861 43.8818V41.8818C11.0292 41.8818 4 34.4103 4 24.7588H2H0C0 36.2299 8.44966 45.8818 19.2861 45.8818V43.8818ZM2 24.7588L4 24.7588C4.00009 19.5737 6.05573 14.9658 9.25327 11.8455L7.85645 10.4141L6.45962 8.98267C2.47567 12.8704 0.000105619 18.5171 0 24.7588L2 24.7588ZM7.85645 10.4141L9.82441 10.0575C9.76889 9.75106 9.73926 9.44264 9.73926 9.13379H7.73926H5.73926C5.73926 9.69899 5.79351 10.2464 5.88848 10.7706L7.85645 10.4141ZM7.73926 9.13379L9.73926 9.13392C9.73945 6.29866 12.0382 4.00012 14.8741 4L14.874 2L14.8739 0C9.82968 0.000210524 5.73959 4.08884 5.73926 9.13366L7.73926 9.13379Z"
              fill={ooColors.stroke}
              mask={`url(#oo-mask-${ooId})`}
            />
            {/* Eyes */}
            {activeOoExpression === "happy" || activeOoExpression === "rainbow-puke" ? (
              <g transform="translate(15.5, 12.4)">
                <path d="M3.89697 1.02533C0.435924 1.32109 0.472019 5.97135 0.858909 7.92327C1.48452 6.88095 2.8135 4.79631 4.02087 4.79631C5.59815 4.79631 6.50606 6.88096 7.09943 7.92328C7.57682 5.46175 6.96019 1.02532 3.89697 1.02533Z" fill={ooColors.eye} />
                <path d="M13.6387 1.02533C11.5964 1.08988 10.8049 4.65175 11.4985 7.91882C12.0018 6.87649 13.2512 4.79184 14.2226 4.79184C15.1939 4.79184 16.3914 6.87649 16.8688 7.91882C17.1462 5.32551 16.195 1.02532 13.6387 1.02533Z" fill={ooColors.eye} />
              </g>
            ) : (
              <>
                <g>
                  <ellipse cx="19.4223" cy="16.9144" rx="3.37091" ry="5.25236" fill={ooColors.eye} />
                </g>
                <g>
                  <ellipse
                    cx="29.5921" cy="16.9143"
                    rx="2.86138" ry="5.25236"
                    transform="rotate(-6.90938 29.5921 16.9143)"
                    fill={ooColors.eye}
                  />
                </g>
              </>
            )}
            {/* Rainbow puke */}
            {activeOoExpression === "rainbow-puke" && (
              <g transform="translate(20, 25)">
                <g clipPath={`url(#oo-rainbow-clip-${ooId})`}>
                  <rect x="0.683" y="1.025" width="8" height="16" rx="1" fill="white" />
                  <rect width="1" height="16" x="0.683" y="1.025" fill="#FF0700" />
                  <rect width="1" height="16" x="1.683" y="1.025" fill="#FF4D00" />
                  <rect width="1" height="16" x="2.683" y="1.025" fill="#FFC633" />
                  <rect width="1" height="16" x="3.683" y="1.025" fill="#21DC11" />
                  <rect width="1" height="16" x="4.683" y="1.025" fill="#43FDFF" />
                  <rect width="1" height="16" x="5.683" y="1.025" fill="#0066FF" />
                  <rect width="1" height="16" x="6.683" y="1.025" fill="#9327FF" />
                  <rect width="1" height="16" x="7.683" y="1.025" fill="#FF00EE" />
                </g>
              </g>
            )}
          </svg>
        </div>
      ) : effectiveSrc ? (
        <div
          className="avatar"
          style={{
            width: `calc(${dimensions.width} - ${borderSize * 2}px)`,
            height: `calc(${dimensions.height} - ${borderSize * 2}px)`,
            borderRadius: "999px",
            overflow: "hidden",
            boxShadow:
              borderStyle === "wallet"
                ? "none"
                : borderStyle === "origins" || borderStyle === "materials" || borderStyle === "minerals"
                  ? "none"
                  : hasActiveStory && showStoryRing
                    ? (size === "micro" || size === "tiny")
                      ? "none"
                      : "none"
                    : (size === "micro" || size === "tiny")
                      ? "none"
                      : "none",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <AvatarImage src={effectiveSrc} alt={alt} />
        </div>
      ) : userId === "jokuh-bot" ? (
        <div
          className="avatar-fallback"
          style={{
            width: `calc(${dimensions.width} - ${borderSize * 2}px)`,
            height: `calc(${dimensions.height} - ${borderSize * 2}px)`,
            borderRadius: "999px",
            background: "#000000",
            boxShadow:
              borderStyle === "origins" || borderStyle === "materials" || borderStyle === "minerals"
                ? "none"
                : (size === "micro" || size === "tiny")
                  ? "none"
                  : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
          role="img"
          aria-label="Jokuh"
        >
          <NexusLogo
            height={
              size === "xlarge"
                ? 32
                : size === "large"
                  ? 24
                  : size === "medium"
                    ? 18
                    : 14
            }
            className="opacity-70"
          />
        </div>
      ) : (
        <div
          className="avatar-fallback"
          style={{
            width: `calc(${dimensions.width} - ${borderSize * 2}px)`,
            height: `calc(${dimensions.height} - ${borderSize * 2}px)`,
            borderRadius: "999px",
            background: "var(--gradient-yin)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize:
              size === "xlarge"
                ? "28px"
                : size === "large"
                  ? "18px"
                  : size === "medium"
                    ? "14px"
                    : "10px",
            fontWeight: 600,
            color: "var(--color-light-glass-80)",
            textTransform: "uppercase",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
          role="img"
          aria-label={alt}
        >
          {username ? username.slice(0, 2) : "?"}
        </div>
      )}
    </div>
  );

  return avatarContent;
};

export default Avatar;
