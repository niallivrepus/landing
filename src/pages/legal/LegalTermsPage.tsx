import { Link } from "react-router-dom";
import { LegalBreadcrumb, LegalLayout, legalLink, legalMuted } from "../../components/legal/LegalLayout";
import { TERMS_SECTIONS } from "../../data/terms-sections";

export function LegalTermsPage() {
  return (
    <LegalLayout
      breadcrumb={
        <LegalBreadcrumb
          items={[
            { label: "Jokuh", to: "/" },
            { label: "Legal", to: "/legal" },
            { label: "Internet Services", to: "/legal/internet-services" },
            { label: "Website Terms of Use" },
          ]}
        />
      }
    >
      <div className="border-b border-light-glass-10 bg-gradient-to-b from-[#0a1628]/90 via-black to-black">
        <div className="mx-auto max-w-[1024px] px-4 py-10 md:px-6 md:py-14">
          <p className={`font-sans text-[12px] font-medium uppercase tracking-[0.08em] ${legalMuted}`}>
            Legal information & notices
          </p>
          <h1 className="mt-2 max-w-[920px] font-sans text-[32px] font-semibold leading-[1.08] tracking-tight text-light-space md:text-[48px]">
            Jokuh Website Terms of Use
          </h1>
          <p className="mt-4 max-w-[640px] font-sans text-[17px] leading-relaxed text-light-space/70">
            These terms govern use of our public websites and marketing properties. Product and API agreements may
            add or supersede portions of this document where explicitly stated.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1100px] gap-10 px-4 py-12 md:grid-cols-[minmax(0,220px)_1fr] md:gap-14 md:px-6 md:py-16 lg:grid-cols-[240px_1fr]">
        <aside className="md:sticky md:top-[72px] md:self-start">
          <nav
            className="rounded-xl border border-light-glass-20 bg-white/[0.04] p-4 font-sans shadow-none backdrop-blur-sm"
            aria-label="On this page"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-light-space/45">On this page</p>
            <ul className="mt-3 space-y-2 text-[13px] leading-snug">
              {TERMS_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={legalLink}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-light-glass-10 pt-4">
              <Link to="/legal/privacy" className={`text-[13px] ${legalLink}`}>
                Privacy Policy <span aria-hidden>›</span>
              </Link>
            </div>
          </nav>
        </aside>

        <article className="min-w-0">
          <div className="max-w-[720px]">
            {TERMS_SECTIONS.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className="scroll-mt-28 border-b border-light-glass-10 pb-12 last:border-b-0 last:pb-0"
              >
                <h2 className="font-sans text-[21px] font-semibold tracking-tight text-light-space md:text-[24px]">
                  {sec.title}
                </h2>
                {sec.paragraphs.map((p, i) => (
                  <p key={i} className="mt-4 font-sans text-[17px] leading-[1.55] text-light-space/85">
                    {p}
                  </p>
                ))}
                {sec.id === "privacy" ? (
                  <p className="mt-4 font-sans text-[17px] leading-[1.55] text-light-space/85">
                    Read the{" "}
                    <Link to="/legal/privacy" className={legalLink}>
                      Jokuh Privacy Policy
                    </Link>
                    .
                  </p>
                ) : null}
              </section>
            ))}
          </div>
          <p className={`mt-12 font-sans text-[12px] ${legalMuted}`}>Updated March 26, 2026 · Jokuh Legal</p>
          <p className="mt-2 font-sans text-[12px] text-light-space/45">
            Copyright © {new Date().getFullYear()} Jokuh. All rights reserved.
          </p>
        </article>
      </div>
    </LegalLayout>
  );
}
