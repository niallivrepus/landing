import { SiteLink } from "../SiteLink";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { FundersStrip } from "./FundersStrip";

export function InvestorBranchSection() {
  return (
    <section id="investors" className="landing-cv scroll-mt-24 bg-dark-space light:bg-white">
      <div className={CONTENT_SHELL_WIDE}>
        <div className="flex flex-col gap-8 border-t border-light-space/10 py-16 light:border-black/10 md:flex-row md:items-end md:justify-between md:py-20">
          <h2 className="max-w-[18ch] font-sans text-[2rem] font-semibold leading-[1.08] tracking-[0em] text-light-space light:text-zinc-950 md:text-[2.75rem]">
            Building the machine layer for human identity.
          </h2>
          <SiteLink
            href="/invest"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-light-space/15 px-6 font-sans text-[14px] font-semibold text-light-space no-underline transition-colors hover:bg-white/5 light:border-black/15 light:text-zinc-950 light:hover:bg-black/5"
          >
            For investors
          </SiteLink>
        </div>
      </div>
      <FundersStrip />
    </section>
  );
}
