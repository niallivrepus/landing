import { Link } from "react-router-dom";
import { DocumentTopicCard } from "../../components/legal/DocumentTopicCard";
import { LegalBreadcrumb, LegalLayout, legalLink } from "../../components/legal/LegalLayout";
import { TertiaryHubBody, TertiaryPageHero } from "../../components/system";
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
      <TertiaryPageHero
        eyebrow="Privacy"
        title="Privacy documents, kept in one place."
        intro="Choose a document, then confirm the region and language you need. Every privacy path now uses the same lighter legal structure."
      />

      <TertiaryHubBody>
        <div className="flex flex-wrap gap-x-6 gap-y-3 pb-10 text-[14px] md:pb-12">
          <a href="mailto:privacy@jokuh.com" className={legalLink}>
            Contact privacy
          </a>
          <Link to="/#start" className={legalLink}>
            Manage your account
          </Link>
          <Link to="/legal/internet-services" className={legalLink}>
            Internet services legal
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PRIVACY_TOPIC_ROWS.map((topic) => (
            <DocumentTopicCard
              key={topic.key}
              to={topic.to}
              title={topic.title}
              description={topic.description}
            />
          ))}
        </div>
      </TertiaryHubBody>
    </LegalLayout>
  );
}
