import {
  ActiveCalls,
  AvatarHypeTrain,
  Badge,
  ChatBubbleButton,
  ServerAvatar,
  cn,
  useShouldAnimate,
  type OriginColor,
} from "@jokuh/gooey";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LANDING_LIBRARY_CALL_INTERVAL_MS,
  LANDING_LIBRARY_RAINBOW_BURST_MS,
  LANDING_LIBRARY_SERVERS,
  LANDING_LIBRARY_SIMULATED_STEPS,
  type LandingLibraryActiveCall,
  type LandingLibraryServer,
} from "../../data/landing-library-rail-data";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";

const SERVER_ROW_MIN_WIDTH = 118;
const HOVER_CLOSE_DELAY_MS = 220;
const SERVER_STAGGER = 0.045;

function getServerRevealWidth(name: string) {
  return Math.max(SERVER_ROW_MIN_WIDTH, 56 + name.length * 8.5);
}

function GoldStar() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
      style={{ filter: "drop-shadow(0 0 3px rgba(255, 215, 0, 0.6))" }}
      aria-hidden
    >
      <path
        d="M8 1l2.12 4.3 4.74.69-3.43 3.34.81 4.72L8 11.77l-4.24 2.28.81-4.72L1.14 5.99l4.74-.69L8 1z"
        fill="#FFD700"
      />
    </svg>
  );
}

/**
 * **Purpose:** Marketing left library rail — server pills, active-call avatars, rainbow burst, hover expand.
 * **Parity:** `jokuh-app-main/src/shell/CollapsedLibraryRail.tsx` (trimmed for landing).
 * **Connects to:** `ImmersiveAppChrome`, `landing-library-rail-data.ts`, `/download` intercept.
 */
