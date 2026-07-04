import { cn } from "@jokuh/gooey";
import { Check } from "lucide-react";
import {
  CAREERS_BENEFITS,
  CAREERS_CLOSING_CTA,
  CAREERS_FEATURED_ROLES,
  CAREERS_OPERATING_PRINCIPLES,
  CAREERS_QUOTE,
  CAREERS_RESOURCES,
  CAREERS_VALUES,
} from "../data/careers";
import { NewsCardArt } from "../components/NewsCardArt";
import { SiteLink } from "../components/SiteLink";
import {
  EditorialQuoteBlock,
  PillLink,
  TertiaryPageChrome,
  pageHeroEyebrowClass,
  proseBodyMutedClass,
} from "../components/system";
import { CONTENT_SHELL_COMPANY, CONTENT_SHELL_WIDE } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const APPLY_HREF = "/careers/roles";

function ResourceCard({ resource }: { resource: (typeof CAREERS_RESOURCES)[number] }) {
  return (
    <article className="group flex h-full flex-col">
      <SiteLink href={resource.href} className="flex h-full flex-col no-underline">
        <div className="aspect-square">
          <NewsCardArt gradient={resource.gradient} lavaLamp={resource.lavaLamp} className="size-full" />
        </div>
        <div className="mt-4 flex flex-1 flex-col gap-1.5">
          <h3 className="font-sans text-[15px] font-semibold leading-snug tracking-[0em] text-light-space transition-colors group-hover:text-light-space/80 light:text-zinc-950">
            {resource.label}
          </h3>
          <p className="font-sans text-[13px] font-semibold text-light-space/45 light:text-zinc-500">
            {resource.tag}
          </p>
        </div>
      </SiteLink>
    </article>
  );
}

