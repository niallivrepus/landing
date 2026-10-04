import { cn } from "@jokuh/gooey";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { PodFace, PodTile, ProfileHero, ProfileMeta, type PodId, type PodSize } from "./ProfilePodsDemoPods";

/**
 * **Purpose:** `/profile` demo of the profile pod bento, built to the app's real geometry: the fixed 9-slot board
 * (150 unit, 6 gap, 618×462) with the profile hero in the 2×2 center, three slots left, three right, two below, and
 * companions sized small / h2 / vtall exactly as the app allows. Pods fly in scattered and tilted, snap into their slots,
 * then every few seconds the board re-arranges into another legal app layout (bricks move, resize, swap in and out).
 * Phone / narrow column: the app's stack fallback — hero on top, companions in a 2-column grid — reshuffled now and then.
 * Pauses while hovered, off screen or in a hidden tab; static under reduced motion.
 * **Connects to:** `ProfileImmersiveShell`, `ProfilePodsDemoPods.tsx` (hero + pod faces), `landing-profile-pods-demo.css`.
 * **Parity (web app):** `frontend/src/components/pods/ProfilePodBentoGrid.tsx` + `utils/profile-pod-bento-layout.ts`
 * (`ProfilePodBentoMetrics`, `ProfilePodBentoSlots`); Swift `Sources/pods/profile-pod-bento-grid.swift`.
 */

// ─── App bento geometry (`ProfilePodBentoMetrics` / `ProfilePodBentoSlots`) ──────────────────────

const UNIT = 150;
const GAP = 6;
const BOARD_W = UNIT * 4 + GAP * 3; // 618
/** Smallest tile before the app falls back to the phone stack (`sideTileMinWidth`). */
const SIDE_TILE_MIN = 116;
const MIN_BOARD_W = SIDE_TILE_MIN * 4 + GAP * 3; // 482
/** App `wideMinWidth` media gate. */
const WIDE_QUERY = "(min-width: 640px)";

type Rect = { x: number; y: number; w: number; h: number };
type Geometry = { unit: number; gap: number; totalW: number; totalH: number };

/** App `computeGeometry`: exact 150² tiles when the column allows, scaled down to the 116 floor, else null (stack). */
function computeGeometry(width: number): Geometry | null {
  if (width < MIN_BOARD_W) return null;
  const scale = Math.min(1, width / BOARD_W);
  const unit = UNIT * scale;
  const gap = GAP * scale;
  return { unit, gap, totalW: unit * 4 + gap * 3, totalH: unit * 3 + gap * 2 };
}

/** (col, row) of slots 0–7: L0 L1 L2 · B0 B1 · R0 R1 R2 (bottom band = 2, 3, 4, 7). */
const SLOT_POS: Array<{ col: number; row: number }> = [
  { col: 0, row: 0 },
  { col: 0, row: 1 },
  { col: 0, row: 2 },
  { col: 1, row: 2 },
  { col: 2, row: 2 },
  { col: 3, row: 0 },
  { col: 3, row: 1 },
  { col: 3, row: 2 },
];

/** Slot group for a (size, anchor) pair — only the app's legal combinations (`ProfilePodBentoSlots.slots`). */
function slotGroup(size: PodSize, anchor: number): number[] {
  switch (size) {
    case "small":
      return [anchor];
    case "h2":
      return anchor === 2 ? [2, 3] : anchor === 3 ? [3, 4] : [4, 7];
    case "h4":
      return [2, 3, 4, 7];
    case "v2":
      return anchor === 0 ? [0, 1] : anchor === 1 ? [1, 2] : anchor === 5 ? [5, 6] : [6, 7];
    case "vtall":
      return anchor === 0 ? [0, 1, 2] : [5, 6, 7];
  }
}

function slotRect(geo: Geometry, slot: number): Rect {
  const { col, row } = SLOT_POS[slot];
  const step = geo.unit + geo.gap;
  return { x: col * step, y: row * step, w: geo.unit, h: geo.unit };
}

function groupRect(geo: Geometry, size: PodSize, anchor: number): Rect {
  const rects = slotGroup(size, anchor).map((s) => slotRect(geo, s));
  const x = Math.min(...rects.map((r) => r.x));
  const y = Math.min(...rects.map((r) => r.y));
  return {
    x,
    y,
    w: Math.max(...rects.map((r) => r.x + r.w)) - x,
    h: Math.max(...rects.map((r) => r.y + r.h)) - y,
  };
}

// ─── Layouts ───────────────────────────────────────────────────────────────

