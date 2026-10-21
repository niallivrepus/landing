import { cn } from "@jokuh/gooey";
import { useState } from "react";
import { DEFENSE_CONNECTED, type DefenseTrustKind, type DefenseTrustNodeId } from "../../../data/defense";

/**
 * **Purpose:** Where data is sealed, where it isn't, and what leaves for AI: the honest trust boundaries, as four goo
 * zones (your device → Jokuh servers → recipient's device, with third-party AI off to the side). Tap a part for its
 * one line. All wording comes from `DEFENSE_CONNECTED` so the page never says more than `/security` and `/privacy`.
 * **Connects to:** `data/defense.ts`, `defense-goo.css`.
 */
const ZONES: { key: keyof typeof DEFENSE_CONNECTED.zones; ids: DefenseTrustNodeId[] }[] = [
  { key: "device", ids: ["passkey", "keys"] },
  { key: "platform", ids: ["relay", "calls", "store"] },
  { key: "recipient", ids: ["recipient"] },
  { key: "ai", ids: ["oo", "roadmap"] },
];

export function DefenseTrust() {
  const { title, intro, nodes, zones, legend, diagramCaption } = DEFENSE_CONNECTED;
  const [picked, setPicked] = useState<DefenseTrustNodeId>("relay");
  return (
    <section className="defense-section" aria-labelledby="defense-trust-title" id="trust">
      <div className="defense-section__head">
        <p className="defense-eyebrow">Trust boundaries</p>
        <h2 id="defense-trust-title" className="defense-h2">
          {title}
        </h2>
        <p className="defense-lede">{intro}</p>
      </div>
      <figure className="defense-trust2">
        <div className="defense-trust2__zones">
          {ZONES.map((zone) => (
            <div key={zone.key} className="defense-trust2__zone" data-zone={zone.key}>
              <p className="defense-trust2__zonelabel">{zones[zone.key as keyof typeof zones]}</p>
              <div className="defense-trust2__chips">
                {zone.ids.map((id) => {
                  const node = nodes[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      className={cn("defense-tchip", id === picked && "is-on")}
                      data-kind={node.kind}
                      aria-pressed={id === picked}
                      onClick={() => setPicked(id)}
                    >
                      <span aria-hidden className="defense-badge__sw" />
                      {node.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="defense-trust2__line" aria-live="polite" data-kind={nodes[picked].kind}>
          <strong>{nodes[picked].label}.</strong> {nodes[picked].line}
        </p>
        <ul className="defense-legend" aria-label="Legend">
          {legend.map((l: { kind: DefenseTrustKind; label: string }) => (
            <li key={l.kind} data-boundary={l.kind}>
              <span aria-hidden className="defense-badge__sw" />
              {l.label}
            </li>
          ))}
        </ul>
        <figcaption className="defense-caption">{diagramCaption}</figcaption>
      </figure>
    </section>
  );
}
