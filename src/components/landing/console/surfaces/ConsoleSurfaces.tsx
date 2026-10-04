import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import type { ConsoleProductId } from "../../../../data/console-home-products";
import { SquircleBox } from "../../../system/squircle";

/**
 * **Purpose:** Live app surfaces for the console home — the product's real landing demo (the same components
 * `/spine`, `/messages`, `/calls`, `/profile`, `/blurbs` render) floating over the scene background in a squircle
 * window like the app's center column (Gooey rim, soft shadow), scaled to fit the scene box.
 * Each surface is its own lazy chunk; `ConsoleStage` mounts only the focused one, the next neighbour (paused) and
 * the one fading out, and warms every chunk on idle (`preloadConsoleSurfaces`) so the window never shows empty.
 * `playing` drives each surface's autoplay loop; it is false off-focus and under reduced motion (static first frame).
 * **Connects to:** `ConsoleScene.tsx` (`ConsoleStage`), `SpineAppSurface`, `CallsAppSurface`, `MessagesAppSurface`,
 * `ProfilePodsDemo`, `BlurbsDriftSurface`, `OoDemoSurface`, the bundled arcade chess, `SquircleBox`.
 */

/** Every scene surface gets: whether it should be playing its loop right now, and the resolved theme. */
export type ConsoleSurfaceProps = { playing: boolean; light: boolean };

/**
 * One pluggable scene per product. To swap a surface (a live web-app embed, a recorded real-app video, …) replace
 * that entry's `load` and natural size — `ConsoleStage`, mounting, crossfades, the window and scaling don't change.
 * A component must render inside its `width × height` box (the window adds its own padding), stay non-interactive
 * (the stage marks it `inert`) and honour `playing` (false off-focus, in a hidden tab and under reduced motion).
 */
export type ConsoleSurfaceDefinition = {
  load: () => Promise<{ default: ComponentType<ConsoleSurfaceProps> }>;
  /** Natural (unscaled) content size in CSS px. */
  width: number;
  height: number;
};

/** Window chrome around the content: padding inside the squircle, and its corner radius (app column = 44). */
const WINDOW_PAD = 20;
const WINDOW_RADIUS = 48;

function once<T>(fn: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | null = null;
  return () => (promise ??= fn());
}

export const CONSOLE_SURFACES: Record<ConsoleProductId, ConsoleSurfaceDefinition> = {
  oo: {
    width: 420,
    height: 500,
    load: once(() => import("./OoDemoSurface").then((m) => ({ default: m.OoDemoSurface }))),
  },
  spine: {
    width: 740,
    height: 600,
    load: once(() =>
      import("../../SpineImmersiveShell").then((m) => ({
        default: ({ playing }: ConsoleSurfaceProps) => <m.SpineAppSurface autoplay={playing} arrangement="split" />,
      })),
    ),
  },
  calls: {
    width: 760,
    height: 540,
    load: once(() =>
      import("../../CallsImmersiveShell").then((m) => ({
        default: ({ playing }: ConsoleSurfaceProps) => (
          <m.CallsAppSurface autoplay={playing} paused={!playing} arrangement="split" />
        ),
      })),
    ),
  },
  messages: {
    width: 460,
    height: 540,
    load: once(() =>
      import("../../MessagesImmersiveShell").then((m) => ({
        default: ({ playing }: ConsoleSurfaceProps) => <m.MessagesAppSurface autoplay={playing} />,
      })),
    ),
  },
  profile: {
    width: 640,
    height: 540,
    load: once(() =>
      import("../../ProfilePodsDemo").then((m) => ({
        default: ({ playing }: ConsoleSurfaceProps) => <m.ProfilePodsDemo paused={!playing} />,
      })),
    ),
  },
  blurbs: {
    width: 460,
    height: 600,
    load: once(() => import("./BlurbsDriftSurface").then((m) => ({ default: m.BlurbsDriftSurface }))),
  },
  arcade: {
    width: 420,
    height: 580,
    load: once(async () => ({ default: ArcadeChessSurface })),
  },
};

const LAZY_SURFACES = Object.fromEntries(
  (Object.keys(CONSOLE_SURFACES) as ConsoleProductId[]).map((id) => [id, lazy(CONSOLE_SURFACES[id].load)]),
) as unknown as Record<ConsoleProductId, ComponentType<ConsoleSurfaceProps>>;

/** Warms every surface chunk (call on idle after first paint). */
export function preloadConsoleSurfaces() {
  for (const definition of Object.values(CONSOLE_SURFACES)) void definition.load().catch(() => {});
}

export function ConsoleSurface({ id, playing, light }: { id: ConsoleProductId; playing: boolean; light: boolean }) {
  const { width, height } = CONSOLE_SURFACES[id];
  const Surface = LAZY_SURFACES[id];
  return (
    <SurfaceFrame width={width + WINDOW_PAD * 2} height={height + WINDOW_PAD * 2}>
      <SquircleBox
        radius={WINDOW_RADIUS}
        className="console-window"
        fillClassName="console-window__fill"
        rimClassName="console-window__rim"
        shadowClassName="console-window__shadow"
        fillStyle={{ padding: WINDOW_PAD }}
      >
        {/* The window paints immediately; content fades in when its (pre-warmed) chunk resolves. */}
        <Suspense fallback={null}>
          <div className="console-window__content" style={{ minHeight: height }}>
            <Surface playing={playing} light={light} />
          </div>
        </Suspense>
      </SquircleBox>
    </SurfaceFrame>
  );
}

/**
 * Scales the window to fit its scene box (never above 1×), centred. The natural height is the larger of the
 * declared height and the tallest measured so far, so autoplay beats that grow the content shrink the scale once
 * instead of making it pump. Measures with `client*` sizes, which ignore the entrance transform.
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

/** Dark chrome for the bundled chess page (its board canvas keeps its own light wood palette). */
const CHESS_DARK_CSS = `
html.jk-dark, html.jk-dark body { background: #0b0b0d !important; color: rgba(255,255,255,.9) !important; }
html.jk-dark .player-row { border-color: rgba(255,255,255,.1) !important; }
html.jk-dark .player-row.active { background: rgba(255,255,255,.06) !important; border-color: rgba(255,255,255,.22) !important; }
html.jk-dark .player-row .avatar.you { background: rgba(255,255,255,.12) !important; }
html.jk-dark #oo-quip { color: rgba(255,255,255,.55) !important; }
html.jk-dark .thinking i { background: #fff !important; }
html.jk-dark canvas { box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 12px 32px rgba(0,0,0,.5) !important; }
`;

/**
 * The real bundled Arcade chess (same files the app ships), shown in the window. Same-origin, so the console
 * injects a small dark stylesheet into its chrome when the site is dark. Not interactive here — "Play chess" opens
 * the playable overlay.
 */
function ArcadeChessSurface({ light }: ConsoleSurfaceProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const doc = frameRef.current?.contentDocument;
    if (!loaded || !doc?.head) return;
    if (!doc.getElementById("jk-console-theme")) {
      const style = doc.createElement("style");
      style.id = "jk-console-theme";
      style.textContent = CHESS_DARK_CSS;
      doc.head.appendChild(style);
    }
    doc.documentElement.classList.toggle("jk-dark", !light);
  }, [light, loaded]);

  return (
    <div className="console-arcade-window" data-ready={loaded ? "true" : "false"}>
      <iframe
        ref={frameRef}
        src="/arcade/games/chess/index.html"
        title="Jokuh Arcade chess"
        className="console-arcade-window__frame"
        tabIndex={-1}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
