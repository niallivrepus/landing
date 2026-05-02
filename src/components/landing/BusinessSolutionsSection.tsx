import { cn } from "@jokuh/gooey";
import { BUSINESS_SOLUTIONS, type BusinessSolutionCard } from "../../data/business-overview";
import { NewsCardArt } from "../NewsCardArt";
import { SiteLink } from "../SiteLink";
import { EDITORIAL_MEDIA_RADIUS_CLASS } from "../system";
import { SectionHeaderRow } from "../system/sections";
import { CONTENT_SHELL_WIDE } from "../system/shells";

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
        <div className="mt-3 flex flex-1 flex-col gap-1.5 pt-0.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-light-space/45 light:text-zinc-500">
            {card.tag}
          </p>
          <h3 className="font-sans text-[0.9375rem] font-semibold leading-snug tracking-[0em] text-light-space transition-colors group-hover:text-light-space/80 light:text-zinc-950 md:text-[0.95rem]">
            {card.title}
          </h3>
        </div>
      </SiteLink>
    </article>
  );
}

export function BusinessSolutionsSection() {
  return (
    <section
      id="business"
      className="scroll-mt-24 bg-dark-space px-4 py-16 light:bg-white md:px-8 md:py-20"
    >
      <div className={CONTENT_SHELL_WIDE}>
        <SectionHeaderRow title="Jokuh for Business" actionLabel="Overview" actionTo="/business" />
        <div className="mt-0 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6 xl:gap-8">
          {BUSINESS_SOLUTIONS.map((card) => (
            <SolutionCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
