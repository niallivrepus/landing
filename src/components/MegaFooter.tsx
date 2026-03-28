import { ChevronDown, Globe } from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { SITE_LANGUAGES, findSiteLanguageForActive } from "../data/site-languages";
import { getStoredLanguageKey } from "../lib/google-translate";
import { SiteLink } from "./SiteLink";
import { LanguageSelectModal } from "./LanguageSelectModal";
import { resolveRigidNavColumns } from "../config/site-subdomains";
import { showOffSiteNavGlyph } from "../lib/off-site-href";
import { OffSiteGlyph } from "./OffSiteGlyph";
import { FOOTER_FINE_PRINT } from "../data/site-directory";
import { RIGID_NAV_COLUMNS, type RigidLink } from "../data/rigid-sitemap";
import {
  IconGithub,
  IconX,
  IconYoutube,
} from "./footer-social-icons";

const FOOTER_COLUMN_ORDER = [
  "product",
  "company",
  "business",
  "developers",
  "more",
  "safety",
  "terms-policies",
] as const;

const FOOTER_COLUMNS = resolveRigidNavColumns(RIGID_NAV_COLUMNS, "footer").sort((a, b) => {
  const aIndex = FOOTER_COLUMN_ORDER.indexOf(a.id as (typeof FOOTER_COLUMN_ORDER)[number]);
  const bIndex = FOOTER_COLUMN_ORDER.indexOf(b.id as (typeof FOOTER_COLUMN_ORDER)[number]);
  return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
});

function DirectoryLink({ link, className }: { link: RigidLink; className?: string }) {
  const location = useLocation();
  const { href, label } = link;
  const showGlyph = showOffSiteNavGlyph(link);
  const sitemapScroll =
    location.pathname === "/sitemap" && (href === "/sitemap" || href.startsWith("/sitemap#"));

  const suffix = showGlyph ? <OffSiteGlyph className="ml-0.5" /> : null;
  return (
    <SiteLink
      href={href}
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
      <span className="inline-flex items-center gap-1">
        {label}
        {suffix}
      </span>
    </SiteLink>
  );
}

const linkMuted =
  "premium-soft-fade font-sans text-[13px] font-semibold leading-[1.45] text-light-space/70 hover:opacity-60 light:text-zinc-600 light:hover:opacity-60";

const finePrintLink =
  "premium-soft-fade text-light-space/45 underline decoration-light-space/35 underline-offset-[3px] hover:opacity-60 light:text-zinc-500 light:decoration-zinc-300 light:hover:opacity-60";

const footerMetaLink =
  "premium-soft-fade text-inherit no-underline hover:opacity-60";

const sectionLabel =
  "font-sans text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] text-light-space/38 light:text-zinc-500";

