/**
 * **Purpose:** Public `/defense` page — "Defense technology for free people". Principles, what is
 * built today, and a clearly labeled roadmap. Draft for owner review: not in the top nav or footer yet.
 * **Connects to:** `data/defense.ts` (all copy + accuracy rules), `/defense` route in `App.tsx`,
 * `KNOWN_SPA_PREFIXES` in `server/static-middleware.ts`, search via `lib/site-search-articles.ts`,
 * `public/sitemap.xml`, CTAs to `/contact` and `/security`.
 */
import { cn } from "@jokuh/gooey";
import { Check, KeyRound, Lock, MessageSquareLock, MonitorSmartphone, type LucideIcon } from "lucide-react";
import {
  DEFENSE_BUILT_TODAY,
  DEFENSE_CLOSING,
  DEFENSE_HERO,
  DEFENSE_PRINCIPLES,
  DEFENSE_PRINCIPLES_HEADING,
  DEFENSE_ROADMAP,
  DEFENSE_SIGNATURE_TEXT,
  type DefensePrinciple,
  type DefensePrincipleIcon,
} from "../data/defense";
import { CompanyPageLayout } from "../components/CompanyPageLayout";
import { JokuhButton, SquircleShell, pageHeroEyebrowUppercaseClass } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const PRINCIPLE_ICONS: Record<DefensePrincipleIcon, LucideIcon> = {
  lock: Lock,
  key: KeyRound,
  seal: MessageSquareLock,
  devices: MonitorSmartphone,
};

const sectionTitleClass =
  "font-sans text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight tracking-[0em] text-light-space light:text-zinc-950";
const sectionIntroClass =
  "mt-3 max-w-[40rem] font-sans text-[15px] leading-relaxed text-light-space/60 light:text-zinc-600 md:text-[16px]";
/** Gooey `Squircle` strokes with `currentColor` of its svg, so the rim colour is set as text colour. */
const cardStroke = "text-white/[0.12] light:text-zinc-200";
const cardFill = "bg-white/[0.03] backdrop-blur-[18px] light:bg-white";

function PrincipleCard({ principle }: { principle: DefensePrinciple }) {
  const Icon = PRINCIPLE_ICONS[principle.icon];
  return (
    <SquircleShell
      cornerRadius={28}
      borderWidth={1}
      strokeClassName={cardStroke}
      fillClassName={cardFill}
      className="h-full"
      contentClassName="flex h-full flex-col p-6 md:p-7"
    >
      <span
        aria-hidden
        className="flex size-10 items-center justify-center rounded-[12px] bg-white/[0.06] text-light-space light:bg-zinc-100 light:text-zinc-900"
      >
        <Icon className="size-[18px]" strokeWidth={1.8} />
      </span>
      <h3 className="mt-6 font-sans text-[17px] font-semibold leading-snug text-light-space light:text-zinc-950">
        {principle.title}
      </h3>
      <p className="mt-2 font-sans text-[14.5px] leading-[1.6] text-light-space/60 light:text-zinc-600">
        {principle.body}
      </p>
    </SquircleShell>
  );
}

