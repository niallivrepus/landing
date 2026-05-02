import { cn } from "@jokuh/gooey";
import { ChevronRight } from "lucide-react";
import {
  BUSINESS_FEATURE_BLOCKS,
  BUSINESS_HERO,
  BUSINESS_QUOTE,
  BUSINESS_RESOURCES_CTA,
  BUSINESS_SOLUTIONS,
  BUSINESS_SOLUTIONS_HEADING,
  type BusinessFeatureBlock,
  type BusinessSolutionCard,
} from "../data/business-overview";
import { NewsCardArt } from "../components/NewsCardArt";
import { SiteLink } from "../components/SiteLink";
import {
  EDITORIAL_MEDIA_RADIUS_CLASS,
  EditorialQuoteBlock,
  PillLink,
  TertiaryPageChrome,
  pageHeroEyebrowClass,
  proseBodyMutedClass,
} from "../components/system";
import { CONTENT_SHELL_COMPANY, CONTENT_SHELL_WIDE } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function InlineCta({
  href,
  children,
  trailing = "arrow",
}: {
  href: string;
  children: string;
  trailing?: "arrow" | "chevron";
}) {
  return (
    <SiteLink
      href={href}
      className="group/cta inline-flex items-center gap-1 font-sans text-[13.5px] font-medium text-light-space underline-offset-4 transition-colors hover:text-white hover:underline light:text-zinc-950 light:hover:text-black"
    >
      {children}
      {trailing === "arrow" ? (
        <span aria-hidden>↗</span>
      ) : (
        <ChevronRight
          className="size-3.5 translate-x-0 text-current transition-transform group-hover/cta:translate-x-0.5"
          strokeWidth={2.2}
          aria-hidden
        />
      )}
    </SiteLink>
  );
}

function SolutionCard({ card }: { card: BusinessSolutionCard }) {
  return (
    <article className="group flex h-full flex-col">
      <SiteLink href={card.href} className="flex h-full flex-col no-underline">
        <div
          className={cn(
            "aspect-square overflow-hidden border border-light-space/[0.08] bg-white/[0.03] light:border-black/[0.08] light:bg-section-grey-light/80",
            EDITORIAL_MEDIA_RADIUS_CLASS,
          )}
        >
          <NewsCardArt gradient={card.gradient} lavaLamp={card.lavaLamp} className="size-full" />
        </div>
        <div className="mt-4 flex flex-1 flex-col gap-1.5">
          <h3 className="font-sans text-[15px] font-semibold leading-snug tracking-[0em] text-light-space transition-colors group-hover:text-light-space/80 light:text-zinc-950">
            {card.title}
          </h3>
          <p className="font-sans text-[13px] font-semibold text-light-space/45 light:text-zinc-500">{card.tag}</p>
        </div>
      </SiteLink>
    </article>
  );
}

function FeatureBlockMedia({ block, className }: { block: BusinessFeatureBlock; className?: string }) {
  return (
    <figure className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "aspect-square overflow-hidden border border-light-space/[0.08] bg-white/[0.03] light:border-black/[0.08] light:bg-section-grey-light/80",
          EDITORIAL_MEDIA_RADIUS_CLASS,
        )}
      >
        <NewsCardArt
          gradient="linear-gradient(135deg, #111113 0%, #232326 100%)"
          lavaLamp={block.lavaLamp}
          className="size-full"
        />
      </div>
    </figure>
  );
}

