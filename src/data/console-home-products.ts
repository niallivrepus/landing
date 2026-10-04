/**
 * **Purpose:** Product focus list for the `/lab/home` "Console Home" prototype (PS5 home × Netflix billboard).
 * Copy is lifted from shipped site sources only — `products.ts` summaries, `SITE_PRODUCT_SENTENCE`
 * (OO) and the homepage arcade pill (chess). No new claims.
 * **Connects to:** `ConsoleHomeShell`, `ConsoleScene`, `ConsoleTileRow`, `product-hero-images.ts`.
 */
import { PRODUCT_HERO_IMAGES } from "./product-hero-images";
import { PRODUCTS } from "./products";

export type ConsoleProductId = "oo" | "spine" | "calls" | "messages" | "profile" | "blurbs" | "arcade";

/** Generative scene palettes for products without strong photography (rendered by `ConsoleShaderScene`). */
export type ConsoleShaderPalette = "oo" | "arcade";

export type ConsoleScene =
  | { kind: "image"; src: string; position?: string }
  | { kind: "video"; src: string; poster: string; position?: string }
  | { kind: "shader"; palette: ConsoleShaderPalette };

export type ConsolePrimaryAction =
  /** Talk to OO: focuses the inline prompt bar. */
  | { kind: "prompt"; label: string }
  /** Opens the bundled arcade game overlay. */
  | { kind: "game"; label: string }
  /** Opens the web app onboarding with a product intent. */
  | { kind: "web-app"; label: string; intent: string };

export type ConsoleProduct = {
  id: ConsoleProductId;
  title: string;
  /** Brand-line category: Private intelligence, identity, and community. */
  eyebrow: string;
  sentence: string;
  /** Tile art (square). `null` → CSS-painted tile for shader scenes. */
  tile: string | null;
  scene: ConsoleScene;
  primary: ConsolePrimaryAction;
  /** "Learn more" destination; Enter on a focused product tile opens it. */
  learnMoreHref: string;
};

export const CONSOLE_PRODUCTS: readonly ConsoleProduct[] = [
  {
    id: "oo",
    title: "OO",
    eyebrow: "Private intelligence",
    sentence:
      "Your own AI that remembers your calls, chats, and files — without giving that context to anyone else.",
    tile: null,
    scene: { kind: "shader", palette: "oo" },
    primary: { kind: "prompt", label: "Talk to OO" },
    learnMoreHref: "/demo",
  },
  {
    id: "spine",
    title: PRODUCTS.spine.title,
    eyebrow: "Private intelligence",
    sentence: PRODUCTS.spine.summary,
    tile: "/lab/console/spine.webp",
    scene: { kind: "image", src: PRODUCT_HERO_IMAGES.spine, position: "50% 40%" },
    primary: { kind: "web-app", label: "Try it", intent: "corner-spine" },
    learnMoreHref: "/spine",
  },
  {
    id: "calls",
    title: PRODUCTS.calls.title,
    eyebrow: "Community",
    sentence: PRODUCTS.calls.summary,
    tile: "/lab/console/calls.webp",
    scene: {
      kind: "video",
      src: "/product-hero/calls-header.mp4",
      poster: PRODUCT_HERO_IMAGES.calls,
      position: "62% 40%",
    },
    primary: { kind: "web-app", label: "Try it", intent: "corner-call" },
    learnMoreHref: "/calls",
  },
  {
    id: "messages",
    title: PRODUCTS.messages.title,
    eyebrow: "Community",
    sentence: PRODUCTS.messages.summary,
    tile: "/lab/console/texts.webp",
    scene: {
      kind: "video",
      src: "/product-hero/texts-header.mp4",
      poster: PRODUCT_HERO_IMAGES.messages,
      position: "56% 35%",
    },
    primary: { kind: "web-app", label: "Try it", intent: "corner-text" },
    learnMoreHref: "/messages",
  },
  {
    id: "profile",
    title: PRODUCTS.profile.title,
    eyebrow: "Identity",
    sentence: PRODUCTS.profile.summary,
    tile: "/lab/console/profile.webp",
    scene: { kind: "image", src: PRODUCT_HERO_IMAGES.profile, position: "60% 30%" },
    primary: { kind: "web-app", label: "Try it", intent: "corner-id" },
    learnMoreHref: "/profile",
  },
  {
    id: "blurbs",
    title: PRODUCTS.blurbs.title,
    eyebrow: "Community",
    sentence: PRODUCTS.blurbs.summary,
    tile: "/lab/console/blurbs.webp",
    scene: {
      kind: "video",
      src: "/product-hero/blurbs-header.mp4",
      poster: PRODUCT_HERO_IMAGES.blurbs,
      position: "45% 45%",
    },
    primary: { kind: "web-app", label: "Try it", intent: "identity" },
    learnMoreHref: "/blurbs",
  },
  {
    id: "arcade",
    title: "Arcade",
    eyebrow: "Community",
    sentence: "Games inside Jokuh. Start with a round of chess.",
    tile: null,
    scene: { kind: "shader", palette: "arcade" },
    primary: { kind: "game", label: "Play chess" },
    learnMoreHref: "/newsroom/fuel-arcade-token",
  },
] as const;

/** Visually hidden page H1 — the brand line. */
export const CONSOLE_BRAND_LINE = "Private intelligence, identity, and community.";
export const CONSOLE_BRAND_EXPANSION = "Joining Our Knowledge, Unifying Humanity.";
