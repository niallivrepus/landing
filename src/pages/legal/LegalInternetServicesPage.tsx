import { Link } from "react-router-dom";
import { DocumentTopicCard } from "../../components/legal/DocumentTopicCard";
import { LegalBreadcrumb, LegalLayout, legalLink, legalMuted } from "../../components/legal/LegalLayout";

const cards = [
  { title: "Website Terms of Use", to: "/legal/terms" },
  { title: "Privacy Policy", to: "/legal/privacy" },
  { title: "Jokuh Customer Privacy Policy", to: "/legal/privacy/customer" },
];

export function LegalInternetServicesPage() {
  return (
    <LegalLayout
      breadcrumb={
        <LegalBreadcrumb
          items={[
            { label: "Jokuh", to: "/" },
            { label: "Legal", to: "/legal" },
            { label: "Internet Services" },
          ]}
        />
      }
    >
      <div className="border-b border-light-glass-10 bg-gradient-to-br from-[#0a1628]/95 via-black to-black">
        <div className="mx-auto max-w-[1024px] px-4 py-12 md:px-6 md:py-16">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide text-light-space/50">
            Internet Services
          </p>
          <h1 className="mt-2 font-sans text-[32px] font-semibold leading-tight tracking-tight text-light-space md:text-[40px]">
            Policies for Jokuh online services
          </h1>
          <p className="mt-4 max-w-[640px] font-sans text-[17px] leading-relaxed text-light-space/70">
            Terms and privacy resources for our websites, accounts, and connected services. Product-specific agreements
            may add additional terms when you subscribe or connect a device.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1024px] px-4 py-14 md:px-6 md:py-16">
        <h2 className="font-sans text-[21px] font-semibold tracking-tight text-light-space md:text-[24px]">
          Documents
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {cards.map((c) => (
            <DocumentTopicCard key={c.title} to={c.to} title={c.title} />
          ))}
        </div>
        <p className={`mt-12 font-sans text-[14px] ${legalMuted}`}>
          Looking for hardware or software legal information?{" "}
          <Link to="/legal" className={legalLink}>
            Return to Legal overview <span aria-hidden>›</span>
          </Link>
        </p>
      </div>
    </LegalLayout>
  );
}
