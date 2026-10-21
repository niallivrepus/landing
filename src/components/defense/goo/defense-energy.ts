import type { DefenseNodeId } from "../../../data/defense";

/**
 * App energy per part, straight from the Gooey colour library (`--color-<energy>-<n>` in `@jokuh/gooey`'s
 * design tokens): the same energies as the app's corners, Nexus and Goo Lab. Used by every goo section.
 */
export const DEFENSE_NODE_ENERGY: Record<DefenseNodeId, string> = {
  identity: "var(--color-purple-4)",
  messages: "var(--color-red-4)",
  calls: "var(--color-green-4)",
  spine: "var(--color-yellow-4)",
  docs: "var(--color-orange-4)",
  oo: "var(--color-pink-4)",
  bubbles: "var(--color-blue-5)",
};

/** Trust boundary energies (membranes, badges, legend). */
export const DEFENSE_BOUNDARY_ENERGY = {
  sealed: "var(--color-green-4)",
  account: "var(--color-yellow-4)",
  ai: "var(--color-pink-4)",
  neutral: "var(--color-smoke-4)",
  roadmap: "var(--color-smoke-4)",
} as const;
