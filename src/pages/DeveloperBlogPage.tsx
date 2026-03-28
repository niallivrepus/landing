import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@jokuh/gooey";
import { SiteLink } from "../components/SiteLink";
import { CONTENT_SHELL_WIDE, EDITORIAL_MEDIA_RADIUS_CLASS, MarketingPageFrame } from "../components/system";
import { DEVELOPER_BLOG_ENTRIES, type DeveloperBlogEntry } from "../data/developer-blog";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const DEVELOPER_BLOG_LAZY_BATCH = 9;

function formatDeveloperBlogDate(iso: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}

function DeveloperBlogMeta({ item }: { item: DeveloperBlogEntry }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.16em] text-light-space/46">
      <span className="text-light-space/72">{item.tag}</span>
      <span className="text-light-space/25">•</span>
      <span>{formatDeveloperBlogDate(item.publishedAt)}</span>
      <span className="text-light-space/25">•</span>
      <span>{item.readMinutes} min read</span>
    </p>
  );
}

function DeveloperBlogCard({
  item,
  featured = false,
}: {
  item: DeveloperBlogEntry;
  featured?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col">
      <SiteLink href={item.href} className="flex h-full flex-col no-underline">
        <div
          className={cn(
            "overflow-hidden border border-light-space/[0.08] bg-white/[0.03]",
            EDITORIAL_MEDIA_RADIUS_CLASS,
            featured ? "aspect-[16/10]" : "aspect-[4/5] sm:aspect-[4/4.6]",
          )}
        >
          <img
            src={item.image}
            alt=""
            className={cn(
              "size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]",
              EDITORIAL_MEDIA_RADIUS_CLASS,
            )}
          />
        </div>
        <div className={cn("flex flex-1 flex-col", featured ? "gap-4 pt-5" : "gap-3 pt-4")}>
          <DeveloperBlogMeta item={item} />
          <h2
            className={cn(
              "font-sans font-semibold leading-[1.04] tracking-[-0.03em] text-light-space transition-colors group-hover:text-light-space/82",
              featured ? "text-[2rem] md:text-[2.6rem]" : "text-[1.2rem] md:text-[1.45rem]",
            )}
          >
            {item.title}
          </h2>
          {featured ? (
            <p className="max-w-2xl text-[15px] leading-7 text-light-space/58 md:text-[16px]">
              {item.excerpt}
            </p>
          ) : null}
        </div>
      </SiteLink>
    </article>
  );
}

function DeveloperBlogCompactCard({ item }: { item: DeveloperBlogEntry }) {
  return (
    <article className="group flex h-full flex-col">
      <SiteLink href={item.href} className="flex h-full flex-col no-underline">
        <div
          className={cn(
            "aspect-square overflow-hidden border border-light-space/[0.08] bg-white/[0.03]",
            EDITORIAL_MEDIA_RADIUS_CLASS,
          )}
        >
          <img
            src={item.image}
            alt=""
            className={cn(
              "size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]",
              EDITORIAL_MEDIA_RADIUS_CLASS,
            )}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 pt-4">
          <DeveloperBlogMeta item={item} />
          <h2 className="font-sans text-[1.2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-light-space transition-colors group-hover:text-light-space/82">
            {item.title}
          </h2>
        </div>
      </SiteLink>
    </article>
  );
}

function DeveloperBlogArchiveGrid({ items }: { items: readonly DeveloperBlogEntry[] }) {
  const featured = items[0];
  const support = items.slice(1, 4);
  const remainder = items.slice(4);
  const [visibleCount, setVisibleCount] = useState(DEVELOPER_BLOG_LAZY_BATCH);
  const hasMore = visibleCount < remainder.length;
  const visibleItems = remainder.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(DEVELOPER_BLOG_LAZY_BATCH);
  }, [items]);

  return (
    <div>
      {featured ? (
        <div className="space-y-6 md:space-y-8 lg:space-y-0">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 xl:gap-8">
            <div className="min-w-0">
              <div className="lg:sticky lg:top-16">
                <DeveloperBlogCard item={featured} featured />
              </div>
            </div>

            {support.length > 0 ? (
              <div className="mt-6 hidden flex-col gap-4 self-start lg:mt-0 lg:flex lg:w-[320px] lg:gap-4">
                {support.map((item) => (
                  <DeveloperBlogCompactCard key={`desktop-${item.id}`} item={item} />
                ))}
              </div>
            ) : null}
          </div>

          {support.length > 0 ? (
            <div
              className={cn(
                "mt-6 flex gap-4 overflow-x-auto overscroll-x-contain lg:hidden",
                "snap-x snap-mandatory scroll-pl-0 scroll-pr-0 pb-2",
                "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              )}
            >
              {support.map((item) => (
                <div
                  key={`carousel-${item.id}`}
                  className="w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[52vw] sm:max-w-[300px] md:w-[38vw] md:max-w-[320px]"
                >
                  <DeveloperBlogCompactCard item={item} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {remainder.length > 0 ? (
        <div className="mt-12 border-t border-light-space/10 pt-10 md:mt-16 md:pt-12">
          <h3 className="mb-8 font-sans text-lg font-semibold tracking-tight text-light-space">
            Recent posts
          </h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <DeveloperBlogCompactCard key={item.id} item={item} />
            ))}
          </div>
          {hasMore ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((count) => Math.min(count + DEVELOPER_BLOG_LAZY_BATCH, remainder.length))
                }
                className="inline-flex h-11 items-center rounded-full border border-light-space/[0.12] bg-white/[0.03] px-5 font-sans text-[13px] font-semibold text-light-space transition-colors hover:bg-white/[0.06]"
              >
                Load more
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function DeveloperBlogPage() {
  useDocumentTitle("Developer Blog — Jokuh");

  return (
    <MarketingPageFrame
      withAntialiased
      withFontSans
      mainClassName={cn(CONTENT_SHELL_WIDE, "pb-24 pt-24 md:pt-28")}
    >
      <section className="space-y-10">
        <header className="space-y-8 md:space-y-10">
          <h1 className="font-sans text-[2.5rem] font-semibold tracking-[-0.04em] text-light-space md:text-[3.25rem] md:leading-[1.05]">
            Developer Blog
          </h1>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div
              className={cn(
                "flex min-w-0 items-center gap-x-5 gap-y-2 font-sans text-[15px] md:text-[16px]",
                "w-full overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "lg:w-auto lg:flex-wrap lg:overflow-visible",
              )}
            >
              {["SDK", "Guides", "Cookbook", "Platform", "Models", "Community"].map((item) => (
                <span key={item} className="shrink-0 text-light-space/45">
                  {item}
                </span>
              ))}
            </div>

            <div className="flex w-full items-center justify-between gap-4 font-sans text-[14px] text-light-space lg:w-auto lg:justify-start lg:gap-6 xl:gap-7">
              <span className="text-light-space/55">{DEVELOPER_BLOG_ENTRIES.length} posts</span>
              <span className="inline-flex items-center gap-1 text-light-space/45">
                Newest first
                <ChevronDown className="size-[17px] shrink-0 opacity-90" strokeWidth={1.75} />
              </span>
            </div>
          </div>
        </header>

        <DeveloperBlogArchiveGrid items={DEVELOPER_BLOG_ENTRIES} />
      </section>
    </MarketingPageFrame>
  );
}
