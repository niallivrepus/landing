import { cn } from "@jokuh/gooey";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  DEFENSE_GOO_INTRO,
  DEFENSE_MAP,
  DEFENSE_SCENARIOS,
  DEFENSE_SYSTEM_NODES,
  type DefenseMapNode,
  type DefenseNodeId,
} from "../../../data/defense";
import { DEFENSE_NODE_ENERGY } from "./defense-energy";
import { GooCapture } from "./GooCapture";
import { GooTabs } from "./GooTabs";

/**
 * **Purpose:** The interactive centerpiece. Two goo-tabbed views of the same product: **Missions** (pick a scenario,
 * a goo chain of steps advances with the real-app recording and what each step does) and **System map** (a living goo
 * graph of every part; tap one for what it does today, where its data is sealed, what we're designing it for, and
 * whether it's built or roadmap). All copy and the accuracy rules live in `data/defense.ts`.
 * **Connects to:** `GooTabs`, `GooCapture`, `GooDefs` (`#dg-goo-rail`, `#dg-goo-map`), `defense-goo.css`.
 */
type View = "scenarios" | "system";
const STEP_MS = 6500;

export function DefenseExplorer() {
  const reduceMotion = useReducedMotion() ?? false;
  const [view, setView] = useState<View>("scenarios");
  return (
    <section className="defense-section" aria-labelledby="defense-explore-title" id="explore">
      <div className="defense-section__head">
        <p className="defense-eyebrow">{DEFENSE_GOO_INTRO.eyebrow}</p>
        <h2 id="defense-explore-title" className="defense-h2">
          {DEFENSE_GOO_INTRO.title}
        </h2>
        <p className="defense-lede">{DEFENSE_GOO_INTRO.intro}</p>
      </div>
      <div className="defense-explorer">
        <GooTabs tabs={DEFENSE_GOO_INTRO.tabs} value={view} onChange={setView} label="Explore" reduceMotion={reduceMotion} idPrefix="defense-explore" />
        <div role="tabpanel" id={`defense-explore-panel-${view}`} aria-labelledby={`defense-explore-tab-${view}`} className="defense-explorer__panel">
          {view === "scenarios" ? <Missions reduceMotion={reduceMotion} /> : <SystemMap reduceMotion={reduceMotion} />}
        </div>
      </div>
    </section>
  );
}

// ── Missions ────────────────────────────────────────────────────────────────

