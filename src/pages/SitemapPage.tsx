import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_COMPANY, PAGE_TOP_PAD_DENSE } from "../components/system/shells";
import { OffSiteGlyph } from "../components/OffSiteGlyph";
import { SiteLink } from "../components/SiteLink";
import { showOffSiteNavGlyph } from "../lib/off-site-href";
import { resolveRigidNavColumns } from "../config/site-subdomains";
import { RIGID_NAV_COLUMNS, type RigidLink } from "../data/rigid-sitemap";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const SITEMAP_NAV_COLUMNS = resolveRigidNavColumns(RIGID_NAV_COLUMNS, "sitemap");

function SitemapLink({ href, children }: { href: string; children: ReactNode }) {
  return <SiteLink href={href}>{children}</SiteLink>;
}

const linkClass =
  "font-sans text-[12px] text-light-space/65 transition-colors hover:text-[var(--color-green-4)] hover:underline";

function SitemapLinkList({ links }: { links: RigidLink[] }) {
  return (
    <ul className="mt-3 grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 sm:mt-4">
      {links.map((link) => (
        <li key={link.label + link.href}>
          <SitemapLink href={link.href}>
            <span className={`inline-flex items-center gap-1.5 ${linkClass}`}>
              {link.label}
              {showOffSiteNavGlyph(link) ? <OffSiteGlyph className="translate-y-px" /> : null}
            </span>
          </SitemapLink>
        </li>
      ))}
    </ul>
  );
}

export function SitemapPage() {
  useDocumentTitle("Site map — Jokuh");
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.pathname !== "/sitemap") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash, location.key]);

  return (
    <MarketingPageFrame
      mainProps={{
        id: "sitemap-top",
        tabIndex: -1,
        className: cn(CONTENT_SHELL_COMPANY, PAGE_TOP_PAD_DENSE, "scroll-mt-20"),
      }}
    >
        <h1 className="font-sans text-[32px] font-semibold leading-tight tracking-tight text-light-space md:text-[40px]">
          Site map
        </h1>
        <div className="mt-4 h-px w-full bg-light-glass-10" aria-hidden />

        <div className="mt-14 space-y-12 md:space-y-16">
          {SITEMAP_NAV_COLUMNS.map((col) => (
            <section key={col.id} aria-labelledby={`sitemap-${col.id}`}>
              <h2
                id={`sitemap-${col.id}`}
                className="font-sans text-[19px] font-semibold leading-snug tracking-tight text-light-space md:text-[21px]"
              >
                {col.heading}
              </h2>
              {col.sections.map((sec, i) => {
                const showSubheading =
                  col.sections.length > 1 && !(i === 0 && sec.heading === col.heading);
                return (
                  <div key={sec.heading} className={i === 0 ? "mt-4" : "mt-10"}>
                    {showSubheading ? (
                      <h3 className="font-sans text-[15px] font-semibold text-light-space">{sec.heading}</h3>
                    ) : null}
                    <SitemapLinkList links={sec.links} />
                  </div>
                );
              })}
            </section>
          ))}

          <div className="h-px w-full bg-light-glass-10" aria-hidden />

          <section aria-labelledby="sitemap-footer-only">
            <h2
              id="sitemap-footer-only"
              className="font-sans text-[19px] font-semibold leading-snug tracking-tight text-light-space md:text-[21px]"
            >
              Footer
            </h2>
            <SitemapLinkList
              links={[
                { label: "Privacy & Security", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Site map", href: "/sitemap#sitemap-top" },
              ]}
            />
          </section>
        </div>
    </MarketingPageFrame>
  );
}
