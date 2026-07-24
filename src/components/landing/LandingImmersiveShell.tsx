import { GooeyViewportProvider, useCurrentGooeyViewport } from "@jokuh/gooey";
import { LayoutGroup, motion } from "motion/react";
import { useCallback, useState } from "react";
import type { LandingArcadeGameId } from "../../data/landing-arcade-games";
import { LANDING_HERO_HEADLINE } from "../../data/landing-hero-copy";
import { LandingHeroTypewriter } from "./LandingHeroTypewriter";
import { MissionIntroOverlay } from "./MissionIntroOverlay";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import { useClaimIdentityFlowContext } from "../../context/ClaimIdentityFlowContext";
import { ClaimIdentityCta } from "./ClaimIdentityCta";
import { ClaimIdentityLandingOverlay } from "./ClaimIdentityLandingOverlay";
import { LandingHomeBackdrop } from "./LandingHomeBackdrop";
import { LandingHomeSuggestionPills } from "./LandingHomeSuggestionPills";
import { LandingArcadeGameOverlay } from "./LandingArcadeGameOverlay";
import { LandingBlurbsPill } from "./LandingBlurbsPill";
import { LandingPromptBar } from "./LandingPromptBar";
import { LandingPromptBorderBeam } from "./LandingPromptBorderBeam";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { ImmersiveCenterColumn } from "../system/ImmersiveCenterColumn";
import { SiteLink } from "../SiteLink";

/**
 * **Purpose:** Full-viewport home hero — brand, Claim-primary CTAs, prompt that scrolls to proof.
 * Mission scramble intro plays on every homepage visit before the hero typewriter.
 * **Connects to:** `LandingHero`, `ProductDemoSection` (`#demo`), `MissionIntroOverlay`.
 */
export function LandingImmersiveShell() {
  return (
    <GooeyViewportProvider>
      <LandingImmersiveShellInner />
    </GooeyViewportProvider>
  );
}

function LandingImmersiveShellInner() {
  const viewport = useCurrentGooeyViewport();
  const { intercept } = useDownloadIntercept("home-immersive");
  const claimFlow = useClaimIdentityFlowContext();
  const [arcadeGame, setArcadeGame] = useState<LandingArcadeGameId | null>(null);
  const [introComplete, setIntroComplete] = useState(false);

  /** Scrolls to the homepage proof stage so visitors see OO powers without leaving `/`. */
  const handleSend = useCallback((_text: string) => {
    const demo = document.getElementById("demo");
    if (demo) {
      demo.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.assign("/demo");
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <LayoutGroup id="claim-identity-home">
      <MissionIntroOverlay onComplete={handleIntroComplete} />

      <section
        className="relative flex min-h-[100svh] flex-col overflow-hidden"
        aria-label="Jokuh home"
        aria-hidden={!introComplete}
      >
        <LandingHomeBackdrop />

        <ImmersiveAppChrome bottomCenter={<LandingBlurbsPill />} />

        <ImmersiveCenterColumn
          maxWidthClass="max-w-[720px]"
          className="flex-1 min-h-0 pb-[calc(env(safe-area-inset-bottom,0px)+88px)] pt-[calc(env(safe-area-inset-top,0px)+72px)]"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex w-full flex-col items-center text-center"
          >
            <LandingHeroTypewriter text={LANDING_HERO_HEADLINE} enabled={introComplete} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.4, delay: introComplete ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
            className="landing-home-prompt-stack w-full max-w-[450px] self-center text-left"
          >
            <LandingPromptBorderBeam>
              <LandingPromptBar
                variant={viewport === "phone" ? "phone" : "desktop"}
                viewport={viewport}
                previewText="see OO work"
                onSend={handleSend}
                onPlus={() => intercept("prompt-plus")}
              />
            </LandingPromptBorderBeam>
            <LandingHomeSuggestionPills onPrompt={handleSend} onOpenGame={setArcadeGame} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.4, delay: introComplete ? 0.22 : 0, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <ClaimIdentityCta
              href="/download?intent=identity"
              morphLayout
              onActivate={() => claimFlow.openFrom("hero")}
            />
            <SiteLink
              href="/download"
              className="font-sans text-[13px] font-semibold text-light-space/55 no-underline transition-colors hover:text-light-space/85 light:text-zinc-500 light:hover:text-zinc-800"
            >
              Download Jokuh
            </SiteLink>
          </motion.div>
        </ImmersiveCenterColumn>
      </section>

      <ClaimIdentityLandingOverlay
        open={claimFlow.isOpen}
        source={claimFlow.source}
        power={claimFlow.power}
        onClose={claimFlow.close}
      />

      <LandingArcadeGameOverlay
        open={arcadeGame !== null}
        gameId={arcadeGame}
        onClose={() => setArcadeGame(null)}
      />
    </LayoutGroup>
  );
}
