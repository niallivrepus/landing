import {
  Avatar,
  IncomingMessageBubble,
  MessageBubble,
  Squircle,
  cn,
  useShouldAnimate,
} from "@jokuh/gooey";
import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useClaimIdentityFlowContext } from "../../context/ClaimIdentityFlowContext";
import {
  MESSAGES_DM_THREADS,
  buildMessagesInboxThreads,
  type MessagesInboxThread,
} from "../../data/messages-demo-inbox";
import {
  MESSAGES_OO_INTERCEPT_AFTER,
  MESSAGES_OO_THINKING_MS,
  MESSAGES_OO_WELCOME,
  createOoReply,
  createOoThinkingMessage,
  createOoUserMessage,
  type MessagesOoMessage,
} from "../../data/messages-oo-demo-chat";
import {
  LANDING_DEMO_POWERS,
  type LandingDemoPower,
  type LandingDemoPowerId,
} from "../../data/landing-demo-powers";
import {
  LANDING_DEMO_SEED_EVENT,
  resolveLandingDemoPower,
  type LandingDemoSeedDetail,
} from "../../lib/landing-demo-seed";
import { LANDING_LIBRARY_SERVERS, type LandingLibraryServer } from "../../data/landing-library-rail-data";
import { SquircleShell } from "../system/squircle";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { LandingMessagesInbox } from "./LandingMessagesInbox";
import { OoSpeakBubble } from "./OoSpeakBubble";
import { ClaimIdentityCta } from "./ClaimIdentityCta";

const STACK_AVATAR_SIZE = 28;

/**
 * **Purpose:** Home proof stage — Texts UI + OO powers with Reply + Artifact + Claim bridge.
 * Bubbles social flavor sits as a thin lead-in; Claim is the conversion exit (not /messages).
 * **Connects to:** `Home.tsx`, `landing-demo-powers.ts`, `ClaimIdentityFlowContext`.
 */
