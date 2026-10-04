import { lazy, Suspense, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import type { ConsoleProductId } from "../../../../data/console-home-products";

/**
 * **Purpose:** Live app surfaces behind the console home title block — the product's real landing demo (the same
 * components `/spine`, `/messages`, `/calls`, `/profile`, `/blurbs` render), framed like the app's center column
 * and scaled to fit the scene. Each surface is its own lazy chunk; `ConsoleStage` mounts only the focused one, the
 * next neighbour (paused, preloaded) and the one fading out.
 * `playing` drives each surface's autoplay loop; it is false off-focus and under reduced motion (static first frame).
 * **Connects to:** `ConsoleScene.tsx` (`ConsoleStage`), `SpineAppSurface`, `CallsAppSurface`, `MessagesAppSurface`,
 * `ProfilePodsDemo`, `BlurbsDriftSurface`, `OoDemoSurface`, the bundled arcade chess.
 */

/** Every scene surface gets one prop: whether it should be playing its loop right now. */
export type ConsoleSurfaceProps = { playing: boolean };

/**
 * One pluggable scene per product. To swap a surface (a live web-app embed, a recorded real-app video, …) replace
 * that entry's `component` and natural size — `ConsoleStage`, mounting, crossfades, scaling and the title block
 * don't change. A component must render inside its `width × height` box, stay non-interactive (the stage marks it
 * `inert`) and honour `playing` (false off-focus, in a hidden tab, and under reduced motion).
 */
export type ConsoleSurfaceDefinition = {
  component: ComponentType<ConsoleSurfaceProps>;
  /** Natural (unscaled) frame size in CSS px; the stage scales it to fit the scene box. */
  width: number;
  height: number;
};

type SurfaceProps = ConsoleSurfaceProps;

const SURFACES: Record<ConsoleProductId, ComponentType<SurfaceProps>> = {
  oo: lazy(() => import("./OoDemoSurface").then((m) => ({ default: m.OoDemoSurface }))),
  spine: lazy(() =>
    import("../../SpineImmersiveShell").then((m) => ({
      default: ({ playing }: SurfaceProps) => (
        <div className="flex w-full">
          <m.SpineAppSurface autoplay={playing} arrangement="split" />
        </div>
      ),
    })),
  ),
  calls: lazy(() =>
    import("../../CallsImmersiveShell").then((m) => ({
      default: ({ playing }: SurfaceProps) => (
        <div className="flex w-full">
          <m.CallsAppSurface autoplay={playing} paused={!playing} arrangement="split" />
        </div>
      ),
    })),
  ),
  messages: lazy(() =>
    import("../../MessagesImmersiveShell").then((m) => ({
      default: ({ playing }: SurfaceProps) => <m.MessagesAppSurface autoplay={playing} />,
    })),
  ),
  profile: lazy(() =>
    import("../../ProfilePodsDemo").then((m) => ({
      default: ({ playing }: SurfaceProps) => <m.ProfilePodsDemo paused={!playing} />,
    })),
  ),
  blurbs: lazy(() => import("./BlurbsDriftSurface").then((m) => ({ default: m.BlurbsDriftSurface }))),
  arcade: lazy(async () => ({
    default: () => (
      <div className="console-arcade-window">
        <iframe
          src="/arcade/games/chess/index.html"
          title="Jokuh Arcade chess"
          className="console-arcade-window__frame"
          tabIndex={-1}
          loading="lazy"
        />
      </div>
    ),
  })),
};


const SURFACE_SIZE: Record<ConsoleProductId, { width: number; height: number }> = {
  oo: { width: 440, height: 520 },
  spine: { width: 760, height: 620 },
  calls: { width: 780, height: 560 },
  messages: { width: 500, height: 560 },
  profile: { width: 660, height: 560 },
  blurbs: { width: 480, height: 640 },
  arcade: { width: 440, height: 600 },
};

export const CONSOLE_SURFACES: Record<ConsoleProductId, ConsoleSurfaceDefinition> = Object.fromEntries(
  (Object.keys(SURFACES) as ConsoleProductId[]).map((id) => [id, { component: SURFACES[id], ...SURFACE_SIZE[id] }]),
) as Record<ConsoleProductId, ConsoleSurfaceDefinition>;

export function ConsoleSurface({ id, playing }: { id: ConsoleProductId; playing: boolean }) {
  const { component: Surface, width, height } = CONSOLE_SURFACES[id];
  return (
    <SurfaceFrame width={width} height={height}>
      <Suspense fallback={null}>
        <Surface playing={playing} />
      </Suspense>
    </SurfaceFrame>
  );
}

/**
 * Scales a surface to fit its scene box (never above 1.1×), centred. The surface's natural height is the larger of
 * its declared height and the tallest it has measured so far, so autoplay beats that grow the content shrink the
 * scale once instead of making it pump up and down.
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
      const rect = box.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      tallest.current = Math.max(tallest.current, inner.offsetHeight);
      setScale(Math.min(rect.width / width, rect.height / tallest.current, 1.1));
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
