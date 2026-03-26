import { Logo, cn } from "@jokuh/gooey";
import { ArrowUp, ArrowUpRight, ChevronDown, Globe } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { resolveRigidNavColumns } from "../config/site-subdomains";
import { SITE_SEARCH_PLACEHOLDER_SUGGESTIONS } from "../data/site-search-suggestions";
import { RIGID_NAV_COLUMNS } from "../data/rigid-sitemap";
import { SITE_LANGUAGES, findSiteLanguageForActive } from "../data/site-languages";
import { useGentleHoverSound } from "../hooks/useGentleHoverSound";
import { getStoredLanguageKey } from "../lib/google-translate";
import { rankSiteArticles, type SiteArticleHit } from "../lib/site-search-articles";
import { LanguageSelectModal } from "./LanguageSelectModal";
import { SearchPanelToggleGlyph } from "./SearchPanelToggleGlyph";

const SUMMARY_COLLAPSE_CHARS = 320;

function buildNavGroups(cols: ReturnType<typeof resolveRigidNavColumns>) {
  return cols.map((col) => ({
    id: col.id,
    label: col.heading,
    firstHref: col.sections[0]?.links[0]?.href ?? "/",
  }));
}

function RotatingPlaceholders({
  suggestions,
  textClassName,
}: {
  suggestions: string[];
  textClassName: string;
}) {
  const safe = suggestions.filter(Boolean);
  const [index, setIndex] = useState(0);
  const text = safe[index] ?? "";

  useEffect(() => {
    if (safe.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((n) => (n + 1) % safe.length);
    }, 3600);
    return () => window.clearInterval(id);
  }, [safe.length]);

  return (
    <span className="pointer-events-none relative block min-h-[1.2em] min-w-0 flex-1 overflow-hidden" aria-hidden>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={`${index}-${text}`}
          initial={{ y: "75%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-75%", opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "absolute inset-x-0 top-0 flex h-[1.2em] items-center truncate leading-[1.15]",
            textClassName,
          )}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function StreamingSummary({ text, streaming }: { text: string; streaming: boolean }) {
  const [d, setD] = useState("");

  useEffect(() => {
    if (!streaming) {
      setD(text);
      return;
    }
    if (!text) {
      setD("");
      return;
    }
    setD("");
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      i = Math.min(i + 3, text.length);
      setD(text.slice(0, i));
      if (i < text.length) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [text, streaming]);

  return <>{d}</>;
}

type SearchTurn = {
  id: string;
  query: string;
  summary: string;
  loading: boolean;
  error: string | null;
  articles: SiteArticleHit[];
  summaryExpanded: boolean;
};

type SearchRequestArticle = Pick<SiteArticleHit, "href" | "title" | "snippet" | "meta" | "external">;

function buildSearchRequestArticles(articles: SiteArticleHit[]): SearchRequestArticle[] {
  return articles.slice(0, 6).map((hit) => ({
    href: hit.href,
    title: hit.title,
    snippet: hit.snippet,
    meta: hit.meta,
    external: hit.external,
  }));
}

function buildSearchContext(articles: SearchRequestArticle[]): string {
  return articles
    .map(
      (hit, index) =>
        `${index + 1}. ${hit.title} | ${hit.meta} | ${hit.href} | ${hit.snippet}`,
    )
    .join("\n");
}

function buildLocalSearchSummary(query: string, articles: SiteArticleHit[]): string {
  const top = articles.slice(0, 3);
  if (top.length === 0) {
    return `I could not reach the live site search service, but the best local matches for "${query}" are the newsroom, product pages, stories, and docs. Try a more specific product or topic name for a tighter result.`;
  }

  const headline = top
    .map((hit) => `${hit.title} (${hit.meta.toLowerCase()})`)
    .join(", ");

  const focus = top
    .map((hit) => hit.snippet.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");

  return `I could not reach the live site search service, so here are the closest local matches for "${query}": ${headline}. ${focus}`;
}

function ArticleRow({ hit, onClose }: { hit: SiteArticleHit; onClose: () => void }) {
  const inner = (
    <>
      <div className="min-w-0 flex-1">
        <p className="mb-1 font-sans text-[11px] text-zinc-400">{hit.meta}</p>
        <span className="mb-2 block font-sans text-[17px] font-semibold tracking-[-0.02em] text-zinc-950">
          {hit.title}
        </span>
        <p className="font-sans text-[14px] leading-snug text-zinc-700">{hit.snippet}</p>
      </div>
      {hit.image ? (
        <div className="shrink-0 overflow-hidden rounded-lg bg-zinc-100">
          <img
            src={hit.image}
            alt=""
            className="size-20 object-cover md:size-24"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
    </>
  );

  const cls =
    "grid grid-cols-1 gap-4 border-b border-zinc-200 py-8 text-left first:pt-0 last:border-b-0 md:grid-cols-[1fr_auto] md:items-start md:gap-6";

  if (hit.external) {
    return (
      <li>
        <a
          href={hit.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={cn(cls, "no-underline transition-opacity hover:opacity-75")}
        >
          {inner}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        to={hit.href}
        onClick={onClose}
        className={cn(cls, "no-underline transition-opacity hover:opacity-75")}
      >
        {inner}
      </Link>
    </li>
  );
}

function SearchComposer({
  value,
  focused,
  showRotating,
  canSend,
  large,
  label,
  suggestions,
  inputRef,
  onChange,
  onFocus,
  onBlur,
  onSubmit,
}: {
  value: string;
  focused: boolean;
  showRotating: boolean;
  canSend: boolean;
  large?: boolean;
  label?: string;
  suggestions: string[];
  inputRef: { current: HTMLInputElement | null };
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className={cn("w-full", large ? "max-w-[1120px]" : "max-w-[760px]")}>
      {label ? (
        <p className="mb-4 font-sans text-[12px] font-semibold tracking-[0.08em] text-zinc-500 uppercase">
          {label}
        </p>
      ) : null}
      <div
        className={cn(
          "flex cursor-text items-end gap-3 border-b border-zinc-300",
          large ? "pb-3 md:gap-5 md:pb-4" : "pb-3 md:gap-4 md:pb-3.5",
        )}
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <div className={cn("relative min-h-[1.15em] min-w-0 flex-1", large && "min-h-[1.1em]")}>
          {showRotating ? (
            <RotatingPlaceholders
              suggestions={suggestions}
              textClassName={cn(
                "font-sans tracking-[-0.035em] text-zinc-400",
                large
                  ? "text-[clamp(2.5rem,5.4vw,4.75rem)] font-medium leading-[1.02]"
                  : "text-[clamp(1.5rem,3.6vw,2.3rem)] font-medium leading-[1.08]",
              )}
            />
          ) : null}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSubmit();
              }
            }}
            className={cn(
              "absolute inset-0 w-full bg-transparent font-sans tracking-[-0.035em] text-zinc-950 outline-none placeholder:text-zinc-400",
              large
                ? "text-[clamp(2.5rem,5.4vw,4.75rem)] font-medium leading-[1.02]"
                : "text-[clamp(1.5rem,3.6vw,2.3rem)] font-medium leading-[1.08]",
              showRotating && "text-transparent caret-zinc-950",
            )}
            placeholder={showRotating ? "" : label ? "Ask a follow-up…" : "Ask about Jokuh"}
            aria-label={label ? "Ask a follow-up question" : "Search Jokuh"}
            autoComplete="off"
          />
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSend}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full transition-[background-color,color,opacity,transform] duration-200",
            large ? "mb-1 size-14 md:size-[4.15rem]" : "mb-0.5 size-11 md:size-12",
            canSend
              ? "bg-zinc-950 text-white hover:opacity-90 active:scale-[0.98]"
              : "cursor-not-allowed bg-zinc-200 text-zinc-500",
          )}
          aria-label="Submit"
        >
          <ArrowUp className={cn(large ? "size-6" : "size-5")} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function SiteSearchFullscreenOverlay({ onClose }: { onClose: () => void }) {
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const hoverSoundProps = useGentleHoverSound();

  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const [turns, setTurns] = useState<SearchTurn[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navGroups = useMemo(
    () => buildNavGroups(resolveRigidNavColumns(RIGID_NAV_COLUMNS, "primary")),
    [],
  );

  const footerLang = useMemo(() => {
    const k = getStoredLanguageKey();
    if (k) {
      const hit = SITE_LANGUAGES.find((l) => l.key === k);
      if (hit) return hit;
    }
    return findSiteLanguageForActive();
  }, [location.key, langOpen]);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns.length, turns.at(-1)?.loading, turns.at(-1)?.summary, turns.at(-1)?.error]);

  const submit = useCallback(async () => {
    const q = value.trim();
    if (!q || isSubmitting) return;
    const id = crypto.randomUUID();
    const articles = rankSiteArticles(q, 8);
    const requestArticles = buildSearchRequestArticles(articles);
    const requestContext = buildSearchContext(requestArticles);
    const fallbackSummary = buildLocalSearchSummary(q, articles);

    setIsSubmitting(true);
    setValue("");
    setTurns((prev) => [
      ...prev,
      { id, query: q, summary: "", loading: true, error: null, articles, summaryExpanded: false },
    ]);

    try {
      const res = await fetch("/api/site-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, articles: requestArticles, context: requestContext }),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = (await res.json()) as {
        summary?: string;
        error?: string;
        detail?: string;
      };

      const summary = data.summary?.trim() || fallbackSummary;
      setTurns((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, loading: false, summary, error: null } : t,
        ),
      );
    } catch (e) {
      setTurns((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                loading: false,
                summary: fallbackSummary,
                error: null,
              }
            : t,
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [value, isSubmitting]);

  const showRotating = !value.trim() && !focused && turns.length === 0;
  const canSend = value.trim().length > 0 && !isSubmitting;

  const clearTurns = useCallback(() => {
    setTurns([]);
    setValue("");
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const node = (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] flex flex-col bg-white text-zinc-950"
    >
      <header className="shrink-0 border-b border-zinc-200/80">
        <div className="mx-auto flex h-14 w-full max-w-[1240px] items-center gap-3 px-4 md:h-[60px] md:px-8 lg:h-16 lg:px-12">
          <Link to="/" onClick={onClose} className="shrink-0" aria-label="Jokuh home">
            <Logo width={36} height={22} />
          </Link>
          <nav
            className="flex min-w-0 flex-1 items-center gap-x-4 gap-y-1 overflow-x-auto md:gap-x-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            aria-label="Primary"
          >
            {navGroups.map((g) => (
              <Link
                key={g.id}
                to={g.firstHref}
                onClick={onClose}
                className="shrink-0 font-sans text-[12px] font-semibold tracking-tight whitespace-nowrap text-zinc-900 no-underline transition-opacity hover:opacity-65"
              >
                {g.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close search"
          >
            <SearchPanelToggleGlyph open />
          </button>
          <Link
            to="/waitlist"
            onClick={onClose}
            {...hoverSoundProps}
            className={cn(
              "hidden h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 font-sans text-[12px] font-semibold tracking-tight text-white no-underline transition-[transform,background-color] duration-200 sm:inline-flex",
              "hover:scale-[0.98] hover:bg-zinc-800 active:scale-[0.97]",
            )}
          >
            Try Jokuh
            <ArrowUpRight className="size-[15px] shrink-0 opacity-95" strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-8 md:py-10 lg:px-12">
          {turns.length === 0 ? (
            <section className="pt-6 md:pt-16">
              <div className="max-w-[1120px]">
                <SearchComposer
                  value={value}
                  focused={focused}
                  showRotating={showRotating}
                  canSend={canSend}
                  large
                  suggestions={SITE_SEARCH_PLACEHOLDER_SUGGESTIONS}
                  inputRef={inputRef}
                  onChange={setValue}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onSubmit={() => void submit()}
                />
                <p className="mt-5 max-w-xl font-sans text-[13px] font-medium text-zinc-400 md:text-[14px]">
                  Search across products, newsroom, stories, company information, and developer resources.
                </p>
              </div>
            </section>
          ) : (
            <section className="max-w-[760px]">
              <button
                type="button"
                onClick={clearTurns}
                className="mb-8 font-sans text-[12px] font-semibold text-zinc-500 no-underline transition-colors hover:text-zinc-900"
              >
                Clear conversation
              </button>

              {turns.map((turn) => (
                <section key={turn.id} className="mb-16 border-b border-zinc-100 pb-16 last:mb-0 last:border-b-0 last:pb-0">
                  <div className="mb-3 font-sans text-[11px] font-medium tracking-[0.06em] text-zinc-400 uppercase">
                    Your search
                  </div>
                  <h2 className="mb-10 font-sans text-[clamp(1.35rem,3.5vw,2rem)] font-semibold tracking-[-0.03em] text-zinc-950">
                    {turn.query}
                  </h2>

                  <div className="mb-3 font-sans text-[11px] font-medium tracking-[0.06em] text-zinc-400 uppercase">
                    Summary
                  </div>
                  <div className="mb-10 min-h-[3rem] font-sans text-[15px] leading-relaxed font-normal text-zinc-800">
                    {turn.loading ? (
                      <span className="text-zinc-400">Thinking…</span>
                    ) : turn.error ? (
                      <span className="text-red-600">{turn.error}</span>
                    ) : (
                      <>
                        <p
                          className={cn(
                            !turn.summaryExpanded && turn.summary.length > SUMMARY_COLLAPSE_CHARS && "line-clamp-4",
                          )}
                        >
                          <StreamingSummary text={turn.summary} streaming={!turn.loading && !!turn.summary} />
                        </p>
                        {turn.summary.length > SUMMARY_COLLAPSE_CHARS ? (
                          <button
                            type="button"
                            onClick={() =>
                              setTurns((prev) =>
                                prev.map((t) =>
                                  t.id === turn.id ? { ...t, summaryExpanded: !t.summaryExpanded } : t,
                                ),
                              )
                            }
                            className="mt-3 inline-flex items-center gap-1 font-sans text-[13px] font-semibold text-zinc-600 no-underline transition-colors hover:text-zinc-950"
                          >
                            {turn.summaryExpanded ? "Show less" : "Read more"}
                            <ChevronDown
                              className={cn(
                                "size-4 transition-transform",
                                turn.summaryExpanded && "rotate-180",
                              )}
                              strokeWidth={2}
                              aria-hidden
                            />
                          </button>
                        ) : null}
                      </>
                    )}
                  </div>

                  <div className="mb-3 font-sans text-[11px] font-medium tracking-[0.06em] text-zinc-400 uppercase">
                    Sources
                  </div>
                  <ul>
                    {turn.articles.map((hit) => (
                      <ArticleRow key={`${turn.id}-${hit.href}`} hit={hit} onClose={onClose} />
                    ))}
                  </ul>
                </section>
              ))}

              <div className="pt-4">
                <SearchComposer
                  value={value}
                  focused={focused}
                  showRotating={false}
                  canSend={canSend}
                  label="Ask a follow-up"
                  suggestions={SITE_SEARCH_PLACEHOLDER_SUGGESTIONS}
                  inputRef={inputRef}
                  onChange={setValue}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onSubmit={() => void submit()}
                />
              </div>
            </section>
          )}

          <div className={cn("flex pt-8 pb-[max(1rem,env(safe-area-inset-bottom))]", turns.length === 0 ? "justify-start" : "max-w-[760px] justify-end")}>
            <button
              type="button"
              onClick={() => setLangOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 py-2 pr-3 pl-2.5 font-sans text-[12px] text-zinc-900 transition-colors hover:bg-zinc-100"
              aria-haspopup="dialog"
              aria-expanded={langOpen}
            >
              <Globe className="size-[15px] shrink-0 text-zinc-600" strokeWidth={1.75} aria-hidden />
              <span className="font-semibold">{footerLang.native}</span>
              <span className="text-zinc-500">{footerLang.region ?? footerLang.english}</span>
            </button>
          </div>
          <div ref={endRef} className="h-4 shrink-0" aria-hidden />
        </div>
      </div>

      <LanguageSelectModal open={langOpen} onClose={() => setLangOpen(false)} />
    </motion.div>
  );

  return createPortal(node, document.body);
}
