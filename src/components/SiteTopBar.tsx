import { Button, Logo, cn } from "@jokuh/gooey";
import { Menu01Icon, Cancel01Icon } from "hugeicons-react";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TopNavAnchor } from "./TopNavAnchor";

type MegaLink = { label: string; href: string };
type MegaColumn = { heading: string; links: MegaLink[] };
type MegaGroup = {
  id: string;
  label: string;
  primaryHeading?: string;
  primary: MegaLink[];
  secondary?: MegaColumn[];
};

const NAV_GROUPS: MegaGroup[] = [
  {
    id: "products",
    label: "Products",
    primary: [
      { label: "Pods", href: "/pods" },
      { label: "Blurbs", href: "/blurbs" },
      { label: "Spine", href: "/spine" },
      { label: "Vortex", href: "/vortex" },
    ],
    secondary: [
      {
        heading: "Explore",
        links: [
          { label: "Prompt bar", href: "/#prompt" },
          { label: "Waitlist", href: "/#start" },
          { label: "Identity", href: "/#identity" },
        ],
      },
      {
        heading: "Learn",
        links: [
          { label: "Overview", href: "/#journal" },
          { label: "Journal", href: "/#journal" },
        ],
      },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    primary: [
      { label: "Identity", href: "/#identity" },
      { label: "Gooey", href: "/#journal" },
      { label: "Prompt bar", href: "/#prompt" },
    ],
    secondary: [
      {
        heading: "Product",
        links: [
          { label: "Pods", href: "/pods" },
          { label: "Spine", href: "/spine" },
          { label: "Blurbs", href: "/blurbs" },
        ],
      },
      {
        heading: "More",
        links: [
          { label: "Journal", href: "/#journal" },
          { label: "Privacy", href: "#" },
        ],
      },
    ],
  },
  {
    id: "ecosystem",
    label: "Ecosystem",
    primary: [
      { label: "V1llains", href: "/#identity" },
      { label: "Waitlist", href: "/#start" },
    ],
    secondary: [
      {
        heading: "Discover",
        links: [
          { label: "Overview", href: "/#journal" },
          { label: "Pods", href: "/pods" },
          { label: "Journal", href: "/#journal" },
        ],
      },
    ],
  },
  {
    id: "company",
    label: "Company",
    primary: [
      { label: "Overview", href: "/#journal" },
      { label: "Journal", href: "/#journal" },
    ],
    secondary: [
      {
        heading: "Legal",
        links: [
          { label: "Privacy", href: "#" },
          { label: "Terms", href: "#" },
        ],
      },
      {
        heading: "Product",
        links: [
          { label: "Waitlist", href: "/#start" },
          { label: "Contact", href: "#" },
        ],
      },
    ],
  },
  {
    id: "developers",
    label: "Developers",
    primary: [
      { label: "Documentation", href: "#" },
      { label: "SDK & API integrations", href: "#" },
      { label: "Gooey", href: "/#journal" },
      { label: "Accessibility", href: "#" },
    ],
    secondary: [
      {
        heading: "Get help",
        links: [
          { label: "Community", href: "#" },
          { label: "Self-service", href: "#" },
          { label: "Genius Bar", href: "#" },
          { label: "Repair", href: "#" },
        ],
      },
      {
        heading: "Helpful topics",
        links: [
          { label: "Jokuh Care", href: "#" },
          { label: "Jokuh account & password", href: "#" },
          { label: "Billing & subscriptions", href: "#" },
          { label: "GitHub", href: "#" },
        ],
      },
    ],
  },
  {
    id: "foundation",
    label: "Foundation",
    primary: [
      { label: "Mission", href: "/#journal" },
      { label: "Privacy & security", href: "#" },
      { label: "Research", href: "/#journal" },
      { label: "Contact", href: "#" },
    ],
    secondary: [
      {
        heading: "Read",
        links: [
          { label: "Journal", href: "/#journal" },
          { label: "Company overview", href: "/#journal" },
        ],
      },
      {
        heading: "Product",
        links: [
          { label: "Waitlist", href: "/#start" },
          { label: "Identity", href: "/#identity" },
        ],
      },
    ],
  },
];

function NavSearchButton({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const goPrompt = useCallback(() => {
    if (pathname === "/") {
      document.getElementById("prompt")?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      navigate("/#prompt");
    }
  }, [navigate, pathname]);

  return (
    <button
      type="button"
      aria-label="Search"
      onClick={goPrompt}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-smoke-4 transition-colors hover:text-light-space focus-visible:ring-2 focus-visible:ring-light-space/30 focus-visible:outline-none md:size-[50px]",
        className,
      )}
    >
      <Search className="size-[22px] md:size-6" strokeWidth={1.75} aria-hidden />
    </button>
  );
}