export function BusinessOverviewPage() {
  useDocumentTitle("Jokuh Business");

  return (
    <TertiaryPageChrome>
      <main>
        {/* Hero */}
        <section className={cn(CONTENT_SHELL_COMPANY, "pt-20 pb-12 text-center md:pt-24 md:pb-16")}>
          <p className={pageHeroEyebrowClass}>{BUSINESS_HERO.eyebrow}</p>
          <h1 className="mx-auto mt-5 max-w-[20ch] font-sans text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.005em] text-light-space light:text-zinc-950">
            {BUSINESS_HERO.title}
          </h1>
          <p className="mx-auto mt-7 max-w-[36rem] text-balance text-pretty font-sans text-[16px] leading-[1.6] text-light-space/64 light:text-zinc-600 md:text-[17px]">
            {BUSINESS_HERO.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <PillLink href={BUSINESS_HERO.primary.href} variant="primary">
              {BUSINESS_HERO.primary.label}
            </PillLink>
            <PillLink href={BUSINESS_HERO.secondary.href}>{BUSINESS_HERO.secondary.label}</PillLink>
          </div>
        </section>

        {/* Solutions section header */}
        <section className={cn(CONTENT_SHELL_WIDE, "pt-8 pb-2 md:pt-12 md:pb-4")}>
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="font-sans text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight tracking-[0em] text-light-space light:text-zinc-950">
              {BUSINESS_SOLUTIONS_HEADING.title}
            </h2>
            <SiteLink
              href={BUSINESS_SOLUTIONS_HEADING.actionHref}
              className="inline-flex shrink-0 items-center gap-1 font-sans text-[13.5px] font-medium text-light-space transition-colors hover:text-light-space/80 light:text-zinc-950 light:hover:text-zinc-700"
            >
              {BUSINESS_SOLUTIONS_HEADING.actionLabel}
              <ChevronRight className="size-3.5" strokeWidth={2.2} aria-hidden />
            </SiteLink>
          </div>
        </section>

        {/* Platform grid */}
        <section className={cn(CONTENT_SHELL_WIDE, "pt-8 pb-20 text-center md:pt-12 md:pb-28")}>
          <div className="grid grid-cols-2 gap-5 text-left sm:grid-cols-4 sm:gap-6 xl:gap-8">
            {BUSINESS_SOLUTIONS.map((card) => (
              <SolutionCard key={card.title} card={card} />
            ))}
          </div>
        </section>

        {/* Alternating feature blocks */}
        <section className={cn(CONTENT_SHELL_COMPANY, "py-4 md:py-8")}>
          {BUSINESS_FEATURE_BLOCKS.map((block, index) => {
            const imageLeft = index % 2 === 1;
            return (
              <article
                key={block.id}
                className={cn(
                  "grid gap-10 py-16 md:items-center md:gap-16 md:py-20",
                  imageLeft ? "md:grid-cols-[1.05fr_0.95fr]" : "md:grid-cols-[0.95fr_1.05fr]",
                )}
              >
                <div className={cn(imageLeft && "md:order-2")}>
                  <h2 className="max-w-[24ch] font-sans text-[24px] font-semibold leading-[1.18] tracking-[0em] text-light-space light:text-zinc-950 md:text-[28px]">
                    {block.title}
                  </h2>
                  <ul className="mt-6 list-disc space-y-3 pl-5 marker:text-light-space/40 light:marker:text-zinc-400">
                    {block.bullets.map((bullet) => (
                      <li key={bullet} className={cn(proseBodyMutedClass, "max-w-none leading-[1.6]")}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {block.links.map((link) => (
                      <InlineCta key={link.label} href={link.href} trailing={link.trailing}>
                        {link.label}
                      </InlineCta>
                    ))}
                  </div>
                </div>
                <FeatureBlockMedia block={block} className={cn(imageLeft && "md:order-1")} />
              </article>
            );
          })}
        </section>

        {/* Editorial quote */}
        <EditorialQuoteBlock text={BUSINESS_QUOTE.text} attribution={BUSINESS_QUOTE.attribution} />

        {/* Closing card */}
        <section className={cn(CONTENT_SHELL_WIDE, "pb-24 md:pb-32")}>
          <div className="rounded-[6px] bg-white/[0.04] px-6 py-20 text-center light:bg-section-grey-light md:px-10 md:py-24">
            <h2 className="mx-auto max-w-[760px] text-balance font-sans text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-[0em] text-light-space light:text-zinc-950">
              {BUSINESS_RESOURCES_CTA.headline}
            </h2>
            <div className="mt-8 flex justify-center">
              <PillLink href={BUSINESS_RESOURCES_CTA.buttonHref}>{BUSINESS_RESOURCES_CTA.buttonLabel}</PillLink>
            </div>
          </div>
        </section>
      </main>
    </TertiaryPageChrome>
  );
}
