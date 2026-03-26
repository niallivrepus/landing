import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MarketingPageFrame } from "../system/MarketingPageFrame";
import { MegaFooter } from "../MegaFooter";

export const legalLink = "text-[var(--color-blue-4)] transition-colors hover:underline";
export const legalMuted = "text-light-space/60";

const subNav = [
  { label: "Hardware", href: "/legal#hardware" },
  { label: "Software", href: "/legal#software" },
  { label: "Ethics & Compliance", href: "/legal#ethics" },
  { label: "Internet Services", href: "/legal/internet-services" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Use", href: "/legal/terms" },
];

export function LegalLayout({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb?: ReactNode;
}) {
  return (
    <MarketingPageFrame wrapMain={false} footer={null} withAntialiased>
      <div className="pt-14 md:pt-14">
        <header className="sticky top-14 z-50 border-b border-light-glass-10 bg-dark-space/90 backdrop-blur-md light:border-black/[0.08] light:bg-white light:backdrop-blur-none md:top-14">
          <div className="mx-auto flex h-[52px] max-w-[1024px] items-center justify-between gap-4 px-4 md:h-14 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                to="/legal"
                className="font-sans text-[21px] font-semibold tracking-tight text-light-space transition-colors hover:text-[var(--color-blue-4)] light:text-zinc-950"
              >
                Legal
              </Link>
            </div>
            <nav
              className="-mr-1 flex max-w-[min(100vw-8rem,520px)] flex-nowrap items-center justify-end gap-x-4 gap-y-1 overflow-x-auto pb-0.5 font-sans md:max-w-none md:flex-wrap md:overflow-visible"
              aria-label="Legal sections"
            >
              {subNav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="shrink-0 text-[12px] text-light-space/70 transition-colors hover:text-[var(--color-blue-4)] hover:underline light:text-zinc-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {breadcrumb}

        {children}

        <div className="mt-20">
          <MegaFooter />
        </div>
      </div>
    </MarketingPageFrame>
  );
}

export function LegalBreadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <div className="border-b border-light-glass-10 bg-dark-space">
      <div className="mx-auto max-w-[1024px] px-4 py-3 md:px-8">
        <ol className="flex flex-wrap items-center gap-1 font-sans text-[12px] text-light-space/65">
          {items.map((item, i) => (
            <li key={item.label + i} className="flex items-center gap-1">
              {i > 0 && <span className="text-light-space/35">›</span>}
              {item.to ? (
                <Link to={item.to} className="transition-colors hover:text-[var(--color-blue-4)] hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="text-light-space">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
