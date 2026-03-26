import { Globe } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { DocumentTopicCard } from "../../components/legal/DocumentTopicCard";
import { LegalBreadcrumb, LegalLayout, legalLink } from "../../components/legal/LegalLayout";
import { LEGAL_PRIVACY_LOCALES } from "../../data/legal-locales";
import { isPrivacyDocKey, PRIVACY_DOCS, PRIVACY_TOPIC_ROWS, type PrivacyDocKey } from "../../data/privacy-docs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function LegalPrivacySelectPage() {
  const { docKey = "" } = useParams<{ docKey: string }>();

  if (!isPrivacyDocKey(docKey)) {
    return <Navigate to="/legal/privacy" replace />;
  }

  const meta = PRIVACY_DOCS[docKey as PrivacyDocKey];
  useDocumentTitle(`${meta.selectTitle} — Jokuh`);

  return (
    <LegalLayout
      breadcrumb={
        <LegalBreadcrumb
          items={[
            { label: "Jokuh", to: "/" },
            { label: "Legal", to: "/legal" },
            { label: "Privacy Policy", to: "/legal/privacy" },
            { label: meta.breadcrumbLabel },
          ]}
        />
      }
    >
      <div className="mx-auto max-w-[1024px] px-4 py-12 md:px-8 md:py-16">
        <h1 className="font-sans text-[32px] font-semibold leading-tight tracking-tight text-light-space md:text-[40px]">
          {meta.selectTitle}
        </h1>
        <p className="mt-4 max-w-[720px] font-sans text-[17px] leading-relaxed text-light-space/70">
          Select a topic, region, and language to read this document.
        </p>

        <h2 className="mt-14 font-sans text-[21px] font-semibold tracking-tight text-light-space md:text-[24px]">
          Choose a Topic
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {PRIVACY_TOPIC_ROWS.map((t) => (
            <DocumentTopicCard
              key={t.title}
              to={t.to}
              title={t.title}
              selected={t.key !== "account" && t.key === docKey}
            />
          ))}
        </div>

        <h2 className="mt-14 font-sans text-[21px] font-semibold tracking-tight text-light-space md:text-[24px]">
          Choose a Region
        </h2>
        <div className="mt-6 max-w-[200px]">
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-[2px] border border-[var(--color-blue-4)] bg-white/[0.04] px-4 py-5 font-sans shadow-[inset_0_0_0_1px_var(--color-blue-4)]">
            <Globe className="size-9 text-[var(--color-blue-4)]" strokeWidth={1.25} aria-hidden />
            <span className="text-center text-[13px] text-light-space/55">Global</span>
          </div>
        </div>

        <h2 className="mt-14 font-sans text-[21px] font-semibold tracking-tight text-light-space md:text-[24px]">
          Choose a Language
        </h2>
        <ul className="mt-6 columns-1 gap-x-10 gap-y-2 font-sans text-[14px] sm:columns-2 md:columns-3 lg:columns-4">
          {LEGAL_PRIVACY_LOCALES.map((loc) => (
            <li key={loc.code} className="mb-2 break-inside-avoid">
              <Link to={`/legal/privacy/${docKey}/read/${loc.code}`} className={legalLink}>
                {loc.nativeLabel} <span aria-hidden>›</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </LegalLayout>
  );
}
