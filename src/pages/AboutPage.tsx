import { cn } from "@jokuh/gooey";
import { useMemo } from "react";
import { FaqSection } from "../components/FaqSection";
import { NewsCardArt } from "../components/NewsCardArt";
import { SiteLink } from "../components/SiteLink";
import {
  EDITORIAL_MEDIA_RADIUS_CLASS,
  PillLink,
  SectionHeaderRow,
  TertiaryPageChrome,
  pageHeroEyebrowClass,
  proseBodyMutedClass,
} from "../components/system";
import { CONTENT_SHELL_COMPANY, CONTENT_SHELL_WIDE } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { DEFAULT_NEWS_CARD_GRADIENT, NEWS_ITEMS, formatNewsDate, getNewsHref } from "../data/news";

const ABOUT_FEATURES = [
  {
    eyebrow: "Our vision",
    title: "Speech should become memory without becoming surveillance.",
    body:
      "Jokuh is building the private layer between live communication and long-term context. The work is not just better transcription. It is consent, identity, search, and recall designed as one system.",
    cta: "Explore products",
    href: "/spine",
    image: "/story-art/maren-workspace.png",
    alt: "A warm workspace scene representing personal memory and focus.",
    caption: "Memory surfaces should feel calm enough to trust.",
  },
  {
    eyebrow: "How we work",
    title: "Small systems, clear boundaries, and interfaces that show their trust model.",
    body:
      "We design from the moment a word is spoken through the moment it is found again. Latency, speaker identity, retention, encryption, and readable summaries all shape the same product decision.",
    cta: "Read the manifesto",
    href: "/manifesto",
    image: "/download/mobile-preview.jpg",
    alt: "Jokuh mobile interface preview.",
    caption: "The product should make the architecture easier to understand.",
  },
] as const;

type AboutNewsCard = {
  id: string;
  title: string;
  category: string;
  date: string;
  href: string;
  gradient: string;
  image?: string;
  lavaLamp?: NonNullable<(typeof NEWS_ITEMS)[number]["lavaLamp"]>;
};

function AboutNewsroomCard({ row }: { row: AboutNewsCard }) {
  return (
    <article className="group flex h-full flex-col">
      <SiteLink href={row.href} className="flex h-full flex-col no-underline">
        <div
          className={cn(
            "aspect-square overflow-hidden border border-light-space/[0.08] bg-white/[0.03] light:border-black/[0.08] light:bg-section-grey-light/80",
            EDITORIAL_MEDIA_RADIUS_CLASS,
          )}
        >
          <NewsCardArt gradient={row.gradient} image={row.image} lavaLamp={row.lavaLamp} className="size-full" />
        </div>
        <div className="mt-3 flex flex-1 flex-col gap-1.5 pt-0.5">
          <h3 className="line-clamp-2 font-sans text-[15px] font-semibold leading-[1.25] tracking-[0em] text-light-space transition-colors group-hover:text-light-space/80 light:text-zinc-950 sm:text-base">
            {row.title}
          </h3>
          <p className="font-sans text-[12px] leading-tight tracking-[0em] sm:text-[13px]">
            <span className="text-light-space light:text-zinc-900">{row.category}</span>
            <span className="text-light-space/30 light:text-zinc-300"> · </span>
            <span className="text-light-space/45 light:text-zinc-500">{row.date}</span>
          </p>
        </div>
      </SiteLink>
    </article>
  );
}

function AboutImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <figure className={cn("overflow-hidden", className)}>
      <div className={cn("aspect-square overflow-hidden bg-white/[0.04] light:bg-section-grey-light", EDITORIAL_MEDIA_RADIUS_CLASS)}>
        <img src={src} alt={alt} className="size-full object-cover" loading="lazy" />
      </div>
    </figure>
  );
}