function FooterColumn({ col, className }: { col: (typeof FOOTER_COLUMNS)[number]; className?: string }) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-10">
        {col.sections.map((sec, i) => (
          <div key={sec.heading + i}>
            <h3 className={sectionLabel}>{sec.heading}</h3>
            <ul className="mt-4 space-y-0">
              {sec.links.map((link) => (
                <li key={link.label + link.href} className="py-[5px]">
                  <DirectoryLink link={link} className={linkMuted} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const socialIconBtn =
  "premium-soft-button inline-flex size-9 items-center justify-center rounded-full text-light-space/55 hover:bg-white/[0.05] hover:opacity-100 focus-visible:ring-2 focus-visible:ring-light-space/25 focus-visible:outline-none light:text-zinc-900 light:opacity-70 light:hover:bg-black/[0.05] light:hover:opacity-100 light:focus-visible:ring-black/20";

const FOOTER_SOCIAL: {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { href: "https://x.com/jokuh", label: "Jokuh on X", Icon: IconX },
  { href: "https://www.youtube.com/@jokuh", label: "Jokuh on YouTube", Icon: IconYoutube },
  { href: "https://github.com/jokuh", label: "Jokuh on GitHub", Icon: IconGithub },
];

export function MegaFooter() {
  const location = useLocation();
  const year = new Date().getFullYear();
  const [langOpen, setLangOpen] = useState(false);

  const footerLang = useMemo(() => {
    const k = getStoredLanguageKey();
    if (k) {
      const hit = SITE_LANGUAGES.find((l) => l.key === k);
      if (hit) return hit;
    }
    return findSiteLanguageForActive();
  }, [location.key]);

  useEffect(() => {
    const open = () => setLangOpen(true);
    window.addEventListener("jokuh-open-language", open);
    return () => window.removeEventListener("jokuh-open-language", open);
  }, []);

  return (
    <footer className="bg-dark-space text-light-space light:bg-white light:text-zinc-900">
      <div className="px-4 pt-10 pb-2 md:px-8 md:pt-14 lg:pt-[4.5rem]">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="border-t border-light-glass-10 light:border-black/[0.08]" aria-hidden />
          <div className="space-y-5 py-10 font-sans text-[11px] leading-relaxed text-light-space/48 md:space-y-6 md:py-14 md:text-[12px] md:leading-relaxed lg:py-16 light:text-zinc-500">
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
          <div className="border-t border-light-glass-10 light:border-black/[0.08]" aria-hidden />
          <div className="pb-12 pt-12 md:pb-16 md:pt-14 lg:pb-20 lg:pt-16">
            <div
              className="hidden items-start lg:grid lg:gap-x-14 lg:gap-y-14 xl:gap-x-20"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
            >
              {FOOTER_COLUMNS.map((col) => (
                <FooterColumn key={col.id} col={col} className="min-w-0" />
              ))}
            </div>

            <div className="lg:hidden">
              {FOOTER_COLUMNS.map((col, colIndex) => (
                <details key={col.id} className="group border-b border-light-glass-10 light:border-black/[0.08] last:border-b-0">
                  <summary className="premium-soft-fade flex cursor-pointer list-none items-center justify-between py-4 font-sans text-[13px] font-semibold leading-tight text-light-space light:text-zinc-950 [&::-webkit-details-marker]:hidden">
                    <span>{col.heading}</span>
                    <ChevronDown
                      className="premium-soft-fade size-4 shrink-0 text-light-space/45 group-open:rotate-180 light:text-zinc-500"
                      aria-hidden
                    />
                  </summary>
                  <div className="accordion-fade-panel pb-5 pl-0.5">
                    <div className="flex flex-col gap-8">
                      {col.sections.map((sec, secIndex) => (
                        <div
                          key={sec.heading}
                          className="accordion-fade-item"
                          style={{ "--item-index": colIndex + secIndex } as CSSProperties}
                        >
                          <p className={sectionLabel}>{sec.heading}</p>
                          <ul className="mt-3 space-y-0">
                            {sec.links.map((link, linkIndex) => (
                              <li
                                key={link.label + link.href}
                                className="accordion-fade-item py-[5px]"
                                style={{ "--item-index": secIndex * 6 + linkIndex + 1 } as CSSProperties}
                              >
                                <DirectoryLink link={link} className={linkMuted} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-8 pt-2 md:px-10 md:pb-10 lg:px-14">
        <div className="mx-auto w-full max-w-[1240px] border-t border-light-glass-10 pt-8 light:border-black/[0.08] md:pt-9">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
            <nav
              className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 md:justify-start"
              aria-label="Social"
            >
              {FOOTER_SOCIAL.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className={socialIconBtn}
                  aria-label={label}
                  {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </nav>

            <p className="order-first max-w-[min(100%,28rem)] text-center font-sans text-[12px] font-semibold leading-snug text-light-space/50 md:order-none md:max-w-none light:text-zinc-600">
              <span className="text-light-space/70 light:text-zinc-900">Jokuh © {year}</span>
              <span className="mx-1.5 text-light-space/30 light:text-zinc-300" aria-hidden>
                ·
              </span>
              <button
                type="button"
                className={footerMetaLink}
                onClick={() => window.dispatchEvent(new Event("jokuh-open-cookies"))}
              >
                Manage cookies
              </button>
              <span className="mx-1.5 text-light-space/30 light:text-zinc-300" aria-hidden>
                ·
              </span>
              <Link to="/legal/privacy" className={footerMetaLink}>
                Privacy
              </Link>
              <span className="mx-1.5 text-light-space/30 light:text-zinc-300" aria-hidden>
                ·
              </span>
              <Link to="/legal/terms" className={footerMetaLink}>
                Terms
              </Link>
              <span className="mx-1.5 text-light-space/30 light:text-zinc-300" aria-hidden>
                ·
              </span>
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
                className={footerMetaLink}
              >
                Site map
              </Link>
            </p>

            <button
              type="button"
              onClick={() => setLangOpen(true)}
              className="premium-soft-button inline-flex items-center gap-2 rounded-full bg-light-space/[0.06] px-3 py-2 font-sans text-[12px] text-light-space/65 hover:bg-light-space/[0.1] hover:shadow-[0_14px_32px_-26px_rgba(0,0,0,0.6)] light:bg-zinc-100 light:text-zinc-900 light:hover:bg-zinc-200/80 light:hover:shadow-[0_14px_28px_-24px_rgba(0,0,0,0.14)] md:shrink-0"
              aria-label="Select language and region"
              aria-haspopup="dialog"
              aria-expanded={langOpen}
            >
              <Globe className="size-[15px] shrink-0 opacity-70 light:opacity-60" strokeWidth={1.5} aria-hidden />
              <span className="text-left">
                <span className="font-medium text-light-space/85 light:text-zinc-900">{footerLang.native}</span>{" "}
                <span className="text-light-space/45 light:text-zinc-500">
                  {footerLang.region ?? footerLang.english}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <LanguageSelectModal open={langOpen} onClose={() => setLangOpen(false)} />
    </footer>
  );
}
