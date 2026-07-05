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
  },
  {
    slot: "topTrailing",
    action: "spine",
    label: "Spine",
    href: "/spine",
    lordicon: "spine",
    orientation: "left",
  },
  {
    slot: "bottomLeading",
    action: "call",
    label: "Calls",
    href: "/calls",
    lordicon: "calls",
    orientation: "left",
  },
  {
    slot: "bottomTrailing",
    action: "text",
    label: "Texts",
    href: "/messages",
    lordicon: "messages",
    orientation: "right",
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
