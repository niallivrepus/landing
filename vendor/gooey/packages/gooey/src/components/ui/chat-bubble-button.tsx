import { useState } from "react";
import { cn } from "../../lib/utils";
import { IconOnlyButton } from "./icon-only-button";
import { ServerAvatar, type ServerAvatarProps } from "./server-avatar";
import { ColorSwatch, type SwatchColor } from "./color-swatch";

/**
 * ChatBubbleButton — A family of 9 pill-shaped button variants (40px tall)
 * used across chat surfaces: channel lists, server pickers, premium upsell, etc.
 */

type ChatBubbleVariant =
  | "plus"
  | "library"
  | "portal"
  | "premium"
  | "text"
  | "server"
  | "channel"
  | "colorpicker"
  | "empty";

interface ChatBubbleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChatBubbleVariant;
  label?: string;
  serverSrc?: string;
  serverAvatar?: ServerAvatarProps;
  channelColor?: SwatchColor;
  swatchValue?: SwatchColor;
  onSwatchChange?: (c: SwatchColor) => void;
  icon?: React.ReactNode;
  /** When true, applies the animated spectral border (flowing rainbow) */
  spectralAnimated?: boolean;
}

/** Shared shadow for all chat bubble variants */
export const BUBBLE_SHADOW = "0px 1px 4px rgba(0, 0, 0, 0.1)";

/** SwatchColor → CSS variable mapping for channel dots */
const SWATCH_CSS: Record<SwatchColor, string> = {
  purple: "var(--color-purple-4)",
  blue: "var(--color-blue-4)",
  green: "var(--color-green-4)",
  yellow: "var(--color-yellow-4)",
  orange: "var(--color-orange-4)",
  red: "var(--color-red-4)",
};

/** 16×16 plus icon */
function PlusIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2v12M2 8h12"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 16×16 library icon (grid of squares) */
function LibraryIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth={1} />
      <rect x="9.5" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth={1} />
      <rect x="1" y="9.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth={1} />
      <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}

/** Shared text style class for labels */
const LABEL_CLASS = "font-sans font-bold text-[14px] leading-[0.9] text-light-space";

function ChatBubbleButton({
  variant = "text",
  label,
  serverSrc,
  serverAvatar,
  channelColor = "blue",
  swatchValue,
  onSwatchChange,
  icon,
  spectralAnimated,
  className,
  ...props
}: ChatBubbleButtonProps) {
  const [swatchOpen, setSwatchOpen] = useState(false);

  // ── plus / library: delegate to IconOnlyButton ──
  if (variant === "plus" || variant === "library") {
    const iconNode =
      icon ?? (variant === "plus" ? <PlusIcon /> : <LibraryIcon />);
    return (
      <IconOnlyButton
        size="small"
        icon={iconNode}
        className={className}
        onClick={props.onClick}
        {...props}
      />
    );
  }

  // ── portal: 12px wide, spectral gradient border ──
  if (variant === "portal") {
    return (
      <button
        className={cn(
          spectralAnimated ? "spectral-border-animated active" : "spectral-border",
          "rounded-full",
          className,
        )}
        style={{
          width: 12,
          height: 40,
          overflow: "visible",
          backgroundColor: "var(--color-light-glass-5)",
          boxShadow: BUBBLE_SHADOW,
        }}
        {...props}
      />
    );
  }

  // ── empty: 12px wide, neutral glass ──
  if (variant === "empty") {
    return (
      <button
        className={cn(
          "rounded-full",
          spectralAnimated && "spectral-border-animated active",
          className,
        )}
        style={{
          width: 12,
          height: 40,
          overflow: "visible",
          backgroundColor: "var(--color-light-glass-5)",
          border: spectralAnimated ? "none" : "1px solid var(--color-light-glass-20)",
          boxShadow: BUBBLE_SHADOW,
        }}
        {...props}
      />
    );
  }

  // ── premium: purple pill with gradient text ──
  if (variant === "premium") {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full px-4",
          className,
        )}
        style={{
          height: 40,
          backgroundColor: "var(--color-purple-1)",
          border: "1px solid #7700FF",
          boxShadow: BUBBLE_SHADOW,
        }}
        {...props}
      >
        <span
          className="font-sans font-bold text-[14px] leading-[0.9]"
          style={{
            background: "linear-gradient(40.7deg, #B200FF 0%, #7700FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {label ?? "Premium"}
        </span>
      </button>
    );
  }

  // ── text: glass pill with white text ──
  if (variant === "text") {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full px-5",
          className,
        )}
        style={{
          height: 40,
          backgroundColor: "transparent",
          border: "1px solid var(--color-light-glass-10)",
          boxShadow: BUBBLE_SHADOW,
        }}
        {...props}
      >
        <span className={LABEL_CLASS}>{label ?? "Text"}</span>
      </button>
    );
  }

  // ── server: avatar + text pill ──
  if (variant === "server") {
    return (
      <button
        className={cn(
          "inline-flex items-center rounded-full pl-[4px] pr-[16px] py-[2px] gap-[4px]",
          className,
        )}
        style={{
          height: 40,
          border: "1px solid var(--color-light-glass-10)",
          boxShadow: BUBBLE_SHADOW,
        }}
        {...props}
      >
        <ServerAvatar size={32} src={serverSrc} {...serverAvatar} />
        <span className={LABEL_CLASS}>{label ?? "Server"}</span>
      </button>
    );
  }

  // ── channel: energy dot + text pill ──
  if (variant === "channel") {
    return (
      <button
        className={cn(
          "inline-flex items-center rounded-full pl-[12px] pr-[16px] gap-[12px]",
          className,
        )}
        style={{
          height: 40,
          border: "1px solid var(--color-light-glass-10)",
          boxShadow: BUBBLE_SHADOW,
        }}
        {...props}
      >
        <span
          className="shrink-0 rounded-full"
          style={{
            width: 8,
            height: 8,
            backgroundColor: SWATCH_CSS[channelColor],
          }}
        />
        <span className={LABEL_CLASS}>{label ?? "Channel"}</span>
      </button>
    );
  }

  // ── colorpicker: channel-style pill + ColorSwatch overlay ──
  if (variant === "colorpicker") {
    return (
      <div className="relative inline-flex">
        <button
          className={cn(
            "inline-flex items-center rounded-full pl-[12px] pr-[16px] gap-[12px]",
            className,
          )}
          style={{
            width: 154,
            height: 40,
            border: "1px solid var(--color-light-glass-10)",
            boxShadow: BUBBLE_SHADOW,
          }}
          onClick={(e) => {
            setSwatchOpen((v) => !v);
            props.onClick?.(e);
          }}
          {...props}
        >
          <span
            className="shrink-0 rounded-full cursor-pointer"
            style={{
              width: 8,
              height: 8,
              backgroundColor: SWATCH_CSS[swatchValue ?? channelColor],
            }}
          />
          <span className={LABEL_CLASS}>{label ?? "Channel"}</span>
        </button>

        {swatchOpen && (
          <div className="absolute top-[4px] left-[26px] z-10">
            <ColorSwatch
              value={swatchValue}
              onChange={(c) => {
                onSwatchChange?.(c);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return null;
}

export { ChatBubbleButton, type ChatBubbleButtonProps, type ChatBubbleVariant };
