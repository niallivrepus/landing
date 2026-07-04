import * as React from "react";
import { motion } from "motion/react";
import { LockPasswordIcon } from "hugeicons-react";

import { useTheme } from "../../hooks/use-theme";
import { cn } from "../../lib/utils";
import { IconOnlyButton } from "./icon-only-button";
import { Bad } from "./bad";

type PasswordStrengthState = "neutral" | "bad" | "medium" | "good";

interface MakeItStrongProps {
  strength?: PasswordStrengthState;
  className?: string;
}

const DARK_GRADIENTS: Record<PasswordStrengthState, string> = {
  neutral:
    "radial-gradient(ellipse at center bottom, rgba(20,20,20) 0%, rgba(10,10,10) 50%, rgba(0,0,0) 100%)",
  bad:
    "radial-gradient(ellipse at center bottom, rgba(32,4,0) 0%, rgba(16,2,0) 50%, rgba(0,0,0) 100%)",
  medium:
    "radial-gradient(ellipse at center bottom, rgba(47,17,0) 0%, rgba(23,8,0) 33%, rgba(12,4,0) 66%, rgba(0,0,0) 100%)",
  good:
    "radial-gradient(ellipse at center bottom, rgba(0,57,57) 0%, rgba(0,29,29) 25%, rgba(0,14,14) 50%, rgba(0,7,7) 75%, rgba(0,0,0) 100%)",
};

const LIGHT_GRADIENTS: Record<PasswordStrengthState, string> = {
  neutral:
    "radial-gradient(ellipse at center bottom, rgba(238,239,243,0.96) 0%, rgba(248,249,251,0.98) 52%, rgba(255,255,255,1) 100%)",
  bad:
    "radial-gradient(ellipse at center bottom, rgba(255,222,224,0.96) 0%, rgba(255,241,242,0.98) 52%, rgba(255,255,255,1) 100%)",
  medium:
    "radial-gradient(ellipse at center bottom, rgba(255,233,207,0.96) 0%, rgba(255,247,235,0.99) 52%, rgba(255,255,255,1) 100%)",
  good:
    "radial-gradient(ellipse at center bottom, rgba(222,255,232,0.96) 0%, rgba(241,255,246,0.99) 52%, rgba(255,255,255,1) 100%)",
};

const KEY_FILLS: Record<PasswordStrengthState, string | undefined> = {
  neutral: undefined,
  bad: "url(#keyGrad_fruta)",
  medium: "url(#keyGrad_flame)",
  good: "url(#keyGrad_life)",
};

const KEY_SOLID = "var(--color-smoke-6)";

/**
 * GreenStar — a 5-pointed star with life gradient fill and green-2 stroke.
 * Reuses the same path data from star.tsx but swaps the color scheme.
 */
