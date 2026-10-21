import type { DefenseNodeId } from "../../../data/defense";

/** App energy colour per part (the same colours as the app's corners and Nexus). Used by the goo sections. */
export const DEFENSE_NODE_ENERGY: Record<DefenseNodeId, string> = {
  identity: "var(--color-purple-4, #9327ff)",
  messages: "var(--color-red-4, #ff0700)",
  calls: "var(--color-green-4, #21dc11)",
  spine: "var(--color-yellow-4, #ffb800)",
  docs: "#ff4d00",
  oo: "#8c73ff",
  bubbles: "#2c81ff",
};
