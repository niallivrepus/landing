import { Button, cn } from "@jokuh/gooey";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  CompanyPageClosingCta,
  CompanyPageHero,
  CompanyPageLayout,
  COMPANY_PAGE_SHELL,
} from "../components/CompanyPageLayout";
import { SecondaryLink } from "../components/SecondaryLink";
import { StoryRowLink } from "../components/StoryRowLink";
import {
  MarketingProseLead,
  MarketingProseMuted,
  MarketingSectionHeading,
  MarketingSectionLabel,
} from "../components/system";
import { getNewsHref, NEWS_ITEMS } from "../data/news";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useGentleHoverSound } from "../hooks/useGentleHoverSound";

function AboutIllustration() {
  return (
    <figure
      className={cn(
        "relative mt-12 overflow-hidden rounded-[28px] border border-light-space/[0.08] bg-gradient-to-br from-[#1a1530] via-dark-space to-[#0a1a12]",
        "aspect-[16/10] max-h-[min(420px,55vh)] w-full shadow-[0_40px_100px_rgba(0,0,0,0.45)] light:from-[#e8e4f5] light:via-white light:to-[#eef6f0] light:shadow-[0_40px_100px_rgba(0,0,0,0.06)]",
      )}
      aria-label="Abstract visual"
    >
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="about-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div
        className="absolute inset-[12%] opacity-[0.35] light:opacity-[0.2]"
        style={{ filter: "url(#about-gooey)" }}
      >
        <motion.div
          className="absolute left-[8%] top-[20%] size-[42%] rounded-full bg-purple-5/50"
          animate={{ x: [0, 14, 0], y: [0, -10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[10%] top-[28%] size-[38%] rounded-full bg-blue-5/45"
          animate={{ x: [0, -12, 0], y: [0, 12, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[14%] left-[24%] size-[34%] rounded-full bg-pink-5/40"
          animate={{ x: [0, -10, 0], y: [0, 8, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(103,41,236,0.2),transparent_60%)]" />
      <figcaption className="absolute bottom-4 left-4 right-4 font-sans text-[12px] text-light-space/35 md:bottom-6 md:left-6">
        Jokuh — identity, speech, and the graph that connects them
      </figcaption>
    </figure>
  );
}

export default function AboutPage() {
  useDocumentTitle("About — Jokuh");
  const hoverSoundProps = useGentleHoverSound();

  const spotlight = NEWS_ITEMS.slice(0, 4);

  return (
    <CompanyPageLayout>
      <>
      <section className={cn(COMPANY_PAGE_SHELL, "pt-28 pb-16 md:pt-32 md:pb-24")}>
        <CompanyPageHero eyebrow="Company" title="About" />
        <MarketingProseLead className="mt-8">
          Jokuh is building the layer where live speech becomes structured memory—pods, blurbs, spine, and the graph
          that ties identity to what people actually said. Our mission is to make that capture trustworthy, portable,
          and useful for everyone who depends on the record.
        </MarketingProseLead>

        <MarketingSectionHeading className="mt-16">Our vision</MarketingSectionHeading>
        <MarketingProseMuted className="mt-4">
          We believe the next generation of interfaces sits on top of high-fidelity transcription,
          diarization-aware timelines, and APIs that treat utterances as first-class data—not as an afterthought in a
          chat window.
        </MarketingProseMuted>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <SecondaryLink to="/ethics">Ethics &amp; compliance</SecondaryLink>
          <SecondaryLink to="/research">Research</SecondaryLink>
        </div>

        <AboutIllustration />

        <MarketingSectionHeading className="mt-16 leading-snug">
          We ship products that feel human—and infrastructure that teams can trust.
        </MarketingSectionHeading>
        <MarketingProseMuted className="mt-4">
          If our work helps others build safer, clearer speech systems, we consider that part of the same mission.
        </MarketingProseMuted>

        <MarketingSectionHeading className="mt-16">Careers at Jokuh</MarketingSectionHeading>
        <MarketingProseMuted className="mt-4">
          Product, research, and infrastructure each play a role. We look for people who care about edge cases,
          latency, and the ethics of what gets stored.
        </MarketingProseMuted>
        <div className="mt-6">
          <Button variant="primary-neutral" size="xl" className="px-8" asChild {...hoverSoundProps}>
            <Link to="/careers">View careers</Link>
          </Button>
        </div>

        <MarketingSectionLabel className="mt-16">Learn more about what we do</MarketingSectionLabel>
        <ul className="mt-4 space-y-2 font-sans text-[16px] text-light-space/70">
          <li>
            <Link to="/research" className="underline-offset-4 transition-colors hover:text-light-space hover:underline">
              Research
            </Link>
          </li>
          <li>
            <Link to="/pods" className="underline-offset-4 transition-colors hover:text-light-space hover:underline">
              Products
            </Link>
          </li>
          <li>
            <Link to="/newsroom" className="underline-offset-4 transition-colors hover:text-light-space hover:underline">
              Newsroom
            </Link>
          </li>
        </ul>

        <hr className="mt-16 border-light-space/[0.1]" />

        <div className="mt-12">
          {spotlight.map((item) => {
            return (
              <StoryRowLink
                key={item.id}
                title={item.title}
                category={item.category}
                href={getNewsHref(item)}
              />
            );
          })}
          <div className="pt-6">
            <SecondaryLink to="/newsroom">Read more</SecondaryLink>
          </div>
        </div>

        <MarketingSectionHeading className="mt-20">Our structure</MarketingSectionHeading>
        <MarketingProseMuted className="mt-4">
          Jokuh pairs a focused product org with research and safety review. Governance, privacy, and partner
          commitments are explicit inputs to what we ship—not a post-launch patch layer.
        </MarketingProseMuted>
        <p className="mt-4">
          <SecondaryLink to="/legal">Legal &amp; policies</SecondaryLink>
        </p>
      </section>

      <CompanyPageClosingCta
        headline="Join us in shaping how speech becomes software"
        buttonLabel="View careers"
        buttonTo="/careers"
      />
      </>
    </CompanyPageLayout>
  );
}
