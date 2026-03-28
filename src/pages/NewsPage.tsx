import {
  DEFAULT_NEWS_CARD_GRADIENT,
  NEWS_CATEGORIES,
  NEWS_FILTER_TOPICS,
  NEWS_FILTER_YEARS,
  NEWS_ITEMS,
  formatNewsDate,
  getNewsHref,
  type NewsCategory,
  type NewsItem,
  type NewsTopic,
} from "../data/news";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@jokuh/gooey";
import { NewsCardArt } from "../components/NewsCardArt";
import { SiteLink } from "../components/SiteLink";
import { EDITORIAL_MEDIA_RADIUS_CLASS, MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

type SortOrder = "newest" | "oldest";
type ViewMode = "grid" | "list";
const NEWSROOM_LAZY_BATCH = 9;

function GridViewIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className="size-[20px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[
        [2.5, 2.5],
        [10.5, 2.5],
        [2.5, 10.5],
        [10.5, 10.5],
      ].map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="6"
          height="6"
          rx="1.4"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.6"
        />
      ))}
    </svg>
  );
}

function ListViewIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className="size-[20px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[4, 10, 16].map((y) => (
        <g key={y}>
          <circle cx="3.3" cy={y} r={active ? "1.8" : "1.2"} fill="currentColor" />
          <path d={`M7 ${y}H17`} stroke="currentColor" strokeWidth={active ? "2.2" : "1.6"} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

const JOURNAL_CATEGORIES: Array<NewsCategory | "All"> = [
  "All",
  ...NEWS_CATEGORIES.filter((category): category is NewsCategory => category !== "All"),
];

function yearOf(iso: string) {
  return new Date(iso + "T12:00:00").getFullYear();
}

function newsHref(item: NewsItem) {
  return getNewsHref(item);
}

function JournalMeta({ item }: { item: NewsItem }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.16em] text-light-space/46">
      <span className="text-light-space/72">{item.category}</span>
      <span className="text-light-space/25">•</span>
      <span>{formatNewsDate(item.publishedAt)}</span>
      <span className="text-light-space/25">•</span>
      <span>{item.readMinutes} min read</span>
    </p>
  );
}

function JournalGridCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  return (
    <article className="group flex h-full flex-col">
      <SiteLink href={newsHref(item)} className="flex h-full flex-col no-underline">
        <div
          className={cn(
            "overflow-hidden border border-light-space/[0.08] bg-white/[0.03]",
            EDITORIAL_MEDIA_RADIUS_CLASS,
            featured ? "aspect-[16/10]" : "aspect-[4/5] sm:aspect-[4/4.6]",
          )}
        >
          <NewsCardArt
            gradient={item.cardGradient?.trim() || DEFAULT_NEWS_CARD_GRADIENT}
            image={item.cardImage}
            lavaLamp={item.lavaLamp}
            className={EDITORIAL_MEDIA_RADIUS_CLASS}
          />
        </div>
        <div className={cn("flex flex-1 flex-col", featured ? "gap-4 pt-5" : "gap-3 pt-4")}>
          <JournalMeta item={item} />
          <h2
            className={cn(
              "font-sans font-semibold leading-[1.04] tracking-[-0.03em] text-light-space transition-colors group-hover:text-light-space/82",
              featured ? "text-[2rem] md:text-[2.6rem]" : "text-[1.2rem] md:text-[1.45rem]",
            )}
          >
            {item.title}
          </h2>
          {featured && item.excerpt ? (
            <p className="max-w-2xl text-[15px] leading-7 text-light-space/58 md:text-[16px]">
              {item.excerpt}
            </p>
          ) : null}
        </div>
      </SiteLink>
    </article>
  );
}

function JournalCompactCard({ item }: { item: NewsItem }) {
  return (
    <article className="group flex h-full flex-col">
      <SiteLink href={newsHref(item)} className="flex h-full flex-col no-underline">
        <div
          className={cn(
            "aspect-square overflow-hidden border border-light-space/[0.08] bg-white/[0.03]",
            EDITORIAL_MEDIA_RADIUS_CLASS,
          )}
        >
          <NewsCardArt
            gradient={item.cardGradient?.trim() || DEFAULT_NEWS_CARD_GRADIENT}
            image={item.cardImage}
            lavaLamp={item.lavaLamp}
            className={EDITORIAL_MEDIA_RADIUS_CLASS}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 pt-4">
          <JournalMeta item={item} />
          <h2 className="font-sans text-[1.2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-light-space transition-colors group-hover:text-light-space/82">
            {item.title}
          </h2>
        </div>
      </SiteLink>
    </article>
  );
}

