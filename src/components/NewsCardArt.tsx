import { cn } from "@jokuh/gooey";
import type { ReactNode } from "react";
import { LANDING_MEDIA_HOVER_ZOOM } from "../lib/landing-media-hover";
import { EDITORIAL_MEDIA_RADIUS_CLASS } from "./system";
import { LavaLamp, type LAVA_LAMP_STYLES } from "./LavaLamp";

export function NewsCardArt({
  gradient,
  image: _image,
  lavaLamp,
  className,
  children,
}: {
  gradient: string;
  image?: string;
  lavaLamp?: keyof typeof LAVA_LAMP_STYLES;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("relative size-full overflow-hidden bg-smoke-2", EDITORIAL_MEDIA_RADIUS_CLASS, className)}>
      {lavaLamp ? (
        <div className={cn("size-full rounded-[inherit]", LANDING_MEDIA_HOVER_ZOOM)}>
          <LavaLamp style={lavaLamp} />
        </div>
      ) : (
        <div
          className={cn("size-full rounded-[inherit]", LANDING_MEDIA_HOVER_ZOOM)}
          style={{ background: gradient }}
        />
      )}
      {children && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
