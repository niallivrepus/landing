import { useState } from "react";
import { cn } from "@jokuh/gooey";
import { LANDING_MEDIA_HOVER_ZOOM } from "../lib/landing-media-hover";
import { EDITORIAL_MEDIA_RADIUS_CLASS } from "./system";

export function NewsCardArt({
  gradient,
  image,
  className,
}: {
  gradient: string;
  image?: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const showImg = image && !broken;

  return (
    <div className={cn("relative size-full overflow-hidden bg-smoke-2", EDITORIAL_MEDIA_RADIUS_CLASS, className)}>
      {showImg ? (
        <div className={cn("relative size-full", LANDING_MEDIA_HOVER_ZOOM)}>
          <img
            src={image}
            alt=""
            className={cn(
              "size-full rounded-[inherit] object-cover brightness-[0.88] contrast-[1.04] saturate-[0.78]",
            )}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-black/25 light:from-black/28 light:via-transparent light:to-black/12"
            aria-hidden
          />
        </div>
      ) : (
        <div
          className={cn("size-full rounded-[inherit]", LANDING_MEDIA_HOVER_ZOOM)}
          style={{ background: gradient }}
        />
      )}
    </div>
  );
}
