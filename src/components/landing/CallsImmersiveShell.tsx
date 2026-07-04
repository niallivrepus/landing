import {
  ActiveCalls,
  GooeyViewportProvider,
  Soundwave,
  cn,
  useCurrentGooeyViewport,
} from "@jokuh/gooey";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Captions, Mic, PhoneOff, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  LANDING_CALLS_HOURS_BY_DAY,
  LANDING_DEFAULT_DAY_ID,
  LANDING_SPINE_DAYS,
  type LandingHourCapsule,
} from "../../data/landing-spine-capsules";
import { PRODUCT_DETAIL_BLUEPRINTS } from "../../data/product-detail-blueprints";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { ImmersiveCenterColumn } from "../system/ImmersiveCenterColumn";
import { SquircleShell } from "../system/squircle";
import { ImmersiveProductBackdrop } from "./ImmersiveProductBackdrop";
import { LandingDayYearCapsules } from "./LandingDayYearCapsules";
import { LandingPromptBar } from "./LandingPromptBar";

const CALLS_DEMO_MEDIA = PRODUCT_DETAIL_BLUEPRINTS.calls.highlights.slides.find(
  (slide) => slide.id === "calls-room",
)?.media;

const DEFAULT_CALL_HOUR_ID = "c-h-5";

/**
 * **Purpose:** Full-viewport Calls page — day/year call capsules plus live deal-room panel.
 * **Connects to:** `landing-spine-capsules.ts`, `product-detail-blueprints.ts`, `/download` intercept.
 */
export function CallsImmersiveShell() {
  return (
    <GooeyViewportProvider>
      <CallsImmersiveShellInner />
    </GooeyViewportProvider>
  );
}

