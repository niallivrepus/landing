import { motion } from "motion/react";

import { cn } from "../../lib/utils";
import { Avatar } from "./avatar";
import { Pet, type PetVariant } from "./pet";

type OriginColor = "fruta" | "flame" | "solar" | "life" | "aether" | "insight" | "spirit";

// Color mapping for each origin
const ORIGIN_COLORS: Record<OriginColor, { frame: string; panel: string; border: string; energy: string }> = {
  fruta: {
    frame: "var(--color-red-2)",
    panel: "var(--color-red-1)",
    border: "var(--color-red-3)",
    energy: "var(--color-red-4)",
  },
  flame: {
    frame: "var(--color-orange-2)",
    panel: "var(--color-orange-1)",
    border: "var(--color-orange-3)",
    energy: "var(--color-orange-4)",
  },
  solar: {
    frame: "var(--color-yellow-2)",
    panel: "var(--color-yellow-1)",
    border: "var(--color-yellow-3)",
    energy: "var(--color-yellow-4)",
  },
  life: {
    frame: "var(--color-green-2)",
    panel: "var(--color-green-1)",
    border: "var(--color-green-3)",
    energy: "var(--color-green-4)",
  },
  aether: {
    frame: "var(--color-blue-2)",
    panel: "var(--color-blue-1)",
    border: "var(--color-blue-3)",
    energy: "var(--color-blue-4)",
  },
  insight: {
    frame: "var(--color-purple-2)",
    panel: "var(--color-purple-1)",
    border: "var(--color-purple-3)",
    energy: "var(--color-purple-4)",
  },
  spirit: {
    frame: "var(--color-pink-2)",
    panel: "var(--color-pink-1)",
    border: "var(--color-pink-3)",
    energy: "var(--color-pink-4)",
  },
};

