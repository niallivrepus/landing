import { GooeyViewportProvider, useCurrentGooeyViewport, useTheme } from "@jokuh/gooey";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { resolveWebAppOrigin } from "../../../config/download-links";
import { useClaimIdentityFlowContext } from "../../../context/ClaimIdentityFlowContext";
import {
  CONSOLE_BRAND_EXPANSION,
  CONSOLE_BRAND_LINE,
  CONSOLE_PRODUCTS,
  consoleAppDemoHref,
  type ConsoleProduct,
  type ConsoleProductId,
} from "../../../data/console-home-products";
import type { LandingArcadeGameId } from "../../../data/landing-arcade-games";
import { LANDING_HERO_HEADLINE } from "../../../data/landing-hero-copy";
import type { LandingCornerAction } from "../../../data/landing-shell-preview";
import { useDownloadIntercept } from "../../../hooks/useDownloadIntercept";
import { playGentleHoverSfx } from "../../../lib/gentle-hover-sfx";
import { LANDING_HERO_PREVIEW_PROMPT } from "../../../lib/landing-demo-seed";
import { ImmersiveAppChrome } from "../../system/ImmersiveAppChrome";
import { JokuhButton } from "../../system/JokuhButton";
import { ClaimIdentityCta } from "../ClaimIdentityCta";
import { ClaimIdentityLandingOverlay } from "../ClaimIdentityLandingOverlay";
import { HomeFooterRow } from "../HomeFooterRow";
import { HomeShippedTicker } from "../HomeShippedTicker";
import { LandingArcadeGameOverlay } from "../LandingArcadeGameOverlay";
import { LandingHeroTypewriter } from "../LandingHeroTypewriter";
import { LandingHomeSuggestionPills } from "../LandingHomeSuggestionPills";
import { LandingPromptBar } from "../LandingPromptBar";
import { LandingPromptBorderBeam } from "../LandingPromptBorderBeam";
import { LandingTempChatPanel } from "../temp-chat/LandingTempChatPanel";
import { useLandingTempChat } from "../temp-chat/useLandingTempChat";
import { LANDING_LIBRARY_SERVERS, type LandingLibraryServer } from "../../../data/landing-library-rail-data";
import { HomeLogoGlobGlass } from "../HomeLogoGlobGlass";
import { ConsoleBubblesPanel, type ConsoleBubblesPanelState } from "./ConsoleBubblesPanel";
import { ConsoleClock } from "./ConsoleClock";
import { ConsoleColumn } from "./ConsoleColumn";
import { ConsoleStage, useConsoleParallax } from "./ConsoleScene";
import { ConsoleTileRow, type ConsoleFocusSource } from "./ConsoleTileRow";

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

/** Product energy colour for the eyebrow dot — the same hues its corner glows in (app `ActionButtons.tsx`). */
const ENERGY_FOR_PRODUCT: Record<ConsoleProductId, string> = {
  oo: "#8c73ff",
  spine: "var(--color-yellow-4, #ffb800)",
  calls: "var(--color-green-4, #21dc11)",
  messages: "var(--color-red-4, #ff0700)",
  profile: "var(--color-purple-4, #9327ff)",
  blurbs: "var(--color-pink-4, #ff00ee)",
  arcade: "var(--color-orange-4, #ff4d00)",
};

/** Where each product lives in the app shell: its corner lights up in that corner's energy colour on focus. */
const CORNER_FOR_PRODUCT: Partial<Record<ConsoleProductId, LandingCornerAction>> = {
  spine: "spine",
  calls: "call",
  messages: "text",
  profile: "id",
};
const SWIPE_MIN_PX = 48;