export default function CareersPage() {
  useDocumentTitle("Jokuh Careers");

  return (
    <TertiaryPageChrome>
      <main>
        {/* Hero */}
        <section className={cn(CONTENT_SHELL_COMPANY, "pt-20 pb-16 text-center md:pt-24 md:pb-20")}>
          <p className={pageHeroEyebrowClass}>Company</p>
          <h1 className="mx-auto mt-5 max-w-[18ch] font-sans text-[clamp(2.5rem,7vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.005em] text-light-space light:text-zinc-950">
            Build private speech systems
          </h1>
          <p className="mx-auto mt-7 max-w-[40rem] text-balance text-pretty font-sans text-[17px] leading-[1.65] text-light-space/64 light:text-zinc-600 md:max-w-[36rem] md:text-[18px] md:leading-[1.7]">
            We&apos;re looking for curious minds from a wide range of disciplines and backgrounds.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <PillLink href={APPLY_HREF} variant="primary">
              View open roles
            </PillLink>
            <PillLink href="/about">About Jokuh</PillLink>
          </div>
        </section>

        {/* Editorial statement */}
        <section className={cn(CONTENT_SHELL_COMPANY, "py-16 text-center md:py-24")}>
          <p className="mx-auto max-w-[760px] text-balance font-sans text-[clamp(1.5rem,3.4vw,2.125rem)] font-medium leading-[1.18] tracking-[0em] text-light-space light:text-zinc-950">
            Speech systems must be advanced with knowledge of and respect for humanity&apos;s full spectrum of voices,
            contexts, and perspectives.
          </p>
        </section>

        {/* Values */}
        <section className={cn(CONTENT_SHELL_COMPANY, "pb-12 md:pb-16")}>
          <div className="mx-auto max-w-[640px]">
            <p className={cn(proseBodyMutedClass, "max-w-none")}>
              <span className="font-semibold text-light-space light:text-zinc-950">Values: </span>
              These values define what we consider to be the most important things. They guide our decision-making. We
              believe channeling these values is the most promising way to achieve our mission.
            </p>
            <ul className="mt-6 list-disc space-y-3.5 pl-5 marker:text-light-space/40 light:marker:text-zinc-400">
              {CAREERS_VALUES.map((v) => (
                <li key={v.title} className={cn(proseBodyMutedClass, "max-w-none leading-[1.6]")}>
                  <span className="font-semibold text-light-space light:text-zinc-950">{v.title}.</span> {v.body}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Operating principles */}
        <section className={cn(CONTENT_SHELL_COMPANY, "pb-12 md:pb-20")}>
          <div className="mx-auto max-w-[640px]">
            <p className={cn(proseBodyMutedClass, "max-w-none")}>
              <span className="font-semibold text-light-space light:text-zinc-950">Operating Principles: </span>
              These principles define how we work together. They are important for establishing our operating culture.
            </p>
            <ul className="mt-6 list-disc space-y-3.5 pl-5 marker:text-light-space/40 light:marker:text-zinc-400">
              {CAREERS_OPERATING_PRINCIPLES.map((p) => (
                <li key={p.title} className={cn(proseBodyMutedClass, "max-w-none leading-[1.6]")}>
                  <span className="font-semibold text-light-space light:text-zinc-950">{p.title}.</span> {p.body}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Benefits */}
        <section className={cn(CONTENT_SHELL_WIDE, "py-20 text-center md:py-28")}>
          <h2 className="font-sans text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight tracking-[0em] text-light-space light:text-zinc-950">
            Benefits
          </h2>
          <p className="mx-auto mt-5 max-w-[42rem] font-sans text-[15px] leading-[1.65] text-light-space/64 light:text-zinc-600 md:text-[16px]">
            Wellbeing centers everyday life. Our benefits package supports you as you handle what matters today and
            confidently plan for what&apos;s next.
          </p>
          <div className="mt-12 grid gap-4 text-left md:grid-cols-3 md:gap-5">
            {CAREERS_BENEFITS.map((col) => (
              <div
                key={col.heading}
                className="rounded-[6px] border border-light-space/[0.08] bg-[#1C1C1E] p-6 light:border-zinc-200/80 light:bg-white md:p-7"
              >
                <h3 className="font-sans text-[15px] font-semibold tracking-[0em] text-light-space light:text-zinc-950">
                  {col.heading}
                </h3>
                <ul className="mt-5 space-y-3 font-sans text-[13.5px] leading-[1.55] text-light-space/72 light:text-zinc-700">
                  {col.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check
                        className="mt-[3px] size-3.5 shrink-0 text-light-space/55 light:text-zinc-500"
                        strokeWidth={2.4}
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Featured roles */}
        <section className={cn(CONTENT_SHELL_COMPANY, "py-16 text-center md:py-24")}>
          <h2 className="font-sans text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight tracking-[0em] text-light-space light:text-zinc-950">
            Featured roles
          </h2>
          <p className="mx-auto mt-5 max-w-[34rem] font-sans text-[15px] leading-[1.65] text-light-space/64 light:text-zinc-600 md:text-[16px]">
            We&apos;re always seeking talented individuals to join our team.
          </p>
          <div className="mt-7 flex justify-center">
            <PillLink href={APPLY_HREF}>View open roles</PillLink>
          </div>
          <ul className="mx-auto mt-14 max-w-[52rem] divide-y divide-light-space/[0.08] text-left light:divide-zinc-200">
            {CAREERS_FEATURED_ROLES.map((role) => (
              <li key={role.title}>
                <SiteLink
                  href={role.href}
                  className="group/role grid grid-cols-1 gap-1 py-6 md:grid-cols-[1fr_auto_auto] md:items-baseline md:gap-x-8"
                >
                  <span className="font-sans text-[14.5px] leading-snug text-light-space light:text-zinc-950">
                    <span className="font-semibold">{role.title}</span>
                    <span className="ml-2 text-light-space/45 light:text-zinc-500">{role.team}</span>
                  </span>
                  <span className="font-sans text-[13px] text-light-space/55 light:text-zinc-500">{role.location}</span>
                  <span className="inline-flex items-center gap-1 font-sans text-[13.5px] font-medium text-light-space underline-offset-4 transition-colors group-hover/role:text-white group-hover/role:underline light:text-zinc-950 light:group-hover/role:text-black">
                    Apply now
                    <span aria-hidden>↗</span>
                  </span>
                </SiteLink>
              </li>
            ))}
          </ul>
        </section>

        {/* Quote — uses shared EditorialQuoteBlock */}
        <EditorialQuoteBlock text={CAREERS_QUOTE.text} attribution={CAREERS_QUOTE.attribution} />

        {/* Resources */}
        <section className={cn(CONTENT_SHELL_WIDE, "py-16 text-center md:py-24")}>
          <h2 className="font-sans text-[clamp(1.5rem,3.5vw,2rem)] font-semibold leading-tight tracking-[0em] text-light-space light:text-zinc-950">
            Resources
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 text-left md:grid-cols-3 md:gap-6 xl:gap-8">
            {CAREERS_RESOURCES.map((resource) => (
              <ResourceCard key={resource.label} resource={resource} />
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className={cn(CONTENT_SHELL_WIDE, "pb-20 md:pb-28")}>
          <div className="rounded-[6px] bg-white/[0.04] px-6 py-20 text-center light:bg-section-grey-light md:px-10 md:py-24">
            <h2 className="mx-auto max-w-[720px] font-sans text-[clamp(2rem,4.5vw,2.75rem)] font-semibold leading-[1.08] tracking-[0em] text-light-space light:text-zinc-950">
              {CAREERS_CLOSING_CTA.headline}
            </h2>
            <div className="mt-8 flex justify-center">
              <PillLink href={CAREERS_CLOSING_CTA.buttonHref}>
                {CAREERS_CLOSING_CTA.buttonLabel}
              </PillLink>
            </div>
          </div>
        </section>
      </main>
    </TertiaryPageChrome>
  );
}
