import { cn } from "@jokuh/gooey";
import { useState } from "react";
import { TopNavAnchor } from "../TopNavAnchor";
import { EDITORIAL_MEDIA_RADIUS_CLASS } from "../system";
import { SectionHeaderRow } from "../system/sections";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import type { HomeStory } from "../../data/home-stories";
import { HOME_STORIES } from "../../data/home-stories";
import { getStoryDetail } from "../../data/stories-detail";
import { LANDING_MEDIA_HOVER_ZOOM } from "../../lib/landing-media-hover";

function StoryTileImage({
  primary,
  fallback,
  priority = false,
}: {
  primary: string;
  fallback?: string;
  priority?: boolean;
}) {
  const [src, setSrc] = useState(primary);
  return (
    <img
      src={src}
      alt=""
      className={cn(
        "size-full object-cover brightness-[0.86] contrast-[1.04] saturate-[0.76] light:brightness-[0.97] light:contrast-[1.01] light:saturate-[0.9]",
        LANDING_MEDIA_HOVER_ZOOM,
      )}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={() => {
        if (fallback && src !== fallback) setSrc(fallback);
      }}
    />
  );
}

function StoryCardCompact({ story, priority = false }: { story: HomeStory; priority?: boolean }) {
  const detail = getStoryDetail(story.slug);
  return (
    <article className="group flex h-full flex-col">
      <TopNavAnchor href={story.href} className="flex h-full flex-col no-underline">
        <div
          className={cn(
            "aspect-square overflow-hidden border border-light-space/[0.08] bg-white/[0.03] light:border-black/[0.08] light:bg-section-grey-light/80",
            EDITORIAL_MEDIA_RADIUS_CLASS,
          )}
        >
          <StoryTileImage primary={story.image} fallback={story.imageFallback} priority={priority} />
        </div>
        <div className="mt-3 flex flex-1 flex-col gap-1.5 pt-0.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-light-space/45 light:text-zinc-500">
            {detail?.metaLine?.split(" · ")[0] ?? "Jokuh Stories"}
          </p>
          <h2 className="font-sans text-[0.9375rem] font-semibold leading-snug tracking-[0em] text-light-space transition-colors group-hover:text-light-space/80 light:text-zinc-950 md:text-[0.95rem]">
            {detail?.title ?? story.title}
          </h2>
        </div>
      </TopNavAnchor>
    </article>
  );
}

export function StoriesSection() {
  const items = HOME_STORIES;

  return (
    <section
      id="stories"
      className="scroll-mt-24 bg-dark-space px-4 py-16 light:bg-white md:px-8 md:py-20"
    >
      <div className={CONTENT_SHELL_WIDE}>
        <SectionHeaderRow title="Stories" actionLabel="View all" actionTo="/stories" />

        {items.length > 0 ? (
          <div
            className={cn(
              "mt-0 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6 xl:gap-8",
              items.length === 1 && "md:grid-cols-1 md:max-w-lg md:justify-items-stretch",
              items.length === 2 && "md:grid-cols-2",
            )}
          >
            {items.map((story, i) => (
              <StoryCardCompact key={story.slug} story={story} priority={i === 0} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