type Placement = { size: PodSize; anchor: number };
type WideLayout = Partial<Record<PodId, Placement>>;

/**
 * Three legal app boards (valid anchors, no overlaps, 8 slots). Spine moves between the left and right column at its
 * default `vtall` or shrinks to the small Book tile, Page sits in the bottom band as an `h2`, smalls swap places, and
 * pods without room leave the board until the next layout — like pulling a brick and clicking in another.
 */
const WIDE_LAYOUTS: WideLayout[] = [
  {
    music: { size: "small", anchor: 0 },
    location: { size: "small", anchor: 1 },
    page: { size: "h2", anchor: 2 },
    bubble: { size: "small", anchor: 4 },
    gallery: { size: "small", anchor: 5 },
    blurbs: { size: "small", anchor: 6 },
    spine: { size: "small", anchor: 7 },
  },
  {
    spine: { size: "vtall", anchor: 0 },
    page: { size: "h2", anchor: 3 },
    music: { size: "small", anchor: 5 },
    gallery: { size: "small", anchor: 6 },
    location: { size: "small", anchor: 7 },
  },
  {
    gallery: { size: "small", anchor: 0 },
    blurbs: { size: "small", anchor: 1 },
    music: { size: "small", anchor: 2 },
    location: { size: "small", anchor: 3 },
    bubble: { size: "small", anchor: 4 },
    spine: { size: "vtall", anchor: 5 },
  },
];

/** Phone stack orders (Page spans both columns; smalls pair up). Page always starts a row so the grid never has holes. */
const NARROW_ORDERS: PodId[][] = [
  ["music", "gallery", "page", "location", "spine", "blurbs", "bubble"],
  ["page", "gallery", "location", "spine", "music", "bubble", "blurbs"],
  ["blurbs", "bubble", "location", "music", "page", "gallery", "spine"],
];

const NARROW_SIZE: Record<PodId, PodSize> = {
  music: "small",
  gallery: "small",
  location: "small",
  spine: "small",
  blurbs: "small",
  bubble: "small",
  page: "h2",
};

/** App narrow-stack fixed cell heights (148 / 200 / 260). */
function narrowHeight(size: PodSize): number {
  return size === "vtall" ? 260 : size === "v2" ? 200 : 148;
}

const POD_ORDER: PodId[] = ["music", "location", "page", "bubble", "gallery", "blurbs", "spine"];
const SHUFFLE_MS = 3200;
const NARROW_SHUFFLE_MS = 4800;

/** Where each pod starts before it snaps in — scattered and tilted, like loose bricks. */
const SCATTER: Record<PodId, { x: number; y: number; rotate: number }> = {
  music: { x: -70, y: -50, rotate: -11 },
  location: { x: -110, y: 20, rotate: 9 },
  page: { x: -40, y: 90, rotate: -6 },
  bubble: { x: 60, y: 110, rotate: 12 },
  gallery: { x: 100, y: -60, rotate: 10 },
  blurbs: { x: 130, y: 10, rotate: -12 },
  spine: { x: 90, y: 80, rotate: 7 },
};

const SNAP_SPRING = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.9 };
const HERO_EASE = [0.22, 1, 0.36, 1] as const;

// ─── Hooks ─────────────────────────────────────────────────────────────────

function useWideViewport() {
  const [wide, setWide] = useState(() => (typeof window === "undefined" ? true : window.matchMedia(WIDE_QUERY).matches));
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const onChange = () => setWide(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return wide;
}

/** Container width, measured before first paint so desktop mounts the board directly (app `measureBoardWidth`). */
function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const measure = () => setWidth(node.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

/** True while the demo is on screen — no point shuffling a board nobody sees. */
function useOnScreen(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

function useCycle(count: number, intervalMs: number, running: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, intervalMs, running]);
  return index;
}

/** True for the first ~1.2 s after mount: the staggered fly-in only plays once; later re-entries snap in quickly. */
function useIntroWindow() {
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setIntro(false), 1200);
    return () => window.clearTimeout(id);
  }, []);
  return intro;
}

// ─── Wide board ────────────────────────────────────────────────────────────

