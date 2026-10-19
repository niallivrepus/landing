import { useTheme } from "@jokuh/gooey";
import { SITE_DOCUMENT_TITLE } from "../data/landing-hero-copy";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { GooeyHome } from "../components/landing/gooey-home/GooeyHome";
import { MarketingPageFrame } from "../components/system";

/**
 * **Purpose:** Homepage = the Gooey home: the app's home on the web (goo corner frame, Nexus, frozen Glyph mark,
 * "Ask OO…" with the live signed-out OO chat, Get Jokuh), one section per pillar with real Gooey screens, a trust
 * strip and the footer. The Gooey footer replaces MegaFooter here (`footer={null}`).
 * The previous Console Home (`components/landing/console/ConsoleHomeShell`) is kept in the tree, unused.
 * **Connects to:** `GooeyHome`, `SITE_DOCUMENT_TITLE` / `index.html` title.
 */
export default function Home() {
  useDocumentTitle(SITE_DOCUMENT_TITLE);
  const { resolvedTheme } = useTheme();

  return (
    <MarketingPageFrame theme={resolvedTheme === "light" ? "light" : "dark"} footer={null}>
      <GooeyHome />
    </MarketingPageFrame>
  );
}
