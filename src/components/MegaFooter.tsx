import { ChevronDown, Globe } from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType, type CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import { SITE_LANGUAGES, findSiteLanguageForActive } from "../data/site-languages";
import { getStoredLanguageKey } from "../lib/google-translate";
import { SiteLink } from "./SiteLink";
import { LanguageSelectModal } from "./LanguageSelectModal";
import { resolveRigidNavColumns } from "../config/site-subdomains";
import { showOffSiteNavGlyph } from "../lib/off-site-href";
import { OffSiteGlyph } from "./OffSiteGlyph";
import { SiteBottomNav } from "./SiteBottomNav";
import { SiteThemeToggle } from "./SiteThemeToggle";
import { FOOTER_SIGNATURE } from "../data/site-directory";
import { RIGID_NAV_COLUMNS, type RigidLink } from "../data/rigid-sitemap";
import {
  IconX,
  IconYoutube,
} from "./footer-social-icons";

const FOOTER_COLUMN_ORDER = [
  "product",
  "company",
  "business",
  "developers",
  "more",
] as const;

const FOOTER_COLUMNS = resolveRigidNavColumns(RIGID_NAV_COLUMNS, "footer").sort((a, b) => {
  const aIndex = FOOTER_COLUMN_ORDER.indexOf(a.id as (typeof FOOTER_COLUMN_ORDER)[number]);
  const bIndex = FOOTER_COLUMN_ORDER.indexOf(b.id as (typeof FOOTER_COLUMN_ORDER)[number]);
  return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
});

function DirectoryLink({ link, className }: { link: RigidLink; className?: string }) {
  const { href, label } = link;
  const showGlyph = showOffSiteNavGlyph(link);

  const suffix = showGlyph ? <OffSiteGlyph className="ml-0.5" /> : null;
  return (
    <SiteLink
      href={href}
      className={className}
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

const footerMetaLink =
  "premium-soft-fade text-inherit no-underline hover:opacity-60";

const sectionLabel =
  "font-sans text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] text-light-space/38 light:text-zinc-500";

function FooterColumn({ col, className }: { col: (typeof FOOTER_COLUMNS)[number]; className?: string }) {
  return (
    <div className={className}>
      <h3 className={sectionLabel}>{col.heading}</h3>
      <ul className="mt-4 space-y-0">
        {col.sections.flatMap((sec) =>
          sec.links.map((link) => (
            <li key={link.label + link.href} className="py-[5px]">
              <DirectoryLink link={link} className={linkMuted} />
            </li>
          )),
        )}
      </ul>
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
      <SiteBottomNav />
      <div className="px-3 pt-10 pb-2 md:px-8 md:pt-14 lg:pt-[4.5rem]">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="pb-12 pt-12 md:pb-16 md:pt-14 lg:pb-20 lg:pt-16">
            <div
              className="hidden items-start md:grid md:gap-x-10 md:gap-y-12 lg:gap-x-14 lg:gap-y-14 xl:gap-x-20"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
            >
              {FOOTER_COLUMNS.map((col) => (
                <FooterColumn key={col.id} col={col} className="min-w-0" />
              ))}
            </div>

            <div className="md:hidden">
              {FOOTER_COLUMNS.map((col, colIndex) => (
                <details key={col.id} className="group">
                  <summary className="premium-soft-fade flex cursor-pointer list-none items-center justify-between py-4 font-sans text-[13px] font-semibold leading-tight text-light-space light:text-zinc-950 [&::-webkit-details-marker]:hidden">
                    <span>{col.heading}</span>
                    <ChevronDown
                      className="premium-soft-fade size-4 shrink-0 text-light-space/45 group-open:rotate-180 light:text-zinc-500"
                      aria-hidden
                    />
                  </summary>
                  <div className="accordion-fade-panel pb-5 pl-0.5">
                    <ul className="space-y-0">
                      {col.sections.flatMap((sec, secIndex) =>
                        sec.links.map((link, linkIndex) => (
                          <li
                            key={link.label + link.href}
                            className="accordion-fade-item py-[5px]"
                            style={
                              {
                                "--item-index": colIndex + secIndex * 6 + linkIndex + 1,
                              } as CSSProperties
                            }
                          >
                            <DirectoryLink link={link} className={linkMuted} />
                          </li>
                        )),
                      )}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 pb-8 pt-2 md:px-10 md:pb-10 lg:px-14">
        <div className="mx-auto w-full max-w-[1240px] pt-8 md:pt-9">
          <p className="mb-6 whitespace-pre-line text-center font-sans text-[12px] font-medium leading-snug text-light-space/60 md:mb-7 light:text-zinc-500">
            {FOOTER_SIGNATURE}
          </p>
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
              <SiteLink href="/privacy" className={footerMetaLink}>
                Privacy
              </SiteLink>
              <span className="mx-1.5 text-light-space/30 light:text-zinc-300" aria-hidden>
                ·
              </span>
              <SiteLink href="/terms" className={footerMetaLink}>
                Terms
              </SiteLink>
              <span className="mx-1.5 text-light-space/30 light:text-zinc-300" aria-hidden>
                ·
              </span>
              <SiteLink href="/support" className={footerMetaLink}>
                Support
              </SiteLink>
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
            </p>

            <div className="flex shrink-0 items-center gap-2 md:shrink-0">
              <SiteThemeToggle />
              <button
                type="button"
                onClick={() => setLangOpen(true)}
                className="premium-soft-button inline-flex items-center gap-2 rounded-full bg-light-space/[0.06] px-3 py-2 font-sans text-[12px] text-light-space/65 hover:bg-light-space/[0.1] hover:shadow-[0_14px_32px_-26px_rgba(0,0,0,0.6)] light:bg-section-grey-light light:text-zinc-900 light:hover:bg-zinc-200/80 light:hover:shadow-[0_14px_28px_-24px_rgba(0,0,0,0.14)]"
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
      </div>
      <LanguageSelectModal open={langOpen} onClose={() => setLangOpen(false)} />
    </footer>
  );
}
