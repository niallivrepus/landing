import { cn, useTheme } from "@jokuh/gooey";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  DEFENSE_GOO_INTRO,
  DEFENSE_MAP,
  DEFENSE_SCENARIOS,
  DEFENSE_SYSTEM_NODES,
  type DefenseMapNode,
} from "../../../data/defense";
import { DEFENSE_BOUNDARY_ENERGY, DEFENSE_NODE_ENERGY } from "./defense-energy";
import { GooStage, type GooBead, type GooLink, type GooZone } from "./GooStage";
import { useNarrow } from "./use-narrow";
import { GooCapture } from "./GooCapture";
import { GooTabs } from "./GooTabs";

/**
 * **Purpose:** The interactive centerpiece. Two goo-tabbed views of the same product: **Missions** (pick a scenario,
 * a goo chain of steps advances with the real-app recording and what each step does) and **System map** (a living goo
 * graph of every part; tap one for what it does today, where its data is sealed, what we're designing it for, and
 * whether it's built or roadmap). All copy and the accuracy rules live in `data/defense.ts`.
 * **Connects to:** `GooTabs`, `GooCapture`, `GooDefs` (`#dg-splex-juicy`), `GooStage` (map), `defense-goo.css`.
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

      <ol className="defense-chain" style={{ "--n": steps.length, "--p": progress, "--a": index, "--energy": energy } as CSSProperties} aria-label="Steps">
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

const MAP_W = 1000;
const MAP_H = 760;
const MAP_R: Record<string, number> = { identity: 70, roadmap: 30 };
/** Phones: a portrait map (same zones, stacked) with finger-sized parts. */
const MAP_NARROW = { w: 600, h: 980 };
const MAP_NARROW_POS: Record<string, [number, number, number]> = {
  messages: [150, 150, 60],
  identity: [390, 260, 80],
  calls: [120, 450, 56],
  bubbles: [350, 500, 54],
  spine: [500, 640, 56],
  docs: [330, 770, 54],
  oo: [120, 760, 58],
  usonly: [520, 880, 34],
  deploy: [300, 930, 34],
};

function SystemMap({ reduceMotion }: { reduceMotion: boolean }) {
  const { nodes, links, zones, hint, title, intro, boundaryLabels, statusLabels } = DEFENSE_MAP;
  const { resolvedTheme } = useTheme();
  const [pickedId, setPickedId] = useState<string>("identity");
  const picked: DefenseMapNode = nodes.find((n) => n.id === pickedId) ?? nodes[0];
  const narrow = useNarrow();
  const W = narrow ? MAP_NARROW.w : MAP_W;
  const H = narrow ? MAP_NARROW.h : MAP_H;
  const pos = (n: DefenseMapNode): [number, number, number] =>
    narrow ? MAP_NARROW_POS[n.id]! : [n.x, n.y, n.status === "roadmap" ? MAP_R.roadmap! : MAP_R[n.id] ?? 50];

  const beads = useMemo<GooBead[]>(
    () =>
      nodes.map((n) => ({
        id: n.id,
        x: pos(n)[0],
        y: pos(n)[1],
        r: pos(n)[2],
        color: n.energy,
        label: n.label,
        sub: n.sub,
        ghost: n.status === "roadmap",
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, narrow],
  );
  const gooLinks = useMemo<GooLink[]>(() => links.map(([a, b]) => ({ a, b, w: a === "identity" || b === "identity" ? 16 : 12 })), [links]);
  const gooZones = useMemo<GooZone[]>(
    () => zones.map((z) => ({ id: z.id, members: [...z.members], color: DEFENSE_BOUNDARY_ENERGY[z.id], pad: z.id === "account" ? 1.75 : 1.85 })),
    [zones],
  );
  const zoneTag = (id: string, members: readonly string[]) => {
    const ms = nodes.filter((n) => members.includes(n.id)).map(pos);
    const x = ms.reduce((a, p) => a + p[0], 0) / ms.length;
    // Phones: the account membrane sits under Identity, so its tag goes below the zone instead.
    if (narrow && id === "account") {
      const bottom = Math.max(...ms.map((p) => p[1] + p[2] * 1.85));
      return { left: `${(x / W) * 100}%`, top: `${(Math.min(H - 14, bottom) / H) * 100}%`, transform: "translate(-50%, 0)" };
    }
    const top = Math.min(...ms.map((p) => p[1] - p[2] * 1.85));
    return { left: `${(x / W) * 100}%`, top: `${(Math.max(14, top) / H) * 100}%` };
  };

  return (
    <div className="defense-map">
      <div className="defense-map__head">
        <h3 className="defense-h3">{title}</h3>
        <p className="defense-lede">{intro}</p>
      </div>
      <div className="defense-map__body">
        <GooStage
          key={narrow ? "narrow" : "wide"}
          width={W}
          height={H}
          beads={beads}
          links={gooLinks}
          zones={gooZones}
          picked={picked.id}
          onPick={setPickedId}
          scheme={resolvedTheme === "light" ? "light" : "dark"}
          reduceMotion={reduceMotion}
          labels="below"
          goo={48}
          edge={55}
          reach={0.12}
          glow={resolvedTheme === "light" ? 0.22 : 0.38}
          className="defense-map__stage"
          ariaLabel="Map of the Jokuh system with its trust boundaries. Select a part to read what it does today."
          hint={reduceMotion ? null : <span>{hint}</span>}
        >
          {zones.map((z) => (
            <span key={z.id} className="defense-map__zone-tag" data-zone={z.id} style={{ ...zoneTag(z.id, z.members), "--energy": DEFENSE_BOUNDARY_ENERGY[z.id] } as unknown as CSSProperties}>
              {z.label}
            </span>
          ))}
        </GooStage>

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
