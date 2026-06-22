import { Maximize2, Pause, Play } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

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
    replyVariant: "light",
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
      className={`relative flex gap-2 items-start overflow-hidden backdrop-blur-[25px] ${className}`}
      style={{
        background: isLight
          ? "var(--color-light-glass-20)"
          : "var(--color-dark-glass-10)",
        border: isLight
          ? "1px solid var(--color-light-glass-20)"
          : "1px solid var(--color-light-glass-20)",
        borderRadius: "16px 8px 16px 16px",
        padding: "8px",
        boxShadow: "none",
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
            color: "var(--color-light-space)",
          }}
        >
          {name}
        </span>
        <span
          className="font-sans font-medium"
          style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "var(--color-light-glass-80)",
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
  /** Sender label, shown bold top-right. Omit for 1:1 outgoing bubbles. */
  name?: string;
  message: string;
  color?: BubbleColor;
  /** Optional timestamp shown bottom-right, e.g. "20:00". */
  time?: string;
  /** Allows identity settings to hide message timestamps later. */
  showTime?: boolean;
  /** Marks messages that were changed after first send. */
  edited?: boolean;
  reply?: {
    name: string;
    message: string;
    avatarSrc?: string;
    avatarUserId?: string;
  };
  media?: MessageBubbleMedia[];
  fullWidth?: boolean;
  className?: string;
}

export interface MessageBubbleMedia {
  type?: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
  aspectRatio?: string;
}

/** payload handed to the global media viewer when a tile is opened. */
export interface MessageMediaOpenPayload {
  items: MessageBubbleMedia[];
  index: number;
}

const MessageMediaOpenContext = createContext<((payload: MessageMediaOpenPayload) => void) | null>(null);

/**
 * Provide a handler that opens the global media sandbox. When present, message
 * media tiles become clickable and call it with the full media group + index.
 */
export function MessageMediaOpenProvider({
  value,
  children,
}: {
  value: (payload: MessageMediaOpenPayload) => void;
  children: ReactNode;
}) {
  return <MessageMediaOpenContext.Provider value={value}>{children}</MessageMediaOpenContext.Provider>;
}

export function useMessageMediaOpen() {
  return useContext(MessageMediaOpenContext);
}

function formatMediaTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "00:00";
  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function isVideoMedia(item: MessageBubbleMedia) {
  return item.type === "video" || /\.(mp4|mov|m4v|webm|ogg)(\?.*)?$/i.test(item.src);
}

