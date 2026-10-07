/**
 * **Purpose:** Unlisted `/concepts/agent-court` page — how GenLayer would settle agent-to-agent deals inside
 * Jokuh, for the GenLayer accelerator team. Shown as the app (corner pills + Nexus around a Jokuh Docs sheet), like
 * `/defense`. Not linked from nav, search, or the sitemap; noindex while mounted.
 * **Concept only:** the feature is not in the app; the doc's meta line says so.
 * **Connects to:** `components/concepts/AgentCourtAppShell.tsx`, `/concepts` in `server/static-middleware.ts`
 * `KNOWN_SPA_PREFIXES`, route in `App.tsx`.
 */
import { useTheme } from "@jokuh/gooey";
import { useEffect } from "react";
import { AgentCourtAppShell } from "../components/concepts/AgentCourtAppShell";
import { MarketingPageFrame } from "../components/system";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import "../styles/landing-console-home.css";
import "../styles/defense-app.css";
import "../styles/agent-court-concept.css";

export function AgentCourtConceptPage() {
  useDocumentTitle("Agent agreements on GenLayer — Jokuh concept");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // One screen like /defense: the doc scrolls inside its sheet, not the page.
    document.documentElement.classList.add("defense-app-host");
    const robots =
      document.querySelector<HTMLMetaElement>('meta[name="robots"]') ?? document.createElement("meta");
    robots.name = "robots";
    const previous = robots.content;
    robots.content = "noindex,nofollow";
    if (!robots.parentElement) document.head.appendChild(robots);
    return () => {
      document.documentElement.classList.remove("defense-app-host");
      robots.content = previous;
    };
  }, []);

  return (
    <MarketingPageFrame theme={resolvedTheme === "light" ? "light" : "dark"} footer={null}>
      <AgentCourtAppShell />
    </MarketingPageFrame>
  );
}
