import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ConsoleProduct, ConsoleProductId } from "../../../data/console-home-products";
import { ConsoleShaderScene } from "./ConsoleShaderScene";
import { ConsoleSurface, preloadConsoleSurfaces } from "./surfaces/ConsoleSurfaces";

/** Matches `--console-fade` in CSS: how long a leaving surface stays mounted while it fades. */
const SURFACE_FADE_MS = 700;

/**
 * **Purpose:** The full-bleed "billboard" behind the console home, in two depths:
 * 1. Background: one full-bleed layer per product (hero art; OO = the homepage background + shader orb; Arcade = a
 *    shader scene), stacked, only the focused one
 *    opaque. Mounted on first focus and kept so focus-back crossfades without a reload; neighbours' stills are
 *    prefetched on idle. Slow Ken Burns on the focused layer (CSS) + sprung pointer parallax.
 * 2. The live app surface (`ConsoleSurface`): the product's real landing demo, autoplaying, floating over the
 *    background in a squircle window like the app's center column (counter-parallax for depth). Only the focused
 *    surface, the next neighbour (paused) and the one fading out are mounted; all chunks are warmed on idle.
 * Reduced motion: crossfades only — no drift, no parallax, surfaces render their static first frame.
 * **Connects to:** `ConsoleHomeShell`, `ConsoleShaderScene`, `surfaces/ConsoleSurfaces.tsx`,
 * `landing-console-home.css` (`.console-stage*`, `.console-surface*`).
 */
export function ConsoleStage({
  products,
  activeId,
  reduceMotion,
  light,
  surfacesHidden = false,
}: {
  products: readonly ConsoleProduct[];
  activeId: ConsoleProductId;
  reduceMotion: boolean;
  light: boolean;
  /** Fade + pause the live surfaces (the real OO temp chat owns the stage while it's open). */
  surfacesHidden?: boolean;
}) {
  const [mounted, setMounted] = useState<ReadonlySet<ConsoleProductId>>(() => new Set([activeId]));
  const [leaving, setLeaving] = useState<ConsoleProductId | null>(null);
  const previousActive = useRef(activeId);

  useEffect(() => {
    setMounted((prev) => (prev.has(activeId) ? prev : new Set(prev).add(activeId)));
    if (previousActive.current === activeId) return undefined;
    setLeaving(previousActive.current);
    previousActive.current = activeId;
    const id = window.setTimeout(() => setLeaving(null), SURFACE_FADE_MS);
    return () => window.clearTimeout(id);
  }, [activeId]);

  const activeIndex = products.findIndex((p) => p.id === activeId);
  const nextId = products[activeIndex + 1]?.id ?? null;
  const surfaceIds = products
    .map((p) => p.id)
    .filter((id) => id === activeId || id === nextId || id === leaving);

  // After first paint, warm every surface chunk on idle so a focus change never waits on a network round trip.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => preloadConsoleSurfaces());
    return () => cancel(handle as number);
  }, []);

  // Prefetch the neighbours' stills so arrowing feels instant without mounting every layer up front.
  useEffect(() => {
    const neighbours = [products[activeIndex + 1], products[activeIndex - 1]].filter(Boolean) as ConsoleProduct[];
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => {
      for (const p of neighbours) {
        if (p.scene.kind !== "image") continue;
        const img = new Image();
        img.decoding = "async";
        img.src = p.scene.src;
      }
    });
    return () => cancel(handle as number);
  }, [activeIndex, products]);

  // Pointer parallax: ±14px on the background; the surface window counter-drifts (below).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 60, damping: 20, mass: 0.8 });
  const y = useSpring(py, { stiffness: 60, damping: 20, mass: 0.8 });
  // The floating app window drifts the other way, a little: depth without making it hard to read.
  const sx = useTransform(x, (v) => v * -0.3);
  const sy = useTransform(y, (v) => v * -0.3);

  useEffect(() => {
    if (reduceMotion) {
      px.set(0);
      py.set(0);
      return;
    }
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      px.set(nx * -28);
      py.set(ny * -18);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [px, py, reduceMotion]);

  return (
    <div className="console-stage" aria-hidden data-reduce-motion={reduceMotion ? "true" : undefined}>
      <motion.div className="console-stage__parallax" style={{ x, y }}>
        {products.map((product) =>
          mounted.has(product.id) ? (
            <SceneLayer
              key={product.id}
              product={product}
              active={product.id === activeId}
              reduceMotion={reduceMotion}
              light={light}
            />
          ) : null,
        )}
      </motion.div>
      <div className="console-stage__scrim" />

      {/* Live app surfaces: decorative here (inert) — "Open" / Enter goes to the real page. */}
      <motion.div
        className="console-surfaces"
        data-hidden={surfacesHidden ? "true" : undefined}
        style={{ x: sx, y: sy }}
        inert
      >
        {surfaceIds.map((id) => (
          <div key={id} className="console-surface" data-active={id === activeId ? "true" : "false"} data-product={id}>
            <ConsoleSurface id={id} playing={id === activeId && !reduceMotion && !surfacesHidden} light={light} />
          </div>
        ))}
      </motion.div>

      <div className="console-stage__grain landing-grain" />
    </div>
  );
}

function SceneLayer({
  product,
  active,
  reduceMotion,
  light,
}: {
  product: ConsoleProduct;
  active: boolean;
  reduceMotion: boolean;
  light: boolean;
}) {
  const { scene } = product;
  return (
    <div className="console-scene" data-active={active ? "true" : "false"} data-product={product.id}>
      <div className="console-scene__media">
        {scene.kind === "shader" ? (
          <ConsoleShaderScene palette={scene.palette} active={active} reduceMotion={reduceMotion} light={light} />
        ) : (
          <>
            <img
              src={scene.src}
              alt=""
              decoding="async"
              fetchPriority={active ? "high" : "low"}
              className="console-scene__img"
              style={{ objectPosition: scene.position }}
            />
            {scene.overlay ? (
              <div className="console-scene__overlay">
                <ConsoleShaderScene palette={scene.overlay} active={active} reduceMotion={reduceMotion} light={light} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