interface PassPhotoProps {
  /**
   * Avatar image source
   */
  src?: string;
  /**
   * Username for avatar fallback
   */
  username?: string;
  /**
   * User ID for avatar
   */
  userId?: string;
  /**
   * Label text displayed at the bottom (rotated)
   * @default "My Fren"
   */
  label?: string;
  /**
   * Pet variant to display (rotated -45° behind avatar)
   */
  pet: PetVariant;
  /**
   * Origin color variant
   * @default "spirit"
   */
  originColor?: OriginColor;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * PassPhoto - A passport-style photo frame component
 *
 * Features a decorative notched frame, inner panel with rim light,
 * an avatar with spirit origin border, pixel star decoration,
 * and rotated label text.
 *
 * Includes subtle bouncy scale animation on hover (up) and click (down).
 */
function PassPhoto({
  className,
  src,
  username,
  userId,
  label = "My Fren",
  pet,
  originColor = "spirit",
  onClick,
}: PassPhotoProps) {
  const colors = ORIGIN_COLORS[originColor];
  return (
    <motion.div
      className={cn("relative cursor-pointer", className)}
      style={{
        width: 60,
        height: 72,
      }}
      data-slot="pass-photo"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      onClick={onClick}
    >
      {/* Frame SVG - Dotted circle pattern background */}
      <div className="absolute h-[72px] left-0 top-0 w-[60px]">
        <svg
          width="60"
          height="72"
          viewBox="0 0 60 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block max-w-none size-full"
        >
          <g>
            <path
              d="M6 60C9.31371 60 12 62.6863 12 66C12 69.3137 9.31371 72 6 72C2.68629 72 0 69.3137 0 66C0 62.6863 2.68629 60 6 60ZM18 60C21.3137 60 24 62.6863 24 66C24 69.3137 21.3137 72 18 72C14.6863 72 12 69.3137 12 66C12 62.6863 14.6863 60 18 60ZM30 60C33.3137 60 36 62.6863 36 66C36 69.3137 33.3137 72 30 72C26.6863 72 24 69.3137 24 66C24 62.6863 26.6863 60 30 60ZM42 60C45.3137 60 48 62.6863 48 66C48 69.3137 45.3137 72 42 72C38.6863 72 36 69.3137 36 66C36 62.6863 38.6863 60 42 60ZM54 60C57.3137 60 60 62.6863 60 66C60 69.3137 57.3137 72 54 72C50.6863 72 48 69.3137 48 66C48 62.6863 50.6863 60 54 60ZM6 48C9.31371 48 12 50.6863 12 54C12 57.3137 9.31371 60 6 60C2.68629 60 0 57.3137 0 54C0 50.6863 2.68629 48 6 48ZM54 48C57.3137 48 60 50.6863 60 54C60 57.3137 57.3137 60 54 60C50.6863 60 48 57.3137 48 54C48 50.6863 50.6863 48 54 48ZM6 36C9.31371 36 12 38.6863 12 42C12 45.3137 9.31371 48 6 48C2.68629 48 0 45.3137 0 42C0 38.6863 2.68629 36 6 36ZM54 36C57.3137 36 60 38.6863 60 42C60 45.3137 57.3137 48 54 48C50.6863 48 48 45.3137 48 42C48 38.6863 50.6863 36 54 36ZM6 24C9.31371 24 12 26.6863 12 30C12 33.3137 9.31371 36 6 36C2.68629 36 0 33.3137 0 30C0 26.6863 2.68629 24 6 24ZM54 24C57.3137 24 60 26.6863 60 30C60 33.3137 57.3137 36 54 36C50.6863 36 48 33.3137 48 30C48 26.6863 50.6863 24 54 24ZM6 12C9.31371 12 12 14.6863 12 18C12 21.3137 9.31371 24 6 24C2.68629 24 0 21.3137 0 18C0 14.6863 2.68629 12 6 12ZM54 12C57.3137 12 60 14.6863 60 18C60 21.3137 57.3137 24 54 24C50.6863 24 48 21.3137 48 18C48 14.6863 50.6863 12 54 12ZM6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM18 0C21.3137 0 24 2.68629 24 6C24 9.31371 21.3137 12 18 12C14.6863 12 12 9.31371 12 6C12 2.68629 14.6863 0 18 0ZM30 0C33.3137 0 36 2.68629 36 6C36 9.31371 33.3137 12 30 12C26.6863 12 24 9.31371 24 6C24 2.68629 26.6863 0 30 0ZM42 0C45.3137 0 48 2.68629 48 6C48 9.31371 45.3137 12 42 12C38.6863 12 36 9.31371 36 6C36 2.68629 38.6863 0 42 0ZM54 0C57.3137 0 60 2.68629 60 6C60 9.31371 57.3137 12 54 12C50.6863 12 48 9.31371 48 6C48 2.68629 50.6863 0 54 0Z"
              fill={colors.frame}
            />
          </g>
          <defs>
            <filter
              id="filter0_i_pass_frame"
              x="0"
              y="0"
              width="60"
              height="73"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="0.5" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_pass_frame" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Inner panel - pink background with border and rim light */}
      <div className="absolute left-[6px] top-[6px]">
        <svg
          width="48"
          height="60"
          viewBox="0 0 48 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <rect width="48" height="60" rx="6" fill={colors.panel} />
          </g>
          <rect
            x="1"
            y="1"
            width="46"
            height="58"
            rx="5"
            stroke={colors.border}
            strokeWidth="1"
          />
          <defs>
            <filter
              id="filter0_i_pass_panel"
              x="0"
              y="0"
              width="48"
              height="61"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="0.5" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_pass_panel" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Pet decoration (rotated -45° behind avatar) */}
      <div
        className="absolute"
        style={{
          left: 14.814,
          top: 10.43,
          width: 10,
          height: 11.327,
          transform: "rotate(-45deg)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Pet variant={pet} />
      </div>

      {/* Avatar with origin border */}
      <div
        className="absolute"
        style={{
          left: 13.5,
          top: 14,
          zIndex: 1,
        }}
      >
        <Avatar
          src={src}
          username={username}
          userId={userId}
          size="small"
          borderStyle="origins"
          originColor={originColor}
          disableNavigation
        />
      </div>

      {/* Label text - rotated, 12px offset to the right */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          bottom: 19.75,
          right: 19.42 - 8, // 8px offset to the right (subtract from right position)
          width: 48.052,
          height: 19.553,
          transform: "translateX(50%) translateY(100%)",
        }}
      >
        <div
          style={{
            transform: "rotate(-12deg)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display), 'Rock Salt', cursive",
              fontSize: "8.982px",
              lineHeight: 1.2,
              color: "var(--color-light-space, white)",
              textShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}


export { PassPhoto, type PassPhotoProps };
