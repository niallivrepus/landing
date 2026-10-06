import { useTheme } from "@jokuh/gooey";
import { useEffect } from "react";
import { ConsoleHomeShell } from "../components/landing/console/ConsoleHomeShell";
import { MarketingPageFrame } from "../components/system";
import { ClaimIdentityFlowProvider } from "../context/ClaimIdentityFlowContext";
import "../styles/landing-console-home.css";

/**
 * **Purpose:** Hidden design-lab route `/lab/home` — the "Console Home" homepage direction (PS5 home × Netflix
 * billboard). Not linked anywhere, not in the sitemap, `noindex,nofollow` while mounted. The live `/` is untouched.
 * **Connects to:** `App.tsx` route, `ConsoleHomeShell`, `landing-console-home.css` (code-split with this chunk).
 */
export function LabConsoleHomePage() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const previousTitle = document.title;
    const robots =
      document.querySelector<HTMLMetaElement>('meta[name="robots"]') ?? document.createElement("meta");
    robots.name = "robots";
    const previousRobots = robots.content;
    robots.content = "noindex,nofollow";
    if (!robots.parentElement) document.head.appendChild(robots);
    document.title = "Jokuh — Console Home (lab)";
    // One screen: no document scroll behind the billboard.
    document.documentElement.classList.add("console-home-host");

    return () => {
      document.title = previousTitle;
      document.documentElement.classList.remove("console-home-host");
      if (previousRobots) robots.content = previousRobots;
      else robots.remove();
    };
  }, []);

  return (
    <ClaimIdentityFlowProvider>
      <MarketingPageFrame theme={resolvedTheme === "light" ? "light" : "dark"} footer={null}>
        <ConsoleHomeShell />
      </MarketingPageFrame>
    </ClaimIdentityFlowProvider>
  );
}
