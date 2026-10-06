import { useEffect } from "react";
import { useTheme } from "@jokuh/gooey";
import { SITE_DOCUMENT_TITLE } from "../data/landing-hero-copy";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ClaimIdentityFlowProvider } from "../context/ClaimIdentityFlowContext";
import { ConsoleHomeShell } from "../components/landing/console/ConsoleHomeShell";
import { MarketingPageFrame } from "../components/system";
import "../styles/landing-console-home.css";

/**
 * **Purpose:** Homepage = Console Home: one screen, the app's centered column framed by the corner pills, full-bleed
 * product backgrounds, a PS5-style product tile row, the live Bubbles rail, and the real OO prompt + temporary chat.
 * Product scenes are recordings of the real web app's `/demo` mode (`public/console/captures/`). Products, demo,
 * shipped log, newsroom and investors live on their own routes. The MegaFooter is dropped here (`footer={null}`).
 * **Connects to:** `ConsoleHomeShell`, claim-identity overlay, `SITE_DOCUMENT_TITLE` / `index.html` title,
 * `scripts/capture-app-demo.mjs` (re-record scenes when the app changes).
 */
export default function Home() {
  useDocumentTitle(SITE_DOCUMENT_TITLE);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // One screen: no document scroll behind the billboard.
    document.documentElement.classList.add("console-home-host");
    return () => document.documentElement.classList.remove("console-home-host");
  }, []);

  return (
    <ClaimIdentityFlowProvider>
      <MarketingPageFrame theme={resolvedTheme === "light" ? "light" : "dark"} footer={null}>
        <ConsoleHomeShell />
      </MarketingPageFrame>
    </ClaimIdentityFlowProvider>
  );
}
