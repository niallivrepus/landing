/**
 * **Purpose:** Public `/defense` page — "Defense technology for free people", rebuilt on the Goo material (2026-10).
 * A goo hero of the system, then an interactive explorer (Missions · System map), a scroll-driven "day in the life",
 * honest trust boundaries, principles, where it fits, built-vs-roadmap and the plain government status. Every app
 * screen is a recording of the real app on demo data; diagrams are drawn as diagrams. Normal page scroll with the
 * site top bar and footer (the earlier one-screen auto-playing Docs sheet is gone).
 * **Connects to:** `components/defense/goo/*`, `data/defense.ts` (all copy + accuracy rules), `styles/defense-goo.css`,
 * `/defense` route in `App.tsx`, `KNOWN_SPA_PREFIXES` in `server/static-middleware.ts`, `lib/site-search-articles.ts`,
 * `public/defense/captures/` (recordings), `public/defense/` (capability statement, share images).
 */
import { CompanyPageLayout } from "../components/CompanyPageLayout";
import { DefenseDay } from "../components/defense/goo/DefenseDay";
import { DefenseExplorer } from "../components/defense/goo/DefenseExplorer";
import { DefenseHero } from "../components/defense/goo/DefenseHero";
import { DefenseBuilt, DefenseFits, DefenseGovernment, DefensePrinciples } from "../components/defense/goo/DefenseStatus";
import { DefenseTrust } from "../components/defense/goo/DefenseTrust";
import { GooDefs } from "../components/defense/goo/GooDefs";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import "../styles/defense-goo.css";

export function DefensePage() {
  useDocumentTitle("Defense \u2014 Jokuh");
  return (
    <CompanyPageLayout>
      <GooDefs />
      <div className="defense-page">
        <DefenseHero />
        <DefenseExplorer />
        <DefenseDay />
        <DefenseTrust />
        <DefensePrinciples />
        <DefenseFits />
        <DefenseBuilt />
        <DefenseGovernment />
      </div>
    </CompanyPageLayout>
  );
}
