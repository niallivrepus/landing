import { cn, useTheme } from "@jokuh/gooey";
import type { ProductDetailMedia as ProductDetailMediaConfig } from "../../data/product-detail-blueprints";

export function ProductDetailMedia({
  media,
  active: _active = false,
  className,
}: {
  media: ProductDetailMediaConfig;
  active?: boolean;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();

  if (media.kind === "image") {
    return (
      <img
        src={media.src}
        alt={media.alt}
        className={cn("size-full object-cover", className)}
        style={media.objectPosition ? { objectPosition: media.objectPosition } : undefined}
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        className={cn("size-full object-cover", className)}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  if (media.kind === "gradient") {
    if (media.gradient === "none" || !media.gradient.trim()) {
      return null;
    }
    const background = resolvedTheme === "dark" ? "#232326" : media.gradient;
    return (
      <div
        className={cn("size-full", className)}
        style={{ background }}
        aria-hidden
      />
    );
  }

  return null;
}
