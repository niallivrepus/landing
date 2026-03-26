import { cn } from "@jokuh/gooey";
import type { ProductDetailMedia as ProductDetailMediaConfig } from "../../data/product-detail-blueprints";

function PlaceholderSurface({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-full bg-[#f8f8f8]",
        className,
      )}
    />
  );
}

export function ProductDetailMedia({
  media,
  active: _active = false,
  className,
}: {
  media: ProductDetailMediaConfig;
  active?: boolean;
  className?: string;
}) {
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

  return <PlaceholderSurface className={className} />;
}
