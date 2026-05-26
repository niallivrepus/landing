import { Avatar } from "./avatar";
import {
  getOriginHexes,
  getMineralGradientCss,
  getMaterialGradientCss,
} from "../../lib/design-colors";

/* ─── Bubble Color System ─── */

export type BubbleColor =
  | "light"
  | "dark"
  | "spirit"
  | "insight"
  | "aether"
  | "fruta"
  | "flame"
  | "life"
  | "solar"
  | "kaleidyx"
  | "zharuk"
  | "drakzul"
  | "amfrill"
  | "liktir"
  | "slyvir"
  | "orro"
  | "plata"
  | "gronksh";

type BubbleColorConfig = {
  gradient: string;
  border: string;
  textColor: "white" | "black";
  replyVariant: "dark" | "light";
  backdrop?: boolean;
};

function buildOriginConfig(name: string): BubbleColorConfig {
  const hexes = getOriginHexes(name)!;
  return {
    gradient: `linear-gradient(81.3deg, ${hexes["1"]}, ${hexes["2"]})`,
    border: "var(--color-light-glass-30)",
    textColor: "white",
    replyVariant: "dark",
  };
}

function buildMaterialConfig(
  name: string,
  angle = "180deg",
): BubbleColorConfig {
  return {
    gradient: getMaterialGradientCss(name, "dark", angle)!,
    border: "var(--color-light-glass-5)",
    textColor: "white",
    replyVariant: "dark",
  };
}

export const BUBBLE_COLORS: Record<BubbleColor, BubbleColorConfig> = {
  /* Neutral */
  light: {
    gradient: "white",
    border: "var(--color-dark-glass-10)",
    textColor: "black",
    replyVariant: "light",
  },
  dark: {
    gradient: "var(--color-light-glass-5)",
    border: "var(--color-light-glass-10)",
    textColor: "white",
    replyVariant: "dark",
    backdrop: true,
  },

  /* Origins */
  spirit: buildOriginConfig("spirit"),
  insight: buildOriginConfig("insight"),
  aether: buildOriginConfig("aether"),
  fruta: buildOriginConfig("fruta"),
  flame: buildOriginConfig("flame"),
  life: buildOriginConfig("life"),
  solar: buildOriginConfig("solar"),

  /* Minerals */
  kaleidyx: {
    gradient: getMineralGradientCss("kaleidyx", "light")!,
    border: "var(--color-light-glass-30)",
    textColor: "black",
    replyVariant: "light",
  },
  zharuk: {
    gradient: getMineralGradientCss("zharuk", "dark")!,
    border: "var(--color-light-glass-30)",
    textColor: "white",
    replyVariant: "dark",
  },

  /* Materials */
  drakzul: buildMaterialConfig("drakzul"),
  amfrill: buildMaterialConfig("amfrill"),
  liktir: buildMaterialConfig("liktir"),
  slyvir: buildMaterialConfig("slyvir", "135deg"),
  orro: buildMaterialConfig("orro"),
  plata: buildMaterialConfig("plata"),
  gronksh: buildMaterialConfig("gronksh"),
};

/* ─── Reply Bubble (inner replied-to message) ─── */

export interface ReplyBubbleProps {
  name: string;
  message: string;
  avatarSrc?: string;
  avatarUserId?: string;
  variant?: "light" | "dark";
  className?: string;
}

