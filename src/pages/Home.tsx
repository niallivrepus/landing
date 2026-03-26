import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { CookieBanner } from "../components/CookieBanner";
import {
  GooeyBackdrop,
  IdentityBlock,
  LandingHero,
  PreFooterCta,
  RecentNewsSection,
  StoriesSection,
  WaitlistSection,
} from "../components/landing";
import { MarketingPageFrame } from "../components/system";

export default function Home() {
  useDocumentTitle("Jokuh — Your thinking is the product");

  return (
    <MarketingPageFrame
      beforeChrome={<GooeyBackdrop />}
      afterMain={
        <>
          <PreFooterCta />
          <CookieBanner />
        </>
      }
    >
      <LandingHero />
      <RecentNewsSection />
      <StoriesSection />
      <IdentityBlock />
      <WaitlistSection />
    </MarketingPageFrame>
  );
}
