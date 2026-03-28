import { Link, Navigate, useParams } from "react-router-dom";
import { LegalBreadcrumb, LegalLayout, legalLink, legalMuted } from "../../components/legal/LegalLayout";
import { TertiaryDocBody, TertiaryPageHero } from "../../components/system";
import { localeFromCode } from "../../data/legal-locales";
import {
  getPrivacyBreadcrumbLabel,
  getPrivacyDocumentTitle,
  isPrivacyDocKey,
  PRIVACY_DOCS,
  type PrivacyDocKey,
  type PrivacySection,
} from "../../data/privacy-docs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

function sectionDomId(section: PrivacySection, index: number) {
  return section.anchor ?? `privacy-section-${index}`;
}

export function LegalPrivacyDocumentPage() {
  const { docKey = "", locale = "" } = useParams<{ docKey: string; locale: string }>();
  const loc = localeFromCode(locale);

  if (!isPrivacyDocKey(docKey)) {
    return <Navigate to="/legal/privacy" replace />;
  }

  if (!loc) {
    return <Navigate to={`/legal/privacy/${docKey}`} replace />;
  }

  const doc = PRIVACY_DOCS[docKey as PrivacyDocKey];
  useDocumentTitle(`${getPrivacyDocumentTitle(doc)} — Jokuh`);

  return (
    <LegalLayout
      breadcrumb={
        <LegalBreadcrumb
          items={[
            { label: "Jokuh", to: "/" },
            { label: "Legal", to: "/legal" },
            { label: "Privacy Policy", to: "/legal/privacy" },
            { label: getPrivacyBreadcrumbLabel(doc), to: `/legal/privacy/${docKey}` },
            { label: loc.nativeLabel },
          ]}
        />
      }
    >
      <TertiaryPageHero
        eyebrow="Privacy"
        title={getPrivacyDocumentTitle(doc)}
        intro={doc.intro}
      />

      <TertiaryDocBody
        tocItems={doc.sections.map((section, index) => ({
          id: sectionDomId(section, index),
          label: section.title,
        }))}
        footer={
          <div className="space-y-3">
            <p className={legalMuted}>
              {doc.documentSubtitle ?? "Updated March 26, 2026"} · {loc.label}
            </p>
            {doc.resourceLinks?.length ? (
              <ul className="space-y-2 text-[14px]">
                {doc.resourceLinks.map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link to={item.to} className={legalLink}>
                        {item.label}
                      </Link>
                    ) : (
                      <a href={item.href ?? "#"} className={legalLink}>
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className={legalMuted}>
              {doc.counselNote ??
                "Replace this draft disclosure with counsel-approved copy and locale-specific addenda before launch."}
            </p>
          </div>
        }
      >
        <div className="max-w-[720px]">
          {doc.introContinued?.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-[16px] leading-[1.72] text-light-space/75 light:text-zinc-700">
              {paragraph}
            </p>
          ))}

          {doc.sections.map((section, index) => (
            <section
              key={`${section.title}-${index}`}
              id={sectionDomId(section, index)}
              className="scroll-mt-24 border-b border-light-space/[0.08] py-10 last:border-b-0 last:pb-0 light:border-black/[0.08]"
            >
              <h2 className="font-sans text-[22px] font-semibold tracking-[-0.03em] text-light-space light:text-zinc-950 md:text-[24px]">
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
        </div>
      </TertiaryDocBody>
    </LegalLayout>
  );
}
