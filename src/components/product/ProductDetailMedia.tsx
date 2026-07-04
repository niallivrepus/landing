import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActiveCalls,
  Avatar as GooeyAvatar,
  cn,
  IncomingMessageBubble,
  MessageBubble,
  PromptBar,
  Soundwave,
  useTheme,
} from "@jokuh/gooey";
import { Captions, Mic, PhoneOff, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ProductDetailMedia as ProductDetailMediaConfig } from "../../data/product-detail-blueprints";
import { ProfileHighlightVisual } from "../landing/ProfileHighlightVisual";

const BLURB_SEQUENCE_EASE = [0.22, 1, 0.36, 1] as const;
const BLURB_IMAGE_INTERVAL_MS = 2300;
const BLURB_IMAGE_SEQUENCE_STORAGE_KEY = "jokuh.blurbs.imageCarousel.startedAt";
const BLURB_IMAGE_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.86,
} as const;
const BLURB_IMAGE_FALLBACK_REST_TOP = "50%";
const BLURB_IMAGE_FALLBACK_ENTER_TOP = "150%";
const BLURB_IMAGE_FALLBACK_EXIT_TOP = "-50%";
const BLURB_SEQUENCE_FALLBACKS = [
  "Fresh note from the conversation",
  "Clean quote with context",
  "Draft ready to shape",
  "Saved before the call ends",
];
const ALIEN_AVATAR_COUNT = 152;
const ALIEN_AVATAR_SOURCES = Array.from(
  { length: ALIEN_AVATAR_COUNT },
  (_, index) => `/aliens/alien-${String(index + 1).padStart(4, "0")}.jpg`,
);
let blurbImageSequenceStartedAt: number | null = null;

