import { cn } from "@jokuh/gooey";
import { EditorialLinkCard } from "../components/EditorialLinkCard";
import { FaqSection } from "../components/FaqSection";
import { SiteLink } from "../components/SiteLink";
import { TertiaryPageChrome, pageHeroEyebrowClass, proseBodyMutedClass } from "../components/system";
import { CONTENT_SHELL_COMPANY, CONTENT_SHELL_WIDE } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const ABOUT_LINKS = [
  {
    eyebrow: "Product",
    title: "Spine",
    href: "/spine",
    description: "Spine, Calls, Messages, and the surfaces that make speech useful after it happens.",
    image: "/pods-bento/bento-art.png",
  },
  {
    eyebrow: "Brand",
    title: "Brand",
    href: "/brand",
    description: "Brand assets, marks, and guidance for partners and press.",
    image: "/brand/jokuh-logomark-white.svg",
  },
  {
    eyebrow: "Careers",
    title: "Careers",
    href: "/careers",
    description: "Open roles across engineering, product, research, and operations.",
    image: "/story-art/aaron-nyc-desk.png",
  },
] as const;

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
    cta: "Read the charter",
    href: "/charter",
    image: "/download/mobile-preview.jpg",
    alt: "Jokuh mobile interface preview.",
    caption: "The product should make the architecture easier to understand.",
  },
] as const;

function AboutPillLink({ href, children }: { href: string; children: string }) {
  return (
    <SiteLink
      href={href}
      className="inline-flex h-9 items-center rounded-full bg-white/[0.07] px-4 font-sans text-[12px] font-medium text-light-space transition-colors hover:bg-white/[0.12] light:bg-zinc-950/[0.06] light:text-zinc-950 light:hover:bg-zinc-950/[0.1]"
    >
      {children}
    </SiteLink>
  );
}

function AboutImage({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={cn("overflow-hidden", className)}>
      <div className="aspect-square overflow-hidden rounded-[18px] bg-white/[0.04] light:bg-section-grey-light">
        <img src={src} alt={alt} className="size-full object-cover" loading="lazy" />
      </div>
      {caption ? (
        <figcaption className="mt-3 font-sans text-[11px] leading-relaxed text-light-space/38 light:text-zinc-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default function AboutPage() {
  useDocumentTitle("About — Jokuh");

  return (
    <TertiaryPageChrome>
      <main>
        <section className={cn(CONTENT_SHELL_COMPANY, "pt-20 pb-24 text-center md:pt-24 md:pb-28")}>
          <p className={pageHeroEyebrowClass}>Company</p>
          <h1 className="mt-5 font-sans text-[clamp(3rem,8vw,5.75rem)] font-medium leading-[0.95] tracking-[0em] text-light-space light:text-zinc-950">
            About
          </h1>
          <p className="mx-auto mt-7 max-w-[40rem] text-balance text-pretty font-sans text-[17px] leading-[1.65] text-light-space/64 light:text-zinc-600 md:max-w-[36rem] md:text-[18px] md:leading-[1.7]">
            <span className="block">
              Jokuh builds private speech systems that turn conversations into structured memory
            </span>
            <span className="mt-1.5 block md:mt-1">
              without taking ownership away from the people who spoke.
            </span>
          </p>
        </section>

        <section className={cn(CONTENT_SHELL_WIDE, "pb-24 md:pb-32")}>
          <div className="grid grid-cols-1 gap-10 md:items-center md:gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 xl:grid-cols-[minmax(0,28rem)_1fr]">
            <div className="max-w-[22rem] text-left sm:max-w-[24rem] xl:max-w-[28rem]">
              <h2 className="font-sans text-[26px] font-medium leading-[1.12] tracking-[0em] text-light-space light:text-zinc-950 md:text-[34px]">
                We are building memory infrastructure for a world where voice becomes the main interface.
              </h2>
              <p className={cn(proseBodyMutedClass, "mt-6 max-w-none")}>
                The mission is to make spoken context durable, searchable, and useful while keeping consent visible and
                control close to the user.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <AboutPillLink href="/spine">See what we build</AboutPillLink>
                <AboutPillLink href="/careers">Join us</AboutPillLink>
              </div>
            </div>
            <div className="flex min-w-0 justify-end">
              <AboutImage
                className="w-full max-w-md md:ml-auto md:max-w-2xl lg:max-w-[min(100%,40rem)] xl:max-w-[min(100%,44rem)]"
                src="/story-art/about-brooklyn-walk.png"
                alt="Top-down illustration of a person walking down a Brooklyn street between brick buildings."
                caption="Voice is the input. Trust is the product boundary."
              />
            </div>
          </div>
        </section>

        <section className="bg-white/[0.015] light:bg-section-grey-light/70">
          <div className={cn(CONTENT_SHELL_COMPANY, "py-20 md:py-28")}>
            <p className="mx-auto max-w-[760px] text-center font-sans text-[28px] font-medium leading-[1.18] tracking-[0em] text-light-space light:text-zinc-950 md:text-[42px]">
              We care about reliability at the product layer and governance at the system layer. Latency, auditability,
              privacy, and reading quality have to work together.
            </p>
          </div>
        </section>

        <section className={cn(CONTENT_SHELL_COMPANY, "py-8 md:py-12")}>
          {ABOUT_FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="grid gap-10 py-20 md:grid-cols-[0.78fr_1.22fr] md:items-center md:gap-16 md:py-24"
            >
              <div>
                <p className={pageHeroEyebrowClass}>{feature.eyebrow}</p>
                <h2 className="mt-5 font-sans text-[27px] font-medium leading-[1.14] tracking-[0em] text-light-space light:text-zinc-950 md:text-[36px]">
                  {feature.title}
                </h2>
                <p className={cn(proseBodyMutedClass, "mt-5 max-w-[440px]")}>{feature.body}</p>
                <div className="mt-7">
                  <AboutPillLink href={feature.href}>{feature.cta}</AboutPillLink>
                </div>
              </div>
              <AboutImage src={feature.image} alt={feature.alt} caption={feature.caption} />
            </article>
          ))}
        </section>

        <section className={cn(CONTENT_SHELL_WIDE, "px-4 py-16 md:px-8 md:py-24")}>
          <h2 className="font-sans text-[22px] font-medium tracking-[0em] text-light-space light:text-zinc-950">
            Learn more about what we do
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6 xl:gap-8">
            {ABOUT_LINKS.map((link, i) => (
              <EditorialLinkCard
                key={link.href}
                item={{
                  eyebrow: link.eyebrow,
                  title: link.title,
                  href: link.href,
                  image: link.image,
                }}
                priority={i < 2}
              />
            ))}
          </div>
        </section>

        <section className={cn(CONTENT_SHELL_COMPANY, "py-16 md:py-24")}>
          <FaqSection
            items={[
              {
                question: "What does Jokuh make?",
                answer:
                  "Jokuh builds speech and memory products that help conversations stay structured, searchable, and tied to the right identity context.",
              },
              {
                question: "Is Jokuh a product company or an infrastructure company?",
                answer:
                  "Both. We ship user-facing products, but we also build the underlying systems that make those products trustworthy and consistent.",
              },
              {
                question: "Where can I learn more about Jokuh’s approach?",
                answer:
                  "Start with Products for the system surface, Brand for public assets, and Careers if you want to work on the stack directly.",
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
              <AboutPillLink href="/careers">View careers</AboutPillLink>
            </div>
          </div>
        </section>
      </main>
    </TertiaryPageChrome>
  );
}
