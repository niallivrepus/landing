import { Link } from "react-router-dom";
import { DocumentTopicCard } from "../../components/legal/DocumentTopicCard";
import { LegalBreadcrumb, LegalLayout, legalLink, legalMuted } from "../../components/legal/LegalLayout";
import { TertiaryHubBody, TertiaryPageHero, TertiarySection } from "../../components/system";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const cards = [
  {
    title: "Website Terms",
    description: "Terms governing Jokuh’s public website, preview pages, and marketing properties.",
    to: "/legal/terms",
  },
  {
    title: "Privacy Policy",
    description: "Entry point to Jokuh’s privacy documents, region selection, and language selection flow.",
    to: "/legal/privacy",
  },
  {
    title: "Customer Privacy",
    description: "Direct entry to the main customer privacy document and related resources.",
    to: "/legal/privacy/customer",
  },
] as const;

export function LegalInternetServicesPage() {
  useDocumentTitle("Internet Services — Jokuh");

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
      <TertiaryPageHero
        eyebrow="Internet services"
        title="Online service policies."
        intro="Terms and privacy resources for Jokuh websites, accounts, and connected online services."
      />

      <TertiaryHubBody>
        <TertiarySection title="Documents">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <DocumentTopicCard
                key={card.title}
                to={card.to}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
          <p className={`pt-2 text-[14px] ${legalMuted}`}>
            Looking for the broader legal index?{" "}
            <Link to="/legal" className={legalLink}>
              Return to Legal overview
            </Link>
            .
          </p>
        </TertiarySection>
      </TertiaryHubBody>
    </LegalLayout>
  );
}
