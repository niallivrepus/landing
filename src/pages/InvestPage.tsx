import { cn, useTheme } from "@jokuh/gooey";
import { FaqSection } from "../components/FaqSection";
import { FundersStrip } from "../components/landing/FundersStrip";
import { InvestImmersiveShell } from "../components/landing/InvestImmersiveShell";
import { InvestTokenCountdown } from "../components/landing/InvestTokenCountdown";
import { GooeyBackdrop } from "../components/landing/GooeyBackdrop";
import {
  PillLink,
  TertiaryClosingCta,
  TertiaryHubBody,
  TertiaryQuickLinksGrid,
  TertiarySection,
  MarketingPageFrame,
  pageHeroEyebrowClass,
  proseBodyMutedClass,
} from "../components/system";
import { CONTENT_SHELL_COMPANY, CONTENT_SHELL_WIDE } from "../components/system/shells";
import {
  INVEST_CLOSING,
  INVEST_DISCLAIMER,
  INVEST_FAQ,
  INVEST_FUND_ALLOCATION,
  INVEST_HERO,
  INVEST_RESOURCE_LINKS,
  INVEST_TOKEN_SECTION,
  INVEST_VESTING_TIERS,
} from "../data/invest-overview";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/**
 * **Purpose:** Capital & economy hub — institutional resources, token rules, vesting transparency.
 * **Connects to:** `/invest` route, `rigid-sitemap`, home Invest pill, `InvestTokenCountdown`.
 */
export function InvestPage() {
  useDocumentTitle("Invest · Jokuh");
  const { resolvedTheme } = useTheme();

  return (
    <MarketingPageFrame
      beforeChrome={<GooeyBackdrop />}
      withFontSans
      theme={resolvedTheme === "light" ? "light" : "dark"}
    >
      <InvestImmersiveShell>
        <main>
          <section className={cn(CONTENT_SHELL_COMPANY, "pb-10 text-center md:pb-12")}>
            <p className={pageHeroEyebrowClass}>{INVEST_HERO.eyebrow}</p>
            <h1 className="mx-auto mt-5 max-w-[18ch] font-sans text-[clamp(2.35rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.005em] text-light-space light:text-zinc-950">
              {INVEST_HERO.title}
            </h1>
            <p
              className={cn(
                proseBodyMutedClass,
                "mx-auto mt-7 max-w-[42rem] text-balance text-pretty text-[16px] md:text-[17px]",
              )}
            >
              {INVEST_HERO.subtitle}
            </p>

            <div className="mx-auto flex max-w-[720px] flex-col items-center">
              <InvestTokenCountdown />
            </div>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <PillLink href={INVEST_HERO.primary.href} variant="primary">
                {INVEST_HERO.primary.label}
              </PillLink>
              <PillLink href={INVEST_HERO.secondary.href}>{INVEST_HERO.secondary.label}</PillLink>
            </div>
          </section>

          <FundersStrip />

          <TertiaryHubBody>
            <TertiarySection title="Resources">
              <p>
                Pre-seed diligence for qualified partners lives in the data room. Narrative, product, and customer proof
                are one click away — no cold email required to start reading.
              </p>
              <div className="pt-4">
                <TertiaryQuickLinksGrid
                  columns={2}
                  links={INVEST_RESOURCE_LINKS.map((link) => ({
                    label: link.label,
                    href: link.href,
                    description: link.description,
                  }))}
                />
              </div>
            </TertiarySection>

            <TertiarySection title={INVEST_TOKEN_SECTION.title}>
              <p>{INVEST_TOKEN_SECTION.lead}</p>
              <div className="pt-3">
                {INVEST_TOKEN_SECTION.rules.map((rule) => (
                  <div key={rule.title} className="landing-invest-rule">
                    <h3 className="landing-invest-rule__title">{rule.title}</h3>
                    <p className="landing-invest-rule__body">{rule.body}</p>
                  </div>
                ))}
              </div>
            </TertiarySection>

            <TertiarySection title="Vesting & lock-ups">
              <p>
                Illustrative framework — every participant vests, including the smallest economy allocation. Definitive
                calendars ship in the data room and on-chain before T-zero.
              </p>
              <div className="landing-invest-vesting pt-4">
                {INVEST_VESTING_TIERS.map((tier) => (
                  <article key={tier.id} className="landing-invest-vesting__card">
                    <h3 className="landing-invest-vesting__audience">{tier.audience}</h3>
                    <div className="landing-invest-vesting__meta">
                      <span>Lock · {tier.lockUp}</span>
                      <span>Vest · {tier.vesting}</span>
                    </div>
                    <p className="landing-invest-vesting__notes">{tier.notes}</p>
                  </article>
                ))}
              </div>
            </TertiarySection>

            <TertiarySection title="Use of funds">
              <p>
                Committed allocation framework for capital we raise — product-first, security never optional, legal
                treated as infrastructure not a checkbox.
              </p>
              <div className="landing-invest-allocation pt-4">
                {INVEST_FUND_ALLOCATION.map((row) => (
                  <div key={row.label} className="landing-invest-allocation__row">
                    <span className="landing-invest-allocation__label">{row.label}</span>
                    <span className="landing-invest-allocation__percent">{row.percent}%</span>
                    <div className="landing-invest-allocation__bar-track" aria-hidden>
                      <div
                        className="landing-invest-allocation__bar-fill"
                        style={{ width: `${row.percent}%`, background: row.color }}
                      />
                    </div>
                    <p className="landing-invest-allocation__detail">{row.detail}</p>
                  </div>
                ))}
              </div>
            </TertiarySection>

            <p className="landing-invest-disclaimer">{INVEST_DISCLAIMER}</p>
          </TertiaryHubBody>

          <section className={cn(CONTENT_SHELL_WIDE, "pb-8 md:pb-12")}>
            <FaqSection items={[...INVEST_FAQ]} title="Investor FAQ" />
          </section>

          <TertiaryClosingCta
            title={INVEST_CLOSING.title}
            label={INVEST_CLOSING.label}
            href={INVEST_CLOSING.href}
          />
        </main>
      </InvestImmersiveShell>
    </MarketingPageFrame>
  );
}
