import { cn } from "@jokuh/gooey";
import { useState } from "react";
import { TopNavAnchor } from "./TopNavAnchor";
import { SquircleMedia } from "./system/squircle";
import { LANDING_MEDIA_HOVER_ZOOM } from "../lib/landing-media-hover";

function EditorialTileImage({
  primary,
  fallback,
  priority = false,
}: {
  primary: string;
  fallback?: string;
  priority?: boolean;
}) {
  const [src, setSrc] = useState(primary);
  return (
    <img
      src={src}
      alt=""
      className={cn(
        "size-full object-cover brightness-[0.86] contrast-[1.04] saturate-[0.76] light:brightness-[0.97] light:contrast-[1.01] light:saturate-[0.9]",
        LANDING_MEDIA_HOVER_ZOOM,
      )}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={() => {
        if (fallback && src !== fallback) setSrc(fallback);
      }}
    />
  );
}

export type EditorialLinkCardItem = {
  href: string;
  image: string;
  imageFallback?: string;
  /** Small caps line above the title (matches Stories / news card meta). */
  eyebrow: string;
  title: string;
  description?: string;
};

/**
 * Same card shell as home `StoryCardCompact` and newsroom `JournalCompactCard`:
 * square art, border, radius, meta line, title, optional body.
 */
export function EditorialLinkCard({
  item,
  priority = false,
}: {
  item: EditorialLinkCardItem;
  priority?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col">
      <TopNavAnchor href={item.href} className="flex h-full flex-col no-underline">
        <SquircleMedia className="aspect-square">
          <EditorialTileImage
            primary={item.image}
            fallback={item.imageFallback}
            priority={priority}
          />
        </SquircleMedia>
        <div className="mt-3 flex flex-1 flex-col gap-1.5 pt-0.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-light-space/45 light:text-zinc-500">
            {item.eyebrow}
          </p>
          <h2 className="font-sans text-[0.9375rem] font-semibold leading-snug tracking-[0em] text-light-space transition-colors group-hover:text-light-space/80 light:text-zinc-950 md:text-[0.95rem]">
            {item.title}
          </h2>
          {item.description ? (
            <p className="mt-1 font-sans text-[13px] leading-relaxed text-light-space/48 light:text-zinc-600">
              {item.description}
            </p>
          ) : null}
        </div>
      </TopNavAnchor>
    </article>
  );
}

/** Newsroom `FeedWall` / home stories wall breakpoints. */
export const EDITORIAL_LINK_CARD_GRID_CLASS = "grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3";
