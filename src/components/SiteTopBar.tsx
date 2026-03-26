import { Logo, cn } from "@jokuh/gooey";
import { Menu01Icon, Cancel01Icon } from "hugeicons-react";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useSiteSearch } from "../context/SiteSearchContext";
import { resolveRigidNavColumns } from "../config/site-subdomains";
import { showOffSiteNavGlyph } from "../lib/off-site-href";
import { useGentleHoverSound } from "../hooks/useGentleHoverSound";
import { OffSiteGlyph } from "./OffSiteGlyph";
import { SearchPanelToggleGlyph } from "./SearchPanelToggleGlyph";
import { TopNavAnchor } from "./TopNavAnchor";
import { RIGID_NAV_COLUMNS, type RigidLink } from "../data/rigid-sitemap";

type MegaLink = Pick<RigidLink, "label" | "href" | "navGlyph">;
type MegaColumn = { heading: string; links: MegaLink[] };
type MegaGroup = {
  id: string;
  label: string;
  primaryHeading?: string;
  primary: MegaLink[];
  secondary?: MegaColumn[];
};

function buildNavGroups(cols: ReturnType<typeof resolveRigidNavColumns>): MegaGroup[] {
  return cols.map((col) => ({
    id: col.id,
    label: col.heading,
    primaryHeading: col.sections[0]?.heading,
    primary: [...col.sections[0].links],
    secondary:
      col.sections.length > 1
        ? col.sections.slice(1).map((s) => ({ heading: s.heading, links: [...s.links] }))
        : undefined,
  }));
}

function NavSearchButton({
  className,
  beforeOpen,
  style,
}: {
  className?: string;
  beforeOpen?: () => void;
  style?: CSSProperties;
}) {
  const { isOpen, toggle } = useSiteSearch();

  return (
    <button
      type="button"
      aria-label={isOpen ? "Close search" : "Open search"}
      onClick={() => {
        beforeOpen?.();
        toggle();
      }}
      className={cn(
        "premium-soft-button inline-flex size-10 shrink-0 items-center justify-center rounded-full text-light-space/55",
        "hover:bg-white/[0.05] hover:text-light-space/92 focus-visible:ring-2 focus-visible:ring-light-space/30 focus-visible:outline-none",
        "light:text-zinc-500 light:hover:bg-black/[0.05] light:hover:text-zinc-950",
        className,
      )}
      style={style}
    >
      <SearchPanelToggleGlyph open={isOpen} />
    </button>
  );
}

export function TryJokuhCta({
  className,
  onNavigate,
  style,
}: {
  className?: string;
  onNavigate?: () => void;
  style?: CSSProperties;
}) {
  const hoverSoundProps = useGentleHoverSound();

  return (
    <Link
      to="/waitlist"
      onClick={onNavigate}
      style={style}
      {...hoverSoundProps}
      className={cn(
        "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 font-sans text-[12px] font-semibold tracking-tight text-white",
        "premium-soft-button shadow-[0_10px_30px_-22px_rgba(0,0,0,0.72)] hover:bg-zinc-900 hover:shadow-[0_18px_36px_-24px_rgba(0,0,0,0.72)] active:translate-y-px",
        "light:bg-black light:hover:bg-zinc-900 light:hover:shadow-[0_16px_34px_-26px_rgba(0,0,0,0.32)]",
        "focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:outline-none light:focus-visible:ring-black/25",
        className,
      )}
    >
      Try Jokuh
      <ArrowUpRight className="size-[15px] shrink-0 opacity-95" strokeWidth={2} aria-hidden />
    </Link>
  );
}

