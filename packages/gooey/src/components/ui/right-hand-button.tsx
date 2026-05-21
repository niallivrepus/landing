import * as React from "react";

import { type Variants, motion } from "motion/react";

import { useTheme } from "../../hooks/use-theme";
import { useHaptics } from "../../hooks/use-haptics";
import { getSpringTransition } from "../../lib/utils/animations";
import { cn } from "../../lib/utils/cn";
import { Star } from "./star";

const rightHandButtonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.06,
    transition: { type: "spring" as const, damping: 30, stiffness: 800 },
  },
  tap: {
    scale: 0.92,
    transition: { type: "spring" as const, damping: 30, stiffness: 900 },
  },
};

export type RightHandButtonSize = "default" | "lg";

export interface RightHandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  forceState?: "hover" | "active";
  size?: RightHandButtonSize;
  active?: boolean;
  activeGradient?: string;
  notificationDot?: boolean;
  notificationCount?: number;
}

export const RIGHT_HAND_GRADIENTS = {
  hot: "linear-gradient(78deg, #FF4D00 0%, #FFB800 100%)",
  cold: "linear-gradient(78deg, #002FFF 0%, #3D7EFF 100%)",
  blurb: "linear-gradient(78deg, #7700FF 0%, #B200FF 100%)",
} as const;

const SIZE_MAP = {
  default: { width: 58, height: 40, iconSize: 18 },
  lg: { width: 83, height: 50, iconSize: 24 },
} as const;

export function RightHandButton({
  icon,
  onClick,
  className,
  children,
  disabled,
  forceState,
  size = "default",
  active = false,
  activeGradient,
  notificationDot = false,
  notificationCount,
  ...props
}: RightHandButtonProps) {
  const { isDarkMode } = useTheme();
  const haptics = useHaptics();
  const dims = SIZE_MAP[size];

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      haptics.light();
      onClick?.(e);
    },
    [onClick, haptics, disabled],
  );

  const showDot = notificationDot && !notificationCount;
  const showCounter = typeof notificationCount === "number" && notificationCount > 0;

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        "right-hand-button",
        "relative flex items-center justify-center shrink-0 cursor-pointer",
        !isDarkMode && !active && "liquid-glass",
        disabled && "cursor-not-allowed",
        className,
      )}
      style={{
        width: dims.width,
        height: dims.height,
        borderRadius: 999,
        border: active
          ? "2px solid var(--color-light-glass-30)"
          : "2px solid var(--color-light-glass-20)",
        background: active && activeGradient
          ? activeGradient
          : "var(--color-light-glass-5)",
        backdropFilter: active ? undefined : "blur(25px)",
        WebkitBackdropFilter: active ? undefined : "blur(25px)",
        boxShadow: "var(--shadow-pill-inset), var(--shadow-pill)",
        ...(disabled ? { opacity: 0.4, cursor: "default" } : {}),
        ...(forceState ? { pointerEvents: "none" as const } : {}),
      }}
      variants={rightHandButtonVariants}
      initial="initial"
      animate={forceState === "hover" ? "hover" : forceState === "active" ? "tap" : "initial"}
      whileHover={disabled || forceState ? undefined : "hover"}
      whileTap={disabled || forceState ? undefined : "tap"}
      transition={getSpringTransition("microPop")}
      disabled={disabled}
      data-slot="right-hand-button"
      data-force-state={forceState || undefined}
      {...(props as any)}
    >
      <span
        className="flex items-center justify-center shrink-0"
        style={{ width: dims.iconSize, height: dims.iconSize }}
      >
        {icon || children}
      </span>
      {showDot && (
        <span
          className="absolute"
          style={{
            width: 11,
            height: 11,
            borderRadius: 999,
            background: "var(--color-red-4)",
            boxShadow: "inset 0px 1px 1px var(--color-light-glass-20)",
            top: -2,
            right: -2,
          }}
        />
      )}
      {showCounter && (
        <span
          className="absolute flex items-center justify-center"
          style={{
            width: 24,
            height: 24,
            borderRadius: 999,
            background: "var(--color-red-4)",
            border: "2px solid var(--color-light-glass-30)",
            backdropFilter: "blur(25px)",
            boxShadow: "var(--shadow-pill-inset), var(--shadow-pill)",
            top: -6,
            right: -6,
            fontSize: 14,
            fontFamily: "Satoshi, sans-serif",
            lineHeight: 0.9,
            color: "var(--color-dark-space)",
          }}
        >
          {notificationCount}
        </span>
      )}
    </motion.button>
  );
}

