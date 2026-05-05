import { cn } from "@jokuh/gooey";
import type { ReactNode } from "react";
import { LavaLamp, type LAVA_LAMP_STYLES } from "../LavaLamp";

type LavaStyle = keyof typeof LAVA_LAMP_STYLES;

/**
 * Apple-style fullscreen entrance for product detail pages.
 * Cinematic background, eyebrow + huge title in the bottom-left,
 * optional CTA cluster in the bottom-right.
 */
export function ProductHeroFullscreen({
  eyebrow,
  title,
  lavaLamp = "aurora",
  /** Optional override image (rendered behind the lava lamp). */
  backgroundImage,
  trailing,
  className,
}: {
  eyebrow?: string;
  title: string;
  lavaLamp?: LavaStyle;
  backgroundImage?: string;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative flex min-h-[100svh] w-full overflow-hidden bg-black text-white",
        className,
      )}
    >
      {/* Layer 1 — base lava lamp (or solid black) */}
      <div className="absolute inset-0">
        <LavaLamp style={lavaLamp} />
      </div>

      {/* Layer 2 — optional photo / poster on top of the lava lamp */}
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
          loading="eager"
          decoding="async"
        />
      ) : null}

      {/* Layer 3 — bottom gradient for legibility behind the title */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.7) 100%)",
        }}
        aria-hidden
      />

      {/* Title block bottom-left */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1380px] flex-col justify-end px-3 pb-12 pt-32 md:px-12 md:pb-16 md:pt-40">
        <div className="flex w-full flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-white/85">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-4 font-sans text-[clamp(5rem,22vw,22rem)] font-light leading-[0.92] tracking-[-0.025em] text-white">
              {title}
            </h1>
          </div>
          {trailing ? <div className="flex shrink-0 items-center gap-3">{trailing}</div> : null}
        </div>
      </div>
    </section>
  );
}
