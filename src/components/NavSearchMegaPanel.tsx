import { cn } from "@jokuh/gooey";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteLink } from "./SiteLink";
import { CONTENT_SHELL_WIDE } from "./system/shells";
import { suggestSiteArticles, type SiteArticleHit } from "../lib/site-search-articles";

const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Spine", href: "/spine" },
  { label: "Calls", href: "/calls" },
  { label: "Texts", href: "/messages" },
  { label: "Download Jokuh", href: "/download" },
  { label: "Newsroom", href: "/newsroom" },
  { label: "Careers", href: "/careers" },
];

const SUGGESTED_SEARCHES = [
  "Jokuh Calls",
  "Spine memory layer",
  "Jokuh Business",
  "Open roles",
  "Manifesto",
];

function HighlightedTitle({ title, query }: { title: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <span>{title}</span>;
  const idx = title.toLowerCase().indexOf(trimmed.toLowerCase());
  if (idx === -1) return <span>{title}</span>;
  return (
    <span>
      {title.slice(0, idx)}
      <span className="font-semibold">{title.slice(idx, idx + trimmed.length)}</span>
      {title.slice(idx + trimmed.length)}
    </span>
  );
}

export function NavSearchMegaPanel({ onNavigate }: { onNavigate: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const suggestions: SiteArticleHit[] = useMemo(() => {
    return query.trim().length >= 2 ? suggestSiteArticles(query, 6) : [];
  }, [query]);

  const matchedSearches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SUGGESTED_SEARCHES.filter((s) => s.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  const showInitial = query.trim().length === 0;

  return (
    <div className={cn(CONTENT_SHELL_WIDE, "pb-12 pt-6")}>
      {/* Search input row */}
      <label className="flex items-center gap-3 border-b border-light-space/[0.1] pb-4 light:border-zinc-200">
        <Search
          className="size-5 shrink-0 text-light-space/55 light:text-zinc-500"
          strokeWidth={2}
          aria-hidden
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jokuh.com"
          className="w-full bg-transparent font-sans text-[20px] font-semibold text-light-space placeholder:text-light-space/45 focus:outline-none light:text-zinc-950 light:placeholder:text-zinc-500"
          aria-label="Search Jokuh"
        />
      </label>

      {showInitial ? (
        <div className="mt-8">
          <p className="font-sans text-[12px] font-medium text-light-space/55 light:text-zinc-500">
            Quick Links
          </p>
          <ul className="mt-3 flex flex-col">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <SiteLink
                  href={link.href}
                  onClick={onNavigate}
                  className="group/qs flex items-center gap-3 py-2 font-sans text-[14px] text-light-space transition-colors hover:text-light-space/70 light:text-zinc-950 light:hover:text-zinc-700"
                >
                  <ArrowRight
                    className="size-3.5 text-light-space/45 light:text-zinc-500"
                    strokeWidth={2.4}
                    aria-hidden
                  />
                  <span className="font-semibold">{link.label}</span>
                </SiteLink>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div>
            <p className="font-sans text-[12px] font-medium text-light-space/55 light:text-zinc-500">
              Suggested Links
            </p>
            <ul className="mt-3 flex flex-col">
              {suggestions.length === 0 ? (
                <li className="py-2 font-sans text-[14px] text-light-space/55 light:text-zinc-500">
                  No matches.
                </li>
              ) : (
                suggestions.map((hit) => (
                  <li key={hit.href}>
                    <SiteLink
                      href={hit.href}
                      onClick={onNavigate}
                      className="flex items-center gap-3 py-2 font-sans text-[14px] text-light-space transition-colors hover:text-light-space/70 light:text-zinc-950 light:hover:text-zinc-700"
                    >
                      <ArrowRight
                        className="size-3.5 text-light-space/45 light:text-zinc-500"
                        strokeWidth={2.4}
                        aria-hidden
                      />
                      <HighlightedTitle title={hit.title} query={query} />
                    </SiteLink>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <p className="font-sans text-[12px] font-medium text-light-space/55 light:text-zinc-500">
              Suggested Searches
            </p>
            <ul className="mt-3 flex flex-col">
              {matchedSearches.length === 0 ? (
                <li className="py-2 font-sans text-[14px] text-light-space/55 light:text-zinc-500">
                  No matches.
                </li>
              ) : (
                matchedSearches.map((label) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => setQuery(label)}
                      className="flex w-full items-center gap-3 py-2 text-left font-sans text-[14px] text-light-space transition-colors hover:text-light-space/70 light:text-zinc-950 light:hover:text-zinc-700"
                    >
                      <Search
                        className="size-3.5 text-light-space/45 light:text-zinc-500"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <HighlightedTitle title={label} query={query} />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
