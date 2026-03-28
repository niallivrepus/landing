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
      <ProductShowcaseSurface className="relative bg-zinc-100 px-6 py-16 dark:bg-black md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto flex min-h-[34rem] max-w-[38rem] items-center justify-center text-center">
          <div>
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
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 font-sans text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
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