/* ─── FavoriteButton ──────────────────────────────────────────────── */

export interface FavoriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  forceState?: "hover" | "active";
  active?: boolean;
}

const favoriteVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.06, transition: { type: "spring" as const, damping: 30, stiffness: 800 } },
  tap: { scale: 0.92, transition: { type: "spring" as const, damping: 30, stiffness: 900 } },
};

export function FavoriteButton({
  onClick, className, disabled, forceState, active: defaultActive = false, ...props
}: FavoriteButtonProps) {
  const { isDarkMode } = useTheme();
  const haptics = useHaptics();
  const [isActive, setIsActive] = React.useState(defaultActive);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      haptics.light();
      setIsActive((v) => !v);
      onClick?.(e);
    },
    [onClick, haptics, disabled],
  );

  const isHover = forceState === "hover";

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn("favorite-button", "relative flex items-center justify-center shrink-0 cursor-pointer", disabled && "cursor-not-allowed", className)}
      style={{ width: 50, height: 50, ...(disabled ? { opacity: 0.4, cursor: "default" } : {}), ...(forceState ? { pointerEvents: "none" as const } : {}) }}
      variants={favoriteVariants}
      initial="initial"
      animate={forceState === "hover" ? "hover" : forceState === "active" ? "tap" : "initial"}
      whileHover={disabled || forceState ? undefined : "hover"}
      whileTap={disabled || forceState ? undefined : "tap"}
      transition={getSpringTransition("microPop")}
      disabled={disabled}
      data-slot="favorite-button"
      data-force-state={forceState || undefined}
      {...(props as any)}
    >
      <div
        className={cn(!isDarkMode && !isActive && "liquid-glass")}
        style={{
          width: 40, height: 54, borderRadius: 999,
          border: "2px solid rgba(255, 255, 255, 0.2)",
          background: isHover ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(25px)", WebkitBackdropFilter: "blur(25px)",
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1), inset 0px 2px 4px rgba(255, 255, 255, 0.15)",
          transform: "rotate(-45deg)", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <span className="flex items-center justify-center" style={{ transform: "rotate(45deg)" }}>
          <Star enabled={isActive} size={14} />
        </span>
      </div>
    </motion.button>
  );
}

