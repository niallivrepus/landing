/** Default squircle radius for editorial/news/product photo tiles. */
export const SQUIRCLE_MEDIA_CORNER_RADIUS = 28;

/**
 * Matte behind clipped squircle corners — must match landing section backgrounds
 * (`bg-dark-space light:bg-white`) so anti-aliased edges disappear into the page.
 */
export const SQUIRCLE_MEDIA_MATTE_CLASS = "bg-dark-space light:bg-white";

/**
 * Legacy radius helper — superseded by `SquircleMedia`.
 * Kept as a no-op so existing `cn(...)` call sites stay stable during migration.
 */
export const EDITORIAL_MEDIA_RADIUS_CLASS = "";
