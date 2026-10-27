/**
 * **Purpose:** Marketing copy for the immersive homepage hero (`LandingImmersiveShell`)
 * and the site-wide homepage sentence used in SEO / social meta and the footer.
 * **Connects to:** `LandingHero`, `Home` (`useDocumentTitle`), `FOOTER_SIGNATURE`,
 * `index.html` title/description/OG tags (must stay in sync), `/demo` seed navigation.
 */

/** Canonical homepage H1. Mirrored in `index.html` `#root` for crawlers before hydrate. */
export const LANDING_HERO_HEADLINE = "Your mind. Your machine.";

/**
 * Browser tab / Open Graph title for the marketing homepage.
 * Default for `useDocumentTitle`; must match `<title>` and `og:title` in `index.html`.
 */
export const SITE_DOCUMENT_TITLE = "Jokuh — Private intelligence, identity, and community";

/**
 * One-sentence product definition. Source of truth for meta description,
 * `og:description` / `twitter:description`, prerendered `#root` copy, and the
 * first line of `FOOTER_SIGNATURE`.
 */
export const SITE_PRODUCT_SENTENCE =
  "Jokuh is one private app for your calls, texts, memories and money. OO helps with all of it.";

/** Full-bleed office hero behind the homepage headline and prompt bar. */
export const LANDING_HOME_HERO_IMAGE = "/images/home/hero-office.png";
