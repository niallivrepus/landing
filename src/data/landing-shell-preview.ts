import type { ActionLordiconName } from "@jokuh/gooey";

/** Physical corner slots — parity with `CornerActionSlot` in the signed-in shell. */
export type LandingCornerSlot = "topLeading" | "topTrailing" | "bottomLeading" | "bottomTrailing";

/** Semantic home-corner actions mapped to marketing destinations (not signed-in routing). */
export type LandingCornerAction = "call" | "text" | "id" | "spine";

export type LandingCornerConfig = {
  slot: LandingCornerSlot;
  action: LandingCornerAction;
  label: string;
  href: string;
  lordicon: ActionLordiconName;
  /** `ActionButton` pill tilt — leading corners right, trailing corners left. */
  orientation: "right" | "left";
  /**
   * App energy colour for this corner (highlight glow on the console home). Parity: web app `ActionButtons.tsx`
   * unread dots — Call green-4, Text red-4, ID purple-4, Spine jelly (planner notes yellow-4).
   */
  energy: string;
};

/** Default signed-in slot map: ID / Spine on top, Call / Text on bottom. */
export const LANDING_CORNER_ACTIONS: readonly LandingCornerConfig[] = [
  {
    slot: "topLeading",
    action: "id",
    label: "Profile",
    href: "/profile",
    lordicon: "profile",
    orientation: "right",
    energy: "var(--color-purple-4, #9327ff)",
  },
  {
    slot: "topTrailing",
    action: "spine",
    label: "Spine",
    href: "/spine",
    lordicon: "spine",
    orientation: "left",
    energy: "var(--color-yellow-4, #ffb800)",
  },
  {
    slot: "bottomLeading",
    action: "call",
    label: "Calls",
    href: "/calls",
    lordicon: "calls",
    orientation: "left",
    energy: "var(--color-green-4, #21dc11)",
  },
  {
    slot: "bottomTrailing",
    action: "text",
    label: "Texts",
    href: "/messages",
    lordicon: "messages",
    orientation: "right",
    energy: "var(--color-red-4, #ff0700)",
  },
] as const;

/** Product surfaces rotated inside the hero squircle — same art as the showcase row. */
export const LANDING_SHELL_PRODUCT_SLIDES = [
  { id: "blurbs", title: "Blurbs", image: "/product-hero/blurbs-poster.webp" },
  { id: "spine", title: "Spine", image: "/product-hero/spine-featured-hero.webp" },
  { id: "calls", title: "Calls", image: "/product-hero/calls.webp" },
  { id: "messages", title: "Texts", image: "/product-hero/texts.webp" },
  { id: "profile", title: "Profile", image: "/product-hero/profile.webp" },
] as const;

/** Inset for corner pills inside the scaled hero preview frame. */
export const LANDING_SHELL_CORNER_INSET_PX = 14;
