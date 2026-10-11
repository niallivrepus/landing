/**
 * **Purpose:** Registry of the interactive isometric figures served from `public/figures/<id>/`.
 * Each figure is a standalone page in a light and a dark build (kit inlined, no network), plus a still
 * SVG and a PNG poster per theme. `public/figures/embed.js` gives them a framed mode (no page margins,
 * height reported to the parent) when they sit inside `FigureEmbed`.
 * **Source:** built in `jokuh-live/docs/figures/<id>/` (anatomy skill); copy the built HTML/SVG only,
 * rename to `<id>-light.*` / `<id>-dark.*`, and re-add the `../embed.js` script tag before `</body>`.
 * **Accuracy:** captions here repeat the figure's own wording — do not add claims the figure does not make.
 * **Connects to:** `components/FigureEmbed.tsx`, `pages/AgentsPage.tsx`, `pages/SecurityPage.tsx`,
 * framing headers for `/figures/` in `server/static-middleware.ts`.
 */

export type FigureId = "oopolis-workshop" | "agent-approvals" | "coding-bridge" | "oo-e2ee-vault" | "instant-home";

export type FigureDef = {
  id: FigureId;
  /** Accessible name of the frame and the figure's own title. */
  title: string;
  /** Short caption under the frame. The figure carries its own legend and explanation inside. */
  caption: string;
  /**
   * Framed document height (px) measured at frame widths (px), light build, used to reserve space before
   * the figure reports its real height. Linear interpolation between samples.
   */
  heights: readonly (readonly [width: number, height: number])[];
};

export const FIGURES: Record<FigureId, FigureDef> = {
  "oopolis-workshop": {
    id: "oopolis-workshop",
    title: "OOpolis: your agents at work",
    caption: "Interactive figure: OO hands tasks to your agents, and approvals, questions and finished work come back to one Inbox. Agent names are examples.",
    heights: [[320, 741], [400, 686], [480, 671], [560, 696], [640, 693], [720, 698], [800, 724], [960, 814]],
  },
  "agent-approvals": {
    id: "agent-approvals",
    title: "How a Jokuh agent asks first",
    caption: "Interactive figure: every tool call is sorted by risk. Send, spend and delete always wait for you.",
    heights: [[320, 895], [400, 834], [480, 826], [560, 828], [640, 830], [720, 843], [800, 895], [960, 980]],
  },
  "coding-bridge": {
    id: "coding-bridge",
    title: "Approve your coding agents from anywhere",
    caption: "Interactive figure: a coding agent's permission request travels from your Mac to your phone and back. The timer is shortened for the demo.",
    heights: [[320, 815], [400, 815], [480, 815], [560, 794], [640, 802], [720, 842], [800, 902], [960, 975]],
  },
  "oo-e2ee-vault": {
    id: "oo-e2ee-vault",
    title: "OO in an encrypted group",
    caption: "Interactive figure: OO, added as a member, gets its own wrapped key. Removing a member, OO included, rotates the key.",
    heights: [[320, 896], [400, 803], [480, 764], [560, 792], [640, 742], [720, 737], [800, 752], [960, 815]],
  },
  "instant-home": {
    id: "instant-home",
    title: "Instant home",
    caption: "Interactive figure, measured on a real iPhone (development build): home usable at about 4.7 s before, interactive at 1.1 s after.",
    heights: [[320, 835], [400, 731], [480, 728], [560, 726], [640, 698], [720, 715], [800, 732], [960, 787]],
  },
};

export type FigureTheme = "light" | "dark";

export function figurePageHref(id: FigureId, theme: FigureTheme): string {
  return `/figures/${id}/${id}-${theme}.html`;
}

export function figurePosterSrc(id: FigureId, theme: FigureTheme): string {
  return `/figures/${id}/${id}-${theme}.png`;
}

/** Reserved frame height for a given width, from the measured samples (clamped at both ends). */
export function figureReservedHeight(def: FigureDef, width: number): number {
  const samples = def.heights;
  if (width <= samples[0][0]) return samples[0][1];
  for (let i = 1; i < samples.length; i += 1) {
    const [w1, h1] = samples[i];
    if (width <= w1) {
      const [w0, h0] = samples[i - 1];
      return Math.round(h0 + ((h1 - h0) * (width - w0)) / (w1 - w0));
    }
  }
  const [wa, ha] = samples[samples.length - 2];
  const [wb, hb] = samples[samples.length - 1];
  return Math.round(hb + ((hb - ha) * (width - wb)) / (wb - wa));
}
