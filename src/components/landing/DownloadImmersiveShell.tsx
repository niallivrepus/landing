import { cn } from "@jokuh/gooey";
import { motion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { FaqSection } from "../FaqSection";
import { CtaLordIcon } from "../CtaLordIcon";
import { SquircleMedia } from "../system/squircle";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { DOWNLOAD_INTENTS, type DownloadIntentId } from "../../data/download-intents";
import { useClaimIdentityFlowContext } from "../../context/ClaimIdentityFlowContext";
import { ClaimIdentityCta } from "./ClaimIdentityCta";
import { ClaimIdentityLandingOverlay } from "./ClaimIdentityLandingOverlay";
import { LandingBlueCta } from "./LandingBlueCta";

const MOBILE_PREVIEW_IMAGE = "/download/mobile-preview.png";
const DESKTOP_PREVIEW_IMAGE = "/download/2.png";
const EARLY_ACCESS_EMAIL = "mailto:sean@sierri.com?subject=Jokuh%20early%20access";

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

        <ImmersiveAppChrome showLibraryRail />

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
                body="Mobile builds are part of the early-access rollout. Request access and we will share availability when your account is eligible."
                ctaLabel="Request mobile access"
              />
            ) : null}

            {showDesktop ? (
              <DownloadPlatformCard
                platform="desktop"
                imageSrc={DESKTOP_PREVIEW_IMAGE}
                imageAlt="Jokuh desktop app on a laptop"
                title="For desktop"
                body="Desktop builds are available by rollout wave. We will confirm platform support and install steps during onboarding."
                ctaLabel="Request desktop access"
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
                  question: "What are the system requirements?",
                  answer:
                    "ARC Terminal currently runs on iOS via TestFlight. macOS and additional platforms are on the roadmap. You'll need an iOS device on a recent OS version and a TestFlight invite from the team.",
                },
                {
                  question: "Is Jokuh free to download?",
                  answer:
                    "Yes. Early access through TestFlight is free. Tiered pricing for advanced features and capacity arrives alongside public release; existing testers will be informed before anything changes.",
                },
                {
                  question: "How do I update the app?",
                  answer:
                    "Updates ship through TestFlight while we're in beta. Turn on auto-updates inside TestFlight to always run the latest build, or pull updates manually when a new version is released.",
                },
                {
                  question: "Can I use Jokuh offline?",
                  answer:
                    "Yes. Jokuh is built local-first. Your data, identity, and core memory layer live on your device, so the app works without a continuous connection. Network access is only required for peer sync, model calls you authorize, and on-chain settlement.",
                },
                {
                  question: "Where is my data stored?",
                  answer:
                    "On your device, encrypted, under keys you hold. Jokuh does not aggregate your knowledge, messages, or identity into a centralized cloud. Peer-to-peer sync moves your own data between your own devices and chosen peers.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <ClaimIdentityLandingOverlay
        open={claimFlow.isOpen}
        source={claimFlow.source}
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
  ctaLabel,
}: {
  platform: "mobile" | "desktop";
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: string;
  ctaLabel: string;
}) {
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
        <LandingBlueCta href={EARLY_ACCESS_EMAIL} className="mt-1">
          <CtaLordIcon icon="downloadSave" size={18} darkColor="#ffffff" lightColor="#ffffff" />
          {ctaLabel}
        </LandingBlueCta>
      </div>
    </article>
  );
}
