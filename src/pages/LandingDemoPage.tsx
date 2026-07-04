import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ClaimIdentityFlowProvider } from "../context/ClaimIdentityFlowContext";
import { LandingDemoShell } from "../components/landing/LandingDemoShell";
import { GooeyBackdrop } from "../components/landing/GooeyBackdrop";
import { MarketingPageFrame } from "../components/system";
import { useTheme } from "@jokuh/gooey";

/**
 * **Purpose:** `/demo` route — OO conversation + product slideshow after the homepage prompt send.
 * **Connects to:** `LandingImmersiveShell` navigation, `App.tsx` routes.
 */
export default function LandingDemoPage() {
  useDocumentTitle("Try Jokuh");
  const { resolvedTheme } = useTheme();

  return (
    <ClaimIdentityFlowProvider>
      <MarketingPageFrame
        beforeChrome={<GooeyBackdrop />}
        theme={resolvedTheme === "light" ? "light" : "dark"}
      >
        <LandingDemoShell />
      </MarketingPageFrame>
    </ClaimIdentityFlowProvider>
  );
}
