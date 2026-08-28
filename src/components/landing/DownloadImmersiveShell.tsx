import { cn } from "@jokuh/gooey";
import { motion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { FaqSection } from "../FaqSection";
import { CtaLordIcon } from "../CtaLordIcon";
import { SquircleMedia } from "../system/squircle";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { DOWNLOAD_INTENTS, type DownloadIntentId } from "../../data/download-intents";
import { TESTFLIGHT_JOIN_URL, resolveMacDownloadUrl } from "../../config/download-links";
import { buildWebAppOnboardingHandoffUrl } from "../../lib/claim-identity-handoff";
import { useClaimIdentityFlowContext } from "../../context/ClaimIdentityFlowContext";
import { ClaimIdentityCta } from "./ClaimIdentityCta";
import { ClaimIdentityLandingOverlay } from "./ClaimIdentityLandingOverlay";
import { LandingBlueCta } from "./LandingBlueCta";

const MOBILE_PREVIEW_IMAGE = "/download/mobile-preview.png";
const DESKTOP_PREVIEW_IMAGE = "/download/2.png";

/** **Purpose:** Resolves marketing copy from the `/download?intent=` query param. */
function resolveDownloadCopy(intentParam: string | null) {
  const intent = (intentParam ?? "default") as DownloadIntentId;
  return DOWNLOAD_INTENTS[intent] ?? DOWNLOAD_INTENTS.default;
}

/**
 * **Purpose:** Centered download surface with immersive corner chrome and Gooey CTAs.
 * **Connects to:** `DownloadPage`, `download-intents.ts`, `ImmersiveAppChrome`.
 */
export function DownloadImmersiveShell() {
  const [params] = useSearchParams();
  const copy = resolveDownloadCopy(params.get("intent"));
  const claimFlow = useClaimIdentityFlowContext();
  const macDownloadUrl = resolveMacDownloadUrl();
  const intentParam = params.get("intent") ?? "default";
  /** Browser entry without a handle — app stays language-first; attribution travels in the query. */
  const browserOnboardingHref = buildWebAppOnboardingHandoffUrl({
    source: "download",
    intent: intentParam,
  });

  const showMobile = copy.platformFocus !== "desktop";
  const showDesktop = copy.platformFocus !== "mobile";

  return (
    <>
      <section
        className="relative min-h-[100svh] overflow-x-hidden"
        aria-label="Download Jokuh"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/74 to-black/94 light:from-white/58 light:via-white/84 light:to-white/98"
          aria-hidden
        />

        <ImmersiveAppChrome showLibraryRail={false} />

        <div className="relative z-10 mx-auto flex w-full max-w-[640px] flex-col items-center px-4 pb-[calc(env(safe-area-inset-bottom,0px)+48px)] pt-[calc(env(safe-area-inset-top,0px)+88px)]">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full flex-col items-center text-center"
          >
            {copy.eyebrow ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-light-space/50 light:text-zinc-500">
                {copy.eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 font-sans text-[clamp(1.75rem,5vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-light-space light:text-zinc-950">
              {copy.headline}
            </h1>
            <p className="mx-auto mt-4 max-w-[42ch] font-sans text-[15px] leading-relaxed text-light-space/65 light:text-zinc-600 sm:text-[16px]">
              {copy.subcopy}
            </p>
          </motion.header>

          <div className="mt-10 flex w-full flex-col items-center gap-12 sm:gap-14">
            {showMobile ? (
              <DownloadPlatformCard
                platform="mobile"
                imageSrc={MOBILE_PREVIEW_IMAGE}
                imageAlt="Jokuh mobile app on a smartphone"
                title="For mobile"
                body="iPhone and iPad builds ship through TestFlight. Join the public beta to install Jokuh on your device — or continue in the browser now."
                ctaHref={TESTFLIGHT_JOIN_URL}
                ctaLabel="Download beta"
                secondaryHref={browserOnboardingHref}
                secondaryLabel="Continue in browser"
                onSecondaryClick={() => claimFlow.openFrom("download")}
              />
            ) : null}

            {showDesktop ? (
              <DownloadPlatformCard
                platform="desktop"
                imageSrc={DESKTOP_PREVIEW_IMAGE}
                imageAlt="Jokuh desktop app on a laptop"
                title="For Mac"
                body="Download the official native Mac app — the same Swift build as our desktop product, signed with our Apple Developer ID and notarized by Apple."
                ctaHref={macDownloadUrl}
                ctaLabel="Download for Mac"
                ctaDownload
                secondaryHref={browserOnboardingHref}
                secondaryLabel="Open in browser (Windows & Linux)"
                installSteps={[
                  "Download Jokuh.dmg",
                  "Open the disk image",
                  "Drag Jokuh to Applications",
                  "Launch from Applications",
                ]}
              />
            ) : null}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <ClaimIdentityCta
              href="/download?intent=identity"
              onActivate={() => claimFlow.openFrom("hero")}
            />
            <LandingBlueCta href="/">
              Back to home
            </LandingBlueCta>
          </motion.div>

          <div className="mt-14 w-full sm:mt-16">
            <FaqSection
              items={[
                {
                  question: "How do I install Jokuh on Mac?",
                  answer:
                    "Download Jokuh.dmg from this page, open it, and drag Jokuh into Applications. The app is signed with our Apple Developer ID and notarized so macOS Gatekeeper accepts it — no Mac App Store required.",
                },
                {
                  question: "What about Windows?",
                  answer:
                    "A native Windows app is on the roadmap. Today, open Jokuh in your browser at app.jokuh.com — the full product runs there on Windows and Linux.",
                },
                {
                  question: "What are the system requirements?",
                  answer:
                    "Mac: macOS 14 or later (Apple Silicon or Intel). Mobile: iOS via TestFlight — use Download beta on this page. Web: a modern Chromium, Safari, or Firefox browser.",
                },
                {
                  question: "Is Jokuh free to download?",
                  answer:
                    "Yes. The Mac download and TestFlight beta are free during early access. Tiered pricing for advanced features arrives with public release; testers will be informed first.",
                },
                {
                  question: "How do I update the Mac app?",
                  answer:
                    "Download the latest Jokuh.dmg from this page when we ship a new version. Automatic updates via Sparkle or the Mac App Store may come later.",
                },
                {
                  question: "Can I use Jokuh offline?",
                  answer:
                    "Yes. Jokuh is built local-first. Your data, identity, and core memory layer live on your device. Network access is only required for peer sync, model calls you authorize, and on-chain settlement.",
                },
                {
                  question: "Where is my data stored?",
                  answer:
                    "On your device, encrypted, under keys you hold. Jokuh does not aggregate your knowledge, messages, or identity into a centralized cloud.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <ClaimIdentityLandingOverlay
        open={claimFlow.isOpen}
        source={claimFlow.source}
        power={claimFlow.power}
        onClose={claimFlow.close}
      />
    </>
  );
}

function DownloadPlatformCard({
  platform,
  imageSrc,
  imageAlt,
  title,
  body,
  ctaHref,
  ctaLabel,
  ctaDownload = false,
  secondaryHref,
  secondaryLabel,
  /** When set, secondary click opens landing claim (username-first) instead of leaving immediately. */
  onSecondaryClick,
  installSteps,
}: {
  platform: "mobile" | "desktop";
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  /** When true, sets the `download` attribute for direct file saves (`.dmg`). */
  ctaDownload?: boolean;
  secondaryHref?: string;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  installSteps?: string[];
}) {
  const isExternalFile = ctaDownload || ctaHref.endsWith(".dmg");

  return (
    <article
      className="flex w-full max-w-[420px] flex-col items-center gap-5 text-center"
      aria-labelledby={`download-${platform}-heading`}
    >
      <div className="w-full max-w-[min(100%,320px)]">
        <SquircleMedia className="relative aspect-square size-full overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="pointer-events-none size-full object-cover"
            draggable={false}
            loading="lazy"
          />
        </SquircleMedia>
      </div>

      <div className="flex flex-col items-center gap-3">
        <h2
          id={`download-${platform}-heading`}
          className={cn(
            "font-sans text-[clamp(1.35rem,4vw,1.85rem)] font-semibold leading-[1.1] tracking-[-0.02em]",
            "text-light-space light:text-zinc-950",
          )}
        >
          {title}
        </h2>
        <p className="max-w-[36ch] font-sans text-[14px] leading-relaxed text-light-space/65 light:text-zinc-600 sm:text-[15px]">
          {body}
        </p>

        {installSteps && installSteps.length > 0 ? (
          <ol className="mt-1 max-w-[34ch] list-decimal space-y-1 pl-5 text-left font-sans text-[13px] leading-relaxed text-light-space/55 light:text-zinc-500">
            {installSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}

        {isExternalFile ? (
          <LandingBlueCta href={ctaHref} download className="mt-1">
            <CtaLordIcon icon="downloadSave" size={18} darkColor="#ffffff" lightColor="#ffffff" />
            {ctaLabel}
          </LandingBlueCta>
        ) : (
          <LandingBlueCta href={ctaHref} className="mt-1">
            <CtaLordIcon icon="downloadSave" size={18} darkColor="#ffffff" lightColor="#ffffff" />
            {ctaLabel}
          </LandingBlueCta>
        )}

        {secondaryHref && secondaryLabel ? (
          <a
            href={secondaryHref}
            className="font-sans text-[13px] font-medium text-light-space/55 underline-offset-4 hover:text-light-space/80 hover:underline light:text-zinc-500 light:hover:text-zinc-800"
            onClick={(event) => {
              if (!onSecondaryClick) return;
              // Mobile: keep username-first on landing, then hand off — do not jump straight into app language.
              event.preventDefault();
              onSecondaryClick();
            }}
          >
            {secondaryLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}