function GreenStar({ size = 12 }: { size?: number }) {
  const uniqueId = React.useId();
  const scale = size / 12;
  const svgWidth = 32 * scale;
  const svgHeight = 31 * scale;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox="0 0 32 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
      data-slot="green-star"
    >
      <defs>
        <filter
          id={`filter0_d_gstar-${uniqueId}`}
          x="0"
          y="0"
          width="31.7354"
          height="30.9307"
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
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.467 0 0 0 0 1 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <linearGradient
          id={`paint0_linear_gstar-${uniqueId}`}
          x1="9.20105"
          y1="21.2791"
          x2="23.939"
          y2="19.1903"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#77FF00" />
          <stop offset="1" stopColor="#D8FF3D" />
        </linearGradient>
      </defs>
      <g filter={`url(#filter0_d_gstar-${uniqueId})`}>
        <path
          d="M14.2645 12.4585C14.8763 11.2452 15.1822 10.6386 15.6294 10.5289C15.786 10.4905 15.9495 10.4905 16.106 10.5289C16.5533 10.6386 16.8592 11.2452 17.4709 12.4585C17.6414 12.7966 17.7267 12.9656 17.8566 13.0871C17.9238 13.1499 17.9994 13.2032 18.0811 13.2453C18.2392 13.3269 18.4248 13.35 18.7959 13.3963L18.9316 13.4132C20.1437 13.5644 20.7498 13.64 21.0024 13.9419C21.1726 14.1454 21.255 14.4082 21.2315 14.6724C21.1965 15.0645 20.7422 15.4726 19.8335 16.2889C19.564 16.531 19.4293 16.652 19.3472 16.8021C19.2904 16.9061 19.2525 17.0194 19.2353 17.1367C19.2105 17.3059 19.2455 17.485 19.3156 17.8432C19.5519 19.0509 19.6701 19.6547 19.4473 19.9951C19.3195 20.1903 19.1275 20.3347 18.9045 20.4033C18.5156 20.5229 17.9728 20.2441 16.8872 19.6865L16.6893 19.5849C16.3325 19.4016 16.1541 19.3099 15.9632 19.2916C15.8997 19.2855 15.8357 19.2855 15.7722 19.2916C15.5814 19.3099 15.4029 19.4016 15.0461 19.5849L14.8482 19.6865C13.7626 20.2441 13.2198 20.5229 12.8309 20.4033C12.6079 20.3347 12.4159 20.1903 12.2882 19.9951C12.0653 19.6547 12.1835 19.0509 12.4198 17.8432C12.4899 17.485 12.5249 17.3059 12.5001 17.1367C12.483 17.0194 12.4451 16.9061 12.3882 16.8021C12.3062 16.652 12.1714 16.531 11.902 16.2889C10.9933 15.4726 10.5389 15.0645 10.504 14.6724C10.4804 14.4082 10.5628 14.1454 10.7331 13.9419C10.9856 13.64 11.5917 13.5644 12.8038 13.4132L12.9395 13.3963C13.3107 13.35 13.4962 13.3269 13.6543 13.2453C13.7361 13.2032 13.8116 13.1499 13.8789 13.0871C14.0088 12.9656 14.094 12.7966 14.2645 12.4585Z"
          fill={`url(#paint0_linear_gstar-${uniqueId})`}
        />
        <path
          d="M14.2645 12.4585C14.8763 11.2452 15.1822 10.6386 15.6294 10.5289C15.786 10.4905 15.9495 10.4905 16.106 10.5289C16.5533 10.6386 16.8592 11.2452 17.4709 12.4585C17.6414 12.7966 17.7267 12.9656 17.8566 13.0871C17.9238 13.1499 17.9994 13.2032 18.0811 13.2453C18.2392 13.3269 18.4248 13.35 18.7959 13.3963L18.9316 13.4132C20.1437 13.5644 20.7498 13.64 21.0024 13.9419C21.1726 14.1454 21.255 14.4082 21.2315 14.6724C21.1965 15.0645 20.7422 15.4726 19.8335 16.2889C19.564 16.531 19.4293 16.652 19.3472 16.8021C19.2904 16.9061 19.2525 17.0194 19.2353 17.1367C19.2105 17.3059 19.2455 17.485 19.3156 17.8432C19.5519 19.0509 19.6701 19.6547 19.4473 19.9951C19.3195 20.1903 19.1275 20.3347 18.9045 20.4033C18.5156 20.5229 17.9728 20.2441 16.8872 19.6865L16.6893 19.5849C16.3325 19.4016 16.1541 19.3099 15.9632 19.2916C15.8997 19.2855 15.8357 19.2855 15.7722 19.2916C15.5814 19.3099 15.4029 19.4016 15.0461 19.5849L14.8482 19.6865C13.7626 20.2441 13.2198 20.5229 12.8309 20.4033C12.6079 20.3347 12.4159 20.1903 12.2882 19.9951C12.0653 19.6547 12.1835 19.0509 12.4198 17.8432C12.4899 17.485 12.5249 17.3059 12.5001 17.1367C12.483 17.0194 12.4451 16.9061 12.3882 16.8021C12.3062 16.652 12.1714 16.531 11.902 16.2889C10.9933 15.4726 10.5389 15.0645 10.504 14.6724C10.4804 14.4082 10.5628 14.1454 10.7331 13.9419C10.9856 13.64 11.5917 13.5644 12.8038 13.4132L12.9395 13.3963C13.3107 13.35 13.4962 13.3269 13.6543 13.2453C13.7361 13.2032 13.8116 13.1499 13.8789 13.0871C14.0088 12.9656 14.094 12.7966 14.2645 12.4585Z"
          stroke="#054000"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** Decorative key SVG with gradient support */
function DecorativeKey({ state }: { state: PasswordStrengthState }) {
  const uniqueId = React.useId();
  const fill = KEY_FILLS[state];
  const filterId = `filter_innerShadow_key-${uniqueId}`;

  return (
    <svg
      width={52}
      height={52}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="49.1565"
          height="50.3784"
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
          <feOffset dy="1.22188" />
          <feGaussianBlur stdDeviation="0.61094" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
        {state === "bad" && (
          <linearGradient id="keyGrad_fruta" x1="0" y1="50" x2="50" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CB0B03" />
            <stop offset="1" stopColor="#FF0970" />
          </linearGradient>
        )}
        {state === "medium" && (
          <linearGradient id="keyGrad_flame" x1="0" y1="50" x2="50" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF4D00" />
            <stop offset="1" stopColor="#FFB800" />
          </linearGradient>
        )}
        {state === "good" && (
          <linearGradient id="keyGrad_life" x1="0" y1="50" x2="50" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#77FF00" />
            <stop offset="1" stopColor="#D8FF3D" />
          </linearGradient>
        )}
      </defs>
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M44.5117 4.64476C38.2633 -1.60363 28.0687 -1.53965 21.7414 4.78765C17.973 8.55604 16.4283 13.6981 17.1108 18.5504C17.1283 18.6751 17.1156 18.7726 17.0988 18.8304C17.091 18.857 17.0839 18.871 17.0806 18.8765L1.59582 34.3613C0.435712 35.5214 -0.14073 37.1394 0.0291533 38.7587L0.566258 43.8785C0.827809 46.3716 2.7849 48.3287 5.278 48.5902L10.3977 49.1273C12.0171 49.2972 13.635 48.7208 14.7951 47.5606L18.651 43.7048C18.9474 43.4084 19.1716 43.0478 19.3059 42.6518L20.8068 38.2229L25.2357 36.7219C25.6318 36.5877 25.9923 36.3635 26.2887 36.0671L30.2799 32.0759C30.2855 32.0725 30.2995 32.0654 30.3261 32.0577C30.3838 32.0409 30.4814 32.0282 30.6061 32.0457C35.4583 32.7282 40.6004 31.1835 44.3688 27.4151C50.6961 21.0878 50.7601 10.8932 44.5117 4.64476ZM35.8835 18.9298C34.3017 20.5116 31.7531 20.5276 30.191 18.9655C28.6289 17.4034 28.6449 14.8548 30.2267 13.2729C31.8085 11.6911 34.3572 11.6751 35.9193 13.2372C37.4814 14.7993 37.4654 17.348 35.8835 18.9298Z"
          fill={fill ?? KEY_SOLID}
        />
      </g>
    </svg>
  );
}

/** Animated floating glyph wrapper */
function FloatingGlyph({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("absolute", className)}
      animate={{ scale: [0, 1, 1.5, 1, 0] }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * MakeItStrong — Visual ambient card for password strength feedback.
 *
 * 623×320px radial gradient card with a glass pill tag, decorative key,
 * and animated floating glyphs (Bad sparkles for "bad", green Stars for "good").
 */
function MakeItStrong({ strength = "neutral", className }: MakeItStrongProps) {
  const { isDarkMode } = useTheme();
  const surfaceBackground = isDarkMode
    ? DARK_GRADIENTS[strength]
    : LIGHT_GRADIENTS[strength];

  return (
    <div
      className={cn(
        "relative h-[320px] w-full overflow-hidden rounded-[24px]",
        className,
      )}
      style={{
        backgroundImage: surfaceBackground,
        border: isDarkMode
          ? "1px solid rgba(255,255,255,0.04)"
          : "1px solid rgba(15,23,42,0.06)",
        boxShadow: isDarkMode
          ? "none"
          : "none",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="relative h-[160px] w-[340px] max-w-full">
          {/* Glass pill tag */}
          <div
            className="absolute left-1/2 top-1/2 z-10 inline-flex h-[50px] w-max max-w-none -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-[999px] pl-[6px] pr-[20px]"
            style={{
              backgroundColor: isDarkMode
                ? "var(--color-light-glass-5)"
                : "rgba(255,255,255,0.8)",
              border: isDarkMode
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(15,23,42,0.08)",
              boxShadow: isDarkMode
                ? "none"
                : "0px 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <IconOnlyButton
              size="small"
              className="size-[42px]"
              icon={<LockPasswordIcon size={20} strokeWidth={1.8} />}
            />
            <span
              className="whitespace-nowrap font-sans font-normal text-[16px]"
              style={{
                color: isDarkMode
                  ? "var(--color-light-glass-40)"
                  : "rgba(24,24,27,0.48)",
                textShadow: isDarkMode
                  ? "0px -0.741px 1.481px rgba(0,0,0,0.5), 0px 0.741px 1.481px white"
                  : "0px 1px 1px rgba(255,255,255,0.72)",
              }}
            >
              Make it strong!
            </span>
          </div>

          {/* Decorative key */}
          <div className="absolute left-1/2 top-1/2 z-0 translate-x-[94px] translate-y-[-16px]">
            <DecorativeKey state={strength} />
          </div>

          {/* Floating animated glyphs — bad state */}
          {strength === "bad" && (
            <>
              <FloatingGlyph delay={0} className="left-1/2 top-1/2 translate-x-[102px] translate-y-[-50px]">
                <Bad enabled size={8} />
              </FloatingGlyph>
              <FloatingGlyph delay={0.8} className="left-1/2 top-1/2 translate-x-[82px] translate-y-[-24px]">
                <Bad enabled size={12} />
              </FloatingGlyph>
            </>
          )}

          {/* Floating animated glyphs — good state */}
          {strength === "good" && (
            <>
              <FloatingGlyph delay={0} className="left-1/2 top-1/2 translate-x-[102px] translate-y-[-50px]">
                <GreenStar size={8} />
              </FloatingGlyph>
              <FloatingGlyph delay={0.8} className="left-1/2 top-1/2 translate-x-[82px] translate-y-[-24px]">
                <GreenStar size={12} />
              </FloatingGlyph>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { MakeItStrong, type MakeItStrongProps, type PasswordStrengthState };
