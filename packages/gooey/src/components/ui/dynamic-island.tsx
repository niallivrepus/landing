import * as React from "react";
import { Call02Icon, CallEnd01Icon, TextAlignLeftIcon, SparklesIcon, Search01Icon, Notification03Icon, NotificationOff02Icon, PauseIcon, Cancel01Icon, Share01Icon, ArrowExpandDiagonal01Icon, ArrowShrink02Icon, Settings02Icon, Mic01Icon, MicOff02Icon, Video01Icon, VideoOffIcon, ComputerVideoIcon, WavingHand01Icon, UserGroupIcon, SmileIcon, UserAdd01Icon, MusicNoteSquare02Icon, Add01Icon } from "hugeicons-react";
import { motion, useMotionValue, useTransform, animate, type PanInfo, type MotionValue } from "motion/react";
import { NexusLogo } from "@gooey/components/ui/nexus-logo";
import { OO } from "@gooey/components/ui/oo";
import { GlassIconButton } from "@gooey/components/ui/glass-icon-button";
import { IconOnlyButton } from "@gooey/components/ui/icon-only-button";
import { ActionCircleButton } from "@gooey/components/ui/action-circle-button";
import { StepCounter, type OriginColor } from "@gooey/components/ui/step-counter";
import { Timer } from "@gooey/components/ui/timer";
import { AlbumArtCover } from "@gooey/components/ui/album-art-cover";
import { MusicCoverTitle } from "@gooey/components/ui/music-cover-title";
import { Soundwave } from "@gooey/components/ui/soundwave";
import { HumanSpeech } from "@gooey/components/ui/human-speech";
import { MusicControls } from "@gooey/components/ui/music-controls";
import { MusicTimer } from "@gooey/components/ui/music-timer";
import { Switch } from "@gooey/components/ui/switch";
import { Button } from "@gooey/components/ui/button";
import { Avatar } from "@gooey/components/ui/avatar";
import { ContactItem } from "@gooey/components/ui/contact-item";
import { getOriginHexes } from "@gooey/lib/design-colors";

export type DynamicIslandVariant = "empty" | "logo" | "call-bubble" | "title" | "copied" | "alert" | "error" | "step-counter" | "oo" | "greetings" | "search" | "messages" | "collapsed-call" | "edit-profile" | "timer-counting" | "silent-timer" | "music" | "expanded-music" | "group-chat" | "direct-message" | "sign-up" | "join-call" | "exit-call" | "expanded-timer-ringing" | "expanded-silent-timer" | "expanded-timer-on" | "question-prompt" | "share" | "swipe-action" | "join-bubble" | "soundboard" | "settings" | "select-screen" | "expanded-join-call" | "expanded-exit-call" | "expanded-outgoing-call" | "fullscreen-exit-call";

interface DynamicIslandProps {
  variant?: DynamicIslandVariant;
  title?: string;
  /** Text for the greetings variant */
  greetingText?: string;
  /** Current step for step-counter variant */
  step?: 1 | 2 | 3 | 4 | 5;
  /** Color for step-counter variant */
  stepColor?: OriginColor;
  /** Message count for "messages" variant */
  messageCount?: number;
  /** Timer seconds for timer-counting variant */
  timerSeconds?: number;
  /** Caller name for collapsed-call variant */
  callerName?: string;
  /** Caller avatar URL for collapsed-call variant */
  callerAvatar?: string;
  /** Truncated message text for collapsed-call variant */
  callMessage?: string;
  /** Hang up callback for collapsed-call variant */
  onHangUp?: () => void;
  /** Edit profile callback for edit-profile variant */
  onEditProfile?: () => void;
  /** Song title for music variant */
  songTitle?: string;
  /** Artist name for music variant */
  songArtist?: string;
  /** Contact/group name for group-chat and direct-message variants */
  contactName?: string;
  /** Avatars for group-chat and direct-message variants. Each has src and borderColor. */
  avatars?: Array<{ src: string; borderColor: string }>;
  /** Join call callback for join-call variant */
  onJoinCall?: () => void;
  /** Login callback for sign-up variant */
  onLogin?: () => void;
  /** Sign up callback for sign-up variant */
  onSignUp?: () => void;
  /** Pause callback for expanded-timer-on variant */
  onPause?: () => void;
  /** Cancel/stop callback for expanded-timer-on and question-prompt variants */
  onCancel?: () => void;
  /** Question text for question-prompt variant */
  questionText?: string;
  /** Confirm callback for question-prompt variant */
  onConfirm?: () => void;
  /** Confirm button label for question-prompt variant (default: "Confirm") */
  confirmLabel?: string;
  /** Cancel button label for question-prompt variant (default: "Cancel") */
  cancelLabel?: string;
  /** Subject text for share variant (e.g. "HelloKitty is Screen Sharing") */
  shareSubject?: string;
  /** Copy link callback for share variant */
  onCopyLink?: () => void;
  /** Copy link button label for share variant (default: "Copy Call Link") */
  copyLinkLabel?: string;
  /** Member count text for expanded-join-call variant */
  memberCount?: string;
  /** Share button callback for expanded-join-call variant */
  onShare?: () => void;
  /** Expand/fullscreen callback for expanded-exit-call variant */
  onExpand?: () => void;
  /** Reactions callback for expanded-exit-call variant */
  onReact?: () => void;
  /** Settings callback for expanded-exit-call variant */
  onSettings?: () => void;
  /** Mic mute toggle for expanded-exit-call variant */
  onMicToggle?: () => void;
  /** Video off toggle for expanded-exit-call variant */
  onVideoToggle?: () => void;
  /** Screen share toggle for expanded-exit-call variant */
  onScreenShare?: () => void;
  /** Whether mic is muted for expanded-exit-call variant */
  isMuted?: boolean;
  /** Whether video is off for expanded-exit-call variant */
  isCameraOff?: boolean;
  /** Whether music is currently playing for expanded-music variant */
  musicPlaying?: boolean;
  /** Play/pause toggle for expanded-music variant */
  onPlayPauseToggle?: (playing: boolean) => void;
  /** Skip backward for expanded-music variant */
  onBackward?: () => void;
  /** Skip forward for expanded-music variant */
  onForward?: () => void;
  /** Current playback time in seconds for expanded-music variant */
  musicCurrentTime?: number;
  /** Total duration in seconds for expanded-music variant */
  musicDuration?: number;
  /** Album cover image URL for expanded-music variant */
  coverSrc?: string;
  /** Text label for swipe-action variant */
  actionText?: string;
  /** Energy color for the swipe-action circle button */
  actionEnergy?: "red" | "green" | "purple" | "orange";
  /** Optional CSS gradient override for swipe-action circle */
  actionGradient?: string;
  /** Icon ReactNode for the swipe-action circle button */
  actionIcon?: React.ReactNode;
  /** Callback when swipe-action drag is confirmed */
  onSwipeConfirm?: () => void;
  /** Sound items for soundboard variant */
  soundboardItems?: Array<{ emoji: string; label: string; onPlay?: () => void }>;
  /** Screen items for select-screen variant */
  screenItems?: Array<{ label: string; thumbnail?: string; onClick?: () => void }>;
  /** Title for settings variant (default: "Call Settings") */
  settingsTitle?: string;
  /** Sections for settings variant, each with a title and device list */
  settingsSections?: Array<{ title: string; devices: Array<{ name: string; id: string; enabled: boolean }> }>;
  /** Device toggle callback for settings variant */
  onDeviceToggle?: (sectionIndex: number, deviceIndex: number, enabled: boolean) => void;
  /** Close callback for settings variant */
  onClose?: () => void;
  /** Snooze callback for expanded-silent-timer variant */
  onSnooze?: () => void;
  /** Participants for fullscreen-exit-call variant */
  participants?: Array<{
    name: string;
    avatar: string;
    borderColor: string;
    isCameraOn: boolean;
    thumbnail?: string;
    /** Raised hand order (1 = first, 2 = second, etc.). Undefined = not raised. */
    handRaised?: number;
    /** Whether this participant is currently speaking */
    isSpeaking?: boolean;
    /** Origin color for speaking border/glow */
    originColor?: OriginColor;
  }>;
  /** Total participant count for fullscreen-exit-call (shown in header) */
  totalParticipants?: number;
  /** Callback when participants list button is clicked */
  onParticipantsList?: () => void;
  /** Callback when connect button is clicked on a participant */
  onConnectParticipant?: (participantIndex: number) => void;
  /** Callback when Ask is clicked in OO variant */
  onAsk?: () => void;
  /** Callback when Learn is clicked in OO variant */
  onLearn?: () => void;
  className?: string;
}

