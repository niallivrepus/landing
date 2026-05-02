import {
  EditorialArticleHeadingSection,
  EditorialArticleProseSection,
  EditorialArticleShellSection,
  EditorialArticleTemplate,
  PillLink,
} from "../components/system";
import { MANIFESTO } from "../data/manifesto";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function ManifestoPage() {
  useDocumentTitle("Jokuh Manifesto");

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

      <EditorialArticleShellSection className="pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="rounded-[6px] bg-white/[0.04] px-6 py-20 text-center light:bg-section-grey-light md:px-10 md:py-24">
          <h2 className="mx-auto max-w-[720px] font-sans text-[clamp(2rem,4.5vw,2.75rem)] font-semibold leading-[1.08] tracking-[0em] text-light-space light:text-zinc-950">
            Claim your sovereignty.
          </h2>
          <p className="mx-auto mt-5 max-w-[34rem] font-sans text-[15px] leading-[1.65] text-light-space/64 light:text-zinc-600 md:text-[16px]">
            Forge your first sidekick. Reclaim your data, your time, and your freedom.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PillLink href="/download" variant="primary">
              Download Jokuh
            </PillLink>
            <PillLink href="/contact">Talk to us</PillLink>
          </div>
        </div>
      </EditorialArticleShellSection>
    </EditorialArticleTemplate>
  );
}
