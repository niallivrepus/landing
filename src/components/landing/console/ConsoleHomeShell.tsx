import { GooeyViewportProvider, useCurrentGooeyViewport, useTheme } from "@jokuh/gooey";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  CONSOLE_BRAND_EXPANSION,
  CONSOLE_BRAND_LINE,
  CONSOLE_PRODUCTS,
  type ConsoleProduct,
  type ConsoleProductId,
} from "../../../data/console-home-products";
import type { LandingArcadeGameId } from "../../../data/landing-arcade-games";
import { useClaimIdentityFlowContext } from "../../../context/ClaimIdentityFlowContext";
import { useDownloadIntercept } from "../../../hooks/useDownloadIntercept";
import { buildWebAppOnboardingHandoffUrl } from "../../../lib/claim-identity-handoff";
import { playGentleHoverSfx } from "../../../lib/gentle-hover-sfx";
import { LANDING_HERO_PREVIEW_PROMPT } from "../../../lib/landing-demo-seed";
import { ImmersiveAppChrome } from "../../system/ImmersiveAppChrome";
import { JokuhButton } from "../../system/JokuhButton";
import { ClaimIdentityLandingOverlay } from "../ClaimIdentityLandingOverlay";
import { HomeFooterRow } from "../HomeFooterRow";
import { HomeShippedTicker } from "../HomeShippedTicker";
import { LandingArcadeGameOverlay } from "../LandingArcadeGameOverlay";
import { LandingPromptBar } from "../LandingPromptBar";
import { LandingPromptBorderBeam } from "../LandingPromptBorderBeam";
import { LandingTempChatPanel } from "../temp-chat/LandingTempChatPanel";
import { useLandingTempChat } from "../temp-chat/useLandingTempChat";
import { ConsoleClock } from "./ConsoleClock";
import { ConsoleStage } from "./ConsoleScene";
import { ConsoleTileRow, type ConsoleFocusSource } from "./ConsoleTileRow";

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;
const SWIPE_MIN_PX = 48;

/**
 * **Purpose:** "Console Home" homepage prototype (`/lab/home`): a PS5 home screen × Netflix billboard.
 * One full-bleed scene per product, a bottom-left title block (eyebrow, title, one sentence, Try it / Learn more),
 * and a tile row that moves focus with arrows, Tab, hover and swipe. OO's title block carries the real prompt bar,
 * which opens the temporary OO chat in place (`useLandingTempChat` → `landing-oo-chat` edge function).
 * Keeps the live home's chrome: corner pills + Nexus (`ImmersiveAppChrome`), shipped ticker, slim footer row,
 * claim-identity overlay and the arcade (chess) overlay.
 * **Connects to:** `LabConsoleHomePage`, `ConsoleStage`, `ConsoleTileRow`, `console-home-products.ts`,
 * `landing-console-home.css`. The live `/` (`LandingImmersiveShell`) is untouched.
 */
export function ConsoleHomeShell() {
  return (
    <GooeyViewportProvider>
      <ConsoleHomeShellInner />
    </GooeyViewportProvider>
  );
}