const glassPillStyle: React.CSSProperties = {
  width: 242,
  height: 50,
  borderRadius: 999,
  background: "var(--color-light-glass-5)",
  outline: "2px solid var(--color-light-glass-20)",
  outlineOffset: "-2px",
  backdropFilter: "blur(25px)",
  WebkitBackdropFilter: "blur(25px)",
  boxShadow:
    "0 1px 1px 0 rgba(255, 255, 255, 0.15) inset, 0 2px 3px 0 rgba(255, 255, 255, 0.15) inset",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative" as const,
};

const expandedGlassPillStyle: React.CSSProperties = {
  ...glassPillStyle,
  width: 366,
  height: 70,
};

const textShadow = "0px -2px 5px rgba(255,255,255,0.25)";

/** Typewriter effect for greeting text — types out character by character */
function GreetingTypewriter({ text, delay = 500, speed = 50 }: { text: string; delay?: number; speed?: number }) {
  const [charIndex, setCharIndex] = React.useState(0);

  React.useEffect(() => {
    setCharIndex(0);
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCharIndex((i) => {
          if (i >= text.length) {
            clearInterval(interval);
            return i;
          }
          return i + 1;
        });
      }, speed);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: 16,
        color: "var(--color-light-space)",
        textShadow,
      }}
    >
      {text.slice(0, charIndex)}
    </span>
  );
}

function CarouselAvatar({ x, index, initialCenter, spacing, avatar }: {
  x: MotionValue<number>;
  index: number;
  initialCenter: number;
  spacing: number;
  avatar: { src: string; borderColor: string };
}) {
  const w = useTransform(x, (xVal) => {
    const dist = Math.abs((index - initialCenter) * spacing + xVal) / spacing;
    if (dist >= 2) return 20;
    if (dist >= 1) return 40 - 20 * (dist - 1);
    return 47 - 7 * dist;
  });
  const h = useTransform(x, (xVal) => {
    const dist = Math.abs((index - initialCenter) * spacing + xVal) / spacing;
    if (dist >= 2) return 27;
    if (dist >= 1) return 54 - 27 * (dist - 1);
    return 64 - 10 * dist;
  });
  const z = useTransform(x, (xVal) => {
    const dist = Math.abs((index - initialCenter) * spacing + xVal) / spacing;
    if (dist <= 0.5) return 10;
    if (dist <= 1.5) return 7;
    return 4;
  });
  const ringOpacity = useTransform(x, (xVal) => {
    const dist = Math.abs((index - initialCenter) * spacing + xVal) / spacing;
    return Math.max(0, 1 - dist);
  });

  return (
    <motion.div
      style={{
        width: spacing,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        zIndex: z,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity: ringOpacity,
        }}
      >
        <HumanSpeech size="large" color="life" />
      </motion.div>
      <motion.img
        src={avatar.src}
        alt=""
        style={{
          width: w,
          height: h,
          borderRadius: 999,
          border: `2px solid ${avatar.borderColor}`,
          objectFit: "cover",
        }}
      />
    </motion.div>
  );
}

