import type { ProductCenterpieceItem } from "../../data/product-detail-blueprints";
import { ProductDetailMedia } from "./ProductDetailMedia";
import { Link } from "react-router-dom";
import { ProductSectionIntro, ProductShowcaseSurface, ProductStorySection } from "./ProductDetailPrimitives";

export function ProductCenteredShowcase({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaTo,
  items,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  ctaTo?: string;
  items: ProductCenterpieceItem[];
}) {
  const featuredItem = items[0] ?? null;

  return (
    <ProductStorySection>
      <ProductShowcaseSurface className="relative bg-[#F5F5F7] px-6 py-16 dark:bg-[#1C1C1E] md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto flex min-h-[34rem] max-w-[42rem] flex-col items-center justify-center text-center">
          <div className="relative z-10">
            <ProductSectionIntro
              eyebrow={eyebrow}
              title={title}
              body={body}
              align="center"
              tone="light"
            />
            {ctaLabel && ctaTo ? (
              <div className="mt-8 flex justify-center">
                <Link
                  to={ctaTo}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-[#F5F5F7] px-5 font-sans text-sm font-semibold text-zinc-900 transition-colors hover:bg-white dark:border-white/[0.08] dark:bg-[#2A2A2D] dark:text-zinc-100 dark:hover:bg-[#323236]"
                >
                  {ctaLabel}
                </Link>
              </div>
            ) : null}
          </div>
          {featuredItem ? (
            <div className="relative z-10 mt-10 w-full max-w-[28rem]">
              <div className="overflow-hidden rounded-[28px] border border-zinc-200/90 bg-[#F5F5F7] shadow-[0_22px_48px_rgba(15,23,42,0.08)] dark:border-white/[0.08] dark:bg-[#232326]/88 dark:shadow-[0_22px_48px_rgba(0,0,0,0.36)]">
                <div className="aspect-[4/3] w-full">
                  <ProductDetailMedia media={featuredItem.media} className="size-full" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </ProductShowcaseSurface>
    </ProductStorySection>
  );
}
