import { Button, cn } from "@jokuh/gooey";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CAREERS_BENEFITS,
  CAREERS_CLOSING_CTA,
  CAREERS_FEATURED_PROGRAMS,
  CAREERS_OPERATING_PRINCIPLES,
  CAREERS_RESOURCES,
  CAREERS_VALUES,
} from "../data/careers";
import { FaqSection } from "../components/FaqSection";
import { SecondaryLink } from "../components/SecondaryLink";
import {
  CompanyPageClosingCta,
  CompanyPageHero,
  CompanyPageLayout,
  COMPANY_PAGE_SHELL,
} from "../components/CompanyPageLayout";
import {
  MarketingProseLead,
  MarketingSectionHeading,
  MarketingSectionLabel,
  pageHeroEyebrowUppercaseClass,
  proseBodyMutedClass,
} from "../components/system";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useGentleHoverSound } from "../hooks/useGentleHoverSound";

const listTitle = "mt-3 font-sans text-[15px] font-semibold text-light-space";

function ValueBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="py-6 first:pt-0">
      <p className="font-sans text-[15px] font-semibold text-light-space">{title}</p>
      <p className={cn(proseBodyMutedClass, "mt-2 max-w-none")}>{children}</p>
    </li>
  );
}

export default function CareersPage() {
  useDocumentTitle("Jokuh Careers");
  const hoverSoundProps = useGentleHoverSound();

  return (
    <CompanyPageLayout>
      <>
      <section className={cn(COMPANY_PAGE_SHELL, "pt-28 pb-12 md:pt-32 md:pb-16")}>
        <CompanyPageHero eyebrow="Company" title="Build speech systems">
          <MarketingProseLead className="mt-8">
            We’re looking for curious minds from engineering, design, research, and operations—people who care
            about latency, consent, and the record people rely on.
          </MarketingProseLead>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="primary-neutral" size="xl" className="px-8" asChild {...hoverSoundProps}>
              <a href="mailto:careers@jokuh.com?subject=Open%20roles">View open roles</a>
            </Button>
            <Button variant="secondary-neutral" size="xl" className="px-8" asChild>
              <Link to="/about">About Jokuh</Link>
            </Button>
          </div>
        </CompanyPageHero>
      </section>

      <div className="bg-light-space/[0.02] py-16 md:py-20">
        <div className={COMPANY_PAGE_SHELL}>
          <h2 className="font-sans text-lg font-semibold leading-snug tracking-[0em] text-light-space md:text-xl">Build for real lives.</h2>
          <p className={cn(proseBodyMutedClass, "mt-4 max-w-[720px]")}>
            <span className="text-light-space/65">Values: </span>
            These shape what we optimize for when tradeoffs appear. We believe aligning to them is the most
            direct path to products teams trust and individuals can understand.
          </p>
          <ul className="mt-10">
            {CAREERS_VALUES.map((v) => (
              <ValueBlock key={v.title} title={v.title}>
                {v.body}
              </ValueBlock>
            ))}
          </ul>

          <MarketingSectionLabel className="mt-14">Operating principles</MarketingSectionLabel>
          <p className={cn(proseBodyMutedClass, "mt-3 max-w-[720px]")}>
            How we work together—so scope stays sharp and quality compounds.
          </p>
          <ul className="mt-6 space-y-5">
            {CAREERS_OPERATING_PRINCIPLES.map((p) => (
              <li key={p.title}>
                <p className={listTitle}>{p.title}</p>
                <p className={cn(proseBodyMutedClass, "mt-1.5 max-w-[680px]")}>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className={cn(COMPANY_PAGE_SHELL, "py-16 md:py-24")}>
        <MarketingSectionHeading className="!mt-0">Benefits</MarketingSectionHeading>
        <p className={cn(proseBodyMutedClass, "mt-4 max-w-[640px]")}>
          Well-being is not a perk bolted on at the end—it’s how sustainable work actually happens. Details
          vary by role and region; we’ll walk through specifics as we get to know you.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {CAREERS_BENEFITS.map((col) => (
            <div key={col.heading}>
              <h3 className={pageHeroEyebrowUppercaseClass}>
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3 font-sans text-[14px] leading-snug text-light-space/60">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-purple-5/80" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="open-roles"
        className="bg-dark-space py-16 light:bg-white md:py-24"
      >
        <div className={COMPANY_PAGE_SHELL}>
          <MarketingSectionHeading className="!mt-0 md:text-3xl">
            Featured roles
          </MarketingSectionHeading>
          <p className={cn(proseBodyMutedClass, "mt-4 max-w-[560px]")}>
            We’re always interested in hearing from people who want to push transcription, diarization, and
            graph-backed identity forward—whether your background is ML, systems, product, or trust &amp; safety.
          </p>
          <div className="mt-8">
            <Button variant="primary-neutral" size="xl" className="px-8" asChild {...hoverSoundProps}>
              <a href="mailto:careers@jokuh.com?subject=Open%20roles">View open roles</a>
            </Button>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 md:gap-10">
            {CAREERS_FEATURED_PROGRAMS.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-light-space/[0.1] bg-white/[0.02] p-6 light:border-black/[0.08] light:bg-section-grey-light md:p-8"
              >
                <h3 className="font-sans text-lg font-semibold text-light-space light:text-zinc-950">{card.title}</h3>
                <p className={cn(proseBodyMutedClass, "mt-3 max-w-none text-[15px] leading-relaxed")}>{card.body}</p>
                <div className="mt-5">
                  <SecondaryLink to={card.href}>{card.cta}</SecondaryLink>
                </div>
              </article>
            ))}
          </div>

          <figure className="mt-16 rounded-2xl border border-light-space/[0.08] bg-white/[0.02] p-8 light:border-black/[0.08] light:bg-section-grey-light md:p-10">
            <blockquote className="font-sans text-[18px] font-medium leading-snug tracking-[0em] text-light-space/90 light:text-zinc-900 md:text-[20px]">
              We treat transcripts as infrastructure, not a feature checkbox. That standard shapes how we think
              about consent, retention, and what good actually means for customers.
            </blockquote>
            <figcaption className="mt-6 font-sans text-[13px] text-light-space/45 light:text-zinc-500">
              Engineering principle at Jokuh
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={cn(COMPANY_PAGE_SHELL, "pb-16 md:pb-20")}>
        <MarketingSectionHeading>Resources</MarketingSectionHeading>
        <ul className="mt-8">
          {CAREERS_RESOURCES.map((r) => (
            <li key={r.href} className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:justify-between">
              <Link
                to={r.href}
                className="font-sans text-[17px] font-medium text-light-space transition-colors hover:text-[var(--color-blue-4)] light:text-zinc-950"
              >
                {r.label}
              </Link>
              <span className="shrink-0 font-sans text-[13px] text-light-space/40 light:text-zinc-500">{r.tag}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={cn(COMPANY_PAGE_SHELL, "py-20 md:py-28")}>
        <FaqSection
          items={[
            {
              question: "How do I apply?",
              answer: "Pick the role that fits, submit the form, and attach work that proves you can do the job: repo, portfolio, writing, designs, or whatever is strongest. We read every submission. Generic resumes without proof of work get deprioritized.",
            },
            {
              question: "What is the interview process like?",
              answer: "Three stages on average: a written or recorded intro to align on context, a paid or scoped craft exercise tied to the actual role, and a final conversation with the founder and at least one team lead. We move fast, usually two to three weeks end-to-end.",
            },
            {
              question: "Do you offer remote positions?",
              answer: "Yes. Jokuh is remote-first across compatible time zones. Some roles benefit from periodic in-person sprints; those are clearly flagged on the job post.",
            },
            {
              question: "What benefits do you offer?",
              answer: "Equity in Jokuh LLC, competitive cash, and the operating budget to do your craft well: devices, tools, conferences. Specific health, time-off, and stipend details are confirmed at offer stage and depend on country of residence.",
            },
            {
              question: "I don't see a role that fits me. Can I still apply?",
              answer: "Yes. Use the open application and tell us the smallest, sharpest version of what you'd own. We hire ahead of formal job posts when the right operator shows up.",
            },
          ]}
        />
      </section>

      <CompanyPageClosingCta
        headline={CAREERS_CLOSING_CTA.headline}
        buttonLabel={CAREERS_CLOSING_CTA.buttonLabel}
        buttonHref={CAREERS_CLOSING_CTA.buttonHref}
      />
      </>
    </CompanyPageLayout>
  );
}