/**
 * **Purpose:** "Console Home" homepage prototype (`/lab/home`): the real app shell × a PS5 home screen.
 * - Centre: the app's squircle center column (`ConsoleColumn`), framed by the four corner pills + Nexus like the real
 *   app. OO shows the live homepage UI (headline, prompt bar, chips, the temporary OO chat opening in place —
 *   `useLandingTempChat` → `landing-oo-chat`); other products show their live demo surface.
 * - Behind: a full-bleed background per product (`ConsoleStage`) with slow drift + parallax.
 * - Bottom: a compact context line (dot · eyebrow, name, one sentence, Open / Learn more — lower-left gutter on wide
 *   screens, centred above the tiles otherwise) and the PS5-style tile row (arrows, Tab, hover, swipe, Enter).
 * - Left: the landing library rail; its Bubbles open a live preview (`ConsoleBubblesPanel`: lobby card, Huddles,
 *   members) and "+" runs a local create-your-own Bubble flow that ends at Claim your identity.
 * - OO's slide is frameless, with the app's logo glob behind the prompt capsule (`HomeLogoGlobGlass`).
 * - The focused product's corner lights in its energy colour; "Open" goes to the real app demo
 *   (`{VITE_ORIGIN_APP}/demo?surface=…`), "Learn more" to the landing product page.
 * Keeps the live home's chrome: shipped ticker, slim footer row, claim-identity overlay, arcade (chess) overlay.
 * **Connects to:** `LabConsoleHomePage`, `ConsoleColumn`, `ConsoleStage`, `ConsoleTileRow`, `console-home-products.ts`,
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
  const reduceMotion = useReducedMotion() ?? false;
  const parallax = useConsoleParallax(reduceMotion);
  const { resolvedTheme } = useTheme();
  const light = resolvedTheme === "light";
  const claimFlow = useClaimIdentityFlowContext();
  const { intercept } = useDownloadIntercept("home-immersive");
  const [arcadeGame, setArcadeGame] = useState<LandingArcadeGameId | null>(null);
  const [activeId, setActiveId] = useState<ConsoleProductId>("oo");
  const [bubblesPanel, setBubblesPanel] = useState<ConsoleBubblesPanelState | null>(null);
  /** Bubbles made in the create-your-own preview: local only, gone on reload. */
  const [previewBubbles, setPreviewBubbles] = useState<LandingLibraryServer[]>([]);
  const [promptFocused, setPromptFocused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const ooRef = useRef<HTMLDivElement>(null);

  // The column fills the space between the top chrome and the dock; publish where the dock starts.
  useEffect(() => {
    const section = sectionRef.current;
    const dock = dockRef.current;
    if (!section || !dock) return undefined;
    const publish = () => section.style.setProperty("--console-dock-top", `${dock.offsetTop}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(dock);
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const chat = useLandingTempChat();
  const sendToChat = chat.send;
  const chatOpen = chat.active && activeId === "oo";
  const overlayOpen = arcadeGame !== null || claimFlow.isOpen || bubblesPanel !== null;
  const openClaim = useCallback(() => claimFlow.openFrom("hero"), [claimFlow]);
  const closeBubbles = useCallback(() => setBubblesPanel(null), []);
  const appOrigin = resolveWebAppOrigin();

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
      ooRef.current?.querySelector<HTMLTextAreaElement | HTMLInputElement>("textarea, input:not([type='file'])")?.focus();
    });
  }, []);

  /** Enter / click on a tile: OO → its prompt, Arcade → play, products → the real app demo of that surface. */
  const openProduct = useCallback(
    (id: ConsoleProductId) => {
      const product = CONSOLE_PRODUCTS.find((p) => p.id === id);
      if (!product) return;
      if (product.id === "oo") focusPrompt();
      else if (product.appSurface) window.open(consoleAppDemoHref(appOrigin, product.appSurface), "_blank", "noopener");
      else setArcadeGame("chess");
    },
    [appOrigin, focusPrompt],
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

  // OO's column: what the live `/` shows — headline, prompt bar, chips, Get started; the chat opens in place.
  const ooContent = (
    <div ref={ooRef} className="console-oo">
      <AnimatePresence mode="wait" initial={false}>
        {chat.active ? (
          <motion.div
            key="chat"
            className="console-oo__chat"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.24, ease: EASE_PREMIUM }}
          >
            <LandingTempChatPanel chat={chat} onClose={chat.reset} onClaim={() => claimFlow.openFrom("hero")} />
          </motion.div>
        ) : (
          <motion.div
            key="headline"
            className="console-oo__headline"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
          >
            <span aria-hidden className="console-oo__headline-sizer landing-hero-headline">
              {LANDING_HERO_HEADLINE}
            </span>
            <LandingHeroTypewriter text={LANDING_HERO_HEADLINE} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="console-oo__prompt landing-home-prompt-stack">
        {/* App home parity: the Jokuh logo glob sits behind the search capsule (`SearchBar.tsx` row). */}
        <div
          className="console-oo__search-row"
          onFocusCapture={() => setPromptFocused(true)}
          onBlurCapture={() => setPromptFocused(false)}
        >
          <div className="home-logo-glob-glass-wrap" aria-hidden>
            <HomeLogoGlobGlass light={light} emphasized={promptFocused || chat.active} />
          </div>
          <div className="console-oo__search-bar">
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
        {chat.active ? null : <LandingHomeSuggestionPills onPrompt={handleSend} onOpenGame={setArcadeGame} />}
      </div>

      {chat.active ? null : (
        <div className="console-oo__cta">
          <ClaimIdentityCta href="/download?intent=identity" morphLayout onActivate={() => claimFlow.openFrom("hero")}>
            Get started
          </ClaimIdentityCta>
        </div>
      )}
    </div>
  );

  return (
    <LayoutGroup id="claim-identity-home">
      <section
        ref={sectionRef}
        className="console-home"
        data-chat={chatOpen ? "open" : undefined}
        aria-roledescription="Product home"
        aria-label="Jokuh home"
      >
        <p className="sr-only">
          Jokuh: {CONSOLE_BRAND_LINE} {CONSOLE_BRAND_EXPANSION}
        </p>

        <ConsoleStage
          products={CONSOLE_PRODUCTS}
          activeId={activeId}
          reduceMotion={reduceMotion}
          light={light}
          parallax={parallax}
        />

        <div
          className="console-home__swipe"
          aria-hidden
          onPointerDown={onSwipeDown}
          onPointerUp={onSwipeUp}
          onPointerCancel={() => {
            swipeStart.current = null;
          }}
        />

        <ConsoleColumn
          products={CONSOLE_PRODUCTS}
          activeId={activeId}
          reduceMotion={reduceMotion}
          light={light}
          parallax={parallax}
          ooContent={ooContent}
        />

        {/* The landing's library rail (bubble pills, + and grid), exactly as on the other landing pages. */}
        <ImmersiveAppChrome
          showLibraryRail
          libraryRailProps={{
            extraServers: previewBubbles,
            selectedServerId: bubblesPanel && bubblesPanel.kind !== "create" ? bubblesPanel.server.id : null,
            onSelectServer: (server) =>
              setBubblesPanel(server.emoji ? { kind: "room", server } : { kind: "lobby", server }),
            onCreate: () => setBubblesPanel({ kind: "create" }),
          }}
          highlightAction={CORNER_FOR_PRODUCT[activeId] ?? null}
          highlightNexus={activeId === "oo"}
          topCenterBelow={chatOpen ? null : <HomeShippedTicker />}
          bottomCenter={<HomeFooterRow />}
        />

        <ConsoleClock />

        <div ref={dockRef} className="console-dock" aria-hidden={chatOpen || undefined} inert={chatOpen || undefined}>
          <ConsoleContext product={active} appOrigin={appOrigin} reduceMotion={reduceMotion} onPlay={() => setArcadeGame("chess")} />
          <ConsoleTileRow
            products={CONSOLE_PRODUCTS}
            activeId={activeId}
            onFocusProduct={focusProduct}
            onOpenProduct={openProduct}
          />
        </div>
      </section>

      <ConsoleBubblesPanel
        state={bubblesPanel}
        servers={[...previewBubbles, ...LANDING_LIBRARY_SERVERS]}
        reduceMotion={reduceMotion}
        onClose={closeBubbles}
        onClaim={openClaim}
        onCreate={() => setBubblesPanel({ kind: "create" })}
        onCreated={(server) => {
          setPreviewBubbles((current) => [server, ...current]);
          setBubblesPanel({ kind: "room", server });
        }}
      />

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

/**
 * Compact context for the focused product — dot · eyebrow, name, one sentence, Open / Learn more. Small on purpose:
 * the column is the hero. Crossfades on one grid cell so rapid arrowing can't strand a stale line.
 */
function ConsoleContext({
  product,
  appOrigin,
  reduceMotion,
  onPlay,
}: {
  product: ConsoleProduct;
  appOrigin: string;
  reduceMotion: boolean;
  onPlay: () => void;
}) {
  return (
    <div className="console-context">
      <AnimatePresence initial={false}>
        <motion.div
          key={product.id}
          className="console-context__inner"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, pointerEvents: "none", transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}
          transition={{ duration: 0.24, delay: 0.04, ease: EASE_PREMIUM }}
        >
          <p className="console-context__eyebrow">
            <span aria-hidden className="console-title__energy" style={{ color: ENERGY_FOR_PRODUCT[product.id] }} />
            {product.eyebrow}
          </p>
          <h2 className="console-context__name">{product.title}</h2>
          <p className="console-context__sentence">{product.sentence}</p>
          <div className="console-context__actions">
            {product.appSurface ? (
              <JokuhButton
                variant="primary"
                size="sm"
                href={consoleAppDemoHref(appOrigin, product.appSurface)}
                aria-label={`Open ${product.title} in the Jokuh app demo`}
              >
                Open
              </JokuhButton>
            ) : (
              <JokuhButton variant="primary" size="sm" onClick={onPlay}>
                Play chess
              </JokuhButton>
            )}
            <JokuhButton variant="secondary" size="sm" href={product.learnMoreHref}>
              Learn more
            </JokuhButton>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