function Missions({ reduceMotion }: { reduceMotion: boolean }) {
  const { items, title, label } = DEFENSE_SCENARIOS;
  const [scenarioId, setScenarioId] = useState(items[0].id);
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(!reduceMotion);
  const [inView, setInView] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const scenario = items.find((s) => s.id === scenarioId) ?? items[0];
  const steps = scenario.steps;
  const step = steps[Math.min(index, steps.length - 1)]!;
  const energy = DEFENSE_NODE_ENERGY[step.node];
  const running = auto && inView && !reduceMotion;

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % steps.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, index, steps.length]);

  const pick = useCallback((i: number) => {
    setIndex(i);
    setAuto(false);
  }, []);
  const pickScenario = (id: string) => {
    setScenarioId(id);
    setIndex(0);
  };

  const progress = steps.length > 1 ? index / (steps.length - 1) : 0;
  return (
    <div ref={stageRef} className="defense-missions">
      <div className="defense-missions__top">
        <div>
          <h3 className="defense-h3">{title}</h3>
          <p className="defense-tag">{label}</p>
        </div>
        <div className="defense-chips" role="group" aria-label="Scenario">
          {items.map((s) => (
            <button key={s.id} type="button" className={cn("defense-chip", s.id === scenarioId && "is-on")} aria-pressed={s.id === scenarioId} onClick={() => pickScenario(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <p className="defense-missions__tagline">{scenario.tagline}</p>

      <ol className="defense-chain" style={{ "--n": steps.length, "--p": progress, "--energy": energy } as CSSProperties} aria-label="Steps">
        <span aria-hidden className="defense-chain__goo">
          <span className="defense-chain__line" />
          <span className="defense-chain__fill" />
          {steps.map((s, i) => (
            <span
              key={s.id}
              className="defense-chain__bead"
              data-state={i < index ? "done" : i === index ? "now" : "next"}
              style={{ "--col": i, "--bead": DEFENSE_NODE_ENERGY[s.node] } as CSSProperties}
            />
          ))}
        </span>
        {steps.map((s, i) => (
          <li key={s.id} className="defense-chain__item">
            <button type="button" className="defense-chain__btn" aria-current={i === index ? "step" : undefined} onClick={() => pick(i)}>
              <span className="defense-chain__time">{s.time}</span>
              <span className="defense-chain__name">{s.title}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="defense-stage">
        <GooCapture surface={step.surface} playing={running || (!reduceMotion && inView)} energy={energy} reduceMotion={reduceMotion} label={`Recording: ${step.title}`} />
        <div className="defense-stage__copy" aria-live="polite">
          <p className="defense-stage__time">
            <span aria-hidden className="defense-dot" style={{ background: energy }} />
            {step.time} · {DEFENSE_SYSTEM_NODES[step.node].label}
          </p>
          <h4 className="defense-stage__title">{step.title}</h4>
          <p className="defense-stage__body">{step.body}</p>
          <div className="defense-stage__ctl">
            <button type="button" className="defense-chip" aria-pressed={auto} onClick={() => setAuto((a) => !a)} disabled={reduceMotion}>
              {auto ? "Pause" : "Play"}
            </button>
            <button type="button" className="defense-chip" onClick={() => pick((index + 1) % steps.length)}>
              Next step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── System map ──────────────────────────────────────────────────────────────

function SystemMap({ reduceMotion }: { reduceMotion: boolean }) {
  const { nodes, links, title, intro, boundaryLabels, statusLabels } = DEFENSE_MAP;
  const [pickedId, setPickedId] = useState<string>("identity");
  const picked: DefenseMapNode = nodes.find((n) => n.id === pickedId) ?? nodes[0];
  const byId = (id: string) => nodes.find((n) => n.id === id)!;
  const live = new Set<string>([picked.id]);
  for (const [a, b] of links) if (a === picked.id || b === picked.id) (live.add(a), live.add(b));

  return (
    <div className="defense-map">
      <div className="defense-map__head">
        <h3 className="defense-h3">{title}</h3>
        <p className="defense-lede">{intro}</p>
      </div>
      <div className="defense-map__body">
        <div className="defense-map__canvas" data-motion={reduceMotion ? "off" : "on"}>
          <svg viewBox="0 0 100 100" className="defense-map__svg" aria-hidden>
            {/* Idle links: thin and crisp. Only the picked part's links join the goo (merge = selected). */}
            {links.map(([a, b]) => {
              const na = byId(a);
              const nb = byId(b);
              return <line key={`i-${a}-${b}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} className="defense-map__thread" />;
            })}
            <g style={{ filter: "url(#dg-goo-map)" }}>
              {links.map(([a, b]) => {
                if (a !== picked.id && b !== picked.id) return null;
                const na = byId(a);
                const nb = byId(b);
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    className="defense-map__neck"
                    style={{ stroke: a === picked.id ? nb.energy : na.energy }}
                  />
                );
              })}
              {nodes.map((n) => (
                <circle
                  key={n.id}
                  cx={n.x}
                  cy={n.y}
                  r={n.id === "identity" ? 10 : n.status === "roadmap" ? 4 : 6.8}
                  className={cn("defense-map__bead", n.id === picked.id && "is-picked", live.has(n.id) && "is-live")}
                  data-status={n.status}
                  style={{ fill: n.status === "roadmap" ? "var(--dg-roadmap)" : n.energy }}
                />
              ))}
            </g>
          </svg>
          {nodes.map((n) => (
            <button
              key={n.id}
              type="button"
              className={cn("defense-map__node", n.id === picked.id && "is-picked")}
              data-status={n.status}
              style={{ left: `${n.x}%`, top: `${n.y}%`, "--energy": n.energy, "--d": n.id === "identity" ? 20 : n.status === "roadmap" ? 8 : 13.6 } as CSSProperties}
              aria-pressed={n.id === picked.id}
              onClick={() => setPickedId(n.id)}
              onFocus={() => setPickedId(n.id)}
              onMouseEnter={() => setPickedId(n.id)}
            >
              <span className="defense-map__node-label">{n.label}</span>
              <span className="defense-map__node-sub">{n.status === "roadmap" ? "Roadmap" : n.sub}</span>
            </button>
          ))}
        </div>

        <aside className="defense-detail" aria-live="polite" style={{ "--energy": picked.energy } as CSSProperties}>
          <div className="defense-detail__badges">
            <span className="defense-badge" data-status={picked.status}>
              {statusLabels[picked.status]}
            </span>
            <span className="defense-badge" data-boundary={picked.boundary}>
              <span aria-hidden className="defense-badge__sw" />
              {boundaryLabels[picked.boundary]}
            </span>
          </div>
          <h4 className="defense-detail__title">{picked.label}</h4>
          <p className="defense-detail__body">{picked.body}</p>
          <p className="defense-detail__fitlabel">What we're designing it for</p>
          <p className="defense-detail__fit">{picked.fit}</p>
          {picked.surface ? (
            <GooCapture surface={picked.surface} playing={!reduceMotion} energy={picked.energy} reduceMotion={reduceMotion} label={`Recording: ${picked.label}`} className="defense-cap--small" />
          ) : null}
        </aside>
      </div>
      <ul className="defense-legend" aria-label="Legend">
        {(["sealed", "account", "ai", "neutral", "roadmap"] as const).map((k) => (
          <li key={k} data-boundary={k}>
            <span aria-hidden className="defense-badge__sw" />
            {boundaryLabels[k]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export type { DefenseNodeId };
