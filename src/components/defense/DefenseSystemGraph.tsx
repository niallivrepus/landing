import { cn, createSquirclePath } from "@jokuh/gooey";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  DEFENSE_SYSTEM_NODES,
  DEFENSE_SYSTEM_PACKET_LABEL,
  type DefenseNodeId,
} from "../../data/defense";

/**
 * **Purpose:** The connected-system diagram on `/defense` — a diagram, drawn as one (never a fake app screen).
 * Identity (passkey on device) sits at the hub; Messages, Calls, Bubbles, Spine, Docs and OO hang off it with
 * flowing links. Across the top, the Messages lane: sealed packets travel device → relay → device, labelled end-to-end
 * encrypted (the relay only ever carries ciphertext). `active` nodes light in their app energy colour and their links
 * brighten — the doc drives this as each section plays. `compact` = the persistent mini map beside the doc.
 * Reduced motion: static (packets parked along the lane, no flow).
 * **Connects to:** `DefenseDoc` (hero block), `DefenseAppShell` (mini map), `data/defense.ts`, `defense-app.css`.
 */

export const DEFENSE_NODE_ENERGY: Record<DefenseNodeId, string> = {
  identity: "var(--color-purple-4, #9327ff)",
  messages: "var(--color-red-4, #ff0700)",
  calls: "var(--color-green-4, #21dc11)",
  spine: "var(--color-yellow-4, #ffb800)",
  docs: "#ff4d00",
  oo: "#8c73ff",
  bubbles: "#2c81ff",
};

const VIEW = { w: 520, h: 340 };
const LANE_Y = 46;
const DEVICE_A = { x: 40, y: LANE_Y };
const DEVICE_B = { x: 480, y: LANE_Y };

type NodeSpec = { x: number; y: number; w: number; h: number };

const NODES: Record<DefenseNodeId, NodeSpec> = {
  messages: { x: 260, y: LANE_Y, w: 124, h: 46 },
  identity: { x: 260, y: 190, w: 140, h: 54 },
  calls: { x: 92, y: 150, w: 124, h: 46 },
  bubbles: { x: 92, y: 266, w: 124, h: 46 },
  spine: { x: 428, y: 150, w: 124, h: 46 },
  docs: { x: 428, y: 266, w: 124, h: 46 },
  oo: { x: 260, y: 300, w: 124, h: 46 },
};

const LINKS: [DefenseNodeId, DefenseNodeId][] = [
  ["identity", "messages"],
  ["identity", "calls"],
  ["identity", "bubbles"],
  ["identity", "spine"],
  ["identity", "oo"],
  ["spine", "docs"],
  ["spine", "oo"],
  ["docs", "oo"],
  ["bubbles", "calls"],
];

const ORDER: DefenseNodeId[] = ["messages", "calls", "bubbles", "identity", "spine", "docs", "oo"];

function linkPath(a: NodeSpec, b: NodeSpec): string {
  // Gentle S-curve between centres so crossings read as a network, not a grid.
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const bend = Math.abs(a.x - b.x) > Math.abs(a.y - b.y) ? { x: mx, y: my - 10 } : { x: mx + 10, y: my };
  return `M ${a.x} ${a.y} Q ${bend.x} ${bend.y} ${b.x} ${b.y}`;
}

/** Hero tour: light the hub plus one part at a time, so the links read as a live system. */
const TOUR_MS = 1100;
const TOUR: DefenseNodeId[] = ["messages", "calls", "bubbles", "spine", "docs", "oo"];

