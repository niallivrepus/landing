import { GooeyViewportProvider, useCurrentGooeyViewport } from "@jokuh/gooey";
import { LayoutGroup, motion } from "motion/react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LandingArcadeGameId } from "../../data/landing-arcade-games";
import { LANDING_HERO_HEADLINE, LANDING_HERO_SLOGAN } from "../../data/landing-hero-copy";
import { LandingHeroTypewriter } from "./LandingHeroTypewriter";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import { useClaimIdentityFlowContext } from "../../context/ClaimIdentityFlowContext";
import { ClaimIdentityCta } from "./ClaimIdentityCta";
import { ClaimIdentityLandingOverlay } from "./ClaimIdentityLandingOverlay";
import { LandingHomeBackdrop } from "./LandingHomeBackdrop";
import { LandingHomeSuggestionPills } from "./LandingHomeSuggestionPills";
import { LandingArcadeGameOverlay } from "./LandingArcadeGameOverlay";
import { LandingBlueCta } from "./LandingBlueCta";
import { LandingBlurbsPill } from "./LandingBlurbsPill";
import { LandingPromptBar } from "./LandingPromptBar";
import { LandingPromptBorderBeam } from "./LandingPromptBorderBeam";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { ImmersiveCenterColumn } from "../system/ImmersiveCenterColumn";

/**
 * **Purpose:** Full-viewport home hero — corner pills, headline above prompt, stacked CTAs.
 * Sending a prompt navigates to `/demo` for OO chat + product slideshow.
 * **Connects to:** `LandingHero`, `LandingDemoShell`, Gooey `InteractivePromptBar`.
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
  const navigate = useNavigate();
  const { intercept } = useDownloadIntercept("home-immersive");
  const claimFlow = useClaimIdentityFlowContext();
  const [arcadeGame, setArcadeGame] = useState<LandingArcadeGameId | null>(null);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      navigate("/demo", { state: { seedMessage: trimmed } });
    },
    [navigate],
  );

  return (
    <LayoutGroup id="claim-identity-home">
      <section
        className="relative flex min-h-[100svh] flex-col overflow-hidden"
        aria-label="Jokuh home"
      >
        <LandingHomeBackdrop />

        <ImmersiveAppChrome bottomCenter={<LandingBlurbsPill />} />

        <ImmersiveCenterColumn
          maxWidthClass="max-w-[720px]"
          className="flex-1 min-h-0 pb-[calc(env(safe-area-inset-bottom,0px)+88px)] pt-[calc(env(safe-area-inset-top,0px)+72px)]"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex w-full flex-col items-center text-center"
          >
            <LandingHeroTypewriter text={LANDING_HERO_HEADLINE} />
            <p className="mx-auto mt-4 max-w-[50ch] font-sans text-[15px] leading-relaxed text-light-space/65 light:text-zinc-600 sm:text-[16px]">
              {LANDING_HERO_SLOGAN}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="landing-home-prompt-stack w-full max-w-[450px] self-center text-left"
          >
            <LandingPromptBorderBeam>
              <LandingPromptBar
                variant={viewport === "phone" ? "phone" : "desktop"}
                viewport={viewport}
                previewText="ask anything"
                onSend={handleSend}
                onPlus={() => intercept("prompt-plus")}
              />
            </LandingPromptBorderBeam>
            <LandingHomeSuggestionPills onPrompt={handleSend} onOpenGame={setArcadeGame} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <ClaimIdentityCta
              href="/download?intent=identity"
              morphLayout
              onActivate={() => claimFlow.openFrom("hero")}
            />
            <LandingBlueCta href="/download">Download Jokuh</LandingBlueCta>
          </motion.div>
        </ImmersiveCenterColumn>
      </section>

      <ClaimIdentityLandingOverlay
        open={claimFlow.isOpen}
        source={claimFlow.source}
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