export function SiteTopBar() {
  const navGroups = useMemo(
    () => buildNavGroups(resolveRigidNavColumns(RIGID_NAV_COLUMNS, "primary")),
    [],
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [primaryHoverKey, setPrimaryHoverKey] = useState<string | null>(null);
  const closeT = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeT.current) {
      clearTimeout(closeT.current);
      closeT.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeT.current = setTimeout(() => setOpenId(null), 140);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  useEffect(() => {
    setPrimaryHoverKey(null);
  }, [openId]);

  useEffect(() => {
    if (!mobileOpen) setPrimaryHoverKey(null);
  }, [mobileOpen]);

  const openGroup = navGroups.find((g) => g.id === openId);

  return (
    <div
      className="fixed top-0 right-0 left-0 z-[100]"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
        className="nav-topbar-glass overflow-visible text-light-space light:text-zinc-950"
      >
        <div className="relative z-[1] mx-auto h-14 w-full max-w-[1240px] px-4 md:h-[60px] md:px-5 lg:h-16 lg:pl-[48px] lg:pr-[56px]">
          <div className="grid h-full w-full grid-cols-[2.5rem_1fr_2.5rem] items-center md:hidden">
            <button
              type="button"
              className="premium-soft-button flex size-10 items-center justify-center rounded-full text-light-space hover:bg-white/[0.05]"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu01Icon size={22} strokeWidth={1.5} />
            </button>
            <Link to="/" className="flex justify-center" aria-label="Jokuh home">
              <Logo width={34} height={20} />
            </Link>
            <div className="flex justify-end">
              <NavSearchButton beforeOpen={() => setMobileOpen(false)} />
            </div>
          </div>

          <div className="hidden h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 md:grid md:gap-x-3 lg:gap-x-4">
            <nav
              className="flex min-w-0 items-stretch gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Primary"
            >
              {navGroups.map((g, index) => {
                const hasOpenGroup = openId !== null;
                const isActive = openId === g.id;
                const isDimmed = hasOpenGroup && !isActive;

                return (
                  <div
                    key={g.id}
                    className="nav-fade-item relative flex shrink-0 items-center"
                    style={{ "--item-index": index } as CSSProperties}
                  >
                    <button
                      type="button"
                      className={cn(
                        "premium-soft-fade flex h-11 items-center rounded-full bg-transparent px-2.5 font-sans text-[11px] font-semibold tracking-tight whitespace-nowrap sm:text-[12px] md:h-[48px] md:px-3 lg:h-[52px] lg:px-3.5 xl:px-4",
                        isActive
                          ? "text-light-space light:text-black"
                          : "text-light-space/60 hover:text-light-space/86 light:text-zinc-700 light:hover:text-black",
                        isDimmed && "text-light-space/38 light:text-zinc-600",
                      )}
                      onMouseEnter={() => setOpenId(g.id)}
                      aria-expanded={openId === g.id}
                    >
                      {g.label}
                    </button>
                  </div>
                );
              })}
            </nav>
            <Link
              to="/"
              className="pointer-events-auto nav-fade-item flex shrink-0 justify-center justify-self-center"
              aria-label="Jokuh home"
              style={{ "--item-index": navGroups.length } as CSSProperties}
            >
              <Logo width={36} height={22} />
            </Link>
            <div className="flex min-w-0 items-center justify-end justify-self-end gap-1.5 md:gap-2">
              <NavSearchButton
                beforeOpen={() => setMobileOpen(false)}
                className="nav-fade-item shrink-0"
                style={{ "--item-index": navGroups.length + 1 } as CSSProperties}
              />
              <TryJokuhCta
                className="nav-fade-item shrink-0"
                style={{ "--item-index": navGroups.length + 2 } as CSSProperties}
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {openGroup && (
            <motion.div
              key="nav-mega"
              role="region"
              aria-label={`${openGroup.label} menu`}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
              className="nav-topbar-mega"
              onMouseEnter={cancelClose}
            >
              <div className="mx-auto w-full max-w-[1240px] px-4 pb-12 md:px-5 lg:pl-[48px] lg:pr-[56px]">
                <div
                  className={cn(
                    "grid gap-10",
                    (openGroup.secondary?.length ?? 0) === 0 && "md:max-w-md",
                    (openGroup.secondary?.length ?? 0) === 1 && "md:grid-cols-2 md:gap-16 lg:gap-24",
                    (openGroup.secondary?.length ?? 0) >= 2 &&
                      "md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] md:gap-12 lg:gap-20",
                  )}
                >
                  <div>
                    <p
                      className="nav-fade-item mb-3 font-sans text-[11px] font-normal tracking-[0.06em] text-light-space/40 uppercase light:text-zinc-500"
                      style={{ "--item-index": 0 } as CSSProperties}
                    >
                      {openGroup.primaryHeading ?? openGroup.label}
                    </p>
                    <ul
                      className="flex flex-col"
                      onMouseLeave={() => setPrimaryHoverKey(null)}
                    >
                      {openGroup.primary.map((item, index) => {
                        const pk = `${openGroup.id}:${item.label}`;
                        const dim = primaryHoverKey !== null && primaryHoverKey !== pk;
                        return (
                          <li
                            key={item.label}
                            className="nav-fade-item"
                            style={{ "--item-index": index + 1 } as CSSProperties}
                          >
                            <TopNavAnchor
                              href={item.href}
                              className={cn(
                                "premium-soft-fade block rounded-md py-1.5 font-sans text-[1.375rem] leading-snug font-semibold tracking-[-0.02em] text-light-space first:pt-0 hover:text-light-space/96 light:text-zinc-950 light:hover:text-zinc-700 md:text-[1.5rem] md:leading-[1.2]",
                                dim && "opacity-[0.28]",
                              )}
                              onMouseEnter={() => setPrimaryHoverKey(pk)}
                              onClick={() => setOpenId(null)}
                            >
                              <span className="inline-flex items-center gap-1.5">
                                {item.label}
                                {showOffSiteNavGlyph(item) ? <OffSiteGlyph className="translate-y-px" /> : null}
                              </span>
                            </TopNavAnchor>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {(openGroup.secondary ?? []).map((col, colIndex) => {
                    const isCompactResources = col.heading === "Resources";
                    const columnOffset =
                      openGroup.primary.length +
                      2 +
                      (openGroup.secondary ?? [])
                        .slice(0, colIndex)
                        .reduce((sum, prev) => sum + prev.links.length + 1, 0);
                    return (
                      <div key={col.heading}>
                        <p
                          className="nav-fade-item mb-3 font-sans text-[11px] font-normal tracking-[0.06em] text-light-space/40 uppercase light:text-zinc-500"
                          style={{ "--item-index": columnOffset } as CSSProperties}
                        >
                          {col.heading}
                        </p>
                        <ul className={cn("flex flex-col", isCompactResources ? "gap-y-2" : "gap-0.5")}>
                          {col.links.map((link, linkIndex) => (
                            <li
                              key={link.label}
                              className="nav-fade-item"
                              style={{ "--item-index": columnOffset + linkIndex + 1 } as CSSProperties}
                            >
                              <TopNavAnchor
                                href={link.href}
                                className={cn(
                                  "premium-soft-fade block rounded-md font-sans text-[15px] hover:text-light-space/96 light:hover:text-zinc-900",
                                  isCompactResources
                                    ? "py-0 font-medium text-light-space light:text-zinc-900"
                                    : "py-2 font-semibold text-light-space/80 light:text-zinc-600",
                                )}
                                onClick={() => setOpenId(null)}
                              >
                                <span className="inline-flex items-center gap-1.5">
                                  {link.label}
                                  {showOffSiteNavGlyph(link) ? <OffSiteGlyph className="translate-y-px" /> : null}
                                </span>
                              </TopNavAnchor>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[110] bg-dark-space light:bg-white md:hidden">
          <div className="flex h-14 items-center justify-between border-b border-light-space/10 px-4 light:border-black/[0.08]">
            <Link to="/" aria-label="Jokuh home">
              <Logo width={32} height={20} />
            </Link>
            <button
              type="button"
              className="premium-soft-button flex size-10 items-center justify-center rounded-full text-light-space hover:bg-white/[0.05] light:text-zinc-950 light:hover:bg-zinc-100"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <Cancel01Icon size={22} />
            </button>
          </div>
          <div className="overflow-y-auto px-4 py-6">
            <TryJokuhCta
              className="nav-fade-item mb-8 w-full"
              onNavigate={() => setMobileOpen(false)}
            />
            {navGroups.map((g, groupIndex) => (
              <div
                key={g.id}
                className="mb-10"
              >
                <p
                  className="nav-fade-item mb-2 font-sans text-[11px] font-normal tracking-[0.06em] text-light-space/40 uppercase light:text-zinc-500"
                  style={{ "--item-index": groupIndex + 1 } as CSSProperties}
                >
                  {g.label}
                </p>
                <ul className="space-y-0.5" onMouseLeave={() => setPrimaryHoverKey(null)}>
                  {g.primary.map((item, index) => {
                    const pk = `${g.id}:${item.label}`;
                    const dim = primaryHoverKey !== null && primaryHoverKey !== pk;
                    return (
                      <li
                        key={item.label}
                        className="nav-fade-item"
                        style={{ "--item-index": groupIndex + index + 2 } as CSSProperties}
                      >
                        <TopNavAnchor
                          href={item.href}
                          className={cn(
                            "premium-soft-fade block rounded-md py-2 font-sans text-lg font-semibold tracking-tight text-light-space light:text-zinc-950",
                            dim && "opacity-[0.28]",
                          )}
                          onMouseEnter={() => setPrimaryHoverKey(pk)}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {item.label}
                            {showOffSiteNavGlyph(item) ? <OffSiteGlyph className="translate-y-px" /> : null}
                          </span>
                        </TopNavAnchor>
                      </li>
                    );
                  })}
                </ul>
                {g.secondary?.map((col) => {
                  const isCompactResources = col.heading === "Resources";
                  return (
                    <div key={col.heading} className="mt-6">
                      <p className="premium-soft-fade mb-2 font-sans text-[11px] font-normal tracking-[0.06em] text-light-space/40 uppercase light:text-zinc-500">
                        {col.heading}
                      </p>
                      <ul className={isCompactResources ? "space-y-2" : "space-y-0.5"}>
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <TopNavAnchor
                              href={link.href}
                              className={cn(
                                "premium-soft-fade block rounded-md font-sans text-[15px]",
                                isCompactResources
                                  ? "py-0 font-medium text-light-space light:text-zinc-900"
                                  : "py-2 font-semibold text-light-space/75 light:text-zinc-600",
                              )}
                              onClick={() => setMobileOpen(false)}
                            >
                              <span className="inline-flex items-center gap-1.5">
                                {link.label}
                                {showOffSiteNavGlyph(link) ? <OffSiteGlyph className="translate-y-px" /> : null}
                              </span>
                            </TopNavAnchor>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
