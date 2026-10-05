import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  CONSOLE_CREATE_COLORS,
  CONSOLE_CREATE_EMOJIS,
  CONSOLE_CREATE_JOINERS,
  CONSOLE_DEMO_BUBBLES,
  consoleAgent,
  type ConsoleDemoBubble,
  type ConsoleDemoHuddle,
} from "../../../data/console-bubbles-demo";
import { LANDING_BUBBLES_FEATURES } from "../../../data/landing-bubbles-copy";
import type { LandingLibraryServer } from "../../../data/landing-library-rail-data";
import { JokuhButton } from "../../system/JokuhButton";
import { SquircleBox } from "../../system/squircle";
import { GoldStar, RailServerAvatar } from "../LandingLibraryRail";

export type ConsoleBubblesPanelState =
  | { kind: "bubble"; server: LandingLibraryServer }
  | { kind: "create" }
  | { kind: "room"; server: LandingLibraryServer };

const MEMORY_COPY = LANDING_BUBBLES_FEATURES.find((feature) => feature.id === "memory")?.body ?? "";
const JOIN_STEP_MS = 750;

/**
 * **Purpose:** The console home's live Bubbles preview, opened from the library rail.
 * - A rail Bubble opens its lobby card the way the app's Workspaces drawer shows an expanded Bubble: the Bubble pill
 *   (avatar, name, Share, Settings), its Huddles (the `oo` Huddle, text / announcement / voice, unread counts, a live
 *   Beam), recent lines from a Huddle, and members with roles.
 * - "+" opens Create a Bubble: name + emoji + colour → the new pill appears in the rail right away (local state),
 *   then it opens as a chat room: its `oo` Huddle, demo agents joining, OO's welcome.
 * Everything is a labelled preview: nothing is saved or sent; every real action (join, share, settings, invite,
 * send, open a Huddle) opens Claim your identity.
 * **Connects to:** `ConsoleHomeShell` (state, rail extra servers, claim flow), `console-bubbles-demo.ts`,
 * `LandingLibraryRail` (avatar + star). **Parity (web app):** `bubbles/BubblesDrawer.tsx`, `HuddleLobbyForest.tsx`.
 */
