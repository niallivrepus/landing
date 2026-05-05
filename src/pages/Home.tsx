import { useEffect } from "react";
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
import { NEWS_ITEMS } from "../data/news";
import { preloadNewsArticleSlugs } from "../lib/article-audio";

export default function Home() {
  useDocumentTitle("Jokuh");

  useEffect(() => {
    const slugs = NEWS_ITEMS
      .filter((n) => n.slug && n.internalHref && !n.externalUrl)
      .slice(0, 8)
      .map((n) => n.slug as string);
    preloadNewsArticleSlugs(slugs);
  }, []);

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
