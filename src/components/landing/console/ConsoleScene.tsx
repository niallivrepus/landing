import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ConsoleProduct, ConsoleProductId } from "../../../data/console-home-products";
import { ConsoleShaderScene } from "./ConsoleShaderScene";

/**
 * **Purpose:** The full-bleed "billboard" behind the console home. One layer per product, stacked; only the
 * focused layer is opaque. Layers mount on first focus (and stay mounted so focus-back crossfades without a
 * reload), the next/previous product's still is prefetched on idle, and video only streams for the focused
 * layer on fine-pointer screens without Save-Data / reduced motion.
 * Motion: ~600ms opacity crossfade, a slow Ken Burns drift on the focused layer (CSS), and a sprung pointer
 * parallax on the whole stack. Reduced motion keeps the crossfade only.
 * **Connects to:** `ConsoleHomeShell`, `ConsoleShaderScene`, `landing-console-home.css` (`.console-stage*`).
 */
export function ConsoleStage({
  products,
  activeId,
  reduceMotion,
  light,
}: {
  products: readonly ConsoleProduct[];
  activeId: ConsoleProductId;
  reduceMotion: boolean;
  light: boolean;
}) {
  const [mounted, setMounted] = useState<ReadonlySet<ConsoleProductId>>(() => new Set([activeId]));
  const allowVideo = useAllowVideo(reduceMotion);

  useEffect(() => {
    setMounted((prev) => (prev.has(activeId) ? prev : new Set(prev).add(activeId)));
  }, [activeId]);

  // Prefetch the neighbours' stills so arrowing feels instant without mounting every layer up front.
  useEffect(() => {
    const index = products.findIndex((p) => p.id === activeId);
    const neighbours = [products[index + 1], products[index - 1]].filter(Boolean) as ConsoleProduct[];
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => {
      for (const p of neighbours) {
        const src = p.scene.kind === "image" ? p.scene.src : p.scene.kind === "video" ? p.scene.poster : null;
        if (src) {
          const img = new Image();
          img.decoding = "async";
          img.src = src;
        }
      }
    });
    return () => cancel(handle as number);
  }, [activeId, products]);

  // Pointer parallax: ±14px on the scene, sprung so it trails the cursor like a camera on a gimbal.
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
              allowVideo={allowVideo}
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
  allowVideo,
}: {
  product: ConsoleProduct;
  active: boolean;
  reduceMotion: boolean;
  light: boolean;
  allowVideo: boolean;
}) {
  const { scene } = product;
  return (
    <div className="console-scene" data-active={active ? "true" : "false"} data-product={product.id}>
      <div className="console-scene__media">
        {scene.kind === "shader" ? (
          <ConsoleShaderScene palette={scene.palette} active={active} reduceMotion={reduceMotion} light={light} />
        ) : scene.kind === "video" && allowVideo ? (
          <SceneVideo src={scene.src} poster={scene.poster} position={scene.position} active={active} />
        ) : (
          <img
            src={scene.kind === "video" ? scene.poster : scene.src}
            alt=""
            decoding="async"
            fetchPriority={active ? "high" : "low"}
            className="console-scene__img"
            style={{ objectPosition: scene.position }}
          />
        )}
      </div>
    </div>
  );
}

function SceneVideo({
  src,
  poster,
  position,
  active,
}: {
  src: string;
  poster: string;
  position?: string;
  active: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active) {
      const play = video.play();
      if (play) play.catch(() => {});
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <>
      {/* The still paints first (and stays as the fallback); the video fades in over it once it can play. */}
      <img src={poster} alt="" decoding="async" className="console-scene__img" style={{ objectPosition: position }} />
      <video
        ref={ref}
        className="console-scene__video"
        data-ready={ready ? "true" : "false"}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay={active}
        preload={active ? "auto" : "none"}
        style={{ objectPosition: position }}
        onCanPlay={() => setReady(true)}
        disablePictureInPicture
      />
    </>
  );
}

type NetworkInformationLike = { saveData?: boolean; effectiveType?: string };

/** Video only on fine-pointer, ≥768px screens without Save-Data or reduced motion — phones get the still. */
function useAllowVideo(reduceMotion: boolean) {
  const [allow, setAllow] = useState(false);
  useEffect(() => {
    if (reduceMotion) {
      setAllow(false);
      return;
    }
    const query = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    const slow = Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? "");
    const update = () => setAllow(query.matches && !slow);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [reduceMotion]);
  return allow;
}
