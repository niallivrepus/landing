/**
 * The exact continuous-corner paint for the doc sheet's paper card: jokuh-live `utils/paper-card-corners.ts`
 * `bindPaperCardCorners`, copied as is, minus the app-only goo-surface hook, with the scheme read from the card's
 * own `data-scheme` (the landing's ThemeProvider drives it) instead of `<html data-theme>`. Publishes `--cc-card-surface`
 * (sheet fill + paper rim + card rim as one SVG on the Figma-50 / Apple-56-40 paths), `--cc-fill-clip`, `--cc-card-clip`.
 * CSS: `styles/doc-sheet-paper.css`.
 */
import {
  bindContinuousCorners,
  continuousCornerClipPath,
  continuousCornerPath,
  continuousSurfaceImage,
  type SurfaceLayer,
} from './continuous-corners';

/** Swift `walletInnerContentSquircleRadius` (Figma 100% smoothing). */
const CARD_RADIUS = 50;
/** Swift `paperCardBodyShape` radii (Apple continuous). */
const PAPER_RADII = { tl: 56, tr: 56, br: 40, bl: 40 };

function readPx(style: CSSStyleDeclaration, name: string, fallback: number): number {
  const v = parseFloat(style.getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
}

/** The site scheme this card sits in (`data-scheme` on the card, set by the doc shell). Gooey look only. */
function paperScheme(el: HTMLElement): { dark: boolean; gooey: boolean } {
  return { dark: el.getAttribute('data-scheme') !== 'light', gooey: true };
}

/** Binds one paper card. Returns cleanup. */
export function bindPaperCardCorners(el: HTMLElement): () => void {
  return bindContinuousCorners(el, {
    watchOwnAttributes: ['class', 'data-scheme'],
    compute: ({ w, h }) => {
      const cs = getComputedStyle(el);
      // `::before` / `::after` are placed in the padding box; the surface image spans the border box
      // (`continuous-corners.css` `background-origin: border-box`), so offset the paper by the border widths.
      const bTop = readPx(cs, 'border-top-width', 0);
      const bRight = readPx(cs, 'border-right-width', 0);
      const bBottom = readPx(cs, 'border-bottom-width', 0);
      const bLeft = readPx(cs, 'border-left-width', 0);
      const fillTop = readPx(cs, '--paper-card-fill-top-inset', 62);
      const fillBottom = readPx(cs, '--paper-card-bottom-inset', 10);
      const fillW = Math.max(0, w - bLeft - bRight);
      const fillH = Math.max(0, h - bTop - bBottom - fillTop - fillBottom);
      const paperInset = { top: bTop + fillTop, right: bRight, bottom: bBottom + fillBottom, left: bLeft };
      const { dark, gooey } = paperScheme(el);
      const seeThrough = el.classList.contains('center-sheet-paper-card--backdrop-see-through');

      // Sheet fill (`SwapFigmaChrome.sheetFill`): black · Gooey Light white · legacy light warm eclipse.
      const sheetFill = seeThrough ? null : dark ? '#000' : gooey ? '#fff' : '#eceae5';
      // Paper rim: dark = top rim light (Gooey opaque peak 0.07, else 0.22); Gooey Light = panelRim 1.5.
      const peak = gooey ? 0.07 : 0.22;
      const paperRimWidth = dark ? 1 : gooey ? 1.5 : 0;
      const paperRim: SurfaceLayer | null = dark
        ? {
            radii: PAPER_RADII,
            curve: 'apple',
            inset: paperInset,
            stroke: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
              stops: [
                { offset: 0, color: `rgba(255,255,255,${peak})` },
                { offset: 0.12, color: `rgba(255,255,255,${(peak * 0.45).toFixed(4)})` },
                { offset: 0.35, color: 'rgba(255,255,255,0)' },
              ],
            },
            strokeWidth: paperRimWidth,
          }
        : gooey
          ? {
              radii: PAPER_RADII,
              curve: 'apple',
              inset: paperInset,
              stroke: 'rgba(0,0,0,0.07)',
              strokeWidth: paperRimWidth,
            }
          : null;
      // Card rim (`continuousSurfaceRimStroke`).
      const cardRim: SurfaceLayer = {
        radii: CARD_RADIUS,
        curve: 'figma',
        stroke: dark
          ? {
              x1: 0,
              y1: 0,
              x2: 1,
              y2: 1,
              stops: [
                { offset: 0, color: 'rgba(255,255,255,0.28)' },
                { offset: 1, color: 'rgba(255,255,255,0.10)' },
              ],
            }
          : 'rgba(0,0,0,0.07)',
        strokeWidth: 1.5,
      };
      const layers: SurfaceLayer[] = [];
      if (sheetFill) layers.push({ radii: CARD_RADIUS, curve: 'figma', fill: sheetFill });
      if (paperRim) layers.push(paperRim);
      layers.push(cardRim);

      const fillClipD =
        fillW > 0 && fillH > 0
          ? continuousCornerPath(fillW, fillH, PAPER_RADII, 'apple', { inset: paperRimWidth })
          : '';
      return {
        '--cc-card-surface': continuousSurfaceImage(w, h, layers),
        '--cc-fill-clip': fillClipD ? `path('${fillClipD}')` : 'none',
        '--cc-card-clip': continuousCornerClipPath(w, h, CARD_RADIUS, 'figma'),
      };
    },
  });
}

