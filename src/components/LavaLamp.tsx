import { motion } from "motion/react";
import { useMemo, useId } from "react";
import { cn } from "@jokuh/gooey";

/* ── Blob descriptor ─────────────────────────────────────────────────── */

type Blob = {
  /** CSS position classes (absolute left-… top-… size-…) */
  pos: string;
  /** radial-gradient string */
  gradient: string;
  /** motion keyframes for x */
  x: number[];
  /** motion keyframes for y */
  y: number[];
  /** animation duration in seconds */
  dur: number;
};

export type LavaLampStyle = {
  name: string;
  blobs: Blob[];
  /** SVG gooey filter stdDeviation — default 16 */
  blur?: number;
  /** feColorMatrix alpha multiplier/offset — default [20, -9] */
  matrix?: [number, number];
  /** wrapper opacity — default 0.85 */
  opacity?: number;
  /** optional CSS bg on the container */
  bg?: string;
};

/* ── Art style presets ────────────────────────────────────────────────── */

export const LAVA_LAMP_STYLES: Record<string, LavaLampStyle> = {
  aurora: {
    name: "Aurora",
    blobs: [
      { pos: "left-[-12%] top-[-18%] size-[82%]", gradient: "radial-gradient(circle, #9500FF 0%, #D000FF 35%, transparent 65%)", x: [0, 55, -35, 0], y: [0, -50, 40, 0], dur: 19 },
      { pos: "right-[-18%] top-[-8%] size-[78%]", gradient: "radial-gradient(circle, #0040FF 0%, #4D8FFF 35%, transparent 65%)", x: [0, -50, 40, 0], y: [0, 45, -50, 0], dur: 15 },
      { pos: "bottom-[-22%] left-[8%] size-[72%]", gradient: "radial-gradient(circle, #FF00E5 0%, #FF6BD6 30%, transparent 60%)", x: [0, -38, 48, 0], y: [0, 30, -28, 0], dur: 22 },
      { pos: "right-[-8%] bottom-[-12%] size-[68%]", gradient: "radial-gradient(circle, #FF5500 0%, #FFC200 30%, transparent 60%)", x: [0, 42, -30, 0], y: [0, -40, 28, 0], dur: 17 },
      { pos: "left-[18%] top-[22%] size-[62%]", gradient: "radial-gradient(circle, #E60000 0%, #FF0077 30%, transparent 55%)", x: [0, -30, 40, 0], y: [0, 45, -32, 0], dur: 24 },
    ],
    opacity: 1,
  },

  nebula: {
    name: "Nebula",
    blobs: [
      { pos: "left-[-15%] top-[-10%] size-[85%]", gradient: "radial-gradient(circle, #3B0080 0%, #9333EA 30%, transparent 60%)", x: [0, 40, -25, 0], y: [0, -35, 30, 0], dur: 20 },
      { pos: "right-[-10%] top-[-20%] size-[80%]", gradient: "radial-gradient(circle, #1520B0 0%, #6366F1 35%, transparent 62%)", x: [0, -45, 30, 0], y: [0, 38, -42, 0], dur: 16 },
      { pos: "bottom-[-15%] left-[-5%] size-[78%]", gradient: "radial-gradient(circle, #BE185D 0%, #F472B6 30%, transparent 58%)", x: [0, 35, -40, 0], y: [0, -28, 38, 0], dur: 23 },
    ],
    opacity: 1,
  },

  ember: {
    name: "Ember",
    blobs: [
      { pos: "left-[-10%] top-[-12%] size-[80%]", gradient: "radial-gradient(circle, #FF5500 0%, #FF7A00 28%, transparent 55%)", x: [0, 50, -30, 0], y: [0, -40, 35, 0], dur: 16 },
      { pos: "right-[-15%] top-[-8%] size-[75%]", gradient: "radial-gradient(circle, #E60000 0%, #FF1A00 30%, transparent 58%)", x: [0, -42, 38, 0], y: [0, 44, -36, 0], dur: 20 },
      { pos: "bottom-[-18%] left-[10%] size-[72%]", gradient: "radial-gradient(circle, #FFCC00 0%, #FFD633 28%, transparent 52%)", x: [0, -35, 45, 0], y: [0, 30, -25, 0], dur: 18 },
      { pos: "left-[20%] top-[30%] size-[60%]", gradient: "radial-gradient(circle, #B91C1C 0%, #FF3333 25%, transparent 50%)", x: [0, 28, -35, 0], y: [0, -32, 28, 0], dur: 25 },
    ],
    opacity: 1,
  },

  arctic: {
    name: "Arctic",
    blobs: [
      { pos: "left-[-8%] top-[-15%] size-[82%]", gradient: "radial-gradient(circle, #0052CC 0%, #0080FF 32%, transparent 60%)", x: [0, 38, -28, 0], y: [0, -42, 35, 0], dur: 18 },
      { pos: "right-[-12%] top-[-5%] size-[78%]", gradient: "radial-gradient(circle, #00AAAA 0%, #00FFFF 28%, transparent 55%)", x: [0, -40, 35, 0], y: [0, 36, -44, 0], dur: 22 },
      { pos: "bottom-[-20%] left-[5%] size-[74%]", gradient: "radial-gradient(circle, #1428CC 0%, #3B82F6 30%, transparent 58%)", x: [0, 32, -40, 0], y: [0, -30, 38, 0], dur: 15 },
    ],
    opacity: 1,
  },

  jungle: {
    name: "Jungle",
    blobs: [
      { pos: "left-[-12%] top-[-10%] size-[80%]", gradient: "radial-gradient(circle, #00B300 0%, #22FF11 30%, transparent 58%)", x: [0, 45, -30, 0], y: [0, -38, 32, 0], dur: 19 },
      { pos: "right-[-10%] top-[-18%] size-[76%]", gradient: "radial-gradient(circle, #00AAAA 0%, #00FFEE 25%, transparent 52%)", x: [0, -36, 42, 0], y: [0, 40, -35, 0], dur: 23 },
      { pos: "bottom-[-15%] left-[8%] size-[70%]", gradient: "radial-gradient(circle, #FFCC00 0%, #FFD633 28%, transparent 55%)", x: [0, -28, 38, 0], y: [0, -34, 30, 0], dur: 17 },
      { pos: "left-[22%] top-[25%] size-[58%]", gradient: "radial-gradient(circle, #0052CC 0%, #0080FF 28%, transparent 50%)", x: [0, 30, -25, 0], y: [0, 35, -28, 0], dur: 26 },
    ],
    opacity: 1,
  },

  ultraviolet: {
    name: "Ultraviolet",
    blobs: [
      { pos: "left-[-15%] top-[-8%] size-[84%]", gradient: "radial-gradient(circle, #8B1FE6 0%, #A855F7 30%, transparent 58%)", x: [0, 48, -35, 0], y: [0, -45, 38, 0], dur: 17 },
      { pos: "right-[-12%] top-[-15%] size-[76%]", gradient: "radial-gradient(circle, #CC00BB 0%, #FF00FF 28%, transparent 55%)", x: [0, -42, 38, 0], y: [0, 42, -38, 0], dur: 21 },
      { pos: "bottom-[-18%] right-[-5%] size-[72%]", gradient: "radial-gradient(circle, #0040FF 0%, #C084FC 25%, transparent 52%)", x: [0, -30, 42, 0], y: [0, -35, 30, 0], dur: 14 },
    ],
    opacity: 1,
  },

  coral: {
    name: "Coral",
    blobs: [
      { pos: "left-[-10%] top-[-12%] size-[78%]", gradient: "radial-gradient(circle, #FF00E5 0%, #FF70F5 28%, transparent 55%)", x: [0, 42, -28, 0], y: [0, -38, 32, 0], dur: 18 },
      { pos: "right-[-14%] top-[-6%] size-[74%]", gradient: "radial-gradient(circle, #FF5500 0%, #FF8000 28%, transparent 52%)", x: [0, -38, 32, 0], y: [0, 40, -35, 0], dur: 22 },
      { pos: "bottom-[-16%] left-[12%] size-[68%]", gradient: "radial-gradient(circle, #FFCC00 0%, #FFD633 25%, transparent 50%)", x: [0, 30, -38, 0], y: [0, -32, 28, 0], dur: 16 },
      { pos: "left-[5%] top-[18%] size-[62%]", gradient: "radial-gradient(circle, #E60000 0%, #FF0077 25%, transparent 48%)", x: [0, -25, 35, 0], y: [0, 38, -25, 0], dur: 24 },
    ],
    opacity: 1,
  },

  void: {
    name: "Void",
    blobs: [
      { pos: "left-[-15%] top-[-15%] size-[85%]", gradient: "radial-gradient(circle, #1A0044 0%, #4C1D95 30%, transparent 58%)", x: [0, 35, -25, 0], y: [0, -30, 28, 0], dur: 25 },
      { pos: "right-[-10%] top-[-10%] size-[80%]", gradient: "radial-gradient(circle, #0040FF 0%, #2563EB 32%, transparent 60%)", x: [0, -30, 35, 0], y: [0, 32, -28, 0], dur: 18 },
      { pos: "bottom-[-12%] left-[5%] size-[70%]", gradient: "radial-gradient(circle, #8B1FE6 0%, #7C3AED 28%, transparent 52%)", x: [0, 28, -32, 0], y: [0, -25, 30, 0], dur: 22 },
    ],
    blur: 32,
    opacity: 1,
  },

  sunrise: {
    name: "Sunrise",
    blobs: [
      { pos: "left-[-8%] bottom-[-20%] size-[80%]", gradient: "radial-gradient(circle, #FF5500 0%, #FFCC00 32%, transparent 60%)", x: [0, 40, -25, 0], y: [0, -30, 25, 0], dur: 18 },
      { pos: "right-[-12%] bottom-[-15%] size-[76%]", gradient: "radial-gradient(circle, #E60000 0%, #FF3333 30%, transparent 56%)", x: [0, -35, 30, 0], y: [0, -25, 32, 0], dur: 22 },
      { pos: "left-[15%] top-[-10%] size-[72%]", gradient: "radial-gradient(circle, #FFCC00 0%, #FFD633 28%, transparent 52%)", x: [0, 28, -35, 0], y: [0, 35, -28, 0], dur: 16 },
      { pos: "right-[-5%] top-[-15%] size-[65%]", gradient: "radial-gradient(circle, #FF00E5 0%, #FF6BD6 25%, transparent 48%)", x: [0, -25, 38, 0], y: [0, 30, -22, 0], dur: 20 },
    ],
    opacity: 1,
  },

  glacier: {
    name: "Glacier",
    blobs: [
      { pos: "left-[-10%] top-[-12%] size-[82%]", gradient: "radial-gradient(circle, #00FFFF 0%, #00E5FF 20%, transparent 50%)", x: [0, 35, -28, 0], y: [0, -32, 28, 0], dur: 20 },
      { pos: "right-[-15%] top-[-8%] size-[78%]", gradient: "radial-gradient(circle, #0080FF 0%, #3B82F6 30%, transparent 58%)", x: [0, -40, 32, 0], y: [0, 38, -35, 0], dur: 16 },
      { pos: "bottom-[-18%] left-[10%] size-[70%]", gradient: "radial-gradient(circle, #00AAAA 0%, #00FFFF 25%, transparent 52%)", x: [0, 30, -35, 0], y: [0, -28, 32, 0], dur: 24 },
    ],
    opacity: 1,
  },

  crimson: {
    name: "Crimson",
    blobs: [
      { pos: "left-[-12%] top-[-10%] size-[82%]", gradient: "radial-gradient(circle, #B91C1C 0%, #FF0000 30%, transparent 58%)", x: [0, 45, -30, 0], y: [0, -42, 35, 0], dur: 17 },
      { pos: "right-[-10%] top-[-15%] size-[78%]", gradient: "radial-gradient(circle, #E60000 0%, #FF0077 28%, transparent 55%)", x: [0, -38, 35, 0], y: [0, 40, -38, 0], dur: 21 },
      { pos: "bottom-[-15%] left-[5%] size-[72%]", gradient: "radial-gradient(circle, #FF5500 0%, #FF8000 25%, transparent 50%)", x: [0, 32, -38, 0], y: [0, -30, 32, 0], dur: 25 },
    ],
    opacity: 1,
  },

  electric: {
    name: "Electric",
    blobs: [
      { pos: "left-[-10%] top-[-15%] size-[80%]", gradient: "radial-gradient(circle, #0080FF 0%, #3B82F6 28%, transparent 55%)", x: [0, 50, -35, 0], y: [0, -45, 38, 0], dur: 14 },
      { pos: "right-[-15%] top-[-5%] size-[78%]", gradient: "radial-gradient(circle, #00FFFF 0%, #00E5FF 20%, transparent 48%)", x: [0, -45, 40, 0], y: [0, 42, -40, 0], dur: 18 },
      { pos: "bottom-[-12%] left-[8%] size-[72%]", gradient: "radial-gradient(circle, #9500FF 0%, #C084FC 28%, transparent 55%)", x: [0, -35, 42, 0], y: [0, 35, -30, 0], dur: 22 },
      { pos: "left-[20%] top-[20%] size-[60%]", gradient: "radial-gradient(circle, #00E600 0%, #22FF11 22%, transparent 46%)", x: [0, 28, -32, 0], y: [0, -30, 28, 0], dur: 26 },
    ],
    blur: 28,
    opacity: 1,
  },
};

