import { cn } from "@jokuh/gooey";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  EDITORIAL_MEDIA_RADIUS_CLASS,
  EditorialQuoteBlock,
  MarketingPageFrame,
  SectionHeaderRow,
} from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { TopNavAnchor } from "../components/TopNavAnchor";
import { HOME_STORIES } from "../data/home-stories";
import {
  getStoryDetail,
  type StoryDetail,
  type StoryGalleryImage,
  type StoryImageCaptioned,
  type StoryImageNarrative,
  type StorySection,
} from "../data/stories-detail";
import { Navigate, useParams } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const articleColumn = "mx-auto w-full max-w-[min(100%,48rem)]";
/** Pixels of horizontal drift per second when the gallery is “running” (not drag / inertia / hover). */
const STORY_GALLERY_SPEED_PX_PER_S = 30;
const STORY_GALLERY_CATCH_UP_STIFFNESS = 30;
const STORY_GALLERY_CATCH_UP_DAMPING = 10;
const STORY_GALLERY_CATCH_UP_REST_PX = 0.35;
function StoryHero({ story }: { story: StoryDetail }) {
  const [date] = story.metaLine.split(" · ");

  return (
    <header className={`${CONTENT_SHELL_WIDE} pt-28 pb-14 text-center md:pt-32 md:pb-16`}>
      <div className="mx-auto w-full max-w-[48rem]">
        <p className="font-sans text-[11px] font-medium leading-none text-light-space">
          {date}
          <span className="ml-5">Jokuh</span>
        </p>
        <h1 className="mx-auto mt-8 max-w-[16ch] text-balance font-sans text-[2.85rem] font-semibold leading-[1.02] tracking-[0em] text-light-space sm:text-[4rem] md:text-[5rem] lg:text-[5.45rem]">
          {story.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[42rem] text-pretty font-sans text-[15px] leading-[1.62] font-normal tracking-[0em] text-light-space/78 md:text-[16px] md:leading-[1.58]">
          {story.dek}
        </p>
      </div>
    </header>
  );
}

function StoryGallery({ images }: { images: StoryDetail["heroGallery"] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cycleWidth, setCycleWidth] = useState(0);
  const carouselImages = useMemo(() => [...images, ...images, ...images], [images]);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  });
  const inertiaFrameRef = useRef<number | null>(null);
  const momentumActiveRef = useRef(false);
  /** Scroll distance that would have happened during hover. Repaid by the spring loop after resume. */
  const owedAutoplayPxRef = useRef(0);
  const catchUpVelocityRef = useRef(0);
  const autoplayCarryPxRef = useRef(0);
  const isPausedRef = useRef(false);
  isPausedRef.current = isPaused;

  const wrapScroll = (root: HTMLDivElement) => {
    if (cycleWidth <= 0) return;
    const maxScrollLeft = Math.max(root.scrollWidth - root.clientWidth, 0);
    const lowerBound = Math.min(cycleWidth * 0.5, maxScrollLeft);
    const upperBound = Math.min(cycleWidth * 2, maxScrollLeft);
    if (maxScrollLeft <= 0 || upperBound <= lowerBound) return;

    let nextScrollLeft = root.scrollLeft;
    if (nextScrollLeft >= upperBound) {
      nextScrollLeft = lowerBound + ((nextScrollLeft - lowerBound) % cycleWidth);
    } else if (nextScrollLeft < lowerBound) {
      nextScrollLeft = upperBound - ((lowerBound - nextScrollLeft) % cycleWidth);
    }

    root.scrollLeft = Math.min(Math.max(nextScrollLeft, 0), maxScrollLeft);
  };

  const stopInertia = () => {
    if (inertiaFrameRef.current !== null) {
      window.cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
    momentumActiveRef.current = false;
  };

  useEffect(() => {
    const measure = () => {
      const root = scrollRef.current;
      const duplicateStart = root?.querySelector<HTMLElement>(`[data-gallery-index="${images.length}"]`);
      if (!root || !duplicateStart) return;
      const nextCycleWidth = duplicateStart.offsetLeft - root.offsetLeft;
      setCycleWidth(nextCycleWidth);
      if (root.scrollLeft < 1) {
        root.scrollLeft = Math.min(nextCycleWidth, Math.max(root.scrollWidth - root.clientWidth, 0));
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [images.length]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || cycleWidth <= 0 || images.length <= 1) return;

    let frame = 0;
    let previous = performance.now();
    const speed = STORY_GALLERY_SPEED_PX_PER_S;

    const tick = (now: number) => {
      const elapsed = now - previous;
      previous = now;
      const drag = dragRef.current.active;
      const mom = momentumActiveRef.current;
      const paused = isPausedRef.current;

      if (drag || mom) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      const step = (speed * elapsed) / 1000;
      if (paused) {
        owedAutoplayPxRef.current += step;
        catchUpVelocityRef.current = 0;
        autoplayCarryPxRef.current = 0;
      } else {
        const dt = elapsed / 1000;
        const owed = owedAutoplayPxRef.current;
        let catchUpStep = 0;

        if (Math.abs(owed) > STORY_GALLERY_CATCH_UP_REST_PX || Math.abs(catchUpVelocityRef.current) > 0.01) {
          const acceleration = owed * STORY_GALLERY_CATCH_UP_STIFFNESS;
          const damping = Math.exp(-STORY_GALLERY_CATCH_UP_DAMPING * dt);
          catchUpVelocityRef.current = (catchUpVelocityRef.current + acceleration * dt) * damping;
          catchUpStep = catchUpVelocityRef.current * dt;

          if (Math.abs(catchUpStep) >= Math.abs(owed)) {
            catchUpStep = owed;
            catchUpVelocityRef.current = 0;
          }

          owedAutoplayPxRef.current = owed - catchUpStep;
        } else {
          owedAutoplayPxRef.current = 0;
          catchUpVelocityRef.current = 0;
        }

        const rawStep = step + catchUpStep + autoplayCarryPxRef.current;
        const wholeStep = rawStep >= 0 ? Math.floor(rawStep) : Math.ceil(rawStep);
        autoplayCarryPxRef.current = rawStep - wholeStep;

        if (wholeStep !== 0) {
          root.scrollLeft += wholeStep;
          wrapScroll(root);
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [cycleWidth, images.length]);

  useEffect(() => () => stopInertia(), []);

  const startInertia = () => {
    const root = scrollRef.current;
    if (!root) return;

    let velocity = dragRef.current.velocity;
    let previous = performance.now();
    momentumActiveRef.current = true;

    const step = (now: number) => {
      const elapsed = now - previous;
      previous = now;
      root.scrollLeft += velocity * elapsed;
      wrapScroll(root);
      velocity *= 0.94;

      if (Math.abs(velocity) < 0.015) {
        momentumActiveRef.current = false;
        inertiaFrameRef.current = null;
        if (!root.matches(":hover")) setIsPaused(false);
        return;
      }

      inertiaFrameRef.current = window.requestAnimationFrame(step);
    };

    inertiaFrameRef.current = window.requestAnimationFrame(step);
  };

  if (images.length === 0) return null;

  return (
    <div className="pb-16 md:pb-20">
      <div
        ref={scrollRef}
        dir="ltr"
        className={cn(
          "overflow-x-auto overscroll-x-contain px-4 md:px-6",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        style={{ WebkitOverflowScrolling: "touch" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredCardIndex(null);
        }}
        onPointerDown={(event) => {
          const root = scrollRef.current;
          if (!root) return;
          stopInertia();
          root.setPointerCapture(event.pointerId);
          dragRef.current = {
            active: true,
            pointerId: event.pointerId,
            startX: event.clientX,
            startScrollLeft: root.scrollLeft,
            lastX: event.clientX,
            lastT: performance.now(),
            velocity: 0,
          };
          setIsPaused(true);
          setIsDragging(true);
        }}
        onPointerMove={(event) => {
          const root = scrollRef.current;
          const drag = dragRef.current;
          if (!root || !drag.active || drag.pointerId !== event.pointerId) return;
          const now = performance.now();
          const dxFromStart = event.clientX - drag.startX;
          const nextScrollLeft = drag.startScrollLeft - dxFromStart;
          const dt = Math.max(now - drag.lastT, 1);
          drag.velocity = (nextScrollLeft - root.scrollLeft) / dt;
          root.scrollLeft = nextScrollLeft;
          wrapScroll(root);
          drag.lastX = event.clientX;
          drag.lastT = now;
        }}
        onPointerUp={(event) => {
          const root = scrollRef.current;
          const drag = dragRef.current;
          if (!root || !drag.active || drag.pointerId !== event.pointerId) return;
          drag.active = false;
          setIsDragging(false);
          root.releasePointerCapture(event.pointerId);
          startInertia();
        }}
        onPointerCancel={(event) => {
          const root = scrollRef.current;
          const drag = dragRef.current;
          if (!root || drag.pointerId !== event.pointerId) return;
          drag.active = false;
          setIsDragging(false);
          setIsPaused(false);
        }}
      >
        <div className={cn("flex w-max gap-4 md:gap-5", isDragging ? "cursor-grabbing" : "cursor-grab")}>
          {carouselImages.map((img: StoryGalleryImage, index) => {
            const focused = hoveredCardIndex === null || hoveredCardIndex === index;
            return (
              <div
                key={`${img.src}-${index}`}
                data-gallery-index={index}
                className="group w-[72vw] min-w-[280px] max-w-[746px] shrink-0 md:w-[58vw] lg:w-[746px]"
                onMouseEnter={() => setHoveredCardIndex(index)}
                onFocus={() => {
                  setIsPaused(true);
                  setHoveredCardIndex(index);
                }}
              >
                <motion.p
                  initial={false}
                  animate={{
                    opacity: hoveredCardIndex === index ? 1 : 0,
                    y: hoveredCardIndex === index ? 0 : 8,
                  }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-4 font-sans text-[14px] leading-none font-semibold text-white"
                >
                  {img.label}
                </motion.p>
                <div className="overflow-hidden rounded-[6px] bg-smoke-2">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className={cn(
                      "aspect-video w-full object-cover transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      focused ? "opacity-100" : "opacity-60",
                    )}
                    loading={index < images.length ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index < images.length ? "high" : "auto"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function ProseBlock({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className={`${CONTENT_SHELL_WIDE} py-8 md:py-10`}>
      <div className={`${articleColumn} space-y-8 md:space-y-9`}>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="news-detail-reading text-[1.05rem] font-normal leading-[1.82] tracking-[0em] text-light-space/74 md:text-[1.13rem] md:leading-[1.86]"
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

function SubheadBlock({ text }: { text: string }) {
  return (
    <div className={`${CONTENT_SHELL_WIDE} pt-8 pb-1 md:pt-10 md:pb-2`}>
      <h2 className={`${articleColumn} text-balance font-sans text-[2.15rem] font-semibold leading-[1.05] tracking-[0em] text-light-space md:text-[3rem]`}>
        {text}
      </h2>
    </div>
  );
}

function FeatureTextBlock({
  title,
  subtitle,
  paragraphs,
}: {
  title: string;
  subtitle: string;
  paragraphs: string[];
}) {
  return (
    <section className="bg-black py-28 md:py-36 lg:py-44 light:bg-section-grey-light light:ring-1 light:ring-inset light:ring-zinc-200/80">
      <div className={CONTENT_SHELL_WIDE}>
        <div className="mx-auto w-full max-w-[48rem]">
          <h2 className="max-w-[12ch] text-balance font-sans text-[3rem] font-semibold leading-[0.98] tracking-[0em] text-white light:text-zinc-950 md:text-[4.1rem]">
            {title}
          </h2>
          <p className="mt-8 max-w-[42rem] text-pretty font-sans text-[1.45rem] leading-[1.28] font-medium tracking-[0em] text-white/90 light:text-zinc-800 md:text-[2rem] md:leading-[1.24]">
            {subtitle}
          </p>
          <div className="mt-16 space-y-8 md:mt-20 md:space-y-9">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="news-detail-reading max-w-[44rem] text-[1.02rem] leading-[1.82] tracking-[0em] text-white/74 light:text-zinc-600 md:text-[1.1rem] md:leading-[1.86]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const storyEditorialImageRadius = "rounded-2xl";

function AsymmetricImagesBlock({ large, small }: { large: StoryImageCaptioned; small: StoryImageCaptioned }) {
  if (small.hidden) {
    const portrait = large.imageLayout === "portrait";
    return (
      <div className={`${CONTENT_SHELL_WIDE} py-20 md:py-28`}>
        <div
          className={cn(
            "mx-auto w-full",
            portrait ? "max-w-[min(100%,32rem)]" : "max-w-[min(100%,52rem)]",
          )}
        >
          <div
            className={cn(
              "overflow-hidden bg-smoke-2/40 light:bg-section-grey-light",
              storyEditorialImageRadius,
            )}
          >
            <img
              src={large.src}
              alt={large.alt}
              className={cn(
                "w-full object-cover",
                portrait ? "aspect-[3/4] object-top" : "aspect-[16/10]",
              )}
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="mt-4 max-w-[40rem] font-sans text-[12px] leading-[1.45] text-light-space/60 light:text-zinc-600 md:text-[13px]">
            {large.caption}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${CONTENT_SHELL_WIDE} py-20 md:py-28`}>
      <div className="mx-auto flex w-full max-w-[min(100%,76rem)] flex-col items-stretch gap-12 lg:flex-row lg:items-start lg:gap-[clamp(2rem,4.5vw,3.75rem)]">
        <div className="min-w-0 flex-1 lg:max-w-[64%]">
          <div className={cn("overflow-hidden bg-smoke-2/40 light:bg-section-grey-light", storyEditorialImageRadius)}>
            <img
              src={large.src}
              alt={large.alt}
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="mt-4 max-w-[42rem] font-sans text-[12px] leading-[1.45] text-light-space/60 light:text-zinc-600 md:text-[13px]">
            {large.caption}
          </p>
        </div>
        <div className="min-w-0 shrink-0 lg:w-[min(34%,22rem)]">
          <div className={cn("overflow-hidden bg-smoke-2/40 light:bg-section-grey-light", storyEditorialImageRadius)}>
            <img
              src={small.src}
              alt={small.alt}
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="mt-4 font-sans text-[12px] leading-[1.55] text-light-space/60 light:text-zinc-600 md:text-[13px]">
            {small.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-light-space light:text-zinc-950">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function TriptychBlock({ items }: { items: [StoryImageNarrative, StoryImageNarrative, StoryImageNarrative] }) {
  return (
    <div className={`${CONTENT_SHELL_WIDE} py-14 md:py-20`}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 xl:gap-8">
        {items.map((item) => (
          <article key={item.src} className="min-w-0">
            <div
              className={cn(
                "overflow-hidden border border-light-space/[0.08] bg-smoke-2 light:border-black/[0.08] light:bg-section-grey-light",
                EDITORIAL_MEDIA_RADIUS_CLASS,
              )}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="mt-5 font-sans text-[1.02rem] leading-[1.65] tracking-[0em] text-light-space/68 light:text-zinc-700 md:text-[1.08rem]">
              {renderInlineBold(item.text)}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function QuoteBlock({ text, attribution }: { text: string; attribution: string }) {
  return <EditorialQuoteBlock text={text} attribution={attribution} />;
}

function MoreStoryCard({ story }: { story: (typeof HOME_STORIES)[number] }) {
  const detail = getStoryDetail(story.slug);
  const [src, setSrc] = useState(story.image);

  return (
    <article className="group flex h-full flex-col">
      <TopNavAnchor href={story.href} className="flex h-full flex-col no-underline">
        <div
          className={cn(
            "aspect-square overflow-hidden border border-light-space/[0.08] bg-white/[0.03] light:border-black/[0.08] light:bg-section-grey-light/80",
            EDITORIAL_MEDIA_RADIUS_CLASS,
          )}
        >
          <img
            src={src}
            alt=""
            className="size-full object-cover brightness-[0.86] contrast-[1.04] saturate-[0.76] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035] light:brightness-[0.97] light:contrast-[1.01] light:saturate-[0.9]"
            loading="lazy"
            decoding="async"
            onError={() => {
              if (story.imageFallback && src !== story.imageFallback) setSrc(story.imageFallback);
            }}
          />
        </div>
        <div className="mt-3 flex flex-1 flex-col gap-1.5 pt-0.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-light-space/45 light:text-zinc-500">
            {detail?.metaLine?.split(" · ")[0] ?? "Jokuh Stories"}
          </p>
          <h3 className="font-sans text-[0.9375rem] font-semibold leading-snug tracking-[0em] text-light-space transition-colors group-hover:text-light-space/80 light:text-zinc-950 md:text-[0.95rem]">
            {detail?.title ?? story.title}
          </h3>
        </div>
      </TopNavAnchor>
    </article>
  );
}

function MoreStories({ currentSlug }: { currentSlug: string }) {
  const others = HOME_STORIES.filter((s) => s.slug !== currentSlug);
  if (others.length === 0) return null;

  return (
    <section className="bg-dark-space px-4 py-16 md:px-8 md:py-20" aria-labelledby="more-stories-heading">
      <div className={CONTENT_SHELL_WIDE}>
        <SectionHeaderRow title="More stories" actionLabel="View all" actionTo="/stories" />
        <div className="mt-0 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6 xl:gap-8">
          {others.slice(0, 2).map((story) => (
            <MoreStoryCard key={story.slug} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}

function renderSection(section: StorySection, key: number) {
  switch (section.kind) {
    case "prose":
      return <ProseBlock key={key} paragraphs={section.paragraphs} />;
    case "subhead":
      return <SubheadBlock key={key} text={section.text} />;
    case "featureText":
      return (
        <FeatureTextBlock
          key={key}
          title={section.title}
          subtitle={section.subtitle}
          paragraphs={section.paragraphs}
        />
      );
    case "imagesAsymmetric":
      return <AsymmetricImagesBlock key={key} large={section.large} small={section.small} />;
    case "triptych":
      return <TriptychBlock key={key} items={section.items} />;
    case "quote":
      return <QuoteBlock key={key} text={section.text} attribution={section.attribution} />;
    case "cta":
      return null;
    default:
      return null;
  }
}

export function StoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const story = getStoryDetail(slug);

  if (!story) {
    return <Navigate to="/stories" replace />;
  }

  useDocumentTitle(`${story.title} · Jokuh`);

  return (
    <MarketingPageFrame>
      <>
        <StoryHero story={story} />
        <StoryGallery images={story.heroGallery} />
        {story.sections.map((s, i) => renderSection(s, i))}
        <MoreStories currentSlug={story.slug} />
      </>
    </MarketingPageFrame>
  );
}
