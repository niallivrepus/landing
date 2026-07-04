import { cn } from "@jokuh/gooey";
import type { ReactNode } from "react";
import { LANDING_MEDIA_HOVER_ZOOM } from "../lib/landing-media-hover";
import { SQUIRCLE_MEDIA_MATTE_CLASS } from "./system/editorialMedia";
import { SquircleMedia } from "./system/squircle";
import { LavaLamp, type LAVA_LAMP_STYLES } from "./LavaLamp";

export function NewsCardArt({
  gradient,
  image,
  imageClassName,
  lavaLamp,
  overlayImage,
  overlayAlt,
  overlayClassName,
  className,
  children,
  overlaySlotClassName,
}: {
  gradient: string;
  /** When provided, renders as the cover photo (overrides `lavaLamp` and `gradient`). */
  image?: string;
  /** Extra classes applied to the image element (e.g. `object-right` to shift the crop). */
  imageClassName?: string;
  lavaLamp?: keyof typeof LAVA_LAMP_STYLES;
  /** Logo or motif rendered centered above the lava lamp / gradient. */
  overlayImage?: string;
  overlayAlt?: string;
  /** Custom sizing classes for the overlay image. */
  overlayClassName?: string;
  className?: string;
  /** Overrides default centered overlay flex (e.g. bottom-anchored artwork). */
  overlaySlotClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("relative size-full", SQUIRCLE_MEDIA_MATTE_CLASS, className)}>
      <SquircleMedia className="size-full">
        {image ? (
          <img
            src={image}
            alt=""
            aria-hidden
            className={cn("size-full object-cover", LANDING_MEDIA_HOVER_ZOOM, imageClassName)}
            loading="lazy"
            decoding="async"
          />
        ) : lavaLamp ? (
          <div className={cn("size-full", LANDING_MEDIA_HOVER_ZOOM)}>
            <LavaLamp style={lavaLamp} />
          </div>
        ) : (
          <div className={cn("size-full", LANDING_MEDIA_HOVER_ZOOM)} style={{ background: gradient }} />
        )}
      </SquircleMedia>
      {overlayImage ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <img
            src={overlayImage}
            alt={overlayAlt ?? ""}
            aria-hidden={overlayAlt ? undefined : true}
            className={cn(
              "h-auto w-[min(58%,260px)] drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]",
              overlayClassName,
            )}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      {children ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
            overlaySlotClassName,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
