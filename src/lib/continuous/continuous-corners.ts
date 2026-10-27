/* Byte copy of jokuh-live frontend/src/utils/continuous-corners.ts (only `snapClipDimensions` inlined). */
/**
 * **Owns:** continuous (superellipse-family) corners for web sheet containers — the iOS `RoundedRectangle(style:
 * .continuous)` / Figma-smoothed squircles that a plain CSS `border-radius` circle cannot draw.
 *
 * **Two curves, both from Swift:**
 * - `figma` — Figma 100% corner smoothing (`figma-squircle`). Swift `CenterSheetInnerSquircleShape(.figmaContinuous)`,
 *   `makeSquirclePath` (shell, Call/Text card, wells, pods) — the curve starts 2r from the corner.
 * - `apple` — Apple's continuous rounded rect (the PaintCode reverse-engineering, curve starts 1.528r out). Swift
 *   `UnevenRoundedRectangle(style: .continuous)` — `CenterSheetContentLayout.paperCardBodyShape` (56 top / 40 bottom).
 *
 * **How it lands on the page:**
 * 1. **CSS `corner-shape`** (Chromium 139+): `continuousCornerCss()` returns a `border-radius` scaled up and a
 *    `superellipse(k)` that trace the curve within ~0.5px (least-squares fit, scratch script in the 2026-10-12 parity
 *    pass: figma r → 1.45r / k 1.58, apple r → 1.20r / k 1.32). Background, border, outline, shadow and `overflow`
 *    clipping all follow it with no JS. `center-sheet-paper-card.css` uses these numbers under `@supports`.
 * 2. **Exact SVG path** everywhere (`continuousCornerPath`) — `bindContinuousCorners()` measures an element
 *    (`ResizeObserver`, integer-snapped) and publishes CSS custom properties: a `path()` for `clip-path` on the element
 *    or its paint layers (`::before` / `::after`), and an SVG data-URI "surface" image that paints fill + rim on the
 *    exact path *without clipping children* (Text popovers must overflow the card). Safari / Firefox get the true curve
 *    this way; Chromium gets it too, so rims never drift from the fill.
 *
 * **Connects to:** `squircle.ts` (Figma path + shell constants), `SquircleClipWell.tsx`, `CallTextSlideOverSheet.tsx`
 * + `RootChrome.tsx` (bind the paper card), `styles/continuous-corners.css`, `styles/center-sheet-paper-card.css`.
 * **Parity:** Sources/squircle-path.swift (`makeSquirclePath`, `makeFigmaSquirclePath`, `CenterSheetInnerSquircleShape`),
 * Sources/sheets/contact-row.swift (`paperCardBodyShape`, `CenterSheetCompositionSurfaceBridge`).
 */

import { getSvgPath } from 'figma-squircle';

/** Rounds a measured box to whole pixels so SVG paths line up with composited layers (jokuh-live `utils/squircle.ts`). */
function snapClipDimensions(width: number, height: number): { w: number; h: number } {
  return { w: Math.max(0, Math.round(width)), h: Math.max(0, Math.round(height)) };
}

export type ContinuousCurve = 'figma' | 'apple';

/** One radius for all four corners, or per corner. */
export type CornerRadii = number | { tl: number; tr: number; br: number; bl: number };

