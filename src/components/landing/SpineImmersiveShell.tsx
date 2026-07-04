import {
  Button,
  SAMPLE_SPINE_EVENTS,
  SpineTimeline,
} from "@jokuh/gooey";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  LANDING_DEFAULT_DAY_ID,
  LANDING_SPINE_DAYS,
  LANDING_SPINE_HOURS_BY_DAY,
} from "../../data/landing-spine-capsules";
import { SPINE_JULY4_MEMORY_HOUR_ID } from "../../data/spine-july4-memory";
import { NEWS_ITEMS, formatNewsDate, getNewsCardArt, getNewsHref } from "../../data/news";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import { SiteLink } from "../SiteLink";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { ImmersiveCenterColumn } from "../system/ImmersiveCenterColumn";
import { SquircleShell } from "../system/squircle";
import { NewsCardArt } from "../NewsCardArt";
import { ImmersiveProductBackdrop } from "./ImmersiveProductBackdrop";
import { LandingDayYearCapsules } from "./LandingDayYearCapsules";
import { SpineJuly4Memory } from "./SpineJuly4Memory";

/**
 * **Purpose:** Full-viewport Spine page — timeline capsules outside squircle; brief + lifelog inside.
 * **Connects to:** `landing-spine-capsules.ts`, Gooey spine components, `news.ts`.
 */
export function SpineImmersiveShell() {
  const { intercept } = useDownloadIntercept("spine-immersive");
  const newsRows = NEWS_ITEMS.slice(0, 4);
  const [selectedDayId, setSelectedDayId] = useState(LANDING_DEFAULT_DAY_ID);
  const [expandedHourId, setExpandedHourId] = useState<string | null>(SPINE_JULY4_MEMORY_HOUR_ID);
  const [memoryExpanded, setMemoryExpanded] = useState(false);

  const timelineEvents = useMemo(() => {
    const hours = LANDING_SPINE_HOURS_BY_DAY[selectedDayId] ?? [];
    const hourSet = new Set(hours.map((hour) => hour.hour));
    const filtered = SAMPLE_SPINE_EVENTS.filter((event) => {
      const hour = Number.parseInt(event.time.split(":")[0] ?? "0", 10);
      return hourSet.has(hour);
    });
    return filtered.length > 0 ? filtered.slice(0, 6) : SAMPLE_SPINE_EVENTS.slice(0, 6);
  }, [selectedDayId]);

  const toggleHour = (hourId: string) => {
    if (hourId === SPINE_JULY4_MEMORY_HOUR_ID) {
      setExpandedHourId((current) => {
        const next = current === hourId ? null : hourId;
        setMemoryExpanded(next === hourId);
        return next;
      });
      return;
    }

    setMemoryExpanded(false);
    setExpandedHourId((current) => (current === hourId ? null : hourId));
  };

  const handleMemoryExpandedChange = (expanded: boolean) => {
    setMemoryExpanded(expanded);
    setExpandedHourId(expanded ? SPINE_JULY4_MEMORY_HOUR_ID : null);
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden" aria-label="Spine preview">
      <ImmersiveProductBackdrop productId="spine" />
      <ImmersiveAppChrome activeAction="spine" />

      <ImmersiveCenterColumn maxWidthClass="max-w-[420px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex w-full flex-col items-center gap-4"
        >
          <LandingDayYearCapsules
            layout="timeline"
            days={LANDING_SPINE_DAYS}
            hoursByDay={LANDING_SPINE_HOURS_BY_DAY}
            selectedDayId={selectedDayId}
            expandedHourId={expandedHourId}
            onSelectDay={(dayId) => {
              setSelectedDayId(dayId);
              setExpandedHourId(null);
              setMemoryExpanded(false);
            }}
            onToggleHour={toggleHour}
          />

          <SquircleShell
            cornerRadius={44}
            cornerSmoothing={1}
            borderWidth={1}
            strokeClassName="stroke-[var(--color-light-glass-10)]"
            fillClassName="bg-[#0a0a0c]/90 light:bg-white/96"
            className="w-full"
            contentClassName="flex max-h-[min(52vh,520px)] flex-col gap-4 overflow-hidden p-4 sm:p-5"
          >
            <SpineJuly4Memory expanded={memoryExpanded} onExpandedChange={handleMemoryExpandedChange} />

            <AnimatePresence initial={false}>
              {!memoryExpanded ? (
                <motion.div
                  key="spine-squircle-body"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
                >
                  <div className="min-h-0 flex-1 overflow-y-auto border-t border-light-space/[0.08] pt-3 light:border-black/[0.08]">
                    <SpineTimeline events={timelineEvents} />
                  </div>

                  <div className="shrink-0 border-t border-light-space/[0.08] pt-4 light:border-black/[0.08]">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-light-space/42 light:text-zinc-500">
                      Today&apos;s news
                    </p>
                    <ul className="space-y-2">
                      {newsRows.map((item) => {
                        const art = getNewsCardArt(item);
                        return (
                          <li key={item.id}>
                            <SiteLink
                              href={getNewsHref(item)}
                              className="premium-soft-fade flex items-start gap-3 rounded-xl p-2 hover:bg-white/[0.04] light:hover:bg-black/[0.03]"
                            >
                              <NewsCardArt
                                gradient={art.gradient}
                                image={art.image}
                                lavaLamp={art.lavaLamp}
                                overlayImage={art.overlayImage}
                                overlayAlt={art.overlayAlt}
                                className="size-10 shrink-0"
                              />
                              <span className="min-w-0">
                                <span className="block font-sans text-[12px] font-semibold leading-snug text-light-space light:text-zinc-800">
                                  {item.title}
                                </span>
                                <span className="font-sans text-[10px] text-light-space/45 light:text-zinc-500">
                                  {formatNewsDate(item.publishedAt)} · {item.category}
                                </span>
                              </span>
                            </SiteLink>
                          </li>
                        );
                      })}
                    </ul>
                    <Button
                      variant="secondary-neutral"
                      size="lg"
                      className="mt-3 w-full"
                      onClick={() => intercept("save-memory")}
                    >
                      Blurb to Spine → claim to unlock
                    </Button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </SquircleShell>

          <p className="text-center font-sans text-[clamp(1.5rem,5vw,2.5rem)] font-semibold tracking-[-0.02em] text-light-space light:text-zinc-950">
            Spine
          </p>
        </motion.div>
      </ImmersiveCenterColumn>
    </section>
  );
}
