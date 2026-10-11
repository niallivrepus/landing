/**
 * **Purpose:** Public `/agents` page — how Jokuh agents work and where to find them: hero with the interactive
 * OOpolis figure, the three-step start, the inbox (numbered answers), OOpolis, next steps, status dots, "Tell your
 * agents", built-in Jokuh tools, connectors, safety (+ approvals figure), coding agents (+ bridge figure), where to
 * find it, FAQs. Features still shipping carry a "Rolling out" tag.
 * Same tertiary layout as `/business` (SiteTopBar + MegaFooter via `TertiaryPageChrome`).
 * **Connects to:** `data/agents-page.ts` (all copy + accuracy rules), `/agents` route in `App.tsx`,
 * `KNOWN_SPA_PREFIXES` in `server/static-middleware.ts`, search via `lib/site-search-articles.ts`, `public/sitemap.xml`,
 * `config/brand-taxonomy.ts`, `data/rigid-sitemap.ts`, homepage Agents tile (`console-home-products.ts`),
 * `public/agents/` (OOpolis renders + avatars), `components/FigureEmbed.tsx` + `public/figures/` (interactive figures).
 */
import { cn } from "@jokuh/gooey";
import type { ReactNode } from "react";
import { FaqSection } from "../components/FaqSection";
import { FigureEmbed } from "../components/FigureEmbed";
import { PillLink, SquircleMedia, TertiaryPageChrome, pageHeroEyebrowClass } from "../components/system";
import { CONTENT_SHELL_COMPANY, CONTENT_SHELL_WIDE } from "../components/system/shells";
import {
  AGENTS_CLOSING,
  AGENTS_CODING,
  AGENTS_CONNECTORS,
  AGENTS_FAQ,
  AGENTS_FEATURES,
  AGENTS_FIGURE_LEADS,
  AGENTS_HERO,
  AGENTS_IMAGES,
  AGENTS_INBOX,
  AGENTS_INBOX_DEMO,
  AGENTS_OOPOLIS,
  AGENTS_PAGE_TITLE,
  AGENTS_SAFETY,
  AGENTS_STEPS,
  AGENTS_WHERE,
  type AgentsFeature,
  type AgentsFeatureStatus,
  type AgentsInboxDemoRow,
} from "../data/agents-page";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const sectionTitleClass =
  "font-sans text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight tracking-[0em] text-light-space light:text-zinc-950";
const blockTitleClass =
  "max-w-[24ch] font-sans text-[24px] font-semibold leading-[1.18] tracking-[0em] text-light-space light:text-zinc-950 md:text-[28px]";
const bodyClass = "font-sans text-[16px] leading-[1.65] text-light-space/64 light:text-zinc-600";
const cardClass =
  "rounded-[24px] border border-light-space/[0.08] bg-white/[0.02] p-6 light:border-black/[0.08] light:bg-section-grey-light";
const cardTitleClass = "font-sans text-[17px] font-semibold tracking-[0em] text-light-space light:text-zinc-950";
const cardBodyClass = "mt-2 font-sans text-[14.5px] leading-[1.6] text-light-space/58 light:text-zinc-600";

/** OOpolis state colours (`docs/oopolis-plan.md`): blue working, amber needs you, red stuck, green done. */
const STATUS_DOTS = [
  { label: "Working", color: "var(--color-blue-4, #0a84ff)" },
  { label: "Needs you", color: "var(--color-yellow-4, #ffb800)" },
  { label: "Stuck", color: "var(--color-red-4, #ff3b30)" },
  { label: "Done", color: "var(--color-green-4, #21dc11)" },
] as const;

const KIND_COLOR: Record<AgentsInboxDemoRow["kind"], string> = {
  Approval: STATUS_DOTS[1].color,
  Question: STATUS_DOTS[1].color,
  Stuck: STATUS_DOTS[2].color,
  Done: STATUS_DOTS[3].color,
};

