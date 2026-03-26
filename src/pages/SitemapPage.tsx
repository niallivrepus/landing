import type { ReactNode } from "react";
import { useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SiteTopBar } from "../components/SiteTopBar";
import { MegaFooter } from "../components/MegaFooter";
import { SITEMAP_PRODUCT_BLOCKS, SITEMAP_TOP_SECTIONS } from "../data/sitemap-structure";

function SitemapLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return <Link to={href}>{children}</Link>;
  }
  return <a href={href}>{children}</a>;
}

const linkClass =
  "font-sans text-[12px] text-light-space/65 transition-colors hover:text-[var(--color-green-4)] hover:underline";

/** Wall layout: up to 3 columns of links per subsection on large screens. */
const subsectionLinkGrid =
  "mt-3 grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 sm:mt-4";

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
          Jokuh Site Map
        </h1>
        <div className="mt-4 h-px w-full bg-light-glass-10" aria-hidden />

        <div className="mt-14 space-y-12 md:space-y-16">
          <div className="space-y-10 md:space-y-12">
            {SITEMAP_TOP_SECTIONS.map((sec) => (
              <section key={sec.id} aria-labelledby={`sitemap-${sec.id}`}>
                <h2
                  id={`sitemap-${sec.id}`}
                  className="font-sans text-[19px] font-semibold leading-snug tracking-tight text-light-space md:text-[21px]"
                >
                  {sec.heading}
                </h2>
                <ul className={subsectionLinkGrid}>
                  {sec.links.map((link) => (
                    <li key={link.label + link.href}>
                      <SitemapLink href={link.href}>
                        <span className={linkClass}>{link.label}</span>
                      </SitemapLink>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="h-px w-full bg-light-glass-10" aria-hidden />

          {SITEMAP_PRODUCT_BLOCKS.map((block) => (
            <section key={block.id} aria-labelledby={`sitemap-product-${block.id}`} className="space-y-10 md:space-y-11">
              <h2
                id={`sitemap-product-${block.id}`}
                className="font-sans text-[26px] font-semibold leading-tight tracking-tight text-light-space md:text-[32px]"
              >
                {block.title}
              </h2>
              {block.subsections.map((sub) => (
                <div key={sub.id}>
                  <h3 className="font-sans text-[14px] font-semibold text-light-space md:text-[15px]">{sub.heading}</h3>
                  <ul className={subsectionLinkGrid}>
                    {sub.links.map((link) => (
                      <li key={link.label + link.href}>
                        <SitemapLink href={link.href}>
                          <span className={linkClass}>{link.label}</span>
                        </SitemapLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </div>
      </main>

      <MegaFooter />
    </div>
  );
}
