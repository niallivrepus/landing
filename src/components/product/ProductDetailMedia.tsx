import { cn } from "@jokuh/gooey";
import type { ProductDetailMedia as ProductDetailMediaConfig } from "../../data/product-detail-blueprints";

function PlaceholderSurface({ className }: { className?: string }) {
  return <div className={cn("size-full bg-zinc-100 dark:bg-black", className)} />;
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

  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        poster={media.poster}
        className={cn("size-full object-cover", className)}
        muted
        playsInline
        loop
        aria-label={media.alt}
      />
    );
  }

  if (media.kind === "gradient") {
    return (
      <div className={cn("relative size-full overflow-hidden", className)}>
        <div aria-hidden className="absolute inset-0 bg-zinc-100 dark:bg-black" />
        <div
          aria-hidden
          className="absolute inset-0 dark:hidden"
          style={{ background: media.gradient }}
        />
        <div className="relative z-10 size-full min-h-0" />
      </div>
    );
  }

  return <PlaceholderSurface className={className} />;
}