function MessageVideoPlayer({
  item,
  extraCount,
}: {
  item: MessageBubbleMedia;
  extraCount: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const wasPlayingBeforeScrubRef = useRef(false);
  const isScrubbingRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProgressHovered, setIsProgressHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frame = 0;
    const updateFrame = () => {
      if (!isScrubbingRef.current) setCurrentTime(video.currentTime || 0);
      if (!video.paused) frame = window.requestAnimationFrame(updateFrame);
    };
    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
      setCurrentTime(video.currentTime || 0);
    };
    const handlePlay = () => {
      setIsPlaying(true);
      frame = window.requestAnimationFrame(updateFrame);
    };
    const handlePause = () => {
      setIsPlaying(false);
      window.cancelAnimationFrame(frame);
      if (!isScrubbingRef.current) setCurrentTime(video.currentTime || 0);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(video.duration || 0);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    if (video.readyState >= 1) handleLoadedMetadata();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (duration > 0 && video.currentTime >= duration) video.currentTime = 0;
    try {
      await video.play();
    } catch {
      return;
    }
  }, [duration]);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches;
    if (coarsePointer) {
      const nativeVideo = video as HTMLVideoElement & {
        webkitEnterFullscreen?: () => void;
      };
      if (video.requestFullscreen) void video.requestFullscreen().catch(() => {});
      else nativeVideo.webkitEnterFullscreen?.();
    }

    if (video.paused) void playVideo();
    else video.pause();
  }, [playVideo]);

  const syncProgressFromPointer = useCallback(
    (event: PointerEvent<HTMLSpanElement>, commit: boolean) => {
      const video = videoRef.current;
      const progress = progressRef.current;
      if (!video || !progress || duration <= 0) return;

      const { left, width } = progress.getBoundingClientRect();
      const ratio = Math.min(Math.max((event.clientX - left) / width, 0), 1);
      const nextTime = ratio * duration;
      setHoverTime(nextTime);
      if (!commit) return;
      video.currentTime = nextTime;
      setCurrentTime(nextTime);
    },
    [duration],
  );

  const handleProgressPointerDown = useCallback(
    (event: PointerEvent<HTMLSpanElement>) => {
      const video = videoRef.current;
      if (!video) return;
      isScrubbingRef.current = true;
      wasPlayingBeforeScrubRef.current = !video.paused;
      video.pause();
      syncProgressFromPointer(event, true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [syncProgressFromPointer],
  );

  const handleProgressPointerUp = useCallback(
    (event: PointerEvent<HTMLSpanElement>) => {
      syncProgressFromPointer(event, true);
      isScrubbingRef.current = false;
      if (wasPlayingBeforeScrubRef.current) void playVideo();
    },
    [playVideo, syncProgressFromPointer],
  );

  const progressPct = duration > 0 ? Math.min(Math.max((currentTime / duration) * 100, 0), 100) : 0;
  const controlsVisible = isHovered || !isPlaying;

  return (
    <button
      type="button"
      data-message-video-player
      aria-label={`${isPlaying ? "pause" : "play"} ${item.alt}`}
      className="group relative h-full w-full cursor-pointer overflow-hidden bg-[var(--color-dark-glass-10)] text-left"
      onClick={togglePlayback}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        setIsProgressHovered(false);
      }}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setCursor({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
      }}
    >
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        preload="metadata"
        playsInline
        className="h-full w-full object-cover"
      />

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute z-20 inline-flex items-center gap-2 rounded-full border border-light-glass-20 bg-black/40 px-3 py-1.5 font-sans text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-[16px] transition-opacity duration-150 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ left: cursor.x, top: cursor.y, transform: "translate(-50%, -50%)" }}
      >
        {isPlaying ? <Pause className="size-3.5 fill-white" /> : <Play className="size-3.5 fill-white" />}
        {isPlaying ? "pause" : "play"}
      </span>

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-black/20 transition-opacity duration-200 ${
          controlsVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      <span
        className={`absolute inset-x-2 bottom-2 z-10 flex flex-col gap-1 rounded-[12px] border border-light-glass-10 bg-black/35 px-2 py-1.5 backdrop-blur-[18px] transition-all duration-200 ${
          controlsVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <span
          ref={progressRef}
          data-message-video-progress
          className="relative flex h-5 touch-none items-center"
          onPointerEnter={() => setIsProgressHovered(true)}
          onPointerLeave={() => setIsProgressHovered(false)}
          onPointerMove={(event) => syncProgressFromPointer(event, false)}
          onPointerDown={handleProgressPointerDown}
          onPointerUp={handleProgressPointerUp}
        >
          <span
            className={`absolute left-0 right-0 rounded-full bg-white/20 transition-all duration-200 ${
              isProgressHovered ? "h-4" : "h-1.5"
            }`}
          >
            <span className="absolute inset-y-0 left-0 rounded-full bg-white/35" style={{ width: "100%" }} />
            <span className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${progressPct}%` }} />
          </span>
          <span
            className={`absolute top-0 h-5 w-px -translate-y-6 bg-[var(--color-orange-4)] transition-opacity duration-150 ${
              isProgressHovered ? "opacity-100" : "opacity-0"
            }`}
            style={{
              left: duration > 0 ? `${Math.min(Math.max((hoverTime / duration) * 100, 0), 100)}%` : "0%",
            }}
          >
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full rounded bg-dark-space px-1 py-0.5 font-mono text-[10px] leading-none text-orange-4">
              {formatMediaTime(hoverTime)}
            </span>
          </span>
        </span>
        <span className="flex items-center justify-between font-mono text-[11px] leading-none text-white/78">
          <span>{formatMediaTime(currentTime)}</span>
          <span>{formatMediaTime(duration)}</span>
        </span>
      </span>

      {extraCount > 0 && (
        <span className="absolute inset-0 z-30 flex items-center justify-center bg-black/45 font-sans text-lg font-semibold text-white">
          +{extraCount}
        </span>
      )}
    </button>
  );
}

