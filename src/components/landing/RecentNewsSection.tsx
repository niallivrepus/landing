import { cn } from "@jokuh/gooey";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { NewsCardArt } from "../NewsCardArt";
import { TopNavAnchor } from "../TopNavAnchor";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { DEFAULT_NEWS_CARD_GRADIENT, NEWS_ITEMS, formatNewsDate, getNewsHref } from "../../data/news";

type NewsRow = {
  id: string;
  title: string;
  category: string;
  date: string;
  href: string;
  gradient: string;
  image?: string;
};

function RecentNewsBentoCompact({ row, className }: { row: NewsRow; className?: string }) {
  return (
    <TopNavAnchor
      href={row.href}
      className={cn(
        "group flex w-full max-w-[320px] flex-col bg-transparent transition-opacity hover:opacity-90 lg:max-w-none",
        className,
      )}
    >
      <div className="aspect-square w-full shrink-0 overflow-hidden" aria-hidden>
        <NewsCardArt gradient={row.gradient} image={row.image} className="size-full" />
      </div>
      <div className="flex shrink-0 flex-col gap-1.5 pt-3 sm:pt-3">
        <h3 className="line-clamp-3 font-sans text-[15px] font-semibold leading-[1.2] tracking-[-0.02em] text-light-space">
          {row.title}
        </h3>
        <p className="font-sans text-[12px] leading-tight tracking-[-0.01em]">
          <span className="text-light-space">{row.category}</span>
          <span className="text-light-space/30"> · </span>
          <span className="text-light-space/45">{row.date}</span>
        </p>
      </div>
    </TopNavAnchor>
  );
}

export function RecentNewsSection() {
  const rows = useMemo(
    () =>
      [...NEWS_ITEMS]
        .sort(
          (a, b) =>
            new Date(b.publishedAt + "T12:00:00").getTime() -
            new Date(a.publishedAt + "T12:00:00").getTime(),
        )
        .slice(0, 4)
        .map((n) => ({
          id: n.id,
          title: n.title,
          category: n.category,
          date: formatNewsDate(n.publishedAt),
          href: getNewsHref(n),
          gradient: n.cardGradient?.trim() || DEFAULT_NEWS_CARD_GRADIENT,
          image: n.cardImage,
        })),
    [],
  );

  const featured = rows[0];
  const rest = rows.slice(1);

  return (
    <section id="newsroom" className="scroll-mt-24 bg-dark-space px-4 py-16 md:px-8 md:py-20">
      <div className={CONTENT_SHELL_WIDE}>
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-sans text-lg font-semibold tracking-tight text-light-space md:text-xl">Newsroom</h2>
          <Link
            to="/newsroom"
            className="shrink-0 font-sans text-sm font-semibold text-light-space transition-colors hover:text-light-space/88 light:text-zinc-950 light:hover:text-zinc-800"
          >
            View more
          </Link>
        </div>
        {featured ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch lg:gap-6 xl:gap-8">
            <div className="min-w-0">
              <div className="lg:sticky lg:top-28">
                <TopNavAnchor
                  href={featured.href}
                  className="group flex flex-col bg-transparent transition-opacity hover:opacity-90"
                >
                  <div
                    className="h-[min(580px,calc(100vw-2rem))] w-full shrink-0 overflow-hidden md:h-[min(580px,calc(100vw-4rem))]"
                    aria-hidden
                  >
                    <NewsCardArt gradient={featured.gradient} image={featured.image} />
                  </div>
                  <div className="flex flex-col gap-1.5 pt-5 sm:pt-5">
                    <h3 className="font-sans text-xl font-semibold leading-[1.15] tracking-[-0.03em] text-light-space sm:text-2xl lg:text-[1.65rem] lg:leading-[1.12]">
                      {featured.title}
                    </h3>
                    <p className="font-sans text-[12px] leading-tight tracking-[-0.01em] sm:text-[13px]">
                      <span className="text-light-space">{featured.category}</span>
                      <span className="text-light-space/30"> · </span>
                      <span className="text-light-space/45">{featured.date}</span>
                    </p>
                  </div>
                </TopNavAnchor>
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-4 sm:gap-4 lg:w-[320px] lg:shrink-0 lg:items-stretch">
              {rest.map((row) => (
                <RecentNewsBentoCompact key={row.id} row={row} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
