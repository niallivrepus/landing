import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { resolveWebAppOrigin } from "../../../../config/download-links";
import type { ConsoleAppDemoSurface, ConsoleProductId } from "../../../../data/console-home-products";

/**
 * **Purpose:** What the console home's centred app column shows for each non-OO product. Only the REAL app is ever
 * shown — never a landing re-drawing:
 * - **Capture (default):** a looping, muted recording of the real web app's `/demo?surface=…&chrome=0`, made by
 *   `scripts/capture-app-demo.mjs` into `/console/captures/` and listed in `/console/captures/manifest.json`.
 *   The poster shows first, the loop fades in over it; under reduced motion only the poster shows.
 * - **Fallback (temporary):** if a surface has no capture (or it fails to load), the column shows that product's
 *   landing demo (`SpineAppSurface`, `CallsAppSurface`, `MessagesAppSurface`, `ProfilePodsDemo`, the public Blurbs
 *   feed) so the column is never empty. Each fallback disappears as soon as its capture lands in the manifest.
 * - **Live (flag, off by default):** `VITE_CONSOLE_LIVE_DEMO=1` swaps captures for a non-interactive iframe of the
 *   app's `/demo` (origin from `VITE_ORIGIN_APP`).
 * - **Arcade:** the real bundled chess game (the same files the app ships), non-interactive here.
 * OO's column is the live homepage UI (prompt bar + temporary chat), rendered by `ConsoleHomeShell`.
 * **Connects to:** `ConsoleColumn`, `scripts/capture-app-demo.mjs`, `console-home-products.ts` (`appSurface`).
 */

export type ConsoleSurfaceProps = { playing: boolean; light: boolean };

/** Products whose column shows a scene surface. OO's column is the real homepage UI (`ConsoleHomeShell`). */
export type ConsoleSurfaceId = Exclude<ConsoleProductId, "oo">;

/**
 * One pluggable scene per product: swap `component` (capture, live embed, …) and the column follows. `width` is
 * the column width this scene wants (the capture viewport width) and `height` its aspect; the column clamps both
 * to the screen.
 * A component fills the column, stays non-interactive (the column marks it `inert`) and honours `playing`
 * (false off-focus, in a hidden tab and under reduced motion).
 */
export type ConsoleSurfaceDefinition = {
  component: ComponentType<ConsoleSurfaceProps>;
  width: number;
  /** With `width`, the scene's aspect — the column keeps it so the scene fills the frame uncropped. */
  height: number;
};

/** Capture viewport (CSS px) — keep in sync with `scripts/capture-app-demo.mjs` (`CAPTURE_VIEWPORT`). */
export const CONSOLE_CAPTURE_VIEWPORT = { width: 560, height: 640 } as const;

const LIVE_DEMO = (import.meta.env.VITE_CONSOLE_LIVE_DEMO as string | undefined) === "1";

/** Temporary landing-demo fallback for a surface with no capture yet (natural size, scaled into the column). */
type FallbackDefinition = {
  load: () => Promise<{ default: ComponentType<ConsoleSurfaceProps> }>;
  width: number;
  height: number;
};

function appSurfaceScene(surface: ConsoleAppDemoSurface, fallback: FallbackDefinition): ConsoleSurfaceDefinition {
  const Fallback = lazy(fallback.load);
  return {
    width: CONSOLE_CAPTURE_VIEWPORT.width,
    height: CONSOLE_CAPTURE_VIEWPORT.height,
    component: ({ playing, light }) =>
      LIVE_DEMO ? (
        <LiveDemoSurface surface={surface} light={light} />
      ) : (
        <CaptureSurface
          surface={surface}
          playing={playing}
          light={light}
          fallback={
            <SurfaceFrame width={fallback.width} height={fallback.height}>
              <Suspense fallback={null}>
                <div className="console-surface-content" style={{ minHeight: fallback.height }}>
                  <Fallback playing={playing} light={light} />
                </div>
              </Suspense>
            </SurfaceFrame>
          }
        />
      ),
  };
}

export const CONSOLE_SURFACES: Record<ConsoleSurfaceId, ConsoleSurfaceDefinition> = {
  spine: appSurfaceScene("spine", {
    width: 740,
    height: 600,
    load: () =>
      import("../../SpineImmersiveShell").then((m) => ({
        default: ({ playing }: ConsoleSurfaceProps) => <m.SpineAppSurface autoplay={playing} arrangement="split" />,
      })),
  }),
  calls: appSurfaceScene("calls", {
    width: 760,
    height: 540,
    load: () =>
      import("../../CallsImmersiveShell").then((m) => ({
        default: ({ playing }: ConsoleSurfaceProps) => (
          <m.CallsAppSurface autoplay={playing} paused={!playing} arrangement="split" />
        ),
      })),
  }),
  messages: appSurfaceScene("texts", {
    width: 460,
    height: 540,
    load: () =>
      import("../../MessagesImmersiveShell").then((m) => ({
        default: ({ playing }: ConsoleSurfaceProps) => <m.MessagesAppSurface autoplay={playing} />,
      })),
  }),
  profile: appSurfaceScene("id", {
    width: 640,
    height: 540,
    load: () =>
      import("../../ProfilePodsDemo").then((m) => ({
        default: ({ playing }: ConsoleSurfaceProps) => <m.ProfilePodsDemo paused={!playing} />,
      })),
  }),
  blurbs: appSurfaceScene("blurbs", {
    width: 460,
    height: 600,
    load: () => import("./BlurbsDriftSurface").then((m) => ({ default: m.BlurbsDriftSurface })),
  }),
  arcade: { width: 480, height: 600, component: ArcadeChessSurface },
};

