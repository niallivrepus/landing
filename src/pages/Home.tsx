import { SITE_DOCUMENT_TITLE } from "../data/landing-hero-copy";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ClaimIdentityFlowProvider } from "../context/ClaimIdentityFlowContext";
import { GooeyBackdrop, LandingHero } from "../components/landing";
import { MarketingPageFrame } from "../components/system";
import { useTheme } from "@jokuh/gooey";

/**
 * **Purpose:** Homepage is one screen: the immersive hero only. Products, demo, shipped log,
 * newsroom, waitlist and investors live on their own routes and are reached by click
 * (corner pills, Nexus, shipped ticker, slim footer row inside the hero shell).
 * The big MegaFooter is dropped on home only (`footer={null}`).
 * **Connects to:** `LandingHero` → `LandingImmersiveShell`, claim-identity overlay,
 * `SITE_DOCUMENT_TITLE` / `index.html` title.
 */
export default function Home() {
  useDocumentTitle(SITE_DOCUMENT_TITLE);
  const { resolvedTheme } = useTheme();

  return (
    <ClaimIdentityFlowProvider>
      <MarketingPageFrame
        beforeChrome={<GooeyBackdrop />}
        theme={resolvedTheme === "light" ? "light" : "dark"}
        footer={null}
      >
        <LandingHero />
      </MarketingPageFrame>
    </ClaimIdentityFlowProvider>
  );
}
