import { GooeyViewportProvider } from "@jokuh/gooey";
import { useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { ImmersiveBackCornerButton } from "../system/ImmersiveBackCornerButton";

/**
 * **Purpose:** Full-viewport `/invest` shell — corner chrome, Nexus, library rail, back in top-leading.
 * **Connects to:** `InvestPage`, `ImmersiveAppChrome`, `invest-overview.ts`.
 * **Parity:** Download/Blurbs immersive shells; app `onboardingBackAction` top-leading back pill.
 */
export function InvestImmersiveShell({ children }: { children: ReactNode }) {
  return (
    <GooeyViewportProvider>
      <InvestImmersiveShellInner>{children}</InvestImmersiveShellInner>
    </GooeyViewportProvider>
  );
}

function InvestImmersiveShellInner({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    const historyIndex = window.history.state?.idx;
    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate("/");
  }, [navigate]);

  return (
    <section className="relative min-h-[100svh] overflow-x-hidden" aria-label="Invest in Jokuh">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/74 to-black/94 light:from-white/58 light:via-white/84 light:to-white/98"
        aria-hidden
      />

      <ImmersiveAppChrome
        showLibraryRail={false}
        topLeadingSlot={<ImmersiveBackCornerButton onBack={handleBack} />}
      />

      <div className="relative z-10 mx-auto w-full max-w-[960px] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+48px)] pt-[calc(env(safe-area-inset-top,0px)+88px)]">
        {children}
      </div>
    </section>
  );
}
