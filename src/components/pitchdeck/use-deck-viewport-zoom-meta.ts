/**
 * @fileoverview Deck routes (`/pitchdeck`, `/deck`) need OS-level pinch / accessibility zoom so
 * readers can magnify slides; the renderer shell `index.html` pins `user-scalable=no` for the rest
 * of the app. This hook swaps `meta[name=viewport]` while the interactive deck is mounted and
 * restores the previous `content` on unmount so other surfaces keep the original zoom policy.
 */
import { useEffect } from "react";

/** Viewport string that allows pinch and keyboard zoom while preserving safe-area insets. */
const DECK_RELAXED_VIEWPORT =
  "width=device-width, initial-scale=1.0, minimum-scale=0.25, maximum-scale=5, user-scalable=yes, viewport-fit=cover";

/**
 * Applies `DECK_RELAXED_VIEWPORT` to the document viewport meta tag for the lifetime of the
 * caller component; no-ops if the meta tag is missing (e.g. non-browser tests).
 */
export function useDeckViewportZoomMeta(): void {
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return undefined;

    const previous = meta.getAttribute("content") ?? "";
    meta.setAttribute("content", DECK_RELAXED_VIEWPORT);

    return () => {
      meta.setAttribute("content", previous);
    };
  }, []);
}
