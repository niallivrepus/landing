import { Link } from "react-router-dom";
import { cn } from "@jokuh/gooey";
import { ProductSectionIntro, ProductShowcaseSurface, ProductStorySection } from "./ProductDetailPrimitives";

export function ProductCenteredShowcase({
  title,
  body,
  ctaLabel,
  ctaTo,
  backgroundImage,
  surfaceTone = "default",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  ctaTo?: string;
  backgroundImage?: string;
  surfaceTone?: "default" | "neutral";
}) {
  return (
    <ProductStorySection>
      <ProductShowcaseSurface
        className={cn(
          "relative bg-[#FBFBFC] px-6 py-16 md:px-8 md:py-20 lg:px-12",
          surfaceTone === "neutral" ? "dark:bg-[#FBFBFC]" : "dark:bg-[#1C1C1E]",
        )}
      >
        {backgroundImage ? (
          <>
            <img
              src={backgroundImage}
              alt=""
              aria-hidden
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/20" aria-hidden />
          </>
        ) : null}
        <div className="mx-auto flex min-h-[34rem] max-w-[42rem] flex-col items-center justify-center text-center">
          <div className="relative z-10">
            <ProductSectionIntro
              title={title}
              body={body}
              align="center"
              tone="light"
              className={backgroundImage ? "[&_h2]:!text-white [&_p]:!text-white/75" : undefined}
            />
            {ctaLabel && ctaTo ? (
              <div className="mt-8 flex justify-center">
                <Link
                  to={ctaTo}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 font-sans text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
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
