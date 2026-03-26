import {
  DEFAULT_NEWS_CARD_GRADIENT,
  NEWS_CATEGORIES,
  NEWS_FILTER_TOPICS,
  NEWS_FILTER_YEARS,
  NEWS_ITEMS,
  formatNewsDate,
  type NewsCategory,
  type NewsItem,
  type NewsTopic,
} from "../data/news";
import { ChevronDown, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SiteTopBar } from "../components/SiteTopBar";
import { Link } from "react-router-dom";

type SortOrder = "newest" | "oldest";
type ViewMode = "list" | "grid";

function yearOf(iso: string) {
  return new Date(iso + "T12:00:00").getFullYear();
}

function NewsTitleLink({ item, className }: { item: NewsItem; className?: string }) {
  const href = item.externalUrl ?? item.internalHref ?? "/news";
  if (item.externalUrl) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }
  if (href.startsWith("/") && !href.includes("#")) {
    return (
      <Link to={href} className={className}>
        {item.title}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {item.title}
    </a>
  );
}

export function NewsPage() {
  const [category, setCategory] = useState<NewsCategory | "All">("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<Set<NewsTopic>>(new Set());
  const [selectedYears, setSelectedYears] = useState<Set<number>>(new Set());

  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);
  const sortPanelRef = useRef<HTMLDivElement>(null);
  const filterModalRef = useRef<HTMLDivElement>(null);

  const closeAllPopovers = useCallback(() => {
    setFilterOpen(false);
    setSortOpen(false);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAllPopovers();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAllPopovers]);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (sortOpen) {
        if (
          sortBtnRef.current?.contains(t) ||
          sortPanelRef.current?.contains(t)
        ) {
          return;
        }
        setSortOpen(false);
      }
      if (filterOpen) {
        if (filterBtnRef.current?.contains(t) || filterModalRef.current?.contains(t)) {
          return;
        }
        setFilterOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [filterOpen, sortOpen]);

  const filtered = useMemo(() => {
    let list: NewsItem[] = [...NEWS_ITEMS];
    if (category !== "All") {
      list = list.filter((n) => n.category === category);
    }
    if (selectedTopics.size > 0) {
      list = list.filter((n) => n.topics.some((tp) => selectedTopics.has(tp)));
    }
    if (selectedYears.size > 0) {
      list = list.filter((n) => selectedYears.has(yearOf(n.publishedAt)));
    }
    list.sort((a, b) => {
      const ta = new Date(a.publishedAt).getTime();
      const tb = new Date(b.publishedAt).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
    return list;
  }, [category, selectedTopics, selectedYears, sortOrder]);

  function toggleTopic(t: NewsTopic) {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }

  function toggleYear(y: number) {
    setSelectedYears((prev) => {
      const next = new Set(prev);
      if (next.has(y)) next.delete(y);
      else next.add(y);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white antialiased">
      <SiteTopBar />

      <main className="mx-auto max-w-[1380px] px-4 pb-24 pt-24 md:px-6 md:pt-28">
        <h1 className="text-[2rem] font-semibold tracking-tight md:text-5xl md:font-semibold">
          Recent news
        </h1>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] md:gap-x-6">
            {NEWS_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={
                  c === category
                    ? "text-white"
                    : "text-white/45 transition-colors hover:text-white/80"
                }
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative flex flex-wrap items-center gap-5 text-[13px]">
            <button
              ref={filterBtnRef}
              type="button"
              onClick={() => {
                setSortOpen(false);
                setFilterOpen((v) => !v);
              }}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white"
              aria-expanded={filterOpen}
            >
              Filter
              {filterOpen ? (
                <X className="size-4 opacity-80" strokeWidth={1.75} />
              ) : (
                <SlidersHorizontal className="size-4 opacity-80" strokeWidth={1.75} />
              )}
            </button>

            <div className="relative">
              <button
                ref={sortBtnRef}
                type="button"
                onClick={() => {
                  setFilterOpen(false);
                  setSortOpen((v) => !v);
                }}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white"
                aria-expanded={sortOpen}
              >
                Sort
                <ChevronDown
                  className={`size-4 opacity-80 transition-transform ${sortOpen ? "rotate-180" : ""}`}
                  strokeWidth={1.75}
                />
              </button>
              {sortOpen ? (
                <div
                  ref={sortPanelRef}
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-white/[0.12] bg-[#1c1c1c] p-2 shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
                >
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/[0.06]">
                    <input
                      type="radio"
                      name="news-sort"
                      checked={sortOrder === "newest"}
                      onChange={() => setSortOrder("newest")}
                      className="size-4 accent-white"
                    />
                    <span className="text-[13px]">Newest → oldest</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/[0.06]">
                    <input
                      type="radio"
                      name="news-sort"
                      checked={sortOrder === "oldest"}
                      onChange={() => setSortOrder("oldest")}
                      className="size-4 accent-white"
                    />
                    <span className="text-[13px]">Oldest → newest</span>
                  </label>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-1 rounded-full border border-white/[0.1] p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                className={`rounded-full p-2 transition-colors ${
                  viewMode === "grid" ? "bg-white/[0.12] text-white" : "text-white/40 hover:text-white/70"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-[18px]" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
                className={`rounded-full p-2 transition-colors ${
                  viewMode === "list" ? "bg-white/[0.12] text-white" : "text-white/40 hover:text-white/70"
                }`}
                aria-label="List view"
              >
                <List className="size-[18px]" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        {filterOpen ? (
          <>
            <div className="fixed inset-0 z-40 bg-black/60" aria-hidden />
            <div
              ref={filterModalRef}
              role="dialog"
              aria-label="Filter news"
              className="fixed left-1/2 top-[22%] z-50 w-[min(92vw,520px)] -translate-x-1/2 rounded-2xl border border-white/[0.1] bg-[#1a1a1a] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.65)] md:top-[28%]"
            >
              <div className="grid gap-8 md:grid-cols-2 md:gap-0">
                <div className="md:border-r md:border-white/[0.08] md:pr-8">
                  <p className="mb-4 text-[11px] font-medium uppercase tracking-wider text-white/40">
                    Topic
                  </p>
                  <ul className="space-y-3">
                    {NEWS_FILTER_TOPICS.map((t) => (
                      <li key={t}>
                        <label className="flex cursor-pointer items-center gap-3 text-[14px] text-white/90">
                          <input
                            type="checkbox"
                            checked={selectedTopics.has(t)}
                            onChange={() => toggleTopic(t)}
                            className="size-4 rounded-full border border-white/35 bg-transparent accent-white"
                          />
                          {t}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:pl-8">
                  <p className="mb-4 text-[11px] font-medium uppercase tracking-wider text-white/40">
                    Year
                  </p>
                  <ul className="space-y-3">
                    {NEWS_FILTER_YEARS.map((y) => (
                      <li key={y}>
                        <label className="flex cursor-pointer items-center gap-3 text-[14px] text-white/90">
                          <input
                            type="checkbox"
                            checked={selectedYears.has(y)}
                            onChange={() => toggleYear(y)}
                            className="size-4 rounded-full border border-white/35 bg-transparent accent-white"
                          />
                          {y}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8 flex justify-end border-t border-white/[0.08] pt-5">
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="rounded-full border border-white/20 px-5 py-2 text-[13px] text-white/90 hover:bg-white/[0.06]"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        ) : null}

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-[15px] text-white/45">No posts match your filters.</p>
        ) : viewMode === "list" ? (
          <ul className="mt-12 divide-y divide-white/[0.08]">
            {filtered.map((item) => (
              <li key={item.id} className="py-8 first:pt-2 md:py-10">
                <article className="grid gap-4 md:grid-cols-[minmax(0,200px)_1fr] md:gap-10">
                  <div className="text-[13px] text-white/45">
                    <p>{item.category}</p>
                    <p className="mt-1">
                      {formatNewsDate(item.publishedAt)}
                      <span className="text-white/25"> · </span>
                      {item.readMinutes} min read
                    </p>
                  </div>
                  <div>
                    <h2 className="text-[1.25rem] font-semibold leading-snug tracking-tight text-white md:text-xl">
                      <NewsTitleLink item={item} className="hover:text-white/85" />
                    </h2>
                    {item.excerpt ? (
                      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-white/50">
                        {item.excerpt}
                      </p>
                    ) : null}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {filtered.map((item) => (
              <li key={item.id}>
                <article className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] transition-colors hover:border-white/[0.14]">
                  <div className="p-5 pb-0">
                    <div
                      className="aspect-square w-full overflow-hidden rounded-[6px]"
                      style={{
                        background: item.cardGradient?.trim() || DEFAULT_NEWS_CARD_GRADIENT,
                      }}
                    />
                  </div>
                  <div className="p-5 pt-4">
                    <p className="text-[12px] text-white/45">
                      {item.category}
                      <span className="text-white/25"> · </span>
                      {item.readMinutes} min read
                    </p>
                    <h2 className="mt-2 text-[1.1rem] font-semibold leading-snug group-hover:text-white/90">
                      <NewsTitleLink item={item} />
                    </h2>
                    {item.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-[14px] text-white/45">{item.excerpt}</p>
                    ) : null}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
