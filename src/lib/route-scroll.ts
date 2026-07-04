/**
 * Centralized scroll helpers for React Router navigation on the marketing site.
 * Keeps route changes at the top of the page and scrolls hash targets after lazy
 * routes paint, without fighting the browser's default SPA scroll restoration.
 */

/** Matches product section `scroll-mt-24` and fixed product nav height. */
export const ROUTE_SCROLL_MARGIN_PX = 96;

let scrollRestorationInstalled = false;

/** Disable browser auto-restoration so SPA route changes stay predictable. */
export function installManualScrollRestoration() {
  if (scrollRestorationInstalled || typeof window === "undefined") return;
  scrollRestorationInstalled = true;

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}

/** Scroll the document to the top after the next paint (post-Suspense layout). */
export function scrollDocumentToTopAfterPaint() {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

/** Scroll to an in-page hash target with fixed-header offset after layout settles. */
export function scrollToHashTargetAfterPaint(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return;

  requestAnimationFrame(() => {
    const target = document.getElementById(id);
    if (!target) return;

    const top =
      target.getBoundingClientRect().top + window.scrollY - ROUTE_SCROLL_MARGIN_PX;
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
  });
}

/** Scroll to an in-page hash target immediately (product nav anchor clicks). */
export function scrollToHashTarget(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return false;

  const target = document.getElementById(id);
  if (!target) return false;

  const top =
    target.getBoundingClientRect().top + window.scrollY - ROUTE_SCROLL_MARGIN_PX;
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
  return true;
}
