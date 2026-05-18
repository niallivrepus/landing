import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { BUBBLE_SHADOW, ChatBubbleButton } from "./chat-bubble-button";
import { ActiveCalls } from "./active-calls";
import { Badge } from "./badge";
import { AvatarHypeTrain, type OriginColor } from "./avatar-hype-train";
import { type SwatchColor } from "./color-swatch";
import { SecondaryButton } from "./button";
import { ServerAvatar } from "./server-avatar";

interface LibraryMenuProps {
  count?: number;
}

function LibraryMenu({ count = 3 }: LibraryMenuProps) {
  return (
    <div className="flex flex-col gap-[4px]">
      {Array.from({ length: count }, (_, i) => (
        <ChatBubbleButton key={i} variant="empty" />
      ))}
    </div>
  );
}

function LibraryMenuActive() {
  return (
    <div className="flex flex-col gap-[4px]">
      {/* Row 1: standalone empty pill */}
      <ChatBubbleButton variant="empty" />

      {/* Row 2: empty pill + single avatar */}
      <div className="flex items-center gap-[4px]">
        <ChatBubbleButton variant="empty" />
        <ActiveCalls
          participants={[
            { src: "/images/villains/villain-1.png", borderColor: "#77ff00" },
          ]}
        />
      </div>

      {/* Row 3: empty pill + 3 avatars + count badge */}
      <div className="flex items-center gap-[4px]">
        <ChatBubbleButton variant="empty" />
        <ActiveCalls
          participants={[
            { src: "/images/villains/villain-2.png", borderColor: "#ff00e5" },
            { src: "/images/villains/villain-3.png", borderColor: "#00d4ff" },
            { src: "/images/villains/villain-4.png", borderColor: "#ffcc00" },
          ]}
          count={123}
        />
      </div>

      {/* Row 4: standalone empty pill */}
      <ChatBubbleButton variant="empty" />

      {/* Row 5: empty pill + 2 avatars */}
      <div className="flex items-center gap-[4px]">
        <ChatBubbleButton variant="empty" />
        <ActiveCalls
          participants={[
            { src: "/images/villains/villain-5.png", borderColor: "#ff5500" },
            { src: "/images/villains/villain-6.png", borderColor: "#7700ff" },
          ]}
        />
      </div>

      {/* Row 6: standalone empty pill */}
      <ChatBubbleButton variant="empty" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Library — Server list with expandable channels
// ─────────────────────────────────────────────────────────────────────────────

const LIBRARY_CHANNELS: { id: string; label: string; color: SwatchColor }[] = [
  { id: "assets", label: "Assets", color: "blue" },
  { id: "badges", label: "Badges", color: "yellow" },
  { id: "buttons", label: "Buttons", color: "red" },
  { id: "cards", label: "Cards", color: "purple" },
  { id: "decor", label: "Decor", color: "blue" },
  { id: "flags", label: "Flags", color: "orange" },
  { id: "input", label: "Input", color: "green" },
  { id: "island", label: "Island", color: "purple" },
];

const CHANNEL_DOT_STYLES: Record<SwatchColor, CSSProperties> = {
  blue: {
    background:
      "linear-gradient(135deg, var(--color-blue-4) 0%, var(--color-blue-5) 100%)",
    boxShadow:
      "0 0 8px color-mix(in srgb, var(--color-blue-4) 65%, transparent)",
  },
  green: {
    background:
      "linear-gradient(135deg, var(--color-green-4) 0%, var(--color-green-5) 100%)",
    boxShadow:
      "0 0 8px color-mix(in srgb, var(--color-green-4) 65%, transparent)",
  },
  orange: {
    background:
      "linear-gradient(135deg, var(--color-orange-4) 0%, var(--color-orange-5) 100%)",
    boxShadow:
      "0 0 8px color-mix(in srgb, var(--color-orange-4) 65%, transparent)",
  },
  purple: {
    background:
      "linear-gradient(135deg, var(--color-purple-4) 0%, var(--color-purple-5) 100%)",
    boxShadow:
      "0 0 8px color-mix(in srgb, var(--color-purple-4) 65%, transparent)",
  },
  red: {
    background:
      "linear-gradient(135deg, var(--color-red-4) 0%, var(--color-red-5) 100%)",
    boxShadow:
      "0 0 8px color-mix(in srgb, var(--color-red-4) 65%, transparent)",
  },
  yellow: {
    background:
      "linear-gradient(135deg, var(--color-yellow-4) 0%, var(--color-yellow-5) 100%)",
    boxShadow:
      "0 0 8px color-mix(in srgb, var(--color-yellow-4) 65%, transparent)",
  },
};

interface ServerActivity {
  participants: { src: string; borderColor: string }[];
  count?: number;
}

interface ServerEntry {
  id: string;
  name: string;
  avatarSrc: string;
  hasStar: boolean;
  hypeAvatars?: [string, string, string];
  hypeColors?: [OriginColor, OriginColor, OriginColor];
  memberCount?: number;
  activity?: ServerActivity;
}

const SERVERS: ServerEntry[] = [
  {
    id: "tarxan",
    name: "Tarxan",
    avatarSrc: "/images/villains/villain-1.png",
    hasStar: false,
  },
  {
    id: "elrain",
    name: "Elrain",
    avatarSrc: "/images/villains/villain-2.png",
    hasStar: true,
    memberCount: 48,
    activity: {
      participants: [
        { src: "/images/villains/villain-2.png", borderColor: "#ff00e5" },
        { src: "/images/villains/villain-3.png", borderColor: "#00d4ff" },
        { src: "/images/villains/villain-4.png", borderColor: "#ffcc00" },
      ],
      count: 123,
    },
  },
  {
    id: "yoda",
    name: "Yoda",
    avatarSrc: "/images/villains/villain-3.png",
    hasStar: false,
    memberCount: 12,
    activity: {
      participants: [
        { src: "/images/villains/villain-3.png", borderColor: "#00d4ff" },
      ],
    },
  },
  {
    id: "hyke",
    name: "Hyke",
    avatarSrc: "/images/villains/villain-4.png",
    hasStar: true,
    memberCount: 64,
  },
  {
    id: "lotion",
    name: "Lotion",
    avatarSrc: "/images/villains/villain-5.png",
    hasStar: true,
    hypeAvatars: [
      "/images/villains/villain-5.png",
      "/images/villains/villain-6.png",
      "/images/villains/villain-7.png",
    ],
    hypeColors: ["fruta", "aether", "life"],
    memberCount: 92,
    activity: {
      participants: [
        { src: "/images/villains/villain-5.png", borderColor: "#ff5500" },
        { src: "/images/villains/villain-6.png", borderColor: "#7700ff" },
      ],
    },
  },
];

const COLLAPSED_PILL_WIDTH = 12;
const SERVER_ROW_MIN_WIDTH = 118;
const HOVER_CLOSE_DELAY_MS = 220;

function GoldStar() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
      style={{ filter: "drop-shadow(0 0 3px rgba(255, 215, 0, 0.6))" }}
    >
      <path
        d="M8 1l2.12 4.3 4.74.69-3.43 3.34.81 4.72L8 11.77l-4.24 2.28.81-4.72L1.14 5.99l4.74-.69L8 1z"
        fill="#FFD700"
      />
    </svg>
  );
}

