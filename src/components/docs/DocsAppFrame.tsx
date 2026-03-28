import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Logo, cn } from "@jokuh/gooey";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { DOCS_NAV_SECTIONS } from "../../data/docs-nav";
import type { RigidLink } from "../../data/rigid-sitemap";
import { showOffSiteNavGlyph } from "../../lib/off-site-href";
import { CtaLordIcon } from "../CtaLordIcon";
import { OffSiteGlyph } from "../OffSiteGlyph";
import { SiteLink } from "../SiteLink";

const docsNavLink =
  "inline-flex h-10 items-center rounded-2xl px-4 font-sans text-[13px] font-medium tracking-tight text-white/88 transition-colors hover:bg-white/[0.06] hover:text-white light:text-black/78 light:hover:bg-black/[0.05] light:hover:text-black";

const docsSidebarLink =
  "group flex items-center justify-between rounded-lg px-2 py-2 min-h-[40px] font-sans text-[13px] font-medium text-white/66 transition-colors hover:bg-white/[0.04] hover:text-white light:text-black/66 light:hover:bg-black/[0.04] light:hover:text-black lg:min-h-0";

const docsSidebarLinkActive = "bg-white/[0.08] text-white light:bg-black/[0.08] light:text-black";

type DocsTopMenuChild = {
  label: string;
  description: string;
  to: string;
};

type DocsTopMenuItem = {
  label: string;
  to?: string;
  children?: readonly DocsTopMenuChild[];
};

const DOCS_TOP_MENU_ITEMS: readonly DocsTopMenuItem[] = [
  { label: "Home", to: "/" },
  { label: "API", to: "/developers/docs" },
  { label: "Codex", to: "/developers/sdk" },
  {
    label: "ChatGPT",
    children: [
      {
        label: "Pods SDK",
        description: "Build apps to extend ChatGPT",
        to: "/developers/apps",
      },
      {
        label: "Commerce",
        description: "Build commerce flows in ChatGPT",
        to: "/developers/docs/cookbook",
      },
    ],
  },
  {
    label: "Resources",
    children: [
      {
        label: "Cookbook",
        description: "Implementation patterns and shipping examples",
        to: "/developers/docs/cookbook",
      },
      {
        label: "Forum",
        description: "Discuss ideas with other developers",
        to: "/developers/docs",
      },
    ],
  },
];

function isAbsoluteHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function DocsSidebarLink({ href, label }: Pick<RigidLink, "href" | "label">) {
  const showGlyph = showOffSiteNavGlyph({ href });

  if (isAbsoluteHref(href)) {
    return (
      <SiteLink href={href} className={docsSidebarLink}>
        <span>{label}</span>
        {showGlyph ? <OffSiteGlyph className="text-white/38" /> : null}
      </SiteLink>
    );
  }

  return (
    <NavLink
      to={href}
      end={href === "/developers/docs"}
      className={({ isActive }) => cn(docsSidebarLink, isActive && docsSidebarLinkActive)}
    >
      <span>{label}</span>
      {showGlyph ? <OffSiteGlyph className="text-white/38" /> : null}
    </NavLink>
  );
}

const SUGGESTED_TERMS = ["responses API", "streaming", "function calling", "tools", "agents", "models"];

type DocsSearchResult = { title: string; breadcrumb: string; href: string };

