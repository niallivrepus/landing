/**
 * Marketing `/pitchdeck` theatre — same gated intro video + 2026 PDF slides as the old
 * jokuh.com sandbox SPA. Lives on the landing site so the public URL never opens the app.
 *
 * **Owns:** passphrase gate + `InteractivePitchDeck`.
 * **Connects to:** `App.tsx` routes `/pitchdeck` and `/pitch-deck`; static files in
 * `public/assets/pitchdeck/`.
 */

import { useEffect } from "react";
import InteractivePitchDeck from "../components/pitchdeck/interactive-pitch-deck";
import { PitchdeckAccessGate } from "../components/pitchdeck/pitchdeck-access-gate";

/**
 * **Purpose:** Full-bleed investor theatre without marketing chrome.
 * **Side effects:** Sets document title and noindex while mounted.
 */
export function PitchDeckPage() {
  useEffect(() => {
    const previousTitle = document.title;
    const robots =
      document.querySelector<HTMLMetaElement>('meta[name="robots"]') ?? document.createElement("meta");
    robots.name = "robots";
    const previousRobots = robots.content;
    robots.content = "noindex,nofollow";
    if (!robots.parentElement) document.head.appendChild(robots);
    document.title = "Jokuh Pitch Deck";
    document.documentElement.classList.add("pitchdeck-page-host");
    document.body.classList.add("pitchdeck-page-host");

    return () => {
      document.title = previousTitle;
      document.documentElement.classList.remove("pitchdeck-page-host");
      document.body.classList.remove("pitchdeck-page-host");
      if (previousRobots) robots.content = previousRobots;
      else robots.remove();
    };
  }, []);

  return (
    <PitchdeckAccessGate>
      <InteractivePitchDeck />
    </PitchdeckAccessGate>
  );
}
