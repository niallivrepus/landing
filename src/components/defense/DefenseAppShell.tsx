import { GooeyViewportProvider, cn, useTheme } from "@jokuh/gooey";
import { useReducedMotion } from "motion/react";
import { useCallback, useMemo, useRef, useState, type CSSProperties } from "react";
import { CONSOLE_PRODUCTS, type ConsoleProductId } from "../../data/console-home-products";
import { DEFENSE_AUTOPLAY, DEFENSE_DOC, type DefenseNodeId, type DefenseTrustNodeId } from "../../data/defense";
import { ConsoleStage, useConsoleParallax } from "../landing/console/ConsoleScene";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { DefenseDoc } from "./DefenseDoc";
import { DefenseDocSheet } from "./DefenseDocSheet";
import { CORNER_FOR_NODE, DEFENSE_STOPS, NODE_FOR_TRUST, STAGE_FOR_NODE, type DefenseStop } from "./defense-stops";
import { DEFENSE_NODE_ENERGY, DefenseSystemGraph } from "./DefenseSystemGraph";
import { useDefenseAutoplay } from "./useDefenseAutoplay";

/**
 * **Purpose:** `/defense` as the app itself. The homepage's app shell — full-bleed scene (`ConsoleStage`), the four
 * corner pills + Nexus (`ImmersiveAppChrome`, pills still navigate to their landing pages) — framing one center
 * column: a Jokuh Docs sheet (`DefenseDocSheet`) holding the defense doc (`DefenseDoc`). The doc plays itself in
 * ≈85 s (`useDefenseAutoplay`): section by section it scrolls, the matching corner lights in its app colour
 * (`highlightAction`, Nexus for OO — the homepage mechanism), the recording plays, the diagram node pulses, and the
 * scene behind the column follows. Wide screens add a contents rail (left) and a live mini map of the system (right);
 * the Auto-play toggle + progress sit bottom-centre. Reader input pauses it. Reduced motion: a static doc, no toggle.
 * **Connects to:** `pages/DefensePage.tsx`, `defense-stops.ts`, `landing-console-home.css` (stage + shell vars),
 * `defense-app.css`.
 */
export function DefenseAppShell() {
  return (
    <GooeyViewportProvider>
      <DefenseAppShellInner />
    </GooeyViewportProvider>
  );
}

function energyOf(stop: DefenseStop): string {
  const node = stop.node ?? stop.nodes[stop.nodes.length - 1];
  return node ? DEFENSE_NODE_ENERGY[node] : "currentColor";
}

const STAGE_PRODUCTS = CONSOLE_PRODUCTS.filter((p) =>
  (["oo", "spine", "calls", "messages", "profile"] as ConsoleProductId[]).includes(p.id),
);

