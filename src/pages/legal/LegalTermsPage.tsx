import { LegalBreadcrumb, LegalLayout, legalMuted } from "../../components/legal/LegalLayout";
import { TertiaryDocBody, TertiaryPageHero } from "../../components/system";
import { TERMS_SECTIONS } from "../../data/terms-sections";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function LegalTermsPage() {
  useDocumentTitle("Website Terms — Jokuh");

  return (
    <LegalLayout
      breadcrumb={
        <LegalBreadcrumb
          items={[
            { label: "Jokuh", to: "/" },
            { label: "Legal", to: "/legal" },
            { label: "Internet Services", to: "/legal/internet-services" },
            { label: "Website Terms" },
          ]}
        />
      }
    >
      <TertiaryPageHero
        eyebrow="Legal information"
        title="Website Terms"
        intro="These terms govern use of Jokuh’s public websites, preview pages, and linked marketing properties."
      />

      <TertiaryDocBody
        tocItems={TERMS_SECTIONS.map((section) => ({ id: section.id, label: section.title }))}
        sections={TERMS_SECTIONS.map((section) => ({
          id: section.id,
          title: section.title,
          body: section.paragraphs,
          cta: section.cta,
        }))}
        footer={
          <div className="space-y-1 text-[12px]">
            <p className={legalMuted}>Updated March 26, 2026 · Jokuh Legal</p>
            <p className="text-light-space/40 light:text-zinc-500">
              Copyright © {new Date().getFullYear()} Jokuh. All rights reserved.
            </p>
          </div>
        }
      />
    </LegalLayout>
  );
}
