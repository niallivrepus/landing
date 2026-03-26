import { cn } from "@jokuh/gooey";
import { useState } from "react";
import { TopNavAnchor } from "../TopNavAnchor";
import { SectionHeaderRow } from "../system/sections";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { EDITORIAL_MEDIA_RADIUS_CLASS } from "../system";
import { HOME_STORIES } from "../../data/home-stories";
import { LANDING_MEDIA_HOVER_ZOOM } from "../../lib/landing-media-hover";

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

export function StoriesSection() {
  return (
    <section
      id="stories"
      className="scroll-mt-24 border-t border-light-space/[0.07] bg-dark-space px-4 py-16 md:px-8 md:py-20"
    >
      <div className={CONTENT_SHELL_WIDE}>
        <SectionHeaderRow title="Stories" actionLabel="View all" actionTo="/stories" />
        <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {HOME_STORIES.slice(0, 3).map((story) => (
            <TopNavAnchor key={story.title} href={story.href} className="group flex min-w-0 flex-1 flex-col">
              <div
                className={cn(
                  "relative aspect-square w-full shrink-0 overflow-hidden bg-smoke-2",
                  EDITORIAL_MEDIA_RADIUS_CLASS,
                  "ring-1 ring-light-space/[0.06] transition-[box-shadow,ring-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "group-hover:ring-light-space/[0.08] group-hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.62)] light:group-hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.1)]",
                )}
              >
                <StoryTileImage primary={story.image} fallback={story.imageFallback} />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-black/10 light:from-black/12 light:via-transparent light:to-black/[0.04]"
                  aria-hidden
                />
              </div>
              <p className="mt-3 text-left font-sans text-[13px] font-normal leading-snug tracking-wide text-light-space/50 md:text-[0.9375rem] md:tracking-normal md:text-light-space/55">
                {story.title}
              </p>
            </TopNavAnchor>
          ))}
        </div>
      </div>
    </section>
  );
}