function FavoriteStarFilledIcon() {
  const uniqueId = React.useId();
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`fav-glow-filled-${uniqueId}`} x="-4" y="-4" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.87 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="glow" />
          <feBlend mode="normal" in="SourceGraphic" in2="glow" result="shape" />
        </filter>
        <linearGradient id={`fav-grad-filled-${uniqueId}`} x1="6" y1="18" x2="20" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9D00" />
          <stop offset="1" stopColor="#F2FF3D" />
        </linearGradient>
      </defs>
      <g filter={`url(#fav-glow-filled-${uniqueId})`}>
        <path d="M11.2443 4.174C11.5409 3.37513 11.6893 2.97569 11.9275 2.86766C12.0285 2.82171 12.1395 2.80078 12.2505 2.80664C12.5067 2.82038 12.7232 3.16935 13.1563 3.86729L13.7082 4.75668C14.0318 5.27824 14.1936 5.53902 14.4306 5.71384C14.6677 5.88865 14.9579 5.96101 15.5383 6.10573L16.0651 6.23724C16.9309 6.45326 17.3638 6.56127 17.5372 6.8313C17.7105 7.10132 17.5819 7.43781 17.3248 8.11078L17.0818 8.74746C16.8802 9.27526 16.7793 9.53916 16.7833 9.81181C16.7873 10.0845 16.8957 10.346 17.1124 10.869L17.3119 11.3477C17.6327 12.1189 17.7932 12.5046 17.6469 12.7921C17.5007 13.0797 17.0994 13.1444 16.2969 13.2737L15.3605 13.4246C14.7865 13.517 14.4994 13.5631 14.2571 13.7138C14.0149 13.8645 13.8434 14.1051 13.5005 14.5863L13.1861 15.0276C12.674 15.7464 12.4179 16.1058 12.0844 16.1267C11.7508 16.1476 11.4413 15.8229 10.8223 15.1736L10.1497 14.4675C9.72478 14.0215 9.51232 13.7985 9.24099 13.6789C8.96966 13.5593 8.66466 13.555 8.05466 13.5463L7.49414 13.5384C6.58894 13.5256 6.13634 13.5192 5.92428 13.2619C5.71221 13.0046 5.83893 12.5951 6.09238 11.7762L6.3376 10.9844C6.51889 10.3988 6.60954 10.106 6.58416 9.81556C6.55879 9.52509 6.41938 9.25652 6.14057 8.71938L5.88645 8.23C5.47185 7.43135 5.26455 7.03203 5.39757 6.72649C5.5306 6.42096 5.94216 6.33 6.76529 6.14808L7.66625 5.94916C8.24094 5.82222 8.52829 5.75875 8.76037 5.59788C8.99245 5.43702 9.1484 5.19302 9.46029 4.70503L9.74613 4.25785C10.1003 3.70316 10.2773 3.42581 10.5286 3.35188C10.7798 3.27795 11.0339 3.42447 11.5421 3.71751L11.2443 4.174Z" fill={`url(#fav-grad-filled-${uniqueId})`} stroke="#673F00" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function FavoriteStarIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.6">
        <path d="M11.2443 4.174C11.5409 3.37513 11.6893 2.97569 11.9275 2.86766C12.0285 2.82171 12.1395 2.80078 12.2505 2.80664C12.5067 2.82038 12.7232 3.16935 13.1563 3.86729L13.7082 4.75668C14.0318 5.27824 14.1936 5.53902 14.4306 5.71384C14.6677 5.88865 14.9579 5.96101 15.5383 6.10573L16.0651 6.23724C16.9309 6.45326 17.3638 6.56127 17.5372 6.8313C17.7105 7.10132 17.5819 7.43781 17.3248 8.11078L17.0818 8.74746C16.8802 9.27526 16.7793 9.53916 16.7833 9.81181C16.7873 10.0845 16.8957 10.346 17.1124 10.869L17.3119 11.3477C17.6327 12.1189 17.7932 12.5046 17.6469 12.7921C17.5007 13.0797 17.0994 13.1444 16.2969 13.2737L15.3605 13.4246C14.7865 13.517 14.4994 13.5631 14.2571 13.7138C14.0149 13.8645 13.8434 14.1051 13.5005 14.5863L13.1861 15.0276C12.674 15.7464 12.4179 16.1058 12.0844 16.1267C11.7508 16.1476 11.4413 15.8229 10.8223 15.1736L10.1497 14.4675C9.72478 14.0215 9.51232 13.7985 9.24099 13.6789C8.96966 13.5593 8.66466 13.555 8.05466 13.5463L7.49414 13.5384C6.58894 13.5256 6.13634 13.5192 5.92428 13.2619C5.71221 13.0046 5.83893 12.5951 6.09238 11.7762L6.3376 10.9844C6.51889 10.3988 6.60954 10.106 6.58416 9.81556C6.55879 9.52509 6.41938 9.25652 6.14057 8.71938L5.88645 8.23C5.47185 7.43135 5.26455 7.03203 5.39757 6.72649C5.5306 6.42096 5.94216 6.33 6.76529 6.14808L7.66625 5.94916C8.24094 5.82222 8.52829 5.75875 8.76037 5.59788C8.99245 5.43702 9.1484 5.19302 9.46029 4.70503L9.74613 4.25785C10.1003 3.70316 10.2773 3.42581 10.5286 3.35188C10.7798 3.27795 11.0339 3.42447 11.5421 3.71751L11.2443 4.174Z" stroke="white" strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/* ─── Action Button Icons (outline + filled) ─────────────────────── */

export function FlameIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9 15.7501C12.1066 15.7501 14.625 13.1251 14.625 9.75008C14.625 5.99807 11.3095 3.33314 9.94803 2.39703C9.62862 2.1774 9.20489 2.27174 8.98259 2.5893L7.24613 5.06996C6.98731 5.4397 6.45739 5.4861 6.13825 5.16697C5.85479 4.88351 5.39224 4.88175 5.13797 5.19166C3.96266 6.62419 3.375 8.4089 3.375 9.75008C3.375 13.1251 5.8934 15.7501 9 15.7501ZM9 15.7501C10.2426 15.7501 11.25 14.6002 11.25 13.1818C11.25 11.6194 10.0027 10.4812 9.36543 10.0016C9.14646 9.83681 8.85354 9.83681 8.63457 10.0016C7.99734 10.4812 6.75 11.6194 6.75 13.1818C6.75 14.6002 7.75736 15.7501 9 15.7501Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

