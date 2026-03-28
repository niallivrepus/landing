import { cn } from "@jokuh/gooey";
import { Link } from "react-router-dom";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";
import { CtaLordIcon } from "../CtaLordIcon";

export function PreFooterCta() {
  const hoverSoundProps = useGentleHoverSound();

  return (
    <section className="px-4 pb-6 md:px-8 md:pb-8" aria-labelledby="pre-footer-cta-heading">
      <div
        className={cn(
          "mx-auto flex w-full max-w-[980px] flex-col items-center justify-center rounded-lg border border-light-space/[0.08] bg-smoke-2 px-6 py-20 md:px-10 md:py-[5rem] light:border-black/[0.08] light:bg-white light:shadow-[0_20px_60px_-24px_rgba(0,0,0,0.08)]",
        )}
      >
        <h2
          id="pre-footer-cta-heading"
          className="text-center font-sans text-2xl font-semibold text-light-space light:text-zinc-950 md:text-3xl"
        >
          Get started
        </h2>
        <Link
          to="/download"
          {...hoverSoundProps}
          className="premium-soft-button mt-8 inline-flex h-11 min-w-[7.5rem] items-center justify-center gap-2 rounded-full bg-white px-8 font-sans text-sm font-medium text-zinc-950 shadow-[0_8px_28px_-14px_rgba(0,0,0,0.45)] hover:bg-zinc-100 hover:shadow-[0_18px_34px_-24px_rgba(0,0,0,0.4)] active:translate-y-px light:border light:border-zinc-200/90 light:bg-white light:text-zinc-950 light:shadow-[0_20px_44px_-28px_rgba(0,0,0,0.12)] light:hover:bg-zinc-50 light:hover:shadow-[0_18px_34px_-24px_rgba(0,0,0,0.14)]"
        >
          <CtaLordIcon icon="downloadSave" size={18} darkColor="#111827" lightColor="#111827" />
          Download
        </Link>
      </div>
    </section>
  );
}