function JournalListItem({ item }: { item: NewsItem }) {
  return (
    <article className="grid gap-5 border-t border-light-space/[0.08] py-6 first:border-t-0 first:pt-0 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8 lg:py-8">
      <SiteLink href={newsHref(item)} className={cn("block overflow-hidden", EDITORIAL_MEDIA_RADIUS_CLASS)}>
        <div className={cn("aspect-[4/3] border border-light-space/[0.08] bg-white/[0.03]", EDITORIAL_MEDIA_RADIUS_CLASS)}>
          <NewsCardArt
            gradient={item.cardGradient?.trim() || DEFAULT_NEWS_CARD_GRADIENT}
            image={item.cardImage}
            lavaLamp={item.lavaLamp}
            className={EDITORIAL_MEDIA_RADIUS_CLASS}
          />
        </div>
      </SiteLink>

      <div className="flex min-w-0 flex-col gap-3">
        <JournalMeta item={item} />
        <h2 className="font-sans text-[1.5rem] font-semibold leading-[1.08] tracking-[-0.03em] text-light-space">
          <SiteLink href={newsHref(item)} className="transition-colors hover:text-light-space/80">
            {item.title}
          </SiteLink>
        </h2>
        {item.excerpt ? (
          <p className="max-w-3xl text-[15px] leading-7 text-light-space/58">{item.excerpt}</p>
        ) : null}
      </div>
    </article>
  );
}