export function SiteTopBar() {
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

  const openGroup = NAV_GROUPS.find((g) => g.id === openId);

  return (
    <div
      className="fixed top-0 right-0 left-0 z-[100]"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="nav-topbar-glass overflow-visible text-light-space"
      >
        <div className="relative z-[1] mx-auto h-14 max-w-[1380px] px-5 md:h-[56px] md:px-8">
          <div className="grid h-full w-full grid-cols-[2.5rem_1fr_2.5rem] items-center md:hidden">
            <button
              type="button"
              className="flex size-10 items-center justify-center text-white"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu01Icon size={22} strokeWidth={1.5} />
            </button>
            <Link to="/" className="flex justify-center" aria-label="Jokuh home">
              <Logo width={34} height={20} />
            </Link>
            <div className="flex justify-end">
              <NavSearchButton />
            </div>
          </div>

          <div className="hidden h-full items-center md:flex">
            <nav className="flex min-w-0 max-w-[calc(50%-2.75rem)] flex-1 items-stretch gap-0 overflow-x-auto pr-2">
              {NAV_GROUPS.map((g) => (
                <div key={g.id} className="relative flex shrink-0 items-center">
                  <button
                    type="button"
                    className={cn(
                      "flex h-14 items-center px-3 font-sans text-[13px] font-normal tracking-tight whitespace-nowrap transition-colors md:h-[56px] lg:px-3.5",
                      openId === g.id ? "text-white" : "text-white/60 hover:text-white",
                    )}
                    onMouseEnter={() => setOpenId(g.id)}
                    aria-expanded={openId === g.id}
                  >
                    {g.label}
                  </button>
                </div>
              ))}
            </nav>
            <Link
              to="/"
              className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              aria-label="Jokuh home"
            >
              <Logo width={36} height={22} />
            </Link>
            <div className="flex min-w-0 max-w-[calc(50%-2.75rem)] flex-1 items-center justify-end gap-3 pl-2">
              <NavSearchButton />
              <Button variant="primary-neutral" size="xl" className="shrink-0 px-8" asChild>
                <a href="/#start">Try Jokuh</a>
              </Button>
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
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="nav-topbar-mega"
              onMouseEnter={cancelClose}
            >
              <div className="mx-auto max-w-[1380px] px-5 py-12 md:px-8">
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
                    <p className="mb-3 font-sans text-[11px] font-normal tracking-[0.06em] text-light-space/40 uppercase">
                      {openGroup.primaryHeading ?? openGroup.label}
                    </p>
                    <ul
                      className="flex flex-col"
                      onMouseLeave={() => setPrimaryHoverKey(null)}
                    >
                      {openGroup.primary.map((item) => {
                        const pk = `${openGroup.id}:${item.label}`;
                        const dim = primaryHoverKey !== null && primaryHoverKey !== pk;
                        return (
                          <li key={item.label}>
                            <TopNavAnchor
                              href={item.href}
                              className={cn(
                                "block rounded-md py-1.5 font-sans text-[1.375rem] leading-snug font-semibold tracking-[-0.02em] text-light-space transition-[color,opacity] duration-200 first:pt-0 hover:text-white md:text-[1.5rem] md:leading-[1.2]",
                                dim && "opacity-[0.28]",
                              )}
                              onMouseEnter={() => setPrimaryHoverKey(pk)}
                              onClick={() => setOpenId(null)}
                            >
                              {item.label}
                            </TopNavAnchor>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {openGroup.secondary?.map((col) => (
                    <div key={col.heading}>
                      <p className="mb-3 font-sans text-[11px] font-normal tracking-[0.06em] text-light-space/40 uppercase">
                        {col.heading}
                      </p>
                      <ul className="flex flex-col gap-0.5">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <TopNavAnchor
                              href={link.href}
                              className="block rounded-md py-2 font-sans text-[15px] font-medium text-light-space/80 transition-colors hover:text-white"
                              onClick={() => setOpenId(null)}
                            >
                              {link.label}
                            </TopNavAnchor>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[110] bg-black md:hidden">
          <div className="flex h-14 items-center justify-between border-b border-white/10 px-5">
            <Link to="/" aria-label="Jokuh home">
              <Logo width={32} height={20} />
            </Link>
            <button
              type="button"
              className="flex size-10 items-center justify-center text-white"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <Cancel01Icon size={22} />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-6">
            <Button variant="primary-neutral" size="xl" className="mb-8 w-full" asChild>
              <a href="/#start" onClick={() => setMobileOpen(false)}>
                Try Jokuh
              </a>
            </Button>
            {NAV_GROUPS.map((g) => (
              <div key={g.id} className="mb-10">
                <p className="mb-2 font-sans text-[11px] font-normal tracking-[0.06em] text-white/40 uppercase">
                  {g.label}
                </p>
                <ul className="space-y-0.5" onMouseLeave={() => setPrimaryHoverKey(null)}>
                  {g.primary.map((item) => {
                    const pk = `${g.id}:${item.label}`;
                    const dim = primaryHoverKey !== null && primaryHoverKey !== pk;
                    return (
                      <li key={item.label}>
                        <TopNavAnchor
                          href={item.href}
                          className={cn(
                            "block rounded-md py-2 font-sans text-lg font-semibold tracking-tight text-white transition-opacity duration-200",
                            dim && "opacity-[0.28]",
                          )}
                          onMouseEnter={() => setPrimaryHoverKey(pk)}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </TopNavAnchor>
                      </li>
                    );
                  })}
                </ul>
                {g.secondary?.map((col) => (
                  <div key={col.heading} className="mt-6">
                    <p className="mb-2 font-sans text-[11px] font-normal tracking-[0.06em] text-white/40 uppercase">
                      {col.heading}
                    </p>
                    <ul className="space-y-0.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <TopNavAnchor
                            href={link.href}
                            className="block rounded-md py-2 font-sans text-[15px] font-medium text-white/75"
                            onClick={() => setMobileOpen(false)}
                          >
                            {link.label}
                          </TopNavAnchor>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
