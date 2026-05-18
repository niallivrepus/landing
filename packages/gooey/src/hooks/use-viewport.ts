import * as React from "react";

export type GooeyViewport = "phone" | "tablet" | "desktop" | "wide";
export type GooeyViewportPreference = GooeyViewport | "auto";

export const GOOEY_VIEWPORT_BREAKPOINTS = {
  tabletMin: 600,
  desktopMin: 1024,
  wideMin: 1440,
} as const;

const VIEWPORT_MIN_WIDTHS = [
  GOOEY_VIEWPORT_BREAKPOINTS.wideMin,
  GOOEY_VIEWPORT_BREAKPOINTS.desktopMin,
  GOOEY_VIEWPORT_BREAKPOINTS.tabletMin,
] as const;

const GooeyViewportContext = React.createContext<GooeyViewport>("desktop");

function getViewportFromWindow(defaultViewport: GooeyViewport): GooeyViewport {
  if (typeof window === "undefined") {
    return defaultViewport;
  }

  return resolveViewportFromWidth(window.innerWidth);
}

export function resolveViewportFromWidth(width: number): GooeyViewport {
  if (width >= GOOEY_VIEWPORT_BREAKPOINTS.wideMin) return "wide";
  if (width >= GOOEY_VIEWPORT_BREAKPOINTS.desktopMin) return "desktop";
  if (width >= GOOEY_VIEWPORT_BREAKPOINTS.tabletMin) return "tablet";
  return "phone";
}

export function resolveGooeyViewport(
  viewport: GooeyViewportPreference = "auto",
  legacyIsDesktop?: boolean,
  autoViewport: GooeyViewport = "desktop",
): GooeyViewport {
  if (viewport !== "auto") {
    return viewport;
  }

  if (legacyIsDesktop !== undefined) {
    return legacyIsDesktop ? "desktop" : "phone";
  }

  return autoViewport;
}

type GooeyViewportProviderProps = {
  children: React.ReactNode;
  defaultViewport?: GooeyViewport;
};

export function GooeyViewportProvider({
  children,
  defaultViewport = "desktop",
}: GooeyViewportProviderProps) {
  const [resolvedViewport, setResolvedViewport] = React.useState<GooeyViewport>(
    () => getViewportFromWindow(defaultViewport),
  );

  React.useEffect(() => {
    const updateViewport = () => {
      setResolvedViewport(resolveViewportFromWidth(window.innerWidth));
    };

    updateViewport();

    const mediaListeners = VIEWPORT_MIN_WIDTHS.map((minWidth) => {
      const query = window.matchMedia(`(min-width: ${minWidth}px)`);
      const handler = () => updateViewport();

      if (query.addEventListener) {
        query.addEventListener("change", handler);
      } else {
        query.addListener(handler);
      }

      return {
        query,
        handler,
      };
    });

    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);

      mediaListeners.forEach(({ query, handler }) => {
        if (query.removeEventListener) {
          query.removeEventListener("change", handler);
        } else {
          query.removeListener(handler);
        }
      });
    };
  }, []);

  return React.createElement(
    GooeyViewportContext.Provider,
    { value: resolvedViewport },
    children,
  );
}

export function useCurrentGooeyViewport(): GooeyViewport {
  return React.useContext(GooeyViewportContext);
}

export function useGooeyViewport(
  viewport: GooeyViewportPreference = "auto",
  legacyIsDesktop?: boolean,
): GooeyViewport {
  const autoViewport = useCurrentGooeyViewport();

  return resolveGooeyViewport(viewport, legacyIsDesktop, autoViewport);
}
