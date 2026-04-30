import {
  EditorialArticleHeadingSection,
  EditorialArticleProseSection,
  EditorialArticleShellSection,
  EditorialArticleTemplate,
  pageHeroEyebrowUppercaseClass,
} from "../components/system";
import { SiteLink } from "../components/SiteLink";
import { MANIFESTO } from "../data/manifesto";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function ManifestoPage() {
  useDocumentTitle(`${MANIFESTO.title} — ${MANIFESTO.subtitle}`);

  return (
    <EditorialArticleTemplate
      metaLine={MANIFESTO.metaLine}
      title={MANIFESTO.title}
      subtitle={MANIFESTO.subtitle}
    >
      <EditorialArticleProseSection className="py-8 md:py-10">
        <p className="news-detail-reading text-[1.2rem] font-semibold leading-[1.55] text-light-space/90 light:text-zinc-950 md:text-[1.45rem] md:leading-[1.45]">
          {MANIFESTO.dek}
        </p>
      </EditorialArticleProseSection>

      {MANIFESTO.sections.map((section, index) => (
        <section key={section.heading} aria-labelledby={`manifesto-${index}`}>
          <EditorialArticleHeadingSection className={index === 0 ? "pt-10 md:pt-14" : "pt-12 md:pt-16"}>
            <span id={`manifesto-${index}`}>{section.heading}</span>
          </EditorialArticleHeadingSection>
          <EditorialArticleProseSection className="pt-0 pb-0 md:pb-0">
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 56)}
                className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 light:text-zinc-700 md:text-lg md:leading-[1.68]"
              >
                {paragraph}
              </p>
            ))}
          </EditorialArticleProseSection>
        </section>
      ))}

      <EditorialArticleShellSection className="pb-14 pt-12 md:pb-20 md:pt-16">
        <div className="rounded-[32px] border border-light-space/[0.08] bg-white/[0.03] px-6 py-7 md:px-8 md:py-8 light:border-black/[0.08] light:bg-section-grey-light">
          <p className={pageHeroEyebrowUppercaseClass}>Next step</p>
          <h2 className="mt-4 max-w-[32rem] font-sans text-[1.45rem] font-semibold leading-[1.14] tracking-[0em] text-light-space light:text-zinc-950 md:text-[1.8rem]">
            Claim your sovereignty.
          </h2>
          <p className="news-detail-reading mt-4 max-w-[40rem] text-[1rem] leading-[1.72] text-light-space/72 light:text-zinc-700 md:text-[1.05rem]">
            Forge your first sidekick. Reclaim your data, your time, and your freedom.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <SiteLink
              href="/download"
              className="premium-soft-button inline-flex items-center justify-center rounded-full bg-light-space px-5 py-3 font-sans text-[13px] font-semibold text-dark-space transition hover:opacity-88 light:bg-zinc-950 light:text-white"
            >
              Download Jokuh
            </SiteLink>
            <SiteLink
              href="/contact"
              className="premium-soft-button inline-flex items-center justify-center rounded-full border border-light-space/[0.12] px-5 py-3 font-sans text-[13px] font-semibold text-light-space/80 transition hover:bg-light-space/[0.06] hover:text-light-space light:border-black/[0.12] light:text-zinc-800 light:hover:bg-black/[0.04] light:hover:text-zinc-950"
            >
              Talk to us
            </SiteLink>
          </div>
        </div>
      </EditorialArticleShellSection>
    </EditorialArticleTemplate>
  );
}
