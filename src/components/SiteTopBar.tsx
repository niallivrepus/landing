import { Logo, cn } from "@jokuh/gooey";
import { Player } from "@lordicon/react";
import menuLordicon from "../../node_modules/@jokuh/gooey/src/assets/lordicon/filled/spinner-rain.json";
import closeMenuLordicon from "../../node_modules/@jokuh/gooey/src/assets/lordicon/outline/cross.json";
import searchLordicon from "../../node_modules/@jokuh/gooey/src/assets/lordicon/outline/search.json";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { useSiteSearch } from "../context/SiteSearchContext";
import { resolveRigidNavColumns } from "../config/site-subdomains";
import { showOffSiteNavGlyph } from "../lib/off-site-href";
import { useGentleHoverSound } from "../hooks/useGentleHoverSound";
import { NavSearchMegaPanel } from "./NavSearchMegaPanel";
import { OffSiteGlyph } from "./OffSiteGlyph";
import { SearchPanelToggleGlyph } from "./SearchPanelToggleGlyph";
import { TopNavAnchor } from "./TopNavAnchor";
import { RIGID_NAV_COLUMNS, type RigidLink } from "../data/rigid-sitemap";
import { CONTENT_SHELL_WIDE } from "./system/shells";

/** Sentinel `openId` value used to render the inline search panel in the same mega-menu slot. */
const SEARCH_NAV_ID = "__search__";

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

type MegaLink = Pick<RigidLink, "label" | "href" | "summary" | "navGlyph">;
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

const megaSectionLabel =
  "nav-fade-item mb-4 font-sans text-[11px] font-semibold tracking-[0.08em] text-light-space/42 uppercase light:text-zinc-500";

function NavSearchButton({
  className,
  beforeOpen,
  style,
  whenOpenGlyph = "square",
  isOpen: controlledOpen,
  onToggle: controlledToggle,
}: {
  className?: string;
  beforeOpen?: () => void;
  style?: CSSProperties;
  whenOpenGlyph?: "square" | "close";
  /** When provided, overrides the global SiteSearch context (used for the inline desktop panel). */
  isOpen?: boolean;
  onToggle?: () => void;
}) {
  const ctx = useSiteSearch();
  const isOpen = controlledOpen ?? ctx.isOpen;
  const handleClick = controlledToggle ?? ctx.toggle;

  return (
    <button
      type="button"
      aria-label={isOpen ? "Close search" : "Open search"}
      onClick={() => {
        beforeOpen?.();
        handleClick();
      }}
      className={cn(
        "premium-soft-button inline-flex size-10 shrink-0 items-center justify-center rounded-full text-light-space/55",
        "hover:bg-white/[0.05] hover:text-light-space/92 focus-visible:ring-2 focus-visible:ring-light-space/30 focus-visible:outline-none",
        isOpen && "text-light-space/92 light:text-zinc-950",
        "light:text-zinc-500 light:hover:bg-black/[0.05] light:hover:text-zinc-950 light:focus-visible:ring-black/20",
        className,
      )}
      style={style}
    >
      <SearchPanelToggleGlyph open={isOpen} whenOpen={whenOpenGlyph} />
    </button>
  );
}

function LordiconNavButton({
  label,
  icon,
  onClick,
  className,
  iconClassName,
  buttonRef,
  ariaControls,
  ariaExpanded,
}: {
  label: string;
  icon: object;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
  buttonRef?: Ref<HTMLButtonElement>;
  ariaControls?: string;
  ariaExpanded?: boolean;
}) {
  const playerRef = useRef<any>(null);

  const play = () => playerRef.current?.playFromBeginning();

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      onMouseEnter={play}
      onFocus={play}
      className={cn(
        "premium-soft-button inline-flex size-10 shrink-0 items-center justify-center rounded-full text-light-space/72",
        "hover:bg-white/[0.06] hover:text-light-space focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:outline-none",
        "light:text-zinc-600 light:hover:bg-black/[0.05] light:hover:text-zinc-950 light:focus-visible:ring-black/20",
        className,
      )}
    >
      <span className={cn("inline-flex", iconClassName)}>
        <Player key={label} ref={playerRef} icon={icon} size={24} colorize="currentColor" />
      </span>
    </button>
  );
}

