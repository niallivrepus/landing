import { ProductCenteredShowcase } from "../components/product/ProductCenteredShowcase";
import { ProductCloserLookExplorer } from "../components/product/ProductCloserLookExplorer";
import { ProductHighlightsCarousel } from "../components/product/ProductHighlightsCarousel";
import { ClaimIdentityCta } from "../components/landing/ClaimIdentityCta";
import { FaqSection } from "../components/FaqSection";
import { MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { PRODUCT_DETAIL_BLUEPRINTS } from "../data/product-detail-blueprints";
import { PRODUCTS, type ProductId } from "../data/products";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { cn, useTheme } from "@jokuh/gooey";
import { Link } from "react-router-dom";

export function ProductPage({ productId }: { productId: ProductId }) {
  const product = PRODUCTS[productId];
  const detail = PRODUCT_DETAIL_BLUEPRINTS[productId];
  const heroSentence = product.summary.match(/^[^.]+\./)?.[0] ?? product.summary;
  const { resolvedTheme } = useTheme();

  useDocumentTitle(`${product.title} · Jokuh`);

  return (
    <MarketingPageFrame
      withAntialiased
      withFontSans
      theme={resolvedTheme === "light" ? "light" : "dark"}
    >
      <section className="flex min-h-[100svh] flex-col pt-24 pb-6 md:pt-28 md:pb-8">
        <div className={cn(CONTENT_SHELL_WIDE, "flex flex-col items-center py-[40px] text-center")}>
          <h1 className="max-w-[min(100%,920px)] text-[clamp(2rem,5vw,3.9rem)] font-semibold leading-[1.02] tracking-[0em] text-zinc-950 dark:text-light-space">
            {heroSentence}
          </h1>
          <div className="mt-8">
            <ClaimIdentityCta href="/download">Build profile</ClaimIdentityCta>
          </div>
        </div>

      </section>

      <ProductHighlightsCarousel {...detail.highlights} />
      <ProductCloserLookExplorer {...detail.closerLook} />
      <ProductCenteredShowcase {...detail.centerpiece} />

      <div className={cn(CONTENT_SHELL_WIDE, "py-20 md:py-28")}>
        <FaqSection
          items={[
            {
              question: `What is ${product.title}?`,
              answer: product.summary,
            },
            {
              question: "How do I get started?",
              answer: "Join the waitlist to get early access. Once you're in, you can start using the product immediately with our guided onboarding.",
            },
            {
              question: "Is there a free tier?",
              answer: "We'll share pricing details closer to launch. Join the waitlist to be the first to know about plans and early-access offers.",
            },
            {
              question: "What platforms are supported?",
              answer: "Jokuh is designed to work across web, desktop, and mobile. Platform-specific details will be shared as we approach general availability.",
            },
            {
              question: "How does Jokuh handle my data?",
              answer: "Privacy is foundational to how we build. Your data is encrypted in transit and at rest, and you retain full control over retention and deletion.",
            },
          ]}
        />
      </div>

      <div className="px-4 py-10 text-center font-sans text-[13px] text-zinc-500 dark:text-light-space/40 md:px-8">
        <Link
          to={`/#${productId}`}
          className="underline-offset-4 hover:text-zinc-950 hover:underline dark:hover:text-light-space"
        >
          On the home overview
        </Link>
        <span className="text-zinc-300 dark:text-light-space/20"> · </span>
        <Link
          to="/about"
          className="underline-offset-4 hover:text-zinc-950 hover:underline dark:hover:text-light-space"
        >
          What Jokuh is building
        </Link>
      </div>
    </MarketingPageFrame>
  );
}
