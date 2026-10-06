import type { ConsoleProductId } from "../../data/console-home-products";
import { DEFENSE_WALKTHROUGH, type DefenseNodeId, type DefenseTrustNodeId } from "../../data/defense";
import type { LandingCornerAction } from "../../data/landing-shell-preview";

/**
 * **Purpose:** The `/defense` doc's auto-play script — one stop per doc section, in reading order, with how long it
 * holds (≈85 s end to end), which app corner lights (`highlightAction` / `highlightNexus`, the homepage mechanism),
 * which diagram nodes pulse, and which full-bleed scene sits behind the column (`ConsoleStage`).
 * **Connects to:** `useDefenseAutoplay`, `DefenseAppShell`, `DefenseDoc` (`data-stop` ids must match).
 */

export type DefenseStop = {
  id: string;
  /** Short name in the contents rail and the progress pill's label. */
  label: string;
  dwellMs: number;
  corner?: LandingCornerAction;
  nexus?: boolean;
  nodes: DefenseNodeId[];
  /** The part the stop is about (contents dot colour); defaults to the last of `nodes`. */
  node?: DefenseNodeId;
  stage: ConsoleProductId;
  /** The section tours its own parts (diagram nodes / capability tiles); corners follow the focused part. */
  tours?: boolean;
  /** Indented under "See it work" in the contents rail. */
  sub?: boolean;
};

const STEP_STOPS: Record<string, Omit<DefenseStop, "id" | "label" | "nodes">> = {
  identity: { dwellMs: 5500, corner: "id", stage: "profile", sub: true },
  team: { dwellMs: 5500, stage: "calls", sub: true },
  texts: { dwellMs: 6000, corner: "text", stage: "messages", sub: true },
  calls: { dwellMs: 5000, corner: "call", stage: "calls", sub: true },
  spine: { dwellMs: 7000, corner: "spine", stage: "spine", sub: true },
  oo: { dwellMs: 6000, nexus: true, stage: "oo", sub: true },
};

export const DEFENSE_STOPS: DefenseStop[] = [
  { id: "hero", label: "Overview", dwellMs: 5500, nodes: [], stage: "oo" },
  { id: "build", label: "What we're building", dwellMs: 6500, nodes: ["identity", "messages", "spine", "oo"], stage: "oo" },
  ...DEFENSE_WALKTHROUGH.steps.map((step) => ({
    id: `step-${step.id}`,
    label: step.title,
    nodes: [...step.path],
    node: step.node,
    ...STEP_STOPS[step.id]!,
  })),
  { id: "connected", label: "How it's connected", dwellMs: 10000, nodes: [], stage: "messages", tours: true },
  { id: "capabilities", label: "At a glance", dwellMs: 8100, nodes: [], stage: "spine", tours: true },
  { id: "fits", label: "Where it fits", dwellMs: 5000, nodes: ["messages", "identity", "oo"], stage: "profile" },
  { id: "built", label: "Built today", dwellMs: 6000, nodes: [], stage: "spine" },
  { id: "government", label: "Working with government", dwellMs: 5000, nodes: [], stage: "oo" },
  { id: "closing", label: "Talk to our team", dwellMs: 4500, nodes: [], stage: "oo" },
];

/** Where each diagram node lives in the app shell: its corner (or the Nexus, for OO). */
export const CORNER_FOR_NODE: Partial<Record<DefenseNodeId, LandingCornerAction | "nexus">> = {
  identity: "id",
  messages: "text",
  calls: "call",
  spine: "spine",
  docs: "spine",
  oo: "nexus",
};

/** The trust diagram's parts, mapped onto the system nodes (for corners, scenes and the mini map). */
export const NODE_FOR_TRUST: Record<DefenseTrustNodeId, DefenseNodeId | null> = {
  passkey: "identity",
  keys: "identity",
  relay: "messages",
  recipient: "messages",
  calls: "calls",
  store: "spine",
  oo: "oo",
  roadmap: null,
};

export const STAGE_FOR_NODE: Record<DefenseNodeId, ConsoleProductId> = {
  identity: "profile",
  messages: "messages",
  calls: "calls",
  spine: "spine",
  docs: "spine",
  oo: "oo",
  bubbles: "calls",
};
