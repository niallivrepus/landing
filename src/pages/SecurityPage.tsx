/**
 * **Purpose:** Short public page backing the homepage “E2EE by default” claim —
 * keys stay on device, OO only sees what you allow, then a path to the Privacy Policy.
 * **Connects to:** `/security` route in `App.tsx`, `ProductDemoSection` privacy power,
 * footer/sitemap via `rigid-sitemap.ts` and `brand-taxonomy.ts`, `/privacy`.
 */
import { cn } from "@jokuh/gooey";
import { TERTIARY_PAGE_SHELL, TertiaryPageHero } from "../components/system";
import { CompanyPageLayout } from "../components/CompanyPageLayout";
import { SiteLink } from "../components/SiteLink";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const bodyText = "font-sans text-[15px] leading-relaxed text-light-space/60 light:text-zinc-600";
const linkClass = "rounded-sm text-[var(--color-blue-4)] transition-colors hover:underline";

/** Renders the /security explainer using the same tertiary company layout as Support. */
export function SecurityPage() {
  useDocumentTitle("Security — Jokuh");

  return (
    <CompanyPageLayout>
      <>
        <TertiaryPageHero
          eyebrow="Trust"
          title="Security"
          intro="Messages are end-to-end encrypted by default. Your keys live on your device. OO only sees what you let it help with."
        />

        <div className={cn(TERTIARY_PAGE_SHELL, "space-y-12 pb-24")}>
          <section className="scroll-mt-24 max-w-[720px] space-y-4">
            <h2 className="font-sans text-xl font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-2xl">
              Keys on your device
            </h2>
            <p className={bodyText}>
              End-to-end encryption is on by default for chats. The keys that unlock a conversation
              stay on the devices in that conversation — Jokuh is not sitting in the middle reading
              the thread.
            </p>
          </section>

          <section className="scroll-mt-24 max-w-[720px] space-y-4">
            <h2 className="font-sans text-xl font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-2xl">
              What OO can see
            </h2>
            <p className={bodyText}>
              OO is your private AI. It only works with the calls, chats, and files you allow. That
              context is for you — not a shared model, not another person’s workspace.
            </p>
          </section>

          <section className="scroll-mt-24 max-w-[720px] space-y-4">
            <h2 className="font-sans text-xl font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-2xl">
              Privacy Policy
            </h2>
            <p className={bodyText}>
              How we collect and retain account data is in the{" "}
              <SiteLink href="/privacy" className={linkClass}>
                Privacy Policy
              </SiteLink>
              .
            </p>
          </section>
        </div>
      </>
    </CompanyPageLayout>
  );
}