export function ConsoleSurface({ id, playing, light }: { id: ConsoleSurfaceId; playing: boolean; light: boolean }) {
  const Surface = CONSOLE_SURFACES[id].component;
  return <Surface playing={playing} light={light} />;
}

// ─── Captures ────────────────────────────────────────────────────────────────

type CaptureFiles = { webm?: string; mp4?: string; poster?: string };
type CaptureManifest = {
  capturedAt?: string;
  surfaces: Partial<Record<ConsoleAppDemoSurface, { dark?: CaptureFiles; light?: CaptureFiles }>>;
};

const CAPTURE_MANIFEST_URL = "/console/captures/manifest.json";
let manifestPromise: Promise<CaptureManifest | null> | null = null;

/** Loads the capture manifest once; `null` when no captures have been made yet. */
function loadCaptureManifest(): Promise<CaptureManifest | null> {
  manifestPromise ??= fetch(CAPTURE_MANIFEST_URL, { headers: { Accept: "application/json" } })
    .then((response) => (response.ok ? (response.json() as Promise<CaptureManifest>) : null))
    .catch(() => null);
  return manifestPromise;
}

/** Warms the capture manifest (also kicked off as soon as this module loads, so posters can paint first). */
export function preloadConsoleSurfaces() {
  void loadCaptureManifest();
}

if (typeof window !== "undefined") void loadCaptureManifest();

/** `undefined` while the manifest loads, `null` when this surface has no capture. */
function useCaptureFiles(surface: ConsoleAppDemoSurface, light: boolean): CaptureFiles | null | undefined {
  const [files, setFiles] = useState<CaptureFiles | null | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    void loadCaptureManifest().then((manifest) => {
      if (cancelled) return;
      const entry = manifest?.surfaces[surface];
      // Theme-matched capture first, the other theme as a fallback.
      setFiles((light ? entry?.light ?? entry?.dark : entry?.dark ?? entry?.light) ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [light, surface]);
  return files;
}

function useReducedMotionPreference() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduce;
}

/** A real-app recording: poster first, then the muted loop while focused; the landing fallback if not captured. */
function CaptureSurface({
  surface,
  playing,
  light,
  fallback,
}: { surface: ConsoleAppDemoSurface; fallback: ReactNode } & ConsoleSurfaceProps) {
  const files = useCaptureFiles(surface, light);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotionPreference();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const hasVideo = Boolean(files?.webm || files?.mp4) && !reduceMotion;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) void video.play().catch(() => {});
    else video.pause();
  }, [playing, hasVideo]);

  // No capture yet (or it failed): the temporary landing demo, never an empty column.
  if (files === undefined) return null;
  if (!files || failed) return <>{fallback}</>;

  return (
    <div className="console-capture">
      {files.poster ? (
        <img
          className="console-capture__poster"
          src={files.poster}
          alt=""
          decoding="async"
          fetchPriority={playing ? "high" : "low"}
          onError={() => setFailed(true)}
        />
      ) : null}
      {hasVideo ? (
        <video
          ref={videoRef}
          className="console-capture__video"
          data-ready={videoReady ? "true" : "false"}
          poster={files.poster}
          muted
          loop
          playsInline
          preload="metadata"
          autoPlay={playing}
          disablePictureInPicture
          onCanPlay={() => setVideoReady(true)}
        >
          {files.webm ? <source src={files.webm} type="video/webm" /> : null}
          {files.mp4 ? <source src={files.mp4} type="video/mp4" /> : null}
        </video>
      ) : null}
    </div>
  );
}

/** Flagged path: the real app's `/demo`, live and non-interactive (`VITE_CONSOLE_LIVE_DEMO=1`). */
function LiveDemoSurface({ surface, light }: { surface: ConsoleAppDemoSurface; light: boolean }) {
  const src = `${resolveWebAppOrigin()}/demo?surface=${encodeURIComponent(surface)}&chrome=0&theme=${light ? "light" : "dark"}`;
  return (
    <iframe
      className="console-capture__frame"
      src={src}
      title={`Jokuh app demo: ${surface}`}
      tabIndex={-1}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}

// ─── Arcade ──────────────────────────────────────────────────────────────────

/** The real bundled Arcade chess (same files the app ships), unmodified. "Play chess" opens the playable overlay. */
function ArcadeChessSurface() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="console-arcade-window" data-ready={loaded ? "true" : "false"}>
      <iframe
        src="/arcade/games/chess/index.html"
        title="Jokuh Arcade chess"
        className="console-arcade-window__frame"
        tabIndex={-1}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

// ─── Fallback scaling ────────────────────────────────────────────────────────

/**
 * Scales a fallback surface to fit the column (never above 1×), centred. The natural height is the larger of the
 * declared height and the tallest measured so far, so autoplay beats that grow the content shrink the scale once.
 */
function SurfaceFrame({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const tallest = useRef(height);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return undefined;
    const measure = () => {
      if (box.clientWidth === 0 || box.clientHeight === 0) return;
      tallest.current = Math.max(tallest.current, inner.offsetHeight);
      setScale(Math.min(box.clientWidth / width, box.clientHeight / tallest.current, 1));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [height, width]);

  return (
    <div ref={boxRef} className="console-surface__box">
      <div
        ref={innerRef}
        className="console-surface__inner"
        style={{ width, minHeight: height, transform: `translate(-50%, -50%) scale(${scale})`, opacity: scale ? undefined : 0 }}
      >
        {children}
      </div>
    </div>
  );
}
