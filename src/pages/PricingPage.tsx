import { Link } from "react-router-dom";
import { CompanyPageLayout } from "../components/CompanyPageLayout";
import { FaqSection } from "../components/FaqSection";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { PRICING_CARDS, PRICING_FAQ, PRICING_HERO } from "../data/pricing";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/**
 * **Purpose:** Public `/pricing` — early access is free; team plans are forthcoming, not a homepage redirect.
 * **Connects to:** `pricing.ts`, `App.tsx`, footer Product column.
 */
export function PricingPage() {
  useDocumentTitle("Pricing — Jokuh");

  return (
    <CompanyPageLayout>
      <header className={`${CONTENT_SHELL_WIDE} pt-28 pb-10 text-center md:pt-32 md:pb-16`}>
        <p className="font-sans text-[13px] font-medium tracking-wide text-light-space/55 light:text-zinc-500">
          {PRICING_HERO.eyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-[16ch] font-sans text-[2.1rem] font-semibold leading-[1.08] text-light-space light:text-zinc-950 sm:text-5xl md:text-6xl">
          {PRICING_HERO.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-light-space/60 light:text-zinc-600">
          {PRICING_HERO.subtitle}
        </p>
      </header>

      <section className={`${CONTENT_SHELL_WIDE} grid gap-6 pb-20 md:grid-cols-2 md:pb-28`}>
        {PRICING_CARDS.map((card) => (
          <article
            key={card.id}
            className="rounded-[24px] border border-light-space/[0.08] bg-white/[0.02] p-6 light:border-zinc-200 light:bg-white md:p-8"
          >
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-light-space/45 light:text-zinc-500">
              {card.name}
            </p>
            <p className="mt-3 font-sans text-3xl font-semibold text-light-space light:text-zinc-950">{card.price}</p>
            <p className="mt-1 font-sans text-[14px] text-light-space/55 light:text-zinc-500">{card.detail}</p>
            <ul className="mt-6 space-y-3 font-sans text-[15px] leading-relaxed text-light-space/70 light:text-zinc-600">
              {card.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link
              to={card.cta.href}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-light-space px-6 font-sans text-[13px] font-semibold text-dark-space light:bg-zinc-950 light:text-white"
            >
              {card.cta.label}
            </Link>
          </article>
        ))}
      </section>

      <div className={`${CONTENT_SHELL_WIDE} pb-28`}>
        <FaqSection items={[...PRICING_FAQ]} title="Pricing FAQ" />
      </div>
    </CompanyPageLayout>
  );
}
