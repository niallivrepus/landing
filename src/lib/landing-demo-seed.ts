/**
 * **Purpose:** Homepage hero → “See it work” handoff. Prompt send and suggestion chips
 * dispatch a seed event so `ProductDemoSection` runs the matching OO power instead of
 * scrolling to a dead demo.
 * **Connects to:** `LandingImmersiveShell`, `ProductDemoSection`, `landing-demo-powers.ts`.
 */

import {
  LANDING_DEMO_POWERS,
  type LandingDemoPower,
  type LandingDemoPowerId,
} from "../data/landing-demo-powers";

export const LANDING_DEMO_SEED_EVENT = "jokuh-landing-demo-seed";

export type LandingDemoSeedDetail = {
  query: string;
  powerId?: LandingDemoPowerId;
  /** Distinguishes repeat clicks of the same chip. */
  nonce: number;
};

/** Idle hero prompt copy — sending with an empty field uses this line. */
export const LANDING_HERO_PREVIEW_PROMPT = "see OO work";

/**
 * **Returns** the demo power that best matches a hero query or explicit power id.
 * Empty / preview sends map to privacy so the “Only you and Sam…” proof actually plays.
 */
export function resolveLandingDemoPower(
  query: string,
  powerId?: LandingDemoPowerId | string | null,
): LandingDemoPower {
  if (powerId) {
    const byId = LANDING_DEMO_POWERS.find((power) => power.id === powerId);
    if (byId) return byId;
  }

  const normalized = query.trim().toLowerCase();
  if (!normalized || normalized === LANDING_HERO_PREVIEW_PROMPT) {
    return LANDING_DEMO_POWERS.find((power) => power.id === "privacy") ?? LANDING_DEMO_POWERS[0]!;
  }

  const hit = LANDING_DEMO_POWERS.find((power) => {
    if (normalized === power.prompt.toLowerCase()) return true;
    if (normalized.includes(power.label.toLowerCase()) || normalized.includes(power.id)) return true;
    if (normalized.includes("private") && power.id === "privacy") return true;
    if (normalized.includes("spine") && power.id === "spine") return true;
    if ((normalized.includes("know") || normalized.includes("remember")) && power.id === "memory") return true;
    return false;
  });

  return hit ?? LANDING_DEMO_POWERS[0]!;
}

/** **Dispatches** a seed so the homepage demo thread runs the chosen power. */
export function seedLandingDemo(detail: Omit<LandingDemoSeedDetail, "nonce">): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<LandingDemoSeedDetail>(LANDING_DEMO_SEED_EVENT, {
      detail: { ...detail, nonce: Date.now() },
    }),
  );
}

/** **Scrolls** the homepage proof stage into view after a hero prompt or chip. */
export function scrollLandingDemoIntoView(): void {
  const demo = document.getElementById("demo");
  if (demo) {
    demo.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  window.location.assign("/demo");
}
