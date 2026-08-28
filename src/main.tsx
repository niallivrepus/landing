/**
 * Dual production entry: MASK vs full marketing SPA.
 * Default prod (`vite build`) loads `bootstrap-prod` (ProdMaskPage).
 * `VITE_SITE_ENTRY=landing` or non-prod loads `bootstrap-landing`.
 */
if (import.meta.env.PROD && import.meta.env.VITE_SITE_ENTRY !== "landing") {
  void import("./bootstrap-prod").then((m) => m.mount());
} else {
  void import("./bootstrap-landing").then((m) => m.mount());
}
