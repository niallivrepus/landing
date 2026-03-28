import { cn } from "@jokuh/gooey";
import { useState } from "react";
import { TopNavAnchor } from "../TopNavAnchor";
import { SectionHeaderRow } from "../system/sections";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { EDITORIAL_MEDIA_RADIUS_CLASS } from "../system";
import type { HomeStory } from "../../data/home-stories";
import { HOME_STORIES } from "../../data/home-stories";
import { LANDING_MEDIA_HOVER_ZOOM } from "../../lib/landing-media-hover";

const STORY_CAROUSEL_SCROLL =
  "flex gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory scroll-pl-4 scroll-pr-4";

function StoryTileImage({
  primary,
  fallback,
}: {
  primary: string;
  fallback?: string;
}) {
  const [src, setSrc] = useState(primary);
  return (
    <img
      src={src}
      alt=""
      className={cn(
        "size-full object-cover brightness-[0.86] contrast-[1.04] saturate-[0.76]",
        LANDING_MEDIA_HOVER_ZOOM,
      )}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (fallback && src !== fallback) setSrc(fallback);
      }}
    />
  );
}

function StoryCardLink({
  story,
  imageRadiusClass,
  captionClassName,
  className,
}: {
  story: HomeStory;
  imageRadiusClass: string;
  captionClassName: string;
  className?: string;
}) {
  return (
    <TopNavAnchor href={story.href} className={cn("group flex min-w-0 flex-col", className)}>
      <div
        className={cn(
          "relative aspect-square w-full shrink-0 overflow-hidden bg-smoke-2 light:bg-zinc-100",
          imageRadiusClass,
          "ring-1 ring-light-space/[0.06] transition-[box-shadow,ring-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] light:ring-black/[0.08]",
          "group-hover:ring-light-space/[0.08] group-hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.62)] light:group-hover:ring-black/[0.12] light:group-hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.1)]",
        )}
      >
        <StoryTileImage primary={story.image} fallback={story.imageFallback} />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-black/10 light:from-black/12 light:via-transparent light:to-black/[0.04]"
          aria-hidden
        />
      </div>
      <p className={captionClassName}>{story.title}</p>
    </TopNavAnchor>
  );
}

export function StoriesSection() {
  const desktopStories = HOME_STORIES.slice(0, 3);
  const captionDesktop =
    "mt-3 text-left font-sans text-[13px] font-normal leading-snug tracking-wide text-light-space/50 light:text-zinc-600 md:text-[0.9375rem] md:tracking-normal md:text-light-space/55 md:light:text-zinc-600";

  return (
    <section
      id="stories"
      className="scroll-mt-24 border-t border-light-space/[0.07] bg-dark-space px-4 py-16 light:border-black/[0.08] light:bg-white md:px-8 md:py-20"
    >
      <div className={CONTENT_SHELL_WIDE}>
        <SectionHeaderRow title="Stories" actionLabel="View all" actionTo="/stories" />

        <div className="-mx-4 md:mx-0 md:hidden">
          <div
            className={STORY_CAROUSEL_SCROLL}
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {HOME_STORIES.map((story) => (
              <StoryCardLink
                key={story.slug}
                story={story}
                imageRadiusClass="rounded-2xl"
                captionClassName={cn(
                  "mt-4 text-left font-sans text-[15px] font-medium leading-snug tracking-[-0.02em] text-light-space light:text-zinc-950",
                )}
                className="w-[min(82vw,340px)] shrink-0 snap-center"
              />
            ))}
          </div>
        </div>

        <div className="hidden gap-6 md:flex md:gap-8 lg:gap-10">
          {desktopStories.map((story) => (
            <StoryCardLink
              key={story.slug}
              story={story}
              imageRadiusClass={EDITORIAL_MEDIA_RADIUS_CLASS}
              captionClassName={captionDesktop}
              className="min-w-0 flex-1"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
