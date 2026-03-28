import { LegalLayout } from "../../components/legal/LegalLayout";
import {
  TertiaryHubBody,
  TertiaryPageHero,
  TertiaryQuickLinksGrid,
  TertiarySection,
} from "../../components/system";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const LEGAL_DOCUMENT_LINKS = [
  {
    label: "Privacy Policy",
    href: "/legal/privacy",
    description: "Entry point to Jokuh privacy documents, region selection, and language selection.",
  },
  {
    label: "Website Terms",
    href: "/legal/terms",
    description: "Terms governing Jokuh’s public websites, preview pages, and marketing properties.",
  },
  {
    label: "Internet Services",
    href: "/legal/internet-services",
    description: "Online service policies for Jokuh websites, accounts, and connected services.",
  },
] as const;

const LEGAL_OPERATION_LINKS = [
  {
    label: "Ethics & compliance",
    href: "/ethics",
    description: "Operational boundaries, escalation rules, and responsible deployment guidance.",
  },
  {
    label: "Support",
    href: "/support",
    description: "Support routing for account, billing, product help, and system status.",
  },
  {
    label: "Contact compliance",
    href: "mailto:compliance@jokuh.com",
    description: "Reach Jokuh for compliance questions, review requests, or policy escalation.",
  },
] as const;

export function LegalHomePage() {
  useDocumentTitle("Legal — Jokuh");

  return (
    <LegalLayout>
      <TertiaryPageHero
        eyebrow="Legal"
        title="Legal information, kept minimal."
        intro="One place for the core Jokuh legal documents, privacy paths, internet services policies, and operational policy references."
      />

      <TertiaryHubBody>
        <TertiarySection title="Documents">
          <TertiaryQuickLinksGrid links={[...LEGAL_DOCUMENT_LINKS]} columns={3} />
        </TertiarySection>

        <TertiarySection title="Operations">
          <TertiaryQuickLinksGrid links={[...LEGAL_OPERATION_LINKS]} columns={3} />
        </TertiarySection>
      </TertiaryHubBody>
    </LegalLayout>
  );
}
