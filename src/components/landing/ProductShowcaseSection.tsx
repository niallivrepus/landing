import { cn } from "@jokuh/gooey";
import { SiteLink } from "../SiteLink";
import { SectionHeaderRow } from "../system/sections";
import { SquircleMedia } from "../system/squircle";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { LANDING_SHELL_PRODUCT_SLIDES } from "../../data/landing-shell-preview";
import { PRODUCTS, type ProductId } from "../../data/products";

const PHONE_CARD_RAIL_CLASS =
  "-mx-3 flex snap-x snap-mandatory scroll-pl-3 scroll-pr-3 gap-4 overflow-x-auto overscroll-x-contain px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 md:scroll-pl-0 md:scroll-pr-0";

const PHONE_CARD_WIDTH_CLASS =
  "w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[52vw] sm:max-w-[300px] md:!w-auto md:!max-w-none md:shrink";

type ShowcaseCard = { id: ProductId; href: string; image: string };

const SHOWCASE_CARDS = LANDING_SHELL_PRODUCT_SLIDES.map((slide) => ({
  id: slide.id as ProductId,
  href: `/${slide.id}`,
  image: slide.image,
}));

function ProductCard({ card }: { card: ShowcaseCard }) {
  const product = PRODUCTS[card.id];

  return (
    <article className="group flex h-full flex-col">
      <SiteLink href={card.href} className="flex h-full flex-col no-underline">
        <SquircleMedia className="aspect-square">
          <img
            src={card.image}
            alt={product.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </SquircleMedia>
        <div className="mt-3 flex flex-1 flex-col gap-1.5 pt-0.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-light-space/45 light:text-zinc-500">
            {product.title}
          </p>
          <h3 className="font-sans text-[0.9375rem] font-semibold leading-snug tracking-[0em] text-light-space transition-colors group-hover:text-light-space/80 light:text-zinc-950 md:text-[0.95rem]">
            {product.summary}
          </h3>
        </div>
      </SiteLink>
    </article>
  );
}

export function ProductShowcaseSection() {
  return (
    <section
      id="product"
      className="scroll-mt-24 bg-dark-space px-4 py-16 light:bg-white md:px-8 md:py-20"
    >
      <div className={CONTENT_SHELL_WIDE}>
        <SectionHeaderRow title="One machine, five ways in" actionLabel="See everything" actionTo="/calls" />
        <div className={cn("mt-0 md:grid-cols-5 md:gap-6 xl:gap-8", PHONE_CARD_RAIL_CLASS)}>
          {SHOWCASE_CARDS.map((card) => (
            <div key={card.id} className={PHONE_CARD_WIDTH_CLASS}>
              <ProductCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
