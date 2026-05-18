import { cn } from "@jokuh/gooey";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { CONTENT_SHELL_WIDE } from "../system/shells";

const MESSAGE_SEQUENCE_GAP = 16;
const MESSAGE_SEQUENCE_SOURCE_WIDTH = 370;
const MESSAGE_SEQUENCE_WIDTH = 350;
const MESSAGE_SEQUENCE_HEIGHTS: Record<string, number> = {
  "1.png": 81,
  "2.png": 57,
  "3.png": 81,
  "4.png": 57,
  "5.png": 81,
  "6.png": 57,
  "7.png": 506,
  "modules.png": 506,
};

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
  messageSequence,
  trailing,
  className,
}: {
  eyebrow?: string;
  title: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  messageSequence?: {
    images: string[];
  };
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
        {messageSequence ? <VerticalMessageSequence images={messageSequence.images} /> : null}
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

function VerticalMessageSequence({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        setPreviousIndex(currentIndex);
        return (currentIndex + 1) % images.length;
      });
    }, 2150);

    return () => window.clearInterval(interval);
  }, [images.length]);

  const activeImage = images[activeIndex];
  const previousImage = previousIndex === null ? undefined : images[previousIndex];
  const activeIsTall = isTallSequenceImage(activeImage);
  const previousIsTall = previousImage ? isTallSequenceImage(previousImage) : false;
  const showPreviousImage = Boolean(previousImage && !activeIsTall && !previousIsTall);
  const activeHeight = getSequenceImageHeight(activeImage);
  const previousHeight = previousImage ? getSequenceImageHeight(previousImage) : 0;
  const stackHeight = showPreviousImage ? previousHeight + MESSAGE_SEQUENCE_GAP + activeHeight : activeHeight;

  return (
    <div
      className="pointer-events-none absolute left-3 top-[43%] hidden h-[640px] w-[min(39vw,410px)] -translate-y-1/2 md:block md:left-8"
      aria-hidden
    >
      <div className="absolute inset-x-8 top-1/2 h-64 -translate-y-1/2 rounded-[40px] bg-black/25 blur-3xl" />
      <div className="relative h-full w-full overflow-y-hidden px-[30px] [mask-image:linear-gradient(180deg,transparent_0%,black_5%,black_95%,transparent_100%)]">
        <div
          key={`${previousIndex ?? "none"}-${activeIndex}`}
          className="absolute left-[30px] top-1/2 flex w-[370px] max-w-[calc(100%_-_60px)] -translate-y-1/2 flex-col items-start"
          style={{ gap: MESSAGE_SEQUENCE_GAP, height: stackHeight }}
        >
          {showPreviousImage && previousImage ? (
            <img
              src={previousImage}
              alt=""
              className="message-sequence-pushed w-full drop-shadow-[0_22px_44px_rgba(0,0,0,0.24)]"
              style={
                {
                  height: previousHeight,
                  width: MESSAGE_SEQUENCE_WIDTH,
                  "--message-push-distance": `${previousHeight + MESSAGE_SEQUENCE_GAP}px`,
                } as CSSProperties
              }
              loading="eager"
              decoding="async"
            />
          ) : null}
          <img
            src={activeImage}
            alt=""
            className={cn(
              "message-sequence-enter w-full drop-shadow-[0_24px_48px_rgba(0,0,0,0.28)]",
              activeIsTall && "message-sequence-enter-tall",
            )}
            style={{ height: activeHeight, width: MESSAGE_SEQUENCE_WIDTH }}
            loading={activeIndex < 2 ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}

function isTallSequenceImage(src: string) {
  return src.endsWith("/7.png") || src.endsWith("/modules.png");
}

function getSequenceImageHeight(src: string) {
  const filename = src.split("/").at(-1);
  const sourceHeight = filename ? (MESSAGE_SEQUENCE_HEIGHTS[filename] ?? 81) : 81;
  return Math.round(sourceHeight * (MESSAGE_SEQUENCE_WIDTH / MESSAGE_SEQUENCE_SOURCE_WIDTH));
}
