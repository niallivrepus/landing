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

const LEARN_LINKS = [
  {
    label: "Quickstart",
    href: "/developers/docs/quickstart",
    description: "Install the SDK, set your key, and make the first request cleanly.",
  },
  {
    label: "SDK & API",
    href: "/developers/sdk",
    description: "See the reference surface for responses, streaming, tools, and structured output.",
  },
  {
    label: "Cookbook",
    href: "/developers/docs/cookbook",
    description: "Implementation patterns for agents, tools, and production workflows.",
  },
  {
    label: "Models",
    href: "/developers/docs/models",
    description: "Choose the right runtime profile before you wire the wrong default into product.",
  },
  {
    label: "Developer Blog",
    href: "/developers/blog",
    description: "Read shorter notes on product decisions, SDK patterns, and docs direction.",
  },
  {
    label: "Forum",
    href: "/developers/forum",
    description: "Use the community surface when you need integration feedback or edge-case help.",
  },
] as const;

export function DeveloperLearnPage() {
  useDocumentTitle("Learn — Jokuh Developers");

  return (
    <TertiaryPageChrome
      breadcrumb={
        <TertiaryBreadcrumb
          items={[
            { label: "Jokuh", to: "/" },
            { label: "Developers", to: "/developers/docs" },
            { label: "Learn" },
          ]}
        />
      }
    >
      <TertiaryPageHero
        eyebrow="Developers"
        title="Learn Jokuh without fighting the page structure."
        intro="This surface stays narrow on purpose. Start with the quickstart, move into the SDK reference, then use cookbooks and blog notes when you need implementation depth."
      />

      <TertiaryHubBody>
        <TertiarySection title="What lives here">
          <p>
            Learn is the calmer layer in the developer surface. It collects the routes that help you move from first
            request to production shape without forcing you through a heavier docs shell first.
          </p>
          <p>
            The structure is simple: quickstart for setup, SDK for surface area, cookbook for working patterns, and the
            blog for shorter product and integration notes.
          </p>
        </TertiarySection>

        <TertiarySection title="How to use it">
          <p>
            If you are new, start with Quickstart and stop once you have a real response on screen. If you are already
            integrating, jump straight to SDK & API and use the cookbook only for the workflows you actually need.
          </p>
          <p>
            Keep the forum for real blockers. It should be a support path, not the main path for discovering how the
            platform works.
          </p>
        </TertiarySection>

        <TertiarySection title="Developer routes">
          <TertiaryQuickLinksGrid links={[...LEARN_LINKS]} columns={3} />
        </TertiarySection>

        <div className="pt-12 md:pt-14">
          <FaqSection
            items={[
              {
                question: "Is Learn the same as Docs?",
                answer:
                  "No. Learn is the thinner discovery layer. Docs remains the deeper reference surface once you know what you need.",
              },
              {
                question: "Where should I start if I only need one API call working?",
                answer:
                  "Start with Quickstart. It is the shortest route to install, authentication, and a real response.",
              },
              {
                question: "When should I use the blog?",
                answer:
                  "Use the blog for shorter notes on SDK direction, product changes, and practical integration decisions around the developer surface.",
              },
            ]}
          />
        </div>
      </TertiaryHubBody>

      <TertiaryClosingCta
        title="Start with the shortest path to a live request."
        label="Open quickstart"
        href="/developers/docs/quickstart"
      />
    </TertiaryPageChrome>
  );
}
