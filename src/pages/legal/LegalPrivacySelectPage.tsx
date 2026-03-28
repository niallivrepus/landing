import { Globe } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { DocumentTopicCard } from "../../components/legal/DocumentTopicCard";
import { LegalBreadcrumb, LegalLayout, legalLink } from "../../components/legal/LegalLayout";
import { LEGAL_PRIVACY_LOCALES } from "../../data/legal-locales";
import {
  getPrivacyBreadcrumbLabel,
  getPrivacyDocTitle,
  isPrivacyDocKey,
  PRIVACY_DOCS,
  PRIVACY_TOPIC_ROWS,
  type PrivacyDocKey,
} from "../../data/privacy-docs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { TertiaryHubBody, TertiaryPageHero } from "../../components/system";

export function LegalPrivacySelectPage() {
  const { docKey = "" } = useParams<{ docKey: string }>();

  if (!isPrivacyDocKey(docKey)) {
    return <Navigate to="/legal/privacy" replace />;
  }

  const meta = PRIVACY_DOCS[docKey as PrivacyDocKey];
  useDocumentTitle(`${getPrivacyDocTitle(meta)} — Jokuh`);

  return (
    <LegalLayout
      breadcrumb={
        <LegalBreadcrumb
          items={[
            { label: "Jokuh", to: "/" },
            { label: "Legal", to: "/legal" },
            { label: "Privacy Policy", to: "/legal/privacy" },
            { label: getPrivacyBreadcrumbLabel(meta) },
          ]}
        />
      }
    >
      <TertiaryPageHero
        eyebrow="Privacy"
        title={getPrivacyDocTitle(meta)}
        intro="Choose the document scope, then confirm the region and language you need."
      />

      <TertiaryHubBody>
        <section className="border-b border-light-space/[0.08] py-12 light:border-black/[0.08] md:py-14">
          <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
            <h2 className="font-sans text-[20px] font-semibold tracking-[-0.03em] text-light-space light:text-zinc-950 md:text-[24px]">
              Topic
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PRIVACY_TOPIC_ROWS.map((topic) => (
                <DocumentTopicCard
                  key={topic.key}
                  to={topic.to}
                  title={topic.title}
                  description={topic.description}
                  selected={topic.key !== "account" && topic.key === docKey}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-light-space/[0.08] py-12 light:border-black/[0.08] md:py-14">
          <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
            <h2 className="font-sans text-[20px] font-semibold tracking-[-0.03em] text-light-space light:text-zinc-950 md:text-[24px]">
              Region
            </h2>
            <div className="max-w-[220px] rounded-[24px] border border-light-space/[0.08] bg-white/[0.02] px-5 py-5 light:border-black/[0.08] light:bg-zinc-50">
              <div className="flex items-center gap-3">
                <Globe className="size-5 text-[var(--color-blue-4)]" strokeWidth={1.35} aria-hidden />
                <span className="text-[15px] font-semibold text-light-space light:text-zinc-950">Global</span>
              </div>
              <p className="mt-2 text-[13px] leading-[1.55] text-light-space/58 light:text-zinc-600">
                This document is currently published in the global legal flow.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-14">
          <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
            <h2 className="font-sans text-[20px] font-semibold tracking-[-0.03em] text-light-space light:text-zinc-950 md:text-[24px]">
              Language
            </h2>
            <ul className="columns-1 gap-x-10 gap-y-2 text-[14px] sm:columns-2 md:columns-3 lg:columns-4">
              {LEGAL_PRIVACY_LOCALES.map((loc) => (
                <li key={loc.code} className="mb-2 break-inside-avoid">
                  <Link to={`/legal/privacy/${docKey}/read/${loc.code}`} className={legalLink}>
                    {loc.nativeLabel} <span aria-hidden>›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </TertiaryHubBody>
    </LegalLayout>
  );
}
