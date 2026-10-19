import { OO } from "@jokuh/gooey";
import type { CSSProperties } from "react";

/**
 * **Purpose:** The one real OO for the whole landing site. It renders the Gooey OO mascot that ships in
 * `@jokuh/gooey` (`components/ui/oo.tsx`): the app's OO body path, eyes and inner shadows, in a round disc.
 * Never draw a stand-in OO (a CSS/SVG blob with oval eyes, or a gradient circle that says "OO"); use this.
 * **Looks (app parity):**
 * - `oo` — the OO as the app shows it: blue disc, Insight purple body (Gooey `OO` defaults; OOpolis' centre OO,
 *   jokuh-live `Sources/agents/oopolis/oopolis-oo-art.swift` `OopolisOOPainter` `.origin(insight)` on its paired blue).
 * - `queen` — Queen OO, OOpolis' "yang" look (white body, black eyes on house paper).
 * **Parity (jokuh-live web):** `frontend/src/components/home/JokuhMorphingBlurbsOO.tsx` (same body path + eyes),
 * `frontend/src/utils/oo-capsule-avatar-fill.tsx`.
 * **Connects to:** temp OO chat, mission intro, claim-identity swirl, landing inbox, agent court concept, Gooey home.
 */
export type JokuhOOLook = "oo" | "queen";
type OOExpression = "default" | "happy" | "rainbow-puke";
type OOColors = {
  backgroundColor?: string;
  borderColor?: string;
  bodyGradientStart?: string;
  bodyGradientEnd?: string;
  bodyStrokeColor?: string;
  eyeColor?: string;
};

const LOOKS: Record<JokuhOOLook, OOColors> = {
  oo: {},
  queen: {
    backgroundColor: "#F7F7F7",
    borderColor: "rgba(0, 0, 0, 0.12)",
    bodyGradientStart: "#ffffff",
    bodyGradientEnd: "#e9e9e9",
    bodyStrokeColor: "rgba(0, 0, 0, 0.12)",
    eyeColor: "#000000",
  },
};

export function JokuhOO({
  size = 42,
  look = "oo",
  expression = "default",
  className,
  style,
  label,
}: {
  /** Outer diameter in px (the Gooey OO is drawn at 42 and scaled). */
  size?: number;
  look?: JokuhOOLook;
  expression?: OOExpression;
  className?: string;
  style?: CSSProperties;
  /** Accessible name; omit for decorative use (aria-hidden). */
  label?: string;
}) {
  const k = size / 42;
  return (
    <span
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ display: "inline-block", flex: "none", width: size, height: size, position: "relative", ...style }}
    >
      <OO
        {...LOOKS[look]}
        expression={expression}
        style={{ position: "absolute", left: 0, top: 0, transform: `scale(${k})`, transformOrigin: "0 0" }}
      />
    </span>
  );
}
