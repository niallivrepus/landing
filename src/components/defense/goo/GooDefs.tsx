import { useTheme } from "@jokuh/gooey";
import { GooMaterialFilter } from "./GooMaterialFilter";
import { gooParams, splexSpec } from "./goo-material";

/**
 * **Purpose:** Page-wide goo filters for HTML goo (`filter: url(#…)`): the tab bead, the Missions chain, the day rail
 * and the recording splat all wear the real Splex glass (dark Splex / designed Gooey Light, by the site theme), with
 * goo amounts from the doctrine tiers. Content inside them stays crisp (it is never under the filter).
 * **Connects to:** `GooMaterialFilter.tsx`, `goo-material.ts`, `defense-goo.css`, `DefensePage.tsx` (mounted once).
 */
export function GooDefs() {
  const { resolvedTheme } = useTheme();
  const spec = splexSpec(resolvedTheme === "light" ? "light" : "dark");
  return (
    <svg aria-hidden focusable="false" width="0" height="0" className="defense-goo-defs">
      <defs>
        {/* Standard: chrome (tabs). */}
        <GooMaterialFilter id="dg-splex-standard" spec={spec} params={gooParams(40, 50)} />
        {/* Juicy: moments (chain, rail, splat). */}
        <GooMaterialFilter id="dg-splex-juicy" spec={spec} params={gooParams(58, 50)} />
      </defs>
    </svg>
  );
}
