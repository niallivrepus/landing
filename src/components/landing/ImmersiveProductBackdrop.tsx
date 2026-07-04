import { PRODUCT_HERO_IMAGES, type ProductHeroImageId } from "../../data/product-hero-images";

/**
 * **Purpose:** Full-viewport hero photo + gradient wash behind immersive product shells.
 * **Parity:** `ProfileImmersiveShell` — image above gradient, `opacity-[0.22]` dark / `0.12` light.
 * **Connects to:** Spine, Calls, Texts, Profile immersive pages.
 */
export function ImmersiveProductBackdrop({
  productId,
  imageSrc,
}: {
  productId?: ProductHeroImageId;
  imageSrc?: string;
}) {
  const src = imageSrc ?? (productId ? PRODUCT_HERO_IMAGES[productId] : undefined);
  if (!src) return null;

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/95 light:from-white/50 light:via-white/80 light:to-white"
        aria-hidden
      />
      <img
        src={src}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover object-center opacity-[0.22] light:opacity-[0.12]"
      />
    </>
  );
}
