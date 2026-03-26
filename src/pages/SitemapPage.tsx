import type { ReactNode } from "react";
import { useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SiteTopBar } from "../components/SiteTopBar";
import { MegaFooter } from "../components/MegaFooter";
import { RIGID_NAV_COLUMNS, type RigidLink } from "../data/rigid-sitemap";

function SitemapLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (href.startsWith("/")) {
    return <Link to={href}>{children}</Link>;
  }
  return <a href={href}>{children}</a>;
}

const linkClass =
  "font-sans text-[12px] text-light-space/65 transition-colors hover:text-[var(--color-green-4)] hover:underline";

function SitemapLinkList({ links }: { links: RigidLink[] }) {
  return (
    <ul className="mt-3 grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 sm:mt-4">
      {links.map((link) => (
        <li key={link.label + link.href}>
          <SitemapLink href={link.href}>
            <span className={linkClass}>{link.label}</span>
          </SitemapLink>
        </li>
      ))}
    </ul>
  );
}

export function SitemapPage() {
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.pathname !== "/sitemap") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash, location.key]);

  return (
    <div className="landing-cinema min-h-screen bg-black text-light-space">
      <SiteTopBar />

      <main
        id="sitemap-top"
        tabIndex={-1}
        className="mx-auto max-w-[980px] scroll-mt-20 px-4 pt-24 pb-10 md:px-6 md:pt-28 md:pb-20"
      >
        <h1 className="font-sans text-[32px] font-semibold leading-tight tracking-tight text-light-space md:text-[40px]">
          Site map
        </h1>
        <div className="mt-4 h-px w-full bg-light-glass-10" aria-hidden />

        <div className="mt-14 space-y-12 md:space-y-16">
          {RIGID_NAV_COLUMNS.map((col) => (
            <section key={col.id} aria-labelledby={`sitemap-${col.id}`}>
              <h2
                id={`sitemap-${col.id}`}
                className="font-sans text-[19px] font-semibold leading-snug tracking-tight text-light-space md:text-[21px]"
              >
                {col.heading}
              </h2>
              <SitemapLinkList links={col.links} />
              {col.support ? (
                <div className="mt-10">
                  <h3 className="font-sans text-[15px] font-semibold text-light-space">{col.support.heading}</h3>
                  <SitemapLinkList links={col.support.links} />
                </div>
              ) : null}
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
      </main>

      <MegaFooter />
    </div>
  );
}
