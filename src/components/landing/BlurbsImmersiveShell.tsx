import { GooeyViewportProvider } from "@jokuh/gooey";
import { useCallback } from "react";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { ImmersiveCenterColumn } from "../system/ImmersiveCenterColumn";
import { BlurbsComposerBar } from "./BlurbsComposerBar";
import { ImmersiveProductBackdrop } from "./ImmersiveProductBackdrop";
import { PublicBlurbsFeed } from "./PublicBlurbsFeed";

/**
 * **Purpose:** Full-viewport Blurbs page — immersive backdrop, live public feed, bottom composer.
 * **Connects to:** `ProductPage`, `ImmersiveAppChrome`, `public-blurbs-feed.ts`, `/download` intercept.
 */
export function BlurbsImmersiveShell() {
  return (
    <GooeyViewportProvider>
      <BlurbsImmersiveShellInner />
    </GooeyViewportProvider>
  );
}

function BlurbsImmersiveShellInner() {
  const { intercept } = useDownloadIntercept("blurbs-immersive");

  const handleComposerSubmit = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      intercept("prompt-plus", { product: "blurbs" });
    },
    [intercept],
  );

  return (
    <section className="relative min-h-[100svh] overflow-hidden" aria-label="Blurbs preview">
      <ImmersiveProductBackdrop productId="blurbs" />

      <ImmersiveAppChrome bottomCenter={<BlurbsComposerBar onSubmit={handleComposerSubmit} />} />

      <ImmersiveCenterColumn maxWidthClass="max-w-[520px]">
        <PublicBlurbsFeed />
      </ImmersiveCenterColumn>
    </section>
  );
}
