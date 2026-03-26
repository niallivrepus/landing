import { cn } from "@jokuh/gooey";
import { useState } from "react";
import { TopNavAnchor } from "../components/TopNavAnchor";
import { EDITORIAL_MEDIA_RADIUS_CLASS, MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { HOME_STORIES } from "../data/home-stories";
import { getStoryDetail } from "../data/stories-detail";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { LANDING_MEDIA_HOVER_ZOOM } from "../lib/landing-media-hover";

function StoryCardImage({
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
        "size-full object-cover brightness-[0.9] contrast-[1.03] saturate-[0.8]",
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

export function StoriesPage() {
  useDocumentTitle("Stories — Jokuh");

  return (
    <MarketingPageFrame
      withAntialiased
      withFontSans
      mainClassName={cn(CONTENT_SHELL_WIDE, "pb-24 pt-24 md:pt-28")}
    >
      <section className="space-y-12">
        <header className="max-w-3xl space-y-5">
          <h1 className="font-sans text-[2.5rem] font-semibold tracking-[-0.04em] text-light-space md:text-[3.25rem] md:leading-[1.05]">
            Stories
          </h1>
          <p className="font-sans text-[1.0625rem] leading-[1.7] text-light-space/62 md:text-[1.125rem]">
            Stories are where we tell the human side of Jokuh: the people, teams, and working lives that give the
            product context. These always open in the story detail template, separate from newsroom updates and
            product pages.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3">
          {HOME_STORIES.map((story) => {
            const detail = getStoryDetail(story.slug);
            return (
              <TopNavAnchor key={story.slug} href={story.href} className="group flex min-w-0 flex-col">
                <div
                  className={cn(
                    "relative aspect-square w-full shrink-0 overflow-hidden bg-smoke-2",
                    EDITORIAL_MEDIA_RADIUS_CLASS,
                    "ring-1 ring-light-space/[0.08] transition-[box-shadow,ring-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "group-hover:ring-light-space/[0.12] group-hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)] light:group-hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.12)]",
                  )}
                >
                  <StoryCardImage primary={story.image} fallback={story.imageFallback} />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-black/10"
                    aria-hidden
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-light-space/42">
                    {detail?.metaLine ?? "Jokuh Stories"}
                  </p>
                  <h2 className="font-sans text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em] text-light-space">
                    {detail?.title ?? story.title}
                  </h2>
                  {detail?.dek ? (
                    <p className="font-sans text-[15px] leading-7 text-light-space/56">{detail.dek}</p>
                  ) : null}
                </div>
              </TopNavAnchor>
            );
          })}
        </div>
      </section>
    </MarketingPageFrame>
  );
}