function WideBoard({
  geo,
  layout,
  animate,
  reduceMotion,
}: {
  geo: Geometry;
  layout: WideLayout;
  animate: boolean;
  reduceMotion: boolean;
}) {
  const intro = useIntroWindow();
  const heroSize = geo.unit * 2 + geo.gap;

  return (
    <div className="profile-pods-demo__board" style={{ width: geo.totalW, height: geo.totalH }}>
      {/* Profile hero — the fixed, untouched center anchor (2×2 units). */}
      <motion.div
        className="profile-pods-demo__hero-anchor"
        style={{ left: geo.unit + geo.gap, top: 0, width: heroSize, height: heroSize }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: HERO_EASE }}
      >
        <ProfileHero fill />
      </motion.div>

      <AnimatePresence initial={!reduceMotion}>
        {POD_ORDER.filter((id) => layout[id]).map((id, i) => {
          const placement = layout[id]!;
          const rect = groupRect(geo, placement.size, placement.anchor);
          const scatter = SCATTER[id];
          const delay = reduceMotion ? 0 : intro ? 0.35 + i * 0.07 : 0.16;
          const enter = { ...SNAP_SPRING, delay };
          return (
            <motion.div
              key={id}
              className="profile-pods-demo__cell"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: 0.72,
                      x: scatter.x,
                      y: scatter.y,
                      rotate: scatter.rotate,
                      left: rect.x,
                      top: rect.y,
                      width: rect.w,
                      height: rect.h,
                    }
              }
              animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
              exit={{
                opacity: 0,
                scale: 0.6,
                rotate: scatter.rotate * 0.6,
                y: 24,
                transition: { duration: 0.26, ease: [0.4, 0, 1, 1] },
              }}
              transition={{
                opacity: { duration: 0.24, delay },
                scale: enter,
                x: enter,
                y: enter,
                rotate: enter,
                left: SNAP_SPRING,
                top: SNAP_SPRING,
                width: SNAP_SPRING,
                height: SNAP_SPRING,
              }}
            >
              <PodTile size={placement.size}>
                <PodFace id={id} size={placement.size} animate={animate} />
              </PodTile>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ─── Narrow stack ──────────────────────────────────────────────────────────

function NarrowStack({ order, animate, reduceMotion }: { order: PodId[]; animate: boolean; reduceMotion: boolean }) {
  return (
    <div className="profile-pods-demo__stack">
      <motion.div
        className="profile-pods-demo__stack-hero"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: HERO_EASE }}
      >
        <ProfileHero fill={false} />
      </motion.div>
      <div className="profile-pods-demo__grid">
        {order.map((id) => {
          const size = NARROW_SIZE[id];
          const scatter = SCATTER[id];
          const delay = reduceMotion ? 0 : 0.3 + POD_ORDER.indexOf(id) * 0.06;
          return (
            <motion.div
              key={id}
              layout={!reduceMotion}
              className="profile-pods-demo__narrow-cell"
              style={{ gridColumn: size === "h2" || size === "h4" ? "span 2" : "span 1", height: narrowHeight(size) }}
              initial={
                reduceMotion ? false : { opacity: 0, scale: 0.75, x: scatter.x * 0.5, y: scatter.y * 0.5 + 30, rotate: scatter.rotate }
              }
              animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
              transition={{ ...SNAP_SPRING, delay, layout: SNAP_SPRING }}
            >
              <PodTile size={size}>
                <PodFace id={id} size={size} animate={animate} />
              </PodTile>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────

export function ProfilePodsDemo({ className, footer }: { className?: string; footer?: ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;
  const wideViewport = useWideViewport();
  const { ref, width } = useContainerWidth();
  const onScreen = useOnScreen(ref);
  const [hovered, setHovered] = useState(false);

  const geo = useMemo(() => (wideViewport && width > 0 ? computeGeometry(width) : null), [wideViewport, width]);
  const isWide = geo != null;
  const running = !reduceMotion && !hovered && onScreen;

  const wideIndex = useCycle(WIDE_LAYOUTS.length, SHUFFLE_MS, running && isWide);
  const narrowIndex = useCycle(NARROW_ORDERS.length, NARROW_SHUFFLE_MS, running && !isWide);
  const animate = !reduceMotion && onScreen;

  return (
    <div ref={ref} className={cn("profile-pods-demo", isWide ? "profile-pods-demo--wide" : "profile-pods-demo--narrow", className)}>
      <div
        className="profile-pods-demo__stage"
        role="img"
        aria-label="Example profile: a photo and network pod in the center, with music, gallery, location, Spine booking, Blurbs, Bubble and page pods snapping into place around it"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <ProfileMeta />
        {geo ? (
          <WideBoard geo={geo} layout={WIDE_LAYOUTS[wideIndex]} animate={animate} reduceMotion={reduceMotion} />
        ) : width > 0 ? (
          <NarrowStack order={NARROW_ORDERS[narrowIndex]} animate={animate} reduceMotion={reduceMotion} />
        ) : null}
      </div>

      {footer}
    </div>
  );
}
