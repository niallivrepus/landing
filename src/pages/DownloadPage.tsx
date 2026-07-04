import { ClaimIdentityFlowProvider } from "../context/ClaimIdentityFlowContext";
import { DownloadImmersiveShell } from "../components/landing/DownloadImmersiveShell";
import { GooeyBackdrop } from "../components/landing/GooeyBackdrop";
import { MarketingPageFrame } from "../components/system";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTheme } from "@jokuh/gooey";

/**
 * **Purpose:** `/download` route — immersive early-access surface with corner chrome and centered CTAs.
 * **Connects to:** `download-intents.ts`, `useDownloadIntercept`, `DownloadImmersiveShell`.
 */
export function DownloadPage() {
  useDocumentTitle("Download Jokuh");
  const { resolvedTheme } = useTheme();

  return (
    <ClaimIdentityFlowProvider>
      <MarketingPageFrame
        beforeChrome={<GooeyBackdrop />}
        withFontSans
        theme={resolvedTheme === "light" ? "light" : "dark"}
      >
        <DownloadImmersiveShell />
      </MarketingPageFrame>
    </ClaimIdentityFlowProvider>
  );
}
