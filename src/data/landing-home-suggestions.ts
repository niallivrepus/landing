/**
 * **Purpose:** Homepage suggestion pills under the prompt bar — OO prompts + light site discovery.
 * **Connects to:** `LandingHomeSuggestionPills`, `LandingImmersiveShell`, app `home-search-suggestion-pill` parity.
 */

import type { LandingArcadeGameId } from "./landing-arcade-games";

export type LandingHomeSuggestion =
  | {
      id: string;
      label: string;
      kind: "prompt";
      /** Submitted through the prompt bar → `/demo` seed message. */
      query: string;
    }
  | {
      id: string;
      label: string;
      kind: "link";
      href: string;
    }
  | {
      id: string;
      label: string;
      kind: "game";
      /** Arcade bundle id — opens `LandingArcadeGameOverlay`. */
      gameId: LandingArcadeGameId;
    };

/** OO-first pills teach the product; one nav pill routes to investors without crowding the row. */
export const LANDING_HOME_SUGGESTIONS: LandingHomeSuggestion[] = [
  {
    id: "oo-context",
    label: "What does OO know?",
    kind: "prompt",
    query: "What does OO understand about my calls, chats, and relationships?",
  },
  {
    id: "oo-spine",
    label: "Explain Spine",
    kind: "prompt",
    query: "Explain Spine and how it holds my activity over time",
  },
  {
    id: "privacy",
    label: "How private is this?",
    kind: "prompt",
    query: "How private is Jokuh and my confidential AI?",
  },
  {
    id: "summarize",
    label: "Summarize my week",
    kind: "prompt",
    query: "Summarize what happened in my calls and chats this week",
  },
  {
    id: "chess",
    label: "Play chess",
    kind: "game",
    gameId: "chess",
  },
  {
    id: "invest",
    label: "Invest",
    kind: "link",
    href: "/invest",
  },
];
