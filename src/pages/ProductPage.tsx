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

export function ProductPage({ productId }: { productId: ProductId }) {
  const product = PRODUCTS[productId];
  const detail = PRODUCT_DETAIL_BLUEPRINTS[productId];
  const heroSentence = product.summary.match(/^[^.]+\./)?.[0] ?? product.summary;
  const { resolvedTheme } = useTheme();

  useDocumentTitle(`${product.title} Jokuh`);

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