function CallsImmersiveShellInner() {
  const viewport = useCurrentGooeyViewport();
  const reduceMotion = useReducedMotion();
  const { intercept } = useDownloadIntercept("calls-immersive");
  const [selectedDayId, setSelectedDayId] = useState(LANDING_DEFAULT_DAY_ID);
  const [expandedHourId, setExpandedHourId] = useState<string | null>(DEFAULT_CALL_HOUR_ID);
  const [captionIndex, setCaptionIndex] = useState(0);

  const media =
    CALLS_DEMO_MEDIA?.kind === "blurbCallScene" ? CALLS_DEMO_MEDIA : null;
  const subtitles = media?.subtitles ?? [];

  const focusedHour = useMemo((): LandingHourCapsule | undefined => {
    const hours = LANDING_CALLS_HOURS_BY_DAY[selectedDayId] ?? [];
    return hours.find((hour) => hour.id === expandedHourId) ?? hours[0];
  }, [expandedHourId, selectedDayId]);

  const liveTitle = focusedHour?.summary ?? media?.callTitle ?? "Sterling close";
  const liveStatus = focusedHour ? "Replay" : (media?.callStatus ?? "Deal room");

  const captionLines = useMemo(() => {
    if (focusedHour?.detail) {
      return [{ speaker: "Call", text: focusedHour.detail }];
    }
    return subtitles;
  }, [focusedHour, subtitles]);

  const caption = captionLines[captionIndex % Math.max(captionLines.length, 1)];

  useEffect(() => {
    if (reduceMotion || captionLines.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setCaptionIndex((index) => (index + 1) % captionLines.length);
    }, 1700);
    return () => window.clearInterval(id);
  }, [captionLines.length, reduceMotion]);

  useEffect(() => {
    setCaptionIndex(0);
  }, [expandedHourId, selectedDayId]);

  const toggleHour = (hourId: string) => {
    setExpandedHourId((current) => (current === hourId ? null : hourId));
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden" aria-label="Calls preview">
      <ImmersiveProductBackdrop productId="calls" />
      <ImmersiveAppChrome activeAction="call" />

      <ImmersiveCenterColumn maxWidthClass="max-w-[520px]">
        <div className="flex w-full flex-col items-center gap-4">
          <LandingDayYearCapsules
            layout="timeline"
            days={LANDING_SPINE_DAYS}
            hoursByDay={LANDING_CALLS_HOURS_BY_DAY}
            selectedDayId={selectedDayId}
            expandedHourId={expandedHourId}
            onSelectDay={(dayId) => {
              setSelectedDayId(dayId);
              setExpandedHourId(null);
            }}
            onToggleHour={toggleHour}
            className="text-light-space light:text-zinc-900"
          />

          <SquircleShell
            cornerRadius={44}
            cornerSmoothing={1}
            borderWidth={1}
            strokeClassName="stroke-[var(--color-light-glass-10)]"
            fillClassName="bg-white/[0.08] light:bg-white/94"
            className="w-full backdrop-blur-2xl"
            contentClassName="flex min-h-[min(48vh,420px)] flex-col justify-between p-4 text-white sm:p-5 light:text-zinc-900"
          >
            <div className="flex min-h-0 flex-1 flex-col justify-between rounded-[28px] border border-white/10 bg-black/20 p-3 light:border-black/10 light:bg-black/[0.03]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Soundwave animate={!reduceMotion && !focusedHour} color="spirit" className="scale-90" />
                <span className="rounded-full bg-black/25 px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide light:bg-black/10">
                  {liveStatus}
                </span>
              </div>
              {media ? (
                <ActiveCalls
                  participants={media.participants.map((participant) => ({
                    src: participant.src,
                    borderColor: participant.borderColor,
                  }))}
                  count={media.participants.length}
                  className="origin-right scale-110"
                />
              ) : null}
            </div>

            <div className="flex flex-1 items-center justify-center gap-2 py-4">
              {(media?.participants ?? []).map((participant, index) => (
                <img
                  key={participant.alt}
                  src={participant.src}
                  alt=""
                  className={cn(
                    "rounded-full border-2 object-cover shadow-lg",
                    index === 1 ? "z-20 h-16 w-14 border-fuchsia-300" : "z-10 -ml-3 h-12 w-10",
                    index === 0 && "border-lime-300",
                    index === 2 && "border-sky-300",
                  )}
                />
              ))}
            </div>

            {caption ? (
              <div className="flex h-9 items-center gap-2 rounded-full bg-black/30 px-3 light:bg-black/10">
                <Captions className="size-3.5 shrink-0 opacity-75" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`${selectedDayId}-${expandedHourId}-${captionIndex}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                    className="truncate font-sans text-[11px] font-medium"
                  >
                    <span className="opacity-60">{caption.speaker}:</span> {caption.text}
                  </motion.p>
                </AnimatePresence>
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-fuchsia-200 light:text-fuchsia-600" />
                <p className="font-sans text-[11px] font-semibold opacity-80">{liveTitle}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Mute"
                  onClick={() => intercept("call")}
                  className="flex size-8 items-center justify-center rounded-full bg-white/15 light:bg-black/10"
                >
                  <Mic className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Leave call"
                  onClick={() => intercept("call")}
                  className="flex size-8 items-center justify-center rounded-full bg-[#FF4B4B]"
                >
                  <PhoneOff className="size-3.5" />
                </button>
              </div>
            </div>
            </div>
          </SquircleShell>

          <div className="w-full max-w-[450px]">
            <LandingPromptBar
              variant={viewport === "phone" ? "phone" : "desktop"}
              viewport={viewport}
              previewText="Ask about this call…"
              onSend={() => intercept("call")}
              onPlus={() => intercept("prompt-plus")}
            />
          </div>

          <p className="text-center font-sans text-[clamp(1.5rem,5vw,2.5rem)] font-semibold tracking-[-0.02em] text-light-space light:text-zinc-950">
            Calls
          </p>
        </div>
      </ImmersiveCenterColumn>
    </section>
  );
}
