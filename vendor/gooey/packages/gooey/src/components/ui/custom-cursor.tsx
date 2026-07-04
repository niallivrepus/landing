"use client";

import { useEffect, useId, useState } from "react";

import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { createPortal } from "react-dom";

import { useTheme } from "../../hooks/use-theme";
import { Avatar } from "./avatar";

// ---------------------------------------------------------------------------
// Energy color type & hex map (authoritative values from design-tokens.css)
// ---------------------------------------------------------------------------

export type EnergyColor =
  | "pink"
  | "purple"
  | "blue"
  | "cyan"
  | "green"
  | "yellow"
  | "orange"
  | "red";

export const ENERGY_HEX: Record<EnergyColor, string> = {
  pink: "#FF00EE",
  purple: "#9327FF",
  blue: "#0066FF",
  cyan: "#43FDFF",
  green: "#21DC11",
  yellow: "#FFB800",
  orange: "#FF4D00",
  red: "#FF0700",
};

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

interface CursorProps {
  isVisible?: boolean;
}

type CursorState = "default" | "hover" | "click" | "text" | "disabled";

interface OtherCursorProps {
  x: number;
  y: number;
  color: EnergyColor;
  username: string;
  avatarSrc?: string;
  userId?: string;
}

// ---------------------------------------------------------------------------
// Cursor container (portal target)
// ---------------------------------------------------------------------------

const CURSOR_CONTAINER_ID = "custom-cursor-root";

const getCursorContainer = (): HTMLElement => {
  let container = document.getElementById(CURSOR_CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = CURSOR_CONTAINER_ID;
    container.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:2147483647;";
    document.body.appendChild(container);
  }
  return container;
};

// ---------------------------------------------------------------------------
// CustomCursor — self variant (existing, updated)
// ---------------------------------------------------------------------------

export const CustomCursor = ({ isVisible = true }: CursorProps) => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [mounted, setMounted] = useState(false);
  const { isDarkMode } = useTheme();
  const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const customCursorEnabled = true;

  useEffect(() => {
    getCursorContainer();
    setMounted(true);
    return () => {
      const container = document.getElementById(CURSOR_CONTAINER_ID);
      if (container && container.childNodes.length === 0) {
        container.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || isTouchDevice || !customCursorEnabled) return;

    document.body.classList.add("custom-cursor-active");

    const updateCursorPosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = (e: Event) => {
      const element = e.target as HTMLElement;
      if (!element?.matches) return;

      if (element.matches('button, a, [role="button"], .clickable')) {
        setCursorState("hover");
      } else if (element.matches("input, textarea, [contenteditable]")) {
        setCursorState("text");
      } else if (element.matches("[disabled], .disabled")) {
        setCursorState("disabled");
      }
    };

    const handleMouseLeave = () => {
      setCursorState("default");
    };

    const handleMouseDown = () => {
      setCursorState("click");
    };

    const handleMouseUp = () => {
      setCursorState("hover");
    };

    document.addEventListener("mousemove", updateCursorPosition);
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      document.removeEventListener("mousemove", updateCursorPosition);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVisible, isTouchDevice, customCursorEnabled, cursorX, cursorY]);

  if (!isVisible || isTouchDevice || !customCursorEnabled || !mounted)
    return null;

  const getScale = () => {
    if (cursorState === "hover") return 1.6;
    if (cursorState === "click") return 1.1;
    if (cursorState === "text") return 1.4;
    if (cursorState === "disabled") return 1.0;
    return 1.3;
  };

  const getRotation = () => {
    if (cursorState === "hover") return 15;
    if (cursorState === "click") return -15;
    return 0;
  };

  const getOpacity = () => {
    if (cursorState === "disabled") return 0.5;
    return 1;
  };

  const getFillColor = () => {
    if (cursorState === "click") return "#ff0000";
    if (cursorState === "text") return isDarkMode ? "#00ff00" : "#0066cc";
    if (cursorState === "disabled") return "#666666";
    return "#141414";
  };

  const cursorElement = (
    <motion.div
      className="custom-cursor"
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        x: -2.5,
        y: -2.5,
        pointerEvents: "none",
        zIndex: 2147483647,
      }}
      animate={{
        scale: getScale(),
        rotate: getRotation(),
        opacity: getOpacity(),
      }}
    >
      <CursorCrossSvg fill={getFillColor()} />
    </motion.div>
  );

  return createPortal(cursorElement, getCursorContainer());
};