const DOCS_SEARCH_INDEX: DocsSearchResult[] = [
  ...DOCS_NAV_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      title: item.label,
      breadcrumb: `Docs › ${section.heading}`,
      href: item.to,
    })),
  ),
  { title: "Responses API", breadcrumb: "API docs › Guides", href: "/developers/sdk" },
  { title: "Streaming responses", breadcrumb: "API docs › Guides", href: "/developers/sdk" },
  { title: "Function calling", breadcrumb: "API docs › Guides", href: "/developers/sdk" },
  { title: "Tools & integrations", breadcrumb: "API docs › Guides", href: "/developers/sdk" },
  { title: "Agents overview", breadcrumb: "API docs › Agents", href: "/developers/docs/cookbook" },
  { title: "Build agents", breadcrumb: "API docs › Agents", href: "/developers/docs/cookbook" },
  { title: "Deploy in your product", breadcrumb: "API docs › Agents", href: "/developers/docs/cookbook" },
  { title: "All models", breadcrumb: "Docs › Get started", href: "/developers/docs/models" },
  { title: "GPT-4.1", breadcrumb: "Docs › Models", href: "/developers/docs/models" },
  { title: "Claude 4 Sonnet", breadcrumb: "Docs › Models", href: "/developers/docs/models" },
  { title: "Gemini 2.5 Pro", breadcrumb: "Docs › Models", href: "/developers/docs/models" },
  { title: "Llama 4", breadcrumb: "Docs › Models", href: "/developers/docs/models" },
  { title: "DeepSeek R1", breadcrumb: "Docs › Models", href: "/developers/docs/models" },
  { title: "Qwen3", breadcrumb: "Docs › Models", href: "/developers/docs/models" },
  { title: "Pods runtime", breadcrumb: "API docs › Reference", href: "/pods" },
  { title: "MCP server", breadcrumb: "API docs › Guides", href: "/developers/sdk" },
  { title: "Structured output", breadcrumb: "API docs › Guides", href: "/developers/sdk" },
  { title: "Image generation", breadcrumb: "API docs › Guides", href: "/developers/docs/cookbook" },
  { title: "Audio & speech", breadcrumb: "API docs › Guides", href: "/developers/sdk" },
  { title: "Reasoning", breadcrumb: "API docs › Guides", href: "/developers/sdk" },
  { title: "Fine-tuning & evals", breadcrumb: "API docs › Guides", href: "/developers/docs/cookbook" },
];

function DocsSearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const results = query.trim()
    ? DOCS_SEARCH_INDEX.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.breadcrumb.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, 8)
    : [];

  const go = useCallback(
    (href: string) => {
      onClose();
      navigate(href);
    },
    [onClose, navigate],
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] sm:pt-[16vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-[1] mx-4 w-full max-w-[620px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#161618] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.7)] light:border-black/[0.08] light:bg-white light:shadow-[0_24px_64px_-16px_rgba(15,23,42,0.18)]">
        <header className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3 light:border-black/[0.06]">
          <Search className="size-4 shrink-0 text-white/35 light:text-black/35" strokeWidth={1.8} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Start searching"
            className="min-w-0 flex-1 bg-transparent font-sans text-[15px] font-medium text-white placeholder:text-white/35 outline-none light:text-black light:placeholder:text-black/35"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70 light:text-black/40 light:hover:bg-black/[0.06] light:hover:text-black/70"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </header>

        <div className="max-h-[50vh] overflow-y-auto">
          {query.trim() === "" ? (
            <div className="px-4 py-4">
              <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-white/35 light:text-black/35">
                Suggested
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 font-sans text-[13px] font-medium text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white light:border-black/[0.08] light:bg-black/[0.03] light:text-black/72 light:hover:bg-black/[0.06] light:hover:text-black"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <ul className="py-1">
              {results.map((r, i) => (
                <li key={`${r.href}-${i}`}>
                  <button
                    type="button"
                    onClick={() => go(r.href)}
                    className="flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-white/[0.04] light:hover:bg-black/[0.04]"
                  >
                    <span className="font-sans text-[11px] text-white/35 light:text-black/35">{r.breadcrumb}</span>
                    <span className="font-sans text-[14px] font-semibold text-white/90 light:text-black/90">{r.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center font-sans text-[13px] text-white/35 light:text-black/35">
              No results for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Dedicated docs shell, intentionally separate from the marketing page frame. */
export function DocsAppFrame({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased light:bg-white light:text-zinc-950">
      <header className="sticky top-0 z-[100] border-b border-white/8 bg-black/88 backdrop-blur-xl light:border-black/[0.08] light:bg-white/88">
        {/* Mobile / tablet header */}
        <div className="mx-auto grid h-14 w-full grid-cols-[2.5rem_1fr_2.5rem] items-center px-4 md:h-16 md:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex size-10 items-center justify-center rounded-full text-white/70 hover:bg-white/[0.06] light:text-black/70 light:hover:bg-black/[0.06]"
            aria-label="Open menu"
          >
            <Menu className="size-5" strokeWidth={1.8} />
          </button>
          <Link to="/" className="flex items-center justify-center" aria-label="Jokuh Developers home">
            <Logo width={34} height={20} />
          </Link>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex size-10 items-center justify-center rounded-full text-white/70 hover:bg-white/[0.06] light:text-black/70 light:hover:bg-black/[0.06]"
            aria-label="Open search"
          >
            <Search className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Desktop header */}
        <div className="mx-auto hidden h-16 w-full max-w-[1560px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-8 lg:grid">
          <nav
            className="relative flex min-w-0 items-center gap-1 justify-self-start"
            aria-label="Developer sections"
            onMouseLeave={() => setOpenMenu(null)}
          >
            {DOCS_TOP_MENU_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.children ? item.label : null)}
              >
                {item.children ? (
                  <button
                    type="button"
                    className={cn(
                      docsNavLink,
                      "gap-1.5 text-[13px]",
                      openMenu === item.label && "bg-white/[0.1] text-white light:bg-black/[0.08] light:text-black",
                    )}
                    aria-expanded={openMenu === item.label}
                  >
                    {item.label}
                    <ChevronDown className="size-4 text-white/56 light:text-black/56" strokeWidth={1.9} aria-hidden />
                  </button>
                ) : (
                  <NavLink
                    to={item.to ?? "/"}
                    end={item.to === "/developers/docs"}
                    className={({ isActive }) => cn(docsNavLink, "text-[13px]", isActive && "bg-white/[0.08] text-white light:bg-black/[0.08] light:text-black")}
                  >
                    {item.label}
                  </NavLink>
                )}

                {item.children && openMenu === item.label ? (
                  <div className="absolute left-0 top-[calc(100%+4px)] w-[280px] rounded-lg border border-white/[0.07] bg-[#161618] p-1.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7)] light:border-black/[0.07] light:bg-white light:shadow-[0_12px_32px_-8px_rgba(15,23,42,0.16)]">
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            to={child.to}
                            className="block rounded-md px-3 py-2.5 transition-colors hover:bg-white/[0.05] light:hover:bg-black/[0.04]"
                            onClick={() => setOpenMenu(null)}
                          >
                            <p className="font-sans text-[13px] font-medium text-white/92 light:text-black/92">{child.label}</p>
                            <p className="mt-0.5 font-sans text-[12px] leading-[1.4] text-white/42 light:text-black/42">{child.description}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <Link to="/" className="flex items-center justify-self-center" aria-label="Jokuh Developers home">
            <Logo width={34} height={20} />
          </Link>

          <div className="flex items-center gap-2 justify-self-end">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
            className="inline-flex h-10 min-w-[11rem] items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-4 font-sans text-[13px] font-medium text-white/52 transition-colors hover:bg-white/[0.06] hover:text-white/74 light:border-black/[0.1] light:bg-black/[0.03] light:text-black/52 light:hover:bg-black/[0.05] light:hover:text-black/74"
              aria-label="Open site search"
            >
              <span>Start searching</span>
              <Search className="size-4" strokeWidth={1.8} aria-hidden />
            </button>
            <Link
              to="/waitlist"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 font-sans text-[12px] font-semibold tracking-tight text-black transition-colors hover:bg-white/90"
            >
              <CtaLordIcon icon="logSignIn" size={16} darkColor="#000000" lightColor="#ffffff" />
              Try Jokuh
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[150] lg:hidden">
          <div className="relative z-[1] flex h-full w-full flex-col overflow-y-auto bg-black light:bg-white px-6 py-6">
            <div className="mb-6 flex items-center justify-center relative">
              <Logo width={34} height={20} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="absolute right-0 inline-flex size-8 items-center justify-center rounded-md text-white/50 light:text-black/50 hover:text-white light:hover:text-black"
                aria-label="Close menu"
              >
                <X className="size-5" strokeWidth={2} />
              </button>
            </div>

            <nav className="flex-1 space-y-6">
              {DOCS_NAV_SECTIONS.map((section) => (
                <section key={section.heading}>
                  <p className="px-2 font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-white/32 light:text-black/40">
                    {section.heading}
                  </p>
                  <ul className="mt-2 space-y-0.5">
                    {section.items.map((item) => (
                      <li key={item.to}>
                        {isAbsoluteHref(item.to) ? (
                          <SiteLink
                            href={item.to}
                            className={cn(docsSidebarLink, "light:text-black/66 light:hover:bg-black/[0.04] light:hover:text-black")}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>{item.label}</span>
                          </SiteLink>
                        ) : (
                          <NavLink
                            to={item.to}
                            end={item.to === "/developers/docs"}
                            className={({ isActive }) => cn(docsSidebarLink, "light:text-black/66 light:hover:bg-black/[0.04] light:hover:text-black", isActive && cn(docsSidebarLinkActive, "light:bg-black/[0.08] light:text-black"))}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>{item.label}</span>
                          </NavLink>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </nav>

            <div className="sticky bottom-0 border-t border-white/8 light:border-black/8 bg-black light:bg-white pt-6 pb-2 mt-8 space-y-2">
              <Link
                to="/waitlist"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white px-4 font-sans text-[12px] font-semibold tracking-tight text-black transition-colors hover:bg-white/90 light:bg-black light:text-white light:hover:bg-black/90"
              >
                <CtaLordIcon icon="logSignIn" size={16} darkColor="#000000" lightColor="#ffffff" />
                Try Jokuh
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 w-full items-center justify-center rounded-full border border-white/16 bg-transparent px-4 font-sans text-[12px] font-semibold tracking-tight text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white light:border-black/16 light:text-black/60 light:hover:bg-black/[0.04] light:hover:text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1560px] px-4 md:px-6 lg:grid lg:grid-cols-[120px_minmax(0,1fr)] lg:gap-6 lg:px-8">
        <aside className="sticky top-16 hidden max-h-[calc(100dvh-4rem)] overflow-y-auto pt-6 lg:block [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav aria-label="Documentation" className="space-y-6 pb-8">
            {DOCS_NAV_SECTIONS.map((section) => (
              <section key={section.heading}>
                <p className="px-2 font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-white/32 light:text-black/32">
                  {section.heading}
                </p>
                <ul className="mt-2 space-y-1">
                  {section.items.map((item) => (
                    <li key={item.to}>
                      <DocsSidebarLink href={item.to} label={item.label} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 pb-24 pt-8 lg:border-l lg:border-white/8 lg:pl-8 lg:pt-8 light:lg:border-black/[0.08]">
          <nav
            className="flex gap-2 overflow-x-auto pb-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Documentation sections"
          >
            {DOCS_NAV_SECTIONS.flatMap((section) => section.items).map((item) =>
              isAbsoluteHref(item.to) ? (
                <SiteLink
                  key={item.to}
                  href={item.to}
                  className="inline-flex h-10 shrink-0 items-center rounded-full border border-white/10 bg-white/[0.04] px-4 font-sans text-[13px] font-medium text-white/72 light:border-black/[0.1] light:bg-black/[0.03] light:text-black/72"
                >
                  {item.label}
                </SiteLink>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/developers/docs"}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex h-10 shrink-0 items-center rounded-full border px-4 font-sans text-[13px] font-medium transition-colors",
                      isActive
                        ? "border-white/16 bg-white/[0.1] text-white light:border-black/[0.16] light:bg-black/[0.08] light:text-black"
                        : "border-white/10 bg-white/[0.04] text-white/72 hover:bg-white/[0.06] hover:text-white light:border-black/[0.1] light:bg-black/[0.03] light:text-black/72 light:hover:bg-black/[0.05] light:hover:text-black",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          {children}

        </main>
      </div>

      {searchOpen ? <DocsSearchModal onClose={() => setSearchOpen(false)} /> : null}
    </div>
  );
}
