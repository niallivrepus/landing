import { Logo, cn } from "@jokuh/gooey";
import { ChevronUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSiteSearch } from "../context/SiteSearchContext";
import { showOffSiteNavGlyph } from "../lib/off-site-href";
import { primaryNavGroups, type MegaGroup } from "../lib/nav-groups";
import { OffSiteGlyph } from "./OffSiteGlyph";
import { PrimaryNavCta } from "./SiteTopBar";
import { TopNavAnchor } from "./TopNavAnchor";
import { CONTENT_SHELL_WIDE } from "./system/shells";

/**
 * **Purpose:** Primary site navigation anchored in the footer (Products, Company, Business, Developers).
 * **Connects to:** `MegaFooter`, `rigid-sitemap.ts`, `SiteSearchContext`.
 * Replaces the fixed top mega-menu bar for the immersive marketing shell.
 */
export function SiteBottomNav() {
  const { pathname } = useLocation();
  const siteSearch = useSiteSearch();
  const navGroups = useMemo(() => primaryNavGroups(), []);
  const [openId, setOpenId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openGroup = navGroups.find((group) => group.id === openId);

  const closePanel = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    closePanel();
  }, [pathname, closePanel]);

  useEffect(() => {
    if (!openId) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (panelRef.current?.contains(event.target as Node)) return;
      closePanel();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openId, closePanel]);

  return (
    <div
      ref={panelRef}
      className="relative border-b border-light-space/[0.08] bg-dark-space/95 backdrop-blur-xl light:border-black/[0.08] light:bg-white/95"
      data-bottom-nav-open={openId ? "true" : undefined}
    >
      <div className={cn(CONTENT_SHELL_WIDE, "flex flex-col gap-3 py-4 md:py-5")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            aria-label="Jokuh home"
            className="premium-soft-button inline-flex shrink-0 items-center rounded-full px-1 py-1 focus-visible:ring-2 focus-visible:ring-light-space/30 focus-visible:outline-none light:focus-visible:ring-black/20"
          >
            <Logo width={34} height={20} />
          </Link>

          <nav
            className="flex flex-1 flex-wrap items-center justify-center gap-1 sm:gap-2"
            aria-label="Primary"
          >
            {navGroups.map((group) => (
              <BottomNavGroupButton
                key={group.id}
                group={group}
                isOpen={openId === group.id}
                onToggle={() => setOpenId((current) => (current === group.id ? null : group.id))}
              />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label={siteSearch.isOpen ? "Close search" : "Open search"}
              onClick={siteSearch.toggle}
              className="premium-soft-button inline-flex h-10 items-center justify-center rounded-full px-4 font-sans text-[12px] font-semibold text-light-space/70 hover:bg-white/[0.06] hover:text-light-space light:text-zinc-600 light:hover:bg-black/[0.05] light:hover:text-zinc-950"
            >
              Search
            </button>
            <PrimaryNavCta className="h-10" />
          </div>
        </div>

        {openGroup ? (
          <BottomNavMegaPanel group={openGroup} onNavigate={closePanel} />
        ) : null}
      </div>
    </div>
  );
}

function BottomNavGroupButton({
  group,
  isOpen,
  onToggle,
}: {
  group: MegaGroup;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={`bottom-nav-panel-${group.id}`}
      onClick={onToggle}
      className={cn(
        "premium-soft-button inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-sans text-[12px] font-semibold tracking-tight text-light-space/72",
        "hover:bg-white/[0.06] hover:text-light-space focus-visible:ring-2 focus-visible:ring-light-space/25 focus-visible:outline-none",
        isOpen && "bg-white/[0.08] text-light-space light:bg-black/[0.06] light:text-zinc-950",
        "light:text-zinc-600 light:hover:bg-black/[0.05] light:hover:text-zinc-950",
      )}
    >
      {group.label}
      <ChevronUp
        className={cn("size-3.5 transition-transform", isOpen && "rotate-180")}
        aria-hidden
      />
    </button>
  );
}

function BottomNavMegaPanel({
  group,
  onNavigate,
}: {
  group: MegaGroup;
  onNavigate: () => void;
}) {
  return (
    <div
      id={`bottom-nav-panel-${group.id}`}
      className="nav-fade-panel rounded-[20px] border border-light-space/[0.08] bg-white/[0.04] p-4 light:border-black/[0.08] light:bg-black/[0.03] md:p-5"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          {group.primaryHeading ? (
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-light-space/42 light:text-zinc-500">
              {group.primaryHeading}
            </p>
          ) : null}
          <ul className="space-y-1">
            {group.primary.map((link) => (
              <li key={link.href + link.label}>
                <BottomNavLink link={link} onNavigate={onNavigate} prominent />
              </li>
            ))}
          </ul>
        </div>

        {group.secondary?.map((column) => (
          <div key={column.heading}>
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-light-space/42 light:text-zinc-500">
              {column.heading}
            </p>
            <ul className="space-y-1">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <BottomNavLink link={link} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function BottomNavLink({
  link,
  onNavigate,
  prominent = false,
}: {
  link: MegaGroup["primary"][number];
  onNavigate: () => void;
  prominent?: boolean;
}) {
  const showGlyph = showOffSiteNavGlyph(link);

  return (
    <TopNavAnchor
      href={link.href}
      onClick={onNavigate}
      className={cn(
        "premium-soft-fade block rounded-lg px-2 py-2 font-sans text-[13px] font-semibold text-light-space/78 hover:bg-white/[0.05] hover:text-light-space light:text-zinc-700 light:hover:bg-black/[0.04] light:hover:text-zinc-950",
        prominent && "text-[14px] text-light-space light:text-zinc-900",
      )}
    >
      <span className="inline-flex items-center gap-1">
        {link.label}
        {showGlyph ? <OffSiteGlyph className="ml-0.5" /> : null}
      </span>
      {link.summary ? (
        <span className="mt-0.5 block font-sans text-[12px] font-medium leading-snug text-light-space/45 light:text-zinc-500">
          {link.summary}
        </span>
      ) : null}
    </TopNavAnchor>
  );
}
