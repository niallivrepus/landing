import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  CONSOLE_CREATE_COLORS,
  CONSOLE_CREATE_EMOJIS,
  CONSOLE_CREATE_JOINERS,
  CONSOLE_DEMO_BUBBLES,
  CONSOLE_HUDDLE_DOTS,
  CONSOLE_OO_CHATS,
  consoleAgent,
  type ConsoleDemoHuddle,
} from "../../../data/console-bubbles-demo";
import type { LandingLibraryServer } from "../../../data/landing-library-rail-data";
import { JokuhButton } from "../../system/JokuhButton";
import { SquircleBox } from "../../system/squircle";
import { RailServerAvatar } from "../LandingLibraryRail";

export type ConsoleBubblesPanelState =
  | { kind: "lobby"; server: LandingLibraryServer }
  | { kind: "create" }
  | { kind: "room"; server: LandingLibraryServer };

type View =
  | { kind: "lobby"; serverId: string }
  | { kind: "huddle"; serverId: string; huddle: string }
  | { kind: "details"; serverId: string }
  | { kind: "create" }
  | { kind: "room"; serverId: string };

const JOIN_STEP_MS = 750;

/**
 * **Purpose:** The console home's live Bubbles preview, opened from the library rail — mirroring the real app's
 * Workspaces drawer lobby (`app.jokuh.com/demo?chrome=rail`): the opened Bubble as an expanded card (Bubble pill with
 * Share + Settings, its Huddle rows with dots, unread badges and the green Live chip), then "recent chats" (the other
 * Bubbles as pills with Beam faces), "Have an invite?", "OO chats" and the search field.
 * - A Huddle opens its recent lines; Settings opens Bubble details (Members with roles).
 * - "+" opens Create a Bubble: name + emoji + colour → the pill appears in the rail at once (local state) and opens
 *   as a room: its Lobby Huddle, demo agents joining, OO's welcome.
 * A labelled preview: nothing is saved or sent; every real action (join, share, invite, send, open in the app)
 * opens Claim your identity. Light theme keeps title pills light (the app's dark-on-black light bug isn't copied).
 * **Connects to:** `ConsoleHomeShell`, `console-bubbles-demo.ts`, `LandingLibraryRail` (avatars).
 * **Parity (web app):** `bubbles/BubblesDrawer.tsx` (lobby, details), `bubbles/HuddleLobbyForest.tsx` (rows).
 */
