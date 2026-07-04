import { cn } from "@jokuh/gooey";
import { PillLink } from "../system";
import { CONTENT_SHELL_WIDE } from "../system/shells";

export function PreFooterCta() {
  return (
    <section className={cn(CONTENT_SHELL_WIDE, "pb-6 md:pb-8")} aria-labelledby="pre-footer-cta-heading">
      <div className="rounded-[6px] bg-white/[0.04] px-6 py-20 text-center light:bg-section-grey-light md:px-10 md:py-24">
        <h2
          id="pre-footer-cta-heading"
          className="mx-auto max-w-[720px] font-sans text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.08] tracking-[0em] text-light-space light:text-zinc-950"
        >
          Get started
        </h2>
        <div className="mt-8 flex justify-center">
          <PillLink href="/download" variant="primary">
            Download
          </PillLink>
        </div>
      </div>
    </section>
  );
}
