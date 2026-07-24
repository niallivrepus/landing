import {
  GooeyViewportProvider,
  useCurrentGooeyViewport,
} from "@jokuh/gooey";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LANDING_DEMO_THINKING_MS,
  createLandingOoReply,
  createLandingThinkingMessage,
  createLandingUserMessage,
  type LandingDemoMessage,
} from "../../data/landing-demo-chat";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import { useClaimIdentityFlowContext } from "../../context/ClaimIdentityFlowContext";
import { ClaimIdentityCta } from "./ClaimIdentityCta";
import { ClaimIdentityLandingOverlay } from "./ClaimIdentityLandingOverlay";
import { LandingDemoChat, LandingOoWelcomeRow } from "./LandingDemoChat";
import { LandingPromptBar } from "./LandingPromptBar";
import { LandingProductSlideshow } from "./LandingProductSlideshow";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { ImmersiveCenterColumn } from "../system/ImmersiveCenterColumn";

type DemoLocationState = {
  seedMessage?: string;
};

/**
 * **Purpose:** Post-prompt demo page — product slideshow squircle, OO chat bubbles, and live prompt bar.
 * **Connects to:** Homepage `handleSend` navigation, `landing-demo-chat.ts`, `/download` intercept.
 */
export function LandingDemoShell() {
  return (
    <GooeyViewportProvider>
      <LandingDemoShellInner />
    </GooeyViewportProvider>
  );
}

function LandingDemoShellInner() {
  const viewport = useCurrentGooeyViewport();
  const location = useLocation();
  const { intercept } = useDownloadIntercept("demo-immersive");
  const claimFlow = useClaimIdentityFlowContext();
  const [messages, setMessages] = useState<LandingDemoMessage[]>([]);
  const thinkingTimeoutRef = useRef<number | null>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    return () => {
      if (thinkingTimeoutRef.current) window.clearTimeout(thinkingTimeoutRef.current);
    };
  }, []);

  const appendExchange = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage = createLandingUserMessage(trimmed);
    const thinkingMessage = createLandingThinkingMessage();

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);

    if (thinkingTimeoutRef.current) window.clearTimeout(thinkingTimeoutRef.current);
    thinkingTimeoutRef.current = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === thinkingMessage.id
            ? { ...createLandingOoReply(trimmed), id: thinkingMessage.id }
            : message,
        ),
      );
    }, LANDING_DEMO_THINKING_MS);
  }, []);

  useEffect(() => {
    if (seededRef.current) return;
    const state = location.state as DemoLocationState | null;
    const seed = state?.seedMessage?.trim();
    if (!seed) return;
    seededRef.current = true;
    appendExchange(seed);
  }, [appendExchange, location.state]);

  const handleSend = useCallback(
    (text: string) => {
      appendExchange(text);
    },
    [appendExchange],
  );

  return (
    <>
      <section
        className="relative flex min-h-[100svh] flex-col overflow-hidden"
        aria-label="Jokuh demo conversation"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/74 to-black/94 light:from-white/58 light:via-white/84 light:to-white/98"
          aria-hidden
        />

        <ImmersiveAppChrome />

        <ImmersiveCenterColumn
          maxWidthClass="max-w-[720px]"
          className="flex-1 min-h-0 pb-[calc(env(safe-area-inset-bottom,0px)+88px)] pt-[calc(env(safe-area-inset-top,0px)+72px)]"
        >
          <div className="flex w-full max-w-[450px] flex-col gap-3">
            {messages.length === 0 ? <LandingOoWelcomeRow /> : null}
            <LandingDemoChat
              messages={messages}
              className="max-h-[min(36vh,320px)] overflow-y-auto px-1"
            />
          </div>

          <LandingProductSlideshow className="mt-5 max-w-[560px]" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 w-full max-w-[450px]"
          >
            <LandingPromptBar
              variant={viewport === "phone" ? "phone" : "desktop"}
              viewport={viewport}
              previewText="ask anything"
              onSend={handleSend}
              onPlus={() => intercept("prompt-plus")}
              keepFocusedOnSend
            />
          </motion.div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <ClaimIdentityCta
              href="/download?intent=identity"
              onActivate={() => claimFlow.openFrom("demo")}
            />
          </div>
        </ImmersiveCenterColumn>
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