export function ConsoleBubblesPanel({
  state,
  servers,
  reduceMotion,
  onClose,
  onClaim,
  onCreate,
  onCreated,
}: {
  state: ConsoleBubblesPanelState | null;
  /** Every rail Bubble (preview-created first), for "recent chats". */
  servers: LandingLibraryServer[];
  reduceMotion: boolean;
  onClose: () => void;
  onClaim: () => void;
  onCreate: () => void;
  onCreated: (server: LandingLibraryServer) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [view, setView] = useState<View | null>(null);

  // Rail clicks / "+" reset the view; inside the panel the visitor navigates freely.
  useEffect(() => {
    if (!state) {
      setView(null);
      return;
    }
    setView(state.kind === "create" ? { kind: "create" } : { kind: state.kind, serverId: state.server.id });
  }, [state]);

  useEffect(() => {
    if (!state) return undefined;
    returnFocus.current ??= document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, state]);

  useEffect(() => {
    if (!view) return undefined;
    const id = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [view]);

  useEffect(() => {
    if (state) return;
    returnFocus.current?.focus?.({ preventScroll: true });
    returnFocus.current = null;
  }, [state]);

  const byId = useMemo(() => new Map(servers.map((server) => [server.id, server])), [servers]);
  const viewKey = view ? JSON.stringify(view) : "none";

  return (
    <AnimatePresence>
      {state && view ? (
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
            radius={36}
            className="console-bubbles__box"
            fillClassName="console-bubbles__fill"
            rimClassName="console-bubbles__rim"
            shadowClassName="console-bubbles__shadow"
          >
            <div className="console-bubbles__top">
              <button type="button" className="console-bubbles__round" aria-label="Create a Bubble" onClick={onCreate}>
                +
              </button>
              <span className="console-bubbles__preview">preview · nothing is saved</span>
              <button
                type="button"
                className="console-bubbles__round console-bubbles__round--close"
                aria-label="Close preview"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={viewKey}
                className="console-bubbles__body"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {view.kind === "create" ? (
                  <CreateBubble titleId={titleId} onCreated={onCreated} />
                ) : (
                  (() => {
                    const server = byId.get(view.serverId);
                    if (!server) return null;
                    if (view.kind === "room") {
                      return <BubbleRoom server={server} titleId={titleId} reduceMotion={reduceMotion} onClaim={onClaim} />;
                    }
                    if (view.kind === "huddle") {
                      return (
                        <HuddleView
                          server={server}
                          huddle={view.huddle}
                          titleId={titleId}
                          onBack={() => setView({ kind: "lobby", serverId: server.id })}
                          onClaim={onClaim}
                        />
                      );
                    }
                    if (view.kind === "details") {
                      return (
                        <BubbleDetails
                          server={server}
                          titleId={titleId}
                          onBack={() => setView({ kind: "lobby", serverId: server.id })}
                          onClaim={onClaim}
                        />
                      );
                    }
                    return (
                      <Lobby
                        server={server}
                        servers={servers}
                        titleId={titleId}
                        onOpenHuddle={(huddle) => setView({ kind: "huddle", serverId: server.id, huddle })}
                        onOpenDetails={() => setView({ kind: "details", serverId: server.id })}
                        onOpenBubble={(id) =>
                          setView(byId.get(id)?.emoji ? { kind: "room", serverId: id } : { kind: "lobby", serverId: id })
                        }
                        onClaim={onClaim}
                      />
                    );
                  })()
                )}
              </motion.div>
            </AnimatePresence>
          </SquircleBox>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ─── Lobby (app Workspaces drawer) ───────────────────────────────────────────

function BubblePill({
  server,
  titleId,
  onShare,
  onSettings,
  asHeading = false,
  onOpen,
}: {
  server: LandingLibraryServer;
  titleId?: string;
  onShare: () => void;
  onSettings: () => void;
  asHeading?: boolean;
  onOpen?: () => void;
}) {
  const name = asHeading ? (
    <h2 id={titleId} className="console-bubble-pill__name">
      {server.name}
    </h2>
  ) : (
    <span className="console-bubble-pill__name">{server.name}</span>
  );
  return (
    <div className="console-bubble-pill">
      {onOpen ? (
        <button type="button" className="console-bubble-pill__open" onClick={onOpen} aria-label={`Open ${server.name}`}>
          <RailServerAvatar server={server} />
          {name}
        </button>
      ) : (
        <>
          <RailServerAvatar server={server} />
          {name}
        </>
      )}
      {server.hasStar ? <span className="console-bubble-pill__star" aria-label="Favorite" /> : null}
      <button type="button" className="console-bubble-pill__btn" aria-label={`Share ${server.name}`} onClick={onShare}>
        ↗
      </button>
      <button type="button" className="console-bubble-pill__btn" aria-label={`${server.name} settings`} onClick={onSettings}>
        ⚙
      </button>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="console-bubbles__label">{children}</p>;
}

function HuddleRow({ huddle, index, onOpen, onClaim }: { huddle: ConsoleDemoHuddle; index: number; onOpen: () => void; onClaim: () => void }) {
  const dot = huddle.dot ?? CONSOLE_HUDDLE_DOTS[index % CONSOLE_HUDDLE_DOTS.length];
  return (
    <div className="console-huddle-row">
      <button type="button" className="console-huddle-row__add" aria-label={`New baby huddle in ${huddle.name}`} onClick={onClaim}>
        +
      </button>
      <button
        type="button"
        className="console-huddle"
        data-unread={huddle.unread ? "true" : undefined}
        onClick={onOpen}
        aria-label={`${huddle.name} huddle${huddle.unread ? `, ${huddle.unread} unread` : ""}`}
      >
        <span aria-hidden className="console-huddle__dot" style={{ background: dot }} />
        <span className="console-huddle__name">{huddle.name}</span>
        {huddle.unread ? <span className="console-huddle__unread">{huddle.unread}</span> : null}
      </button>
      {huddle.live ? (
        <button type="button" className="console-huddle__live" onClick={onClaim} aria-label={`Join live voice in ${huddle.name}`}>
          <span aria-hidden>〰</span> Live
        </button>
      ) : null}
    </div>
  );
}

function Lobby({
  server,
  servers,
  titleId,
  onOpenHuddle,
  onOpenDetails,
  onOpenBubble,
  onClaim,
}: {
  server: LandingLibraryServer;
  servers: LandingLibraryServer[];
  titleId: string;
  onOpenHuddle: (huddle: string) => void;
  onOpenDetails: () => void;
  onOpenBubble: (id: string) => void;
  onClaim: () => void;
}) {
  const bubble = CONSOLE_DEMO_BUBBLES[server.id];
  const [query, setQuery] = useState("");
  const others = servers
    .filter((item) => item.id !== server.id)
    .filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <>
      {/* Expanded Bubble card. */}
      <SquircleBox radius={28} className="console-bubble-card" fillClassName="console-bubble-card__fill" rimClassName="console-bubble-card__rim">
        <BubblePill server={server} titleId={titleId} asHeading onShare={onClaim} onSettings={onOpenDetails} />
        <div className="console-bubbles__list">
          {(bubble?.huddles ?? [{ name: "Lobby", kind: "text" as const }]).map((huddle, index) => (
            <HuddleRow key={huddle.name} huddle={huddle} index={index} onOpen={() => onOpenHuddle(huddle.name)} onClaim={onClaim} />
          ))}
        </div>
      </SquircleBox>

      {others.length > 0 ? (
        <>
          <SectionLabel>recent chats</SectionLabel>
          <div className="console-bubbles__list">
            {others.slice(0, 4).map((item) => {
              const live = CONSOLE_DEMO_BUBBLES[item.id]?.huddles.find((huddle) => huddle.live)?.live;
              return (
                <div key={item.id} className="console-recent">
                  <BubblePill server={item} onOpen={() => onOpenBubble(item.id)} onShare={onClaim} onSettings={() => onOpenBubble(item.id)} />
                  {live ? (
                    <span className="console-faces" aria-hidden>
                      {live.map((id) => (
                        <img key={id} src={consoleAgent(id).src} alt="" />
                      ))}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </>
      ) : null}

      <div className="console-bubbles__divider" />
      <p className="console-bubbles__caps">Have an invite?</p>
      <form
        className="console-room__composer"
        onSubmit={(event) => {
          event.preventDefault();
          onClaim();
        }}
      >
        <input className="console-create__input" placeholder="bub-… or paste link" aria-label="Invite code" />
        <JokuhButton type="submit" variant="secondary" size="sm">
          Join
        </JokuhButton>
      </form>

      <div className="console-bubbles__divider" />
      <div className="console-bubbles__caps-row">
        <p className="console-bubbles__caps">OO chats</p>
        <JokuhButton variant="secondary" size="sm" onClick={onClaim}>
          New
        </JokuhButton>
      </div>
      <div className="console-bubbles__list">
        {CONSOLE_OO_CHATS.map((title) => (
          <button key={title} type="button" className="console-oo-chat" onClick={onClaim}>
            {title}
          </button>
        ))}
      </div>

      <input
        className="console-create__input console-bubbles__search"
        placeholder="Search Bubbles & conversations"
        aria-label="Search Bubbles & conversations"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </>
  );
}

function BackRow({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <button type="button" className="console-bubbles__back" onClick={onBack} data-autofocus>
      ← {label}
    </button>
  );
}

function HuddleView({
  server,
  huddle,
  titleId,
  onBack,
  onClaim,
}: {
  server: LandingLibraryServer;
  huddle: string;
  titleId: string;
  onBack: () => void;
  onClaim: () => void;
}) {
  const bubble = CONSOLE_DEMO_BUBBLES[server.id];
  const lines = bubble?.recent.huddle === huddle ? bubble.recent.lines : [];
  return (
    <div className="console-room">
      <BackRow label={server.name} onBack={onBack} />
      <h2 id={titleId} className="console-bubbles__title">
        # {huddle}
      </h2>
      <div className="console-room__log">
        {lines.length > 0 ? (
          lines.map((line, index) => {
            const agent = consoleAgent(line.agent);
            return (
              <div key={index} className="console-line">
                <img className="console-line__avatar" src={agent.src} alt="" />
                <p className="console-line__text">
                  <span className="console-line__name">{agent.name}</span> {line.text}
                </p>
              </div>
            );
          })
        ) : (
          <p className="console-bubbles__meta">Claim your identity to read and join {huddle}.</p>
        )}
      </div>
      <form
        className="console-room__composer"
        onSubmit={(event) => {
          event.preventDefault();
          onClaim();
        }}
      >
        <input className="console-create__input" placeholder={`Message #${huddle}`} aria-label={`Message #${huddle}`} />
        <JokuhButton type="submit" variant="secondary" size="sm">
          Send
        </JokuhButton>
      </form>
    </div>
  );
}

function BubbleDetails({
  server,
  titleId,
  onBack,
  onClaim,
}: {
  server: LandingLibraryServer;
  titleId: string;
  onBack: () => void;
  onClaim: () => void;
}) {
  const bubble = CONSOLE_DEMO_BUBBLES[server.id];
  return (
    <div className="console-room">
      <BackRow label="Lobby" onBack={onBack} />
      <h2 id={titleId} className="console-bubbles__title">
        {server.name}
      </h2>
      <p className="console-bubbles__meta">
        Bubble · {bubble?.memberCount ?? 1} members · {bubble?.huddles.length ?? 1} Huddles
      </p>
      <SectionLabel>members</SectionLabel>
      <div className="console-bubbles__members">
        {(bubble?.members ?? []).map((member) => {
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
      <div className="console-bubbles__actions">
        <JokuhButton variant="primary" size="sm" onClick={onClaim}>
          Join Bubble
        </JokuhButton>
      </div>
    </div>
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

  return (
    <div className="console-room">
      <SquircleBox radius={28} className="console-bubble-card" fillClassName="console-bubble-card__fill" rimClassName="console-bubble-card__rim">
        <BubblePill server={server} titleId={titleId} asHeading onShare={onClaim} onSettings={onClaim} />
        <div className="console-bubbles__list">
          <HuddleRow huddle={{ name: "Lobby", kind: "text" }} index={0} onOpen={() => {}} onClaim={onClaim} />
        </div>
      </SquircleBox>
      <p className="console-bubbles__meta"># Lobby — your new Bubble&apos;s first Huddle.</p>
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
            className="console-line"
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
      <form
        className="console-room__composer"
        onSubmit={(event) => {
          event.preventDefault();
          onClaim();
        }}
      >
        <input className="console-create__input" placeholder="Message #Lobby" aria-label="Message #Lobby" />
        <JokuhButton type="submit" variant="secondary" size="sm">
          Send
        </JokuhButton>
      </form>
      <div className="console-bubbles__actions">
        <JokuhButton variant="primary" size="sm" onClick={onClaim}>
          Invite people
        </JokuhButton>
      </div>
    </div>
  );
}
