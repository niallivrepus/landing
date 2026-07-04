import * as React from "react";

import { type Variants, motion } from "motion/react";
import { Camera01Icon, Folder01Icon, Image01Icon } from "hugeicons-react";

import { useShouldAnimate } from "../../hooks/use-reduced-motion";
import { useTheme } from "../../hooks/use-theme";
import { getSpringTransition } from "../../lib/utils/animations";
import { cn } from "../../lib/utils/cn";

// the glass skin inverts with the theme: a white frosted union on dark surfaces,
// a dark frosted union on light ones — so a splex reads on any backdrop.
type SplexTone = "onDark" | "onLight";

interface GlassTone {
  fill: [string, number];
  edge: [string, number];
  rim: [string, number];
  shadow: string;
  icon: string;
}

const GLASS: Record<SplexTone, GlassTone> = {
  onDark: {
    // match the global surface fill (--app-surface → dark-glass-80) instead of a
    // near-transparent frost, so the splex reads as solid app chrome.
    fill: ["#000000", 0.8],
    edge: ["#ffffff", 0.2],
    rim: ["#ffffff", 0.18],
    shadow: "rgba(0,0,0,0.05)",
    icon: "#ffffff",
  },
  onLight: {
    fill: ["#0a0a0a", 0.8],
    edge: ["#0a0a0a", 0.16],
    rim: ["#ffffff", 0.5],
    shadow: "rgba(0,0,0,0.16)",
    icon: "#1c1c1c",
  },
};

function useSplexTone(): { tone: SplexTone; glass: GlassTone } {
  const { isDarkMode } = useTheme();
  const tone: SplexTone = isDarkMode ? "onDark" : "onLight";
  return { tone, glass: GLASS[tone] };
}

// liquid-ink expansion menu that blooms out of the prompt bar "+".
// the dots and the necks between them are one continuous glass union: a single
// gooey-merged silhouette that the svg filter paints with the same glass fill,
// 1px edge and rim-light it would give a lone dot — so the connectors read the
// exact same as the dots. the crisp icon layer rides on top, never blurred.

const BOX_W = 100;
const BOX_H = 152;

// the bloom collapses back toward this point (the prompt bar "+") on close — it
// is only an animation anchor, never painted, so there is no standalone left dot.
const COLLAPSE = { x: 30, y: 76 } as const;
const BLOB_R = 25;
const BUTTON_D = 50;

interface Satellite {
  key: "camera" | "image" | "folder";
  x: number;
  y: number;
  icon: React.ReactNode;
  label: string;
}

// the three dots merge into one another on the right: image is the hub, and the
// camera and folder necks flow into it — so the connections live between the
// dots themselves rather than through a separate blob on the left.
const SATELLITES: Satellite[] = [
  { key: "camera", x: 34, y: 22, icon: <Camera01Icon size={20} />, label: "camera" },
  // image sits to the right of (and clear of) the prompt-bar "+/x" so the close
  // button stays clickable while the splex is open — even through the wobble.
  { key: "image", x: 78, y: 76, icon: <Image01Icon size={20} />, label: "image" },
  { key: "folder", x: 34, y: 130, icon: <Folder01Icon size={20} />, label: "folder" },
];

// continuous idle wobble per blob — tiny looping offsets with a different phase
// and period each, so the whole composition breathes and never lines up.
interface WobbleSpec {
  dur: number;
  x: number[];
  y: number[];
  scale: number[];
}

const WOBBLE: Record<Satellite["key"], WobbleSpec> = {
  camera: { dur: 2.8, x: [0, 2, -1, 0], y: [0, -1.5, 2, 0], scale: [1, 1.04, 0.98, 1] },
  image: { dur: 3.2, x: [0, -2, 1.5, 0], y: [0, 2, -1.5, 0], scale: [1, 0.975, 1.04, 1] },
  folder: { dur: 2.4, x: [0, 1, -2, 0], y: [0, 1.5, -2, 0], scale: [1, 1.03, 0.97, 1] },
};

export interface SplexProps {
  open: boolean;
  onCamera?: () => void;
  onImage?: () => void;
  onFolder?: () => void;
  className?: string;
  // continuous idle wobble while open; turn off for a perfectly still bloom.
  idle?: boolean;
}