export function PrimaryNavCta({
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
      to="/download"
      onClick={onNavigate}
      style={style}
      data-nav-cta="primary"
      {...hoverSoundProps}
      className={cn(
        "inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-white px-5 font-sans text-[12px] font-semibold tracking-tight text-black",
        "premium-soft-button shadow-[0_12px_30px_-22px_rgba(0,0,0,0.72)] hover:bg-white/92 hover:shadow-[0_18px_36px_-24px_rgba(0,0,0,0.72)] active:translate-y-px",
        "light:bg-black light:text-white light:hover:bg-zinc-900 light:hover:shadow-[0_16px_34px_-26px_rgba(0,0,0,0.32)]",
        "focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:outline-none light:focus-visible:ring-black/25",
        className,
      )}
    >
      Start
    </Link>
  );
}

export function SiteTopBar({
  transparent = false,
  hidden = false,
}: {
  transparent?: boolean;
  hidden?: boolean;
} = {}) {
  const siteSearch = useSiteSearch();
  const navGroups = useMemo(
    () => buildNavGroups(resolveRigidNavColumns(RIGID_NAV_COLUMNS, "primary")),
    [],
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [primaryHoverKey, setPrimaryHoverKey] = useState<string | null>(null);
  const closeT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const cancelClose = useCallback(() => {
    if (closeT.current) {
      clearTimeout(closeT.current);
      closeT.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    setOpenId(null);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  useEffect(() => {
    setPrimaryHoverKey(null);
  }, [openId]);

  useEffect(() => {
    if (hidden) setOpenId(null);
  }, [hidden]);

  useEffect(() => {
    if (!mobileOpen) setPrimaryHoverKey(null);
  }, [mobileOpen]);

  const openGroup = navGroups.find((g) => g.id === openId);

  const openMobileMenu = useCallback(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpenId(null);
    setMobileOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setOpenId(null);
    setPrimaryHoverKey(null);
    window.requestAnimationFrame(() => {
      const target = returnFocusRef.current ?? menuButtonRef.current;
      target?.focus();
      returnFocusRef.current = null;
    });
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const getFocusable = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          [
            'a[aria-label="Jokuh home"]',
            'button[aria-label="Open search"]',
            'button[aria-label="Close menu"]',
            "#jokuh-mobile-menu a[href]",
            "#jokuh-mobile-menu button:not([disabled])",
            '#jokuh-mobile-menu [tabindex]:not([tabindex="-1"])',
          ].join(", "),
        ),
      ).filter((node) => {
        const rect = node.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          !node.hasAttribute("disabled") &&
          node.getAttribute("aria-hidden") !== "true"
        );
      });

    const handleWindowKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!focusable.includes(active as HTMLElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleWindowKeyDown);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [closeMobileMenu, mobileOpen]);

  return (
    <div
      data-mega-open={openId !== null ? "true" : undefined}
      aria-hidden={hidden || undefined}
      inert={hidden}
      className={cn(
        "nav-topbar-glass fixed top-0 right-0 left-0 z-[100] overflow-visible text-light-space light:text-zinc-950",
        transparent && "site-topbar-overlay",
        mobileOpen && "z-[320]",
        hidden && "site-topbar-hidden pointer-events-none",
      )}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={cn(CONTENT_SHELL_WIDE, "relative z-[1] h-14 md:h-[60px] min-[1200px]:h-16")}>
          <div className="grid h-full w-full grid-cols-[5rem_1fr_5rem] items-center md:hidden">
            <div />
            <Link
              to="/"
              className="flex justify-center"
              aria-label="Jokuh home"
              onClick={mobileOpen ? closeMobileMenu : undefined}
            >
              <NavLogo width={34} height={20} />
            </Link>
            <div className="flex justify-end gap-1">
              <LordiconNavButton
                label="Open search"
                icon={searchLordicon}
                onClick={() => {
                  setMobileOpen(false);
                  setOpenId(null);
                  setPrimaryHoverKey(null);
                  siteSearch.open();
                }}
              />
              <LordiconNavButton
                label={mobileOpen ? "Close menu" : "Open menu"}
                icon={mobileOpen ? closeMenuLordicon : menuLordicon}
                onClick={mobileOpen ? closeMobileMenu : openMobileMenu}
                buttonRef={menuButtonRef}
                ariaControls="jokuh-mobile-menu"
                ariaExpanded={mobileOpen}
                className="text-light-space light:text-zinc-950"
                iconClassName={mobileOpen ? undefined : "rotate-90"}
              />
            </div>
          </div>

          <div className="hidden h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 md:grid min-[1200px]:gap-x-3 xl:gap-x-4">
            <nav
              className="group/nav flex min-w-0 items-stretch gap-0 overflow-x-auto md:-ml-3 lg:-ml-3.5 xl:-ml-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                      onClick={() => {
                        cancelClose();
                        setOpenId(g.id);
                      }}
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
                isOpen={openId === SEARCH_NAV_ID}
                onToggle={() => {
                  cancelClose();
                  setOpenId((current) => (current === SEARCH_NAV_ID ? null : SEARCH_NAV_ID));
                }}
                className="nav-fade-item shrink-0"
                style={{ "--item-index": navGroups.length + 1 } as CSSProperties}
              />
              <PrimaryNavCta
                className="nav-fade-item shrink-0"
                style={{ "--item-index": navGroups.length + 2 } as CSSProperties}
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {!mobileOpen && openId === SEARCH_NAV_ID && (
            <motion.div
              key="nav-search"
              role="region"
              aria-label="Search Jokuh"
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  opacity: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                  y: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              exit={{
                opacity: 0,
                y: -10,
                transition: {
                  opacity: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                  y: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="nav-topbar-mega hidden md:block"
              onMouseEnter={cancelClose}
            >
              <NavSearchMegaPanel onNavigate={() => setOpenId(null)} />
            </motion.div>
          )}
          {!mobileOpen && openGroup && (
            <motion.div
              key="nav-mega"
              role="region"
              aria-label={`${openGroup.label} menu`}
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  opacity: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                  y: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              exit={{
                opacity: 0,
                y: -10,
                transition: {
                  opacity: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                  y: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="nav-topbar-mega hidden md:block"
              onMouseEnter={cancelClose}
            >
              <div className={cn(CONTENT_SHELL_WIDE, "pb-12")}>
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
                      className={megaSectionLabel}
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
                                "premium-soft-fade block rounded-md py-2 font-sans text-light-space first:pt-0 hover:text-light-space/96 light:text-zinc-950 light:hover:text-zinc-700",
                                dim && "opacity-[0.28]",
                              )}
                              onMouseEnter={() => setPrimaryHoverKey(pk)}
                              onClick={() => setOpenId(null)}
                            >
                              <span className="inline-flex items-center gap-1.5 text-[1.375rem] leading-snug font-semibold tracking-[0em] md:text-[1.5rem] md:leading-[1.2]">
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
                    const isSmallSideLinks =
                      (openGroup.id === "business" && col.heading === "Business resources") ||
                      (openGroup.id === "company" && col.heading === "Company links");
                    const columnOffset =
                      openGroup.primary.length +
                      2 +
                      (openGroup.secondary ?? [])
                        .slice(0, colIndex)
                        .reduce((sum, prev) => sum + prev.links.length + 1, 0);
                    return (
                      <div key={col.heading}>
                        <p
                          className={megaSectionLabel}
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
                                  "premium-soft-fade block rounded-md font-sans hover:text-light-space/96 light:hover:text-zinc-900",
                                  isCompactResources
                                    ? "py-0 text-[16px] font-medium text-light-space light:text-zinc-900"
                                    : isSmallSideLinks
                                      ? "py-1 text-[13px] font-semibold text-light-space/72 light:text-zinc-600"
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

      {typeof document !== "undefined" ? createPortal(
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="jokuh-mobile-menu"
            key="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Primary menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[300] isolate flex h-[100dvh] w-screen flex-col overflow-hidden bg-black/78 text-light-space backdrop-blur-[44px] light:bg-white/82 light:text-zinc-950 md:hidden"
          >
            <div className="absolute inset-0 z-0 bg-black/58 backdrop-blur-[44px] light:bg-white/58" aria-hidden />

            <div className="relative z-[1] flex-1 overflow-y-auto px-3 pb-8 pt-28 sm:px-8 sm:pt-32 md:px-10">
              <motion.nav
                key="mobile-expanded-menu"
                aria-label="Primary navigation"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col"
              >
                {navGroups.map((group, groupIndex) => {
                  const allLinks = [
                    {
                      heading: group.primaryHeading ?? group.label,
                      links: group.primary,
                    },
                    ...(group.secondary ?? []),
                  ]
                    .filter((section) => section.links.length > 0)
                    .flatMap((section) => section.links);
                  const isExpanded = openId === group.id;
                  const mobileLabel = group.id === "product" ? "Products" : group.label;

                  return (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.36, delay: groupIndex * 0.045, ease: [0.22, 1, 0.36, 1] }}
                      className="min-w-0"
                    >
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() => setOpenId((current) => (current === group.id ? null : group.id))}
                        className="premium-soft-fade flex w-full items-center justify-between py-2 text-left font-sans text-[2.75rem] leading-[1.06] font-normal tracking-[0em] text-light-space hover:text-light-space/72 focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:outline-none light:text-zinc-950 light:hover:text-zinc-600 light:focus-visible:ring-black/20 sm:text-[4rem] md:text-[4.75rem]"
                      >
                        <span className="inline-flex min-w-0 items-center gap-3">
                          {mobileLabel}
                          {showOffSiteGroupGlyph(group.id) ? <OffSiteGlyph className="translate-y-px" /> : null}
                        </span>
                        <span
                          aria-hidden
                          className={cn(
                            "ml-4 inline-flex size-8 shrink-0 items-center justify-center text-[2rem] leading-none text-light-space/42 transition-transform duration-300 light:text-zinc-500",
                            isExpanded && "rotate-45",
                          )}
                        >
                          +
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded ? (
                          <motion.ul
                            key={`${group.id}-links`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden pb-3 pt-1"
                          >
                            {allLinks.map((item, itemIndex) => (
                              <motion.li
                                key={`${group.id}:${item.label}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.24, delay: itemIndex * 0.025, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <TopNavAnchor
                                  href={item.href}
                                  className="premium-soft-fade block rounded-lg py-1.5 font-sans text-[1.05rem] leading-tight font-medium tracking-[0em] text-light-space/58 hover:text-light-space focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:outline-none light:text-zinc-500 light:hover:text-zinc-950 light:focus-visible:ring-black/20 sm:text-[1.5rem]"
                                  onClick={closeMobileMenu}
                                >
                                  <span className="inline-flex min-w-0 items-center gap-2">
                                    <span className="min-w-0 break-words">{item.label}</span>
                                    {showOffSiteNavGlyph(item) ? <OffSiteGlyph className="shrink-0 translate-y-px" /> : null}
                                  </span>
                                </TopNavAnchor>
                              </motion.li>
                            ))}
                          </motion.ul>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.36, delay: navGroups.length * 0.045, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8 border-t border-white/22 pt-6 light:border-black/15"
                >
                  <TopNavAnchor
                    href="/download"
                    className="premium-soft-fade block py-1.5 font-sans text-[2rem] leading-tight font-normal tracking-[0em] text-light-space hover:text-light-space/72 focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:outline-none light:text-zinc-950 light:hover:text-zinc-600 light:focus-visible:ring-black/20 sm:text-[3.25rem]"
                    onClick={closeMobileMenu}
                  >
                    Start
                  </TopNavAnchor>
                  <TopNavAnchor
                    href="/contact"
                    className="premium-soft-fade block py-1.5 font-sans text-[2rem] leading-tight font-normal tracking-[0em] text-light-space/48 hover:text-light-space focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:outline-none light:text-zinc-400 light:hover:text-zinc-950 light:focus-visible:ring-black/20 sm:text-[3.25rem]"
                    onClick={closeMobileMenu}
                  >
                    Contact sales
                  </TopNavAnchor>
                </motion.div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      ) : null}
    </div>
  );
}
