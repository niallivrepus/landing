import { Avatar, cn } from "@jokuh/gooey";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { LANDING_DEMO_POWERS } from "../../../../data/landing-demo-powers";
import type { LandingDemoMessage } from "../../../../data/landing-demo-chat";
import { SquircleShell } from "../../../system/squircle";
import { LandingDemoChat } from "../../LandingDemoChat";

/** Beat timings for one power: prompt → thinking → typed reply → proof card → next. */
const BEAT_THINK_MS = 700;
const BEAT_REPLY_MS = 1800;
const BEAT_ARTIFACT_MS = 4600;
const BEAT_NEXT_MS = 8200;

/**
 * **Purpose:** OO's chat surface for the console home scene — the site's "See it work" powers
 * (`LANDING_DEMO_POWERS`: remembers, private, Spine, moves time, Bubbles) playing out in an app-style OO thread:
 * the prompt lands, OO thinks, the reply types out, and the proof card (saved preference, calendar move…) appears.
 * Same demo copy as the homepage chips / `ProductDemoSection`; nothing is sent. The real, temporary OO chat
 * stays in the title block's prompt bar.
 * **Connects to:** `ConsoleStage` (`console/surfaces`), `LandingDemoChat`, `landing-demo-powers.ts`.
 */
export function OoDemoSurface({ playing }: { playing: boolean }) {
  const [powerIndex, setPowerIndex] = useState(0);
  const [beat, setBeat] = useState(playing ? 0 : 3);
  const power = LANDING_DEMO_POWERS[powerIndex % LANDING_DEMO_POWERS.length]!;

  useEffect(() => {
    if (!playing) {
      setBeat(3);
      return undefined;
    }
    setBeat(0);
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    at(BEAT_THINK_MS, () => setBeat(1));
    at(BEAT_REPLY_MS, () => setBeat(2));
    at(BEAT_ARTIFACT_MS, () => setBeat(3));
    at(BEAT_NEXT_MS, () => {
      if (document.hidden) return;
      setPowerIndex((index) => index + 1);
    });
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [playing, powerIndex]);

  // The previous exchange stays above (already typed), so the thread reads like a running conversation.
  const previous = powerIndex > 0 ? LANDING_DEMO_POWERS[(powerIndex - 1) % LANDING_DEMO_POWERS.length] : undefined;
  const messages: LandingDemoMessage[] = previous
    ? [
        { id: `${powerIndex - 1}-${previous.id}-q`, author: "user", body: previous.prompt },
        { id: `${powerIndex - 1}-${previous.id}-a`, author: "oo", body: previous.reply },
      ]
    : [];
  messages.push({ id: `${powerIndex}-${power.id}-q`, author: "user", body: power.prompt });
  if (beat === 1) messages.push({ id: `${powerIndex}-${power.id}-t`, author: "oo", body: "", thinking: true });
  if (beat >= 2) messages.push({ id: `${powerIndex}-${power.id}-a`, author: "oo", body: power.reply });

  return (
    <SquircleShell
      cornerRadius={44}
      cornerSmoothing={1}
      borderWidth={1}
      strokeClassName="stroke-[var(--color-light-glass-10)]"
      fillClassName="bg-[#0a0a0c]/86 light:bg-white/94"
      className="w-full"
      contentClassName="flex h-[520px] flex-col p-5"
    >
      <div className="mb-4 flex items-center gap-3 border-b border-light-space/[0.08] pb-4 light:border-black/[0.08]">
        <Avatar showOO originColor="aether" size={36} className="shrink-0" />
        <div className="min-w-0">
          <p className="font-sans text-[15px] font-bold text-light-space light:text-zinc-900">OO</p>
          <p className="font-sans text-[11px] text-light-space/50 light:text-zinc-500">Your private agent · always here</p>
        </div>
        <div className="ml-auto flex gap-1.5">
          {LANDING_DEMO_POWERS.map((item, index) => (
            <span
              key={item.id}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === powerIndex % LANDING_DEMO_POWERS.length
                  ? "w-4 bg-light-space/80 light:bg-zinc-800"
                  : "w-1.5 bg-light-space/20 light:bg-black/15",
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-hidden">
        <LandingDemoChat messages={messages} />
        <AnimatePresence initial={false}>
          {beat >= 3 ? (
            <motion.div
              key={`${powerIndex}-artifact`}
              className="ml-10 rounded-[20px] border border-white/10 bg-white/[0.05] p-4 light:border-black/[0.08] light:bg-black/[0.03]"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-light-space/45 light:text-zinc-500">
                {power.artifact.eyebrow}
              </p>
              <p className="mt-1 font-sans text-[14px] font-bold text-light-space light:text-zinc-900">
                {power.artifact.title}
              </p>
              <p className="mt-0.5 font-sans text-[12px] text-light-space/60 light:text-zinc-600">{power.artifact.detail}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </SquircleShell>
  );
}
