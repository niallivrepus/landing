/**
 * @fileoverview Viewport sizing for `InteractivePitchDeck` and `InteractiveDeck`: caps PDF.js
 * raster width to the visible layout width (prefers `visualViewport` on iOS) so phone landscape
 * does not ship 1200px-wide slides that overflow the screen and feel zoomed when snap-centered.
 */
import { useEffect, useState } from "react";

/** Upper bound for `renderPitchDeckDocumentAtMaxCssWidth` on large monitors. */
export const ARTBOARD_CAP_CSS_PX = 1200;

/**
 * Horizontal gutters + safe area slack subtracted from viewport width when picking raster width
 * and snap padding (`halfPad`).
 */
export const SLIDE_VIEWPORT_GUTTER_PX = 64;

/**
 * Reads layout viewport width; prefers `visualViewport` so iOS Safari toolbar show/hide tracks.
 */
function readLayoutViewportWidthPx(): number {
  if (typeof window === "undefined") {
    return ARTBOARD_CAP_CSS_PX;
  }
  const vv = window.visualViewport;
  const w = vv?.width ?? window.innerWidth;
  return Math.max(1, Math.floor(w));
}

/**
 * Max CSS width passed to `renderPitchDeckDocumentAtMaxCssWidth` so each page fits the device.
 */
export function getArtboardMaxCssWidthForViewport(): number {
  const w = readLayoutViewportWidthPx();
  return Math.min(
    ARTBOARD_CAP_CSS_PX,
    Math.max(320, w - SLIDE_VIEWPORT_GUTTER_PX)
  );
}

/**
 * Reactive max raster width; debounces `resize`, applies immediately on `orientationchange` and
 * `visualViewport` updates so `/pitchdeck` and `/deck` re-render PDFs after rotation.
 */
export function useArtboardMaxCssWidthPx(): number {
  const [value, setValue] = useState(() =>
    typeof window !== "undefined"
      ? getArtboardMaxCssWidthForViewport()
      : ARTBOARD_CAP_CSS_PX
  );

  useEffect(() => {
    /** Browser `setTimeout` id (typed as `number` in DOM lib; avoids NodeJS `Timeout` mismatch). */
    let debounceTimer: number | undefined;

    const applyImmediate = () => {
      setValue(getArtboardMaxCssWidthForViewport());
    };

    const applyDebounced = () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(applyImmediate, 220);
    };

    applyImmediate();
    window.addEventListener("resize", applyDebounced);
    window.addEventListener("orientationchange", applyImmediate);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", applyImmediate);
    vv?.addEventListener("scroll", applyImmediate);

    return () => {
      window.clearTimeout(debounceTimer);
      window.removeEventListener("resize", applyDebounced);
      window.removeEventListener("orientationchange", applyImmediate);
      vv?.removeEventListener("resize", applyImmediate);
      vv?.removeEventListener("scroll", applyImmediate);
    };
  }, []);

  return value;
}

/**
 * Tracks layout width for snap gutters (`halfPad`) independently of PDF page pixel width.
 */
export function useLayoutViewportWidthPx(): number {
  const [w, setW] = useState(() =>
    typeof window !== "undefined"
      ? readLayoutViewportWidthPx()
      : ARTBOARD_CAP_CSS_PX
  );

  useEffect(() => {
    const sync = () => setW(readLayoutViewportWidthPx());
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
    };
  }, []);

  return w;
}
