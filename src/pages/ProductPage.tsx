import { ProductCenteredShowcase } from "../components/product/ProductCenteredShowcase";
import { ProductCloserLookExplorer } from "../components/product/ProductCloserLookExplorer";
import { ProductDetailTopBar } from "../components/product/ProductDetailTopBar";
import { ProductHeroFullscreen } from "../components/product/ProductHeroFullscreen";
import { ProductHighlightsCarousel } from "../components/product/ProductHighlightsCarousel";
import { FaqSection } from "../components/FaqSection";
import { preload } from "react-dom";
import { Link } from "react-router-dom";
import { MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { PRODUCT_DETAIL_BLUEPRINTS } from "../data/product-detail-blueprints";
import { PRODUCTS, type ProductId } from "../data/products";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { cn, useTheme } from "@jokuh/gooey";

const PRODUCT_HERO_IMAGE: Partial<Record<ProductId, string>> = {
  blurbs: "/product-hero/blurbs-poster.jpg",
  spine: "/product-hero/spine-featured-hero.png",
  calls: "/product-hero/calls.jpg",
  messages: "/product-hero/texts.jpg",
  profile: "/product-hero/profile.png",
};

const PRODUCT_HERO_VIDEO: Partial<Record<ProductId, string>> = {
  blurbs: "/product-hero/blurbs-header.mp4",
  messages: "/product-hero/texts-header.mp4",
};

/** Hero CTA per product: a short value-prop label on the left, and a verb that responds. */
const PRODUCT_HERO_CTA: Record<ProductId, { label: string; action: string }> = {
  pods: { label: "Build your profile", action: "Compose" },
  blurbs: { label: "Capture the spark", action: "Post" },
  spine: { label: "Hold every memory", action: "Save" },
  calls: { label: "Keep every word", action: "Listen" },
  messages: { label: "Stay in the loop", action: "Send" },
  profile: { label: "Own your identity", action: "Claim" },
  vortex: { label: "One question, all of it", action: "Ask" },
  passport: { label: "Carry your identity", action: "Verify" },
  realms: { label: "Shape your space", action: "Enter" },
  orb: { label: "A show, in another dimension", action: "Tune in" },
  v1llains: { label: "Sharpen your thinking", action: "Spar" },
};

const PRODUCT_FAQ_SUMMARIES: Partial<Record<ProductId, string>> = {
  blurbs:
    "Blurbs are Jokuh's native short-form unit: thoughts, links, snippets, and prompts captured in seconds and instantly searchable across your timeline.",
  spine:
    "Spine is your operating timeline. It threads notes, calls, messages, prompts, and reminders into one chronological surface so your work has a single source of truth.",
  calls:
    "Calls are end-to-end-encrypted voice and video native to Jokuh, with agent-assisted summaries, action items, and memory written back to your Spine automatically.",
  messages:
    "Messages is private peer-to-peer chat with full agent context. Your AI sees what you allow it to see, and nothing leaves your device unless you say so.",
  profile:
    "Profile is your sovereign identity layer: keys, reputation, public surfaces, and the agents you run, all under your control and portable across the network.",
  vortex:
    "Vortex is the agent workspace where models work for you in parallel: researching, drafting, comparing, and synthesizing across your private memory layer.",
  passport:
    "Passport is your portable, cryptographically verifiable identity for Jokuh and the wider network: prove who you are without handing over your data.",
  realms:
    "Realms are private communities and shared spaces inside Jokuh, encrypted by default, with their own agents, memory, and economy.",
  orb:
    "Orb is Jokuh's wallet and settlement layer: native multi-chain custody, payments, and on-chain actions executed by agents you authorize.",
};

function preloadProductHeroPoster(productId: ProductId) {
  const poster = PRODUCT_HERO_IMAGE[productId];

  if (poster) {
    preload(poster, { as: "image", fetchPriority: "high" });
  }
}

export function ProductPage({ productId }: { productId: ProductId }) {
  const product = PRODUCTS[productId];
  const detail = PRODUCT_DETAIL_BLUEPRINTS[productId];
  const { resolvedTheme } = useTheme();

  preloadProductHeroPoster(productId);
  useDocumentTitle(`${product.title} Jokuh`);

  return (
    <MarketingPageFrame
      withAntialiased
      withFontSans
      theme={resolvedTheme === "light" ? "light" : "dark"}
      topBar={<ProductDetailTopBar productTitle={product.title} cta={PRODUCT_HERO_CTA[productId]} />}
    >
      <div id="overview" className="scroll-mt-24">
        <ProductHeroFullscreen
          title={product.title}
          backgroundImage={PRODUCT_HERO_IMAGE[productId]}
          backgroundVideo={PRODUCT_HERO_VIDEO[productId]}
          trailing={
            <div className="inline-flex h-12 items-center gap-3 rounded-full bg-black/40 pl-5 pr-1.5 backdrop-blur-md ring-1 ring-white/10">
              <span className="font-sans text-[14px] font-medium text-white">
                {PRODUCT_HERO_CTA[productId].label}
              </span>
              <Link
                to="/download"
                className="inline-flex h-10 items-center justify-center rounded-full bg-blue-500 px-5 font-sans text-[12px] font-semibold tracking-tight text-white transition-colors hover:bg-blue-600"
              >
                {PRODUCT_HERO_CTA[productId].action}
              </Link>
            </div>
          }
        />
      </div>
      <span id="product-hero-end" aria-hidden className="block h-px" />

      <div id="highlights" className="scroll-mt-24">
        <ProductHighlightsCarousel {...detail.highlights} />
      </div>
      {productId !== "profile" && productId !== "messages" ? (
        <div id="closer-look" className="scroll-mt-24">
          <ProductCloserLookExplorer {...detail.closerLook} />
        </div>
      ) : null}
      <div id="showcase" className="scroll-mt-24">
        <ProductCenteredShowcase {...detail.centerpiece} />
      </div>

      <div className={cn(CONTENT_SHELL_WIDE, "scroll-mt-24 py-20 md:py-28")}>
        <FaqSection
          items={[
            {
              question: `What is ${product.title}?`,
              answer: PRODUCT_FAQ_SUMMARIES[productId] ?? product.summary,
            },
            {
              question: "How do I get started?",
              answer: `${product.title} lives inside ARC Terminal. Download Jokuh through TestFlight, sign in with your local identity, and ${product.title} is enabled by default. No separate install, no separate account.`,
            },
            {
              question: "Is there a free tier?",
              answer: "Yes. Every primitive in Jokuh is usable on the free tier during early access. Paid tiers expand capacity, advanced agent capability, and team-scale features. Pricing publishes alongside public release.",
            },
            {
              question: "What platforms are supported?",
              answer: "iOS today via TestFlight, with macOS and additional platforms on the roadmap. Because Jokuh is local-first, your data and identity travel with you across every platform we ship.",
            },
            {
              question: "How does Jokuh handle my data?",
              answer: `Your ${product.title} data is local-first and encrypted on your device. Jokuh doesn't aggregate it server-side, and you hold the keys. Peer sync is opt-in, model calls run on data you explicitly authorize, and nothing is sold or fed into ad systems.`,
            },
          ]}
        />
      </div>
    </MarketingPageFrame>
  );
}
