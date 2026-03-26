import { cn } from "@jokuh/gooey";
import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FOOTER_FINE_PRINT, SITE_DIRECTORY_COLUMNS, type SiteLink } from "../data/site-directory";

function DirectoryLink({ link, className }: { link: SiteLink; className?: string }) {
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
    <a href={href} className={className}>
      {label}
    </a>
  );
}

const linkMuted =
  "font-sans text-[12px] text-light-space/55 transition-colors hover:text-light-space hover:underline";

const finePrintLink =
  "text-[#a1a1a6] underline decoration-[#a1a1a6] underline-offset-[3px] transition-colors hover:text-[#d2d2d7] hover:decoration-[#d2d2d7]";

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
              {SITE_DIRECTORY_COLUMNS.map((col, colIdx) => (
                <div key={colIdx} className="min-w-0">
                  {col.sections.map((sec) => (
                    <div key={sec.id} className={cn(sec.id !== col.sections[0].id && "mt-10")}>
                      <h3 className="font-sans text-[12px] font-semibold text-light-space">{sec.heading}</h3>
                      <ul className="mt-2 space-y-2">
                        {sec.links.map((link) => (
                          <li key={link.label + link.href}>
                            <DirectoryLink link={link} className={linkMuted} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="lg:hidden">
              {SITE_DIRECTORY_COLUMNS.map((col, colIdx) => (
                <details
                  key={colIdx}
                  className="group border-b border-light-glass-10 last:border-b-0"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-sans text-[12px] font-semibold text-light-space [&::-webkit-details-marker]:hidden">
                    <span>{col.sections.map((s) => s.heading).join(" · ")}</span>
                    <ChevronDown
                      className="size-4 shrink-0 text-light-space/45 transition-transform duration-200 group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <div className="pb-4 pl-1">
                    {col.sections.map((sec) => (
                      <div key={sec.id} className="mt-4 first:mt-0">
                        <p className="font-sans text-[11px] font-semibold tracking-wide text-light-space/40 uppercase">
                          {sec.heading}
                        </p>
                        <ul className="mt-2 space-y-2">
                          {sec.links.map((link) => (
                            <li key={link.label + link.href}>
                              <DirectoryLink link={link} className={linkMuted} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 md:px-8">
        <div className="mx-auto max-w-[1380px] border-t border-light-glass-10 py-4">
          <p className="font-sans text-[12px] text-light-space/45">
            More ways to connect: join the waitlist or open the prompt bar on the home page.
          </p>
          <div className="mt-4 flex flex-col gap-3 pt-3 font-sans text-[12px] text-light-space/45 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Copyright © {new Date().getFullYear()} Jokuh. All rights reserved.</span>
            </div>
            <nav className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Legal">
              <Link to="/legal/privacy" className="text-light-space/55 hover:text-light-space hover:underline">
                Privacy Policy
              </Link>
              <Link to="/legal/terms" className="text-light-space/55 hover:text-light-space hover:underline">
                Terms of Use
              </Link>
              <Link to="/legal" className="text-light-space/55 hover:text-light-space hover:underline">
                Legal
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
                Site Map
              </Link>
            </nav>
            <span className="md:ml-auto">United States</span>
          </div>
          <div className="mt-6 flex justify-center md:justify-start">
            <Link
              to="/"
              className="font-sans text-[13px] font-semibold tracking-tight text-light-space hover:text-white"
            >
              Jokuh
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