/** Pixel inset of a sub-rect inside the measured box (e.g. the paper fill inside the card: 62 top / 10 bottom). */
export interface BoxInset {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Apple continuous corner reach in units of r (`squircle.ts` `SQUIRCLE_MAGIC`). */
const APPLE_CONTINUOUS_REACH = 1.52866483;

/**
 * CSS `corner-shape: superellipse(k)` stand-ins: multiply the iOS radius by `radiusScale` and use `k`.
 * Max deviation from the true path at r = 50: figma 0.54px, apple 0.25px.
 */
export const CSS_SUPERELLIPSE_FIT: Record<ContinuousCurve, { radiusScale: number; k: number }> = {
  figma: { radiusScale: 1.45, k: 1.58 },
  apple: { radiusScale: 1.2, k: 1.32 },
};

function normalizeRadii(radii: CornerRadii): { tl: number; tr: number; br: number; bl: number } {
  return typeof radii === 'number' ? { tl: radii, tr: radii, br: radii, bl: radii } : radii;
}

/** True when the engine draws `corner-shape: superellipse()` (Chromium 139+). */
export function supportsCssSuperellipse(): boolean {
  return typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('corner-shape', 'superellipse(2)');
}

/** `border-radius` + `corner-shape` that approximate the continuous curve (apply only when supported). */
export function continuousCornerCss(radii: CornerRadii, curve: ContinuousCurve = 'figma'): {
  'border-radius': string;
  'corner-shape': string;
} {
  const r = normalizeRadii(radii);
  const fit = CSS_SUPERELLIPSE_FIT[curve];
  const px = (v: number) => `${(v * fit.radiusScale).toFixed(2)}px`;
  return {
    'border-radius': `${px(r.tl)} ${px(r.tr)} ${px(r.br)} ${px(r.bl)}`,
    'corner-shape': `superellipse(${fit.k})`,
  };
}

/** Apple continuous rounded rect with per-corner radii — PaintCode curve (Swift `.continuous`). */
function appleContinuousPath(width: number, height: number, radii: { tl: number; tr: number; br: number; bl: number }): string {
  const limit = Math.min(width, height) / 2 / APPLE_CONTINUOUS_REACH;
  const rTL = Math.max(0, Math.min(radii.tl, limit));
  const rTR = Math.max(0, Math.min(radii.tr, limit));
  const rBR = Math.max(0, Math.min(radii.br, limit));
  const rBL = Math.max(0, Math.min(radii.bl, limit));
  const f = (n: number) => n.toFixed(3);
  const tl = (x: number, y: number) => `${f(rTL * x)},${f(rTL * y)}`;
  const tr = (x: number, y: number) => `${f(width - rTR * x)},${f(rTR * y)}`;
  const br = (x: number, y: number) => `${f(width - rBR * x)},${f(height - rBR * y)}`;
  const bl = (x: number, y: number) => `${f(rBL * x)},${f(height - rBL * y)}`;
  return [
    `M ${tl(1.52866483, 0)}`,
    `L ${tr(1.52866471, 0)}`,
    `C ${tr(1.08849323, 0)} ${tr(0.86840689, 0)} ${tr(0.66993427, 0.065496)}`,
    `L ${tr(0.63149399, 0.074911)}`,
    `C ${tr(0.37282392, 0.16905899)} ${tr(0.16906013, 0.37282401)} ${tr(0.07491176, 0.63149399)}`,
    `C ${tr(0, 0.86840701)} ${tr(0, 1.08849299)} ${tr(0, 1.52866483)}`,
    `L ${br(0, 1.52866471)}`,
    `C ${br(0, 1.08849323)} ${br(0, 0.86840689)} ${br(0.06549569, 0.66993493)}`,
    `L ${br(0.07491111, 0.63149399)}`,
    `C ${br(0.16905883, 0.37282392)} ${br(0.37282392, 0.16905883)} ${br(0.63149399, 0.07491111)}`,
    `C ${br(0.86840689, 0)} ${br(1.08849323, 0)} ${br(1.52866471, 0)}`,
    `L ${bl(1.52866483, 0)}`,
    `C ${bl(1.08849299, 0)} ${bl(0.86840701, 0)} ${bl(0.66993397, 0.06549569)}`,
    `L ${bl(0.63149399, 0.07491111)}`,
    `C ${bl(0.37282401, 0.16905883)} ${bl(0.16906001, 0.37282392)} ${bl(0.074911, 0.63149399)}`,
    `C ${bl(0, 0.86840689)} ${bl(0, 1.08849323)} ${bl(0, 1.52866471)}`,
    `L ${tl(0, 1.52866483)}`,
    `C ${tl(0, 1.08849299)} ${tl(0, 0.86840701)} ${tl(0.065496, 0.66993397)}`,
    `L ${tl(0.074911, 0.63149399)}`,
    `C ${tl(0.16906001, 0.37282401)} ${tl(0.37282401, 0.16906001)} ${tl(0.63149399, 0.074911)}`,
    `C ${tl(0.86840701, 0)} ${tl(1.08849299, 0)} ${tl(1.52866483, 0)}`,
    'Z',
  ].join(' ');
}

/** Moves every absolute coordinate pair in a path by (dx, dy) — `figma-squircle` and the Apple path are absolute. */
function translatePath(d: string, dx: number, dy: number): string {
  if (dx === 0 && dy === 0) return d;
  // Both generators emit absolute commands with "x,y" or "x y" pairs; arcs from figma-squircle are relative (`a`),
  // whose numbers must not move — so shift only the pair that follows M / L / C and each C control point.
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const out: string[] = [];
  let cmd = '';
  let argIndex = 0;
  for (const tok of tokens) {
    if (/^[a-zA-Z]$/.test(tok)) {
      cmd = tok;
      argIndex = 0;
      out.push(tok);
      continue;
    }
    const n = Number(tok);
    if (cmd === 'M' || cmd === 'L' || cmd === 'C') {
      out.push((argIndex % 2 === 0 ? n + dx : n + dy).toFixed(3));
    } else {
      out.push(tok);
    }
    argIndex += 1;
  }
  return out.join(' ');
}

/**
 * Exact continuous-corner path for a `width`×`height` box (optionally offset by `x`/`y` and inset by `inset`, e.g.
 * half a stroke). Radii clamp like Swift (figma: half the short side; apple: half / 1.528).
 */
export function continuousCornerPath(
  width: number,
  height: number,
  radii: CornerRadii,
  curve: ContinuousCurve = 'figma',
  opts?: { x?: number; y?: number; inset?: number },
): string {
  const inset = opts?.inset ?? 0;
  const w = width - inset * 2;
  const h = height - inset * 2;
  if (w <= 0 || h <= 0) return '';
  const r = normalizeRadii(radii);
  const shrink = (v: number) => Math.max(0, v - inset);
  const rr = { tl: shrink(r.tl), tr: shrink(r.tr), br: shrink(r.br), bl: shrink(r.bl) };
  let d: string;
  if (curve === 'apple') {
    d = appleContinuousPath(w, h, rr);
  } else {
    const maxR = Math.min(w, h) / 2;
    d = getSvgPath({
      width: w,
      height: h,
      topLeftCornerRadius: Math.min(rr.tl, maxR),
      topRightCornerRadius: Math.min(rr.tr, maxR),
      bottomRightCornerRadius: Math.min(rr.br, maxR),
      bottomLeftCornerRadius: Math.min(rr.bl, maxR),
      cornerSmoothing: 1,
      preserveSmoothing: true,
    });
  }
  return translatePath(d, (opts?.x ?? 0) + inset, (opts?.y ?? 0) + inset);
}

/** CSS `clip-path: path(...)` value. */
export function continuousCornerClipPath(
  width: number,
  height: number,
  radii: CornerRadii,
  curve: ContinuousCurve = 'figma',
): string {
  const d = continuousCornerPath(width, height, radii, curve);
  return d ? `path('${d}')` : 'none';
}

/** A paint for SVG surfaces: solid colour or a linear gradient (`x1..y2` in 0–1 box units, like SwiftUI unit points). */
export type SurfacePaint =
  | string
  | { stops: Array<{ offset: number; color: string }>; x1: number; y1: number; x2: number; y2: number };

/** Layer of a surface image: one path (shape + optional inset sub-rect) with fill and/or stroke. */
export interface SurfaceLayer {
  radii: CornerRadii;
  curve?: ContinuousCurve;
  /** Sub-rect inside the image (default: whole box). */
  inset?: BoxInset;
  fill?: SurfacePaint | null;
  stroke?: SurfacePaint | null;
  /** Stroke width; drawn fully inside the shape (SwiftUI `strokeBorder`). */
  strokeWidth?: number;
}

function escapeAttr(v: string): string {
  return v.replace(/"/g, "'");
}

/** Builds an SVG data URI (`url("data:image/svg+xml,…")`) that paints the layers on the exact paths. */
export function continuousSurfaceImage(width: number, height: number, layers: SurfaceLayer[]): string {
  if (width <= 0 || height <= 0) return 'none';
  let defs = '';
  let body = '';
  layers.forEach((layer, i) => {
    const inset = layer.inset ?? { top: 0, right: 0, bottom: 0, left: 0 };
    const bw = width - inset.left - inset.right;
    const bh = height - inset.top - inset.bottom;
    if (bw <= 0 || bh <= 0) return;
    const paint = (p: SurfacePaint | null | undefined, id: string): string => {
      if (p == null) return 'none';
      if (typeof p === 'string') return escapeAttr(p);
      const stops = p.stops
        .map(s => `<stop offset="${s.offset}" stop-color="${escapeAttr(s.color)}"/>`)
        .join('');
      defs += `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${(inset.left + p.x1 * bw).toFixed(2)}" y1="${(inset.top + p.y1 * bh).toFixed(2)}" x2="${(inset.left + p.x2 * bw).toFixed(2)}" y2="${(inset.top + p.y2 * bh).toFixed(2)}">${stops}</linearGradient>`;
      return `url(#${id})`;
    };
    if (layer.fill != null) {
      const d = continuousCornerPath(bw, bh, layer.radii, layer.curve ?? 'figma', { x: inset.left, y: inset.top });
      body += `<path d="${d}" fill="${paint(layer.fill, `f${i}`)}"/>`;
    }
    if (layer.stroke != null) {
      const sw = layer.strokeWidth ?? 1;
      const d = continuousCornerPath(bw, bh, layer.radii, layer.curve ?? 'figma', {
        x: inset.left,
        y: inset.top,
        inset: sw / 2,
      });
      body += `<path d="${d}" fill="none" stroke="${paint(layer.stroke, `s${i}`)}" stroke-width="${sw}"/>`;
    }
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs>${defs}</defs>${body}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export interface ContinuousCornersBinding {
  /** Called with the snapped size; return the CSS custom properties to set on the element. */
  compute: (size: { w: number; h: number }) => Record<string, string>;
  /** Marker attribute set while bound (CSS keys exact-path rules off it). Default `data-continuous-corners`. */
  attribute?: string;
  /** Recompute when these attributes change on `<html>` (theme / scheme switches recolour the surface). */
  watchRootAttributes?: string[];
  /** Recompute when these attributes change on the element itself (e.g. `class` modifiers). */
  watchOwnAttributes?: string[];
}

/**
 * Measures `el` and keeps the CSS custom properties from `binding.compute` current (rAF-coalesced). Returns cleanup.
 * Use `continuousCornerClipPath` / `continuousSurfaceImage` inside `compute`.
 */
export function bindContinuousCorners(el: HTMLElement, binding: ContinuousCornersBinding): () => void {
  const attr = binding.attribute ?? 'data-continuous-corners';
  let raf: number | null = null;
  let last = '';
  let setKeys: string[] = [];
  const apply = () => {
    raf = null;
    const rect = el.getBoundingClientRect();
    // Layout size, not the transformed box (slide-over rises with a translate; sheets scale on open).
    const size = snapClipDimensions(el.offsetWidth || rect.width, el.offsetHeight || rect.height);
    if (size.w <= 0 || size.h <= 0) return;
    const vars = binding.compute(size);
    const key = JSON.stringify(vars);
    if (key === last) return;
    last = key;
    for (const k of setKeys) if (!(k in vars)) el.style.removeProperty(k);
    for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
    setKeys = Object.keys(vars);
    el.setAttribute(attr, '');
  };
  const schedule = () => {
    if (raf != null) return;
    raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(apply) : (setTimeout(apply, 16) as unknown as number);
  };
  schedule();
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
  ro?.observe(el);
  const observers: MutationObserver[] = [];
  if (typeof MutationObserver !== 'undefined') {
    if (binding.watchRootAttributes?.length) {
      const mo = new MutationObserver(schedule);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: binding.watchRootAttributes });
      observers.push(mo);
    }
    if (binding.watchOwnAttributes?.length) {
      const mo = new MutationObserver(schedule);
      mo.observe(el, { attributes: true, attributeFilter: binding.watchOwnAttributes });
      observers.push(mo);
    }
  }
  return () => {
    ro?.disconnect();
    for (const mo of observers) mo.disconnect();
    if (raf != null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(raf);
    for (const k of setKeys) el.style.removeProperty(k);
    el.removeAttribute(attr);
  };
}
