import { LegalLayout, legalMuted } from "../../components/legal/LegalLayout";
import { TertiaryDocBody, TertiaryPageHero } from "../../components/system";
import { PRIVACY_DOCS, type PrivacySection } from "../../data/privacy-docs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

function sectionDomId(section: PrivacySection, index: number) {
  return section.anchor ?? `privacy-section-${index}`;
}

export function LegalPrivacyPage() {
  useDocumentTitle("Privacy Policy — Jokuh");
  const policy = PRIVACY_DOCS.customer;

  return (
    <LegalLayout>
      <TertiaryPageHero
        eyebrow="Legal"
        title="Privacy Policy"
        intro={policy.intro}
      />

      <TertiaryDocBody
        tocItems={policy.sections.map((section, index) => ({
          id: sectionDomId(section, index),
          label: section.title,
        }))}
        footer={
          <div className="space-y-1 text-[12px]">
            <p className={legalMuted}>{policy.documentSubtitle ?? "Updated March 26, 2026"} · Jokuh Legal</p>
            <p className="text-light-space/40 light:text-zinc-500">
              Privacy questions: privacy@jokuh.com
            </p>
          </div>
        }
      >
        {policy.introContinued?.map((paragraph) => (
          <p key={paragraph} className="mb-8 text-[16px] leading-[1.72] text-light-space/75 light:text-zinc-700">
            {paragraph}
          </p>
        ))}

        {policy.sections.map((section, index) => (
          <section
            key={`${section.title}-${index}`}
            id={sectionDomId(section, index)}
            className="scroll-mt-24 pb-10 last:pb-0"
          >
            <h2 className="font-sans text-[22px] font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-[24px]">
              {section.title}
            </h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-[16px] leading-[1.72] text-light-space/75 light:text-zinc-700">
                {paragraph}
              </p>
            ))}
            {section.bullets?.length ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] leading-[1.72] text-light-space/75 marker:text-light-space/35 light:text-zinc-700 light:marker:text-zinc-400">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.afterBullets?.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-[16px] leading-[1.72] text-light-space/75 light:text-zinc-700">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </TertiaryDocBody>
    </LegalLayout>
  );
}
