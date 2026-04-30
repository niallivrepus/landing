import { cn } from "@jokuh/gooey";
import { Download } from "lucide-react";
import { FaqSection } from "../components/FaqSection";
import { EDITORIAL_MEDIA_RADIUS_CLASS, MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { SecondaryLink } from "../components/SecondaryLink";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const APP_STORE_BADGE_DARK = "/badges/apple-dark.svg";
const APP_STORE_BADGE_LIGHT = "/badges/apple-light.svg";
const GOOGLE_PLAY_BADGE_DARK = "/badges/playstore-dark.svg";
const GOOGLE_PLAY_BADGE_LIGHT = "/badges/playstore-light.svg";

const MOBILE_PREVIEW_IMAGE = "/download/mobile-preview.png";
const DESKTOP_PREVIEW_IMAGE = "/download/2.png";

function DownloadPreviewCard({
  overlayImageSrc,
  overlayImageAlt,
  className,
}: {
  overlayImageSrc: string;
  overlayImageAlt: string;
  className?: string;
}) {
  const frame = cn(
    "aspect-square w-full min-w-0 shrink-0 overflow-hidden max-md:mx-auto max-md:max-w-[min(100%,420px)]",
    className,
  );

  return (
    <div className={frame}>
      <div className={cn("relative size-full overflow-hidden", EDITORIAL_MEDIA_RADIUS_CLASS)}>
        <img
          src={overlayImageSrc}
          alt={overlayImageAlt}
          className="pointer-events-none absolute inset-0 size-full object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
}

function MobileStoreBadges({
  appStoreHref,
  playStoreHref,
}: {
  appStoreHref: string;
  playStoreHref: string;
}) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
      <a
        href={appStoreHref}
        rel="noopener noreferrer"
        target="_blank"
        className="inline-block shrink-0 rounded-md transition-opacity hover:opacity-90"
        aria-label="Download on the App Store"
      >
        <img
          src={APP_STORE_BADGE_DARK}
          alt=""
          width={120}
          height={40}
          className="h-10 w-auto object-contain light:hidden"
        />
        <img
          src={APP_STORE_BADGE_LIGHT}
          alt=""
          width={120}
          height={40}
          className="hidden h-10 w-auto object-contain light:block"
        />
      </a>
      <a
        href={playStoreHref}
        rel="noopener noreferrer"
        target="_blank"
        className="inline-block shrink-0 rounded-md transition-opacity hover:opacity-90"
        aria-label="Get it on Google Play"
      >
        <img
          src={GOOGLE_PLAY_BADGE_DARK}
          alt=""
          width={120}
          height={40}
          className="h-10 w-auto object-contain light:hidden"
        />
        <img
          src={GOOGLE_PLAY_BADGE_LIGHT}
          alt=""
          width={120}
          height={40}
          className="hidden h-10 w-auto object-contain light:block"
        />
      </a>
    </div>
  );
}

export function DownloadPage() {
  useDocumentTitle("Download — Jokuh");

  return (
    <MarketingPageFrame footer={null} className="light:bg-white light:text-[#402060]" withFontSans>
      {/* Mobile — copy left, visual right */}
      <section
        className={cn(CONTENT_SHELL_WIDE, "pt-24 pb-14 md:pt-28 md:pb-20")}
        aria-labelledby="download-mobile-heading"
      >
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-14 lg:gap-20">
          <div className="min-w-0">
            <h1
              id="download-mobile-heading"
              className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-[0em] text-light-space light:text-[#402060]"
            >
              Download Jokuh
              <br />
              for mobile
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-light-space/60 light:text-[#5a4580]/85 md:text-base">
              Continue threads, capture voice, and stay in sync from your phone.
            </p>

            <MobileStoreBadges appStoreHref="#" playStoreHref="#" />
          </div>

          <DownloadPreviewCard
            overlayImageSrc={MOBILE_PREVIEW_IMAGE}
            overlayImageAlt="Jokuh mobile app on a smartphone"
            className="max-md:mx-auto max-md:max-w-[min(100%,420px)]"
          />
        </div>
      </section>

      {/* Desktop — visual left, copy right */}
      <section
        className={cn(CONTENT_SHELL_WIDE, "py-14 md:py-20")}
        aria-labelledby="download-desktop-heading"
      >
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-14 lg:gap-20">
          <DownloadPreviewCard
            overlayImageSrc={DESKTOP_PREVIEW_IMAGE}
            overlayImageAlt="Jokuh desktop app on a laptop"
          />
          <div className="min-w-0">
            <h2
              id="download-desktop-heading"
              className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-[0em] text-light-space light:text-[#402060]"
            >
              Download Jokuh
              <br />
              for desktop
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-light-space/60 light:text-[#5a4580]/85 md:text-base">
              Capture meetings, notes, and screen context in one place. Built for macOS and Windows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex h-12 min-w-[9.5rem] items-center justify-center gap-2 rounded-full bg-white px-6 font-sans text-[14px] font-semibold text-zinc-950 transition hover:bg-zinc-100 light:bg-zinc-950 light:text-white light:hover:bg-zinc-800"
              >
                <Download className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                macOS
              </a>
              <a
                href="#"
                className="inline-flex h-12 min-w-[9.5rem] items-center justify-center gap-2 rounded-full bg-white px-6 font-sans text-[14px] font-semibold text-zinc-950 transition hover:bg-zinc-100 light:bg-zinc-950 light:text-white light:hover:bg-zinc-800"
              >
                <Download className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                Windows
              </a>
            </div>
            <div className="mt-8">
              <SecondaryLink href="#" className="text-light-space/90 hover:text-light-space light:text-[#402060]">
                Learn more about the desktop app
              </SecondaryLink>
            </div>
          </div>
        </div>
      </section>

      <div className={cn(CONTENT_SHELL_WIDE, "py-16 md:py-24")}>
        <FaqSection
          items={[
            {
              question: "What are the system requirements?",
              answer: "Jokuh desktop runs on macOS 13+, Windows 10+, and Ubuntu 22.04+. Mobile apps support recent iOS and Android releases.",
            },
            {
              question: "Is Jokuh free to download?",
              answer: "Yes. The desktop and mobile apps are free to download. Some features may require a subscription once the platform reaches general availability.",
            },
            {
              question: "How do I update the app?",
              answer: "Jokuh updates automatically in the background. You can also check for updates manually from the app settings.",
            },
            {
              question: "Can I use Jokuh offline?",
              answer: "Core features are available offline. Your data syncs automatically when you reconnect to the internet.",
            },
            {
              question: "Where is my data stored?",
              answer: "Data is encrypted and stored securely in the cloud. Local caches on your device are also encrypted at rest.",
            },
          ]}
        />
      </div>
    </MarketingPageFrame>
  );
}