export function Splex({
  open,
  onCamera,
  onImage,
  onFolder,
  className,
  idle = true,
}: SplexProps) {
  const shouldAnimate = useShouldAnimate();
  const { glass } = useSplexTone();
  const filterId = `splex-goo-${React.useId().replace(/:/g, "")}`;

  // idle wobble only breathes while open, when motion is allowed, and opted in.
  const wobbleActive = open && shouldAnimate && idle;

  const satelliteSpring = shouldAnimate
    ? getSpringTransition("familyBounce")
    : { duration: 0 };

  // stagger satellites out on open, reverse the order on close.
  const containerVariants: Variants = {
    open: { transition: { staggerChildren: 0.07, delayChildren: 0.03 } },
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };

  // each satellite stretches out of the origin pool on open and snaps back into
  // it on close, where the goo filter pinches the neck off like a droplet.
  const satelliteVariants: Variants = {
    open: { x: 0, y: 0, scale: 1, opacity: 1, transition: satelliteSpring },
    closed: (c: { x: number; y: number }) => ({
      x: c.x,
      y: c.y,
      scale: 0.15,
      opacity: 0,
      transition: satelliteSpring,
    }),
  };

  const handlers: Record<Satellite["key"], (() => void) | undefined> = {
    camera: onCamera,
    image: onImage,
    folder: onFolder,
  };

  return (
    <motion.div
      className={cn("relative", className)}
      style={{
        width: BOX_W,
        height: BOX_H,
        overflow: "visible",
        pointerEvents: open ? "auto" : "none",
      }}
      initial="closed"
      animate={open ? "open" : "closed"}
      variants={containerVariants}
      aria-hidden={!open}
    >
      {/* glass-union filter. step 1 merges the white source blobs into one
          silhouette; the rest paints that silhouette as glass so dots and necks
          share one skin: light-glass-5 fill, a 1px light-glass-20 edge and a
          white rim-light along the top inner contour. (whites = the glass
          tokens: #ffffff @ 5% / 20% / 18% ≈ light-glass-5 / -20 / rim.) */}
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
        <defs>
          <SplexGooFilter id={filterId} glass={glass} />
        </defs>
      </svg>

      {/* liquid blob layer — opaque white sources, painted into glass by the
          filter with no extra shadow, so the bloom stays calm and crisp. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          filter: `url(#${filterId})`,
          WebkitFilter: `url(#${filterId})`,
        }}
      >
        {SATELLITES.map((s) => (
          <motion.div
            key={s.key}
            custom={{ x: COLLAPSE.x - s.x, y: COLLAPSE.y - s.y }}
            variants={satelliteVariants}
            style={{
              position: "absolute",
              left: s.x - BLOB_R,
              top: s.y - BLOB_R,
              width: BLOB_R * 2,
              height: BLOB_R * 2,
            }}
          >
            <Wobble spec={WOBBLE[s.key]} active={wobbleActive}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "#ffffff",
                }}
              />
            </Wobble>
          </motion.div>
        ))}
      </div>

      {/* crisp icon layer — rides on top of the blobs, never blurred */}
      <div style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {SATELLITES.map((s) => (
          <motion.div
            key={s.key}
            custom={{ x: COLLAPSE.x - s.x, y: COLLAPSE.y - s.y }}
            variants={satelliteVariants}
            style={{
              position: "absolute",
              left: s.x - BUTTON_D / 2,
              top: s.y - BUTTON_D / 2,
              width: BUTTON_D,
              height: BUTTON_D,
            }}
          >
            {/* icons track the same wobble as their blob so they stay centered. */}
            <Wobble spec={WOBBLE[s.key]} active={wobbleActive}>
              <SatelliteButton
                icon={s.icon}
                label={s.label}
                interactive={open}
                iconColor={glass.icon}
                onClick={handlers[s.key]}
              />
            </Wobble>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

interface WobbleProps {
  spec: WobbleSpec;
  active: boolean;
  children: React.ReactNode;
}

// a fill layer that loops a gentle organic jiggle on top of the bloom transform.
// setting an explicit animate target keeps it from inheriting the open/closed
// variant, so the wobble and the bloom stay independent.
function Wobble({ spec, active, children }: WobbleProps) {
  return (
    <motion.div
      style={{ position: "absolute", inset: 0 }}
      animate={
        active
          ? { x: spec.x, y: spec.y, scale: spec.scale }
          : { x: 0, y: 0, scale: 1 }
      }
      transition={
        active
          ? {
              duration: spec.dur,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }
          : { duration: 0.3 }
      }
    >
      {children}
    </motion.div>
  );
}

interface SatelliteButtonProps {
  icon: React.ReactNode;
  label: string;
  interactive: boolean;
  iconColor: string;
  onClick?: () => void;
}

function SatelliteButton({
  icon,
  label,
  interactive,
  iconColor,
  onClick,
}: SatelliteButtonProps) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  // the dot surface now belongs to the merged glass union beneath, so the icon
  // sits on it bare. the four states live in the icon itself: brightens on
  // hover, sinks on press, dims while closed (non-interactive).
  const opacity = !interactive ? 0 : pressed ? 0.7 : hovered ? 1 : 0.85;
  const scale = pressed ? 0.86 : hovered ? 1.06 : 1;

  return (
    <button
      type="button"
      aria-label={label}
      tabIndex={interactive ? 0 : -1}
      onClick={interactive ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none",
        "transition-[transform,opacity] duration-150 ease-out",
        "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        interactive ? "cursor-pointer" : "cursor-default"
      )}
      style={{
        color: iconColor,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {icon}
    </button>
  );
}

/* ─── shared liquid-glass skin ─────────────────────────────────────────
   the same gooey union skin every splex composition wears: merge the white
   source blobs into one silhouette, then paint it as glass — light-glass-5
   fill, a 1px light-glass-20 edge and a white rim-light along the top. a high
   alpha threshold pinches the necks into delicate liquid strings. */
function SplexGooFilter({ id, glass }: { id: string; glass: GlassTone }) {
  return (
    <filter
      id={id}
      x="-60%"
      y="-60%"
      width="220%"
      height="220%"
      colorInterpolationFilters="sRGB"
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      <feColorMatrix
        in="blur"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 32 -16.5"
        result="goo"
      />
      <feMorphology in="goo" operator="erode" radius="1" result="inner" />
      <feComposite in="goo" in2="inner" operator="out" result="edgeBand" />
      <feFlood floodColor={glass.fill[0]} floodOpacity={glass.fill[1]} result="fillColor" />
      <feComposite in="fillColor" in2="inner" operator="in" result="fill" />
      <feFlood floodColor={glass.edge[0]} floodOpacity={glass.edge[1]} result="edgeColor" />
      <feComposite in="edgeColor" in2="edgeBand" operator="in" result="edge" />
      <feOffset in="inner" dx="0" dy="2" result="innerDown" />
      <feComposite in="inner" in2="innerDown" operator="out" result="topRim" />
      <feGaussianBlur in="topRim" stdDeviation="0.7" result="topRimSoft" />
      <feFlood floodColor={glass.rim[0]} floodOpacity={glass.rim[1]} result="rimColor" />
      <feComposite in="rimColor" in2="topRimSoft" operator="in" result="rim" />
      <feMerge>
        <feMergeNode in="fill" />
        <feMergeNode in="edge" />
        <feMergeNode in="rim" />
      </feMerge>
    </filter>
  );
}

// deterministic per-index wobble so any number of dots breathe out of sync.
function wobbleForIndex(i: number): WobbleSpec {
  const dirs = [
    { x: [0, 2, -1, 0], y: [0, -1.5, 2, 0], scale: [1, 1.04, 0.98, 1] },
    { x: [0, -2, 1.5, 0], y: [0, 2, -1.5, 0], scale: [1, 0.975, 1.04, 1] },
    { x: [0, 1, -2, 0], y: [0, 1.5, -2, 0], scale: [1, 1.03, 0.97, 1] },
    { x: [0, -1.5, 2, 0], y: [0, -2, 1, 0], scale: [1, 1.03, 0.985, 1] },
  ] as const;
  const d = dirs[i % dirs.length]!;
  return { dur: 2.4 + (i % 5) * 0.3, x: [...d.x], y: [...d.y], scale: [...d.scale] };
}

/* ─── radial splex ─────────────────────────────────────────────────────
   the same liquid-glass union, arranged as a fan/arc of dots around a point.
   used for context compositions: right-click a person's avatar (actions) or a
   message (emoji). the menu blooms out of — and collapses back into — the very
   point it is anchored on, so it reads as erupting from what you clicked. */
export interface SplexItem {
  key: string;
  /** icon element or emoji node that rides on the dot */
  node: React.ReactNode;
  label: string;
  onSelect?: () => void;
}

const RADIAL_BLOB_R = 19;
const RADIAL_BUTTON_D = 36;
const RADIAL_ORIGIN_R = 13;

export interface RadialSplexProps {
  open: boolean;
  items: SplexItem[];
  /** distance of the dots from the anchor point */
  radius?: number;
  /** degrees the fan points toward — default -90 (straight up) */
  centerAngle?: number;
  /** degrees between neighbouring dots */
  spread?: number;
  /** visual and interactive dot size in pixels */
  buttonSize?: number;
  idle?: boolean;
  className?: string;
}

export function RadialSplex({
  open,
  items,
  radius = 60,
  centerAngle = -90,
  spread = 42,
  buttonSize = RADIAL_BUTTON_D,
  idle = true,
  className,
}: RadialSplexProps) {
  const shouldAnimate = useShouldAnimate();
  const { glass } = useSplexTone();
  const filterId = `splex-radial-goo-${React.useId().replace(/:/g, "")}`;
  const wobbleActive = open && shouldAnimate && idle;

  const spring = shouldAnimate
    ? getSpringTransition("familyBounce")
    : { duration: 0 };

  const containerVariants: Variants = {
    open: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
    closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  };

  const itemVariants: Variants = {
    open: { x: 0, y: 0, scale: 1, opacity: 1, transition: spring },
    closed: (c: { x: number; y: number }) => ({
      x: c.x,
      y: c.y,
      scale: 0.12,
      opacity: 0,
      transition: spring,
    }),
  };
  const originVariants: Variants = {
    open: { scale: 0.72, opacity: 1, transition: spring },
    closed: { scale: 0.18, opacity: 0, transition: spring },
  };

  // lay the dots out on an arc centred on the anchor; the box is large enough
  // to hold the fan and is shifted so its centre lands on the anchor point.
  const n = items.length;
  const blobRadius = Math.max(RADIAL_BLOB_R, buttonSize / 2 + 1);
  const pad = blobRadius + 12;
  const maxR = radius + pad;
  const center = { x: maxR, y: maxR };

  const placed = items.map((it, i) => {
    const angle = centerAngle + (i - (n - 1) / 2) * spread;
    const rad = (angle * Math.PI) / 180;
    return {
      ...it,
      x: center.x + Math.cos(rad) * radius,
      y: center.y + Math.sin(rad) * radius,
    };
  });

  return (
    // a zero-size origin: the caller positions this point, the fan blooms around it.
    <div className={cn("relative", className)} style={{ width: 0, height: 0 }}>
      <motion.div
        style={{
          position: "absolute",
          left: -center.x,
          top: -center.y,
          width: maxR * 2,
          height: maxR * 2,
          overflow: "visible",
          pointerEvents: open ? "auto" : "none",
        }}
        initial="closed"
        animate={open ? "open" : "closed"}
        variants={containerVariants}
        aria-hidden={!open}
      >
        <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
          <defs>
            <SplexGooFilter id={filterId} glass={glass} />
          </defs>
        </svg>

        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "visible",
            filter: `url(#${filterId}) drop-shadow(0 10px 10px ${glass.shadow})`,
            WebkitFilter: `url(#${filterId}) drop-shadow(0 10px 10px ${glass.shadow})`,
          }}
        >
          <motion.div
            variants={originVariants}
            style={{
              position: "absolute",
              left: center.x - RADIAL_ORIGIN_R,
              top: center.y - RADIAL_ORIGIN_R,
              width: RADIAL_ORIGIN_R * 2,
              height: RADIAL_ORIGIN_R * 2,
              transformOrigin: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "#ffffff",
              }}
            />
          </motion.div>

          {placed.map((p, i) => (
            <motion.div
              key={p.key}
              custom={{ x: center.x - p.x, y: center.y - p.y }}
              variants={itemVariants}
              style={{
                position: "absolute",
                left: p.x - blobRadius,
                top: p.y - blobRadius,
                width: blobRadius * 2,
                height: blobRadius * 2,
              }}
            >
              <Wobble spec={wobbleForIndex(i)} active={wobbleActive}>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "#ffffff",
                  }}
                />
              </Wobble>
            </motion.div>
          ))}
        </div>

        <div style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {placed.map((p, i) => (
            <motion.div
              key={p.key}
              custom={{ x: center.x - p.x, y: center.y - p.y }}
              variants={itemVariants}
              style={{
                position: "absolute",
                left: p.x - buttonSize / 2,
                top: p.y - buttonSize / 2,
                width: buttonSize,
                height: buttonSize,
              }}
            >
              <Wobble spec={wobbleForIndex(i)} active={wobbleActive}>
                <SatelliteButton
                  icon={p.node}
                  label={p.label}
                  interactive={open}
                  iconColor={glass.icon}
                  onClick={p.onSelect}
                />
              </Wobble>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
