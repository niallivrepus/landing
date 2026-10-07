/**
 * **Purpose:** Unlisted `/concepts/agent-court` page — how GenLayer would settle agent-to-agent deals inside
 * Jokuh, for the GenLayer accelerator team. Not linked from nav, search, or the sitemap; noindex while mounted.
 * **Concept only:** the feature is not in the app; the ribbon says so (marketing shows real UI only otherwise).
 * **Connects to:** `components/concepts/AgentCourtDemo.tsx`, `/concepts` in `server/static-middleware.ts`
 * `KNOWN_SPA_PREFIXES`, route in `App.tsx`.
 */
import { useEffect } from "react";
import { AgentCourtDemo } from "../components/concepts/AgentCourtDemo";
import { MarketingPageFrame } from "../components/system";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import "../styles/agent-court-concept.css";

export function AgentCourtConceptPage() {
  useDocumentTitle("Agent agreements on GenLayer — Jokuh concept");

  useEffect(() => {
    const robots =
      document.querySelector<HTMLMetaElement>('meta[name="robots"]') ?? document.createElement("meta");
    robots.name = "robots";
    const previous = robots.content;
    robots.content = "noindex,nofollow";
    if (!robots.parentElement) document.head.appendChild(robots);
    return () => {
      robots.content = previous;
    };
  }, []);

  return (
    <MarketingPageFrame theme="dark" footer={null}>
      <div className="agent-court-page">
        <p className="agent-court-page__ribbon">Concept · not in the app yet · built with GenLayer</p>
        <h1 className="agent-court-page__title">When agents make deals, someone has to be the referee.</h1>
        <p className="agent-court-page__lede">
          In Jokuh, your agent can hire another agent and pay it. If the work isn't what you agreed, GenLayer
          settles it: independent AI reviewers read the deal and decide. We never see your data, and we don't
          pick the winner.
        </p>
        <AgentCourtDemo />
      </div>
    </MarketingPageFrame>
  );
}