export function ProductDemoSection() {
  const demoThreads = useMemo(
    () => buildMessagesInboxThreads().filter((t) => t.kind === "oo" || t.kind === "dm"),
    [],
  );
  const [activeId, setActiveId] = useState(demoThreads[0]?.id ?? "oo");
  const [heroSeed, setHeroSeed] = useState<LandingDemoSeedDetail | null>(null);
  const active = demoThreads.find((t) => t.id === activeId) ?? demoThreads[0]!;
  const previewServers = LANDING_LIBRARY_SERVERS.slice(0, 5);

  useEffect(() => {
    const onSeed = (event: Event) => {
      const detail = (event as CustomEvent<LandingDemoSeedDetail>).detail;
      if (!detail?.query) return;
      setActiveId("oo");
      setHeroSeed({ ...detail });
    };
    window.addEventListener(LANDING_DEMO_SEED_EVENT, onSeed);
    return () => window.removeEventListener(LANDING_DEMO_SEED_EVENT, onSeed);
  }, []);

  return (
    <section id="demo" className="landing-cv scroll-mt-24 bg-dark-space px-4 py-16 light:bg-white md:px-8 md:py-20">
      <div className={CONTENT_SHELL_WIDE}>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-sans text-lg font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-xl">
              See it work
            </h2>
            <p className="mt-2 max-w-[46ch] font-sans text-[15px] leading-relaxed text-light-space/65 light:text-zinc-600">
              Not another chat app. OO remembers, stays private, pulls from Spine, moves your calendar,
              and works inside Bubbles.
            </p>
          </div>
          <div className="flex items-center gap-2" aria-hidden>
            <div className="flex items-center -space-x-1.5">
              {previewServers.map((server, index) => (
                <span
                  key={server.id}
                  className="relative inline-flex shrink-0"
                  style={{ zIndex: previewServers.length - index }}
                >
                  <BubbleStackMark server={server} size={STACK_AVATAR_SIZE} />
                </span>
              ))}
            </div>
            <p className="font-sans text-[12px] text-light-space/45 light:text-zinc-500">
              ambush · people + agents
            </p>
          </div>
        </div>

        <div className="relative isolate mt-8">
          <Squircle
            cornerRadius={32}
            cornerSmoothing={1}
            borderWidth={1}
            strokeClassName="stroke-[var(--color-light-glass-10)]"
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-white/[0.02] light:bg-section-grey-light/60"
          />
          <div className="relative z-[1] grid gap-0 p-5 md:grid-cols-[240px_1fr] md:p-6">
            <div className="min-w-0 overflow-x-auto md:overflow-visible">
              <LandingMessagesInbox
                threads={demoThreads}
                activeId={activeId}
                onSelect={setActiveId}
                className="min-w-[220px]"
              />
            </div>

            <div className="flex min-h-[480px] flex-col border-t border-white/[0.06] pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0 light:border-black/[0.06]">
              <DemoThreadPanel thread={active} heroSeed={heroSeed} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * **Purpose:** Flat circular server mark for overlapping Bubbles stacks (no glass square edges).
 */
function BubbleStackMark({ server, size }: { server: LandingLibraryServer; size: number }) {
  const symbolScale = server.symbolScale ?? 0.72;
  const symbolSize = Math.max(0, Math.min(symbolScale, 1)) * 100;

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#050505] light:ring-white"
      style={{
        width: size,
        height: size,
        backgroundColor: server.backgroundColor,
      }}
    >
      <span
        aria-hidden
        className="block"
        style={{
          width: `${symbolSize}%`,
          height: `${symbolSize}%`,
          backgroundColor: server.symbolColor ?? "white",
          maskImage: `url("${server.symbolSrc}")`,
          maskPosition: "center",
          maskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskImage: `url("${server.symbolSrc}")`,
          WebkitMaskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
        }}
      />
    </span>
  );
}

/**
 * **Purpose:** Thread pane — OO agent chat or peer DM with OO memory note.
 */
function DemoThreadPanel({
  thread,
  heroSeed,
}: {
  thread: MessagesInboxThread;
  heroSeed: LandingDemoSeedDetail | null;
}) {
  if (thread.kind === "oo") {
    return <OoDemoThread heroSeed={heroSeed} />;
  }

  const dm = MESSAGES_DM_THREADS[thread.id];
  if (!dm) {
    return (
      <p className="font-sans text-[14px] text-light-space/55 light:text-zinc-500">
        Pick a conversation to see Texts in action.
      </p>
    );
  }

  return <DmDemoThread thread={thread} />;
}

/** **Purpose:** Product-chrome artifact under an OO reply — proves the power beyond chat text. */
function PowerArtifactCard({ power }: { power: LandingDemoPower }) {
  return (
    <div
      className={cn(
        "ml-10 rounded-2xl border px-3.5 py-3",
        power.id === "privacy" &&
          "border-white/[0.12] bg-white/[0.03] light:border-black/[0.1] light:bg-black/[0.03]",
        power.id === "spine" &&
          "border-white/[0.1] bg-[#141414] light:border-black/[0.08] light:bg-[#f4f4f5]",
        power.id === "calendar" &&
          "border-white/[0.1] bg-white/[0.04] light:border-black/[0.08] light:bg-white",
        power.id === "bubble" &&
          "border-white/[0.1] bg-white/[0.04] light:border-black/[0.08] light:bg-black/[0.03]",
        power.id === "memory" &&
          "border-white/[0.1] bg-white/[0.04] light:border-black/[0.08] light:bg-black/[0.03]",
      )}
    >
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-light-space/45 light:text-zinc-500">
        {power.artifact.eyebrow}
      </p>
      <p className="mt-1 font-sans text-[13px] font-semibold text-light-space light:text-zinc-950">
        {power.artifact.title}
      </p>
      <p className="mt-0.5 font-sans text-[12px] leading-snug text-light-space/55 light:text-zinc-600">
        {power.artifact.detail}
      </p>
    </div>
  );
}

/** **Purpose:** Interactive OO thread — power chips + artifacts + sticky Claim bridge. */
function OoDemoThread({ heroSeed }: { heroSeed: LandingDemoSeedDetail | null }) {
  const shouldAnimate = useShouldAnimate();
  const claimFlow = useClaimIdentityFlowContext();
  const [messages, setMessages] = useState<MessagesOoMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [activePowerId, setActivePowerId] = useState<LandingDemoPowerId | null>(null);
  const [revealedPowerId, setRevealedPowerId] = useState<LandingDemoPowerId | null>(null);
  const thinkingRef = useRef<number | null>(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const exchangeCountRef = useRef(0);
  exchangeCountRef.current = exchangeCount;

  useEffect(() => {
    return () => {
      if (thinkingRef.current) window.clearTimeout(thinkingRef.current);
    };
  }, []);

  const activePower = LANDING_DEMO_POWERS.find((power) => power.id === revealedPowerId) ?? null;
  const showBridge = Boolean(activePower);
  const softStopped = exchangeCount >= MESSAGES_OO_INTERCEPT_AFTER;

  const send = useCallback((text: string, powerId?: LandingDemoPowerId) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (exchangeCountRef.current >= MESSAGES_OO_INTERCEPT_AFTER) return;

    const resolved = resolveLandingDemoPower(trimmed, powerId);
    const userMessage = createOoUserMessage(resolved.prompt);
    const thinkingMessage = createOoThinkingMessage();
    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setDraft("");
    setActivePowerId(resolved.id);
    setRevealedPowerId(null);
    setExchangeCount((count) => count + 1);

    if (thinkingRef.current) window.clearTimeout(thinkingRef.current);
    thinkingRef.current = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === thinkingMessage.id
            ? { ...createOoReply(resolved.prompt), id: thinkingMessage.id }
            : message,
        ),
      );
      setRevealedPowerId(resolved.id);
    }, MESSAGES_OO_THINKING_MS);
  }, []);

  const appliedSeedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!heroSeed?.query) return;
    const token = `${heroSeed.nonce}:${heroSeed.powerId ?? ""}:${heroSeed.query}`;
    if (appliedSeedRef.current === token) return;
    appliedSeedRef.current = token;
    send(heroSeed.query, heroSeed.powerId);
  }, [heroSeed, send]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="mb-3 font-sans text-[13px] font-semibold text-light-space light:text-zinc-950">OO</p>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        <div className="flex items-end gap-2">
          <Avatar showOO originColor="aether" size={32} className="mb-1 shrink-0" />
          <OoSpeakBubble message={MESSAGES_OO_WELCOME} speak className="flex-1" />
        </div>

        {messages.map((message, index) => {
          const lastOoIndex = messages.reduce(
            (acc, item, itemIndex) =>
              item.author === "oo" && !item.thinking ? itemIndex : acc,
            -1,
          );
          const isLatestOo = message.author === "oo" && !message.thinking && index === lastOoIndex;

          return (
            <motion.div
              key={message.id}
              initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 }}
            >
              {message.author === "user" ? (
                <div className="flex justify-end">
                  <MessageBubble message={message.body} color="light" showTime={false} />
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <Avatar showOO originColor="aether" size={32} className="mb-1 shrink-0" />
                  <OoSpeakBubble
                    message={message.body}
                    thinking={Boolean(message.thinking)}
                    speak={isLatestOo}
                    className="flex-1"
                  />
                </div>
              )}
            </motion.div>
          );
        })}

        {activePower ? (
          <motion.div
            key={activePower.id}
            initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
          >
            <PowerArtifactCard power={activePower} />
          </motion.div>
        ) : null}
      </div>

      {showBridge ? (
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex flex-col gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-3 py-3 light:border-black/[0.08] light:bg-black/[0.03] sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-sans text-[13px] font-semibold text-light-space light:text-zinc-950">
            {activePower?.bridgeLabel ?? "Claim to keep this context"}
          </p>
          <ClaimIdentityCta
            href="/download?intent=identity"
            onActivate={() =>
              claimFlow.openFrom("demo", { power: activePower?.id ?? revealedPowerId })
            }
            className="justify-center sm:justify-end"
          >
            Get started
          </ClaimIdentityCta>
        </motion.div>
      ) : null}

      {!softStopped ? (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {LANDING_DEMO_POWERS.map((power) => {
            const active = activePowerId === power.id;
            return (
              <button
                key={power.id}
                type="button"
                onClick={() => send(power.prompt, power.id)}
                className={cn(
                  "rounded-2xl border px-3 py-2.5 text-left transition-colors",
                  active
                    ? "border-white/25 bg-white/[0.08] light:border-black/20 light:bg-black/[0.06]"
                    : "border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] light:border-black/[0.08] light:bg-black/[0.03] light:hover:bg-black/[0.05]",
                )}
              >
                <p className="font-sans text-[12px] font-semibold text-light-space light:text-zinc-950">
                  {power.label}
                </p>
                <p className="mt-0.5 font-sans text-[11px] leading-snug text-light-space/50 light:text-zinc-500">
                  {power.hint}
                </p>
              </button>
            );
          })}
        </div>
      ) : null}

      {!softStopped ? (
        <DemoComposer
          value={draft}
          onChange={setDraft}
          onSend={() => send(draft)}
          placeholder="Ask OO anything…"
        />
      ) : null}
    </div>
  );
}

