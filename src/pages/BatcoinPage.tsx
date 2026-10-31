import { useTheme } from "@jokuh/gooey";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { BatcoinCity } from "../components/landing/batcoin/BatcoinCity";
import { MarketingPageFrame } from "../components/system";

/**
 * **Purpose:** `/batcoin`: the living Batcoin city (`BatcoinCity`), in Gooey Light or Gooey Dark by the site theme
 * (system by default). Its own page, not linked from the home page or the footer yet (Sean decides after seeing it).
 * **Connects to:** `App.tsx` route, `server/static-middleware.ts` (`KNOWN_SPA_PREFIXES`), `public/sitemap.xml`.
 */
export function BatcoinPage() {
  useDocumentTitle("Batcoin | Jokuh");
  const { resolvedTheme } = useTheme();
  const scheme = resolvedTheme === "light" ? "light" : "dark";
  return (
    <MarketingPageFrame theme={scheme} footer={null}>
      <BatcoinCity scheme={scheme} />
    </MarketingPageFrame>
  );
}
