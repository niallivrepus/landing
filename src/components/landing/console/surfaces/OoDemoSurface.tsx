import { Avatar, cn } from "@jokuh/gooey";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { LANDING_DEMO_POWERS } from "../../../../data/landing-demo-powers";
import { useOoSpeak } from "../../../../hooks/useOoSpeak";
import { SquircleBox } from "../../../system/squircle";

/** Beat timings for one power: prompt → thinking → typed reply → proof card → next. */
const BEAT_THINK_MS = 700;
const BEAT_REPLY_MS = 1800;
const BEAT_ARTIFACT_MS = 4600;
const BEAT_NEXT_MS = 8400;

const ROW_SPRING = { type: "spring", stiffness: 380, damping: 32, mass: 0.85 } as const;

/**
 * **Purpose:** OO's chat surface for the console home scene, in the app's Cortex chat look (same classes as the
 * homepage temporary chat): the site's "See it work" powers (`LANDING_DEMO_POWERS`) play out — the prompt lands as a
 * trailing squircle row, OO thinks, the reply types out as bubble-less text, then the squircle proof card (saved
 * preference, calendar move…) appears. Demo copy only; nothing is sent. The real temporary chat lives in the title
 * block's prompt bar.
 * **Connects to:** `console/surfaces/ConsoleSurfaces.tsx`, `landing-demo-powers.ts`, `landing-temp-chat.css`.
 */
export function OoDemoSurface({ playing }: { playing: boolean }) {
  const [powerIndex, setPowerIndex] = useState(0);
  const [beat, setBeat] = useState(playing ? 0 : 3);
  const count = LANDING_DEMO_POWERS.length;
  const power = LANDING_DEMO_POWERS[powerIndex % count]!;
  const previous = powerIndex > 0 ? LANDING_DEMO_POWERS[(powerIndex - 1) % count] : undefined;

  useEffect(() => {
    if (!playing) {
      setBeat(3);
      return undefined;
    }
    setBeat(0);
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    at(BEAT_THINK_MS, () => setBeat(1));
    at(BEAT_REPLY_MS, () => setBeat(2));
    at(BEAT_ARTIFACT_MS, () => setBeat(3));
    at(BEAT_NEXT_MS, () => {
      if (!document.hidden) setPowerIndex((index) => index + 1);
    });
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [playing, powerIndex]);

  return (
    <div className="console-oo-thread">
      <header className="console-oo-thread__head">
        <Avatar showOO originColor="aether" size={36} className="shrink-0" />
        <div className="min-w-0">
          <p className="console-oo-thread__name">OO</p>
          <p className="console-oo-thread__meta">Your private agent · always here</p>
        </div>
        <div className="ml-auto flex gap-1.5" aria-hidden>
          {LANDING_DEMO_POWERS.map((item, index) => (
            <span key={item.id} className={cn("console-oo-thread__dot", index === powerIndex % count && "is-current")} />
          ))}
        </div>
      </header>

      <div className="console-oo-thread__list">
        {previous ? (
          <div key={`${powerIndex - 1}-prev`} className="console-oo-thread__group console-oo-thread__group--past">
            <UserRow text={previous.prompt} />
            <p className="landing-temp-chat__bubble landing-temp-chat__bubble--oo">{previous.reply}</p>
          </div>
        ) : null}
        <motion.div
          key={`${powerIndex}-q`}
          className="console-oo-thread__group"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ROW_SPRING}
        >
          <UserRow text={power.prompt} />
          {beat === 1 ? <ThinkingRow /> : null}
          {beat >= 2 ? <OoReply key={`${powerIndex}-a`} text={power.reply} speak={playing} /> : null}
          <AnimatePresence initial={false}>
            {beat >= 3 ? (
              <motion.div
                key={`${powerIndex}-artifact`}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={ROW_SPRING}
              >
                <SquircleBox
                  radius={22}
                  className="console-oo-proof"
                  fillClassName="console-oo-proof__fill"
                  rimClassName="console-oo-proof__rim"
                >
                  <p className="console-oo-proof__eyebrow">{power.artifact.eyebrow}</p>
                  <p className="console-oo-proof__title">{power.artifact.title}</p>
                  <p className="console-oo-proof__detail">{power.artifact.detail}</p>
                </SquircleBox>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function UserRow({ text }: { text: string }) {
  return (
    <SquircleBox
      radius={18}
      className="landing-temp-chat__bubble landing-temp-chat__bubble--user"
      fillClassName="landing-temp-chat__bubble-fill"
    >
      <p className="landing-temp-chat__bubble-text">{text}</p>
    </SquircleBox>
  );
}

function OoReply({ text, speak }: { text: string; speak: boolean }) {
  const { displayText, phase } = useOoSpeak(text, { speak });
  return (
    <p className={cn("landing-temp-chat__bubble landing-temp-chat__bubble--oo", phase === "speaking" && "is-streaming")}>
      {displayText}
    </p>
  );
}

function ThinkingRow() {
  return (
    <div className="console-oo-thread__thinking" aria-hidden>
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          animate={{ opacity: [0.3, 0.9, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