export const LAVA_LAMP_STYLE_KEYS = Object.keys(LAVA_LAMP_STYLES) as (keyof typeof LAVA_LAMP_STYLES)[];

/** Deterministic style picker based on a string seed */
export function lavaLampStyleForSeed(seed: string): keyof typeof LAVA_LAMP_STYLES {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return LAVA_LAMP_STYLE_KEYS[Math.abs(h) % LAVA_LAMP_STYLE_KEYS.length];
}

/* ── Component ───────────────────────────────────────────────────────── */

export function LavaLamp({
  style: styleName,
  className,
  animated = true,
}: {
  style: keyof typeof LAVA_LAMP_STYLES;
  className?: string;
  animated?: boolean;
}) {
  const s = LAVA_LAMP_STYLES[styleName] ?? LAVA_LAMP_STYLES.aurora;
  const filterId = useId();
  const blur = s.blur ?? 30;
  const [alphaM, alphaO] = s.matrix ?? [18, -7];

  const blobEls = useMemo(
    () =>
      s.blobs.map((b, i) => {
        const Comp = animated ? motion.div : "div";
        const animProps = animated
          ? {
              animate: { x: b.x, y: b.y },
              transition: {
                duration: b.dur,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
            }
          : {};
        return (
          <Comp
            key={i}
            className={cn("absolute rounded-full", b.pos)}
            style={{ background: b.gradient }}
            {...animProps}
          />
        );
      }),
    [s, animated],
  );

  return (
    <div
      className={cn(
        "relative size-full bg-black light:bg-white",
        "[--lava-vignette:inset_0_2px_40px_8px_rgba(0,0,0,0.2),inset_0_-20px_50px_rgba(0,0,0,0.15),inset_18px_0_50px_-14px_rgba(0,0,0,0.1),inset_-18px_0_50px_-14px_rgba(0,0,0,0.1)]",
        "light:[--lava-vignette:inset_0_2px_40px_8px_rgba(255,255,255,0.45),inset_0_-20px_50px_rgba(255,255,255,0.35),inset_18px_0_50px_-14px_rgba(255,255,255,0.28),inset_-18px_0_50px_-14px_rgba(255,255,255,0.28)]",
        s.bg,
        className,
      )}
    >
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%"
            colorInterpolationFilters="sRGB">
            {/* Phase 1: Wide blur for smooth metaball merge zones */}
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur1" />
            <feColorMatrix
              in="blur1"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${alphaM} ${alphaO}`}
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" result="merged" />

            {/* Phase 2: Anti-alias pass — soften the contour edge */}
            <feGaussianBlur in="merged" stdDeviation="2" result="smooth" />
            <feColorMatrix
              in="smooth"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 4 -0.8"
              result="crisp"
            />

            {/* Phase 3: Saturation boost for vivid color */}
            <feColorMatrix in="crisp" type="saturate" values="1.5" />
          </filter>
        </defs>
      </svg>

      {/* Blobs — single pass, 3D lighting baked into the filter */}
      <div
        className="absolute inset-[-30%]"
        style={{ filter: `url(#${CSS.escape(filterId)})`, opacity: s.opacity ?? 0.95 }}
      >
        {blobEls}
      </div>

      {/* Glass container depth vignette */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        aria-hidden
        style={{
          boxShadow: "var(--lava-vignette)",
        }}
      />

    </div>
  );
}
