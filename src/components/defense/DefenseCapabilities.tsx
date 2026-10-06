import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DEFENSE_CAPABILITIES, type DefenseCapability, type DefenseNodeId } from "../../data/defense";
import { SquircleBox } from "../system/squircle";
import { useDefenseCapture } from "./defense-captures";
import { DEFENSE_NODE_ENERGY } from "./DefenseSystemGraph";
import { useNearScroller } from "./useNearScroller";

/**
 * **Purpose:** "At a glance" on `/defense`: compact capability tiles, each a crop of a REAL app recording's poster
 * (never re-drawn UI) with a slow looping pan as its micro-animation. During autoplay the tiles take turns (`touring`):
 * the focused tile rings in its energy colour and the shell lights the matching corner. Reduced motion: still crops.
 * **Connects to:** `DefenseDoc`, `defense-captures.ts`, `DEFENSE_CAPABILITIES`, `defense-app.css` (`.defense-cap*`).
 */

const TOUR_MS = 1350;

export function DefenseCapabilities({
  touring,
  light,
  onFocusChange,
}: {
  touring: boolean;
  light: boolean;
  onFocusChange?: (node: DefenseNodeId | null) => void;
}) {
  const items = DEFENSE_CAPABILITIES.items;
  const [index, setIndex] = useState(-1);
  const ref = useRef<HTMLUListElement>(null);
  const near = useNearScroller(ref);

  useEffect(() => {
    if (!touring) {
      setIndex(-1);
      return undefined;
    }
    setIndex(0);
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), TOUR_MS);
    return () => window.clearInterval(id);
  }, [items.length, touring]);

  const focused = index >= 0 ? items[index] : undefined;
  useEffect(() => {
    onFocusChange?.(focused?.node ?? null);
  }, [focused, onFocusChange]);

  return (
    <ul ref={ref} className="defense-caps">
      {items.map((item) => (
        <CapabilityTile key={item.id} item={item} focused={focused?.id === item.id} near={near} light={light} />
      ))}
    </ul>
  );
}

function CapabilityTile({
  item,
  focused,
  near,
  light,
}: {
  item: DefenseCapability;
  focused: boolean;
  near: boolean;
  light: boolean;
}) {
  const files = useDefenseCapture(item.capture, light);
  return (
    <li className="defense-cap" data-focus={focused ? "true" : "false"} style={{ "--energy": DEFENSE_NODE_ENERGY[item.node] } as CSSProperties}>
      <SquircleBox
        radius={20}
        className="defense-cap__crop"
        fillClassName="defense-cap__fill"
        ring={{ offset: 3, className: "defense-cap__ring" }}
      >
        {files?.poster && near ? (
          <img
            className="defense-cap__img"
            src={files.poster}
            alt=""
            decoding="async"
            style={{ objectPosition: item.focus }}
          />
        ) : null}
      </SquircleBox>
      <p className="defense-cap__title">{item.title}</p>
      <p className="defense-cap__body">{item.body}</p>
    </li>
  );
}
