import { Link } from "react-router-dom";
import { DocumentTopicCard } from "../../components/legal/DocumentTopicCard";
import { LegalBreadcrumb, LegalLayout, legalLink, legalMuted } from "../../components/legal/LegalLayout";
import { JokuhMark } from "../../components/legal/JokuhMark";
import { PRIVACY_TOPIC_ROWS } from "../../data/privacy-docs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function LegalPrivacyPage() {
  useDocumentTitle("Privacy Policy — Jokuh");

  return (
    <LegalLayout
      breadcrumb={
        <LegalBreadcrumb
          items={[
            { label: "Jokuh", to: "/" },
            { label: "Legal", to: "/legal" },
            { label: "Privacy Policy" },
          ]}
        />
      }
    >
      <div className="relative overflow-hidden border-b border-light-glass-10 bg-gradient-to-b from-[#0a1628] via-[#050a12] to-black light:from-slate-100 light:via-white light:to-zinc-100">
        <div
          className="pointer-events-none absolute inset-0 opacity-45 light:opacity-[0.32]"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(33,220,17,0.1), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 20%, rgba(100,180,255,0.06), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1024px] px-4 py-14 md:px-8 md:py-20">
          <div className="mb-5 flex justify-center md:justify-start">
            <JokuhMark className="h-9 w-[58px] text-light-space" />
          </div>
          <p className="text-center font-sans text-[12px] font-semibold uppercase tracking-wide text-light-space/50 md:text-left">
            Privacy
          </p>
          <h1 className="mt-2 text-center font-sans text-[32px] font-semibold leading-tight tracking-tight text-light-space md:text-left md:text-[44px]">
            Jokuh Customer Privacy Policy
          </h1>
          <p className="mx-auto mt-5 max-w-[680px] text-center font-sans text-[17px] leading-relaxed text-light-space/70 md:mx-0 md:text-left md:text-[19px]">
            Jokuh is committed to your privacy. Read our customer privacy policy for a clear explanation of how we
            collect, use, disclose, transfer, and store your information — with the same structured documentation
            experience you expect from a modern legal hub.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 font-sans text-[14px] md:justify-start">
            <Link to="/#start" className={legalLink}>
              Manage your Jokuh account <span aria-hidden>›</span>
            </Link>
            <a href="mailto:privacy@jokuh.com" className={legalLink}>
              Contact Privacy <span aria-hidden>›</span>
            </a>
            <Link to="/legal/privacy/customer" className={legalLink}>
              Choose region & language <span aria-hidden>›</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1024px] px-4 py-14 md:px-8 md:py-16">
        <h2 className="font-sans text-[24px] font-semibold tracking-tight text-light-space md:text-[28px]">
          Choose a Topic
        </h2>
        <p className={`mt-3 max-w-[720px] font-sans text-[15px] leading-relaxed ${legalMuted}`}>
          Each topic opens the same guided flow: confirm the document, pick a region, then a language — matching the
          nested documentation pattern used on{" "}
          <a href="https://www.apple.com/legal/privacy/" className={legalLink} target="_blank" rel="noreferrer">
            apple.com/legal/privacy
          </a>
          .
        </p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {PRIVACY_TOPIC_ROWS.map((t) => (
            <DocumentTopicCard key={t.title} to={t.to} title={t.title} />
          ))}
        </div>

        <div className="mt-20 space-y-16 border-t border-light-glass-10 pt-16 font-sans text-[17px] leading-relaxed text-light-space/70">
          <section id="data-products" className="scroll-mt-28">
            <h2 className="text-[21px] font-semibold text-light-space">Data & privacy in products</h2>
            <p className="mt-3">
              Feature-level privacy summaries appear in Jokuh where a capability requests access to sensitive data.
              Open the full document (with region and language) from the topic card above.
            </p>
            <Link to="/legal/privacy/data-products" className={`mt-4 inline-block text-[14px] ${legalLink}`}>
              Open data & privacy in products <span aria-hidden>›</span>
            </Link>
          </section>
          <section id="governance" className="scroll-mt-28">
            <h2 className="text-[21px] font-semibold text-light-space">Privacy governance</h2>
            <p className="mt-3">
              Program details, training, and assurance activities are available in the governance document.
            </p>
            <Link to="/legal/privacy/governance" className={`mt-4 inline-block text-[14px] ${legalLink}`}>
              Open privacy governance <span aria-hidden>›</span>
            </Link>
          </section>
          <section id="gov-requests" className="scroll-mt-28">
            <h2 className="text-[21px] font-semibold text-light-space">Government information requests</h2>
            <p className="mt-3">
              Principles for civil and government requests, including transparency reporting commitments.
            </p>
            <Link to="/legal/privacy/gov-requests" className={`mt-4 inline-block text-[14px] ${legalLink}`}>
              Open government requests <span aria-hidden>›</span>
            </Link>
          </section>
        </div>
      </div>
    </LegalLayout>
  );
}
