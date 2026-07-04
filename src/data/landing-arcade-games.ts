/**
 * **Purpose:** Marketing-site arcade game paths — parity with `arcade/games.json` in the signed-in app.
 * **Connects to:** `LandingArcadeGameOverlay`, homepage suggestion pills.
 */

export const LANDING_ARCADE_CHESS_PATH = "/arcade/games/chess/index.html";

export type LandingArcadeGameId = "chess";

export const LANDING_ARCADE_GAMES: Record<
  LandingArcadeGameId,
  { title: string; src: string }
> = {
  chess: {
    title: "Chess",
    src: LANDING_ARCADE_CHESS_PATH,
  },
};
