/**
 * **Purpose:** Copy + choreography for `/concepts/agent-court`: each step's plain-English line, what GenLayer does
 * underneath, and which corner / scene lights while it plays (the `/defense` mechanism).
 * **Accuracy:** concept only. Don't add costs or timings (GenLayer is pre-mainnet), named partners, or claims that
 * agents can hire agents in Jokuh today.
 * **Connects to:** `AgentCourtAppShell.tsx`, `AgentCourtDemo.tsx`.
 */
import type { ConsoleProductId } from "../../data/console-home-products";
import type { LandingCornerAction } from "../../data/landing-shell-preview";

export type AgentCourtStep = {
  title: string;
  /** What the person sees. */
  plain: string;
  /** What GenLayer is doing underneath. */
  layer: string;
  /** Corner pill to light; omitted → Nexus (OO) lights instead. */
  corner?: LandingCornerAction;
  stage: ConsoleProductId;
  dwellMs: number;
};

export const AGENT_COURT_STEPS: AgentCourtStep[] = [
  {
    title: "Ask",
    plain: "You tell OO what you want and what you'll pay.",
    layer: "Nothing on-chain yet. OO drafts the terms from your request.",
    stage: "oo",
    dwellMs: 3000,
  },
  {
    title: "Agree",
    plain: "OO finds a design agent and shows you the deal in plain English.",
    layer: "Both sides sign. The terms become an Intelligent Contract on GenLayer, written in natural language.",
    stage: "oo",
    dwellMs: 3400,
  },
  {
    title: "Escrow",
    plain: "Your $40 is held, not paid. Nobody can spend it yet.",
    layer: "Funds lock in the contract until it reaches a verdict.",
    stage: "oo",
    dwellMs: 2800,
  },
  {
    title: "Deliver",
    plain: "The agent sends the work back in the same chat.",
    layer: "The delivery is submitted to the contract as evidence.",
    corner: "text",
    stage: "messages",
    dwellMs: 3000,
  },
  {
    title: "Dispute",
    plain: "It isn't what you asked for, so you say so. That's it.",
    layer:
      "OO files the dispute. Only the agreement and the files you chose go out; your Spine and chats stay encrypted.",
    corner: "text",
    stage: "messages",
    dwellMs: 3400,
  },
  {
    title: "Review",
    plain: "Independent AI reviewers read the deal and the work.",
    layer: "Validators each run their own model and vote (Optimistic Democracy). Either side can appeal.",
    stage: "oo",
    dwellMs: 3400,
  },
  {
    title: "Verdict",
    plain: "A fair split, decided by nobody who works for either side.",
    layer: "The contract pays out per the verdict: part to the agent, the rest back to you.",
    stage: "oo",
    dwellMs: 3200,
  },
  {
    title: "Remember",
    plain: "The refund lands in your Wallet and the deal is saved to your Spine.",
    layer: "The receipt is on-chain; the memory stays private to you.",
    corner: "spine",
    stage: "spine",
    dwellMs: 4600,
  },
];
