import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FOOTER_FINE_PRINT } from "../data/site-directory";
import { RIGID_NAV_COLUMNS, type RigidLink } from "../data/rigid-sitemap";

function DirectoryLink({ link, className }: { link: RigidLink; className?: string }) {
  const location = useLocation();
  const { href, label } = link;
  const sitemapScroll =
    location.pathname === "/sitemap" && (href === "/sitemap" || href.startsWith("/sitemap#"));

  if (href.startsWith("/")) {
    return (
      <Link
        to={href}
        className={className}
        onClick={(e) => {
          if (sitemapScroll) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.replaceState(null, "", href.includes("#") ? href : "/sitemap#sitemap-top");
            document.getElementById("sitemap-top")?.focus({ preventScroll: true });
          }
        }}
      >
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

const linkMuted =
  "font-sans text-[12px] text-light-space/55 transition-colors hover:text-light-space hover:underline";

const finePrintLink =
  "text-[#a1a1a6] underline decoration-[#a1a1a6] underline-offset-[3px] transition-colors hover:text-[#d2d2d7] hover:decoration-[#d2d2d7]";

function FooterColumn({ col, className }: { col: (typeof RIGID_NAV_COLUMNS)[number]; className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-sans text-[12px] font-semibold text-light-space">{col.heading}</h3>
      <ul className="mt-2 space-y-2">
        {col.links.map((link) => (
          <li key={link.label + link.href}>
            <DirectoryLink link={link} className={linkMuted} />
          </li>
        ))}
      </ul>
      {col.support ? (
        <div className="mt-8">
          <h3 className="font-sans text-[12px] font-semibold text-light-space">{col.support.heading}</h3>
          <ul className="mt-2 space-y-2">
            {col.support.links.map((link) => (
              <li key={link.label + link.href}>
                <DirectoryLink link={link} className={linkMuted} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function MegaFooter() {
  const location = useLocation();

  return (
    <footer className="bg-black text-light-space">
      <div className="px-5 pt-6 md:px-8 md:pt-8">
        <div className="mx-auto max-w-[1380px]">
          <div className="border-t border-light-glass-10" aria-hidden />
          <div className="space-y-4 py-6 font-sans text-[11px] leading-[1.45] text-[#86868b] md:py-8 md:text-[12px] md:leading-[1.5]">
            {FOOTER_FINE_PRINT.paragraphs.map((block, i) =>
              typeof block === "string" ? (
                <p key={i}>{block}</p>
              ) : (
                <p key={i}>
                  {block.before}
                  <a href={block.href} className={finePrintLink}>
                    {block.linkLabel}
                  </a>
                  .
                </p>
              ),
            )}
          </div>
          <div className="border-t border-light-glass-10" aria-hidden />
          <div className="pb-6 pt-10 md:pb-8">
            <div className="hidden lg:grid lg:grid-cols-5 lg:gap-x-6">
              {RIGID_NAV_COLUMNS.map((col) => (
                <FooterColumn key={col.id} col={col} className="min-w-0" />
              ))}
            </div>

            <div className="lg:hidden">
              {RIGID_NAV_COLUMNS.map((col) => (
                <details key={col.id} className="group border-b border-light-glass-10 last:border-b-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-sans text-[12px] font-semibold text-light-space [&::-webkit-details-marker]:hidden">
                    <span>{col.heading}</span>
                    <ChevronDown
                      className="size-4 shrink-0 text-light-space/45 transition-transform duration-200 group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <div className="pb-4 pl-1">
                    <ul className="space-y-2">
                      {col.links.map((link) => (
                        <li key={link.label + link.href}>
                          <DirectoryLink link={link} className={linkMuted} />
                        </li>
                      ))}
                    </ul>
                    {col.support ? (
                      <div className="mt-6">
                        <p className="font-sans text-[11px] font-semibold tracking-wide text-light-space/40 uppercase">
                          {col.support.heading}
                        </p>
                        <ul className="mt-2 space-y-2">
                          {col.support.links.map((link) => (
                            <li key={link.label + link.href}>
                              <DirectoryLink link={link} className={linkMuted} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 md:px-8">
        <div className="mx-auto max-w-[1380px] border-t border-light-glass-10 py-4">
          <div className="flex flex-col gap-3 font-sans text-[12px] text-light-space/45 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-2">
            <span>Copyright © {new Date().getFullYear()} Jokuh. All rights reserved.</span>
            <nav className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Footer">
              <Link to="/privacy" className="text-light-space/55 hover:text-light-space hover:underline">
                Privacy &amp; Security
              </Link>
              <Link to="/terms" className="text-light-space/55 hover:text-light-space hover:underline">
                Terms
              </Link>
              <Link
                to="/sitemap#sitemap-top"
                onClick={(e) => {
                  if (location.pathname === "/sitemap") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    window.history.replaceState(null, "", "/sitemap#sitemap-top");
                    document.getElementById("sitemap-top")?.focus({ preventScroll: true });
                  }
                }}
                className="text-light-space/55 hover:text-light-space hover:underline"
              >
                Site map
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