interface LibraryProps {
  defaultPinnedServerId?: string | null;
}

function getServerRevealWidth(name: string) {
  return Math.max(SERVER_ROW_MIN_WIDTH, 56 + name.length * 8.5);
}

function Library({ defaultPinnedServerId = null }: LibraryProps) {
  const [hoveredServerName, setHoveredServerName] = useState<string | null>(
    null,
  );
  const [focusedServerName, setFocusedServerName] = useState<string | null>(
    null,
  );
  const [pinnedServerName, setPinnedServerName] = useState<string | null>(
    defaultPinnedServerId,
  );
  const hoverLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const activeServerName =
    focusedServerName ?? pinnedServerName ?? hoveredServerName;

  const clearHoverLeaveTimeout = () => {
    if (hoverLeaveTimeoutRef.current) {
      clearTimeout(hoverLeaveTimeoutRef.current);
      hoverLeaveTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearHoverLeaveTimeout();
    };
  }, []);

  const handlePointerEnter =
    (name: string) => (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse") {
        clearHoverLeaveTimeout();
        setHoveredServerName(name);
      }
    };

  const handlePointerLeave =
    (name: string) => (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse") {
        clearHoverLeaveTimeout();
        hoverLeaveTimeoutRef.current = setTimeout(() => {
          setHoveredServerName((current) =>
            current === name ? null : current,
          );
        }, HOVER_CLOSE_DELAY_MS);
      }
    };

  const handleFocusCapture = (name: string) => () => {
    clearHoverLeaveTimeout();
    setFocusedServerName(name);
  };

  const handleBlurCapture =
    (name: string) => (event: FocusEvent<HTMLDivElement>) => {
      const nextTarget = event.relatedTarget;
      if (
        nextTarget instanceof Node &&
        event.currentTarget.contains(nextTarget)
      ) {
        return;
      }
      setFocusedServerName((current) => (current === name ? null : current));
    };

  const togglePinnedServer = (name: string) => {
    setPinnedServerName((current) => (current === name ? null : name));
  };

  return (
    <div className="flex flex-col gap-[4px]">
      {/* Top: add server button */}
      <ChatBubbleButton variant="plus" />

      {/* Server list */}
      {SERVERS.map((server) => {
        const isExpanded = activeServerName === server.id;
        const panelId = `library-channels-${server.id}`;
        const revealWidth = getServerRevealWidth(server.name);

        return (
          <div
            key={server.id}
            className="flex flex-col gap-[4px]"
            onPointerEnter={handlePointerEnter(server.id)}
            onPointerLeave={handlePointerLeave(server.id)}
            onFocusCapture={handleFocusCapture(server.id)}
            onBlurCapture={handleBlurCapture(server.id)}
          >
            {/* Server row */}
            <div className="flex items-center gap-[4px]">
              <motion.button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                aria-label={server.name}
                title={server.name}
                initial={false}
                animate={{
                  width: isExpanded ? revealWidth : COLLAPSED_PILL_WIDTH,
                  backgroundColor: isExpanded
                    ? "rgba(255, 255, 255, 0.08)"
                    : "var(--color-light-glass-5)",
                  borderColor: isExpanded
                    ? "var(--color-light-glass-10)"
                    : "var(--color-light-glass-20)",
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative inline-flex h-10 shrink-0 items-center rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                style={{
                  boxShadow: BUBBLE_SHADOW,
                  overflow: "hidden",
                }}
                onClick={() => togglePinnedServer(server.id)}
              >
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isExpanded ? 1 : 0,
                    x: isExpanded ? 0 : -10,
                  }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="inline-flex items-center gap-[4px] pl-[4px] pr-[16px]"
                >
                  <ServerAvatar size={32} src={server.avatarSrc} />
                  <span className="font-sans font-bold text-[14px] leading-[0.9] text-light-space">
                    {server.name}
                  </span>
                </motion.div>
              </motion.button>

              {!isExpanded && server.activity && (
                <ActiveCalls
                  participants={server.activity.participants}
                  count={server.activity.count}
                />
              )}

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="flex items-center gap-[4px]"
                  >
                    {server.hasStar && <GoldStar />}
                    {server.hypeAvatars && server.hypeColors && (
                      <AvatarHypeTrain
                        avatarSrcs={server.hypeAvatars}
                        colors={server.hypeColors}
                        size="small"
                      />
                    )}
                    {server.memberCount != null && (
                      <Badge
                        label={`+${server.memberCount}`}
                        variant="outline"
                        color="neutral"
                        type="text"
                        size="tag"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Expandable channels */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  id={panelId}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="ml-[16px] flex flex-col gap-[4px]"
                  style={{ overflow: "hidden" }}
                >
                  {LIBRARY_CHANNELS.map((ch, i) => (
                    <motion.div
                      key={ch.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{
                        duration: 0.15,
                        delay: i * 0.03,
                        ease: "easeOut",
                      }}
                    >
                      <SecondaryButton className="min-h-10 w-fit items-center justify-start gap-0 rounded-full pl-3 pr-4 text-left transition-transform duration-200 hover:-translate-y-[1px] focus-visible:ring-2 focus-visible:ring-white/20">
                        <div
                          className="mr-2 shrink-0 rounded-full"
                          style={{
                            width: 8,
                            height: 8,
                            ...CHANNEL_DOT_STYLES[ch.color],
                          }}
                        />
                        <p className="text-sm font-medium leading-none text-black/80 dark:text-foreground/90">
                          {ch.label}
                        </p>
                      </SecondaryButton>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Bottom: library icon button */}
      <ChatBubbleButton variant="library" />
    </div>
  );
}

export { LibraryMenu, LibraryMenuActive, Library };