export function LandingLibraryRail({ className }: { className?: string }) {
  const shouldAnimate = useShouldAnimate();
  const { intercept } = useDownloadIntercept("library-rail");
  const [libraryHovered, setLibraryHovered] = useState(false);
  const [hoveredServerId, setHoveredServerId] = useState<string | null>(null);
  const [pinnedServerId, setPinnedServerId] = useState<string | null>(null);
  const [activeCallsByServer, setActiveCallsByServer] = useState<Record<string, LandingLibraryActiveCall>>(() =>
    Object.fromEntries(
      LANDING_LIBRARY_SERVERS.flatMap((server) =>
        server.activeCall ? [[server.id, server.activeCall]] : [],
      ),
    ),
  );

  const hoverLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const simulatedStepRef = useRef(0);

  const libraryOpen = libraryHovered || hoveredServerId != null || pinnedServerId != null;

  const servers = useMemo(
    () =>
      LANDING_LIBRARY_SERVERS.map((server) => ({
        ...server,
        activeCall: activeCallsByServer[server.id],
      })),
    [activeCallsByServer],
  );

  const clearHoverLeaveTimeout = () => {
    if (hoverLeaveTimeoutRef.current) {
      clearTimeout(hoverLeaveTimeoutRef.current);
      hoverLeaveTimeoutRef.current = null;
    }
  };

  useEffect(() => () => clearHoverLeaveTimeout(), []);

  useEffect(() => {
    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    const runStep = () => {
      const step = LANDING_LIBRARY_SIMULATED_STEPS[simulatedStepRef.current % LANDING_LIBRARY_SIMULATED_STEPS.length]!;
      simulatedStepRef.current += 1;

      setActiveCallsByServer((current) => {
        const existing = current[step.endServerId];
        if (!existing) return current;
        return {
          ...current,
          [step.endServerId]: { ...existing, status: "exiting", newAvatarJoined: false },
        };
      });

      timeouts.push(
        setTimeout(() => {
          setActiveCallsByServer((current) => {
            const next = { ...current };
            if (next[step.endServerId]?.status === "exiting") delete next[step.endServerId];
            return next;
          });
        }, 720),
      );

      timeouts.push(
        setTimeout(() => {
          setActiveCallsByServer((current) => ({
            ...current,
            [step.startServerId]: {
              ...step.call,
              status: "entering",
              newAvatarJoined: true,
              eventKey: `${step.startServerId}-${step.call.channelId}-${Date.now()}`,
            },
          }));
        }, 1040),
      );

      timeouts.push(
        setTimeout(() => {
          setActiveCallsByServer((current) => {
            const existing = current[step.startServerId];
            if (!existing || existing.status !== "entering") return current;
            return {
              ...current,
              [step.startServerId]: { ...existing, status: "active", newAvatarJoined: false },
            };
          });
        }, 2100),
      );
    };

    timeouts.push(setTimeout(runStep, 2600));
    const interval = setInterval(runStep, LANDING_LIBRARY_CALL_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <aside
      className={cn("pointer-events-auto hidden md:block", className)}
      aria-label="Server library"
      onPointerEnter={() => {
        clearHoverLeaveTimeout();
        setLibraryHovered(true);
      }}
      onPointerLeave={() => {
        clearHoverLeaveTimeout();
        hoverLeaveTimeoutRef.current = setTimeout(() => {
          setLibraryHovered(false);
          setHoveredServerId(null);
        }, HOVER_CLOSE_DELAY_MS);
      }}
    >
      <div className="flex h-full flex-col justify-center gap-[4px] py-3">
        <ChatBubbleButton
          variant="plus"
          aria-label="Add server"
          onClick={() => intercept("prompt-plus")}
        />

        {servers.map((server, index) => (
          <LandingLibraryServerRow
            key={server.id}
            server={server}
            libraryOpen={libraryOpen}
            revealIndex={index}
            shouldAnimate={shouldAnimate}
            onHover={() => {
              clearHoverLeaveTimeout();
              setHoveredServerId(server.id);
            }}
            onTogglePin={() =>
              setPinnedServerId((current) => (current === server.id ? null : server.id))
            }
            onJoinCall={() => intercept("call", { ref: server.id })}
          />
        ))}

        <ChatBubbleButton
          variant="library"
          aria-label="Open library"
          onClick={() => intercept("prompt-library")}
        />
      </div>
    </aside>
  );
}

function LandingLibraryServerRow({
  server,
  libraryOpen,
  revealIndex,
  shouldAnimate,
  onHover,
  onTogglePin,
  onJoinCall,
}: {
  server: LandingLibraryServer & { activeCall?: LandingLibraryActiveCall };
  libraryOpen: boolean;
  revealIndex: number;
  shouldAnimate: boolean;
  onHover: () => void;
  onTogglePin: () => void;
  onJoinCall: () => void;
}) {
  const revealWidth = getServerRevealWidth(server.name);
  const revealDelay = shouldAnimate ? revealIndex * SERVER_STAGGER : 0;
  const showExpanded = libraryOpen;
  const [rainbowBurstActive, setRainbowBurstActive] = useState(false);

  const rainbowBurstKey =
    server.activeCall?.newAvatarJoined && server.activeCall.status !== "exiting"
      ? (server.activeCall.eventKey ?? `${server.id}-${server.activeCall.channelId}`)
      : null;

  useEffect(() => {
    if (!rainbowBurstKey || !shouldAnimate) {
      setRainbowBurstActive(false);
      return;
    }
    setRainbowBurstActive(true);
    const timeout = setTimeout(() => setRainbowBurstActive(false), LANDING_LIBRARY_RAINBOW_BURST_MS);
    return () => clearTimeout(timeout);
  }, [rainbowBurstKey, shouldAnimate]);

  const activityParticipants =
    server.activeCall?.participants.map((participant) => ({
      src: participant.src,
      borderColor: participant.borderColor,
    })) ?? [];

  return (
    <div className="flex flex-col gap-[4px]" onPointerEnter={onHover}>
      <div className="flex items-center gap-[4px]">
        <motion.button
          type="button"
          aria-expanded={showExpanded}
          aria-label={server.name}
          title={server.name}
          initial={false}
          animate={{
            width: showExpanded ? revealWidth : 40,
            height: 40,
            backgroundColor: showExpanded
              ? "var(--landing-control-fill-hover)"
              : "var(--landing-control-fill)",
            borderColor: "var(--landing-control-border)",
          }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: showExpanded ? revealDelay : 0 }}
          className={cn(
            "relative inline-flex shrink-0 items-center rounded-full border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20",
            showExpanded ? "justify-start overflow-hidden pl-[3px] pr-4" : "justify-center",
            rainbowBurstActive && !showExpanded && "spectral-border-burst border-transparent",
          )}
          style={{
            boxShadow: "var(--landing-control-inner-highlight), var(--landing-control-shadow)",
          }}
          onClick={onTogglePin}
        >
          {showExpanded ? (
            <span className="inline-flex items-center gap-2">
              <ServerAvatar
                size={32}
                symbolSrc={server.symbolSrc}
                symbolScale={server.symbolScale ?? 0.72}
                symbolColor={server.symbolColor}
                backgroundColor={server.backgroundColor}
              />
              <span className="whitespace-nowrap font-sans text-[14px] font-bold leading-[0.9] text-light-space light:text-zinc-900">
                {server.name}
              </span>
            </span>
          ) : (
            <ServerAvatar
              size={32}
              symbolSrc={server.symbolSrc}
              symbolScale={server.symbolScale ?? 0.72}
              symbolColor={server.symbolColor}
              backgroundColor={server.backgroundColor}
            />
          )}
        </motion.button>

        {!showExpanded && server.activeCall && activityParticipants.length > 0 ? (
          <button type="button" className="shrink-0" onClick={onJoinCall} aria-label={`Join call in ${server.name}`}>
            <ActiveCalls
              participants={activityParticipants}
              count={server.activeCall.count}
            />
          </button>
        ) : null}

        <AnimatePresence initial={false}>
          {showExpanded ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="flex items-center gap-[4px]"
            >
              {server.hasStar ? <GoldStar /> : null}
              {server.hypeAvatars && server.hypeColors ? (
                <AvatarHypeTrain
                  avatarSrcs={server.hypeAvatars}
                  colors={server.hypeColors as [OriginColor, OriginColor, OriginColor]}
                  size="small"
                />
              ) : null}
              {server.memberCount != null ? (
                <Badge
                  label={`+${server.memberCount}`}
                  variant="outline"
                  color="neutral"
                  type="text"
                  size="tag"
                />
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
