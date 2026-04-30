import { cn, useTheme } from "@jokuh/gooey";
import { CONTENT_SHELL_WIDE } from "../system/shells";

const BASE = "/pods-bento";

const IMG = {
  products: { light: `${BASE}/bento-products.png`, dark: `${BASE}/bento-products-dark.png` },
  maps: { light: `${BASE}/bento-maps.png` },
  github: { light: `${BASE}/bento-github.png`, dark: `${BASE}/bento-github-dark.png` },
  podcast: { light: `${BASE}/bento-podcast.png` },
  art: { light: `${BASE}/bento-art.png` },
} as const;

/** 24px gutters everywhere */
const G = "gap-[24px]";

function BentoTile({
  srcLight,
  srcDark,
  alt,
  className,
  imgFit = "cover",
  resolvedTheme,
}: {
  srcLight: string;
  srcDark?: string;
  alt: string;
  className?: string;
  imgFit?: "cover" | "contain";
  /** App theme from MarketingPageFrame — avoids OS `prefers-color-scheme` vs `dark:` mismatch. */
  resolvedTheme: "light" | "dark";
}) {
  const surface = resolvedTheme === "light" ? "bg-[#F5F5F7]" : "bg-[#1C1C1E]";
  const objectFit = imgFit === "contain" ? "object-contain" : "object-cover";
  const src = srcDark ? (resolvedTheme === "light" ? srcLight : srcDark) : srcLight;

  return (
    <div
      className={cn(
        "relative min-h-0 w-full overflow-hidden rounded-2xl [transform:translateZ(0)]",
        surface,
        className,
      )}
      role="img"
      aria-label={alt}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full max-w-none rounded-2xl object-center",
          objectFit,
        )}
      />
    </div>
  );
}

export function PodsBentoGrid() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : ("dark" as const);

  return (
    <div className={cn(CONTENT_SHELL_WIDE, "mt-10 md:mt-14")}>
      <div
        className={cn(
          "mx-auto min-h-0 w-full min-w-0 max-w-full",
          /* Phone: 3fr / 2fr top row — product left (2 rows), github + maps stacked right; then full-width podcast + art */
          "max-lg:grid max-lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] max-lg:gap-[24px] max-lg:auto-rows-auto",
          /* Tablet + desktop: unchanged 3-column bento */
          "lg:grid lg:h-[var(--bento-h)] lg:w-max lg:max-w-full lg:min-h-0 lg:grid-cols-[calc(var(--bento-h)*498/1024)_var(--bento-h)_var(--bento-h)] lg:grid-rows-1 lg:items-stretch lg:gap-x-[24px] lg:gap-y-[24px]",
        )}
        style={{
          ["--bento-h" as string]: "clamp(32rem, 50vmin, min(44rem, calc(100vw - 4rem)))",
        }}
      >
        <div
          className={cn(
            "flex w-full min-w-0 justify-center",
            "max-lg:col-start-1 max-lg:row-start-1 max-lg:row-span-2 max-lg:self-stretch",
            "lg:h-full lg:min-h-0 lg:w-fit lg:shrink-0 lg:justify-end lg:justify-self-end",
          )}
        >
          <BentoTile
            srcLight={IMG.products.light}
            srcDark={IMG.products.dark}
            alt="Pods product preview"
            className="aspect-[498/1024] w-full min-h-0 shrink-0 lg:h-full lg:w-auto lg:max-w-full"
            imgFit="contain"
            resolvedTheme={theme}
          />
        </div>

        <div
          className={cn(
            "min-h-0 min-w-0 max-lg:contents",
            "lg:flex lg:h-full lg:min-w-0 lg:flex-col",
            G,
          )}
        >
          <div className={cn("grid shrink-0 grid-cols-2 max-lg:contents", G)}>
            <BentoTile
              srcLight={IMG.maps.light}
              alt="Maps preview"
              className={cn(
                "aspect-square",
                "max-lg:col-start-2 max-lg:row-start-2 max-lg:min-h-0",
              )}
              resolvedTheme={theme}
            />
            <BentoTile
              srcLight={IMG.github.light}
              srcDark={IMG.github.dark}
              alt="Activity grid preview"
              className={cn(
                "aspect-square",
                "max-lg:col-start-2 max-lg:row-start-1 max-lg:min-h-0",
              )}
              resolvedTheme={theme}
            />
          </div>
          <div
            className={cn(
              "flex min-h-0 w-full flex-col",
              "max-lg:col-span-2 max-lg:col-start-1 max-lg:row-start-3",
              "lg:min-h-0 lg:flex-1",
            )}
          >
            <BentoTile
              srcLight={IMG.podcast.light}
              alt="Podcast preview"
              className="w-full max-lg:aspect-[2/1] max-lg:min-h-[200px] lg:h-full lg:min-h-0"
              imgFit="contain"
              resolvedTheme={theme}
            />
          </div>
        </div>

        <div
          className={cn(
            "flex w-full min-w-0 flex-col",
            "max-lg:col-span-2 max-lg:col-start-1 max-lg:row-start-4",
            "lg:h-full lg:min-h-0",
          )}
        >
          <BentoTile
            srcLight={IMG.art.light}
            alt="Profile art preview"
            className="aspect-square w-full lg:h-full"
            resolvedTheme={theme}
          />
        </div>
      </div>
    </div>
  );
}