export function AgentsPage() {
  useDocumentTitle(AGENTS_PAGE_TITLE);

  return (
    <TertiaryPageChrome>
      <main>
        {/* Hero */}
        <section className={cn(CONTENT_SHELL_COMPANY, "pt-20 pb-12 text-center md:pt-24 md:pb-16")}>
          <p className={pageHeroEyebrowClass}>{AGENTS_HERO.eyebrow}</p>
          <h1 className="mx-auto mt-5 max-w-[20ch] text-balance font-sans text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.005em] text-light-space light:text-zinc-950">
            {AGENTS_HERO.title}
          </h1>
          <p className="mx-auto mt-7 max-w-[36rem] text-balance text-pretty font-sans text-[16px] leading-[1.6] text-light-space/64 light:text-zinc-600 md:text-[17px]">
            {AGENTS_HERO.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <PillLink href={AGENTS_HERO.primary.href} variant="primary">
              {AGENTS_HERO.primary.label}
            </PillLink>
            <PillLink href={AGENTS_HERO.secondary.href}>{AGENTS_HERO.secondary.label}</PillLink>
          </div>
          <p className="mx-auto mt-6 max-w-[34rem] text-pretty font-sans text-[13px] leading-[1.5] text-light-space/45 light:text-zinc-500">
            {AGENTS_HERO.note}
          </p>
        </section>

        <section className={cn(CONTENT_SHELL_WIDE, "pb-16 md:pb-24")}>
          <FigureEmbed id="oopolis-workshop" className="max-w-[880px]" />
        </section>

        {/* How it works */}
        <section id="how-it-works" className={cn(CONTENT_SHELL_WIDE, "scroll-mt-24 py-12 md:py-16")}>
          <h2 className={sectionTitleClass}>How it works</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {AGENTS_STEPS.map((step, index) => (
              <li key={step.title} className={cardClass}>
                <Keycap large>{index + 1}</Keycap>
                <h3 className={cn(cardTitleClass, "mt-5")}>{step.title}</h3>
                <p className={cardBodyClass}>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Inbox + OOpolis */}
        <section className={cn(CONTENT_SHELL_COMPANY, "py-4 md:py-8")}>
          <FeatureBlock feature={AGENTS_INBOX} media={<InboxIllustration />} />
          <FeatureBlock feature={AGENTS_OOPOLIS} media={<OopolisPhone />} mediaFirst />
        </section>

        {/* More features */}
        <section className={cn(CONTENT_SHELL_WIDE, "py-12 md:py-16")}>
          <h2 className={sectionTitleClass}>Small things that save time</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {AGENTS_FEATURES.map((feature) => (
              <article key={feature.id} id={feature.id} className={cn(cardClass, "scroll-mt-24")}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className={cardTitleClass}>{feature.title}</h3>
                  <StatusTag status={feature.status} />
                </div>
                <p className={cardBodyClass}>{feature.body}</p>
                {feature.id === "status-dots" ? <StatusDotsLegend /> : null}
              </article>
            ))}
          </div>
        </section>

        {/* Connectors */}
        <section id="connectors" className={cn(CONTENT_SHELL_WIDE, "scroll-mt-24 py-12 md:py-16")}>
          <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-16">
            <div>
              <h2 className={sectionTitleClass}>{AGENTS_CONNECTORS.title}</h2>
              <p className={cn(bodyClass, "mt-5 max-w-[34rem]")}>{AGENTS_CONNECTORS.body}</p>
            </div>
            <ul className="flex flex-wrap gap-2.5" aria-label="Apps agents can connect to">
              {AGENTS_CONNECTORS.apps.map((app) => (
                <li
                  key={app.name}
                  className="inline-flex items-center gap-2 rounded-full border border-light-space/[0.1] bg-white/[0.03] px-4 py-2.5 font-sans text-[15px] font-medium text-light-space light:border-black/[0.1] light:bg-section-grey-light light:text-zinc-950"
                >
                  {app.name}
                  {app.note ? (
                    <span className="text-[12.5px] font-medium text-light-space/50 light:text-zinc-500">{app.note}</span>
                  ) : null}
                </li>
              ))}
              <li className="inline-flex items-center px-2 py-2.5 font-sans text-[15px] text-light-space/50 light:text-zinc-500">
                {AGENTS_CONNECTORS.more}
              </li>
            </ul>
          </div>
        </section>

        {/* Safety */}
        <section id="safety" className={cn(CONTENT_SHELL_WIDE, "scroll-mt-24 py-12 md:py-16")}>
          <h2 className={sectionTitleClass}>{AGENTS_SAFETY.title}</h2>
          <p className={cn(bodyClass, "mt-4 max-w-[40rem]")}>{AGENTS_SAFETY.intro}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AGENTS_SAFETY.points.map((point) => (
              <article key={point.title} className={cardClass}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className={cardTitleClass}>{point.title}</h3>
                  <StatusTag status={point.status} />
                </div>
                <p className={cardBodyClass}>{point.body}</p>
              </article>
            ))}
          </div>
          <p className={cn(bodyClass, "mx-auto mt-14 max-w-[760px] md:mt-20")}>{AGENTS_FIGURE_LEADS.safety}</p>
          <FigureEmbed id="agent-approvals" className="mt-6 max-w-[760px]" />
        </section>

        {/* Coding agents */}
        <section className={cn(CONTENT_SHELL_COMPANY, "py-4 md:py-8")}>
          <FeatureBlock
            feature={AGENTS_CODING}
            media={<FigureEmbed id="coding-bridge" caption="Interactive figure. The timer is shortened for the demo." />}
          />
        </section>

        {/* Where to find it */}
        <section id="where" className={cn(CONTENT_SHELL_WIDE, "scroll-mt-24 py-12 md:py-16")}>
          <h2 className={sectionTitleClass}>{AGENTS_WHERE.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AGENTS_WHERE.places.map((place) => (
              <article key={place.title} className={cardClass}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className={cn(cardTitleClass, place.title.startsWith("/") && "font-mono text-[16px]")}>
                    {place.title}
                  </h3>
                  <StatusTag status={place.status} />
                </div>
                <p className={cardBodyClass}>{place.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <div className={cn(CONTENT_SHELL_WIDE, "py-16 md:py-24")}>
          <FaqSection items={[...AGENTS_FAQ]} />
        </div>

        {/* Closing card */}
        <section className={cn(CONTENT_SHELL_WIDE, "pb-24 md:pb-32")}>
          <div className="rounded-[6px] bg-white/[0.04] px-6 py-20 text-center light:bg-section-grey-light md:px-10 md:py-24">
            <h2 className="mx-auto max-w-[760px] text-balance font-sans text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-[0em] text-light-space light:text-zinc-950">
              {AGENTS_CLOSING.title}
            </h2>
            <p className={cn(bodyClass, "mx-auto mt-4 max-w-[34rem]")}>{AGENTS_SAFETY.intro}</p>
            <div className="mt-8 flex justify-center">
              <PillLink href={AGENTS_CLOSING.href} variant="primary">
                {AGENTS_CLOSING.label}
              </PillLink>
            </div>
          </div>
        </section>
      </main>
    </TertiaryPageChrome>
  );
}

function OopolisPhone() {
  return (
    <SquircleMedia className="aspect-[4/5] w-full sm:aspect-square">
      <div className="relative size-full overflow-hidden bg-black">
        <img
          src={AGENTS_IMAGES.hive}
          alt=""
          aria-hidden
          decoding="async"
          loading="lazy"
          className="absolute inset-0 size-full object-cover opacity-60"
        />
        <img
          src={AGENTS_IMAGES.phone}
          alt="The OOpolis sheet on a phone: counts of agents working, needing you, resting and asleep, today's actions and spend, the city, and a field to give an agent a task."
          width={750}
          height={1530}
          loading="lazy"
          decoding="async"
          className="absolute top-1/2 left-1/2 h-[90%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </SquircleMedia>
  );
}

function FeatureBlock({
  feature,
  media,
  mediaFirst = false,
}: {
  feature: AgentsFeature;
  media: ReactNode;
  mediaFirst?: boolean;
}) {
  return (
    <article
      id={feature.id}
      className={cn(
        "grid scroll-mt-24 gap-10 py-14 md:items-center md:gap-16 md:py-20",
        mediaFirst ? "md:grid-cols-[1.05fr_0.95fr]" : "md:grid-cols-[0.95fr_1.05fr]",
      )}
    >
      <div className={cn(mediaFirst && "md:order-2")}>
        <StatusTag status={feature.status} />
        <h2 className={cn(blockTitleClass, "mt-4")}>{feature.title}</h2>
        <p className={cn(bodyClass, "mt-5 max-w-[34rem]")}>{feature.body}</p>
      </div>
      <div className={cn(mediaFirst && "md:order-1")}>{media}</div>
    </article>
  );
}

/** Static picture of the Agents inbox: one row per kind, numbered answers as keycaps. Not interactive. */
function InboxIllustration() {
  return (
    <figure>
      <div
        role="img"
        aria-label="Example Agents inbox with four rows: an approval to pay an invoice (1 Approve, 2 Deny, 3 Open), a question with two options, finished work with two suggested next steps, and a stuck agent with Retry."
        className="rounded-[28px] border border-light-space/[0.08] bg-white/[0.03] p-2.5 light:border-black/[0.08] light:bg-section-grey-light sm:p-3"
      >
        <div aria-hidden className="flex items-center justify-between px-3 pt-2 pb-3">
          <span className="font-sans text-[15px] font-semibold text-light-space light:text-zinc-950">Inbox</span>
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--color-yellow-4,#ffb800)] px-1.5 font-sans text-[12px] font-bold leading-5 text-black">
            {AGENTS_INBOX_DEMO.length}
          </span>
        </div>
        <ul aria-hidden className="space-y-1.5">
          {AGENTS_INBOX_DEMO.map((row, index) => (
            <li
              key={row.agent}
              className={cn(
                "flex gap-3 rounded-[20px] px-3 py-3",
                index === 0
                  ? "bg-white/[0.07] ring-1 ring-light-space/[0.14] light:bg-white light:ring-black/[0.1]"
                  : "bg-white/[0.025] light:bg-white/60",
              )}
            >
              <img src={row.avatar} alt="" width={36} height={36} loading="lazy" className="size-9 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 font-sans text-[13px] leading-5">
                  <span className="font-semibold text-light-space light:text-zinc-950">{row.agent}</span>
                  <span className="inline-flex items-center gap-1.5 text-light-space/55 light:text-zinc-500">
                    <span className="size-1.5 rounded-full" style={{ background: KIND_COLOR[row.kind] }} />
                    {row.kind}
                  </span>
                </p>
                <p className="mt-0.5 font-sans text-[14.5px] font-medium leading-snug text-light-space light:text-zinc-950">
                  {row.title}
                </p>
                {row.body ? (
                  <p className="mt-0.5 font-sans text-[13px] leading-snug text-light-space/55 light:text-zinc-500">{row.body}</p>
                ) : null}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {row.actions.map((action) => (
                    <span
                      key={action.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-light-space/[0.1] bg-white/[0.04] py-1 pr-3 pl-1.5 font-sans text-[12.5px] font-medium text-light-space/85 light:border-black/[0.1] light:bg-white light:text-zinc-800"
                    >
                      {action.key ? <Keycap>{action.key}</Keycap> : <span className="w-1" />}
                      {action.label}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 font-sans text-[13px] text-light-space/45 light:text-zinc-500">
        Illustration. Agent names are examples.
      </figcaption>
    </figure>
  );
}

function StatusDotsLegend() {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2" aria-label="Status dot colours">
      {STATUS_DOTS.map((dot) => (
        <li key={dot.label} className="inline-flex items-center gap-2 font-sans text-[13px] text-light-space/65 light:text-zinc-600">
          <span aria-hidden className="size-2 rounded-full" style={{ background: dot.color }} />
          {dot.label}
        </li>
      ))}
    </ul>
  );
}

function StatusTag({ status }: { status: AgentsFeatureStatus }) {
  if (status !== "rolling-out") return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-light-space/[0.14] px-2.5 py-0.5 font-sans text-[12px] font-medium leading-5 text-light-space/70 light:border-black/[0.12] light:text-zinc-600">
      <span aria-hidden className="size-1.5 rounded-full bg-current opacity-60" />
      Rolling out
    </span>
  );
}

function Keycap({ children, large = false }: { children: ReactNode; large?: boolean }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-[7px] border border-light-space/[0.16] bg-white/[0.06] font-sans font-semibold text-light-space shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)] light:border-black/[0.14] light:bg-white light:text-zinc-950 light:shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)]",
        large ? "size-9 text-[15px]" : "h-5 min-w-5 px-1 text-[11.5px]",
      )}
    >
      {children}
    </kbd>
  );
}
