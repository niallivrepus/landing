/**
 * **Purpose:** Homepage suggestion pills under the prompt bar — OO prompts + light site discovery.
 * **Connects to:** `LandingHomeSuggestionPills`, `LandingImmersiveShell`, app `home-search-suggestion-pill` parity.
 */

import type { LandingArcadeGameId } from "./landing-arcade-games";
import type { LandingDemoPowerId } from "./landing-demo-powers";

export type LandingHomeSuggestion =
  | {
      id: string;
      label: string;
      kind: "prompt";
      /** Submitted through the prompt bar → homepage demo seed. */
      query: string;
      /** Optional explicit power so chips run the matching OO proof. */
      powerId?: LandingDemoPowerId;
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

/** OO-first pills teach the product. Token/invest stays off this consumer row. */
export const LANDING_HOME_SUGGESTIONS: LandingHomeSuggestion[] = [
  {
    id: "oo-context",
    label: "What does OO know?",
    kind: "prompt",
    query: "What does Maya prefer for decks?",
    powerId: "memory",
  },
  {
    id: "oo-spine",
    label: "Explain Spine",
    kind: "prompt",
    query: "What did we decide on pricing last Tuesday?",
    powerId: "spine",
  },
  {
    id: "privacy",
    label: "How private is this?",
    kind: "prompt",
    query: "Who can read my messages with Sam?",
    powerId: "privacy",
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
];
