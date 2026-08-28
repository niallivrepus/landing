import { useEffect } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ClaimIdentityFlowProvider } from "../context/ClaimIdentityFlowContext";
import {
  GooeyBackdrop,
  IdentityBlock,
  InvestorBranchSection,
  LandingHero,
  ProductDemoSection,
  ProductShowcaseSection,
  WaitlistSection,
} from "../components/landing";
import { MarketingPageFrame } from "../components/system";
import { NEWS_ITEMS } from "../data/news";
import { preloadNewsArticleSlugs } from "../lib/article-audio";
import { useTheme } from "@jokuh/gooey";

/**
 * **Purpose:** Homepage funnel — hero (Get started) → product strip → proof demo → identity close → waitlist.
 * Editorial and full Bubbles beats stay off the critical path; investors sit as a thin strip after Claim.
 * **Connects to:** claim-identity overlay, `ProductDemoSection` power proofs, MegaFooter.
 */
export default function Home() {
  useDocumentTitle("Jokuh");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const slugs = NEWS_ITEMS
      .filter((n) => n.slug && n.internalHref && !n.externalUrl)
      .slice(0, 8)
      .map((n) => n.slug as string);
    preloadNewsArticleSlugs(slugs);
  }, []);

  return (
    <ClaimIdentityFlowProvider>
      <MarketingPageFrame
        beforeChrome={<GooeyBackdrop />}
        theme={resolvedTheme === "light" ? "light" : "dark"}
      >
        <LandingHero />
        <ProductShowcaseSection />
        <ProductDemoSection />
        <IdentityBlock />
        <WaitlistSection />
        <InvestorBranchSection />
      </MarketingPageFrame>
    </ClaimIdentityFlowProvider>
  );
}