export function DefenseSystemGraph({
  active: activeProp = [],
  tour = false,
  compact = false,
  reduceMotion,
  className,
  title,
}: {
  active?: readonly DefenseNodeId[];
  /** Cycle through the parts by itself (the hero block, while it's on screen). */
  tour?: boolean;
  compact?: boolean;
  reduceMotion: boolean;
  className?: string;
  title: string;
}) {
  const [tourIndex, setTourIndex] = useState(-1);
  useEffect(() => {
    if (!tour || reduceMotion) {
      setTourIndex(-1);
      return undefined;
    }
    setTourIndex(0);
    const id = window.setInterval(() => setTourIndex((i) => (i + 1) % TOUR.length), TOUR_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, tour]);
  const active: readonly DefenseNodeId[] = tourIndex >= 0 ? ["identity", TOUR[tourIndex]!] : activeProp;

  const shapes = useMemo(() => {
    const out = {} as Record<DefenseNodeId, string>;
    for (const id of ORDER) {
      const { w, h } = NODES[id];
      out[id] = createSquirclePath({ width: w, height: h, cornerRadius: Math.min(18, h / 2), cornerSmoothing: 1 });
    }
    return out;
  }, []);
  const packet = useMemo(() => createSquirclePath({ width: 18, height: 18, cornerRadius: 6, cornerSmoothing: 1 }), []);
  const isActive = (id: DefenseNodeId) => active.includes(id);
  const anyActive = active.length > 0;
  const laneActive = isActive("messages");

  return (
    <svg
      className={cn("defense-graph", compact && "defense-graph--compact", className)}
      data-motion={reduceMotion ? "off" : "on"}
      data-any-active={anyActive ? "true" : "false"}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      role="img"
      aria-label={title}
    >
      {/* Links */}
      <g className="defense-graph__links">
        {LINKS.map(([a, b]) => {
          const lit = isActive(a) && isActive(b);
          return (
            <g key={`${a}-${b}`} className="defense-graph__link" data-lit={lit ? "true" : "false"}>
              <path className="defense-graph__link-base" d={linkPath(NODES[a], NODES[b])} />
              <path
                className="defense-graph__link-flow"
                d={linkPath(NODES[a], NODES[b])}
                style={{ "--energy": DEFENSE_NODE_ENERGY[b] } as CSSProperties}
              />
            </g>
          );
        })}
      </g>

      {/* The Messages lane: device → relay → device, sealed packets in flight. */}
      <g className="defense-graph__lane" data-lit={laneActive ? "true" : "false"}>
        <line className="defense-graph__lane-line" x1={DEVICE_A.x + 14} y1={LANE_Y} x2={DEVICE_B.x - 14} y2={LANE_Y} />
        {[DEVICE_A, DEVICE_B].map((d, i) => (
          <g key={i} transform={`translate(${d.x - 11} ${d.y - 18})`} className="defense-graph__device">
            <rect width="22" height="36" rx="6" />
            <line x1="8" y1="31" x2="14" y2="31" />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            className="defense-graph__packet"
            style={
              {
                "--delay": `${i * -1.4}s`,
                "--x-start": `${DEVICE_A.x + 16}px`,
                "--x-end": `${DEVICE_B.x - 34}px`,
                transform: reduceMotion ? `translate(${DEVICE_A.x + 70 + i * 128}px, ${LANE_Y - 9}px)` : undefined,
              } as CSSProperties
            }
          >
            <path d={packet} className="defense-graph__packet-body" />
            {/* lock glyph */}
            <rect x="5.5" y="8.5" width="7" height="5.5" rx="1.2" className="defense-graph__packet-lock" />
            <path d="M7 8.5 V7 a2 2 0 0 1 4 0 V8.5" className="defense-graph__packet-shackle" />
          </g>
        ))}
        {compact ? null : (
          <text className="defense-graph__lane-label" x={VIEW.w / 2} y={LANE_Y - 32} textAnchor="middle">
            {DEFENSE_SYSTEM_PACKET_LABEL}
          </text>
        )}
      </g>

      {/* Nodes */}
      <g className="defense-graph__nodes">
        {ORDER.map((id) => {
          const n = NODES[id];
          const copy = DEFENSE_SYSTEM_NODES[id];
          const lit = isActive(id);
          if (compact) {
            // Mini map: dots with big labels (it renders ~200px wide beside the doc).
            return (
              <g
                key={id}
                className="defense-graph__node defense-graph__node--dot"
                data-node={id}
                data-lit={lit ? "true" : "false"}
                transform={`translate(${n.x} ${n.y - 10})`}
                style={{ "--energy": DEFENSE_NODE_ENERGY[id] } as CSSProperties}
              >
                <circle className="defense-graph__node-glow" r="17" />
                <circle className="defense-graph__node-body" r="17" />
                <circle className="defense-graph__node-dot" r="6" />
                <text className="defense-graph__node-label" y="48" textAnchor="middle">
                  {copy.label}
                </text>
              </g>
            );
          }
          return (
            <g
              key={id}
              className="defense-graph__node"
              data-node={id}
              data-lit={lit ? "true" : "false"}
              transform={`translate(${n.x - n.w / 2} ${n.y - n.h / 2})`}
              style={{ "--energy": DEFENSE_NODE_ENERGY[id] } as CSSProperties}
            >
              <path className="defense-graph__node-glow" d={shapes[id]} />
              <path className="defense-graph__node-body" d={shapes[id]} />
              <circle className="defense-graph__node-dot" cx="16" cy={n.h / 2} r="3.5" />
              <text className="defense-graph__node-label" x="27" y={n.h / 2 - 2}>
                {copy.label}
              </text>
              <text className="defense-graph__node-sub" x="27" y={n.h / 2 + 13}>
                {copy.sub}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
