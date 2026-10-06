import { cn, createSquirclePath } from "@jokuh/gooey";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { DEFENSE_CONNECTED, type DefenseTrustKind, type DefenseTrustNodeId } from "../../data/defense";

/**
 * **Purpose:** "How it's connected" on `/defense` — an honest trust-boundary data-flow diagram (drawn as a diagram):
 * your device (passkey + message keys) → the messages relay, which only carries ciphertext → the recipient's device
 * (solid, sealed end to end, packets in flight); calls through a real-time media provider (no E2EE claim); Spine, Docs
 * and Mail private to the account but NOT end-to-end encrypted (amber, dashed — visibly different); OO sending only
 * the chosen context to third-party cloud models (violet), with US-only / self-hosted marked as roadmap.
 * Hover, focus or tap a part for its one line. During autoplay it tours the parts by itself (`touring`), reporting
 * the focused part so the shell can light the matching corner pill.
 * **Connects to:** `DefenseDoc`, `DEFENSE_CONNECTED` copy, `defense-app.css` (`.defense-trust*`).
 */

const NODE_W = 136;
const NODE_H = 44;

type Spec = { x: number; y: number };

const POS: Record<DefenseTrustNodeId, Spec> = {
  passkey: { x: 90, y: 96 },
  keys: { x: 90, y: 170 },
  relay: { x: 260, y: 124 },
  recipient: { x: 430, y: 124 },
  calls: { x: 260, y: 228 },
  store: { x: 260, y: 330 },
  oo: { x: 430, y: 300 },
  roadmap: { x: 430, y: 368 },
};

const ZONES = [
  { id: "device", x: 10, y: 30, w: 160, h: 376 },
  { id: "platform", x: 180, y: 30, w: 160, h: 376 },
  { id: "recipient", x: 350, y: 30, w: 160, h: 186 },
  { id: "ai", x: 350, y: 226, w: 160, h: 180 },
] as const;

type Flow = { id: string; d: string; kind: DefenseTrustKind; nodes: DefenseTrustNodeId[]; packets?: boolean };

const FLOWS: Flow[] = [
  { id: "seal", d: "M 158 170 C 200 170, 200 124, 192 124", kind: "sealed", nodes: ["keys", "relay"], packets: true },
  { id: "relay", d: "M 328 124 L 362 124", kind: "sealed", nodes: ["relay", "recipient"], packets: true },
  { id: "passkey", d: "M 90 118 L 90 148", kind: "sealed", nodes: ["passkey", "keys"] },
  { id: "calls", d: "M 120 192 C 150 228, 170 228, 192 228", kind: "neutral", nodes: ["keys", "calls"] },
  { id: "store", d: "M 90 192 C 90 330, 140 330, 192 330", kind: "account", nodes: ["keys", "store"] },
  { id: "oo", d: "M 328 330 C 350 330, 350 300, 362 300", kind: "ai", nodes: ["store", "oo"], packets: true },
  { id: "roadmap", d: "M 430 322 L 430 346", kind: "roadmap", nodes: ["oo", "roadmap"] },
];

const TOUR_MS = 1250;

export function DefenseTrustDiagram({
  touring,
  reduceMotion,
  onFocusChange,
}: {
  touring: boolean;
  reduceMotion: boolean;
  onFocusChange?: (id: DefenseTrustNodeId | null) => void;
}) {
  const { nodes, zones, legend, tour, diagramCaption } = DEFENSE_CONNECTED;
  const [tourIndex, setTourIndex] = useState(-1);
  const [picked, setPicked] = useState<DefenseTrustNodeId | null>(null);
  const shape = useMemo(
    () => createSquirclePath({ width: NODE_W, height: NODE_H, cornerRadius: 16, cornerSmoothing: 1 }),
    [],
  );
  const packet = useMemo(() => createSquirclePath({ width: 12, height: 12, cornerRadius: 4, cornerSmoothing: 1 }), []);

  // The autoplay tour: one part every TOUR_MS while this section plays; resets when it stops.
  useEffect(() => {
    if (!touring) {
      setTourIndex(-1);
      return undefined;
    }
    setTourIndex(0);
    const id = window.setInterval(() => setTourIndex((i) => (i + 1) % tour.length), TOUR_MS);
    return () => window.clearInterval(id);
  }, [touring, tour.length]);

  const focus: DefenseTrustNodeId | null = picked ?? (tourIndex >= 0 ? tour[tourIndex] ?? null : null);

  useEffect(() => {
    onFocusChange?.(focus);
  }, [focus, onFocusChange]);

  const onKey = (event: KeyboardEvent<SVGGElement>, id: DefenseTrustNodeId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setPicked(id);
    }
  };

  const focusLine = focus ? nodes[focus].line : null;

  return (
    <figure className="defense-trust" data-motion={reduceMotion ? "off" : "on"} data-focus={focus ?? undefined}>
      <svg
        className="defense-trust__svg"
        viewBox="0 0 520 416"
        role="group"
        aria-label={diagramCaption}
        onMouseLeave={() => setPicked(null)}
      >
        {ZONES.map((zone) => (
          <g key={zone.id} className="defense-trust__zone" data-zone={zone.id}>
            <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="22" />
            <text x={zone.x + 14} y={zone.y + 20}>
              {zones[zone.id]}
            </text>
          </g>
        ))}

        {FLOWS.map((flow) => {
          const lit = focus ? flow.nodes.includes(focus) : false;
          return (
            <g key={flow.id} className="defense-trust__flow" data-kind={flow.kind} data-lit={lit ? "true" : "false"}>
              <path id={`defense-flow-${flow.id}`} className="defense-trust__flow-line" d={flow.d} />
              {flow.packets && !reduceMotion
                ? [0, 1].map((i) => (
                    <path key={i} className="defense-trust__packet" d={packet} transform="translate(-6 -6)">
                      <animateMotion dur="2.2s" begin={`${i * -1.1}s`} repeatCount="indefinite">
                        <mpath href={`#defense-flow-${flow.id}`} />
                      </animateMotion>
                    </path>
                  ))
                : null}
            </g>
          );
        })}

        {(Object.keys(POS) as DefenseTrustNodeId[]).map((id) => {
          const { x, y } = POS[id];
          const node = nodes[id];
          const isFocus = focus === id;
          return (
            <g
              key={id}
              className="defense-trust__node"
              data-kind={node.kind}
              data-focus={isFocus ? "true" : "false"}
              transform={`translate(${x - NODE_W / 2} ${y - NODE_H / 2})`}
              role="button"
              tabIndex={0}
              aria-label={`${node.label}: ${node.line}`}
              aria-pressed={isFocus}
              onMouseEnter={() => setPicked(id)}
              onFocus={() => setPicked(id)}
              onBlur={() => setPicked(null)}
              onClick={() => setPicked(id)}
              onKeyDown={(event) => onKey(event, id)}
            >
              <path className="defense-trust__node-ring" d={shape} />
              <path className="defense-trust__node-body" d={shape} />
              <text x={NODE_W / 2} y={NODE_H / 2 + 4.5} textAnchor="middle">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <p className={cn("defense-trust__line")} aria-live="polite">
        {focusLine ?? "Tap any part of the diagram."}
      </p>

      <ul className="defense-trust__legend" aria-label="Legend">
        {legend.map((item) => (
          <li key={item.kind} data-kind={item.kind}>
            <span aria-hidden className="defense-trust__swatch" />
            {item.label}
          </li>
        ))}
      </ul>
      <figcaption className="defense-media__caption">{diagramCaption}</figcaption>
    </figure>
  );
}
