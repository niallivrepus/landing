/**
 * **Purpose:** Product focus list for the `/lab/home` "Console Home" prototype (PS5 home × Netflix billboard).
 * Copy is lifted from shipped site sources only — `products.ts` summaries, `SITE_PRODUCT_SENTENCE` (OO), the
 * homepage arcade pill (chess) and Jokuh Mail (username@jokuh.com, live in the Texts inbox). No new claims.
 * Each product's scene is its hero art (atmosphere) with the product's live app surface mounted on top
 * (`console/surfaces/ConsoleSurfaces.tsx`). OO uses the live homepage background with its shader orb layered on;
 * Arcade, which has no art, is a generative shader scene.
 * **Connects to:** `ConsoleHomeShell`, `ConsoleScene`, `ConsoleTileRow`, `product-hero-images.ts`.
 */
import { LANDING_HOME_HERO_IMAGE } from "./landing-hero-copy";
import { PRODUCT_HERO_IMAGES } from "./product-hero-images";
import { PRODUCTS } from "./products";

export type ConsoleProductId = "oo" | "spine" | "calls" | "messages" | "profile" | "blurbs" | "arcade";

/** Generative scene palettes for products without strong photography (rendered by `ConsoleShaderScene`). */
export type ConsoleShaderPalette = "oo" | "arcade";

export type ConsoleScene =
  /** Full-bleed art; `overlay` layers a generative shader over it (screen-blended in dark, multiplied in light). */
  | { kind: "image"; src: string; position?: string; overlay?: ConsoleShaderPalette }
  | { kind: "shader"; palette: ConsoleShaderPalette };

/** Surface ids accepted by the real web app's read-only demo (`{VITE_ORIGIN_APP}/demo?surface=…`). */
export type ConsoleAppDemoSurface = "oo" | "spine" | "calls" | "texts" | "id" | "blurbs";

export type ConsoleProduct = {
  id: ConsoleProductId;
  title: string;
  /** Brand-line category: Private intelligence, identity, and community. */
  eyebrow: string;
  sentence: string;
  /** Tile art (square). `null` → CSS-painted tile for shader scenes. */
  tile: string | null;
  scene: ConsoleScene;
  /** "Open" (and Enter on the tile) opens this surface of the real app demo; `null` → no app surface (Arcade). */
  appSurface: ConsoleAppDemoSurface | null;
  /** "Learn more": the landing page for the product. */
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
    // The live homepage's own background, with OO's orb glowing through it.
    scene: { kind: "image", src: LANDING_HOME_HERO_IMAGE, position: "50% 42%", overlay: "oo" },
    appSurface: "oo",
    learnMoreHref: "/demo",
  },
  {
    id: "spine",
    title: PRODUCTS.spine.title,
    eyebrow: "Private intelligence",
    sentence: PRODUCTS.spine.summary,
    tile: "/lab/console/spine.webp",
    scene: { kind: "image", src: PRODUCT_HERO_IMAGES.spine, position: "50% 40%" },
    appSurface: "spine",
    learnMoreHref: "/spine",
  },
  {
    id: "calls",
    title: PRODUCTS.calls.title,
    eyebrow: "Community",
    sentence: PRODUCTS.calls.summary,
    tile: "/lab/console/calls.webp",
    scene: { kind: "image", src: PRODUCT_HERO_IMAGES.calls, position: "62% 40%" },
    appSurface: "calls",
    learnMoreHref: "/calls",
  },
  {
    id: "messages",
    title: PRODUCTS.messages.title,
    eyebrow: "Community",
    // Texts carries Jokuh Mail too: every account gets username@jokuh.com in the same inbox.
    sentence: "Messages and your own @jokuh.com email, in one inbox.",
    tile: "/lab/console/texts.webp",
    scene: { kind: "image", src: PRODUCT_HERO_IMAGES.messages, position: "56% 35%" },
    appSurface: "texts",
    learnMoreHref: "/messages",
  },
  {
    id: "profile",
    title: PRODUCTS.profile.title,
    eyebrow: "Identity",
    sentence: PRODUCTS.profile.summary,
    tile: "/lab/console/profile.webp",
    scene: { kind: "image", src: PRODUCT_HERO_IMAGES.profile, position: "60% 30%" },
    appSurface: "id",
    learnMoreHref: "/profile",
  },
  {
    id: "blurbs",
    title: PRODUCTS.blurbs.title,
    eyebrow: "Community",
    sentence: PRODUCTS.blurbs.summary,
    tile: "/lab/console/blurbs.webp",
    scene: { kind: "image", src: PRODUCT_HERO_IMAGES.blurbs, position: "45% 45%" },
    appSurface: "blurbs",
    learnMoreHref: "/blurbs",
  },
  {
    id: "arcade",
    title: "Arcade",
    eyebrow: "Community",
    sentence: "Games inside Jokuh. Start with a round of chess.",
    tile: null,
    scene: { kind: "shader", palette: "arcade" },
    appSurface: null,
    learnMoreHref: "/newsroom/fuel-arcade-token",
  },
] as const;

/** Visually hidden page H1 — the brand line. */
export const CONSOLE_BRAND_LINE = "Private intelligence, identity, and community.";
export const CONSOLE_BRAND_EXPANSION = "Joining Our Knowledge, Unifying Humanity.";

/** The real web app's read-only demo for a product surface (origin from `VITE_ORIGIN_APP`). */
export function consoleAppDemoHref(origin: string, surface: ConsoleAppDemoSurface): string {
  return `${origin.replace(/\/$/, "")}/demo?surface=${encodeURIComponent(surface)}`;
}
