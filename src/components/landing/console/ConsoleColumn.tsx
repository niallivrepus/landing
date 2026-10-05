import { motion, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { ConsoleProduct, ConsoleProductId } from "../../../data/console-home-products";
import { SquircleBox } from "../../system/squircle";
import type { ConsoleParallax } from "./ConsoleScene";
import { CONSOLE_SURFACES, ConsoleSurface, type ConsoleSurfaceId } from "./surfaces/ConsoleSurfaces";

/** App center-column geometry: corner radius (`SquircleShell` 44 in the app). */
const COLUMN_RADIUS = 44;
/** OO has no frame (it floats like the live homepage); this is just its content width. */
const OO_COLUMN_WIDTH = 680;
/** How long a leaving surface stays mounted while it fades (matches `.console-column__layer` CSS). */
const LEAVE_MS = 420;

const WIDTH_SPRING = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 } as const;

/**
 * **Purpose:** The hero of the console home — the app's squircle center column, centred in the viewport so the four
 * corner pills and the Nexus frame it exactly like the real app shell. Framed scenes keep their capture's aspect;
 * OO is frameless (it floats over the background like the live homepage). It morphs width per product (spring) and
 * crossfades its content: OO = the live homepage UI (`ooContent`: headline, prompt bar, chips, temporary chat in
 * place); every other product = its real-app scene (`ConsoleSurface`: a capture of the app's `/demo`, or the
 * real chess game), inert and playing only while focused.
 * Glass fill (backdrop blur) over the scene background, Gooey rim, soft shadow, a small counter-parallax.
 * Mounted surfaces: the focused one, the next neighbour (paused) and the one fading out; OO's UI stays mounted so
 * its chat survives focus changes.
 * **Connects to:** `ConsoleHomeShell`, `surfaces/ConsoleSurfaces.tsx`, `SquircleBox`, `landing-console-home.css`
 * (`.console-column*`). **Parity:** app `RootChrome` center column / landing `ImmersiveCenterColumn`.
 */
export function ConsoleColumn({
  products,
  activeId,
  reduceMotion,
  light,
  parallax,
  ooContent,
}: {
  products: readonly ConsoleProduct[];
  activeId: ConsoleProductId;
  reduceMotion: boolean;
  light: boolean;
  parallax: ConsoleParallax;
  ooContent: ReactNode;
}) {
  const viewportWidth = useViewportWidth();
  const wrapRef = useRef<HTMLDivElement>(null);
  const wrapHeight = useElementHeight(wrapRef);
  const [leaving, setLeaving] = useState<ConsoleProductId | null>(null);
  const previous = useRef(activeId);

  useEffect(() => {
    if (previous.current === activeId) return undefined;
    setLeaving(previous.current);
    previous.current = activeId;
    const id = window.setTimeout(() => setLeaving(null), LEAVE_MS);
    return () => window.clearTimeout(id);
  }, [activeId]);

  const maxWidth = viewportWidth < 640 ? viewportWidth - 32 : Math.min(viewportWidth - 208, 960);
  // Framed scenes keep the capture's aspect, so the real-app recording fills the column without cropping.
  const sceneWidth = activeId === "oo" ? OO_COLUMN_WIDTH : CONSOLE_SURFACES[activeId].width;
  const aspect = activeId === "oo" ? null : CONSOLE_SURFACES[activeId].width / CONSOLE_SURFACES[activeId].height;
  const naturalWidth = aspect && wrapHeight > 0 ? Math.min(sceneWidth, wrapHeight * aspect) : sceneWidth;
  const width = Math.max(260, Math.min(naturalWidth, maxWidth));

  const activeIndex = products.findIndex((p) => p.id === activeId);
  const nextId = products[activeIndex + 1]?.id ?? null;
  const surfaceIds = products
    .map((p) => p.id)
    .filter((id): id is ConsoleSurfaceId => id !== "oo" && (id === activeId || id === nextId || id === leaving));

  // Counter-parallax: the column drifts a fraction the other way from the background.
  const cx = useTransform(parallax.x, (v) => v * -0.22);
  const cy = useTransform(parallax.y, (v) => v * -0.22);

  return (
    <div ref={wrapRef} className="console-column-wrap">
      <motion.div
        className="console-column"
        data-frameless={activeId === "oo" ? "true" : undefined}
        initial={false}
        animate={{ width }}
        transition={reduceMotion ? { duration: 0 } : WIDTH_SPRING}
        style={{ x: cx, y: cy }}
      >
        <SquircleBox
          radius={COLUMN_RADIUS}
          className="console-column__window"
          fillClassName="console-column__fill"
          rimClassName="console-column__rim"
          shadowClassName="console-column__shadow"
        >
          <div
            className="console-column__layer console-column__layer--oo"
            data-active={activeId === "oo" ? "true" : "false"}
            aria-hidden={activeId !== "oo" || undefined}
            inert={activeId !== "oo" || undefined}
          >
            {ooContent}
          </div>
          {surfaceIds.map((id) => (
            <div
              key={id}
              className="console-column__layer console-column__layer--scene"
              data-active={id === activeId ? "true" : "false"}
              data-product={id}
              aria-hidden
              inert
            >
              <ConsoleSurface id={id} playing={id === activeId && !reduceMotion} light={light} />
            </div>
          ))}
        </SquircleBox>
      </motion.div>
    </div>
  );
}

function useElementHeight(ref: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const measure = () => setHeight(node.clientHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return height;
}

function useViewportWidth() {
  const [width, setWidth] = useState(() => (typeof window === "undefined" ? 1440 : window.innerWidth));
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}