export const ReplyBubble = ({
  name,
  message,
  avatarSrc,
  avatarUserId,
  variant = "light",
  className = "",
}: ReplyBubbleProps) => {
  const isLight = variant === "light";

  return (
    <div
      className={`relative flex gap-1 items-start overflow-hidden backdrop-blur-[25px] ${className}`}
      style={{
        background: isLight
          ? "var(--color-light-glass-10)"
          : "var(--color-dark-glass-10)",
        border: isLight
          ? "2px solid var(--color-light-glass-50)"
          : "2px solid var(--color-light-glass-20)",
        borderRadius: "8px 16px 16px 16px",
        padding: "10px 10px 8px 10px",
        boxShadow: "inset 0px 2px 4px rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Mini avatar */}
      <Avatar
        size="mini"
        src={avatarSrc}
        userId={avatarUserId}
        borderStyle="none"
        disableNavigation
        showStoryRing={false}
      />

      {/* Text column */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="font-sans font-normal truncate"
          style={{
            fontSize: "14px",
            lineHeight: "1.4",
            color: isLight ? "black" : "var(--color-light-space)",
          }}
        >
          {name}
        </span>
        <span
          className="font-sans font-medium"
          style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: isLight
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
          }}
        >
          {message}
        </span>
      </div>
    </div>
  );
};

/* ─── Message Bubble (sender's main bubble) ─── */

export interface MessageBubbleProps {
  name: string;
  message: string;
  color?: BubbleColor;
  reply?: {
    name: string;
    message: string;
    avatarSrc?: string;
    avatarUserId?: string;
  };
  className?: string;
}

export const MessageBubble = ({
  name,
  message,
  color = "light",
  reply,
  className = "",
}: MessageBubbleProps) => {
  const config = BUBBLE_COLORS[color];
  const textColor = config.textColor;

  return (
    <div
      className={`relative flex flex-col gap-1 overflow-hidden ${className}`}
      style={{
        background: config.gradient,
        border: `1px solid ${config.border}`,
        borderRadius: "24px 4px 24px 24px",
        padding: "4px 12px 8px 12px",
        maxWidth: "85%",
        ...(config.backdrop
          ? {
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              boxShadow:
                "0px 4px 12px rgba(0, 0, 0, 0.15), 0px 2px 6px rgba(0, 0, 0, 0.1)",
            }
          : {}),
      }}
    >
      {/* Name row — right-aligned */}
      <div
        className="flex items-center justify-end w-full"
        style={{ height: "24px" }}
      >
        <span
          className="font-sans font-bold truncate"
          style={{
            fontSize: "16px",
            lineHeight: "1.4",
            color: textColor,
          }}
        >
          {name}
        </span>
      </div>

      {/* Reply bubble (optional) — auto-paired variant */}
      {reply && <ReplyBubble {...reply} variant={config.replyVariant} />}

      {/* Message text */}
      <p
        className="font-sans font-normal m-0 whitespace-pre-wrap break-words"
        style={{
          fontSize: "16px",
          lineHeight: "1.56",
          color: textColor,
          textShadow:
            textColor === "black"
              ? "0px -0.5px 1px rgba(0, 0, 0, 0.5), 0px 0.5px 1px white"
              : undefined,
        }}
      >
        {message}
      </p>

      {/* Inner shadow overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          boxShadow: "inset 0px 2px 2px rgba(255, 255, 255, 0.15)",
        }}
      />
    </div>
  );
};

/* ─── Incoming Message Bubble (others' bubble) ─── */

export interface IncomingMessageBubbleProps {
  name: string;
  message: string;
  reply?: {
    name: string;
    message: string;
    avatarSrc?: string;
    avatarUserId?: string;
  };
  className?: string;
}

export const IncomingMessageBubble = ({
  name,
  message,
  reply,
  className = "",
}: IncomingMessageBubbleProps) => {
  return (
    <div
      className={`relative flex flex-col gap-2 backdrop-blur-[25px] overflow-hidden ${className}`}
      style={{
        background: "var(--color-smoke-1)",
        border: "1px solid var(--color-light-glass-5)",
        borderRadius: "4px 24px 24px 24px",
        padding: "4px 12px 8px 12px",
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Name row — left-aligned */}
      <div className="flex items-center w-full" style={{ height: "24px" }}>
        <span
          className="font-sans font-bold truncate"
          style={{
            fontSize: "16px",
            lineHeight: "1.4",
            color: "var(--color-light-space)",
            paddingLeft: "2px",
          }}
        >
          {name}
        </span>
      </div>

      {/* Reply bubble (optional) — reuse existing dark variant */}
      {reply && <ReplyBubble {...reply} variant="dark" />}

      {/* Message text */}
      <p
        className="font-sans font-normal m-0"
        style={{ fontSize: "16px", lineHeight: "1.56", color: "var(--color-light-space)" }}
      >
        {message}
      </p>

      {/* Inner shadow overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          boxShadow: "inset 0px 2px 4px rgba(255, 255, 255, 0.15)",
        }}
      />
    </div>
  );
};