export default function AboutPage() {
  useDocumentTitle("About Jokuh");

  const newsroomCards = useMemo<AboutNewsCard[]>(
    () =>
      [...NEWS_ITEMS]
        .sort(
          (a, b) =>
            new Date(b.publishedAt + "T12:00:00").getTime() -
            new Date(a.publishedAt + "T12:00:00").getTime(),
        )
        .slice(0, 3)
        .map((n) => ({
          id: n.id,
          title: n.title,
          category: n.category,
          date: formatNewsDate(n.publishedAt),
          href: getNewsHref(n),
          gradient: n.cardGradient?.trim() || DEFAULT_NEWS_CARD_GRADIENT,
          image: n.cardImage,
          lavaLamp: n.lavaLamp,
        })),
    [],
  );

  return (
    <TertiaryPageChrome>
      <main>
        <section className={cn(CONTENT_SHELL_COMPANY, "pt-20 pb-24 text-center md:pt-24 md:pb-28")}>
          <p className={pageHeroEyebrowClass}>Company</p>
          <h1 className="mt-5 font-sans text-[clamp(3rem,8vw,5.75rem)] font-medium leading-[0.95] tracking-[0em] text-light-space light:text-zinc-950">
            About
          </h1>
          <p className="mx-auto mt-7 max-w-[40rem] text-balance text-pretty font-sans text-[17px] leading-[1.65] text-light-space/64 light:text-zinc-600 md:max-w-[38rem] md:text-[18px] md:leading-[1.7]">
            Jokuh builds private speech systems that turn conversations into structured memory without taking ownership
            away from the people who spoke.
          </p>
        </section>

        <section className={cn(CONTENT_SHELL_WIDE, "pb-24 md:pb-32")}>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:items-center md:gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 xl:grid-cols-[minmax(0,28rem)_1fr]">
            <div className="max-w-[22rem] text-left sm:max-w-[24rem] md:max-w-none xl:max-w-[28rem]">
              <h2 className="font-sans text-[26px] font-medium leading-[1.12] tracking-[0em] text-light-space light:text-zinc-950 md:text-[34px]">
                We are building memory infrastructure for a world where voice becomes the main interface.
              </h2>
              <p className={cn(proseBodyMutedClass, "mt-6 max-w-none")}>
                The mission is to make spoken context durable, searchable, and useful while keeping consent visible and
                control close to the user.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <PillLink href="/spine">See what we build</PillLink>
                <PillLink href="/careers">Join us</PillLink>
              </div>
            </div>
            <div className="flex min-w-0 justify-end">
              <AboutImage
                className="w-full max-w-md md:ml-auto md:max-w-none lg:max-w-[min(100%,40rem)] xl:max-w-[min(100%,44rem)]"
                src="/story-art/about-brooklyn-walk.png"
                alt="Top-down illustration of a person walking down a Brooklyn street between brick buildings."
              />
            </div>
          </div>
        </section>

        <section className={cn(CONTENT_SHELL_WIDE, "py-16 md:py-24")}>
          <p className="mx-auto max-w-[640px] text-center font-sans text-[18px] font-medium leading-[1.4] tracking-[0em] text-light-space light:text-zinc-950 md:text-[22px] md:leading-[1.35]">
            We care about reliability at the product layer and governance at the system layer. Latency, auditability,
            privacy, and reading quality have to work together.
          </p>
          <figure
            className={cn(
              "mt-12 overflow-hidden border border-light-space/[0.08] bg-white/[0.04] light:border-zinc-200/80 light:bg-section-grey-light md:mt-16",
              EDITORIAL_MEDIA_RADIUS_CLASS,
            )}
          >
            <img
              src="/story-art/aaron-nyc-midtown-aerial-grid.png"
              alt="A wide-angle aerial of dense city blocks at dusk."
              className="aspect-[21/9] w-full object-cover"
              loading="lazy"
            />
          </figure>
        </section>

        <section className={cn(CONTENT_SHELL_COMPANY, "py-8 md:py-12")}>
          {ABOUT_FEATURES.map((feature, index) => {
            const imageLeft = index % 2 === 1;
            return (
              <article
                key={feature.title}
                className={cn(
                  "grid gap-10 py-20 md:items-center md:gap-16 md:py-24",
                  imageLeft
                    ? "md:grid-cols-[1.22fr_0.78fr]"
                    : "md:grid-cols-[0.78fr_1.22fr]",
                )}
              >
                <div className={cn(imageLeft && "md:order-2")}>
                  <h2 className="font-sans text-[27px] font-medium leading-[1.14] tracking-[0em] text-light-space light:text-zinc-950 md:text-[36px]">
                    {feature.title}
                  </h2>
                  <p className={cn(proseBodyMutedClass, "mt-5 max-w-[440px]")}>{feature.body}</p>
                  <div className="mt-7">
                    <PillLink href={feature.href}>{feature.cta}</PillLink>
                  </div>
                </div>
                <AboutImage
                  src={feature.image}
                  alt={feature.alt}
                  className={cn(imageLeft && "md:order-1")}
                />
              </article>
            );
          })}
        </section>

        <section className={cn(CONTENT_SHELL_WIDE, "py-16 md:py-24")}>
          <SectionHeaderRow title="From the newsroom" actionLabel="View all" actionTo="/newsroom" />
          <div className="mt-0 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6 xl:gap-8">
            {newsroomCards.map((row) => (
              <AboutNewsroomCard key={row.id} row={row} />
            ))}
          </div>
        </section>

        <section className={cn(CONTENT_SHELL_COMPANY, "py-16 md:py-24")}>
          <FaqSection
            items={[
              {
                question: "What is Jokuh?",
                answer:
                  "Jokuh is a sovereign agentic operating system. It unifies AI, communication, storage, identity, and payments into one privacy-first interface, so you stop juggling dozens of apps to stay in control of your own data.",
              },
              {
                question: "Is Jokuh a product or a platform?",
                answer:
                  "Both. The first surface users touch is ARC Terminal, but the underlying system is an OS layer: a local-first memory layer, agent runtime, multi-chain wallet, and decentralized identity stack that other applications and agents can build on.",
              },
              {
                question: "Who is Jokuh for?",
                answer:
                  "AI-native builders, privacy-conscious users, web3 participants, and knowledge workers who want one persistent, private environment instead of fifteen disconnected tools.",
              },
              {
                question: "Where can I learn more?",
                answer:
                  "The Manifesto explains the why, the Product pages explain the how, and the Data Room is available on request to serious investors and partners. Reach the team at sean@sierri.com.",
              },
            ]}
          />
        </section>

        <section className={cn(CONTENT_SHELL_COMPANY, "pb-20 md:pb-28")}>
          <div className="rounded-[20px] bg-white/[0.08] px-6 py-16 text-center light:bg-zinc-950/[0.06] md:px-10 md:py-20">
            <h2 className="mx-auto max-w-[720px] font-sans text-[30px] font-medium leading-[1.08] tracking-[0em] text-light-space light:text-zinc-950 md:text-[46px]">
              Join us in building speech systems people can actually trust.
            </h2>
            <div className="mt-8">
              <PillLink href="/careers">View careers</PillLink>
            </div>
          </div>
        </section>
      </main>
    </TertiaryPageChrome>
  );
}
