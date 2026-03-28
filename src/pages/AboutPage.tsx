import {
  TertiaryBreadcrumb,
  TertiaryClosingCta,
  TertiaryHubBody,
  TertiaryPageChrome,
  TertiaryPageHero,
  TertiaryQuickLinksGrid,
  TertiarySection,
} from "../components/system";
import { FaqSection } from "../components/FaqSection";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const ABOUT_LINKS = [
  {
    label: "Research",
    href: "/research",
    description: "How Jokuh thinks about speech systems, memory infrastructure, and trust.",
  },
  {
    label: "Brand",
    href: "/brand",
    description: "Brand assets, marks, and guidance for partners and press.",
  },
  {
    label: "Careers",
    href: "/careers",
    description: "Open roles across engineering, product, research, and operations.",
  },
] as const;

export default function AboutPage() {
  useDocumentTitle("About — Jokuh");

  return (
    <TertiaryPageChrome
      breadcrumb={<TertiaryBreadcrumb items={[{ label: "Jokuh", to: "/" }, { label: "About" }]} />}
    >
      <TertiaryPageHero
        eyebrow="Company"
        title="Jokuh builds speech systems that stay usable after the moment passes."
        intro="We turn live communication into structured memory without making the product feel heavy. The goal is simple: capture what matters, keep it readable, and make trust visible in the interface."
      />

      <TertiaryHubBody>
        <TertiarySection title="What we build">
          <p>
            Jokuh is a product company focused on identity-aware timelines, transcription, and speech-native surfaces
            such as Pods, Spine, and Vortex. Each system is designed to make context easier to keep, not harder to
            recover.
          </p>
          <p>
            We care about reliability at the product layer and governance at the system layer. That means latency,
            auditability, privacy, and reading quality all matter at the same time.
          </p>
        </TertiarySection>

        <TertiarySection title="How we work">
          <p>
            We keep teams small, ship in narrow loops, and use design and engineering as one system. The product should
            feel calm because the architecture underneath it is explicit.
          </p>
          <p>
            Research, legal review, and product decisions are not separate tracks. They are inputs to the same release
            process, especially when a feature touches memory, identity, or sensitive user data.
          </p>
        </TertiarySection>

        <TertiarySection title="Explore Jokuh">
          <TertiaryQuickLinksGrid links={[...ABOUT_LINKS]} columns={3} />
        </TertiarySection>

        <div className="pt-12 md:pt-14">
          <FaqSection
            items={[
              {
                question: "What does Jokuh make?",
                answer:
                  "Jokuh builds speech and memory products that help conversations stay structured, searchable, and tied to the right identity context.",
              },
              {
                question: "Is Jokuh a product company or an infrastructure company?",
                answer:
                  "Both. We ship user-facing products, but we also build the underlying systems that make those products trustworthy and consistent.",
              },
              {
                question: "Where can I learn more about Jokuh’s approach?",
                answer:
                  "Start with Research for the system thinking, Brand for public assets, and Careers if you want to work on the stack directly.",
              },
            ]}
          />
        </div>
      </TertiaryHubBody>

      <TertiaryClosingCta
        title="Build the next layer of speech systems with us."
        label="View careers"
        href="/careers"
      />
    </TertiaryPageChrome>
  );
}
