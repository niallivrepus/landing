import { JokuhButton } from "../system/JokuhButton";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { FundersStrip } from "./FundersStrip";

/**
 * **Purpose:** Thin post-claim satellite — investor path + funders, off the critical conversion path.
 * **Connects to:** `Home.tsx` (after `IdentityBlock`), `/invest`.
 */
export function InvestorBranchSection() {
  return (
    <section id="investors" className="landing-cv scroll-mt-24 bg-dark-space light:bg-white">
      <div className={CONTENT_SHELL_WIDE}>
        <div className="flex flex-col gap-4 border-t border-light-space/10 py-10 light:border-black/10 sm:flex-row sm:items-center sm:justify-between md:py-12">
          <p className="max-w-[36ch] font-sans text-[14px] leading-relaxed text-light-space/55 light:text-zinc-600">
            Building the machine layer for human identity.
          </p>
          <JokuhButton href="/invest" variant="secondary" size="md">
            For investors
          </JokuhButton>
        </div>
      </div>
      <FundersStrip />
    </section>
  );
}
