import { ProductCenteredShowcase } from "../components/product/ProductCenteredShowcase";
import { ProductCloserLookExplorer } from "../components/product/ProductCloserLookExplorer";
import { ProductHeroFullscreen } from "../components/product/ProductHeroFullscreen";
import { ProductHighlightsCarousel } from "../components/product/ProductHighlightsCarousel";
import {
  CallsImmersiveShell,
  BlurbsImmersiveShell,
  MessagesImmersiveShell,
  ProfileImmersiveShell,
  SpineImmersiveShell,
} from "../components/landing";
import { FaqSection } from "../components/FaqSection";
import { preload } from "react-dom";
import { Link } from "react-router-dom";
import { MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { PRODUCT_DETAIL_BLUEPRINTS } from "../data/product-detail-blueprints";
import { PRODUCTS, type ProductId } from "../data/products";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useDownloadIntercept } from "../hooks/useDownloadIntercept";
import { cn, useTheme } from "@jokuh/gooey";

const IMMERSIVE_PRODUCT_IDS = ["profile", "messages", "spine", "calls", "blurbs"] as const;
type ImmersiveProductId = (typeof IMMERSIVE_PRODUCT_IDS)[number];

function isImmersiveProduct(productId: ProductId): productId is ImmersiveProductId {
  return IMMERSIVE_PRODUCT_IDS.includes(productId as ImmersiveProductId);
}

function ImmersiveProductHero({ productId }: { productId: ImmersiveProductId }) {
  switch (productId) {
    case "profile":
      return <ProfileImmersiveShell />;
    case "messages":
      return <MessagesImmersiveShell />;
    case "spine":
      return <SpineImmersiveShell />;
    case "calls":
      return <CallsImmersiveShell />;
    case "blurbs":
      return <BlurbsImmersiveShell />;
  }
}

function ProductHeroCta({ productId }: { productId: ProductId }) {
  const { buildHref } = useDownloadIntercept(`product-${productId}`);
  const cta = PRODUCT_HERO_CTA[productId];

  return (
    <div className="inline-flex flex-col items-center gap-3 sm:flex-row">
      <span className="font-sans text-[14px] font-medium text-white/90">{cta.label}</span>
      <Link
        to={buildHref("product-hero", { product: productId })}
        className="inline-flex h-12 items-center justify-center rounded-full bg-blue-500 px-8 font-sans text-[13px] font-semibold tracking-tight text-white transition-colors hover:bg-blue-600"
      >
        {cta.action}
      </Link>
    </div>
  );
}

const PRODUCT_HERO_IMAGE: Partial<Record<ProductId, string>> = {
  blurbs: "/product-hero/blurbs-poster.webp",
  spine: "/product-hero/spine-featured-hero.webp",
  calls: "/product-hero/calls.webp",
  messages: "/product-hero/texts.webp",
  profile: "/product-hero/profile.webp",
};

const PRODUCT_HERO_VIDEO: Partial<Record<ProductId, string>> = {
  blurbs: "/product-hero/blurbs-header.mp4",
  calls: "/product-hero/calls-header.mp4",
  messages: "/product-hero/texts-header.mp4",
};

/** Hero CTA per product: a short value-prop label on the left, and a verb that responds. */
const PRODUCT_HERO_CTA: Record<ProductId, { label: string; action: string }> = {
  pods: { label: "Build your profile", action: "Compose" },
  blurbs: { label: "Capture the spark", action: "Post" },
  spine: { label: "Hold every memory", action: "Save" },
  calls: { label: "HD rooms with memory", action: "Join a call" },
  messages: { label: "E2EE texts with @oo", action: "Start texting" },
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
    "Spine is Jokuh's long-term home for structured personal context: a year timeline with Today Brief, day planner (notes, tasks, reminders, files, memories), mood logging, Sky Lens, calendar and photo import, memory search, streaks, and automatic lifelogging from calls, captures, wallet, and more — synced local-first across your devices.",
  calls:
    "Calls are end-to-end-encrypted HD voice and video native to Jokuh — live captions, translation, Infinity Dialog tier, guest knock queue, host recording and moderation, in-call reactions and chat, scheduled calls with invite-via-DM, and automatic post-call Spine transcript writeback.",
  messages:
    "Texts are E2EE peer-to-peer DMs with @mentions, @oo agent threads, suggestion pills, GIF picker, rich attachments with resumable uploads, voice messages, link previews, read receipts, Joki reactions, doc vault cards, and a unified Spine transcript shared with calls — your agent sees only what you allow, on-device first.",
  profile:
    "Profile is your sovereign identity surface: photo, @handle, biography pod, network strip, and composable pods you customize — tied to Spine so the rest of Jokuh remembers who you are.",
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

  const showCloserLook = productId !== "profile";

  return (
    <MarketingPageFrame
      withAntialiased
      withFontSans
      theme={resolvedTheme === "light" ? "light" : "dark"}
    >
      <div id="overview" className="scroll-mt-24">
        {isImmersiveProduct(productId) ? (
          <ImmersiveProductHero productId={productId} />
        ) : (
          <ProductHeroFullscreen
            title={product.title}
            backgroundImage={PRODUCT_HERO_IMAGE[productId]}
            backgroundVideo={PRODUCT_HERO_VIDEO[productId]}
            trailing={<ProductHeroCta productId={productId} />}
          />
        )}
      </div>
      <span id="product-hero-end" aria-hidden className="block h-px" />

      <div id="highlights" className="scroll-mt-24">
        <ProductHighlightsCarousel {...detail.highlights} />
      </div>
      {showCloserLook ? (
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
