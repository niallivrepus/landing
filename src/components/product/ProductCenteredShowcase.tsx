import { Link } from "react-router-dom";
import { ProductSectionIntro, ProductShowcaseSurface, ProductStorySection } from "./ProductDetailPrimitives";

export function ProductCenteredShowcase({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaTo,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  ctaTo?: string;
}) {
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
        </div>
      </ProductShowcaseSurface>
    </ProductStorySection>
  );
}