export function ProductDetailMedia({
  media,
  active = false,
  className,
}: {
  media: ProductDetailMediaConfig;
  active?: boolean;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();

  if (media.kind === "image") {
    return (
      <img
        src={media.src}
        alt={media.alt}
        className={cn("size-full object-cover", className)}
        style={{
          ...(media.objectPosition ? { objectPosition: media.objectPosition } : {}),
          transform: media.flipX ? "scaleX(-1)" : undefined,
        }}
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (media.kind === "themeImage") {
    return (
      <div className={cn("relative size-full bg-[#FBFBFC] dark:bg-[#1C1C1E]", className)}>
        <div className="relative z-[1] flex size-full items-center justify-center px-3 md:absolute md:inset-y-0 md:left-[20rem] md:right-0 md:w-auto md:px-8">
          <img
            src={resolvedTheme === "dark" ? media.darkSrc : media.lightSrc}
            alt={media.alt}
            className="h-auto max-h-[82%] w-auto max-w-[min(24rem,calc(100%-1.5rem))] object-contain drop-shadow-[0_22px_60px_rgba(15,23,42,0.14)] dark:drop-shadow-[0_22px_60px_rgba(0,0,0,0.44)]"
            style={media.objectPosition ? { objectPosition: media.objectPosition } : undefined}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    );
  }

  if (media.kind === "video") {
    return (
      <LazyProductVideo
        src={media.src}
        poster={media.poster}
        alt={media.alt}
        active={active}
        className={className}
      />
    );
  }

  if (media.kind === "blurbSequence") {
    return (
      <div
        className={cn(
          "relative size-full overflow-hidden bg-[#FBFBFC] dark:bg-[#232326]",
          className,
        )}
      >
        <img
          src="/blurbs/background.png"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-70"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.82),rgba(251,251,252,0)_58%)] dark:bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),rgba(35,35,38,0)_58%)]" />
        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-10">
          <div className="flex w-full max-w-[30rem] flex-col gap-3 md:gap-4">
            {media.items.map((item, index) => (
              <BlurbSequenceImage
                key={`${item.lightSrc}-${item.darkSrc}`}
                item={item}
                index={index}
                dark={resolvedTheme === "dark"}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (media.kind === "blurbTravelFlow") {
    return <BlurbTravelFlow className={className} />;
  }

  if (media.kind === "blurbCallScene") {
    return <BlurbCallScene media={media} active={active} className={className} />;
  }

  if (media.kind === "blurbImageCarousel") {
    return (
      <BlurbImageCarousel
        items={media.items}
        dark={resolvedTheme === "dark"}
        className={className}
      />
    );
  }

  if (media.kind === "blurbPublishButton") {
    return <BlurbPublishButton active={active} className={className} />;
  }

  if (media.kind === "promptBar") {
    return <ProductPromptBarScene media={media} active={active} className={className} />;
  }

  if (media.kind === "profileHighlight") {
    return (
      <ProfileHighlightVisual variant={media.variant} active={active} className={className} />
    );
  }

  if (media.kind === "gradient") {
    if (media.gradient === "none" || !media.gradient.trim()) {
      return null;
    }
    const background = resolvedTheme === "dark" ? "#232326" : "#FBFBFC";
    return (
      <div
        className={cn("size-full", className)}
        style={{ background }}
        aria-hidden
      />
    );
  }

  return null;
}

function ProductPromptBarScene({
  media,
  active,
  className,
}: {
  media: Extract<ProductDetailMediaConfig, { kind: "promptBar" }>;
  active: boolean;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);
  const [typedValue, setTypedValue] = useState("");
  const [visibleMessageCount, setVisibleMessageCount] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    setActiveTurnIndex(0);
    setTypedValue("");
    setVisibleMessageCount(0);

    if (!active || !media.turns.length) {
      return;
    }

    if (shouldReduceMotion) {
      setActiveTurnIndex(media.turns.length - 1);
      setTypedValue(media.turns.at(-1)?.prompt ?? "");
      setVisibleMessageCount(media.turns.length * 2);
      return;
    }

    const startCycle = (turnIndex = 0) => {
      const turn = media.turns[turnIndex] ?? media.turns[0];
      if (!turn) return;

      setActiveTurnIndex(turnIndex);
      setTypedValue("");

      let characterIndex = 0;
      const typeNextCharacter = () => {
        characterIndex += 1;
        setTypedValue(turn.prompt.slice(0, characterIndex));

        if (characterIndex < turn.prompt.length) {
          timers.push(window.setTimeout(typeNextCharacter, 68));
          return;
        }

        timers.push(window.setTimeout(() => {
          setVisibleMessageCount((current) => Math.max(current, turnIndex * 2 + 1));
        }, 360));

        timers.push(window.setTimeout(() => {
          setVisibleMessageCount((current) => Math.max(current, turnIndex * 2 + 2));
        }, 520));

        if (turnIndex < media.turns.length - 1) {
          timers.push(window.setTimeout(() => startCycle(turnIndex + 1), 2200));
          return;
        }

        timers.push(window.setTimeout(() => startCycle(0), 5200));
      };

      timers.push(window.setTimeout(typeNextCharacter, 460));
    };

    startCycle();

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [active, media.turns, shouldReduceMotion]);

  const visibleTurns = media.turns.flatMap((turn, index) => [
    { id: `${index}-user`, kind: "user" as const, text: turn.prompt, index: index * 2 },
    { id: `${index}-oo`, kind: "oo" as const, text: turn.response, index: index * 2 + 1 },
  ]).filter((message) => message.index < visibleMessageCount && message.index >= visibleMessageCount - 2);

  return (
    <div
      className={cn(
        "product-prompt-bar-scene relative flex size-full items-center justify-center overflow-hidden bg-[#FBFBFC] px-6 dark:bg-[#1C1C1E] md:px-12",
        className,
      )}
    >
      <div className="absolute inset-0 z-[1]">
        <AnimatePresence initial={false}>
          {visibleTurns.length ? (
            <motion.div
              key="prompt-transcript"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 22, scale: 0.96 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 380, damping: 28, mass: 0.9 }
              }
              className="absolute inset-x-6 bottom-[88px] mx-auto flex w-full max-w-[30rem] flex-col gap-3 md:inset-x-12"
            >
              {visibleTurns.map((message) => (
                <motion.div
                  key={message.id}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.97 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.98 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                  className={cn(
                    "flex w-full items-start gap-3",
                    message.kind === "user" && "justify-end",
                  )}
                >
                  {message.kind === "oo" ? (
                    <GooeyAvatar
                      showOO
                      ooExpression="default"
                      size="small"
                      borderStyle="origins"
                      originColor="life"
                      disableNavigation
                      className="mt-1 shrink-0"
                    />
                  ) : null}
                  {message.kind === "user" ? (
                    <MessageBubble
                      name="You"
                      message={message.text}
                      color="aether"
                      className="max-w-[82%]"
                    />
                  ) : (
                    <IncomingMessageBubble
                      name="00"
                      message={message.text}
                      className="max-w-none flex-1 !shadow-none"
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div
          animate={shouldReduceMotion ? { y: 0 } : { y: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30 }}
          className="absolute bottom-6 left-1/2 w-full max-w-[450px] -translate-x-1/2"
        >
          <PromptBar
            variant="desktop"
            viewport="desktop"
            className="!w-[450px] !p-1 !shadow-none"
            placeholder="Ask about the call"
            value={typedValue}
            onValueChange={setTypedValue}
            isFocused
            isTyping={typedValue.length > 0}
            onSend={() => setVisibleMessageCount((current) => Math.max(current, activeTurnIndex * 2 + 2))}
          />
        </motion.div>
      </div>
    </div>
  );
}

function LazyProductVideo({
  src,
  poster,
  alt,
  active,
  className,
}: {
  src: string;
  poster?: string;
  alt?: string;
  active: boolean;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!("IntersectionObserver" in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const shouldLoadVideo = active && isNearViewport;

  return (
    <div ref={rootRef} className={cn("relative size-full overflow-hidden bg-black", className)}>
      {poster && !shouldLoadVideo ? (
        <img
          src={poster}
          alt={alt ?? ""}
          className="size-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      {shouldLoadVideo ? (
        <video
          src={src}
          poster={poster}
          aria-label={alt}
          className="size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : null}
    </div>
  );
}

function BlurbPublishButton({ active, className }: { active: boolean; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [pressed, setPressed] = useState(false);
  const iconSrc = pressed
    ? "/blurbs/blurb-icon-active.svg"
    : resolvedTheme === "dark"
      ? "/blurbs/blurb-icon-dark.svg"
      : "/blurbs/blurb-icon-light.svg";

  useEffect(() => {
    if (!active) {
      setPressed(false);
      return;
    }

    const pressTimer = window.setTimeout(() => setPressed(true), 640);
    const resetTimer = window.setTimeout(() => setPressed(false), 3200);
    const replayTimer = window.setInterval(() => {
      setPressed(false);
      window.setTimeout(() => setPressed(true), 360);
    }, 4300);

    return () => {
      window.clearTimeout(pressTimer);
      window.clearTimeout(resetTimer);
      window.clearInterval(replayTimer);
    };
  }, [active]);

  return (
    <div className={cn("relative size-full bg-[#FBFBFC] dark:bg-[#1C1C1E]", className)} aria-hidden>
      <div className="relative z-[1] flex size-full items-center justify-center px-3 md:absolute md:inset-y-0 md:left-[20rem] md:right-0 md:w-auto md:px-8">
        <div className="relative flex size-[min(22rem,calc(100%-1.5rem))] items-center justify-center">
          <AnimatePresence>
            {pressed
              ? Array.from({ length: 11 }).map((_, index) => {
                  const x = (index - 5) * 18;
                  const delay = index * 0.035;
                  return (
                    <motion.span
                      key={`bubble-${index}-${pressed}`}
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 0, y: 0, scale: 0.72 }}
                      animate={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : {
                              opacity: [0, 0.8, 0],
                              x,
                              y: -94 - (index % 3) * 18,
                              scale: [0.72, 1, 0.82],
                            }
                      }
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.25, ease: BLURB_SEQUENCE_EASE, delay }}
                      className="absolute left-1/2 top-1/2 size-3 rounded-full bg-violet-500/70 shadow-[0_0_22px_rgba(139,92,246,0.72)]"
                    />
                  );
                })
              : null}
          </AnimatePresence>

          <motion.button
            type="button"
            initial={false}
            animate={{
              scale: pressed ? 1.06 : 1,
              y: pressed ? -2 : 0,
            }}
            transition={{ type: "spring", stiffness: 360, damping: 22, mass: 0.7 }}
            className={cn(
              "relative inline-flex h-[50px] w-[86.5px] items-center justify-center rounded-full border-2 shadow-[0_18px_48px_rgba(15,23,42,0.12)] backdrop-blur-[20px] transition-colors",
              pressed
                ? "border-white/20 bg-[linear-gradient(77.56deg,#7700ff_0%,#b200ff_100%)] shadow-[0_24px_60px_rgba(124,58,237,0.34)]"
                : "border-black/10 bg-white dark:border-white/20 dark:bg-white/5",
            )}
          >
            <motion.img
              src={iconSrc}
              alt=""
              aria-hidden
              initial={false}
              animate={{
                rotate: pressed ? 360 : 0,
                scale: pressed ? 1.08 : 1,
              }}
              transition={{ duration: pressed ? 0.58 : 0.2, ease: BLURB_SEQUENCE_EASE }}
              className="size-6"
              draggable={false}
            />
          </motion.button>

          <motion.p
            initial={false}
            animate={{
              opacity: pressed ? 1 : 0,
              y: pressed ? 42 : 28,
            }}
            transition={{ duration: 0.34, ease: BLURB_SEQUENCE_EASE }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 whitespace-nowrap font-sans text-[15px] font-semibold text-zinc-950 dark:text-zinc-100"
          >
            Successfully blurbed
          </motion.p>
        </div>
      </div>
    </div>
  );
}

function BlurbTravelFlow({ className }: { className?: string }) {
  const messages = [
    {
      side: "them",
      name: "Maya",
      text: "That line from the call was actually the whole idea.",
      color: "from-amber-300 to-rose-400",
    },
    {
      side: "me",
      name: "Me",
      text: "Turn it into a short blurb before we lose it.",
      color: "from-blue-500 to-indigo-700",
    },
    {
      side: "them",
      name: "Maya",
      text: "Captured. Keeping the casual version and a cleaner one.",
      color: "from-fuchsia-500 to-blue-500",
    },
    {
      side: "me",
      name: "Me",
      text: "Perfect. Save both to the thread.",
      color: "from-blue-500 to-indigo-700",
    },
  ];

  return (
    <div className={cn("relative size-full overflow-hidden bg-[#FBFBFC] dark:bg-[#101827]", className)}>
      <img
        src="/blurbs/background.png"
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover opacity-70 dark:opacity-85"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 dark:bg-black/18" />

      <div className="absolute inset-x-0 bottom-8 mx-auto flex w-[min(31rem,88%)] flex-col gap-3 md:bottom-10">
        {messages.map((message, index) => {
          const isMe = message.side === "me";

          return (
            <motion.div
              key={`${message.name}-${message.text}`}
              initial={{ opacity: 0, x: isMe ? 34 : -34, y: 16 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                duration: 0.64,
                ease: BLURB_SEQUENCE_EASE,
                delay: 0.24 + index * 0.28,
              }}
              className={cn("flex items-end gap-2", isMe && "ml-auto flex-row-reverse")}
            >
              <Avatar color={message.color} label={isMe ? "ME" : "M"} />
              <div
                className={cn(
                  "max-w-[18rem] rounded-[24px] px-4 py-3 shadow-[0_16px_36px_rgba(15,23,42,0.1)] backdrop-blur-xl md:max-w-[21rem]",
                  isMe
                    ? "rounded-br-md bg-[#0A66FF] text-white shadow-[0_16px_38px_rgba(10,102,255,0.24)]"
                    : "rounded-bl-md border border-black/[0.04] bg-white/82 text-zinc-900 dark:border-white/[0.08] dark:bg-white/[0.1] dark:text-zinc-100",
                )}
              >
                <p className="font-sans text-[13px] font-medium leading-relaxed md:text-[14px]">
                  {message.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Avatar({ color, label }: { color: string; label: string }) {
  return (
    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full border-[3px] border-white/30 bg-gradient-to-br font-sans text-[11px] font-bold text-white shadow-[0_6px_18px_rgba(0,0,0,0.25)]", color)}>
      {label}
    </span>
  );
}

function BlurbCallScene({
  media,
  active,
  className,
}: {
  media: Extract<ProductDetailMediaConfig, { kind: "blurbCallScene" }>;
  active: boolean;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [captionIndex, setCaptionIndex] = useState(0);
  const [participants] = useState(() => pickRandomAlienParticipants(media.participants));
  const sceneAnimating = active && !shouldReduceMotion;
  const caption = media.subtitles[captionIndex % media.subtitles.length];

  useEffect(() => {
    if (!active || shouldReduceMotion || media.subtitles.length <= 1) {
      setCaptionIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setCaptionIndex((current) => (current + 1) % media.subtitles.length);
    }, 1700);

    return () => window.clearInterval(timer);
  }, [active, media.subtitles.length, shouldReduceMotion]);

  const panelTrackClassName =
    media.panelPlacement === "closerLookRight"
      ? "relative z-[1] flex size-full items-center justify-center px-3 md:absolute md:inset-y-0 md:left-[20rem] md:right-0 md:w-auto md:px-8"
      : "relative z-[1] flex size-full items-center justify-center px-3";

  return (
    <div className={cn("relative size-full bg-[#0B1220]", className)} aria-hidden>
      <img
        src={media.backgroundImage ?? "/blurbs/background.png"}
        alt=""
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
        decoding="async"
      />

      <div className={panelTrackClassName}>
        <motion.div
          data-blurb-call-panel
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.54, ease: BLURB_SEQUENCE_EASE, delay: 0.08 }
          }
          className="relative flex aspect-[366/223] w-[min(20rem,calc(100%-1.5rem))] flex-col justify-between rounded-[32px] border border-white/[0.16] bg-white/[0.12] p-3 text-white shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:w-[22.875rem]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Soundwave
                animate={sceneAnimating}
                color="spirit"
                className="scale-[0.74] md:scale-90"
              />
              <span className="truncate rounded-full bg-black/20 px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0em] text-white/82 md:text-[11px]">
                {media.callStatus}
              </span>
            </div>
            <ActiveCalls
              participants={participants}
              count={participants.length}
              className="origin-right scale-[1.12]"
            />
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="flex items-center justify-center">
              {participants.map((participant, index) => {
                const isCenter = index === 1;

                return (
                  <div
                    key={`${participant.src}-${participant.alt}`}
                    className={cn(
                      "relative flex shrink-0 items-center justify-center",
                      index > 0 && "-ml-3 md:-ml-4",
                      isCenter ? "z-20" : "z-10",
                    )}
                  >
                    {isCenter ? (
                      <svg
                        className="pointer-events-none absolute -inset-[1.5px] overflow-visible"
                        viewBox="0 0 75 100"
                        preserveAspectRatio="none"
                        aria-hidden
                      >
                        <motion.rect
                          x="3"
                          y="4"
                          width="69"
                          height="92"
                          rx="34.5"
                          ry="34.5"
                          fill="none"
                          stroke="rgb(245 208 254 / 0.92)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray="8 8"
                          vectorEffect="non-scaling-stroke"
                          animate={sceneAnimating ? { strokeDashoffset: [0, -32] } : { strokeDashoffset: 0 }}
                          transition={{
                            duration: 0.9,
                            ease: "linear",
                            repeat: sceneAnimating ? Infinity : 0,
                          }}
                        />
                      </svg>
                    ) : null}
                    <img
                      src={participant.src}
                      alt=""
                      className={cn(
                        "rounded-full border-2 object-cover shadow-[0_12px_28px_rgba(0,0,0,0.32)]",
                        isCenter
                          ? "h-[3.75rem] w-12 border-fuchsia-300 md:h-[4.5rem] md:w-14"
                          : "h-10 w-8 md:h-12 md:w-9",
                        index === 0 && "border-lime-300",
                        index === 2 && "border-sky-300",
                      )}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex h-8 items-center gap-2 rounded-full bg-black/24 px-3 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
            <Captions className="size-3.5 shrink-0 text-white/76" strokeWidth={2.1} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`${captionIndex}-${caption.speaker}-${caption.text}`}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="min-w-0 truncate font-sans text-[11px] font-medium leading-none text-white/90 md:text-[12px]"
              >
                <span className="text-white/58">{caption.speaker}:</span> {caption.text}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <Sparkles className="size-3.5 shrink-0 text-fuchsia-200" strokeWidth={2.1} />
              <p className="truncate font-sans text-[11px] font-semibold text-white/78">
                {media.callTitle}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-white/[0.13] text-white/72">
                <Mic className="size-3.5" strokeWidth={2.1} />
              </span>
              <span className="flex size-7 items-center justify-center rounded-full bg-[#FF4B4B] text-white">
                <PhoneOff className="size-3.5" strokeWidth={2.2} />
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function pickRandomAlienParticipants(
  participants: Extract<ProductDetailMediaConfig, { kind: "blurbCallScene" }>["participants"],
) {
  const startIndex = Math.floor(Math.random() * ALIEN_AVATAR_SOURCES.length);
  const stride = 17;

  return participants.map((participant, index) => {
    const src = ALIEN_AVATAR_SOURCES[(startIndex + index * stride) % ALIEN_AVATAR_SOURCES.length];

    return {
      ...participant,
      src,
      alt: `Alien call participant ${index + 1}`,
    };
  });
}

function getBlurbImageSequenceStep() {
  const startedAt = getBlurbImageSequenceStartedAt();
  return Math.max(0, Math.floor((Date.now() - startedAt) / BLURB_IMAGE_INTERVAL_MS));
}

function getBlurbImageSequenceDelayMs() {
  const startedAt = getBlurbImageSequenceStartedAt();
  const elapsed = (Date.now() - startedAt) % BLURB_IMAGE_INTERVAL_MS;
  return Math.max(24, BLURB_IMAGE_INTERVAL_MS - elapsed);
}

function getBlurbImageSequenceStartedAt() {
  if (blurbImageSequenceStartedAt !== null) return blurbImageSequenceStartedAt;

  const now = Date.now();
  if (typeof window === "undefined") {
    blurbImageSequenceStartedAt = now;
    return blurbImageSequenceStartedAt;
  }

  try {
    const stored = Number(window.localStorage.getItem(BLURB_IMAGE_SEQUENCE_STORAGE_KEY));
    if (Number.isFinite(stored) && stored > 0) {
      blurbImageSequenceStartedAt = stored;
      return blurbImageSequenceStartedAt;
    }

    window.localStorage.setItem(BLURB_IMAGE_SEQUENCE_STORAGE_KEY, String(now));
  } catch {
    // If storage is unavailable, module memory still keeps the sequence continuous during navigation.
  }

  blurbImageSequenceStartedAt = now;
  return blurbImageSequenceStartedAt;
}

function BlurbImageCarousel({
  items,
  dark,
  className,
}: {
  items: Extract<ProductDetailMediaConfig, { kind: "blurbImageCarousel" }>["items"];
  dark: boolean;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [sequenceStep, setSequenceStep] = useState(getBlurbImageSequenceStep);
  const [motionBounds, setMotionBounds] = useState<{
    restTop: number;
    travel: number;
  } | null>(null);

  useEffect(() => {
    if (items.length <= 1 || shouldReduceMotion) return;

    let timer = 0;
    const syncSequence = () => {
      setSequenceStep(getBlurbImageSequenceStep());
      timer = window.setTimeout(syncSequence, getBlurbImageSequenceDelayMs());
    };
    syncSequence();

    return () => window.clearTimeout(timer);
  }, [items.length, shouldReduceMotion]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    const updateMotionBounds = () => {
      const slide = root.closest<HTMLElement>("[data-slide-index]");
      const surface = slide?.firstElementChild instanceof HTMLElement ? slide.firstElementChild : root;
      const title = slide?.querySelector<HTMLElement>("h3");
      const surfaceRect = surface.getBoundingClientRect();
      const titleRect = title?.getBoundingClientRect();
      const titleBottom = titleRect
        ? Math.max(0, Math.min(surfaceRect.height, titleRect.bottom - surfaceRect.top))
        : 0;
      const restTop = titleBottom + (surfaceRect.height - titleBottom) / 2;
      const nextBounds = {
        restTop,
        travel: surfaceRect.height,
      };

      setMotionBounds((current) => {
        if (
          current &&
          Math.abs(current.restTop - nextBounds.restTop) < 0.5 &&
          Math.abs(current.travel - nextBounds.travel) < 0.5
        ) {
          return current;
        }

        return nextBounds;
      });
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateMotionBounds();
      });
    };

    updateMotionBounds();

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(root);
    const slide = root.closest<HTMLElement>("[data-slide-index]");
    const surface = slide?.firstElementChild;
    const title = slide?.querySelector<HTMLElement>("h3");
    if (surface instanceof HTMLElement) observer.observe(surface);
    if (title) observer.observe(title);
    window.addEventListener("resize", scheduleUpdate);
    void document.fonts?.ready.then(scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  if (items.length === 0) return null;

  const activeItem = items[sequenceStep % items.length];
  const activeSrc = dark ? activeItem.darkSrc : activeItem.lightSrc;
  const restTop = motionBounds?.restTop ?? BLURB_IMAGE_FALLBACK_REST_TOP;
  const enterTop = motionBounds
    ? motionBounds.restTop + motionBounds.travel
    : BLURB_IMAGE_FALLBACK_ENTER_TOP;
  const exitTop = motionBounds
    ? motionBounds.restTop - motionBounds.travel
    : BLURB_IMAGE_FALLBACK_EXIT_TOP;

  return (
    <div ref={rootRef} className={cn("relative size-full", className)}>
      <AnimatePresence initial={false}>
        <motion.img
          key={`${sequenceStep}-${activeSrc}`}
          src={activeSrc}
          alt={activeItem.alt}
          initial={shouldReduceMotion ? { top: restTop, opacity: 0 } : { top: enterTop, opacity: 1 }}
          animate={{ top: restTop, opacity: 1 }}
          exit={shouldReduceMotion ? { top: restTop, opacity: 0 } : { top: exitTop, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.22, ease: "linear" }
              : {
                  top: BLURB_IMAGE_SPRING,
                  opacity: { duration: 0.18, ease: "linear" },
                }
          }
          className="absolute left-1/2 z-0 w-[min(20rem,70%)] max-h-[min(31rem,82%)] -translate-x-1/2 -translate-y-1/2 object-contain will-change-[top]"
          loading="lazy"
          decoding="async"
        />
      </AnimatePresence>
    </div>
  );
}

function BlurbSequenceImage({
  item,
  index,
  dark,
}: {
  item: Extract<ProductDetailMediaConfig, { kind: "blurbSequence" }>["items"][number];
  index: number;
  dark: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const src = dark ? item.darkSrc : item.lightSrc;

  const sequenceMotion = {
    initial: { opacity: 0, y: 18, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      duration: 0.68,
      ease: BLURB_SEQUENCE_EASE,
      delay: 0.2 + index * 0.28,
    },
  };

  if (failed) {
    return (
      <motion.div
        {...sequenceMotion}
        className="rounded-[22px] border border-black/[0.04] bg-white/72 px-5 py-4 shadow-[0_18px_38px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.07] dark:shadow-[0_18px_40px_rgba(0,0,0,0.34)]"
      >
        <p className="font-sans text-[14px] font-medium leading-snug text-zinc-900 dark:text-zinc-100">
          {BLURB_SEQUENCE_FALLBACKS[index] ?? item.alt}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.img
      src={src}
      alt={item.alt}
      {...sequenceMotion}
      className="w-full rounded-[22px] border border-black/[0.04] shadow-[0_18px_38px_rgba(15,23,42,0.08)] dark:border-white/[0.08] dark:shadow-[0_18px_40px_rgba(0,0,0,0.34)]"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
