export {
  GooeyViewportProvider,
  GOOEY_VIEWPORT_BREAKPOINTS,
  resolveGooeyViewport,
  resolveViewportFromWidth,
  useCurrentGooeyViewport,
  useGooeyViewport,
} from "../hooks/use-viewport";
export type {
  GooeyViewport,
  GooeyViewportPreference as GooeyViewportInput,
} from "../hooks/use-viewport";

export function getResponsiveWidthClass(
  viewport: import("../hooks/use-viewport").GooeyViewport,
  widths: Record<import("../hooks/use-viewport").GooeyViewport, string>,
): string {
  return widths[viewport] ?? widths.desktop;
}

export function isCompactViewport(
  viewport: import("../hooks/use-viewport").GooeyViewport,
): boolean {
  return viewport === "phone" || viewport === "tablet";
}