/** **Purpose:** Peer DM thread with correct bubble sides; OO memory note speaks after you send. */
function DmDemoThread({ thread }: { thread: MessagesInboxThread }) {
  const shouldAnimate = useShouldAnimate();
  const claimFlow = useClaimIdentityFlowContext();
  const dm = MESSAGES_DM_THREADS[thread.id]!;
  const [draft, setDraft] = useState("");
  const [sentText, setSentText] = useState<string | null>(null);
  const [showOoNote, setShowOoNote] = useState(false);
  const [visibleCount, setVisibleCount] = useState(shouldAnimate ? 0 : dm.messages.length);
  const timerRef = useRef<number | null>(null);
  const revealTimers = useRef<number[]>([]);

  useEffect(() => {
    setSentText(null);
    setShowOoNote(false);
    setDraft("");

    for (const id of revealTimers.current) window.clearTimeout(id);
    revealTimers.current = [];

    if (!shouldAnimate) {
      setVisibleCount(dm.messages.length);
      return;
    }

    setVisibleCount(0);
    dm.messages.forEach((_, index) => {
      revealTimers.current.push(
        window.setTimeout(() => {
          setVisibleCount(index + 1);
        }, 420 * (index + 1)),
      );
    });

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      for (const id of revealTimers.current) window.clearTimeout(id);
    };
  }, [thread.id, dm.messages, shouldAnimate]);

  function send() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setSentText(trimmed);
    setDraft("");
    setShowOoNote(false);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setShowOoNote(true), 480);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="mb-3 font-sans text-[13px] font-semibold text-light-space light:text-zinc-950">
        {thread.name}
      </p>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-2.5 overflow-y-auto">
        {dm.messages.map((message, index) => {
          if (index >= visibleCount) return null;
          return (
            <motion.div
              key={`${thread.id}-${index}`}
              initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn("flex", message.from === "me" ? "justify-end" : "justify-start")}
            >
              {message.from === "me" ? (
                <MessageBubble message={message.text} color="light" showTime={false} />
              ) : (
                <IncomingMessageBubble name={thread.name} message={message.text} showTime={false} />
              )}
            </motion.div>
          );
        })}
        {sentText ? (
          <div className="flex justify-end">
            <MessageBubble message={sentText} color="light" showTime={false} />
          </div>
        ) : null}
        {showOoNote ? (
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2 pt-1"
          >
            <Avatar showOO originColor="aether" size={32} className="mb-1 shrink-0" />
            <OoSpeakBubble key={`${thread.id}-${sentText}`} message={dm.reply} speak className="flex-1" />
          </motion.div>
        ) : null}
      </div>

      {showOoNote ? (
        <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-3 py-3 light:border-black/[0.08] light:bg-black/[0.03] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[13px] font-semibold text-light-space light:text-zinc-950">
            Claim to keep this memory
          </p>
          <ClaimIdentityCta
            href="/download?intent=identity"
            onActivate={() => claimFlow.openFrom("demo", { power: "memory" })}
            className="justify-center sm:justify-end"
          >
            Get started
          </ClaimIdentityCta>
        </div>
      ) : (
        <DemoComposer
          value={draft}
          onChange={setDraft}
          onSend={send}
          placeholder="Type a message…"
        />
      )}
    </div>
  );
}

/** **Purpose:** Compact send field for the homepage Texts demo pane. */
function DemoComposer({
  value,
  onChange,
  onSend,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder: string;
}) {
  return (
    <form
      className="mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
    >
      <SquircleShell
        cornerRadius={24}
        cornerSmoothing={1}
        borderWidth={1}
        strokeClassName="stroke-[var(--color-light-glass-10)]"
        fillClassName="bg-white/[0.03] light:bg-white"
        contentClassName="flex items-center gap-2"
      >
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 font-sans text-[14px] text-light-space outline-none placeholder:text-light-space/40 light:text-zinc-950 light:placeholder:text-zinc-400"
        />
        <button
          type="submit"
          aria-label="Send"
          className="flex size-11 shrink-0 items-center justify-center text-light-space/70 transition-colors hover:text-light-space light:text-zinc-500 light:hover:text-zinc-950"
        >
          <ArrowUp className="size-5" strokeWidth={2} aria-hidden />
        </button>
      </SquircleShell>
    </form>
  );
}
