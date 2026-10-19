import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JokuhOO } from "../../brand/JokuhOO";
import { useLandingTempChat } from "../temp-chat/useLandingTempChat";
import { GooCornerFrame } from "./GooCornerFrame";
import { GooGlyphMark } from "./GooGlyphMark";
import { GooNexus } from "./GooNexus";
import { GooPromptBar } from "./GooPromptBar";
import { GetJokuhButton, PlatformLinks } from "./GetJokuh";
import type { GooScheme } from "./goo-kit";

const SUGGESTIONS = ["What can you do, OO?", "Is Jokuh private?", "What's new this week?"] as const;

const ERROR_COPY = {
  busy: "Lots of people are talking to OO right now. Try again in a minute.",
  unavailable: "OO can't answer right now. Try again in a moment.",
  network: "Couldn't reach OO. Check your connection and try again.",
  turn_limit: "That's the end of this preview.",
} as const;

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
 * Glyph mark, which is centred on the bar's row behind it (app geometry: `HomePlainHomeLogoMark` behind the search
 * row, nudged up 4.4 pt — `behindRowVerticalNudge`; web `.home-logo-glob-glass-wrap`), framed by the goo corner pills (ID, Spine, Call, Text) and the Nexus; suggestion pills
 * and Get Jokuh hang below the field without moving it; the tagline animates in the background layer. Sending uses
 * the real signed-out OO chat (`useLandingTempChat` → jokuh-live edge function `landing-oo-chat`); the chat opens
 * above the field (the logo fades), so the field never moves. Nothing is saved.
 * **Connects to:** `GooeyHome`, `GooCornerFrame`, `GooGlyphMark`, `GooNexus`, `GooPromptBar`, `GetJokuh`, `JokuhOO`.
 */
export function GooHero({ scheme, headline, valueLine }: { scheme: GooScheme; headline: string; valueLine: string }) {
  const chat = useLandingTempChat();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const last = chat.messages[chat.messages.length - 1];

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [chat.messages.length, last?.content, chat.error, chat.atLimit]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || chat.streaming || chat.atLimit) return;
    chat.send(t);
    setDraft("");
  };

  return (
    <section className="gh-hero" aria-labelledby="gh-hero-title" data-chat={chat.active || undefined}>
      <HeroBackgroundText headline={headline} valueLine={valueLine} />
      <h1 id="gh-hero-title" className="sr-only">
        {headline} {valueLine}
      </h1>

      <GooCornerFrame scheme={scheme} nexus={<GooNexus scheme={scheme} />} />

      <div className="gh-hero__center">
        <div className="gh-hero__logo">
          <GooGlyphMark scheme={scheme} className="gh-hero__glyph" />
        </div>

        {chat.active ? (
          <div className="gh-chat gh-slab" aria-label="Temporary chat with OO">
            <header className="gh-chat__head">
              <JokuhOO size={30} />
              <div className="gh-chat__titles">
                <p className="gh-chat__title">Temporary chat with OO</p>
                <p className="gh-chat__sub">Not saved. Closes when you leave.</p>
              </div>
              <button type="button" className="gh-bead gh-bead--sm" aria-label="Close chat" onClick={chat.reset}>
                <X size={16} strokeWidth={2} aria-hidden />
              </button>
            </header>
            <div ref={listRef} className="gh-chat__list" aria-live="polite" aria-busy={chat.streaming}>
              {chat.messages.map((m, i) =>
                m.role === "user" ? (
                  <p key={i} className="gh-chat__me gh-slab gh-slab--tint">
                    {m.content}
                  </p>
                ) : (
                  <p key={i} className={`gh-chat__oo ${i === chat.messages.length - 1 && chat.streaming ? "is-streaming" : ""}`}>
                    {m.content || <span className="gh-chat__thinking">OO is thinking…</span>}
                  </p>
                ),
              )}
              {chat.error && chat.error !== "turn_limit" ? <p className="gh-chat__note gh-slab">{ERROR_COPY[chat.error]}</p> : null}
              {chat.atLimit || chat.error === "turn_limit" ? (
                <div className="gh-chat__note gh-slab">
                  <p>Keep going in the app. OO remembers what matters across your calls, chats and files.</p>
                  <GetJokuhButton size="sm" />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <GooPromptBar
          ref={inputRef}
          scheme={scheme}
          value={draft}
          onChange={setDraft}
          onSubmit={() => send(draft)}
          onPlus={() => navigate("/download")}
          placeholder={chat.atLimit ? "Get Jokuh to keep talking with OO" : "Ask OO…"}
          disabled={chat.atLimit}
          busy={chat.streaming}
        />

        <div className="gh-hero__below">
          {chat.active ? null : (
            <div className="gh-chips" role="list" aria-label="Try asking">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" role="listitem" className="gh-chip gh-slab gh-slab--pill" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="gh-hero__cta">
            <GetJokuhButton />
            <PlatformLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
