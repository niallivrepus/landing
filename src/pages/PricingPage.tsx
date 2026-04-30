import { cn } from "@jokuh/gooey";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { CompanyPageClosingCta, COMPANY_PAGE_SHELL } from "../components/CompanyPageLayout";
import { FaqSection, type FaqEntry } from "../components/FaqSection";
import { TertiaryPageChrome, bodyLgClass, headingClass, pageHeroEyebrowClass } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import {
  B2B_PLAN_COMPARISON_GROUPS,
  BUSINESS_OFFERS,
  PERSONAL_PLANS_STRIP,
  PRICING_FAQ,
  PRICING_HERO,
  TRUSTED_LINE,
} from "../data/pricing-page";
import { useGentleHoverSound } from "../hooks/useGentleHoverSound";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function ComparisonValue({ value }: { value: string }) {
  if (value === "✓") {
    return (
      <span className="inline-flex justify-center" title="Included">
        <Check className="size-[18px] text-light-space light:text-zinc-950" strokeWidth={2.25} aria-hidden />
        <span className="sr-only">Included</span>
      </span>
    );
  }

  return <span>{value}</span>;
}

export default function PricingPage() {
  useDocumentTitle("Pricing — Jokuh");
  const hover = useGentleHoverSound();
  const faqItems: FaqEntry[] = PRICING_FAQ.map((x) => ({ question: x.question, answer: x.answer }));

  return (
    <TertiaryPageChrome theme="dark">
      <header className="px-4 pb-20 pt-24 text-center md:pb-28 md:pt-32">
        <p className={cn(pageHeroEyebrowClass, "text-light-space/82 light:text-zinc-700")}>
          {PRICING_HERO.eyebrow}
        </p>
        <h1 className="mt-7 font-sans text-[clamp(3.25rem,8vw,5.75rem)] font-medium leading-[0.96] tracking-[0em] text-light-space light:text-zinc-950">
          {PRICING_HERO.title}
        </h1>
        <p className={cn(bodyLgClass, "mx-auto mt-7 max-w-[620px] text-light-space/72 light:text-zinc-600")}>
          {PRICING_HERO.lead}
        </p>
      </header>

      <section
        id="plans"
        className="scroll-mt-24 pb-20 md:pb-28"
        aria-labelledby="business-plans-heading"
      >
        <div className={cn(CONTENT_SHELL_WIDE)}>
          <h2
            id="business-plans-heading"
            className={cn(headingClass, "max-w-[40ch] font-semibold tracking-[0em]")}
          >
            Business
          </h2>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {BUSINESS_OFFERS.map((b) => (
              <div
                key={b.name}
                className={cn(
                  "flex min-h-[560px] flex-col rounded-[8px] border bg-black/10 p-5 md:p-8 light:bg-white",
                  b.highlight
                    ? "border-light-space/[0.18] light:border-zinc-300/90 light:shadow-[0_1px_0_rgba(0,0,0,0.04),0_20px_50px_-32px_rgba(0,0,0,0.18)]"
                    : "border-light-space/[0.1] light:border-zinc-200/80",
                )}
              >
                <h3 className={cn(headingClass, "font-semibold tracking-[0em]")}>
                  {b.name}
                </h3>
                <p className="mt-5 max-w-[34rem] text-[17px] leading-[1.45] text-light-space/50 light:text-zinc-500">
                  {b.description}
                </p>

                <div className="mt-8 py-8">
                  <p
                    className={cn(
                      "font-sans font-semibold tracking-[0em] text-light-space light:text-zinc-950",
                      b.highlight ? "text-[28px] leading-tight" : "text-[34px] leading-none md:text-[42px]",
                    )}
                  >
                    {b.priceHeadline}
                  </p>
                  {b.priceSubline ? (
                    <p className="mt-2 text-[14px] leading-snug text-light-space/50 light:text-zinc-500">{b.priceSubline}</p>
                  ) : null}
                </div>

                <Link
                  to={b.href}
                  className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-light-space px-6 text-center font-sans text-[15px] font-semibold text-dark-space transition-opacity hover:opacity-86 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-space"
                  {...hover}
                >
                  {b.ctaLabel}
                </Link>

                <p className={cn("mt-9 font-sans text-[15px] font-semibold text-light-space light:text-zinc-950")}>
                  What&apos;s included
                </p>
                <ul className="mt-3 flex-1 space-y-2.5 text-[15px] leading-[1.55] text-light-space/75 light:text-zinc-700">
                  {b.bullets.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-light-space/40 light:text-zinc-400"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 text-center md:py-32">
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-sans text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-[0em] text-light-space light:text-zinc-950">
            {PERSONAL_PLANS_STRIP.title}
          </h2>
          <p className="mt-8 text-[18px] leading-[1.55] text-light-space/62 light:text-zinc-600">
            {PERSONAL_PLANS_STRIP.line}
          </p>
          <Link
            to="/download"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-light-space/[0.12] px-7 font-sans text-[15px] font-semibold text-light-space transition-colors hover:bg-light-space/[0.18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-space"
            {...hover}
          >
            {PERSONAL_PLANS_STRIP.ctaLabel}
          </Link>
        </div>
      </section>

      <section className="px-4 py-24 text-center md:py-32">
        <h2 className={cn(headingClass, "font-semibold text-light-space/88 light:text-zinc-950")}>Trusted by</h2>
        <p className="mx-auto mt-16 max-w-[920px] font-sans text-[20px] font-semibold leading-[1.7] text-light-space/72 light:text-zinc-600 md:text-[24px]">
          {TRUSTED_LINE}
        </p>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="compare-heading">
        <div className={cn(CONTENT_SHELL_WIDE)}>
          <p className="text-center font-sans text-[15px] font-semibold text-light-space/64 light:text-zinc-500">
            Pricing
          </p>
          <h2
            id="compare-heading"
            className="mt-8 text-center font-sans text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-[0em] text-light-space light:text-zinc-950"
          >
            Compare features across plans
          </h2>

          <div className="mt-20 overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-left font-sans">
              <caption className="sr-only">Compare Jokuh Business and Enterprise</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[42%] pb-8 md:w-[46%]" />
                  <th scope="col" className="pb-8 text-center text-[15px] font-semibold text-light-space light:text-zinc-950 md:text-[22px]">
                    Business
                  </th>
                  <th scope="col" className="pb-8 text-center text-[15px] font-semibold text-light-space light:text-zinc-950 md:text-[22px]">
                    Enterprise
                  </th>
                </tr>
              </thead>
              {B2B_PLAN_COMPARISON_GROUPS.map((group) => (
                <tbody key={group.label}>
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={3}
                      className="pb-6 pt-14 text-left text-[22px] font-semibold text-light-space light:text-zinc-950 md:pb-8 md:pt-16 md:text-[26px]"
                    >
                      {group.label}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.feature}>
                      <th scope="row" className="py-5 pr-3 text-[13px] font-semibold text-light-space/88 light:text-zinc-800 md:py-6 md:pr-6 md:text-[16px]">
                        {row.feature}
                      </th>
                      <td className="px-2 py-5 text-center text-[13px] text-light-space/75 light:text-zinc-700 md:px-6 md:py-6 md:text-[16px]">
                        <ComparisonValue value={row.business} />
                      </td>
                      <td className="px-2 py-5 text-center text-[13px] text-light-space/75 light:text-zinc-700 md:px-6 md:py-6 md:text-[16px]">
                        <ComparisonValue value={row.enterprise} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      <div className={cn(COMPANY_PAGE_SHELL, "py-20 md:py-28")}>
        <FaqSection items={faqItems} title="FAQ" />
      </div>

      <CompanyPageClosingCta
        buttonLabel="Talk to us"
        buttonTo="/contact"
        headline="Need a number that matches your rollout?"
      />
    </TertiaryPageChrome>
  );
}
