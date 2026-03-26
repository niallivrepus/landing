import { ProductCenteredShowcase } from "../components/product/ProductCenteredShowcase";
import { ProductCloserLookExplorer } from "../components/product/ProductCloserLookExplorer";
import { ProductFullBleedReveal } from "../components/product/ProductFullBleedReveal";
import { ProductHighlightsCarousel } from "../components/product/ProductHighlightsCarousel";
import { TryJokuhCta } from "../components/SiteTopBar";
import { MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { PRODUCT_DETAIL_BLUEPRINTS } from "../data/product-detail-blueprints";
import { PRODUCTS, type ProductId } from "../data/products";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { cn } from "@jokuh/gooey";
import { Link } from "react-router-dom";

export function ProductPage({ productId }: { productId: ProductId }) {
  const product = PRODUCTS[productId];
  const detail = PRODUCT_DETAIL_BLUEPRINTS[productId];
  const heroSentence = product.summary.match(/^[^.]+\./)?.[0] ?? product.summary;

  useDocumentTitle(`${product.title} — Jokuh`);

  return (
    <MarketingPageFrame withAntialiased withFontSans>
      <section className="pt-24 pb-10 md:pt-28 md:pb-16">
        <div className={cn(CONTENT_SHELL_WIDE, "flex flex-col items-center text-center")}>
          <span className="inline-flex items-center rounded-full border border-light-space/[0.08] bg-white/[0.03] px-3 py-1 font-sans text-[11px] font-semibold tracking-[0.12em] text-light-space/48 uppercase">
            {product.title}
          </span>
          <h1 className="mt-5 max-w-[min(100%,920px)] text-[clamp(2rem,5vw,3.9rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-light-space">
            {heroSentence}
          </h1>
          <div className="mt-8">
            <TryJokuhCta />
          </div>
        </div>

        <div className={cn(CONTENT_SHELL_WIDE, "mt-14 md:mt-20")}>
          <div className="relative overflow-hidden rounded-[32px] border border-light-space/[0.08] bg-[#f8f8f8] shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
            <div className="aspect-[1086/1153] max-h-[70vh] w-full bg-[#f8f8f8]" />
          </div>
        </div>
      </section>

      <ProductHighlightsCarousel {...detail.highlights} />
      <ProductCloserLookExplorer {...detail.closerLook} />
      <ProductCenteredShowcase {...detail.centerpiece} />
      <ProductFullBleedReveal {...detail.reveal} />

      <div className="border-t border-light-space/[0.06] px-4 py-10 text-center font-sans text-[13px] text-light-space/40 md:px-8">
        <Link to={`/#${productId}`} className="underline-offset-4 hover:text-light-space hover:underline">
          On the home overview
        </Link>
        <span className="text-light-space/20"> · </span>
        <Link to="/about" className="underline-offset-4 hover:text-light-space hover:underline">
          What Jokuh is building
        </Link>
      </div>
    </MarketingPageFrame>
  );
}