/** "JOKUH: Joining Our Knowledge, Unifying Humanity." with the initials quietly brighter. */
function NameSignature() {
  const { wordmark, words } = DEFENSE_CLOSING.signature;
  return (
    <p className="mx-auto mt-14 max-w-[36rem] text-balance font-sans text-[13px] leading-relaxed tracking-[0.02em] text-light-space/40 light:text-zinc-400">
      <span className="sr-only">{DEFENSE_SIGNATURE_TEXT}</span>
      <span aria-hidden>
        <span className="font-semibold tracking-[0.18em] text-light-space/70 light:text-zinc-700">{wordmark}</span>
        {": "}
        {words.map((word, index) => (
          <span key={word}>
            <span className="font-semibold text-light-space/80 light:text-zinc-800">{word.charAt(0)}</span>
            {word.slice(1)}
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </p>
  );
}

export function DefensePage() {
  useDocumentTitle("Defense — Jokuh");

  return (
    <CompanyPageLayout>
      <main>
        {/* Hero */}
        <section className={cn(CONTENT_SHELL_WIDE, "pt-20 pb-16 text-center md:pt-28 md:pb-24")}>
          <p className={pageHeroEyebrowUppercaseClass}>{DEFENSE_HERO.eyebrow}</p>
          <h1 className="mx-auto mt-5 max-w-[16ch] text-balance font-sans text-[clamp(2.5rem,6.4vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.005em] text-light-space light:text-zinc-950">
            {DEFENSE_HERO.title}
          </h1>
          <p className="mx-auto mt-7 max-w-[38rem] text-pretty font-sans text-[16px] leading-[1.6] text-light-space/64 light:text-zinc-600 md:text-[18px]">
            {DEFENSE_HERO.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <JokuhButton href={DEFENSE_HERO.primary.href} variant="primary" size="lg">
              {DEFENSE_HERO.primary.label}
            </JokuhButton>
            <JokuhButton href={DEFENSE_HERO.secondary.href} variant="secondary" size="lg">
              {DEFENSE_HERO.secondary.label}
            </JokuhButton>
          </div>
        </section>

        {/* Principles */}
        <section aria-labelledby="defense-principles" className={cn(CONTENT_SHELL_WIDE, "pb-20 md:pb-28")}>
          <h2 id="defense-principles" className={sectionTitleClass}>
            {DEFENSE_PRINCIPLES_HEADING.title}
          </h2>
          <p className={sectionIntroClass}>{DEFENSE_PRINCIPLES_HEADING.intro}</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {DEFENSE_PRINCIPLES.map((principle) => (
              <li key={principle.id}>
                <PrincipleCard principle={principle} />
              </li>
            ))}
          </ul>
        </section>

        {/* Built today */}
        <section aria-labelledby="defense-built" className={cn(CONTENT_SHELL_WIDE, "pb-20 md:pb-28")}>
          <div className="grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
            <div>
              <h2 id="defense-built" className={sectionTitleClass}>
                {DEFENSE_BUILT_TODAY.title}
              </h2>
              <p className={sectionIntroClass}>{DEFENSE_BUILT_TODAY.intro}</p>
            </div>
            <SquircleShell
              cornerRadius={28}
              borderWidth={1}
              strokeClassName={cardStroke}
              fillClassName={cardFill}
              contentClassName="p-6 md:p-8"
            >
              <ul className="divide-y divide-light-space/[0.08] light:divide-zinc-200">
                {DEFENSE_BUILT_TODAY.items.map((item) => (
                  <li key={item} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                    <Check
                      aria-hidden
                      className="mt-[3px] size-4 shrink-0 text-light-space/70 light:text-zinc-700"
                      strokeWidth={2.2}
                    />
                    <span className="font-sans text-[15px] leading-[1.55] text-light-space/80 light:text-zinc-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </SquircleShell>
          </div>
        </section>

        {/* Roadmap — intent, not availability */}
        <section aria-labelledby="defense-roadmap" className={cn(CONTENT_SHELL_WIDE, "pb-20 md:pb-28")}>
          <div className="grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
            <div>
              <p className="inline-flex items-center rounded-full border border-light-space/[0.14] px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-light-space/60 light:border-zinc-300 light:text-zinc-500">
                {DEFENSE_ROADMAP.badge}
              </p>
              <h2 id="defense-roadmap" className={cn(sectionTitleClass, "mt-4")}>
                {DEFENSE_ROADMAP.title}
              </h2>
              <p className={sectionIntroClass}>{DEFENSE_ROADMAP.intro}</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {DEFENSE_ROADMAP.items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-[24px] border border-dashed border-light-space/[0.16] p-6 light:border-zinc-300 md:p-7"
                >
                  <h3 className="font-sans text-[16px] font-semibold leading-snug text-light-space light:text-zinc-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-sans text-[14.5px] leading-[1.6] text-light-space/60 light:text-zinc-600">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing */}
        <section className={cn(CONTENT_SHELL_WIDE, "pb-24 md:pb-32")}>
          <SquircleShell
            cornerRadius={36}
            borderWidth={1}
            strokeClassName={cardStroke}
            fillClassName="bg-white/[0.04] light:bg-section-grey-light"
            contentClassName="px-6 py-20 text-center md:px-10 md:py-24"
          >
            <h2 className="mx-auto max-w-[22ch] text-balance font-sans text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-[0em] text-light-space light:text-zinc-950">
              {DEFENSE_CLOSING.headline}
            </h2>
            <div className="mt-8 flex justify-center">
              <JokuhButton href={DEFENSE_CLOSING.buttonHref} variant="primary" size="lg">
                {DEFENSE_CLOSING.buttonLabel}
              </JokuhButton>
            </div>
            <NameSignature />
          </SquircleShell>
        </section>
      </main>
    </CompanyPageLayout>
  );
}
