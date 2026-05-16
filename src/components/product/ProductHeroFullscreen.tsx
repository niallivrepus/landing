import { cn } from "@jokuh/gooey";
import { useEffect, useState, type ReactNode } from "react";
import { CONTENT_SHELL_WIDE } from "../system/shells";

/**
 * Apple-style fullscreen entrance for product detail pages.
 * Cinematic background, eyebrow + huge title in the bottom-left,
 * optional CTA cluster in the bottom-right.
 */
export function ProductHeroFullscreen({
  eyebrow,
  title,
  /** Optional poster / photo rendered above the solid hero base. */
  backgroundImage,
  /** Optional video rendered above the image; image remains as poster/fallback. */
  backgroundVideo,
  trailing,
  className,
}: {
  eyebrow?: string;
  title: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  trailing?: ReactNode;
  className?: string;
}) {
  const [videoSrc, setVideoSrc] = useState<string | undefined>();

  useEffect(() => {
    if (!backgroundVideo) {
      setVideoSrc(undefined);
      return;
    }

    const loadVideo = () => setVideoSrc(backgroundVideo);
    const idleCallback =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(loadVideo, { timeout: 900 })
        : globalThis.setTimeout(loadVideo, 450);

    return () => {
      if ("cancelIdleCallback" in window && typeof idleCallback === "number") {
        window.cancelIdleCallback(idleCallback);
      } else {
        window.clearTimeout(idleCallback);
      }
    };
  }, [backgroundVideo]);

  return (
    <section
      className={cn(
        "relative flex min-h-[100svh] w-full overflow-hidden bg-black text-white",
        className,
      )}
    >
      {/* Layer 1 — solid base only. Product detail heroes must never show lava behind media. */}
      <div className="absolute inset-0 bg-black" aria-hidden />

      {/* Layer 2 — optional photo / poster on top of the base */}
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

      {backgroundVideo ? (
        <video
          src={videoSrc}
          poster={backgroundImage}
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
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
      <div className={cn(CONTENT_SHELL_WIDE, "relative z-20 flex flex-col justify-end pb-12 pt-32 md:pb-16 md:pt-40")}>
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
