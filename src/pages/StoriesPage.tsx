import { cn, useTheme } from "@jokuh/gooey";
import { useState } from "react";
import { SiteLink } from "../components/SiteLink";
import { TopNavAnchor } from "../components/TopNavAnchor";
import { ArticleMetaRow, MarketingPageFrame } from "../components/system";
import { SquircleMedia } from "../components/system/squircle";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { RSS_FEED_PATH } from "../config/rss";
import { HOME_STORIES } from "../data/home-stories";
import { getStoryDetail } from "../data/stories-detail";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { LANDING_MEDIA_HOVER_ZOOM } from "../lib/landing-media-hover";

function StoryCardImage({
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
        "size-full object-cover brightness-[0.9] contrast-[1.03] saturate-[0.8] light:brightness-[0.98] light:contrast-[1.01] light:saturate-[0.92]",
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

function IndexStoryCardFeatured({ story }: { story: (typeof HOME_STORIES)[number] }) {
  const detail = getStoryDetail(story.slug);
  return (
    <article className="group flex h-full flex-col">
      <TopNavAnchor href={story.href} className="flex h-full flex-col no-underline">
        <SquircleMedia className="aspect-[16/10]">
          <StoryCardImage primary={story.image} fallback={story.imageFallback} priority />
        </SquircleMedia>
        <div className="flex flex-1 flex-col gap-4 pt-5">
          <ArticleMetaRow metaLine={detail?.metaLine ?? "Jokuh Stories"} align="start" size="compact" />
          <h2
            className={cn(
              "font-sans font-semibold leading-[1.04] tracking-[0em] text-light-space transition-colors group-hover:text-light-space/82 light:text-zinc-950 light:group-hover:text-zinc-700",
              "text-[2rem] md:text-[2.6rem]",
            )}
          >
            {detail?.title ?? story.title}
          </h2>
          {detail?.dek ? (
            <p className="max-w-2xl text-[15px] leading-7 text-light-space/58 light:text-zinc-600 md:text-[16px]">{detail.dek}</p>
          ) : null}
        </div>
      </TopNavAnchor>
    </article>
  );
}

function IndexStoryCardCompact({ story }: { story: (typeof HOME_STORIES)[number] }) {
  const detail = getStoryDetail(story.slug);
  return (
    <article className="group flex h-full flex-col">
      <TopNavAnchor href={story.href} className="flex h-full flex-col no-underline">
        <SquircleMedia className="aspect-square">
          <StoryCardImage primary={story.image} fallback={story.imageFallback} />
        </SquircleMedia>
        <div className="flex flex-1 flex-col gap-3 pt-4">
          <ArticleMetaRow metaLine={detail?.metaLine ?? "Jokuh Stories"} align="start" size="compact" />
          <h2 className="font-sans text-[1.2rem] font-semibold leading-[1.08] tracking-[0em] text-light-space transition-colors group-hover:text-light-space/82 light:text-zinc-950 light:group-hover:text-zinc-700 md:text-[1.45rem]">
            {detail?.title ?? story.title}
          </h2>
        </div>
      </TopNavAnchor>
    </article>
  );
}

export function StoriesPage() {
  useDocumentTitle("Jokuh Stories");
  const { resolvedTheme } = useTheme();
  const items = [...HOME_STORIES];
  const featured = items[0];
  const support = items.slice(1, 4);
  const remainder = items.slice(4);

  return (
    <MarketingPageFrame
      withAntialiased
      withFontSans
      theme={resolvedTheme === "light" ? "light" : "dark"}
      mainClassName={cn(CONTENT_SHELL_WIDE, "pb-24 pt-24 md:pt-28")}
    >
      <section className="space-y-12">
        <header className="space-y-5">
          <div className="flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-sans text-[2.5rem] font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-[3.25rem] md:leading-[1.05]">
              Stories
            </h1>
            <SiteLink
              href={RSS_FEED_PATH}
              className="inline-flex w-fit items-center rounded-full border border-light-space/[0.12] px-4 py-2 font-sans text-[13px] font-semibold text-light-space/70 transition-colors hover:border-light-space/[0.22] hover:text-light-space light:border-black/[0.1] light:bg-section-grey-light light:text-zinc-700 light:hover:border-black/[0.16] light:hover:text-zinc-950"
            >
              RSS feed
            </SiteLink>
          </div>
          <p className="max-w-3xl font-sans text-[1.0625rem] leading-[1.7] text-light-space/62 light:text-zinc-600 md:text-[1.125rem]">
            These are pieces about how Jokuh shows up in a day. Some come from real people. Others
            are labeled as scenarios we wrote so you can see the product — they are not case studies.
          </p>
        </header>

        {featured ? (
          <div className="space-y-6 md:space-y-8 lg:space-y-0">
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 xl:gap-8">
              <div className="min-w-0">
                <div className="lg:sticky lg:top-16">
                  <IndexStoryCardFeatured story={featured} />
                </div>
              </div>

              {support.length > 0 ? (
                <div className="mt-6 hidden flex-col gap-4 self-start lg:mt-0 lg:flex lg:w-[320px] lg:gap-4">
                  {support.map((story) => (
                    <IndexStoryCardCompact key={story.slug} story={story} />
                  ))}
                </div>
              ) : null}
            </div>

            {support.length > 0 ? (
              <div
                className={cn(
                  "mt-6 -mx-3 flex gap-4 overflow-x-auto overscroll-x-contain px-3 md:mx-0 md:px-0 lg:hidden",
                  "snap-x snap-mandatory scroll-pl-3 scroll-pr-3 pb-2 md:scroll-pl-0 md:scroll-pr-0",
                  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                )}
              >
                {support.map((story) => (
                  <div
                    key={story.slug}
                    className="w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[52vw] sm:max-w-[300px] md:w-[38vw] md:max-w-[320px]"
                  >
                    <IndexStoryCardCompact story={story} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {remainder.length > 0 ? (
          <div className="mt-12 pt-10 md:mt-16 md:pt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {remainder.map((story) => (
                <IndexStoryCardCompact key={story.slug} story={story} />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </MarketingPageFrame>
  );
}
