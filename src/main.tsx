if (import.meta.env.PROD) {
  void import("./bootstrap-prod").then((m) => m.mount());
} else {
  void import("./bootstrap-dev").then((m) => m.mount());
}
