/** **Purpose:** Full-bleed product hero images for immersive marketing shells (parity with `ProductPage`). */
export const PRODUCT_HERO_IMAGES = {
  blurbs: "/product-hero/blurbs-poster.webp",
  spine: "/product-hero/spine-featured-hero.webp",
  calls: "/product-hero/calls.webp",
  messages: "/product-hero/texts.webp",
  profile: "/product-hero/profile.webp",
} as const;

export type ProductHeroImageId = keyof typeof PRODUCT_HERO_IMAGES;
