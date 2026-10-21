/**
 * **Purpose:** Public `/defense` page — "Defense technology for free people", built as a sibling of the homepage so it
 * reads as the app: the Gooey home shell (`.gh` root, goo corner frame + Nexus, giant background type, slabs, the
 * scroll-merge drops, the Gooey footer), with the defense story inside it — a living goo system in the hero, the
 * Missions / System map explorer, a day in the life, honest trust boundaries, principles, where it fits, built vs
 * roadmap and the plain government status. Every app screen is a recording of the real app on demo data; diagrams
 * are drawn as diagrams.
 * **Connects to:** `components/defense/goo/*`, `components/landing/gooey-home/*` (shell pieces), `data/defense.ts`
 * (all copy + accuracy rules), `styles/gooey-home.css` + `styles/defense-goo.css`, `/defense` route in `App.tsx`.
 */
import { useTheme } from "@jokuh/gooey";
import { DefenseDay } from "../components/defense/goo/DefenseDay";
import { DefenseExplorer } from "../components/defense/goo/DefenseExplorer";
import { DefenseHero } from "../components/defense/goo/DefenseHero";
import { DefenseBuilt, DefenseFits, DefenseGovernment, DefensePrinciples } from "../components/defense/goo/DefenseStatus";
import { DefenseTrust } from "../components/defense/goo/DefenseTrust";
import { GooDefs } from "../components/defense/goo/GooDefs";
import { GooFooter } from "../components/landing/gooey-home/GooeyHome";
import { GooScrollMerge } from "../components/landing/gooey-home/GooScrollMerge";
import { MarketingPageFrame } from "../components/system";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import "../styles/gooey-home.css";
import "../styles/defense-goo.css";

export function DefensePage() {
  useDocumentTitle("Defense \u2014 Jokuh");
  const { resolvedTheme } = useTheme();
  const scheme = resolvedTheme === "light" ? "light" : "dark";
  return (
    <MarketingPageFrame theme={scheme} footer={null}>
      <div className="gh" data-scheme={scheme}>
        <GooDefs />
        <div className="defense-page">
          <DefenseHero />
          <GooScrollMerge scheme={scheme} />
          <DefenseExplorer />
          <DefenseDay />
          <GooScrollMerge scheme={scheme} tint="accent" />
          <DefenseTrust />
          <DefensePrinciples />
          <DefenseFits />
          <DefenseBuilt />
          <GooScrollMerge scheme={scheme} tint="go" />
          <DefenseGovernment />
        </div>
        <GooFooter />
      </div>
    </MarketingPageFrame>
  );
}
