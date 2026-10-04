import { cn } from "@jokuh/gooey";
import { Gamepad2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ConsoleProduct, ConsoleProductId } from "../../../data/console-home-products";

/** Precise, never floaty: settles in ~280ms with a hair of overshoot. */
export const CONSOLE_TILE_SPRING = { type: "spring", stiffness: 560, damping: 38, mass: 0.85 } as const;

/** Hover intent delay so sweeping across the row doesn't strobe the billboard. */
const HOVER_FOCUS_DELAY_MS = 90;

export type ConsoleFocusSource = "keyboard" | "pointer" | "touch" | "scroll" | "program";

/**
 * **Purpose:** PS5-style product tile row. Squircle tiles with the product art; the focused tile grows
 * (sprung width/height so neighbours slide, nothing is scaled/blurred), gets a crisp focus ring and its label.
 * Input: ←/→/Home/End and Tab move focus (each tile is a real button), a moving mouse focuses after a short intent
 * delay (a parked cursor never steals focus from the keyboard), a click opens; on touch the row scrolls with snap — the first tap focuses, the second opens.
 * **Connects to:** `ConsoleHomeShell` (owns `activeId` + open actions), `landing-console-home.css` (`.console-tiles*`).
 */
export function ConsoleTileRow({
  products,
  activeId,
  onFocusProduct,
  onOpenProduct,
  hidden = false,
}: {
  products: readonly ConsoleProduct[];
  activeId: ConsoleProductId;
  onFocusProduct: (id: ConsoleProductId, source: ConsoleFocusSource) => void;
  onOpenProduct: (id: ConsoleProductId) => void;
  /** Collapses the row while the OO chat owns the stage. */
  hidden?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef(new Map<ConsoleProductId, HTMLButtonElement>());
  const hoverTimer = useRef<number | null>(null);
  const hoverTarget = useRef<ConsoleProductId | null>(null);
  const lastPointerPos = useRef<{ x: number; y: number } | null>(null);
  const lastPointerType = useRef<string>("mouse");
  /** Set on a touch press of an unfocused tile: that tap focuses, the next one opens. */
  const touchFocusOnly = useRef<ConsoleProductId | null>(null);
  const sizes = useTileSizes();

  const clearHover = () => {
    hoverTarget.current = null;
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };
  useEffect(() => clearHover, []);

  // Keep the focused tile in view inside the (mobile) scroller — measured after its size spring settles.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const scroller = scrollerRef.current;
      const tile = tileRefs.current.get(activeId);
      if (!scroller || !tile || scroller.scrollWidth <= scroller.clientWidth + 1) return;
      const item = tile.parentElement ?? tile;
      const left = item.offsetLeft;
      const right = left + Math.max(item.offsetWidth, sizes.active);
      const pad = 16;
      if (left - pad < scroller.scrollLeft) {
        scroller.scrollTo({ left: left - pad, behavior: "smooth" });
      } else if (right + pad > scroller.scrollLeft + scroller.clientWidth) {
        scroller.scrollTo({ left: right + pad - scroller.clientWidth, behavior: "smooth" });
      }
    }, 60);
    return () => window.clearTimeout(id);
  }, [activeId, sizes.active]);

  const focusIndex = useCallback(
    (index: number) => {
      const product = products[(index + products.length) % products.length];
      if (!product) return;
      clearHover();
      tileRefs.current.get(product.id)?.focus({ preventScroll: true });
      onFocusProduct(product.id, "keyboard");
    },
    [onFocusProduct, products],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = products.findIndex((p) => p.id === activeId);
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusIndex(Math.min(index + 1, products.length - 1));
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusIndex(Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        focusIndex(0);
        break;
      case "End":
        event.preventDefault();
        focusIndex(products.length - 1);
        break;
    }
  };

  return (
    <motion.nav
      aria-label="Jokuh products"
      className="console-tiles"
      initial={false}
      animate={hidden ? { opacity: 0, y: 24, height: 0 } : { opacity: 1, y: 0, height: "auto" }}
      transition={{ duration: hidden ? 0.18 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={hidden || undefined}
      inert={hidden || undefined}
    >
      <div ref={scrollerRef} className="console-tiles__scroller" onKeyDown={onKeyDown}>
        <ul className="console-tiles__list">
          {products.map((product) => {
            const isActive = product.id === activeId;
            return (
              <li key={product.id} className="console-tiles__item">
                <motion.button
                  ref={(node) => {
                    if (node) tileRefs.current.set(product.id, node);
                    else tileRefs.current.delete(product.id);
                  }}
                  type="button"
                  className={cn("console-tile", isActive && "is-active")}
                  data-product={product.id}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`${product.title}. ${product.sentence}`}
                  initial={false}
                  animate={isActive ? "active" : "rest"}
                  variants={{
                    rest: { width: sizes.rest, height: sizes.rest },
                    active: { width: sizes.active, height: sizes.active },
                  }}
                  transition={CONSOLE_TILE_SPRING}
                  whileTap={{ scale: 0.96 }}
                  onFocus={() => {
                    if (!isActive) onFocusProduct(product.id, lastPointerType.current === "touch" ? "touch" : "keyboard");
                  }}
                  onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
                    lastPointerType.current = event.pointerType;
                    touchFocusOnly.current = event.pointerType === "touch" && !isActive ? product.id : null;
                  }}
                  onPointerMove={(event: PointerEvent<HTMLButtonElement>) => {
                    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
                    // Only a pointer that actually moved may steal focus: tiles resizing under a parked cursor
                    // (while arrowing) must not hijack keyboard navigation.
                    const last = lastPointerPos.current;
                    if (last && last.x === event.clientX && last.y === event.clientY) return;
                    lastPointerPos.current = { x: event.clientX, y: event.clientY };
                    if (isActive || hoverTarget.current === product.id) return;
                    clearHover();
                    hoverTarget.current = product.id;
                    hoverTimer.current = window.setTimeout(() => {
                      hoverTimer.current = null;
                      hoverTarget.current = null;
                      onFocusProduct(product.id, "pointer");
                    }, HOVER_FOCUS_DELAY_MS);
                  }}
                  onPointerLeave={clearHover}
                  onClick={(event) => {
                    clearHover();
                    lastPointerType.current = "mouse";
                    // Keyboard Enter/Space (detail 0) and mouse clicks open; a touch tap on an unfocused tile focuses.
                    if (event.detail !== 0 && touchFocusOnly.current === product.id) {
                      touchFocusOnly.current = null;
                      onFocusProduct(product.id, "touch");
                      return;
                    }
                    if (!isActive) onFocusProduct(product.id, "pointer");
                    onOpenProduct(product.id);
                  }}
                >
                  <TileArt product={product} />
                </motion.button>
                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.span
                      key="label"
                      className="console-tile__label"
                      aria-hidden
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.08 } }}
                      transition={{ duration: 0.2, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {product.title}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
}

/** Tile edge in px: 64 → 88 on desktop, 56 → 72 on phones (matches `--console-tile*` in CSS). */
function useTileSizes() {
  const query = "(max-width: 639px)";
  const [compact, setCompact] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setCompact(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return compact ? { rest: 56, active: 72 } : { rest: 64, active: 88 };
}

function TileArt({ product }: { product: ConsoleProduct }) {
  if (product.tile) {
    return <img src={product.tile} alt="" draggable={false} decoding="async" className="console-tile__img" />;
  }
  if (product.id === "oo") {
    return (
      <span className="console-tile__paint console-tile__paint--oo" aria-hidden>
        <span className="console-tile__wordmark">OO</span>
      </span>
    );
  }
  return (
    <span className="console-tile__paint console-tile__paint--arcade" aria-hidden>
      <Gamepad2 className="console-tile__glyph" strokeWidth={1.75} />
    </span>
  );
}
