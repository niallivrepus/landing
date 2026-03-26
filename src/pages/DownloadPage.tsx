import { OO, cn } from "@jokuh/gooey";
import { MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_COMPANY } from "../components/system/shells";
import { SecondaryLink } from "../components/SecondaryLink";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function HandPhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M26 4h10a2 2 0 012 2v36a2 2 0 01-2 2H16a2 2 0 01-2-2V6a2 2 0 012-2h10z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 44h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 28c-2.5 2-4 5.5-4 10v6c0 4 2 7 5 8l6 2M44 28c2.5 2 4 5.5 4 10v6c0 4-2 7-5 8l-6 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 24c0-6 6.5-11 14-11s14 5 14 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QrCornerFinder({ ox, oy }: { ox: number; oy: number }) {
  return (
    <>
      <rect x={ox} y={oy} width={7} height={7} fill="#ffffff" />
      <rect x={ox + 1} y={oy + 1} width={5} height={5} fill="#0a0a0a" />
      <rect x={ox + 2} y={oy + 2} width={3} height={3} fill="#ffffff" />
    </>
  );
}

function FakeQr({ seed, className }: { seed: number; className?: string }) {
  const n = 25;
  let rng = seed >>> 0;
  const dots: [number, number][] = [];
  for (let i = 0; i < 140; i++) {
    rng = (rng * 1664525 + 1013904223) >>> 0;
    dots.push([rng % n, (rng >> 10) % n]);
  }

  return (
    <svg viewBox={`0 0 ${n} ${n}`} className={className} aria-hidden>
      <rect width={n} height={n} fill="#0a0a0a" />
      <QrCornerFinder ox={0} oy={0} />
      <QrCornerFinder ox={18} oy={0} />
      <QrCornerFinder ox={0} oy={18} />
      {dots.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill="#ffffff" />
      ))}
    </svg>
  );
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 20" width="16" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M12.64 1.09c-.95 1.16-1.54 2.65-1.38 4.2.13.02.27.03.41.03 1.35-.02 2.72-.73 3.58-1.86.9-1.19 1.19-2.7.98-4.15-1.28.15-2.55.78-3.59 1.78zM10.5 5.8c-2.14-.1-4.45 1.58-5.28 1.58-.86 0-2.45-1.49-4.03-1.45C.4 5.96-1.1 7.53.7 11.2c.86 1.78 1.82 3.77 3.15 3.78.78 0 1.08-.5 2.02-.5.95 0 1.22.5 2.03.5 1.34 0 2.42-2.26 3.28-4.03-2.9-1.6-2.43-4.78.32-5.15z"
      />
    </svg>
  );
}

function GooglePlayGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path fill="currentColor" d="M3 20.5V3.5L20.5 12 3 20.5z" />
    </svg>
  );
}

function MobileAppSection() {
  return (
    <section
      className="bg-smoke-2 px-4 py-20 text-light-space md:px-8 md:py-28"
      aria-labelledby="mobile-download-heading"
    >
      <div className="mx-auto flex max-w-[920px] flex-col items-center text-center">
        <HandPhoneIcon className="mb-10 text-light-space md:mb-12" />

        <h2
          id="mobile-download-heading"
          className="max-w-xl font-serif text-[1.75rem] font-semibold leading-tight tracking-tight text-light-space md:text-[2.25rem]"
        >
          Take Jokuh on the go
        </h2>
        <p className="mt-5 max-w-md font-sans text-[15px] leading-relaxed text-light-space/55 md:text-base">
          Start a thought here, finish anywhere. Jokuh remembers across your phone, desktop, and the
          web.
        </p>

        <div className="mt-14 grid w-full max-w-[640px] grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 md:mt-16">
          <article className="flex flex-col items-center rounded-[24px] border border-light-space/[0.08] bg-smoke-2 px-6 pb-8 pt-8 md:px-8 md:pb-10 md:pt-10 light:border-black/[0.1] light:bg-white light:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.08)]">
            <FakeQr seed={0x9e3779b9} className="aspect-square w-[min(72vw,200px)]" />
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-light-space/35 px-5 py-2.5 font-sans text-sm font-medium text-light-space transition-colors hover:border-light-space/55 hover:bg-white/[0.04] light:border-black/20 light:hover:bg-black/[0.04]"
            >
              <AppleGlyph className="shrink-0" />
              Apple
            </a>
          </article>

          <article className="flex flex-col items-center rounded-[24px] border border-light-space/[0.08] bg-smoke-2 px-6 pb-8 pt-8 md:px-8 md:pb-10 md:pt-10 light:border-black/[0.1] light:bg-white light:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.08)]">
            <FakeQr seed={0x6c078965} className="aspect-square w-[min(72vw,200px)]" />
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-light-space/35 px-5 py-2.5 font-sans text-sm font-medium text-light-space transition-colors hover:border-light-space/55 hover:bg-white/[0.04] light:border-black/20 light:hover:bg-black/[0.04]"
            >
              <GooglePlayGlyph className="shrink-0" />
              Google Play
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

export function DownloadPage() {
  useDocumentTitle("Download — Jokuh");

  return (
    <MarketingPageFrame footer={null} className="bg-[#f4effc] text-[#402060]" withFontSans>
      <div
        className={cn(
          CONTENT_SHELL_COMPANY,
          "flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center pt-24 pb-16 md:pt-28",
        )}
      >
          <h1 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
            <span className="block">Download</span>
            <span className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 md:mt-6 md:gap-x-3">
              <span className="text-2xl md:text-3xl">for</span>
              <span
                className="inline-flex shrink-0 -rotate-6 items-center justify-center"
                aria-hidden
              >
                <OO
                  style={{ width: 46, height: 46 }}
                  backgroundColor="#e5daf8"
                  borderColor="rgba(64, 32, 96, 0.14)"
                  bodyGradientStart="#c9b8ee"
                  bodyGradientEnd="#ddd0f7"
                  bodyStrokeColor="#a88fd8"
                  eyeColor="#FFFFFF"
                />
              </span>
              <span className="sr-only">Jokuh </span>
              <span className="text-2xl md:text-3xl">desktop</span>
            </span>
          </h1>
          <SecondaryLink href="#" className="mt-10 text-[15px]">
            System requirements & coverage
          </SecondaryLink>
      </div>

      <MobileAppSection />
    </MarketingPageFrame>
  );
}