function DefenseAppShellInner() {
  const reduceMotion = useReducedMotion() ?? false;
  const parallax = useConsoleParallax(reduceMotion);
  const { resolvedTheme } = useTheme();
  const light = resolvedTheme === "light";
  const scrollerRef = useRef<HTMLDivElement>(null);
  const autoplay = useDefenseAutoplay(scrollerRef, DEFENSE_STOPS, !reduceMotion);
  const stop = DEFENSE_STOPS[autoplay.activeIndex] ?? DEFENSE_STOPS[0]!;

  // Sections that tour their own parts report the focused part; corners, scene and mini map follow it.
  const [trustFocus, setTrustFocus] = useState<DefenseTrustNodeId | null>(null);
  const [capabilityFocus, setCapabilityFocus] = useState<DefenseNodeId | null>(null);
  const onTrustFocus = useCallback((id: DefenseTrustNodeId | null) => setTrustFocus(id), []);
  const onCapabilityFocus = useCallback((node: DefenseNodeId | null) => setCapabilityFocus(node), []);

  const focusNode: DefenseNodeId | null =
    stop.id === "connected" ? (trustFocus ? NODE_FOR_TRUST[trustFocus] : null) : stop.id === "capabilities" ? capabilityFocus : null;

  const litNodes: DefenseNodeId[] = focusNode ? [focusNode] : stop.nodes;
  const focusCorner = focusNode ? CORNER_FOR_NODE[focusNode] : undefined;
  const highlightAction = focusNode
    ? focusCorner && focusCorner !== "nexus"
      ? focusCorner
      : null
    : stop.corner ?? null;
  const highlightNexus = focusNode ? focusCorner === "nexus" : Boolean(stop.nexus);
  const stageId: ConsoleProductId = focusNode ? STAGE_FOR_NODE[focusNode] : stop.stage;

  const progressStyle = useMemo(
    () => ({ "--dwell": `${stop.dwellMs}ms` }) as CSSProperties,
    [stop.dwellMs],
  );
  const running = autoplay.playing && !autoplay.hidden;

  return (
    <section className="console-home defense-app" aria-label={DEFENSE_DOC.name} data-playing={running ? "true" : "false"}>
      <ConsoleStage products={STAGE_PRODUCTS} activeId={stageId} reduceMotion={reduceMotion} light={light} parallax={parallax} />

      {/* The center column: the Docs sheet. */}
      <div className="defense-column-wrap">
        <div className="defense-column">
          <DefenseDocSheet onReplay={autoplay.replay}>
            <DefenseDoc
              ref={scrollerRef}
              activeStop={stop.id}
              playing={running}
              pageHidden={autoplay.hidden}
              light={light}
              reduceMotion={reduceMotion}
              onTrustFocus={onTrustFocus}
              onCapabilityFocus={onCapabilityFocus}
            />
          </DefenseDocSheet>
        </div>
      </div>

      {/* Wide screens: contents (left) and the live system map (right). */}
      <nav className="defense-gutter defense-gutter--left" aria-label="Contents">
        <p className="defense-gutter__eyebrow">Contents</p>
        <ol className="defense-toc">
          {DEFENSE_STOPS.map((s, i) => (
            <li key={s.id} data-sub={s.sub ? "true" : undefined}>
              <button
                type="button"
                className="defense-toc__item"
                aria-current={i === autoplay.activeIndex ? "step" : undefined}
                onClick={() => autoplay.goTo(i)}
                style={{ "--energy": energyOf(s) } as CSSProperties}
              >
                <span aria-hidden className="defense-toc__dot" />
                {s.label}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <aside className="defense-gutter defense-gutter--right" aria-label="How the parts connect">
        <p className="defense-gutter__eyebrow">How it connects</p>
        <DefenseSystemGraph compact active={litNodes} reduceMotion={reduceMotion} title="Mini map of the Jokuh system" />
        <p className="defense-gutter__now" aria-live="polite">
          {stop.label}
        </p>
      </aside>

      <ImmersiveAppChrome
        showLibraryRail={false}
        highlightAction={highlightAction}
        highlightNexus={highlightNexus}
        bottomCenter={
          reduceMotion ? null : (
            <div className="defense-autoplay" style={progressStyle}>
              <button
                type="button"
                className="defense-autoplay__toggle"
                aria-pressed={autoplay.playing}
                onClick={autoplay.toggle}
              >
                <span aria-hidden className={cn("defense-autoplay__icon", autoplay.playing && "is-playing")} />
                <span className="defense-autoplay__label">{autoplay.ended ? DEFENSE_AUTOPLAY.replay : DEFENSE_AUTOPLAY.label}</span>
              </button>
              <span
                className="defense-autoplay__track"
                role="progressbar"
                aria-label="Doc progress"
                aria-valuemin={1}
                aria-valuemax={DEFENSE_STOPS.length}
                aria-valuenow={autoplay.activeIndex + 1}
                aria-valuetext={`${stop.label}, ${autoplay.activeIndex + 1} of ${DEFENSE_STOPS.length}`}
              >
                {DEFENSE_STOPS.map((s, i) => (
                  <span
                    key={s.id}
                    className="defense-autoplay__seg"
                    data-state={i < autoplay.activeIndex || autoplay.ended ? "done" : i === autoplay.activeIndex ? "now" : "next"}
                  >
                    {i === autoplay.activeIndex && !autoplay.ended ? (
                      <span
                        key={autoplay.runKey}
                        className="defense-autoplay__fill"
                        data-running={running ? "true" : "false"}
                      />
                    ) : null}
                  </span>
                ))}
              </span>
            </div>
          )
        }
      />
    </section>
  );
}