// ---------------------------------------------------------------------------
// OtherCursor — remote user variant (new)
// ---------------------------------------------------------------------------

export const OtherCursor = ({ x, y, color, username, avatarSrc, userId }: OtherCursorProps) => {
  const [mounted, setMounted] = useState(false);
  const [showTag, setShowTag] = useState(false);

  useEffect(() => {
    getCursorContainer();
    setMounted(true);
    return () => {
      const container = document.getElementById(CURSOR_CONTAINER_ID);
      if (container && container.childNodes.length === 0) {
        container.remove();
      }
    };
  }, []);

  if (!mounted) return null;

  const hex = ENERGY_HEX[color];

  const cursorElement = (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 2147483647,
      }}
      animate={{ x: x - 2.5, y: y - 2.5 }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    >
      <CursorCrossSvg fill="#000000" stroke={hex} />
      <div
        style={{ position: "absolute", left: 3.5, top: 3, pointerEvents: "auto" }}
        onMouseEnter={() => setShowTag(true)}
        onMouseLeave={() => setShowTag(false)}
      >
        <CursorAvatar
          color={hex}
          username={username}
          avatarSrc={avatarSrc}
          userId={userId}
        />
        <AnimatePresence>
          {showTag && (
            <motion.div
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.15 }}
              style={{ position: "absolute", left: 0, top: "100%", marginTop: 2 }}
            >
              <CursorNameTag color={hex} username={username} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return createPortal(cursorElement, getCursorContainer());
};

// ---------------------------------------------------------------------------
// CursorCrossSvg — private helper
// ---------------------------------------------------------------------------

