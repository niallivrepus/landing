import { cn } from "@jokuh/gooey";
import { Player } from "@lordicon/react";
import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import menuLordicon from "../../../node_modules/@jokuh/gooey/src/assets/lordicon/filled/spinner-rain.json";
import { NewsCardArt } from "../NewsCardArt";
import { TopNavAnchor } from "../TopNavAnchor";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { NEWS_ITEMS, formatNewsDate, getNewsCardArt, getNewsHref, type NewsCardArtDescriptor } from "../../data/news";

const PHONE_CARD_RAIL_CLASS =
  "-mx-3 flex snap-x snap-mandatory scroll-pl-3 scroll-pr-3 gap-4 overflow-x-auto overscroll-x-contain px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 md:scroll-pl-0 md:scroll-pr-0";

const PHONE_CARD_WIDTH_CLASS = "w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[52vw] sm:max-w-[300px] md:!w-auto md:!max-w-none md:shrink";

type NewsRow = {
  id: string;
  title: string;
  category: string;
  date: string;
  href: string;
  art: NewsCardArtDescriptor;
};

function SpineCardMenuIcon() {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
    const id = window.setInterval(() => {
      playerRef.current?.playFromBeginning();
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="inline-flex rotate-90 text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]">
      <Player ref={playerRef} icon={menuLordicon} size={88} colorize="#ffffff" />
    </span>
  );
}

function NewsCardIconOverlay({ row }: { row: NewsRow }) {
  if (row.id !== "spine-ships-testflight") return null;
  return <SpineCardMenuIcon />;
}

function RecentNewsBentoCompact({ row, className }: { row: NewsRow; className?: string }) {
  return (
    <TopNavAnchor
      href={row.href}
      className={cn(
        "group flex w-full min-w-0 flex-col bg-transparent transition-opacity hover:opacity-90",
        className,
      )}
    >
      <div className="aspect-square w-full shrink-0 overflow-hidden" aria-hidden>
        <NewsCardArt {...row.art} className="size-full">
          <NewsCardIconOverlay row={row} />
        </NewsCardArt>
      </div>
      <div className="flex shrink-0 flex-col gap-1.5 pt-3 sm:pt-3">
        <h3 className="line-clamp-3 font-sans text-[15px] font-semibold leading-[1.2] tracking-[0em] text-light-space light:text-zinc-950 sm:text-lg sm:leading-[1.2]">
          {row.title}
        </h3>
        <p className="font-sans text-[12px] leading-tight tracking-[0em] sm:text-[13px]">
          <span className="text-light-space light:text-zinc-900">{row.category}</span>
          <span className="text-light-space/30 light:text-zinc-300"> · </span>
          <span className="text-light-space/45 light:text-zinc-500">{row.date}</span>
        </p>
      </div>
    </TopNavAnchor>
  );
}

function NewsWallCard({ row }: { row: NewsRow }) {
  return (
    <TopNavAnchor
      href={row.href}
      className="group flex items-start gap-4 bg-transparent transition-opacity hover:opacity-90"
    >
      <div className="size-[120px] shrink-0 overflow-hidden rounded-lg sm:size-[140px]" aria-hidden>
        <NewsCardArt {...row.art} className="size-full">
          <NewsCardIconOverlay row={row} />
        </NewsCardArt>
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 pt-1">
        <h3 className="line-clamp-2 font-sans text-[15px] font-semibold leading-[1.25] tracking-[0em] text-light-space light:text-zinc-950 sm:text-base">
          {row.title}
        </h3>
        <p className="font-sans text-[12px] leading-tight tracking-[0em] sm:text-[13px]">
          <span className="text-light-space light:text-zinc-900">{row.category}</span>
          <span className="text-light-space/30 light:text-zinc-300"> · </span>
          <span className="text-light-space/45 light:text-zinc-500">{row.date}</span>
        </p>
      </div>
    </TopNavAnchor>
  );
}

export function RecentNewsSection() {
  const allCards = useMemo(
    () =>
      [...NEWS_ITEMS]
        .sort(
          (a, b) =>
            new Date(b.publishedAt + "T12:00:00").getTime() -
            new Date(a.publishedAt + "T12:00:00").getTime(),
        )
        .map((n) => ({
          id: n.id,
          title: n.title,
          category: n.category,
          date: formatNewsDate(n.publishedAt),
          href: getNewsHref(n),
          art: getNewsCardArt(n),
        })),
    [],
  );

  const pinnedIdx = useMemo(
    () =>
      NEWS_ITEMS.findIndex((n) => n.pinFeatured) >= 0
        ? allCards.findIndex(
            (c) => c.id === NEWS_ITEMS.find((n) => n.pinFeatured)!.id,
          )
        : -1,
    [allCards],
  );
  const featured = pinnedIdx >= 0 ? allCards[pinnedIdx] : allCards[0];
  const rest = pinnedIdx >= 0 ? allCards.filter((_, i) => i !== pinnedIdx) : allCards.slice(1);
  const secondaryCards = rest.slice(0, 3);
  const wallCards = rest.slice(3);

  return (
    <section id="newsroom" className="scroll-mt-24 bg-dark-space px-0 py-16 light:bg-white md:px-8 md:py-20">
      <div className={CONTENT_SHELL_WIDE}>
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-sans text-lg font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-xl">Newsroom</h2>
          <Link
            to="/newsroom"
            className="shrink-0 font-sans text-sm font-semibold text-light-space transition-colors hover:text-light-space/88 light:text-zinc-950 light:hover:text-zinc-800"
          >
            View more
          </Link>
        </div>
        {featured ? (
          <div className="space-y-6 md:space-y-8 lg:space-y-0">
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 xl:gap-8">
              <div className="min-w-0">
                <div className="lg:sticky lg:top-16">
                  <TopNavAnchor
                    href={featured.href}
                    className="group flex flex-col bg-transparent transition-opacity hover:opacity-90"
                  >
                    <div
                      className="aspect-square w-full overflow-hidden md:aspect-[16/8.5] lg:aspect-[16/10]"
                      aria-hidden
                    >
                      <NewsCardArt
                        {...featured.art}
                        overlayClassName={
                          featured.art.overlayClassName ?? "w-[min(36%,260px)] md:w-[min(28%,300px)]"
                        }
                        className="size-full"
                      >
                        <NewsCardIconOverlay row={featured} />
                      </NewsCardArt>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-5 sm:pt-5">
                      <h3 className="font-sans text-xl font-semibold leading-[1.15] tracking-[0em] text-light-space light:text-zinc-950 sm:text-2xl lg:text-[1.65rem] lg:leading-[1.12]">
                        {featured.title}
                      </h3>
                      <p className="font-sans text-[12px] leading-tight tracking-[0em] sm:text-[13px]">
                        <span className="text-light-space light:text-zinc-900">{featured.category}</span>
                        <span className="text-light-space/30 light:text-zinc-300"> · </span>
                        <span className="text-light-space/45 light:text-zinc-500">{featured.date}</span>
                      </p>
                    </div>
                  </TopNavAnchor>
                </div>
              </div>

              {secondaryCards.length > 0 ? (
                <div className="mt-6 hidden flex-col gap-4 self-start lg:mt-0 lg:flex lg:w-[320px] lg:gap-4">
                  {secondaryCards.map((row) => (
                    <RecentNewsBentoCompact key={`desktop-${row.id}`} row={row} />
                  ))}
                </div>
              ) : null}
            </div>

            {secondaryCards.length > 0 ? (
              <div
                className={cn(
                  "mt-6 lg:hidden",
                  PHONE_CARD_RAIL_CLASS,
                  secondaryCards.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
                  "md:gap-6 xl:gap-8",
                )}
              >
                {secondaryCards.map((row) => (
                  <div key={`grid-${row.id}`} className={PHONE_CARD_WIDTH_CLASS}>
                    <RecentNewsBentoCompact row={row} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {wallCards.length > 0 ? (
          <div className="mt-12 pt-10 md:mt-16 md:pt-12">
            <h3 className="mb-8 font-sans text-lg font-semibold tracking-[0em] text-light-space light:text-zinc-950">
              Recent news
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              {wallCards.map((row) => (
                <NewsWallCard key={`wall-${row.id}`} row={row} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
