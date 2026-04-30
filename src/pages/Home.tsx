import { useDocumentTitle } from "../hooks/useDocumentTitle";
import {
  GooeyBackdrop,
  IdentityBlock,
  LandingEditorialSection,
  LandingHero,
  PreFooterCta,
  RecentNewsSection,
  StoriesSection,
  WaitlistSection,
} from "../components/landing";
import { MarketingPageFrame } from "../components/system";

export default function Home() {
  useDocumentTitle("Jokuh — The Sovereign Agentic Operating System");

  return (
    <MarketingPageFrame
      beforeChrome={<GooeyBackdrop />}
      afterMain={<PreFooterCta />}
    >
      <LandingHero />
      <LandingEditorialSection />
      <RecentNewsSection />
      <StoriesSection />
      <IdentityBlock />
      <WaitlistSection />
    </MarketingPageFrame>
  );
}