export function CursorCrossSvg({ fill, stroke = "white" }: { fill: string; stroke?: string }) {
  const uid = useId();
  const maskId = `cursor-mask-${uid}`;
  const filterId = `cursor-filter-${uid}`;

  // Rounded-arm cross from Figma (5×6) with 0.15px white outside stroke + inner shadow
  const crossPath =
    "M2.64999 0.400024C2.64999 0.261953 2.53807 0.150024 2.39999 0.150024C2.26192 0.150024 2.14999 0.261953 2.14999 0.400024V1.40002C2.14999 1.5381 2.26192 1.65002 2.39999 1.65002C2.53807 1.65002 2.64999 1.5381 2.64999 1.40002V0.400024ZM2.64999 3.40002C2.64999 3.26195 2.53807 3.15002 2.39999 3.15002C2.26192 3.15002 2.14999 3.26195 2.14999 3.40002V4.90002C2.14999 5.0381 2.26192 5.15002 2.39999 5.15002C2.53807 5.15002 2.64999 5.0381 2.64999 4.90002V3.40002ZM3.39999 2.65002C3.26192 2.65002 3.14999 2.5381 3.14999 2.40002C3.14999 2.26195 3.26192 2.15002 3.39999 2.15002H4.39999C4.53807 2.15002 4.64999 2.26195 4.64999 2.40002C4.64999 2.5381 4.53807 2.65002 4.39999 2.65002H3.39999ZM0.399994 2.15002C0.261923 2.15002 0.149994 2.26195 0.149994 2.40002C0.149994 2.5381 0.261923 2.65002 0.399994 2.65002H1.39999C1.53807 2.65002 1.64999 2.5381 1.64999 2.40002C1.64999 2.26195 1.53807 2.15002 1.39999 2.15002H0.399994Z";

  const strokePath =
    "M2.14999 1.40002H2.29999V0.400024H2.14999H1.99999V1.40002H2.14999ZM2.64999 0.400024H2.49999V1.40002H2.64999H2.79999V0.400024H2.64999ZM2.14999 4.90002H2.29999V3.40002H2.14999H1.99999V4.90002H2.14999ZM2.64999 3.40002H2.49999V4.90002H2.64999H2.79999V3.40002H2.64999ZM4.39999 2.15002V2.00002H3.39999V2.15002V2.30002H4.39999V2.15002ZM3.39999 2.65002V2.80002H4.39999V2.65002V2.50002H3.39999V2.65002ZM1.39999 2.65002V2.50002H0.399994V2.65002V2.80002H1.39999V2.65002ZM0.399994 2.15002V2.30002H1.39999V2.15002V2.00002H0.399994V2.15002ZM1.64999 2.40002H1.79999C1.79999 2.17911 1.62091 2.00002 1.39999 2.00002V2.15002V2.30002C1.45522 2.30002 1.49999 2.3448 1.49999 2.40002H1.64999ZM1.39999 2.65002V2.80002C1.62091 2.80002 1.79999 2.62094 1.79999 2.40002H1.64999H1.49999C1.49999 2.45525 1.45522 2.50002 1.39999 2.50002V2.65002ZM0.149994 2.40002H0.299994C0.299994 2.3448 0.344765 2.30002 0.399994 2.30002V2.15002V2.00002C0.17908 2.00002 -6.10948e-06 2.17911 -6.10948e-06 2.40002H0.149994ZM0.149994 2.40002H-6.10948e-06C-6.10948e-06 2.62094 0.17908 2.80002 0.399994 2.80002V2.65002V2.50002C0.344765 2.50002 0.299994 2.45525 0.299994 2.40002H0.149994ZM4.64999 2.40002H4.49999C4.49999 2.45525 4.45522 2.50002 4.39999 2.50002V2.65002V2.80002C4.62091 2.80002 4.79999 2.62094 4.79999 2.40002H4.64999ZM4.39999 2.15002V2.30002C4.45522 2.30002 4.49999 2.3448 4.49999 2.40002H4.64999H4.79999C4.79999 2.17911 4.62091 2.00002 4.39999 2.00002V2.15002ZM3.14999 2.40002H2.99999C2.99999 2.62094 3.17908 2.80002 3.39999 2.80002V2.65002V2.50002C3.34477 2.50002 3.29999 2.45525 3.29999 2.40002H3.14999ZM3.14999 2.40002H3.29999C3.29999 2.3448 3.34477 2.30002 3.39999 2.30002V2.15002V2.00002C3.17908 2.00002 2.99999 2.17911 2.99999 2.40002H3.14999ZM2.39999 5.15002V5.30002C2.62091 5.30002 2.79999 5.12094 2.79999 4.90002H2.64999H2.49999C2.49999 4.95525 2.45522 5.00002 2.39999 5.00002V5.15002ZM2.14999 4.90002H1.99999C1.99999 5.12094 2.17908 5.30002 2.39999 5.30002V5.15002V5.00002C2.34477 5.00002 2.29999 4.95525 2.29999 4.90002H2.14999ZM2.39999 3.15002V3.30002C2.45522 3.30002 2.49999 3.3448 2.49999 3.40002H2.64999H2.79999C2.79999 3.17911 2.62091 3.00002 2.39999 3.00002V3.15002ZM2.39999 3.15002V3.00002C2.17908 3.00002 1.99999 3.17911 1.99999 3.40002H2.14999H2.29999C2.29999 3.3448 2.34477 3.30002 2.39999 3.30002V3.15002ZM2.39999 1.65002V1.80002C2.62091 1.80002 2.79999 1.62094 2.79999 1.40002H2.64999H2.49999C2.49999 1.45525 2.45522 1.50002 2.39999 1.50002V1.65002ZM2.14999 1.40002H1.99999C1.99999 1.62094 2.17908 1.80002 2.39999 1.80002V1.65002V1.50002C2.34477 1.50002 2.29999 1.45525 2.29999 1.40002H2.14999ZM2.39999 0.150024V0.300024C2.45522 0.300024 2.49999 0.344796 2.49999 0.400024H2.64999H2.79999C2.79999 0.179111 2.62091 2.44081e-05 2.39999 2.44081e-05V0.150024ZM2.39999 0.150024V2.44081e-05C2.17908 2.44081e-05 1.99999 0.179111 1.99999 0.400024H2.14999H2.29999C2.29999 0.344796 2.34477 0.300024 2.39999 0.300024V0.150024Z";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="6"
      viewBox="0 0 5 6"
      fill="none"
      style={{ width: 5, height: 6, display: "block" }}
    >
      <defs>
        {/* Mask for white outside stroke */}
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="-0.850006"
          y="-0.849976"
          width="6"
          height="7"
          fill="black"
        >
          <rect fill="white" x="-0.850006" y="-0.849976" width="6" height="7" />
          <path fillRule="evenodd" clipRule="evenodd" d={crossPath} />
        </mask>

        {/* Inner shadow: 0.5px offset, white 15% rimlight */}
        <filter
          id={filterId}
          x="0"
          y="0"
          width="4.79999"
          height="5.80005"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.5" />
          <feGaussianBlur stdDeviation="0.25" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
      </defs>

      {/* Cross fill with inner shadow */}
      <g>
        <path fillRule="evenodd" clipRule="evenodd" d={crossPath} fill={fill} />
      </g>

      {/* 0.15px outside stroke */}
      <path d={strokePath} fill={stroke} mask={`url(#${maskId})`} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// CursorAvatar — tiny avatar with energy-colored border
// ---------------------------------------------------------------------------

export function CursorAvatar({
  color,
  username,
  avatarSrc,
  userId,
}: {
  color: string;
  username: string;
  avatarSrc?: string;
  userId?: string;
}) {
  const scale = 0.15;
  const borderPx = 0.5 / scale; // ~3.33px before scaling → 0.5px after
  const innerW = 20;
  const innerH = 26;
  const outerW = innerW + borderPx * 2;
  const outerH = innerH + borderPx * 2;

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: outerW,
        height: outerH,
        marginRight: -(outerW * (1 - scale)),
        marginBottom: -(outerH * (1 - scale)),
      }}
    >
      <div
        style={{
          borderRadius: 999,
          border: `${borderPx}px solid ${color}`,
          boxShadow: "none",
          lineHeight: 0,
          overflow: "hidden",
        }}
      >
        <Avatar
          size="tiny"
          src={avatarSrc}
          username={username}
          userId={userId}
          borderStyle="none"
          disableNavigation
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CursorNameTag — private helper
// ---------------------------------------------------------------------------

const LIGHT_BG_COLORS = new Set([ENERGY_HEX.yellow, ENERGY_HEX.green, ENERGY_HEX.cyan]);

export function CursorNameTag({ color, username }: { color: string; username: string }) {
  const useDarkText = LIGHT_BG_COLORS.has(color);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color,
        borderRadius: 666,
        border: "0.6px solid rgba(255,255,255,0.1)",
        boxShadow: "none",
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 1,
        paddingBottom: 1,
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          color: useDarkText ? "#000000" : "#fff",
          fontSize: 6,
          fontFamily: "'Geist Mono', monospace",
          fontWeight: 400,
          lineHeight: 1,
          textShadow: useDarkText
            ? "0px 0.5px 1px rgba(255,255,255,0.3)"
            : "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px white",
          userSelect: "none",
        }}
      >
        {username}
      </span>
    </div>
  );
}
