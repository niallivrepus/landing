import { Link, Navigate, useParams } from "react-router-dom";
import { LegalBreadcrumb, LegalLayout, legalLink, legalMuted } from "../../components/legal/LegalLayout";
import { localeFromCode } from "../../data/legal-locales";
import { isPrivacyDocKey, PRIVACY_DOCS, type PrivacyDocKey, type PrivacySection } from "../../data/privacy-docs";

function sectionDomId(sec: PrivacySection, index: number) {
  return sec.anchor ?? `privacy-section-${index}`;
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

  return (
    <LegalLayout
      breadcrumb={
        <LegalBreadcrumb
          items={[
            { label: "Jokuh", to: "/" },
            { label: "Legal", to: "/legal" },
            { label: "Privacy Policy", to: "/legal/privacy" },
            { label: doc.breadcrumbLabel, to: `/legal/privacy/${docKey}` },
            { label: loc.nativeLabel },
          ]}
        />
      }
    >
      <article className="mx-auto max-w-[820px] px-4 py-12 md:px-6 md:py-16">
        <div id="print-policy" className="scroll-mt-28" tabIndex={-1} aria-hidden />
        <h1 className="font-sans text-[32px] font-semibold leading-tight tracking-tight text-light-space md:text-[40px]">
          {doc.documentH1}
        </h1>
        {doc.documentSubtitle ? (
          <p className="mt-3 font-sans text-[19px] font-semibold leading-snug text-light-space md:text-[21px]">
            {doc.documentSubtitle}
          </p>
        ) : (
          <p className={`mt-2 font-sans text-[14px] ${legalMuted}`}>
            Updated March 26, 2026 · {loc.label}
          </p>
        )}
        {doc.documentSubtitle ? (
          <p className={`mt-1 font-sans text-[14px] ${legalMuted}`}>{loc.label}</p>
        ) : null}

        <p className="mt-8 font-sans text-[17px] leading-[1.55] text-light-space/85">{doc.intro}</p>
        {doc.introContinued?.map((p, i) => (
          <p key={i} className="mt-4 font-sans text-[17px] leading-[1.55] text-light-space/85">
            {p}
          </p>
        ))}

        {docKey === "customer" ? (
          <p className={`mt-6 font-sans text-[14px] leading-relaxed ${legalMuted}`}>
            To keep a copy of this page, use your browser’s <strong className="text-light-space/90">Print</strong>{" "}
            dialog and choose <strong className="text-light-space/90">Save as PDF</strong>.
          </p>
        ) : null}

        {doc.resourceLinks?.length ? (
          <ul className="mt-8 space-y-2 font-sans text-[14px] leading-snug">
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

        {doc.counselNote ? (
          <p className="mt-6 rounded-lg border border-light-glass-20 bg-white/[0.04] px-4 py-3 font-sans text-[13px] leading-relaxed text-light-space/75">
            {doc.counselNote}
          </p>
        ) : (
          <p className={`mt-6 font-sans text-[14px] leading-relaxed ${legalMuted}`}>
            Placeholder disclosure for the marketing site — replace with counsel-approved text and locale addenda before
            launch.
          </p>
        )}

        <p className="mt-8 font-sans text-[14px]">
          <a href="#sections" className={legalLink}>
            Jump to sections
          </a>
        </p>

        <div id="sections" className="mt-14 space-y-14 scroll-mt-24">
          {doc.sections.map((sec, index) => (
            <section key={sec.title + index} id={sectionDomId(sec, index)}>
              <h2 className="font-sans text-[21px] font-semibold tracking-tight text-light-space md:text-[24px]">
                {sec.title}
              </h2>
              {sec.body.map((p, i) => (
                <p key={i} className="mt-4 font-sans text-[17px] leading-[1.55] text-light-space/85">
                  {p}
                </p>
              ))}
              {sec.bullets?.length ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 font-sans text-[17px] leading-[1.5] text-light-space/85 marker:text-light-space/50">
                  {sec.bullets.map((item, bi) => (
                    <li key={bi} className="pl-1">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              {sec.afterBullets?.map((p, i) => (
                <p key={`ab-${i}`} className="mt-4 font-sans text-[17px] leading-[1.55] text-light-space/85">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </LegalLayout>
  );
}
