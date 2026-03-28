import { Logo, cn } from "@jokuh/gooey";
import { ArrowLeft, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSiteSearch } from "../context/SiteSearchContext";
import { resolveRigidNavColumns } from "../config/site-subdomains";
import { showOffSiteNavGlyph } from "../lib/off-site-href";
import { useGentleHoverSound } from "../hooks/useGentleHoverSound";
import { CtaLordIcon } from "./CtaLordIcon";
import { OffSiteGlyph } from "./OffSiteGlyph";
import { SearchPanelToggleGlyph } from "./SearchPanelToggleGlyph";
import { TopNavAnchor } from "./TopNavAnchor";
import { RIGID_NAV_COLUMNS, type RigidLink } from "../data/rigid-sitemap";

function NavLogo({ width = 34, height = 20 }: { width?: number; height?: number }) {
  const { pathname } = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
        }}
        exit={{
          opacity: 0,
          y: -14,
          transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
        }}
        className="flex"
      >
        <Logo width={width} height={height} />
      </motion.span>
    </AnimatePresence>
  );
}

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

function showOffSiteGroupGlyph(_groupId: string) {
  return false;
}

function NavSearchButton({
  className,
  beforeOpen,
  style,
  whenOpenGlyph = "square",
}: {
  className?: string;
  beforeOpen?: () => void;
  style?: CSSProperties;
  whenOpenGlyph?: "square" | "close";
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
        "light:text-zinc-500 light:hover:bg-black/[0.05] light:hover:text-zinc-950 light:focus-visible:ring-black/20",
        className,
      )}
      style={style}
    >
      <SearchPanelToggleGlyph open={isOpen} whenOpen={whenOpenGlyph} />
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
        "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 font-sans text-[12px] font-semibold tracking-tight text-black",
        "premium-soft-button shadow-[0_12px_30px_-22px_rgba(0,0,0,0.72)] hover:bg-white/92 hover:shadow-[0_18px_36px_-24px_rgba(0,0,0,0.72)] active:translate-y-px",
        "light:bg-black light:text-white light:hover:bg-zinc-900 light:hover:shadow-[0_16px_34px_-26px_rgba(0,0,0,0.32)]",
        "focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:outline-none light:focus-visible:ring-black/25",
        className,
      )}
    >
      <CtaLordIcon icon="logSignIn" size={16} darkColor="#000000" lightColor="#ffffff" />
      Try Jokuh
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
              className="premium-soft-button flex size-10 items-center justify-center rounded-full text-light-space hover:bg-white/[0.05] light:text-zinc-950 light:hover:bg-black/[0.05]"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-[22px]" strokeWidth={1.75} aria-hidden />
            </button>
            <Link to="/" className="flex justify-center" aria-label="Jokuh home">
              <NavLogo width={34} height={20} />
            </Link>
            <div className="flex justify-end">
              <NavSearchButton beforeOpen={() => setMobileOpen(false)} whenOpenGlyph="close" />
            </div>
          </div>

          <div className="hidden h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 md:grid md:gap-x-3 lg:gap-x-4">
            <nav
              className="group/nav flex min-w-0 items-stretch gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Primary"
            >
              {navGroups.map((g, index) => {
                const hasOpenGroup = openId !== null;
                const isActive = openId === g.id;

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
                        hasOpenGroup
                          ? isActive
                            ? "text-light-space light:text-black"
                            : "text-light-space/38 light:text-zinc-600"
                          : cn(
                              "text-light-space light:text-zinc-950",
                              "group-hover/nav:text-light-space/45 group-hover/nav:hover:text-light-space",
                              "light:group-hover/nav:text-zinc-500 light:group-hover/nav:hover:text-zinc-950",
                            ),
                      )}
                      onMouseEnter={() => setOpenId(g.id)}
                      aria-expanded={openId === g.id}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {g.label}
                        {showOffSiteGroupGlyph(g.id) ? <OffSiteGlyph className="translate-y-px" /> : null}
                      </span>
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
              <NavLogo width={34} height={20} />
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
                    "grid gap-8",
                    (openGroup.secondary?.length ?? 0) === 0 && "md:max-w-md",
                    (openGroup.secondary?.length ?? 0) === 1 && "md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-8 lg:gap-12",
                    (openGroup.secondary?.length ?? 0) >= 2 &&
                      "md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] md:gap-8 lg:gap-12",
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
                          className="nav-fade-item mb-4 font-sans text-[13px] font-semibold tracking-[0.04em] text-light-space/50 uppercase light:text-zinc-400"
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
                                  "premium-soft-fade block rounded-md font-sans text-[16px] hover:text-light-space/96 light:hover:text-zinc-900",
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

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[110] flex flex-col bg-dark-space light:bg-white md:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="grid h-14 shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center border-b border-light-space/10 px-4 light:border-black/[0.08]"
            >
              <div />
              <Link to="/" className="flex justify-center" aria-label="Jokuh home">
                <Logo width={32} height={20} />
              </Link>
              <button
                type="button"
                className="premium-soft-button flex size-10 items-center justify-center justify-self-end rounded-full text-light-space hover:bg-white/[0.05] light:text-zinc-950 light:hover:bg-zinc-100"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-[22px]" strokeWidth={1.75} aria-hidden />
              </button>
            </motion.div>

            <div className="flex-1 overflow-y-auto px-4 pb-24">
              <AnimatePresence mode="popLayout" initial={false}>
                {openId === null ? (
                  <motion.ul
                    key="top-level"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="py-6"
                  >
                    {navGroups.map((g, i) => (
                      <motion.li
                        key={g.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenId(g.id)}
                          className="block w-full py-3 text-left font-sans text-[2.25rem] font-semibold tracking-[-0.02em] text-light-space light:text-zinc-950"
                        >
                          <span className="inline-flex items-center gap-2">
                            {g.label}
                            {showOffSiteGroupGlyph(g.id) ? <OffSiteGlyph className="translate-y-px" /> : null}
                          </span>
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (() => {
                  const active = navGroups.find((g) => g.id === openId);
                  if (!active) return null;
                  const allLinks = [
                    ...active.primary,
                    ...(active.secondary ?? []).flatMap((col) => col.links),
                  ];
                  return (
                    <motion.div
                      key={`sub-${openId}`}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="py-6"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenId(null)}
                        className="mb-4 inline-flex items-center gap-2 font-sans text-[14px] font-medium text-light-space/60 transition-colors hover:text-light-space light:text-zinc-500 light:hover:text-zinc-950"
                      >
                        <ArrowLeft className="size-4" strokeWidth={2} />
                        Home
                      </button>
                      <p className="mb-3 font-sans text-[11px] font-normal uppercase tracking-[0.06em] text-light-space/40 light:text-zinc-500">
                        {active.label}
                      </p>
                      <ul>
                        {allLinks.map((item, i) => (
                          <motion.li
                            key={item.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.035, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <TopNavAnchor
                              href={item.href}
                              className="block py-3 font-sans text-[2.25rem] font-semibold tracking-[-0.02em] text-light-space light:text-zinc-950"
                              onClick={() => { setMobileOpen(false); setOpenId(null); }}
                            >
                              <span className="inline-flex items-center gap-2">
                                {item.label}
                                {showOffSiteNavGlyph(item) ? <OffSiteGlyph className="translate-y-px" /> : null}
                              </span>
                            </TopNavAnchor>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 border-t border-light-space/10 bg-dark-space px-4 py-4 light:border-black/[0.08] light:bg-white"
            >
              <TryJokuhCta
                className="nav-fade-item w-full"
                onNavigate={() => { setMobileOpen(false); setOpenId(null); }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
