import {
  EditorialArticleHeadingSection,
  EditorialArticleProseSection,
  EditorialArticleShellSection,
  PillLink,
  TertiaryPageChrome,
  pageHeroEyebrowClass,
} from "../components/system";
import { CONTENT_SHELL_COMPANY } from "../components/system/shells";
import { RichParagraph } from "../components/news-detail/RichParagraph";
import { MANIFESTO } from "../data/manifesto";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { cn } from "@jokuh/gooey";

export function ManifestoPage() {
  useDocumentTitle("Jokuh Manifesto");

  return (
    <TertiaryPageChrome>
      <main className="pb-16 md:pb-24">
        <section className={cn(CONTENT_SHELL_COMPANY, "pt-20 pb-16 text-center md:pt-24 md:pb-20")}>
          <p className={pageHeroEyebrowClass}>{MANIFESTO.metaLine}</p>
          <h1 className="mx-auto mt-5 max-w-[58rem] text-balance font-sans text-[clamp(2.75rem,7vw,5.75rem)] font-medium leading-[0.95] tracking-[0em] text-light-space light:text-zinc-950">
            {MANIFESTO.subtitle}
          </h1>
          <p className="mx-auto mt-7 max-w-[42rem] text-balance text-pretty font-sans text-[17px] font-semibold leading-[1.65] text-light-space/82 light:text-zinc-700 md:text-[18px] md:leading-[1.7]">
            {MANIFESTO.dek}
          </p>
        </section>

      {MANIFESTO.sections.map((section, index) => {
        const isOpeningSection = index === 0;

        return (
          <section
            key={section.heading}
            aria-labelledby={isOpeningSection ? undefined : `manifesto-${index}`}
          >
          {!isOpeningSection ? (
            <EditorialArticleHeadingSection className="pt-12 md:pt-16">
              <span id={`manifesto-${index}`}>{section.heading}</span>
            </EditorialArticleHeadingSection>
          ) : null}
          <EditorialArticleProseSection className="pt-0 pb-0 md:pb-0">
            {section.paragraphs.map((paragraph) => (
              <RichParagraph
                key={paragraph.slice(0, 56)}
                className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 light:text-zinc-700 md:text-lg md:leading-[1.68]"
              >
                {paragraph}
              </RichParagraph>
            ))}
          </EditorialArticleProseSection>
        </section>
        );
      })}

      <EditorialArticleShellSection className="pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="rounded-[6px] bg-white/[0.04] px-6 py-20 text-center light:bg-section-grey-light md:px-10 md:py-24">
          <h2 className="mx-auto max-w-[720px] font-sans text-[clamp(2rem,4.5vw,2.75rem)] font-semibold leading-[1.08] tracking-[0em] text-light-space light:text-zinc-950">
            Do Not Trust. Verify.
          </h2>
          <p className="mx-auto mt-5 max-w-[34rem] font-sans text-[15px] leading-[1.65] text-light-space/64 light:text-zinc-600 md:text-[16px]">
            Test the claims. Demand attestations. Bring a threat model.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PillLink href="/download" variant="primary">
              Download Jokuh
            </PillLink>
            <PillLink href="/contact">Talk to us</PillLink>
          </div>
        </div>
      </EditorialArticleShellSection>
      </main>
    </TertiaryPageChrome>
  );
}
