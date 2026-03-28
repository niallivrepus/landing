import { cn } from "@jokuh/gooey";
import { SiteLink } from "../components/SiteLink";
import { CONTENT_SHELL_WIDE, EDITORIAL_MEDIA_RADIUS_CLASS, MarketingPageFrame } from "../components/system";
import { DEVELOPER_BLOG_ENTRIES, type DeveloperBlogEntry } from "../data/developer-blog";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function formatDeveloperBlogDate(iso: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}

function DeveloperBlogMeta({ item }: { item: DeveloperBlogEntry }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.16em] text-light-space/46 light:text-zinc-500">
      <span className="text-light-space/72 light:text-zinc-700">{item.tag}</span>
      <span className="text-light-space/25 light:text-zinc-300">•</span>
      <span>{formatDeveloperBlogDate(item.publishedAt)}</span>
      <span className="text-light-space/25 light:text-zinc-300">•</span>
      <span>{item.readMinutes} min read</span>
    </p>
  );
}

function DeveloperBlogCard({
  item,
  featured = false,
}: {
  item: DeveloperBlogEntry;
  featured?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col">
      <SiteLink href={item.href} className="flex h-full flex-col no-underline">
        <div
          className={cn(
            "overflow-hidden border border-light-space/[0.08] bg-white/[0.03] light:border-black/[0.08] light:bg-zinc-50",
            EDITORIAL_MEDIA_RADIUS_CLASS,
            featured ? "aspect-[16/10]" : "aspect-[4/5] sm:aspect-[4/4.6]",
          )}
        >
          <img
            src={item.image}
            alt=""
            className={cn("size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]", EDITORIAL_MEDIA_RADIUS_CLASS)}
          />
        </div>
        <div className={cn("flex flex-1 flex-col", featured ? "gap-4 pt-5" : "gap-3 pt-4")}>
          <DeveloperBlogMeta item={item} />
          <h2
            className={cn(
              "font-sans font-semibold leading-[1.04] tracking-[-0.03em] text-light-space transition-colors group-hover:text-light-space/82 light:text-zinc-950 light:group-hover:text-zinc-700",
              featured ? "text-[2rem] md:text-[2.6rem]" : "text-[1.2rem] md:text-[1.45rem]",
            )}
          >
            {item.title}
          </h2>
          {featured ? (
            <p className="max-w-2xl text-[15px] leading-7 text-light-space/58 light:text-zinc-600 md:text-[16px]">
              {item.excerpt}
            </p>
          ) : null}
        </div>
      </SiteLink>
    </article>
  );
}

export function DeveloperBlogPage() {
  useDocumentTitle("Developer Blog — Jokuh");

  const [featured, ...rest] = DEVELOPER_BLOG_ENTRIES;
  const support = rest.slice(0, 3);
  const remainder = rest.slice(3);

  return (
    <MarketingPageFrame theme="dark" mainClassName="pt-20 md:pt-24">
      <div className={cn(CONTENT_SHELL_WIDE, "pb-18 md:pb-24")}>
        <header className="border-b border-light-space/[0.08] pb-10 light:border-black/[0.08] md:pb-12">
          <div className="max-w-[760px]">
            <p className="font-sans text-[12px] font-medium tracking-[0.12em] text-light-space/45 uppercase light:text-zinc-500">
              Developers
            </p>
            <h1 className="mt-3 font-sans text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-light-space light:text-zinc-950">
              Developer Blog
            </h1>
            <p className="mt-5 max-w-[58ch] text-[16px] leading-[1.75] text-light-space/58 light:text-zinc-600 md:text-[18px]">
              Notes on the Jokuh SDK, docs direction, integration patterns, and the product decisions behind the
              developer surface.
            </p>
          </div>
        </header>

        {featured ? (
          <section className="pt-10 md:pt-12">
            <div className="space-y-6 md:space-y-8 lg:space-y-0">
              <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 xl:gap-8">
                <div className="min-w-0">
                  <DeveloperBlogCard item={featured} featured />
                </div>
                {support.length > 0 ? (
                  <div className="mt-6 hidden flex-col gap-4 self-start lg:mt-0 lg:flex lg:w-[320px] lg:gap-4">
                    {support.map((item) => (
                      <DeveloperBlogCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : null}
              </div>

              {support.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
                  {support.map((item) => (
                    <DeveloperBlogCard key={`mobile-${item.id}`} item={item} />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {remainder.length > 0 ? (
          <section className="mt-12 border-t border-light-space/[0.08] pt-10 light:border-black/[0.08] md:mt-16 md:pt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {remainder.map((item) => (
                <DeveloperBlogCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </MarketingPageFrame>
  );
}
