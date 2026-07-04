/** **Purpose:** Full-bleed product hero images for immersive marketing shells (parity with `ProductPage`). */
export const PRODUCT_HERO_IMAGES = {
  blurbs: "/product-hero/blurbs-poster.jpg",
  spine: "/product-hero/spine-featured-hero.png",
  calls: "/product-hero/calls.jpg",
  messages: "/product-hero/texts.jpg",
  profile: "/product-hero/profile.png",
} as const;

export type ProductHeroImageId = keyof typeof PRODUCT_HERO_IMAGES;
