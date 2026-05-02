import { cn } from "@jokuh/gooey";
import { Download } from "lucide-react";
import { FaqSection } from "../components/FaqSection";
import { EDITORIAL_MEDIA_RADIUS_CLASS, MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const MOBILE_PREVIEW_IMAGE = "/download/mobile-preview.png";
const DESKTOP_PREVIEW_IMAGE = "/download/2.png";
const EARLY_ACCESS_EMAIL = "mailto:hello@jokuh.com?subject=Jokuh%20early%20access";

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

function EarlyAccessButtons({ platform }: { platform: "mobile" | "desktop" }) {
  const label = platform === "mobile" ? "Request mobile access" : "Request desktop access";

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <a
        href={EARLY_ACCESS_EMAIL}
        className="inline-flex h-12 min-w-[12rem] items-center justify-center gap-2 rounded-full bg-white px-6 font-sans text-[14px] font-semibold text-zinc-950 transition hover:bg-zinc-100 light:bg-zinc-950 light:text-white light:hover:bg-zinc-800"
      >
        <Download className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        {label}
      </a>
    </div>
  );
}

export function DownloadPage() {
  useDocumentTitle("Download Jokuh");

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
              Mobile builds are part of the early-access rollout. Request access and we will share availability
              when your account is eligible.
            </p>

            <EarlyAccessButtons platform="mobile" />
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
              Desktop builds are available by rollout wave. We will confirm platform support and install steps
              during onboarding.
            </p>
            <EarlyAccessButtons platform="desktop" />
          </div>
        </div>
      </section>

      <div className={cn(CONTENT_SHELL_WIDE, "py-16 md:py-24")}>
        <FaqSection
          items={[
            {
              question: "What are the system requirements?",
              answer: "ARC Terminal currently runs on iOS via TestFlight. macOS and additional platforms are on the roadmap. You'll need an iOS device on a recent OS version and a TestFlight invite from the team.",
            },
            {
              question: "Is Jokuh free to download?",
              answer: "Yes. Early access through TestFlight is free. Tiered pricing for advanced features and capacity arrives alongside public release; existing testers will be informed before anything changes.",
            },
            {
              question: "How do I update the app?",
              answer: "Updates ship through TestFlight while we're in beta. Turn on auto-updates inside TestFlight to always run the latest build, or pull updates manually when a new version is released.",
            },
            {
              question: "Can I use Jokuh offline?",
              answer: "Yes. Jokuh is built local-first. Your data, identity, and core memory layer live on your device, so the app works without a continuous connection. Network access is only required for peer sync, model calls you authorize, and on-chain settlement.",
            },
            {
              question: "Where is my data stored?",
              answer: "On your device, encrypted, under keys you hold. Jokuh does not aggregate your knowledge, messages, or identity into a centralized cloud. Peer-to-peer sync moves your own data between your own devices and chosen peers.",
            },
          ]}
        />
      </div>
    </MarketingPageFrame>
  );
}