function JournalFeedGrid({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  const featured = items[0];
  const support = items.slice(1, 4);
  const remainder = items.slice(4);

  function FeedWall({
    wallItems,
    title,
  }: {
    wallItems: NewsItem[];
    title?: string;
  }) {
    const [visibleCount, setVisibleCount] = useState(NEWSROOM_LAZY_BATCH);
    const hasMore = visibleCount < wallItems.length;
    const visibleItems = wallItems.slice(0, visibleCount);

    useEffect(() => {
      setVisibleCount(NEWSROOM_LAZY_BATCH);
    }, [wallItems]);

    if (wallItems.length === 0) return null;

    return (
      <div className="mt-12 border-t border-light-space/10 pt-10 md:mt-16 md:pt-12">
        {title ? (
          <h3 className="mb-8 font-sans text-lg font-semibold tracking-tight text-light-space">{title}</h3>
        ) : null}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item) => (
            <JournalCompactCard key={item.id} item={item} />
          ))}
        </div>
        {hasMore ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => Math.min(count + NEWSROOM_LAZY_BATCH, wallItems.length))}
              className="inline-flex h-11 items-center rounded-full border border-light-space/[0.12] bg-white/[0.03] px-5 font-sans text-[13px] font-semibold text-light-space transition-colors hover:bg-white/[0.06]"
            >
              Load more
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      {featured ? (
        <div className="space-y-6 md:space-y-8 lg:space-y-0">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 xl:gap-8">
            <div className="min-w-0">
              <div className="lg:sticky lg:top-16">
                <JournalGridCard item={featured} featured />
              </div>
            </div>

            {support.length > 0 ? (
              <div className="mt-6 hidden flex-col gap-4 self-start lg:mt-0 lg:flex lg:w-[320px] lg:gap-4">
                {support.map((item) => (
                  <JournalCompactCard key={`desktop-${item.id}`} item={item} />
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
                  <JournalCompactCard item={item} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <FeedWall wallItems={remainder} title="Recent news" />
    </div>
  );
}

function JournalList({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      {items.map((item) => (
        <JournalListItem key={item.id} item={item} />
      ))}
    </div>
  );
}

export function NewsPage() {
  useDocumentTitle("Newsroom — Jokuh");

  const [category, setCategory] = useState<NewsCategory | "All">("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<Set<NewsTopic>>(new Set());
  const [selectedYears, setSelectedYears] = useState<Set<number>>(new Set());

  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);
  const sortPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFilterOpen(false);
        setSortOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        sortOpen &&
        !sortBtnRef.current?.contains(target) &&
        !sortPanelRef.current?.contains(target)
      ) {
        setSortOpen(false);
      }

      if (
        filterOpen &&
        !filterBtnRef.current?.contains(target) &&
        !filterPanelRef.current?.contains(target)
      ) {
        setFilterOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [filterOpen, sortOpen]);

  const filtered = useMemo(() => {
    let list: NewsItem[] = [...NEWS_ITEMS];

    if (category !== "All") {
      list = list.filter((item) => item.category === category);
    }

    if (selectedTopics.size > 0) {
      list = list.filter((item) => item.topics.some((topic) => selectedTopics.has(topic)));
    }

    if (selectedYears.size > 0) {
      list = list.filter((item) => selectedYears.has(yearOf(item.publishedAt)));
    }

    list.sort((a, b) => {
      const aTime = new Date(a.publishedAt + "T12:00:00").getTime();
      const bTime = new Date(b.publishedAt + "T12:00:00").getTime();
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });

    return list;
  }, [category, selectedTopics, selectedYears, sortOrder]);

  const activeFilterCount =
    (category === "All" ? 0 : 1) + selectedTopics.size + selectedYears.size;
  const hasActiveFilters = activeFilterCount > 0;

  function toggleTopic(topic: NewsTopic) {
    setSelectedTopics((previous) => {
      const next = new Set(previous);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  }

  function toggleYear(year: number) {
    setSelectedYears((previous) => {
      const next = new Set(previous);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  }

  function clearFilters() {
    setCategory("All");
    setSelectedTopics(new Set());
    setSelectedYears(new Set());
  }

  const activeLabels = [
    ...(category === "All" ? [] : [category]),
    ...Array.from(selectedTopics),
    ...Array.from(selectedYears, (year) => String(year)),
  ];

  return (
    <MarketingPageFrame
      withAntialiased
      withFontSans
      mainClassName={cn(CONTENT_SHELL_WIDE, "pb-24 pt-24 md:pt-28")}
    >
      <section className="space-y-10">
        <header className="space-y-8 md:space-y-10">
          <h1 className="font-sans text-[2.5rem] font-semibold tracking-[-0.04em] text-light-space md:text-[3.25rem] md:leading-[1.05]">
            Newsroom
          </h1>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div
              className={cn(
                "flex min-w-0 items-center gap-x-5 gap-y-2 font-sans text-[15px] md:text-[16px]",
                "w-full overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "lg:w-auto lg:flex-wrap lg:overflow-visible",
              )}
            >
              {JOURNAL_CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    "shrink-0 transition-colors",
                    item === category ? "text-light-space" : "text-light-space/45 hover:text-light-space/75",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex w-full items-center justify-between gap-4 font-sans text-[14px] text-light-space lg:w-auto lg:justify-start lg:gap-6 xl:gap-7">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:gap-x-7">
                <div className="relative">
                  <button
                    ref={filterBtnRef}
                    type="button"
                    onClick={() => {
                      setSortOpen(false);
                      setFilterOpen((open) => !open);
                    }}
                    className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
                    aria-expanded={filterOpen}
                  >
                    <span>Filter</span>
                    {filterOpen ? (
                      <X className="size-[17px] shrink-0 opacity-90" strokeWidth={1.75} />
                    ) : (
                      <SlidersHorizontal className="size-[17px] shrink-0 opacity-90" strokeWidth={1.75} />
                    )}
                    {hasActiveFilters ? (
                      <span className="text-light-space/40" aria-hidden>
                        ({activeFilterCount})
                      </span>
                    ) : null}
                  </button>

                  {filterOpen ? (
                    <div
                      ref={filterPanelRef}
                      className="absolute left-0 top-full z-40 mt-3 w-[min(92vw,34rem)] rounded-[26px] border border-light-space/[0.1] bg-smoke-2 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.42)] light:border-black/10 light:bg-white light:shadow-[0_20px_60px_rgba(0,0,0,0.12)] lg:left-auto lg:right-0"
                    >
                    <div className="flex items-start justify-between gap-4 border-b border-light-space/[0.08] pb-4">
                      <div>
                        <p className="text-[15px] font-semibold tracking-tight text-light-space">
                          Refine the feed
                        </p>
                        <p className="mt-1 text-[13px] leading-6 text-light-space/50">
                          Mix categories with topic and year filters.
                        </p>
                      </div>
                      {hasActiveFilters ? (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-[12px] font-medium uppercase tracking-[0.14em] text-light-space/55 transition-colors hover:text-light-space"
                        >
                          Clear all
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-5 grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-light-space/38">
                          Topic
                        </p>
                        <ul className="space-y-3">
                          {NEWS_FILTER_TOPICS.map((topic) => (
                            <li key={topic}>
                              <label className="flex cursor-pointer items-center gap-3 text-[14px] text-light-space/88">
                                <input
                                  type="checkbox"
                                  checked={selectedTopics.has(topic)}
                                  onChange={() => toggleTopic(topic)}
                                  className="size-4 rounded-full border border-light-space/35 bg-transparent accent-light-space"
                                />
                                <span>{topic}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-light-space/38">
                          Year
                        </p>
                        <ul className="space-y-3">
                          {NEWS_FILTER_YEARS.map((year) => (
                            <li key={year}>
                              <label className="flex cursor-pointer items-center gap-3 text-[14px] text-light-space/88">
                                <input
                                  type="checkbox"
                                  checked={selectedYears.has(year)}
                                  onChange={() => toggleYear(year)}
                                  className="size-4 rounded-full border border-light-space/35 bg-transparent accent-light-space"
                                />
                                <span>{year}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  ) : null}
                </div>

                <div className="relative">
                  <button
                    ref={sortBtnRef}
                    type="button"
                    onClick={() => {
                      setFilterOpen(false);
                      setSortOpen((open) => !open);
                    }}
                    className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
                    aria-expanded={sortOpen}
                  >
                    <span>Sort</span>
                    <ChevronDown
                      className={cn("size-[17px] shrink-0 opacity-90 transition-transform", sortOpen && "rotate-180")}
                      strokeWidth={1.75}
                    />
                  </button>

                  {sortOpen ? (
                    <div
                      ref={sortPanelRef}
                      role="menu"
                      className="absolute left-0 top-full z-40 mt-3 min-w-[220px] rounded-[22px] border border-light-space/[0.1] bg-smoke-2 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.42)] light:border-black/10 light:bg-white light:shadow-[0_18px_50px_rgba(0,0,0,0.12)] lg:left-auto lg:right-0"
                    >
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 hover:bg-white/[0.06] light:hover:bg-black/[0.04]">
                      <input
                        type="radio"
                        name="news-sort"
                        checked={sortOrder === "newest"}
                        onChange={() => setSortOrder("newest")}
                        className="size-4 accent-light-space"
                      />
                      <span className="text-[13px] text-light-space">Newest first</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 hover:bg-white/[0.06] light:hover:bg-black/[0.04]">
                      <input
                        type="radio"
                        name="news-sort"
                        checked={sortOrder === "oldest"}
                        onChange={() => setSortOrder("oldest")}
                        className="size-4 accent-light-space"
                      />
                      <span className="text-[13px] text-light-space">Oldest first</span>
                    </label>
                  </div>
                  ) : null}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-0.5 pl-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid"
                      ? "text-light-space"
                      : "text-light-space/38 hover:text-light-space/65",
                  )}
                  aria-label="Grid view"
                >
                  <GridViewIcon active={viewMode === "grid"} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list"
                      ? "text-light-space"
                      : "text-light-space/38 hover:text-light-space/65",
                  )}
                  aria-label="List view"
                >
                  <ListViewIcon active={viewMode === "list"} />
                </button>
              </div>
            </div>
          </div>

          {activeLabels.length > 0 ? (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-sans text-[13px] text-light-space/42">
              <span className="text-light-space/55">{filtered.length} articles</span>
              <span className="text-light-space/20" aria-hidden>
                ·
              </span>
              {activeLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          ) : null}
        </header>

        {filtered.length === 0 ? (
          <div className="rounded-[28px] border border-light-space/[0.08] bg-white/[0.03] px-6 py-12 text-center">
            <p className="text-[15px] text-light-space/52">No newsroom articles match your current filters.</p>
          </div>
        ) : viewMode === "grid" ? (
          <JournalFeedGrid items={filtered} />
        ) : (
          <JournalList items={filtered} />
        )}
      </section>
    </MarketingPageFrame>
  );
}