export function FlameFilledIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.36817 2.15904C8.80648 1.53288 9.68606 1.30654 10.373 1.77886C11.0867 2.26962 12.321 3.21814 13.3833 4.54968C14.4451 5.88057 15.375 7.64559 15.375 9.74991C15.375 13.4979 12.5608 16.4999 9 16.4999C5.43917 16.4999 2.625 13.4979 2.625 9.74991C2.625 8.22339 3.28056 6.27296 4.55815 4.71578C4.90567 4.2922 5.40972 4.14729 5.87703 4.22803C6.33057 4.30639 6.88644 4.2758 7.15038 3.89873L8.36817 2.15904ZM9 14.9999C10.0873 14.9999 10.9688 13.9938 10.9688 12.7527C10.9688 11.4208 9.93286 10.4412 9.3639 10.0036C9.14667 9.8365 8.85333 9.8365 8.6361 10.0036C8.06714 10.4412 7.03125 11.4208 7.03125 12.7527C7.03125 13.9938 7.91269 14.9999 9 14.9999Z" fill="currentColor"/>
    </svg>
  );
}

export function BlurbIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9.5625 5.8125C9.5625 7.88357 7.88357 9.5625 5.8125 9.5625C3.74143 9.5625 2.0625 7.88357 2.0625 5.8125C2.0625 3.74143 3.74143 2.0625 5.8125 2.0625C7.88357 2.0625 9.5625 3.74143 9.5625 5.8125Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M13.125 13.3125C13.125 14.7622 11.9497 15.9375 10.5 15.9375C9.05025 15.9375 7.875 14.7622 7.875 13.3125C7.875 11.8628 9.05025 10.6875 10.5 10.6875C11.9497 10.6875 13.125 11.8628 13.125 13.3125Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M15.9375 6.9375C15.9375 8.07659 15.0141 9 13.875 9C12.7359 9 11.8125 8.07659 11.8125 6.9375C11.8125 5.79841 12.7359 4.875 13.875 4.875C15.0141 4.875 15.9375 5.79841 15.9375 6.9375Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

export function BlurbFilledIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9.5625 5.8125C9.5625 7.88357 7.88357 9.5625 5.8125 9.5625C3.74143 9.5625 2.0625 7.88357 2.0625 5.8125C2.0625 3.74143 3.74143 2.0625 5.8125 2.0625C7.88357 2.0625 9.5625 3.74143 9.5625 5.8125Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M13.125 13.3125C13.125 14.7622 11.9497 15.9375 10.5 15.9375C9.05025 15.9375 7.875 14.7622 7.875 13.3125C7.875 11.8628 9.05025 10.6875 10.5 10.6875C11.9497 10.6875 13.125 11.8628 13.125 13.3125Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M15.9375 6.9375C15.9375 8.07659 15.0141 9 13.875 9C12.7359 9 11.8125 8.07659 11.8125 6.9375C11.8125 5.79841 12.7359 4.875 13.875 4.875C15.0141 4.875 15.9375 5.79841 15.9375 6.9375Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

export function ColdIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8.99707 4.125V13.875M8.99707 4.125L7.12207 2.25M8.99707 4.125L10.8721 2.25M8.99707 13.875L7.12207 15.75M8.99707 13.875L10.8721 15.75M4.77614 6.56248L13.2199 11.4375M4.77614 6.56248L2.21484 7.24878M4.77614 6.56248L4.08984 4.00118M13.2199 11.4375L13.9062 13.9988M13.2199 11.4375L15.7812 10.7512M4.77614 11.4375L13.2199 6.56248M4.77614 11.4375L4.08984 13.9988M4.77614 11.4375L2.21484 10.7512M13.2199 6.56248L15.7812 7.24878M13.2199 6.56248L13.9062 4.00118" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ColdFilledIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8.99707 4.125V13.875M8.99707 4.125L7.12207 2.25M8.99707 4.125L10.8721 2.25M8.99707 13.875L7.12207 15.75M8.99707 13.875L10.8721 15.75M4.77614 6.56248L13.2199 11.4375M4.77614 6.56248L2.21484 7.24878M4.77614 6.56248L4.08984 4.00118M13.2199 11.4375L13.9062 13.9988M13.2199 11.4375L15.7812 10.7512M4.77614 11.4375L13.2199 6.56248M4.77614 11.4375L4.08984 13.9988M4.77614 11.4375L2.21484 10.7512M13.2199 6.56248L15.7812 7.24878M13.2199 6.56248L13.9062 4.00118" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ShareRightIcon({ className }: { className?: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M10.5 4.5L14.25 8.25L10.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.25 8.25H7.5C5.84315 8.25 4.5 9.59315 4.5 11.25V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
