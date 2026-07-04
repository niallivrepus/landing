import { cn } from "@jokuh/gooey";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import {
  getSpineJuly4Memory,
  SPINE_JULY4_MEMORY_DATE,
  SPINE_JULY4_MEMORY_SLUG,
} from "../../data/spine-july4-memory";
import { StoryAudioBlock } from "../stories/StoryAudioBlock";
import { StoryPoemBlock } from "../stories/StoryPoemBlock";
import { SiteLink } from "../SiteLink";

const MEMORY_LAYOUT_ID = "spine-july4-memory-shell";

const gooeySpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 36,
  mass: 0.92,
};

/**
 * **Purpose:** July 4 Independence Day memory pill on landing Spine — gooey inline expand with poem + audio.
 * **Connects to:** `spine-july4-memory.ts`, `SpineImmersiveShell`, `stories-detail.ts`.
 */
export function SpineJuly4Memory({
  expanded,
  onExpandedChange,
  className,
}: {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const memory = useMemo(() => getSpineJuly4Memory(), []);

  useEffect(() => {
    if (!expanded) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onExpandedChange(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, onExpandedChange]);

  const collapse = () => onExpandedChange(false);

  return (
    <div className={cn("landing-spine-memory", className)}>
      <motion.div
        layout
        layoutId={MEMORY_LAYOUT_ID}
        transition={reduceMotion ? { duration: 0 } : gooeySpring}
        className={cn(
          "landing-spine-memory__shell",
          expanded && "landing-spine-memory__shell--expanded spectral-border-burst",
        )}
        ref={panelRef}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {!expanded ? (
            <motion.button
              key="pill"
              type="button"
              initial={reduceMotion ? false : { opacity: 0.92 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}
              className="landing-spine-memory__pill"
              aria-expanded={false}
              onClick={() => onExpandedChange(true)}
            >
              <span className="landing-spine-memory__pill-date" aria-hidden>
                {SPINE_JULY4_MEMORY_DATE.short}
              </span>
              <img
                src={memory.hero.src}
                alt=""
                className="landing-spine-memory__pill-thumb"
                width={36}
                height={36}
              />
              <span className="landing-spine-memory__pill-copy">
                <span className="landing-spine-memory__pill-eyebrow">Memory · {SPINE_JULY4_MEMORY_DATE.full}</span>
                <span className="landing-spine-memory__pill-title">{memory.story.title}</span>
                <span className="landing-spine-memory__pill-snippet">{memory.story.dek}</span>
              </span>
              <span className="landing-spine-memory__pill-chevron" aria-hidden>
                ↗
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="panel"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.22 }}
              className="landing-spine-memory__panel"
              role="region"
              aria-label={memory.story.title}
            >
              <div className="landing-spine-memory__panel-header">
                <div className="min-w-0">
                  <p className="landing-spine-memory__panel-meta">{SPINE_JULY4_MEMORY_DATE.full} · Spine</p>
                  <h2 className="landing-spine-memory__panel-title">{memory.story.title}</h2>
                  <p className="landing-spine-memory__panel-dek">{memory.story.dek}</p>
                </div>
                <button
                  type="button"
                  className="landing-spine-memory__close"
                  aria-label="Collapse memory"
                  onClick={collapse}
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>

              <div className="landing-spine-memory__hero">
                <img
                  src={memory.hero.src}
                  alt={memory.hero.alt}
                  className="landing-spine-memory__hero-image"
                />
              </div>

              <StoryAudioBlock
                variant="spine"
                src={memory.audio.src}
                title={memory.audio.title}
                attribution={memory.audio.attribution}
                storySlug={SPINE_JULY4_MEMORY_SLUG}
              />

              <div className="landing-spine-memory__poem-scroll">
                <StoryPoemBlock stanzas={memory.poem.stanzas} variant="spine" />
              </div>

              <div className="landing-spine-memory__footer">
                <SiteLink
                  href={`/stories/${SPINE_JULY4_MEMORY_SLUG}`}
                  className="landing-spine-memory__full-link premium-soft-fade"
                >
                  Read full story
                </SiteLink>
                <button
                  type="button"
                  className="landing-spine-memory__collapse-link premium-soft-fade"
                  onClick={collapse}
                >
                  Collapse
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
