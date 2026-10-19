import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildLandingHandoffUrl } from "../../../lib/landing-oo-handoff";
import { GooCornerFrame } from "./GooCornerFrame";
import { GooGlyphMark } from "./GooGlyphMark";
import { GooNexus } from "./GooNexus";
import { GooPromptBar } from "./GooPromptBar";
import { GetJokuhButton, PlatformLinks } from "./GetJokuh";
import type { GooScheme } from "./goo-kit";

/** The background baby-OO swarm: its own chunk, mounted after first paint (never blocks the hero). */
const GooHeroSwarm = lazy(() => import("./GooHeroSwarm"));

/** True once the browser is idle after first paint. */
function useAfterFirstPaint(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idle = 0;
    const raf = requestAnimationFrame(() => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) idle = ric(() => setReady(true), { timeout: 1500 });
      else idle = window.setTimeout(() => setReady(true), 400);
    });
    return () => {
      cancelAnimationFrame(raf);
      const cic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (cic) cic(idle);
      window.clearTimeout(idle);
    };
  }, []);
  return ready;
}

const SUGGESTIONS = ["What can you do, OO?", "Is Jokuh private?", "What's new this week?"] as const;

/** Words of a line, each revealed in turn (`--i` drives the CSS delay). */
function Words({ text, start }: { text: string; start: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="gh-bgtext__word" style={{ "--i": start + i } as React.CSSProperties}>
          {word}{" "}
        </span>
      ))}
    </>
  );
}

/**
 * **Purpose:** The tagline as the hero's background layer: "Your mind. Your machine." large, then the value line,
 * soft and low-contrast behind the Glyph mark and the prompt bar. Words reveal one by one, then the layer drifts
 * slowly (CSS transform/opacity only, compositor-cheap). Absolutely positioned: it can never move the foreground.
 * Reduce Motion: static. `aria-hidden`; the same text is the hero's (visually hidden) `h1`.
 */
function HeroBackgroundText({ headline, valueLine }: { headline: string; valueLine: string }) {
  const [first, ...rest] = headline.split(". ");
  const firstLine = rest.length ? `${first}.` : headline;
  const secondLine = rest.join(". ");
  const firstCount = firstLine.split(" ").length;
  const secondCount = secondLine ? secondLine.split(" ").length : 0;
  return (
    <div className="gh-bgtext" aria-hidden>
      <p className="gh-bgtext__big gh-bgtext__big--top">
        <Words text={firstLine} start={0} />
      </p>
      {secondLine ? (
        <p className="gh-bgtext__big">
          <Words text={secondLine} start={firstCount} />
        </p>
      ) : null}
      <p className="gh-bgtext__value">
        <Words text={valueLine} start={firstCount + secondCount + 1} />
      </p>
    </div>
  );
}

/**
 * **Purpose:** Hero = the app's home on the web. The goo "Ask OO…" bar sits dead-centre and in front of the frozen
 * Glyph mark (with the baby-OO swarm drifting behind, `GooHeroSwarm`, dimmed while the bar has focus or text), whose vertical centre sits on the bar's centre so the bar runs across the middle of the mark
 * (Sean 2026-10-19; web app `.home-logo-glob-glass-wrap--goo-hero`), framed by the goo corner pills (ID, Spine, Call, Text) and the Nexus; suggestion pills
 * and Get Jokuh hang below the field without moving it; the tagline animates in the background layer. Sending uses
 * the OO handoff: the first send or suggestion tap goes straight to the web app's signed-out OO
 * (`app.jokuh.com/oo#q=…&theme=…`, `lib/landing-oo-handoff.ts`), which answers there; no reply renders here.
 * **Connects to:** `GooeyHome`, `GooCornerFrame`, `GooGlyphMark`, `GooNexus`, `GooPromptBar`, `GetJokuh`,
 * jokuh-live `frontend/src/guest-home/landing-handoff.ts` (the app side of the contract).
 */
export function GooHero({ scheme, headline, valueLine }: { scheme: GooScheme; headline: string; valueLine: string }) {
  const [draft, setDraft] = useState("");
  const [leaving, setLeaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const swarmReady = useAfterFirstPaint();
  const [focused, setFocused] = useState(false);

  /** Hand the prompt to the web app's OO, right away (it answers there, looking the same). */
  const send = (text: string) => {
    const t = text.trim();
    if (!t || leaving) return;
    setLeaving(true);
    window.location.assign(buildLandingHandoffUrl([{ role: "user", content: t }], scheme));
  };

  return (
    <section className="gh-hero" aria-labelledby="gh-hero-title">
      {swarmReady ? (
        <Suspense fallback={null}>
          <GooHeroSwarm dim={focused || draft.length > 0 || leaving} />
        </Suspense>
      ) : null}
      <HeroBackgroundText headline={headline} valueLine={valueLine} />
      <h1 id="gh-hero-title" className="sr-only">
        {headline} {valueLine}
      </h1>

      <GooCornerFrame scheme={scheme} nexus={<GooNexus scheme={scheme} />} />

      <div
        className="gh-hero__center"
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        <div className="gh-hero__logo">
          <GooGlyphMark scheme={scheme} className="gh-hero__glyph" />
        </div>

        <GooPromptBar
          ref={inputRef}
          scheme={scheme}
          value={draft}
          onChange={setDraft}
          onSubmit={() => send(draft)}
          onPlus={() => navigate("/download")}
          placeholder="Ask OO…"
          busy={leaving}
        />

        <div className="gh-hero__below">
          <div className="gh-chips" role="list" aria-label="Try asking">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" role="listitem" className="gh-chip gh-slab gh-slab--pill" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
          <div className="gh-hero__cta">
            <GetJokuhButton />
            <PlatformLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
