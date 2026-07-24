import {
  Avatar,
  IncomingMessageBubble,
  MessageBubble,
  Squircle,
  cn,
  useShouldAnimate,
} from "@jokuh/gooey";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  LANDING_BUBBLES_PREVIEW_CHAT,
  LANDING_BUBBLES_SUBTITLE,
  LANDING_BUBBLES_TITLE,
} from "../../data/landing-bubbles-copy";
import {
  LANDING_LIBRARY_SERVERS,
  type LandingLibraryServer,
} from "../../data/landing-library-rail-data";
import { SiteLink } from "../SiteLink";
import { SectionHeaderRow } from "../system/sections";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { OoSpeakBubble } from "./OoSpeakBubble";

const BUBBLE_CHANNELS = ["# general", "# founders", "🎙 hang"] as const;
const STEP_MS = 780;
const STACK_AVATAR_SIZE = 36;

/**
 * **Purpose:** Flat circular server mark for overlapping stacks.
 * Avoids Gooey `ServerAvatar` / glass filters, whose square filter bounds draw vertical lines through neighbors.
 */
function BubbleStackMark({ server }: { server: LandingLibraryServer }) {
  const symbolScale = server.symbolScale ?? 0.72;
  const symbolSize = Math.max(0, Math.min(symbolScale, 1)) * 100;

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#050505] light:ring-white"
      style={{
        width: STACK_AVATAR_SIZE,
        height: STACK_AVATAR_SIZE,
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
 * **Purpose:** Homepage Bubbles beat — one lived-in room so visitors see people + OO together.
 * Peer lines use `IncomingMessageBubble` (left-facing); yours use outgoing `MessageBubble`.
 * **Connects to:** `Home.tsx`, `landing-bubbles-copy.ts`, `landing-library-rail-data.ts`, `/messages`.
 */
export function LandingBubblesSection() {
  const room = LANDING_LIBRARY_SERVERS[0]!;
  const previewServers = LANDING_LIBRARY_SERVERS.slice(0, 5);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.35 });
  const shouldAnimate = useShouldAnimate();
  const [visibleCount, setVisibleCount] = useState(shouldAnimate ? 0 : LANDING_BUBBLES_PREVIEW_CHAT.length);

  useEffect(() => {
    if (!inView || !shouldAnimate) {
      if (!shouldAnimate) setVisibleCount(LANDING_BUBBLES_PREVIEW_CHAT.length);
      return;
    }

    setVisibleCount(0);
    const timers: number[] = [];
    LANDING_BUBBLES_PREVIEW_CHAT.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          setVisibleCount(index + 1);
        }, STEP_MS * (index + 1)),
      );
    });

    return () => {
      for (const id of timers) window.clearTimeout(id);
    };
  }, [inView, shouldAnimate]);

  return (
    <section
      id="bubbles"
      className="landing-cv scroll-mt-24 bg-dark-space px-4 py-16 light:bg-white md:px-8 md:py-20"
    >
      <div className={CONTENT_SHELL_WIDE}>
        <SectionHeaderRow
          title={LANDING_BUBBLES_TITLE}
          actionLabel="See Texts demo"
          actionTo="/messages"
        />
        <p className="-mt-6 mb-10 max-w-[42ch] font-sans text-[15px] leading-relaxed text-light-space/65 light:text-zinc-600 md:-mt-8">
          {LANDING_BUBBLES_SUBTITLE}
        </p>

        <div className="relative isolate">
          <Squircle
            cornerRadius={32}
            cornerSmoothing={1}
            borderWidth={1}
            strokeClassName="stroke-[var(--color-light-glass-10)]"
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-white/[0.02] light:bg-section-grey-light/60"
          />

          <div className="relative z-[1] grid gap-8 p-5 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-10 md:p-7">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2" aria-hidden>
                  {previewServers.map((server, index) => (
                    <span
                      key={server.id}
                      className="relative inline-flex shrink-0"
                      style={{ zIndex: previewServers.length - index }}
                    >
                      <BubbleStackMark server={server} />
                    </span>
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-[15px] font-semibold text-light-space light:text-zinc-950">
                    {room.name}
                  </p>
                  <p className="font-sans text-[12px] text-light-space/45 light:text-zinc-500">
                    Bubble · people, agents, memory
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {BUBBLE_CHANNELS.map((channel, index) => (
                  <span
                    key={channel}
                    className={cn(
                      "rounded-full px-3 py-1.5 font-sans text-[12px]",
                      index === 0
                        ? "bg-white/[0.1] text-light-space light:bg-black/[0.06] light:text-zinc-900"
                        : "bg-white/[0.04] text-light-space/55 light:bg-black/[0.03] light:text-zinc-500",
                    )}
                  >
                    {channel}
                  </span>
                ))}
              </div>

              <p className="max-w-[36ch] font-sans text-[14px] leading-relaxed text-light-space/60 light:text-zinc-600">
                Chats, calls, and plans stay in the same room. OO remembers what was said so nothing
                gets lost between apps.
              </p>

              <SiteLink
                href="/download?intent=bubbles"
                className="w-fit font-sans text-sm font-semibold text-light-space underline-offset-4 hover:underline light:text-zinc-950"
              >
                Get Jokuh for Bubbles
              </SiteLink>
            </div>

            <div
              ref={stageRef}
              className="flex min-h-[280px] flex-col justify-end gap-3 rounded-[22px] border border-white/[0.08] bg-black/35 p-4 light:border-black/[0.06] light:bg-white/80"
              aria-label="Bubble conversation preview"
            >
              {LANDING_BUBBLES_PREVIEW_CHAT.map((line, index) => {
                if (index >= visibleCount) return null;

                if (line.from === "oo") {
                  return (
                    <motion.div
                      key={`${line.id}-${visibleCount >= 3 ? "speak" : "idle"}`}
                      initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-end gap-2 pt-1"
                    >
                      <Avatar showOO originColor="aether" size={32} className="mb-1 shrink-0" />
                      <OoSpeakBubble message={line.text} speak className="flex-1" />
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={line.id}
                    initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={cn("flex", line.from === "me" ? "justify-end" : "justify-start")}
                  >
                    {line.from === "me" ? (
                      <MessageBubble message={line.text} color="light" showTime={false} />
                    ) : (
                      <IncomingMessageBubble name={line.name} message={line.text} showTime={false} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
