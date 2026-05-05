import { cn } from "@jokuh/gooey";
import { BUSINESS_SOLUTIONS, type BusinessSolutionCard } from "../../data/business-overview";
import { NewsCardArt } from "../NewsCardArt";
import { SiteLink } from "../SiteLink";
import { EDITORIAL_MEDIA_RADIUS_CLASS } from "../system";
import { SectionHeaderRow } from "../system/sections";
import { CONTENT_SHELL_WIDE } from "../system/shells";

const PHONE_CARD_RAIL_CLASS =
  "-mx-3 flex snap-x snap-mandatory scroll-pl-3 scroll-pr-3 gap-4 overflow-x-auto overscroll-x-contain px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 md:scroll-pl-0 md:scroll-pr-0";

const PHONE_CARD_WIDTH_CLASS = "w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[52vw] sm:max-w-[300px] md:!w-auto md:!max-w-none md:shrink";

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
          <NewsCardArt
            gradient={card.gradient}
            lavaLamp={card.lavaLamp}
            image={card.image}
            imageClassName={card.imageClassName}
            className="size-full"
          />
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
        <div className={cn("mt-0 md:grid-cols-4 md:gap-6 xl:gap-8", PHONE_CARD_RAIL_CLASS)}>
          {BUSINESS_SOLUTIONS.map((card) => (
            <div key={card.title} className={PHONE_CARD_WIDTH_CLASS}>
              <SolutionCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