function ConsoleHomeShellInner() {
  const viewport = useCurrentGooeyViewport();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const light = resolvedTheme === "light";
  const claimFlow = useClaimIdentityFlowContext();
  const { intercept } = useDownloadIntercept("home-immersive");
  const [arcadeGame, setArcadeGame] = useState<LandingArcadeGameId | null>(null);
  const [activeId, setActiveId] = useState<ConsoleProductId>("oo");
  const titleRef = useRef<HTMLDivElement>(null);

  const chat = useLandingTempChat();
  const sendToChat = chat.send;
  const chatOpen = chat.active && activeId === "oo";
  const overlayOpen = arcadeGame !== null || claimFlow.isOpen;

  const active = CONSOLE_PRODUCTS.find((p) => p.id === activeId) ?? CONSOLE_PRODUCTS[0]!;

  const activeRef = useRef(activeId);
  activeRef.current = activeId;

  const focusProduct = useCallback((id: ConsoleProductId, source: ConsoleFocusSource) => {
    if (activeRef.current === id) return;
    activeRef.current = id;
    // Quiet latch tick on deliberate focus moves (keyboard / mouse), never on touch.
    if (source === "keyboard" || source === "pointer") playGentleHoverSfx();
    setActiveId(id);
  }, []);

  const focusPrompt = useCallback(() => {
    window.requestAnimationFrame(() => {
      const field = titleRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        ".console-title__prompt input, .console-title__prompt textarea",
      );
      field?.focus();
    });
  }, []);

  const runPrimary = useCallback(
    (product: ConsoleProduct) => {
      switch (product.primary.kind) {
        case "prompt":
          focusPrompt();
          return;
        case "game":
          setArcadeGame("chess");
          return;
        case "web-app":
          window.location.assign(buildWebAppOnboardingHandoffUrl({ source: "hero", intent: product.primary.intent }));
      }
    },
    [focusPrompt],
  );

  /** Enter / click on a tile: OO → talk, Arcade → play, products → their page. */
  const openProduct = useCallback(
    (id: ConsoleProductId) => {
      const product = CONSOLE_PRODUCTS.find((p) => p.id === id);
      if (!product) return;
      if (product.primary.kind === "web-app") navigate(product.learnMoreHref);
      else runPrimary(product);
    },
    [navigate, runPrimary],
  );

  const step = useCallback(
    (delta: number, source: ConsoleFocusSource) => {
      const index = CONSOLE_PRODUCTS.findIndex((p) => p.id === activeId);
      const next = CONSOLE_PRODUCTS[Math.max(0, Math.min(CONSOLE_PRODUCTS.length - 1, index + delta))];
      if (!next || next.id === activeId) return;
      focusProduct(next.id, source);
      if (source === "keyboard") {
        document.querySelector<HTMLButtonElement>(`.console-tile[data-product="${next.id}"]`)?.focus({ preventScroll: true });
      }
    },
    [activeId, focusProduct],
  );

  // Console-style arrows from anywhere on the page (not while typing or inside an overlay).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (overlayOpen || chatOpen || event.defaultPrevented) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true'], .console-tiles, [role='dialog']")) return;
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1, "keyboard");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chatOpen, overlayOpen, step]);

  // Touch swipe across the open scene moves focus like a controller's d-pad.
  const swipeStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const onSwipeDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    swipeStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  };
  const onSwipeUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || start.id !== event.pointerId || chatOpen) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    step(dx < 0 ? 1 : -1, "touch");
  };

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      sendToChat(!trimmed || trimmed === LANDING_HERO_PREVIEW_PROMPT ? "What can you do, OO?" : trimmed);
    },
    [sendToChat],
  );

  return (
    <LayoutGroup id="claim-identity-home">
      <section
        className="console-home"
        data-chat={chatOpen ? "open" : undefined}
        aria-roledescription="Product home"
        aria-label="Jokuh home"
      >
        <ConsoleStage products={CONSOLE_PRODUCTS} activeId={activeId} reduceMotion={reduceMotion} light={light} />

        <div
          className="console-home__swipe"
          aria-hidden
          onPointerDown={onSwipeDown}
          onPointerUp={onSwipeUp}
          onPointerCancel={() => {
            swipeStart.current = null;
          }}
        />

        <ImmersiveAppChrome
          showLibraryRail={false}
          topCenterBelow={chatOpen ? null : <HomeShippedTicker />}
          bottomCenter={<HomeFooterRow />}
        />

        <ConsoleClock />

        <div className="console-home__content">
          <h1 className="sr-only">
            Jokuh: {CONSOLE_BRAND_LINE} {CONSOLE_BRAND_EXPANSION}
          </h1>

          <div ref={titleRef} className="console-title">
            {/* Sync crossfade on one grid cell (no `mode="wait"`): rapid arrowing can't strand a stale title,
                and the outgoing block overlaps the incoming one instead of pushing layout. */}
            <AnimatePresence initial={false}>
              <motion.div
                key={active.id}
                className="console-title__inner"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={
                  reduceMotion
                    ? { opacity: 0, transition: { duration: 0.12 } }
                    : { opacity: 0, y: -6, filter: "blur(4px)", transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }
                }
                transition={{ duration: 0.26, ease: EASE_PREMIUM }}
              >
                {chatOpen ? null : (
                  <>
                    <p className="console-title__eyebrow">{active.eyebrow}</p>
                    <h2 className={active.id === "oo" ? "console-title__name console-title__name--mark" : "console-title__name"}>
                      {active.title}
                    </h2>
                    <p className="console-title__sentence">{active.sentence}</p>
                  </>
                )}

                {active.id === "oo" ? (
                  <div className="console-title__oo">
                    <AnimatePresence initial={false}>
                      {chatOpen ? (
                        <motion.div
                          key="chat"
                          className="console-title__chat"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.24, ease: EASE_PREMIUM }}
                        >
                          <LandingTempChatPanel
                            chat={chat}
                            onClose={chat.reset}
                            onClaim={() => claimFlow.openFrom("hero")}
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                    <div className="console-title__prompt landing-home-prompt-stack">
                      <LandingPromptBorderBeam>
                        <LandingPromptBar
                          variant={viewport === "phone" ? "phone" : "desktop"}
                          viewport={viewport}
                          previewText={LANDING_HERO_PREVIEW_PROMPT}
                          onSend={handleSend}
                          onPlus={() => intercept("prompt-plus")}
                        />
                      </LandingPromptBorderBeam>
                    </div>
                  </div>
                ) : null}

                {chatOpen ? null : (
                  <div className="console-title__actions">
                    {active.primary.kind === "prompt" ? (
                      <JokuhButton variant="primary" size="md" onClick={() => claimFlow.openFrom("hero")}>
                        Get started
                      </JokuhButton>
                    ) : active.primary.kind === "web-app" ? (
                      <JokuhButton
                        variant="primary"
                        size="md"
                        href={buildWebAppOnboardingHandoffUrl({ source: "hero", intent: active.primary.intent })}
                      >
                        {active.primary.label}
                      </JokuhButton>
                    ) : (
                      <JokuhButton variant="primary" size="md" onClick={() => runPrimary(active)}>
                        {active.primary.label}
                      </JokuhButton>
                    )}
                    <JokuhButton variant="secondary" size="md" href={active.learnMoreHref}>
                      Learn more
                    </JokuhButton>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <ConsoleTileRow
            products={CONSOLE_PRODUCTS}
            activeId={activeId}
            onFocusProduct={focusProduct}
            onOpenProduct={openProduct}
            hidden={chatOpen}
          />
        </div>
      </section>

      <ClaimIdentityLandingOverlay
        open={claimFlow.isOpen}
        source={claimFlow.source}
        power={claimFlow.power}
        onClose={claimFlow.close}
      />

      <LandingArcadeGameOverlay open={arcadeGame !== null} gameId={arcadeGame} onClose={() => setArcadeGame(null)} />
    </LayoutGroup>
  );
}
