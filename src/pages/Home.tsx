import { useDocumentTitle } from "../hooks/useDocumentTitle";
import {
  BusinessSolutionsSection,
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
  useDocumentTitle("Jokuh");

  return (
    <MarketingPageFrame
      beforeChrome={<GooeyBackdrop />}
      afterMain={<PreFooterCta />}
    >
      <LandingHero />
      <LandingEditorialSection />
      <RecentNewsSection />
      <StoriesSection />
      <BusinessSolutionsSection />
      <IdentityBlock />
      <WaitlistSection />
    </MarketingPageFrame>
  );
}
