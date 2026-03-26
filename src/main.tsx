if (import.meta.env.PROD && import.meta.env.VITE_SITE_ENTRY !== "landing") {
  void import("./bootstrap-prod").then((m) => m.mount());
} else {
  void import("./bootstrap-dev").then((m) => m.mount());
}
