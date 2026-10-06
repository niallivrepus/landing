/**
 * **Purpose:** Public `/defense` page — "Defense technology for free people", shown as the app itself: the app
 * shell (corner pills + Nexus over a full-bleed scene) around a Jokuh Docs sheet that plays through what we build, a
 * walkthrough of real-app recordings, how the parts connect (honest trust boundaries), capabilities, where it fits,
 * what's built vs. roadmap, and the honest government status. One screen like the homepage: no document scroll, the
 * doc scrolls inside the sheet; the MegaFooter is dropped (`footer={null}`), the doc carries its own links.
 * **Connects to:** `components/defense/DefenseAppShell.tsx`, `data/defense.ts` (all copy + accuracy rules),
 * `/defense` route in `App.tsx`, `KNOWN_SPA_PREFIXES` in `server/static-middleware.ts`, search via
 * `lib/site-search-articles.ts`, `public/sitemap.xml`, `public/defense/captures/` (recordings).
 */
import { useTheme } from "@jokuh/gooey";
import { useEffect } from "react";
import { DefenseAppShell } from "../components/defense/DefenseAppShell";
import { MarketingPageFrame } from "../components/system";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import "../styles/landing-console-home.css";
import "../styles/defense-app.css";

export function DefensePage() {
  useDocumentTitle("Defense — Jokuh");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // One screen: the doc scrolls inside its sheet, not the page.
    document.documentElement.classList.add("defense-app-host");
    return () => document.documentElement.classList.remove("defense-app-host");
  }, []);

  return (
    <MarketingPageFrame theme={resolvedTheme === "light" ? "light" : "dark"} footer={null}>
      <DefenseAppShell />
    </MarketingPageFrame>
  );
}