function MessageMediaGrid({ media }: { media?: MessageBubbleMedia[] }) {
  const openMedia = useMessageMediaOpen();
  if (!media?.length) return null;

  const visibleMedia = media.slice(0, 4);
  const extraCount = Math.max(0, media.length - visibleMedia.length);

  return (
    <div
      data-message-media-grid
      className="grid overflow-hidden"
      style={{
        gap: "4px",
        gridTemplateColumns: visibleMedia.length === 1 ? "1fr" : "repeat(2, minmax(0, 1fr))",
        borderRadius: "20px 4px 20px 20px",
      }}
    >
      {visibleMedia.map((item, index) => {
        const isLastWithExtra = extraCount > 0 && index === visibleMedia.length - 1;

        return (
          <div
            key={`${item.src}-${index}`}
            className="relative min-w-0 overflow-hidden bg-[var(--color-dark-glass-10)]"
            style={{
              aspectRatio: item.aspectRatio ?? (visibleMedia.length === 1 ? "4 / 3" : "1 / 1"),
              borderRadius:
                visibleMedia.length === 1
                  ? "20px 4px 20px 20px"
                  : index === 0
                    ? "20px 4px 8px 8px"
                    : index === 1
                      ? "4px 12px 8px 8px"
                      : index === 2
                        ? "8px 8px 8px 20px"
                        : "8px",
            }}
          >
            {isVideoMedia(item) ? (
              <>
                <MessageVideoPlayer item={item} extraCount={isLastWithExtra ? extraCount : 0} />
                {openMedia && (
                  <button
                    type="button"
                    aria-label={`open ${item.alt} in viewer`}
                    onClick={() => openMedia({ items: media, index })}
                    className="absolute right-2 top-2 z-30 flex size-7 items-center justify-center rounded-full border border-light-glass-20 bg-black/40 text-white backdrop-blur-[16px] transition-colors hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-space"
                  >
                    <Maximize2 size={14} />
                  </button>
                )}
              </>
            ) : openMedia ? (
              <button
                type="button"
                aria-label={`view ${item.alt}`}
                onClick={() => openMedia({ items: media, index })}
                className="block h-full w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-space"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
              style={{ borderRadius: "inherit" }}
            />
            {isLastWithExtra && !isVideoMedia(item) && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45 font-sans text-lg font-semibold text-white">
                +{extraCount}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const MessageBubble = ({
  name,
  message,
  color = "light",
  time,
  reply,
  media,
  fullWidth = false,
  showTime = true,
  edited = false,
  className = "",
}: MessageBubbleProps) => {
  const config = BUBBLE_COLORS[color];
  const textColor = config.textColor;
  const visibleTime = showTime ? time : undefined;
  const metaLabel = [visibleTime, edited ? "edited" : undefined].filter(Boolean).join(" · ");
  const oneLineMessage = !message.includes("\n") && message.length <= 28;
  const compactMeta = Boolean(
    metaLabel &&
      !reply &&
      !name &&
      oneLineMessage,
  );
  const messageColor = textColor === "black" ? "black" : "white";
  const timeColor =
    textColor === "black"
      ? "rgba(0, 0, 0, 0.52)"
      : "rgba(255, 255, 255, 0.72)";

  return (
    <div
      data-message-bubble
      data-message-bubble-side="right"
      data-message-bubble-compact={compactMeta ? "true" : "false"}
      className={`relative flex ${fullWidth ? "w-full max-w-full" : "max-w-[85%]"} flex-col overflow-hidden ${className}`}
      style={{
        background: config.gradient,
        borderRadius: "16px 4px 16px 16px",
        padding: "4px",
        minHeight: compactMeta ? "40px" : undefined,
        // a glass rim, not a flat outline: a soft top sheen, a touch of bottom
        // depth, and a whisper-thin adaptive edge. a uniform border reads unevenly
        // over the directional gradient (bright on the dark corner, gone on the light).
        boxShadow: [
          "inset 0 1px 0.5px rgba(255, 255, 255, 0.26)",
          "inset 0 -1px 1px rgba(0, 0, 0, 0.12)",
          `inset 0 0 0 1px color-mix(in srgb, ${config.border} 40%, transparent)`,
          ...(config.backdrop
            ? ["0px 4px 12px rgba(0, 0, 0, 0.15)", "0px 2px 6px rgba(0, 0, 0, 0.1)"]
            : []),
        ].join(", "),
        ...(config.backdrop
          ? {
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
            }
          : {}),
      }}
    >
      {/* Name row — right-aligned (omitted for nameless 1:1 outgoing bubbles) */}
      {name && (
        <div
          className="flex items-center justify-end w-full"
          style={{ minHeight: "24px", padding: "0 8px" }}
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
      )}

      {/* Reply bubble (optional) — auto-paired variant */}
      {reply && <ReplyBubble {...reply} variant={config.replyVariant} />}

      <MessageMediaGrid media={media} />

      <div
        className="relative min-w-0"
        style={{
          padding: compactMeta ? "3px 16px 3px 8px" : "2px 8px 4px",
        }}
      >
        {compactMeta ? (
          <p
            className="m-0 flex min-h-6 items-baseline whitespace-pre-wrap break-words font-sans font-normal"
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              color: messageColor,
              textShadow:
                textColor === "black"
                  ? "0px -0.5px 1px rgba(0, 0, 0, 0.5), 0px 0.5px 1px white"
                  : undefined,
            }}
          >
            <span>{message}</span>
            <span
              className="ml-2 inline-flex shrink-0 align-baseline font-sans font-medium tabular-nums"
              style={{
                fontSize: "12px",
                lineHeight: "12px",
                color: timeColor,
                letterSpacing: "0",
              }}
            >
              {metaLabel}
            </span>
          </p>
        ) : (
          <>
            <p
              className="m-0 whitespace-pre-wrap break-words font-sans font-normal"
              style={{
                paddingRight: metaLabel ? (edited ? "88px" : "48px") : undefined,
                fontSize: "16px",
                lineHeight: "24px",
                color: messageColor,
                textShadow:
                  textColor === "black"
                    ? "0px -0.5px 1px rgba(0, 0, 0, 0.5), 0px 0.5px 1px white"
                    : undefined,
              }}
            >
              {message}
            </p>

            {metaLabel && (
              <span
                className="absolute bottom-1 right-4 font-sans font-medium tabular-nums"
                style={{
                  fontSize: "12px",
                  lineHeight: "12px",
                  color: timeColor,
                  letterSpacing: "0",
                }}
              >
                {metaLabel}
              </span>
            )}
          </>
        )}
      </div>

      {/* Inner shadow overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          boxShadow: "none",
        }}
      />
    </div>
  );
};

/* ─── Incoming Message Bubble (others' bubble) ─── */

export interface IncomingMessageBubbleProps {
  name: string;
  message: string;
  time?: string;
  showTime?: boolean;
  reply?: {
    name: string;
    message: string;
    avatarSrc?: string;
    avatarUserId?: string;
  };
  media?: MessageBubbleMedia[];
  className?: string;
}

export const IncomingMessageBubble = ({
  name,
  message,
  time,
  showTime = true,
  reply,
  media,
  className = "",
}: IncomingMessageBubbleProps) => {
  const visibleTime = showTime ? time : undefined;
  const oneLineMessage = !message.includes("\n") && message.length <= 28;
  const compactMeta = Boolean(
    visibleTime &&
      !reply &&
      oneLineMessage,
  );

  return (
    <div
      data-message-bubble
      data-message-bubble-side="left"
      data-message-bubble-compact={compactMeta ? "true" : "false"}
      className={`relative flex max-w-[85%] flex-col overflow-hidden backdrop-blur-[25px] ${className}`}
      style={{
        background: "var(--color-smoke-1)",
        border: "1px solid var(--color-light-glass-5)",
        borderRadius: "4px 24px 24px 24px",
        padding: "4px",
        minHeight: compactMeta ? "40px" : undefined,
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Name row — left-aligned */}
      <div className="flex items-center w-full" style={{ minHeight: "24px", padding: "0 8px" }}>
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

      <MessageMediaGrid media={media} />

      <div
        className="relative min-w-0"
        style={{
          padding: compactMeta ? "3px 16px 3px 8px" : "2px 8px 4px",
        }}
      >
        {compactMeta ? (
          <p
            className="m-0 flex min-h-6 items-baseline whitespace-pre-wrap break-words font-sans font-normal"
            style={{ fontSize: "16px", lineHeight: "24px", color: "var(--message-bubble-incoming-text, white)" }}
          >
            <span>{message}</span>
            <span
              className="ml-2 inline-flex shrink-0 align-baseline font-sans font-medium tabular-nums"
              style={{
                fontSize: "12px",
                lineHeight: "12px",
                color: "var(--message-bubble-incoming-meta, rgba(255, 255, 255, 0.72))",
                letterSpacing: "0",
              }}
            >
              {visibleTime}
            </span>
          </p>
        ) : (
          <>
            <p
              className="m-0 whitespace-pre-wrap break-words font-sans font-normal"
              style={{
                paddingRight: visibleTime ? "48px" : undefined,
                fontSize: "16px",
                lineHeight: "24px",
                color: "var(--message-bubble-incoming-text, white)",
              }}
            >
              {message}
            </p>

            {visibleTime && (
              <span
                className="absolute bottom-1 right-4 font-sans font-medium tabular-nums"
                style={{
                  fontSize: "12px",
                  lineHeight: "12px",
                  color: "var(--message-bubble-incoming-meta, rgba(255, 255, 255, 0.72))",
                  letterSpacing: "0",
                }}
              >
                {visibleTime}
              </span>
            )}
          </>
        )}
      </div>

      {/* Inner shadow overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          boxShadow: "none",
        }}
      />
    </div>
  );
};