/** Marching ants dashed border — animated stroke-dashoffset on a pill-shaped SVG */
function MarchingAntsBorder({ width, height, color }: { width: number; height: number; color: string }) {
  const rx = Math.min(width, height) / 2;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <rect
        x={1}
        y={1}
        width={width - 2}
        height={height - 2}
        rx={rx - 1}
        ry={rx - 1}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="6 4"
        fill="none"
        filter="drop-shadow(0px 1px 4px rgba(0,0,0,0.1))"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-20"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}

export function DynamicIsland({
  variant = "empty",
  title,
  greetingText = "Hi! Nice to meet you!",
  step = 1,
  stepColor = "life",
  messageCount = 8,
  timerSeconds = 21,
  callerName,
  callerAvatar,
  callMessage,
  onHangUp,
  onEditProfile,
  songTitle = "Amen!",
  songArtist = "Bring Me The Horizon",
  contactName,
  avatars,
  onJoinCall,
  onLogin,
  onSignUp,
  onPause,
  onCancel,
  questionText,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  shareSubject,
  onCopyLink,
  copyLinkLabel = "Copy Call Link",
  memberCount,
  onShare,
  onExpand,
  onReact,
  onSettings,
  onMicToggle,
  onVideoToggle,
  onScreenShare,
  isMuted,
  isCameraOff,
  musicPlaying,
  onPlayPauseToggle,
  onBackward,
  onForward,
  musicCurrentTime = 85,
  musicDuration = 214,
  coverSrc,
  actionText,
  actionEnergy = "red",
  actionGradient,
  actionIcon,
  onSwipeConfirm,
  soundboardItems = [
    { emoji: "🦆", label: "Quack" },
    { emoji: "🔊", label: "Airhorn" },
    { emoji: "🦗", label: "Cricket" },
    { emoji: "👏", label: "Clap" },
    { emoji: "🛸", label: "Alien" },
    { emoji: "🥁", label: "Ba dum tss" },
  ],
  screenItems = [
    { label: "screen 1" },
    { label: "screen 2" },
  ],
  settingsTitle = "Call Settings",
  settingsSections,
  onDeviceToggle,
  onClose,
  onSnooze,
  participants = [],
  totalParticipants,
  onParticipantsList,
  onConnectParticipant,
  onAsk,
  onLearn,
  className = "",
}: DynamicIslandProps) {
  const [participantsListOpen, setParticipantsListOpen] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState<"soundboard" | "settings" | "emoji" | null>(null);
  const [emojiSearch, setEmojiSearch] = React.useState("");
  const [selectedSkinTone, setSelectedSkinTone] = React.useState(0);
  const [recentEmojis, setRecentEmojis] = React.useState<string[]>(["😂", "❤️", "🔥", "👏", "😍", "🎉", "💯", "🙌"]);
  const [floatingEmojis, setFloatingEmojis] = React.useState<Array<{ id: number; emoji: string; x: number }>>([]);
  const [ooExpression, setOoExpression] = React.useState<"default" | "happy" | "rainbow-puke">("default");
  const [ooBouncing, setOoBouncing] = React.useState(false);
  const handleOOClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setOoExpression("rainbow-puke");
    setOoBouncing(true);
    setTimeout(() => setOoBouncing(false), 400);
  }, []);
  if (variant === "empty") {
    return (
      <div
        className={className}
        style={{
          width: 242,
          height: 50,
          borderRadius: 999,
          background: "var(--color-dark-space)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NexusLogo height={12} className="text-[var(--color-light-space)] opacity-30" />
      </div>
    );
  }

  if (variant === "copied") {
    return (
      <div className={className} style={{ ...glassPillStyle, overflow: "hidden" }}>
        <style>{`
          @keyframes island-copied {
            0% { transform: translateY(-12px); opacity: 0; }
            30% { transform: translateY(0); opacity: 1; }
            70% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(12px); opacity: 0; }
          }
        `}</style>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 1.56,
            color: "var(--color-light-space)",
            textShadow: "0px -2px 5px rgba(255, 255, 255, 0.25)",
            margin: 0,
            animation: "island-copied 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          Copied!
        </p>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            boxShadow: "inset 0px 2px 4px rgba(255, 255, 255, 0.15)",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  if (variant === "alert" || variant === "error") {
    return (
      <div className={className} style={{ ...glassPillStyle, overflow: "hidden" }}>
        <style>{`
          @keyframes island-copied {
            0% { transform: translateY(-12px); opacity: 0; }
            30% { transform: translateY(0); opacity: 1; }
            70% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(12px); opacity: 0; }
          }
        `}</style>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 1.56,
            color: "var(--color-light-space)",
            textShadow: "0px -2px 5px rgba(255, 255, 255, 0.25)",
            margin: 0,
            animation: "island-copied 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          {variant === "alert" ? "Alert!" : "Error!"}
        </p>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            boxShadow: "inset 0px 2px 4px rgba(255, 255, 255, 0.15)",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  if (variant === "step-counter") {
    return (
      <div className={className} style={{ ...glassPillStyle, padding: 4 }}>
        <StepCounter step={step} color={stepColor} style={{ width: "100%", height: 42 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            boxShadow: "inset 0px 2px 4px rgba(255, 255, 255, 0.15)",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  if (variant === "title") {
    return (
      <div className={className} style={glassPillStyle}>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, mass: 0.8 }}
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 1.56,
            color: "var(--color-light-space)",
            textShadow: "0px -2px 5px rgba(255, 255, 255, 0.25)",
            margin: 0,
          }}
        >
          {title}
        </motion.p>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            boxShadow: "inset 0px 2px 4px rgba(255, 255, 255, 0.15)",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  if (variant === "oo") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          justifyContent: "flex-start",
          paddingLeft: 4,
          paddingRight: 20,
          gap: 16,
          overflow: "hidden",
        }}
      >
        <OO
          style={{ width: 42, height: 42, cursor: "pointer", flexShrink: 0 }}
          expression={ooExpression}
          bouncing={ooBouncing}
          onMouseEnter={() => setOoExpression("happy")}
          onMouseLeave={() => setOoExpression("default")}
          onClick={handleOOClick}
          aria-label="OO character"
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: onLearn ? "pointer" : undefined }} onClick={onLearn}>
            <GlassIconButton>
              <TextAlignLeftIcon size={14} className="text-[var(--color-light-space)] opacity-80" />
            </GlassIconButton>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--color-light-space)",
                textShadow,
              }}
            >
              Learn
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: onAsk ? "pointer" : undefined }} onClick={onAsk}>
            <GlassIconButton>
              <SparklesIcon size={14} className="text-[var(--color-light-space)] opacity-80" />
            </GlassIconButton>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--color-light-space)",
                textShadow,
              }}
            >
              Ask
            </span>
          </div>
        </div>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "greetings") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          justifyContent: "flex-start",
          paddingLeft: 4,
          paddingRight: 20,
          gap: 8,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ flexShrink: 0 }}
        >
          <OO
            style={{ width: 42, height: 42, cursor: "pointer" }}
            expression={ooExpression}
            bouncing={ooBouncing}
            onMouseEnter={() => setOoExpression("happy")}
            onMouseLeave={() => setOoExpression("default")}
            onClick={handleOOClick}
            aria-label="OO character"
          />
        </motion.div>
        <GreetingTypewriter text={greetingText} delay={1900} speed={50} />
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "search") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          justifyContent: "flex-start",
          paddingLeft: 4,
          paddingRight: 20,
          gap: 8,
        }}
      >
        <IconOnlyButton size="small" icon={<Search01Icon size={20} />} />
        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--color-light-space)",
            textShadow,
          }}
        >
          Search
        </span>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "collapsed-call") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          overflow: "clip",
          justifyContent: "space-between",
          paddingLeft: 10,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          {callerAvatar && (
            <img
              src={callerAvatar}
              alt={callerName ?? ""}
              style={{
                width: 20,
                height: 27,
                borderRadius: 999,
                border: "2px solid #002FFF",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.4,
              color: "var(--color-light-space)",
              textShadow,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {callerName}
          </span>
          {callMessage && (
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: 1.4,
                color: "var(--color-light-space)",
                textShadow,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              {callMessage}
            </span>
          )}
        </div>
        <ActionCircleButton
          icon={<CallEnd01Icon size={20} />}
          energy="red"
          active
          onClick={onHangUp}
        />
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "timer-counting") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          justifyContent: "space-between",
          paddingLeft: 4,
          paddingRight: 20,
        }}
      >
        <IconOnlyButton size="small" icon={<Notification03Icon size={20} />} />
        <Timer seconds={timerSeconds} />
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "silent-timer") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          justifyContent: "space-between",
          paddingLeft: 4,
          paddingRight: 20,
        }}
      >
        <ActionCircleButton
          energy="red"
          active
          icon={<NotificationOff02Icon size={20} />}
          onClick={onSnooze}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            fontWeight: 400,
            color: "var(--color-light-space)",
          }}
        >
          Snooze
        </span>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "music") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          overflow: "hidden",
          justifyContent: "flex-start",
          paddingLeft: 13,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            overflow: "hidden",
            flex: 1,
            minWidth: 0,
          }}
        >
          <AlbumArtCover size="small" src={coverSrc} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              fontFamily: "Satoshi, sans-serif",
              fontSize: 16,
            }}
          >
            <span
              style={{ fontWeight: 700, color: "var(--color-light-space)" }}
            >
              {songTitle} -
            </span>
            <span
              style={{ fontWeight: 400, color: "var(--color-text-secondary)" }}
            >
              {songArtist}
            </span>
          </div>
        </div>
        {/* Dark right fade */}
        <div
          style={{
            position: "absolute",
            right: -2,
            top: -1.5,
            width: 39,
            height: 49,
            background:
              "linear-gradient(to right, transparent, var(--color-overlay-scrim))",
            pointerEvents: "none",
          }}
        />
        {/* Inner shadow overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "expanded-music") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          width: 366,
          height: 142,
          borderRadius: 32,
          flexDirection: "column",
          justifyContent: "center",
          gap: 12,
          padding: 12,
        }}
      >
        {/* Top row: cover+title + soundwave */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", flex: "1 0 0", minHeight: 0 }}>
          <MusicCoverTitle
            title={songTitle}
            artist={songArtist}
            coverSrc={coverSrc}
            variant="large"
            className="w-[245px]"
          />
          <Soundwave color="insight" animate={musicPlaying} disabled={!musicPlaying} />
        </div>
        {/* Middle row: timer/progress */}
        <MusicTimer currentTime={musicCurrentTime} duration={musicDuration} />
        {/* Bottom row: controls */}
        <MusicControls
          playing={musicPlaying}
          onPlayPauseToggle={onPlayPauseToggle}
          onBackward={onBackward}
          onForward={onForward}
        />
        {/* Inner shadow overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "edit-profile") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          overflow: "clip",
          paddingLeft: 12,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
          {callerAvatar && (
            <img
              src={callerAvatar}
              alt={callerName ?? ""}
              style={{
                width: 20,
                height: 27,
                borderRadius: 999,
                border: "2px solid #002FFF",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.4,
              color: "var(--color-light-space)",
              textShadow,
              whiteSpace: "nowrap",
            }}
          >
            {callerName}
          </span>
        </div>
        <Button variant="secondary-neutral" onClick={onEditProfile} className="h-full" style={{ paddingLeft: 20, paddingRight: 20 }}>
          Edit Profile
        </Button>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "group-chat") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          overflow: "clip",
          justifyContent: "space-between",
          paddingLeft: 12,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", paddingRight: 16 }}>
            {avatars?.map((avatar, i) => (
              <img
                key={i}
                src={avatar.src}
                alt=""
                style={{
                  width: 20,
                  height: 27,
                  borderRadius: 999,
                  border: `2px solid ${avatar.borderColor}`,
                  objectFit: "cover",
                  flexShrink: 0,
                  marginLeft: i > 0 ? -10 : 0,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.4,
              color: "var(--color-light-space)",
              textShadow,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {contactName}
          </span>
        </div>
        <IconOnlyButton size="small" icon={<Call02Icon size={20} />} />
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "direct-message") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          overflow: "clip",
          justifyContent: "space-between",
          paddingLeft: 12,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          {avatars?.[0] && (
            <img
              src={avatars[0].src}
              alt=""
              style={{
                width: 20,
                height: 27,
                borderRadius: 999,
                border: `2px solid ${avatars[0].borderColor}`,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.4,
              color: "var(--color-light-space)",
              textShadow,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {contactName}
          </span>
        </div>
        <IconOnlyButton size="small" icon={<Call02Icon size={20} />} />
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "join-call") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          overflow: "clip",
          justifyContent: "space-between",
          paddingLeft: 12,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          {callerAvatar && (
            <img
              src={callerAvatar}
              alt={callerName ?? ""}
              style={{
                width: 20,
                height: 27,
                borderRadius: 999,
                border: "2px solid #002FFF",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.4,
              color: "var(--color-light-space)",
              textShadow,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {callerName}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ActionCircleButton
            icon={<Call02Icon size={20} />}
            energy="green"
            active
            onClick={onJoinCall}
          />
          <ActionCircleButton
            icon={<CallEnd01Icon size={20} />}
            energy="red"
            active
            onClick={onHangUp}
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "exit-call") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          overflow: "clip",
          justifyContent: "space-between",
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "clip", width: 165, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {avatars?.map((avatar, i) => (
              <img
                key={i}
                src={avatar.src}
                alt=""
                style={{
                  width: 20,
                  height: 27,
                  borderRadius: 999,
                  border: `2px solid ${avatar.borderColor}`,
                  objectFit: "cover",
                  flexShrink: 0,
                  marginLeft: i > 0 ? -10 : 0,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.4,
              color: "var(--color-light-space)",
              textShadow,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {callMessage}
          </span>
          {/* Dark right fade */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: 24,
              height: "100%",
              background: "linear-gradient(to right, transparent, rgba(0,0,0,0.25))",
              pointerEvents: "none",
            }}
          />
        </div>
        <ActionCircleButton
          icon={<CallEnd01Icon size={20} />}
          energy="red"
          active
          onClick={onHangUp}
        />
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "sign-up") {
    return (
      <div className={className} style={{ ...glassPillStyle, padding: 4, gap: 4 }}>
        <Button variant="primary-neutral" size="xl" onClick={onLogin} className="flex-1 h-full">
          Login
        </Button>
        <Button variant="secondary-neutral" size="xl" onClick={onSignUp} className="flex-1 h-full">
          Sign Up
        </Button>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "expanded-timer-ringing") {
    return (
      <div
        className={className}
        style={{
          ...expandedGlassPillStyle,
          justifyContent: "space-between",
          paddingLeft: 4,
          paddingRight: 20,
        }}
      >
        <IconOnlyButton
          size="large"
          icon={<Notification03Icon size={28} />}
          style={{ width: 62, height: 62 }}
        />
        <span
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--color-light-space)",
            textShadow,
          }}
        >
          Ring
        </span>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "expanded-silent-timer") {
    return (
      <div
        className={className}
        style={{
          ...expandedGlassPillStyle,
          justifyContent: "space-between",
          paddingLeft: 4,
          paddingRight: 20,
        }}
      >
        <ActionCircleButton
          energy="red"
          active
          icon={<NotificationOff02Icon size={28} />}
          style={{ width: 62, height: 62 }}
          onClick={onSnooze}
        />
        <span
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            background: "linear-gradient(74.33deg, rgb(203,11,3) 0%, rgb(255,9,112) 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Snooze
        </span>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "expanded-timer-on") {
    return (
      <div
        className={className}
        style={{
          ...expandedGlassPillStyle,
          justifyContent: "space-between",
          paddingLeft: 4,
          paddingRight: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconOnlyButton
            size="large"
            icon={<PauseIcon size={28} />}
            style={{ width: 62, height: 62 }}
            onClick={onPause}
          />
          <IconOnlyButton
            size="large"
            icon={<Cancel01Icon size={28} />}
            style={{ width: 62, height: 62 }}
            onClick={onCancel}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--color-light-space)",
              textShadow,
            }}
          >
            Timer
          </span>
          <Timer seconds={timerSeconds} />
        </div>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "question-prompt") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          width: 366,
          height: 111,
          borderRadius: 32,
          flexDirection: "column",
          padding: 12,
          gap: 12,
          overflow: "clip",
        }}
      >
        <p
          style={{
            width: "100%",
            textAlign: "center",
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 1.56,
            color: "var(--color-light-space)",
            textShadow,
            margin: 0,
          }}
        >
          {questionText}
        </p>
        <div style={{ display: "flex", gap: 4, width: "100%", justifyContent: "center" }}>
          <Button variant="secondary-neutral" size="xl" onClick={onCancel} className="flex-1">
            {cancelLabel}
          </Button>
          <Button variant="secondary-neutral" size="xl" onClick={onConfirm} className="flex-1">
            {confirmLabel}
          </Button>
        </div>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "share") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          width: 366,
          height: "auto",
          borderRadius: 32,
          flexDirection: "column",
          justifyContent: "center",
          padding: 12,
          gap: 32,
          overflow: "clip",
        }}
      >
        {/* Title + Subject bubble */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 12 }}>
          <p
            style={{
              width: "100%",
              textAlign: "center",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.56,
              color: "var(--color-light-space)",
              textShadow,
              margin: 0,
            }}
          >
            Share
          </p>
          <div
            style={{
              height: 32,
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 40,
              background: "var(--color-light-glass-5)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                lineHeight: 1.4,
                color: "var(--color-light-space)",
                textShadow: "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px white",
              }}
            >
              {shareSubject}
            </span>
          </div>
        </div>
        {/* Button row */}
        <div style={{ display: "flex", gap: 4, width: "100%" }}>
          <Button variant="secondary-neutral" size="xl" onClick={onCancel} className="flex-1">
            {cancelLabel}
          </Button>
          <Button variant="default" size="xl" onClick={onCopyLink} className="flex-1">
            {copyLinkLabel}
          </Button>
        </div>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "messages") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          padding: 4,
          justifyContent: "space-between",
        }}
      >
        <IconOnlyButton size="small" icon={<Search01Icon size={20} />} />
        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--color-light-space)",
            textShadow,
          }}
        >
          Messages
        </span>
        <ActionCircleButton count={messageCount} energy="green" active />
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "swipe-action") {
    const maxDrag = 242 - 4 - 42 - 4;
    const x = useMotionValue(0);
    const textOpacity = useTransform(x, [0, -maxDrag], [1, 0]);

    const handleDragEnd = (_: unknown, info: PanInfo) => {
      if (info.offset.x < -(maxDrag * 0.5)) {
        animate(x, -maxDrag, { type: "spring", stiffness: 300, damping: 30 });
        onSwipeConfirm?.();
      } else {
        animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
      }
    };

    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          overflow: "clip",
          justifyContent: "space-between",
          paddingLeft: 18,
          paddingRight: 4,
          paddingBlock: 4,
        }}
      >
        <motion.span
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--color-light-space)",
            textShadow,
            whiteSpace: "nowrap",
            opacity: textOpacity,
          }}
        >
          {actionText}
        </motion.span>
        <motion.div
          drag="x"
          dragElastic={0.1}
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragMomentum={false}
          style={{ x, flexShrink: 0, cursor: "grab" }}
          whileDrag={{ cursor: "grabbing" }}
          onDragEnd={handleDragEnd}
        >
          <ActionCircleButton
            icon={actionIcon}
            energy={actionEnergy as "red" | "green" | "purple" | "orange" | undefined}
            active
            gradient={actionGradient}
            onClick={onSwipeConfirm}
          />
        </motion.div>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "join-bubble") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          overflow: "clip",
          justifyContent: "space-between",
          paddingLeft: 12,
          paddingRight: 4,
          paddingBlock: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", paddingRight: 16 }}>
            {avatars?.map((avatar, i) => (
              <img
                key={i}
                src={avatar.src}
                alt=""
                style={{
                  width: 20,
                  height: 27,
                  borderRadius: 999,
                  border: `2px solid ${avatar.borderColor}`,
                  objectFit: "cover",
                  flexShrink: 0,
                  marginLeft: i > 0 ? -10 : 0,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.4,
              color: "var(--color-light-space)",
              textShadow,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {contactName}
          </span>
        </div>
        <ActionCircleButton icon={<Call02Icon size={20} />} energy="green" active onClick={onJoinCall} />
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "settings") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          width: 366,
          height: "auto",
          borderRadius: 32,
          flexDirection: "column",
          padding: 12,
          gap: 12,
          overflow: "clip",
        }}
      >
        {/* Title */}
        <span
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 1.56,
            color: "var(--color-light-space)",
            textShadow,
            textAlign: "center",
            width: "100%",
          }}
        >
          {settingsTitle}
        </span>
        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          {settingsSections?.map((section, sIdx) => (
            <div
              key={sIdx}
              style={{
                background: "var(--color-light-glass-5)",
                border: "1.5px solid var(--color-light-glass-5)",
                borderRadius: 32,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                overflow: "clip",
              }}
            >
              <span
                style={{
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.56,
                  color: "var(--color-light-space)",
                  textShadow,
                  width: "100%",
                }}
              >
                {section.title}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
                {section.devices.map((device, dIdx) => (
                  <div
                    key={dIdx}
                    style={{
                      height: 40,
                      background: "var(--color-dark-glass-40)",
                      border: "2px solid var(--color-light-glass-20)",
                      borderRadius: 999,
                      paddingLeft: 12,
                      paddingRight: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily: "Satoshi, sans-serif",
                        fontWeight: 400,
                        fontSize: 16,
                        lineHeight: 1.4,
                        minWidth: 0,
                        overflow: "hidden",
                      }}
                    >
                      <span style={{ color: "var(--color-light-space)", whiteSpace: "nowrap" }}>
                        {device.name}
                      </span>
                      <span style={{ color: "var(--color-light-glass-40)", whiteSpace: "nowrap" }}>
                        ({device.id})
                      </span>
                    </div>
                    <Switch
                      checked={device.enabled}
                      onCheckedChange={(checked) => onDeviceToggle?.(sIdx, dIdx, checked)}
                      className="scale-[0.8] origin-right"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button variant="secondary-neutral" size="xl" onClick={onClose}>
            Close
          </Button>
        </div>
        {/* Inner shadow overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 32,
            boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  if (variant === "soundboard") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          width: 366,
          height: "auto",
          borderRadius: 32,
          flexDirection: "column",
          padding: 12,
          gap: 12,
          overflow: "clip",
        }}
      >
        <span
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--color-light-space)",
            textShadow,
            textAlign: "center",
            width: "100%",
          }}
        >
          Soundboard
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, width: "100%" }}>
          {soundboardItems.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={item.onPlay}
              style={{
                background: "var(--color-light-glass-5)",
                border: "1.5px solid var(--color-light-glass-5)",
                borderRadius: 16,
                overflow: "clip",
                paddingTop: 16,
                paddingBottom: 4,
                paddingLeft: 4,
                paddingRight: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                cursor: "pointer",
                position: "relative",
              }}
            >
              <span style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 700, fontSize: 28, lineHeight: 1.4 }}>
                {item.emoji}
              </span>
              <span
                style={{
                  height: 24,
                  width: "100%",
                  paddingLeft: 12,
                  paddingRight: 12,
                  borderRadius: 999,
                  background: "var(--color-light-glass-5)",
                  border: "2px solid var(--color-light-glass-20)",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--color-light-space)",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  boxShadow: "inset 0px 2px 2px rgba(255,255,255,0.15)",
                  pointerEvents: "none",
                }}
              />
            </button>
          ))}
        </div>
        <Button variant="secondary-neutral" size="xl" onClick={onCancel} className="w-full">
          Cancel
        </Button>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 32,
            boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  if (variant === "expanded-join-call") {
    return (
      <>
      <style>{`
        @keyframes island-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className={className}
        style={{
          ...glassPillStyle,
          width: 366,
          height: "auto",
          borderRadius: 32,
          flexDirection: "column",
          padding: 12,
          gap: 12,
          overflow: "clip",
        }}
      >
        {/* Top section */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", minHeight: 70 }}>
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <Soundwave animate color="spirit" />
          </div>
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            <IconOnlyButton size="small" icon={<Share01Icon size={20} strokeWidth={1.8} />} onClick={onShare} />
          </div>
          {/* Avatar cluster with dashed speaking ring on center */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {avatars?.slice(0, 5).map((avatar, i) => {
              const avatarSizes = [
                { w: 20, h: 27 },
                { w: 40, h: 54 },
                { w: 47, h: 64 },
                { w: 40, h: 54 },
                { w: 20, h: 27 },
              ];
              const size = avatarSizes[i] ?? avatarSizes[0];
              const isCenter = i === 2;
              return (
                <div key={i} style={{ position: "relative", marginLeft: i > 0 ? -8 : 0, zIndex: isCenter ? 3 : i === 1 || i === 3 ? 2 : 1, flexShrink: 0 }}>
                  {isCenter ? (
                    <div style={{ position: "relative", padding: 3 }}>
                      <img
                        src={avatar.src}
                        alt=""
                        style={{
                          width: size.w,
                          height: size.h,
                          borderRadius: 999,
                          border: `2px solid ${avatar.borderColor}`,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <MarchingAntsBorder width={size.w + 6} height={size.h + 6} color={avatar.borderColor} />
                    </div>
                  ) : (
                    <img
                      src={avatar.src}
                      alt=""
                      style={{
                        width: size.w,
                        height: size.h,
                        borderRadius: 999,
                        border: `2px solid ${avatar.borderColor}`,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* Text section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--color-light-space)",
              textShadow,
              textAlign: "center",
            }}
          >
            {contactName}
          </span>
          {callMessage && (
            <div
              className="group"
              style={{
                height: 32,
                borderRadius: 40,
                background: "var(--color-light-glass-5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                maxWidth: "100%",
                maskImage:
                  "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
              }}
            >
              <div
                className="group-hover:[animation-play-state:paused]"
                style={{
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  gap: 48,
                  paddingLeft: 16,
                  paddingRight: 16,
                  animation: "island-marquee 8s linear infinite",
                }}
              >
                <span
                  style={{
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    lineHeight: 1.4,
                    color: "var(--color-light-space)",
                    textShadow:
                      "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px white",
                    flexShrink: 0,
                  }}
                >
                  {callMessage}
                </span>
                <span
                  aria-hidden
                  style={{
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    lineHeight: 1.4,
                    color: "var(--color-light-space)",
                    textShadow:
                      "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px white",
                    flexShrink: 0,
                  }}
                >
                  {callMessage}
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--color-text-secondary)",
            }}
          >
            {memberCount}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ActionCircleButton icon={<CallEnd01Icon size={20} />} energy="red" active onClick={onHangUp} />
            <ActionCircleButton icon={<Call02Icon size={20} />} energy="green" active onClick={onJoinCall} />
          </div>
        </div>
        {/* Inner shadow overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
      </>
    );
  }

  if (variant === "expanded-exit-call") {
    const avatarSizes = [
      { w: 20, h: 27 },
      { w: 40, h: 54 },
      { w: 47, h: 64 },
      { w: 40, h: 54 },
      { w: 20, h: 27 },
    ];
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          width: 366,
          height: "auto",
          borderRadius: 32,
          flexDirection: "column",
          padding: 12,
          gap: 12,
          overflow: "clip",
        }}
      >
        {/* Top section */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", minHeight: 70 }}>
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <Soundwave animate color="spirit" />
          </div>
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            <IconOnlyButton size="small" icon={<Share01Icon size={20} strokeWidth={1.8} />} onClick={onShare} />
          </div>
          {/* Avatar cluster with dashed speaking ring on center */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {avatars?.slice(0, 5).map((avatar, i) => {
              const size = avatarSizes[i] ?? avatarSizes[0];
              const isCenter = i === 2;
              return (
                <div key={i} style={{ position: "relative", marginLeft: i > 0 ? -8 : 0, zIndex: isCenter ? 3 : i === 1 || i === 3 ? 2 : 1, flexShrink: 0 }}>
                  {isCenter ? (
                    <div style={{ position: "relative", padding: 3 }}>
                      <img
                        src={avatar.src}
                        alt=""
                        style={{
                          width: size.w,
                          height: size.h,
                          borderRadius: 999,
                          border: `2px solid ${avatar.borderColor}`,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <MarchingAntsBorder width={size.w + 6} height={size.h + 6} color={avatar.borderColor} />
                    </div>
                  ) : (
                    <img
                      src={avatar.src}
                      alt=""
                      style={{
                        width: size.w,
                        height: size.h,
                        borderRadius: 999,
                        border: `2px solid ${avatar.borderColor}`,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* Text section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--color-light-space)",
              textShadow,
              textAlign: "center",
            }}
          >
            {contactName}
          </span>
          {callMessage && (
            <div
              style={{
                height: 32,
                paddingLeft: 16,
                paddingRight: 16,
                borderRadius: 40,
                background: "var(--color-dark-glass-20)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 2,
                paddingBottom: 2,
              }}
            >
              <span
                style={{
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: 1.4,
                  color: "var(--color-light-space)",
                  textShadow: "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px white",
                }}
              >
                {callMessage}
              </span>
            </div>
          )}
        </div>
        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <IconOnlyButton size="small" icon={<ArrowExpandDiagonal01Icon size={20} />} onClick={onExpand} />
            <IconOnlyButton size="small" icon={<SparklesIcon size={20} />} onClick={onReact} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <IconOnlyButton size="small" icon={<Settings02Icon size={20} />} onClick={onSettings} />
            <IconOnlyButton size="small" icon={isMuted ? <MicOff02Icon size={20} /> : <Mic01Icon size={20} />} onClick={onMicToggle} />
            <IconOnlyButton size="small" icon={isCameraOff ? <VideoOffIcon size={20} /> : <Video01Icon size={20} />} onClick={onVideoToggle} />
            <IconOnlyButton size="small" icon={<ComputerVideoIcon size={20} />} onClick={onScreenShare} />
            <ActionCircleButton icon={<CallEnd01Icon size={20} style={{ transform: "rotate(180deg)" }} />} energy="red" active onClick={onHangUp} />
          </div>
        </div>
        {/* Inner shadow overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "fullscreen-exit-call") {
    const displayTotal = totalParticipants ?? participants.length;
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          width: "100%",
          height: "100%",
          borderRadius: 32,
          flexDirection: "column",
          padding: 16,
          gap: 12,
          overflow: "clip",
          position: "relative",
        }}
      >
        {/* Header bar — hidden when subpage is active */}
        {activePanel === null && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Soundwave animate color="spirit" />
            <span
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--color-light-space)",
                textShadow,
              }}
            >
              {contactName}
            </span>
            {callMessage && (
              <span
                style={{
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                }}
              >
                {callMessage}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Participant count pill — toggles list */}
            <button
              type="button"
              onClick={() => {
                setParticipantsListOpen((v) => !v);
                onParticipantsList?.();
              }}
              style={{
                height: 36,
                paddingLeft: 12,
                paddingRight: 14,
                borderRadius: 999,
                background: participantsListOpen ? "var(--color-light-glass-20)" : "var(--color-light-glass-5)",
                border: "2px solid var(--color-light-glass-20)",
                backdropFilter: "blur(25px)",
                WebkitBackdropFilter: "blur(25px)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                color: "var(--color-light-space)",
              }}
            >
              <UserGroupIcon size={16} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }}>{displayTotal}</span>
            </button>
            <IconOnlyButton size="small" icon={<Share01Icon size={20} strokeWidth={1.8} />} onClick={onShare} />
          </div>
        </div>}

        {/* Scrollable bento grid of participants */}
        {activePanel === null && !participantsListOpen && <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gridAutoRows: "minmax(140px, 1fr)",
            gap: 8,
            width: "100%",
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            padding: 4,
          }}
        >
          {participants.map((p, i) => {
            const originHexes = p.originColor ? getOriginHexes(p.originColor) : undefined;
            const speakingGradient = originHexes
              ? `linear-gradient(135deg, ${originHexes["1"]} 0%, ${originHexes["2"]} 100%)`
              : undefined;
            const glowColor = originHexes ? originHexes["1"] : undefined;
            return (
            <div
              key={i}
              style={{
                position: "relative",
                minHeight: 0,
                zIndex: p.isSpeaking ? 0 : 1,
              }}
            >
              {/* Glow layer — sits behind the card, clipped by neighboring cards' z-index */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  boxShadow: p.isSpeaking && glowColor
                    ? `0 0 24px 6px ${glowColor}50, 0 0 48px 12px ${glowColor}30`
                    : "0 0 0 0 transparent",
                  transition: "box-shadow 0.5s ease-in-out",
                  pointerEvents: "none",
                }}
              />
              {/* Card */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: p.isSpeaking && speakingGradient
                    ? speakingGradient
                    : "var(--color-light-glass-5)",
                  borderRadius: 16,
                  padding: 2,
                  transition: "background 0.4s ease-in-out",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: p.isSpeaking
                      ? "rgba(20, 20, 22, 0.95)"
                      : "var(--color-light-glass-5)",
                    borderRadius: 14,
                    overflow: "clip",
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 6,
                    position: "relative",
                  }}
                >
              {/* Preview area */}
              <div
                style={{
                  flex: "1 0 0",
                  width: "100%",
                  minHeight: 0,
                  borderRadius: 12,
                  background: p.isCameraOn && p.thumbnail
                    ? `url(${p.thumbnail}) center/cover no-repeat`
                    : "var(--color-dark-space)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!p.isCameraOn && (
                  <Avatar src={p.avatar} size="medium" borderStyle="none" />
                )}
              </div>
              {/* Bottom row: name pill + raised hand */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, width: "100%" }}>
                {/* Name label pill */}
                <span
                  style={{
                    flex: 1,
                    height: 28,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 999,
                    background: "var(--color-light-glass-5)",
                    border: "2px solid var(--color-light-glass-20)",
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  color: "var(--color-light-space)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.name}
                </span>
                {/* Raised hand pill */}
                {p.handRaised != null && (
                  <span
                    style={{
                      height: 28,
                      minWidth: 28,
                      paddingLeft: 8,
                      paddingRight: 8,
                      borderRadius: 999,
                      background: "var(--color-orange-2)",
                      border: "2px solid var(--color-orange-4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    <WavingHand01Icon size={14} style={{ color: "var(--color-orange-5)" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--color-orange-5)" }}>{p.handRaised}</span>
                  </span>
                )}
              </div>
              {/* Rim light */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 14,
                  boxShadow: "inset 0px 2px 2px rgba(255,255,255,0.08)",
                  pointerEvents: "none",
                }}
              />
              </div>
            </div>
          </div>
          );
          })}
        </div>}

        {/* Participants list panel — contact card style */}
        {activePanel === null && participantsListOpen && (
          <div
            style={{
              flex: 1,
              width: "100%",
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {participants.map((p, i) => (
              <ContactItem
                key={i}
                className="w-full"
                name={p.name}
                avatarSrc={p.avatar}
                originColor={p.originColor}
                onCall={() => onConnectParticipant?.(i)}
              />
            ))}
          </div>
        )}

        {/* ── Subpage: Soundboard ── */}
        {activePanel === "soundboard" && (<>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--color-light-space)",
              textShadow,
              textAlign: "center",
              width: "100%",
              flexShrink: 0,
            }}
          >
            Soundboard
          </span>
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: `repeat(3, 1fr)`,
              gridTemplateRows: `repeat(${Math.ceil(soundboardItems.length / 3)}, 1fr)`,
              gap: 8,
              width: "100%",
              minHeight: 0,
            }}
          >
            {soundboardItems.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={item.onPlay}
                className="transition-[filter] duration-150 hover:brightness-125"
                style={{
                  background: "var(--color-light-glass-5)",
                  border: "1.5px solid var(--color-light-glass-5)",
                  borderRadius: 16,
                  overflow: "clip",
                  padding: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  position: "relative",
                  minHeight: 0,
                }}
              >
                <span style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 700, fontSize: 36, lineHeight: 1.4, flex: 1, display: "flex", alignItems: "center" }}>
                  {item.emoji}
                </span>
                <span
                  style={{
                    height: 28,
                    width: "100%",
                    paddingLeft: 12,
                    paddingRight: 12,
                    borderRadius: 999,
                    background: "var(--color-light-glass-5)",
                    border: "2px solid var(--color-light-glass-20)",
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--color-light-space)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {item.label}
                </span>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 16,
                    boxShadow: "inset 0px 2px 2px rgba(255,255,255,0.15)",
                    pointerEvents: "none",
                  }}
                />
              </button>
            ))}
          </div>
          <Button variant="secondary-neutral" size="xl" onClick={() => setActivePanel(null)} className="w-full">
            Cancel
          </Button>
        </>)}

        {/* ── Subpage: Settings ── */}
        {activePanel === "settings" && (<>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--color-light-space)",
              textShadow,
              textAlign: "center",
              width: "100%",
              flexShrink: 0,
            }}
          >
            {settingsTitle}
          </span>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {settingsSections?.map((section, sIdx) => (
              <React.Fragment key={sIdx}>
                <span
                  style={{
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    lineHeight: 1.56,
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    width: "100%",
                    marginTop: sIdx > 0 ? 8 : 0,
                  }}
                >
                  {section.title}
                </span>
                {section.devices.map((device, dIdx) => (
                  <div
                    key={dIdx}
                    style={{
                      height: 48,
                      background: "var(--color-light-glass-5)",
                      border: "2px solid var(--color-light-glass-20)",
                      borderRadius: 999,
                      paddingLeft: 16,
                      paddingRight: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily: "Satoshi, sans-serif",
                        fontWeight: 500,
                        fontSize: 15,
                        lineHeight: 1.4,
                        minWidth: 0,
                        overflow: "hidden",
                      }}
                    >
                      <span style={{ color: "var(--color-light-space)", whiteSpace: "nowrap" }}>
                        {device.name}
                      </span>
                      <span style={{ color: "var(--color-light-glass-40)", whiteSpace: "nowrap" }}>
                        ({device.id})
                      </span>
                    </div>
                    <Switch
                      checked={device.enabled}
                      onCheckedChange={(checked) => onDeviceToggle?.(sIdx, dIdx, checked)}
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <Button variant="secondary-neutral" size="xl" onClick={() => setActivePanel(null)} className="w-full">
            Cancel
          </Button>
        </>)}

        {/* ── Subpage: Emoji Drawer ── */}
        {activePanel === "emoji" && (() => {
          const SKIN_TONES = [
            { label: "Default", modifier: "", color: "#FFCC4D" },
            { label: "Light", modifier: "🏻", color: "#FADCBC" },
            { label: "Medium-Light", modifier: "🏼", color: "#E0BB95" },
            { label: "Medium", modifier: "🏽", color: "#BF8F68" },
            { label: "Medium-Dark", modifier: "🏾", color: "#9B643D" },
            { label: "Dark", modifier: "🏿", color: "#594539" },
          ];
          const EMOJI_CATEGORIES = [
            { name: "Smileys", emojis: ["😀","😂","🤣","😊","😇","🥰","😍","🤩","😘","😋","🤪","😜","😎","🤓","🧐","🤗","🤭","🤫","🤔","😐","🙄","😏","😴","🤤","😷","🤒","🤕","🤑","🤠","😈","👿","👹","💀","👻","👽","🤖","💩","🫠","🥹","🫡","🫢","🫣","🫤","🥴","🤯","🥸","🥳"] },
            { name: "Gestures", emojis: ["👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🙏","💪","🦾"] },
            { name: "Hearts", emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","❤️‍🔥","❤️‍🩹","♥️","🩷","🩵","🩶"] },
            { name: "Animals", emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞"] },
            { name: "Food", emojis: ["🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🌮","🍕","🍔","🍟","🌭","🍿","🧁","🍩","🍪","🎂","🍰","🧇","🥞","☕","🍵","🧋","🍺","🍷","🥂","🍾"] },
            { name: "Activities", emojis: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🎯","🏆","🥇","🥈","🥉","🎮","🎲","🎪","🎨","🎭","🎵","🎶","🎤","🎸","🥁","🎹","🎷","🎺","🪘"] },
            { name: "Objects", emojis: ["💡","🔦","🕯️","💎","💰","💳","✉️","📦","🔑","🗝️","🔒","🔓","❤️","🛡️","🔮","🧿","🪬","📱","💻","⌨️","🖥️","🖨️","📷","📸","🎥","📽️","🎬","📺","📻","🔔","🔕"] },
            { name: "Symbols", emojis: ["✅","❌","⭕","🚫","💯","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪","🟤","💢","💥","💫","💦","🔥","⭐","🌟","✨","⚡","🌈","☀️","🌙","💤","🎵","🎶","➕","➖","✖️","➗","♾️","❓","❗","💬","👁️‍🗨️"] },
          ];
          const currentSkinTone = SKIN_TONES[selectedSkinTone];
          const filteredCategories = emojiSearch
            ? EMOJI_CATEGORIES.map(cat => ({
                ...cat,
                emojis: cat.emojis.filter(e => e.includes(emojiSearch)),
              })).filter(cat => cat.emojis.length > 0)
            : EMOJI_CATEGORIES;

          const handleEmojiClick = (emoji: string) => {
            // Add to recents
            setRecentEmojis(prev => {
              const filtered = prev.filter(e => e !== emoji);
              return [emoji, ...filtered].slice(0, 8);
            });
            // Spawn floating emoji
            const id = Date.now() + Math.random();
            const x = 20 + Math.random() * 60; // 20-80% horizontal
            setFloatingEmojis(prev => [...prev, { id, emoji, x }]);
            setTimeout(() => {
              setFloatingEmojis(prev => prev.filter(e => e.id !== id));
            }, 2000);
            onReact?.();
          };

          return (<>
          {/* Search bar */}
          <div
            style={{
              width: "100%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 40,
                borderRadius: 999,
                background: "var(--color-light-glass-5)",
                border: "2px solid var(--color-light-glass-20)",
                display: "flex",
                alignItems: "center",
                paddingLeft: 14,
                paddingRight: 14,
                gap: 8,
              }}
            >
              <Search01Icon size={16} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search emoji..."
                value={emojiSearch}
                onChange={(e) => setEmojiSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--color-light-space)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </div>
            {/* Skin tone selector */}
            <button
              type="button"
              onClick={() => setSelectedSkinTone((v) => (v + 1) % SKIN_TONES.length)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                background: currentSkinTone.color,
                border: "2px solid var(--color-light-glass-20)",
                cursor: "pointer",
                flexShrink: 0,
              }}
              title={`Skin tone: ${currentSkinTone.label}`}
            />
            {/* Plus button — browse full library */}
            <IconOnlyButton
              size="small"
              icon={<Add01Icon size={20} />}
              onClick={() => {/* future: open full emoji library */}}
            />
          </div>

          {/* Recent emojis row */}
          <div
            style={{
              width: "100%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginRight: 4,
                flexShrink: 0,
              }}
            >
              Recent
            </span>
            {recentEmojis.map((emoji, i) => (
              <motion.button
                key={`recent-${emoji}-${i}`}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--color-light-glass-5)",
                  border: "1.5px solid var(--color-light-glass-10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
              >
                {emoji}
              </motion.button>
            ))}
          </div>

          {/* Emoji grid — scrollable */}
          <div
            style={{
              flex: 1,
              width: "100%",
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {filteredCategories.map((cat) => (
              <div key={cat.name}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {cat.name}
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
                    gap: 4,
                  }}
                >
                  {cat.emojis.map((emoji, j) => (
                    <motion.button
                      key={`${cat.name}-${j}`}
                      type="button"
                      onClick={() => handleEmojiClick(emoji)}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        borderRadius: 10,
                        background: "transparent",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        cursor: "pointer",
                      }}
                      whileHover={{ scale: 1.25, background: "var(--color-light-glass-10)" }}
                      whileTap={{ scale: 0.8 }}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", fontSize: 14, paddingTop: 24 }}>
                No emojis found
              </div>
            )}
          </div>

          {/* Cancel button */}
          <Button variant="secondary-neutral" size="xl" onClick={() => { setActivePanel(null); setEmojiSearch(""); }} className="w-full">
            Cancel
          </Button>
        </>);
        })()}

        {/* Floating emoji rain overlay */}
        {floatingEmojis.length > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              overflow: "clip",
              borderRadius: "inherit",
              zIndex: 50,
            }}
          >
            {floatingEmojis.map((fe) => (
              <motion.div
                key={fe.id}
                initial={{ bottom: 60, left: `${fe.x}%`, opacity: 1, scale: 1 }}
                animate={{ bottom: "100%", opacity: 0, scale: 1.4 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  fontSize: 36,
                  pointerEvents: "none",
                  transform: "translateX(-50%)",
                }}
              >
                {fe.emoji}
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Default: Bottom control bar ── */}
        {activePanel === null && <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            flexShrink: 0,
            gap: 6,
          }}
        >
          <IconOnlyButton size="small" icon={<ArrowShrink02Icon size={20} />} onClick={onExpand} />
          <IconOnlyButton size="small" icon={<SmileIcon size={20} />} onClick={() => setActivePanel("emoji")} />
          <IconOnlyButton size="small" icon={<MusicNoteSquare02Icon size={20} />} onClick={() => setActivePanel("soundboard")} />
          <div style={{ width: 16 }} />
          <IconOnlyButton size="small" icon={<Settings02Icon size={20} />} onClick={() => setActivePanel("settings")} />
          <IconOnlyButton size="small" icon={isMuted ? <MicOff02Icon size={20} /> : <Mic01Icon size={20} />} onClick={onMicToggle} />
          <IconOnlyButton size="small" icon={isCameraOff ? <VideoOffIcon size={20} /> : <Video01Icon size={20} />} onClick={onVideoToggle} />
          <IconOnlyButton size="small" icon={<ComputerVideoIcon size={20} />} onClick={onScreenShare} />
          <div style={{ width: 4 }} />
          <ActionCircleButton icon={<CallEnd01Icon size={20} />} energy="red" active onClick={onHangUp} />
        </div>}
      </div>
    );
  }

  if (variant === "expanded-outgoing-call") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          width: 366,
          height: "auto",
          borderRadius: 32,
          flexDirection: "column",
          padding: 12,
          gap: 12,
          overflow: "clip",
        }}
      >
        {/* Top section */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", minHeight: 70 }}>
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <Soundwave animate color="spirit" />
          </div>
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            <IconOnlyButton size="small" icon={<Share01Icon size={20} strokeWidth={1.8} />} onClick={onShare} />
          </div>
          {/* Single avatar */}
          {callerAvatar && (
            <img
              src={callerAvatar}
              alt={callerName ?? ""}
              style={{
                width: 47,
                height: 64,
                borderRadius: 999,
                border: "2px solid #cb0b03",
                objectFit: "cover",
              }}
            />
          )}
        </div>
        {/* Text section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--color-light-space)",
              textShadow,
              textAlign: "center",
            }}
          >
            {callerName}
          </span>
          {callMessage && (
            <div
              style={{
                height: 32,
                paddingLeft: 16,
                paddingRight: 16,
                borderRadius: 40,
                background: "var(--color-dark-glass-20)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: 1.4,
                  color: "var(--color-light-space)",
                  textShadow: "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px white",
                }}
              >
                {callMessage}
              </span>
            </div>
          )}
        </div>
        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%", gap: 12 }}>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Calling {callerName}...
          </span>
          <ActionCircleButton icon={<CallEnd01Icon size={20} />} energy="red" active onClick={onHangUp} />
        </div>
        {/* Inner shadow overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)" }}
        />
      </div>
    );
  }

  if (variant === "select-screen") {
    return (
      <div
        className={className}
        style={{
          ...glassPillStyle,
          width: 366,
          height: "auto",
          borderRadius: 32,
          flexDirection: "column",
          padding: 12,
          gap: 12,
          overflow: "clip",
        }}
      >
        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <p
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.56,
              color: "var(--color-light-space)",
              textShadow,
              textAlign: "center",
              width: "100%",
              margin: 0,
            }}
          >
            Select Screen
          </p>
        </div>
        {/* Screen grid — 2 columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 4,
            width: "100%",
          }}
        >
          {screenItems.map((item, i) => (
            <button
              key={i}
              type="button"
              className="transition-[filter] duration-150 hover:brightness-125"
              onClick={item.onClick}
              style={{
                background: "var(--color-light-glass-5)",
                border: "1.5px solid var(--color-light-glass-5)",
                borderRadius: 16,
                overflow: "clip",
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 12,
                height: 156,
                cursor: "pointer",
                position: "relative",
              }}
            >
              {/* Screen preview area */}
              <div
                style={{
                  flex: "1 0 0",
                  width: "100%",
                  minHeight: 0,
                  borderRadius: 14,
                  background: item.thumbnail
                    ? `url(${item.thumbnail}) center/cover no-repeat`
                    : "var(--color-dark-space)",
                }}
              />
              {/* Label tag */}
              <span
                style={{
                  height: 24,
                  width: "100%",
                  paddingLeft: 12,
                  paddingRight: 12,
                  borderRadius: 999,
                  background: "var(--color-light-glass-5)",
                  border: "2px solid var(--color-light-glass-20)",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                    color: "var(--color-light-space)",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
              {/* Rim light */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  boxShadow: "inset 0px 2px 2px rgba(255,255,255,0.15)",
                  pointerEvents: "none",
                }}
              />
            </button>
          ))}
        </div>
        {/* Cancel button */}
        <Button variant="secondary-neutral" size="xl" onClick={onCancel} className="w-full">
          Cancel
        </Button>
        {/* Outer inner shadow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 32,
            boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.15)",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  return (
    <div className={className} style={glassPillStyle}>
      <NexusLogo height={12} className="text-[var(--color-light-space)] opacity-30" />
      {variant === "call-bubble" && (
        <IconOnlyButton
          size="small"
          icon={<Call02Icon size={20} />}
          style={{ position: "absolute", right: 4, width: 42, height: 42 }}
        />
      )}
    </div>
  );
}
