import type { LandingCornerAction } from "../data/landing-shell-preview";

/** **Purpose:** Maps product routes to the active corner pill action for `ImmersiveAppChrome`. */
const PATH_TO_ACTION: Record<string, LandingCornerAction> = {
  "/profile": "id",
  "/spine": "spine",
  "/calls": "call",
  "/messages": "text",
};

export function immersiveActiveActionFromPath(pathname: string): LandingCornerAction | undefined {
  return PATH_TO_ACTION[pathname.replace(/\/$/, "")];
}