export function ConsoleBubblesPanel({
  state,
  reduceMotion,
  onClose,
  onClaim,
  onCreated,
}: {
  state: ConsoleBubblesPanelState | null;
  reduceMotion: boolean;
  onClose: () => void;
  onClaim: () => void;
  onCreated: (server: LandingLibraryServer) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!state) return undefined;
    returnFocus.current ??= document.activeElement as HTMLElement | null;
    const id = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus], button, input")?.focus({ preventScroll: true });
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, state]);

  useEffect(() => {
    if (state) return;
    returnFocus.current?.focus?.({ preventScroll: true });
    returnFocus.current = null;
  }, [state]);

  const key = state ? (state.kind === "create" ? "create" : `${state.kind}-${state.server.id}`) : null;

  return (
    <AnimatePresence>
      {state ? (
        <motion.div
          key="panel"
          ref={panelRef}
          className="console-bubbles"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16, scale: 0.98 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12, transition: { duration: 0.16 } }}
          transition={reduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
        >
          <SquircleBox
            radius={32}
            className="console-bubbles__box"
            fillClassName="console-bubbles__fill"
            rimClassName="console-bubbles__rim"
            shadowClassName="console-bubbles__shadow"
          >
            <div className="console-bubbles__top">
              <span className="console-bubbles__preview">Preview</span>
              <button type="button" className="console-bubbles__close" aria-label="Close preview" onClick={onClose}>
                ×
              </button>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={key}
                className="console-bubbles__body"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {state.kind === "bubble" ? (
                  <BubbleLobby server={state.server} titleId={titleId} onClaim={onClaim} />
                ) : state.kind === "create" ? (
                  <CreateBubble titleId={titleId} onCreated={onCreated} />
                ) : (
                  <BubbleRoom server={state.server} titleId={titleId} reduceMotion={reduceMotion} onClaim={onClaim} />
                )}
              </motion.div>
            </AnimatePresence>
          </SquircleBox>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ─── Lobby card ──────────────────────────────────────────────────────────────

function BubblePill({ server, titleId, onClaim }: { server: LandingLibraryServer; titleId: string; onClaim: () => void }) {
  return (
    <div className="console-bubble-pill">
      <RailServerAvatar server={server} />
      <h2 id={titleId} className="console-bubble-pill__name">
        {server.name}
      </h2>
      {server.hasStar ? <GoldStar /> : null}
      <button type="button" className="console-bubble-pill__btn" aria-label={`Share ${server.name}`} onClick={onClaim}>
        ↗
      </button>
      <button type="button" className="console-bubble-pill__btn" aria-label={`${server.name} settings`} onClick={onClaim}>
        ⚙
      </button>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="console-bubbles__label">{children}</p>;
}

function HuddleRow({ huddle, onClaim }: { huddle: ConsoleDemoHuddle; onClaim: () => void }) {
  const kindLabel = huddle.kind === "announcement" ? "announcement" : huddle.kind === "voice" ? "voice" : null;
  return (
    <button
      type="button"
      className="console-huddle"
      data-unread={huddle.unread ? "true" : undefined}
      onClick={onClaim}
      aria-label={`${huddle.name} huddle${huddle.unread ? `, ${huddle.unread} unread` : ""}${huddle.live ? ", live" : ""}`}
    >
      <span aria-hidden className="console-huddle__dot" />
      <span className="console-huddle__name">{huddle.name}</span>
      {kindLabel ? <span className="console-huddle__kind">{kindLabel}</span> : null}
      <span className="console-huddle__trail">
        {huddle.live ? (
          <>
            <span className="console-faces" aria-hidden>
              {huddle.live.map((id) => (
                <img key={id} src={consoleAgent(id).src} alt="" />
              ))}
            </span>
            <span className="console-huddle__live">Live</span>
          </>
        ) : null}
        {huddle.unread ? <span className="console-huddle__unread">{huddle.unread}</span> : null}
      </span>
    </button>
  );
}

function BubbleLobby({ server, titleId, onClaim }: { server: LandingLibraryServer; titleId: string; onClaim: () => void }) {
  const bubble: ConsoleDemoBubble | undefined = CONSOLE_DEMO_BUBBLES[server.id];
  if (!bubble) return null;
  return (
    <>
      <BubblePill server={server} titleId={titleId} onClaim={onClaim} />
      <p className="console-bubbles__meta">
        Bubble · {bubble.memberCount} members · {bubble.huddles.length} Huddles
      </p>

      <SectionLabel>huddles</SectionLabel>
      <div className="console-bubbles__list">
        {bubble.huddles.map((huddle) => (
          <HuddleRow key={huddle.name} huddle={huddle} onClaim={onClaim} />
        ))}
      </div>

      <SectionLabel>recent in {bubble.recent.huddle}</SectionLabel>
      <div className="console-bubbles__recent">
        {bubble.recent.lines.map((line, index) => {
          const agent = consoleAgent(line.agent);
          return (
            <div key={index} className="console-line">
              <img className="console-line__avatar" src={agent.src} alt="" />
              <p className="console-line__text">
                <span className="console-line__name">{agent.name}</span> {line.text}
              </p>
            </div>
          );
        })}
      </div>

      <SectionLabel>members</SectionLabel>
      <div className="console-bubbles__members">
        {bubble.members.map((member) => {
          const agent = consoleAgent(member.agent);
          return (
            <div key={member.agent} className="console-member">
              <img className="console-member__avatar" src={agent.src} alt="" />
              <span className="console-member__name">{agent.name}</span>
              <span className="console-member__role">{member.role}</span>
            </div>
          );
        })}
      </div>

      <p className="console-bubbles__note">{MEMORY_COPY}</p>
      <div className="console-bubbles__actions">
        <JokuhButton variant="primary" size="sm" onClick={onClaim}>
          Join Bubble
        </JokuhButton>
      </div>
    </>
  );
}

// ─── Create your own ─────────────────────────────────────────────────────────

function CreateBubble({ titleId, onCreated }: { titleId: string; onCreated: (server: LandingLibraryServer) => void }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState<string>(CONSOLE_CREATE_EMOJIS[0]);
  const [color, setColor] = useState<string>(CONSOLE_CREATE_COLORS[0]);
  const nameId = useId();
  const trimmed = name.trim();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!trimmed) return;
    onCreated({
      id: `preview-${Date.now().toString(36)}`,
      name: trimmed,
      emoji,
      symbolSrc: "",
      backgroundColor: color,
    });
  };

  return (
    <form className="console-create" onSubmit={submit}>
      <h2 id={titleId} className="console-bubbles__title">
        Create a Bubble
      </h2>
      <p className="console-bubbles__meta">Nothing is saved or sent. This preview lives in this tab only.</p>

      <label className="console-create__label" htmlFor={nameId}>
        Name
      </label>
      <input
        id={nameId}
        data-autofocus
        className="console-create__input"
        value={name}
        maxLength={28}
        placeholder="Saturday photo walk"
        autoComplete="off"
        onChange={(event) => setName(event.target.value)}
      />

      <p className="console-create__label" id={`${nameId}-emoji`}>
        Emoji
      </p>
      <div className="console-create__choices" role="radiogroup" aria-labelledby={`${nameId}-emoji`}>
        {CONSOLE_CREATE_EMOJIS.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={emoji === option}
            aria-label={`Emoji ${option}`}
            className="console-create__emoji"
            onClick={() => setEmoji(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="console-create__label" id={`${nameId}-color`}>
        Colour
      </p>
      <div className="console-create__choices" role="radiogroup" aria-labelledby={`${nameId}-color`}>
        {CONSOLE_CREATE_COLORS.map((option, index) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={color === option}
            aria-label={`Colour ${index + 1}`}
            className="console-create__swatch"
            style={{ background: option }}
            onClick={() => setColor(option)}
          />
        ))}
      </div>

      <div className="console-bubble-pill console-bubble-pill--preview" aria-hidden>
        <span className="console-create__avatar" style={{ background: color }}>
          {emoji}
        </span>
        <span className="console-bubble-pill__name">{trimmed || "Your Bubble"}</span>
      </div>

      <div className="console-bubbles__actions">
        <JokuhButton type="submit" variant="primary" size="sm" disabled={!trimmed}>
          Create Bubble
        </JokuhButton>
      </div>
    </form>
  );
}

// ─── The new Bubble as a chat room ───────────────────────────────────────────

function BubbleRoom({
  server,
  titleId,
  reduceMotion,
  onClaim,
}: {
  server: LandingLibraryServer;
  titleId: string;
  reduceMotion: boolean;
  onClaim: () => void;
}) {
  const steps = CONSOLE_CREATE_JOINERS.length + 1;
  const [shown, setShown] = useState(reduceMotion ? steps : 0);

  useEffect(() => {
    if (reduceMotion) {
      setShown(steps);
      return undefined;
    }
    const timers = Array.from({ length: steps }, (_, index) =>
      window.setTimeout(() => setShown(index + 1), JOIN_STEP_MS * (index + 1)),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduceMotion, steps]);

  const sendOrInvite = (event?: FormEvent) => {
    event?.preventDefault();
    onClaim();
  };

  return (
    <div className="console-room">
      <BubblePill server={server} titleId={titleId} onClaim={onClaim} />
      <p className="console-bubbles__meta">Your Bubble starts with an oo Huddle, the home for @oo.</p>
      <SectionLabel># oo</SectionLabel>
      <div className="console-room__log" aria-live="polite">
        {CONSOLE_CREATE_JOINERS.slice(0, Math.min(shown, CONSOLE_CREATE_JOINERS.length)).map((id) => {
          const agent = consoleAgent(id);
          return (
            <motion.p
              key={id}
              className="console-room__system"
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img src={agent.src} alt="" /> {agent.name} joined
            </motion.p>
          );
        })}
        {shown >= steps ? (
          <motion.div
            className="console-line console-line--oo"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="console-line__oo" aria-hidden>
              OO
            </span>
            <p className="console-line__text">
              <span className="console-line__name">OO</span> Welcome to {server.name}. Mention @oo here and I&apos;ll
              keep track of what&apos;s decided, who said it and what needs doing next.
            </p>
          </motion.div>
        ) : null}
      </div>
      <form className="console-room__composer" onSubmit={sendOrInvite}>
        <input className="console-create__input" placeholder="Message #oo" aria-label="Message #oo" />
        <JokuhButton type="submit" variant="secondary" size="sm">
          Send
        </JokuhButton>
      </form>
      <div className="console-bubbles__actions">
        <JokuhButton variant="primary" size="sm" onClick={() => sendOrInvite()}>
          Invite people
        </JokuhButton>
      </div>
    </div>
  );
}
