import { motion, useMotionValue, useSpring, type MotionValue } from "motion/react";
import { useEffect, useState } from "react";
import type { ConsoleProduct, ConsoleProductId } from "../../../data/console-home-products";
import { ConsoleShaderScene } from "./ConsoleShaderScene";
import { preloadConsoleSurfaces } from "./surfaces/ConsoleSurfaces";

/**
 * **Purpose:** The full-bleed background behind the console home: one layer per product (hero art; OO = the live
 * homepage background with its shader orb blended on; Arcade = a shader scene), stacked, only the focused one opaque.
 * Layers mount on first focus and stay mounted so focus-back crossfades without a reload; neighbours' stills are
 * prefetched and every app-surface chunk is warmed on idle. Slow Ken Burns on the focused layer (CSS) + sprung
 * pointer parallax (`useConsoleParallax`). Reduced motion: crossfades only.
 * **Connects to:** `ConsoleHomeShell`, `ConsoleColumn` (the centred app column floats above), `ConsoleShaderScene`,
 * `landing-console-home.css` (`.console-stage*`).
 */
export function ConsoleStage({
  products,
  activeId,
  reduceMotion,
  light,
  parallax,
}: {
  products: readonly ConsoleProduct[];
  activeId: ConsoleProductId;
  reduceMotion: boolean;
  light: boolean;
  parallax: ConsoleParallax;
}) {
  const [mounted, setMounted] = useState<ReadonlySet<ConsoleProductId>>(() => new Set([activeId]));

  useEffect(() => {
    setMounted((prev) => (prev.has(activeId) ? prev : new Set(prev).add(activeId)));
  }, [activeId]);

  const activeIndex = products.findIndex((p) => p.id === activeId);

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

  return (
    <div className="console-stage" aria-hidden data-reduce-motion={reduceMotion ? "true" : undefined}>
      <motion.div className="console-stage__parallax" style={{ x: parallax.x, y: parallax.y }}>
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

export type ConsoleParallax = { x: MotionValue<number>; y: MotionValue<number> };

/**
 * Pointer parallax shared by the background (follows ±14px) and the app column (counter-drifts a little).
 * Fine pointers only; zero under reduced motion.
 */
export function useConsoleParallax(reduceMotion: boolean): ConsoleParallax {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 60, damping: 20, mass: 0.8 });
  const y = useSpring(py, { stiffness: 60, damping: 20, mass: 0.8 });

  useEffect(() => {
    if (reduceMotion) {
      px.set(0);
      py.set(0);
      return;
    }
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      px.set((event.clientX / window.innerWidth - 0.5) * -28);
      py.set((event.clientY / window.innerHeight - 0.5) * -18);
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

  return { x, y };
}
