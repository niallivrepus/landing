import * as React from "react";

import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

// Particle types for each icon
type ParticleType = "flame" | "snow" | "blurb" | "solar";

interface Particle {
  id: number;
  x: number;
  type: ParticleType;
  delay: number;
  angle?: number; // For blurb particles that move in all directions
}

// Flame particle component - orange-6
function FlameParticle({ x, delay, onComplete }: { x: number; delay: number; onComplete: () => void }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, bottom: 2 }}
      initial={{ opacity: 1, y: 0, scale: 0.3 }}
      animate={{ opacity: 0, y: -28, scale: 0.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 + Math.random() * 0.3, ease: "easeOut", delay }}
      onAnimationComplete={onComplete}
    >
      <svg width="3" height="4" viewBox="0 0 3 4" fill="none">
        <path
          d="M1.5 0C1.8 0.6 2.8 1.2 2.8 2.2C2.8 3 2.2 3.5 1.5 3.5C0.8 3.5 0.2 3 0.2 2.2C0.2 1.2 1.2 0.6 1.5 0Z"
          fill="var(--color-orange-6)"
        />
      </svg>
    </motion.div>
  );
}

// Snow particle component - cyan-6
function SnowParticle({ x, delay, onComplete }: { x: number; delay: number; onComplete: () => void }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: 2 }}
      initial={{ opacity: 1, y: 0, scale: 0.4, rotate: 0 }}
      animate={{ opacity: 0, y: 24, scale: 0.2, rotate: 120 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 + Math.random() * 0.3, ease: "easeOut", delay }}
      onAnimationComplete={onComplete}
    >
      <svg width="4" height="4" viewBox="0 0 4 4" fill="none">
        <path
          d="M2 0.3V3.7M2 0.3L1.3 1M2 0.3L2.7 1M2 3.7L1.3 3M2 3.7L2.7 3M0.3 2H3.7M0.3 2L1 1.3M0.3 2L1 2.7M3.7 2L3 1.3M3.7 2L3 2.7"
          stroke="var(--color-cyan-6)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

// Solar particle component - yellow-6, radial burst for star
function SolarParticle({ x, delay, angle, scale = 1, onComplete }: { x: number; delay: number; angle: number; scale?: number; onComplete: () => void }) {
  const distance = (18 + Math.random() * 8) * scale;
  const endX = Math.cos(angle) * distance;
  const endY = Math.sin(angle) * distance;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: 9 * scale }}
      initial={{ opacity: 1, x: 0, y: 0, scale: 0.3 }}
      animate={{ opacity: 0, x: endX, y: endY, scale: 0.6 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 + Math.random() * 0.15, ease: "easeOut", delay }}
      onAnimationComplete={onComplete}
    >
      <svg width="4" height="4" viewBox="0 0 4 4" fill="none">
        <circle cx="2" cy="2" r="1.5" fill="var(--color-yellow-6)" />
      </svg>
    </motion.div>
  );
}

// Blurb particle component - purple-6, moves in all directions
function BlurbParticle({ x, delay, angle, onComplete }: { x: number; delay: number; angle: number; onComplete: () => void }) {
  // Calculate end position based on angle (in radians)
  const distance = 20 + Math.random() * 10;
  const endX = Math.cos(angle) * distance;
  const endY = Math.sin(angle) * distance;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: 9 }} // Start from center
      initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
      animate={{ opacity: 0, x: endX, y: endY, scale: 0.7 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 + Math.random() * 0.2, ease: "easeOut", delay }}
      onAnimationComplete={onComplete}
    >
      <svg width="4" height="4" viewBox="0 0 4 4" fill="none">
        <circle cx="2" cy="2" r="1.8" fill="var(--color-purple-6)" />
      </svg>
    </motion.div>
  );
}

interface ReactIconState {
  hot: boolean;
  cold: boolean;
  message: boolean;
  blurb: boolean;
  star: boolean;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Show all icons or select specific ones
   * @default all
   */
  icons?: ("hot" | "cold" | "message" | "blurb" | "star")[];
  /**
   * Controlled state of which icons are clicked
   */
  activeIcons?: Partial<ReactIconState>;
  /**
   * Callback when an icon is clicked
   */
  onIconClick?: (iconKey: keyof ReactIconState) => void;
  /**
   * Size of each icon container in pixels
   * @default 18
   */
  size?: number;
}

const React_Icons = React.forwardRef<HTMLDivElement, ReactProps>(
  (
    {
      className,
      icons = ["hot", "cold", "message", "blurb", "star"],
      activeIcons = {},
      onIconClick,
      size = 18,
      ...props
    },
    ref
  ) => {
    const [hovered, setHovered] = React.useState<string | null>(null);
    const [clicked, setClicked] = React.useState<ReactIconState>(() => ({
      hot: activeIcons.hot || false,
      cold: activeIcons.cold || false,
      message: activeIcons.message || false,
      blurb: activeIcons.blurb || false,
      star: activeIcons.star || false,
    }));
    const [particles, setParticles] = React.useState<Map<string, Particle[]>>(new Map());
    const particleIdRef = React.useRef(0);

    const sizeScale = size / 18;

    const spawnParticles = (iconKey: string, type: ParticleType) => {
      const newParticles: Particle[] = [];
      const count = type === "snow" ? 6 : type === "blurb" ? 6 : 5;

      for (let i = 0; i < count; i++) {
        const particle: Particle = {
          id: particleIdRef.current++,
          x: type === "blurb" || type === "solar"
            ? (7 + Math.random() * 4) * sizeScale
            : (2 + Math.random() * 14) * sizeScale,
          type,
          delay: Math.random() * 0.1,
        };

        // Add angle for blurb and solar particles (spread in all directions)
        if (type === "blurb" || type === "solar") {
          particle.angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        }

        newParticles.push(particle);
      }

      setParticles((prev) => {
        const updated = new Map(prev);
        const existing = updated.get(iconKey) || [];
        updated.set(iconKey, [...existing, ...newParticles]);
        return updated;
      });
    };

    const removeParticle = (iconKey: string, particleId: number) => {
      setParticles((prev) => {
        const updated = new Map(prev);
        const existing = updated.get(iconKey) || [];
        updated.set(iconKey, existing.filter((p) => p.id !== particleId));
        return updated;
      });
    };

    const handleIconClick = (iconKey: keyof ReactIconState) => {
      const wasClicked = clicked[iconKey];

      setClicked((prev) => ({
        ...prev,
        [iconKey]: !prev[iconKey],
      }));

      // Spawn particles only when activating (going to fill state), not when deactivating
      if (!wasClicked) {
        if (iconKey === "hot") {
          spawnParticles(iconKey, "flame");
        } else if (iconKey === "cold") {
          spawnParticles(iconKey, "snow");
        } else if (iconKey === "blurb") {
          spawnParticles(iconKey, "blurb");
        } else if (iconKey === "star") {
          spawnParticles(iconKey, "solar");
        }
      }

      onIconClick?.(iconKey);
    };
    /**
     * Get stroke color based on state
     */
    const getStrokeColor = (isHovered: boolean, isClicked: boolean): string => {
      if (isClicked) return "currentColor"; // Will use filled version
      if (isHovered) return "var(--color-foreground)"; // theme-aware hover
      return "color-mix(in srgb, var(--color-foreground) 60%, transparent)"; // theme-aware default
    };


    const iconLabels: Record<string, string> = {
      hot: "Hot",
      cold: "Cold",
      message: "Message",
      blurb: "Blurb",
      star: "Star",
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-3", className)}
        style={{
          gap: "12px",
        }}
        data-slot="react"
        data-node-id="54:147773"
        {...props}
      >
        {icons.map((iconKey) => {
          const isClicked = clicked[iconKey as keyof ReactIconState];
          const isHovered = hovered === iconKey;
          const strokeColor = getStrokeColor(isHovered, isClicked);

          const iconParticles = particles.get(iconKey) || [];

          return (
            <div
              key={iconKey}
              className="flex-shrink-0 cursor-pointer relative"
              style={{
                width: size,
                height: size,
                minWidth: size,
                minHeight: size,
                color: strokeColor,
                transition: "color 0.3s ease-out",
                overflow: "visible",
              }}
              title={iconLabels[iconKey]}
              data-icon={iconKey}
              onClick={() => handleIconClick(iconKey as keyof ReactIconState)}
              onMouseEnter={() => setHovered(iconKey)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Particle effects */}
              <AnimatePresence>
                {iconParticles.map((particle) => {
                  if (particle.type === "flame") {
                    return (
                      <FlameParticle
                        key={particle.id}
                        x={particle.x}
                        delay={particle.delay}
                        onComplete={() => removeParticle(iconKey, particle.id)}
                      />
                    );
                  }
                  if (particle.type === "snow") {
                    return (
                      <SnowParticle
                        key={particle.id}
                        x={particle.x}
                        delay={particle.delay}
                        onComplete={() => removeParticle(iconKey, particle.id)}
                      />
                    );
                  }
                  if (particle.type === "blurb") {
                    return (
                      <BlurbParticle
                        key={particle.id}
                        x={particle.x}
                        delay={particle.delay}
                        angle={particle.angle ?? 0}
                        onComplete={() => removeParticle(iconKey, particle.id)}
                      />
                    );
                  }
                  if (particle.type === "solar") {
                    return (
                      <SolarParticle
                        key={particle.id}
                        x={particle.x}
                        delay={particle.delay}
                        angle={particle.angle ?? 0}
                        scale={sizeScale}
                        onComplete={() => removeParticle(iconKey, particle.id)}
                      />
                    );
                  }
                  return null;
                })}
              </AnimatePresence>
              {/* Icon SVG with rim light effect applied directly */}
              <svg
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  width: "100%",
                  height: "100%",
                  filter:
                    "drop-shadow(inset 0px 0.225px 0.375px 0px rgba(255, 255, 255, 0.15)) drop-shadow(inset 0px 0.5px 1px 0px rgba(255, 255, 255, 0.15))",
                  transition: "all 0.3s ease-out",
                }}
              >
                {/* Render the icon content directly as SVG children */}
                {isClicked ? (
                  // Filled version - extract path elements
                  <g>
                    {iconKey === "hot" && (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.36817 2.15904C8.80648 1.53288 9.68606 1.30654 10.373 1.77886C11.0867 2.26962 12.321 3.21814 13.3833 4.54968C14.4451 5.88057 15.375 7.64559 15.375 9.74991C15.375 13.4979 12.5608 16.4999 9 16.4999C5.43917 16.4999 2.625 13.4979 2.625 9.74991C2.625 8.22339 3.28056 6.27296 4.55815 4.71578C4.90567 4.2922 5.40972 4.14729 5.87703 4.22803C6.33057 4.30639 6.88644 4.2758 7.15038 3.89873L8.36817 2.15904ZM9 14.9999C10.0873 14.9999 10.9688 13.9938 10.9688 12.7527C10.9688 11.4208 9.93286 10.4412 9.3639 10.0036C9.14667 9.83651 8.85333 9.83651 8.6361 10.0036C8.06714 10.4412 7.03125 11.4208 7.03125 12.7527C7.03125 13.9938 7.91269 14.9999 9 14.9999Z"
                        fill="url(#paint0_linear_fire)"
                      />
                    )}
                    {iconKey === "cold" && (
                      <g transform="translate(1, 1.5)">
                        <path
                          d="M7.53241 2.625V12.375M7.53241 2.625L5.65741 0.75M7.53241 2.625L9.40741 0.75M7.53241 12.375L5.65741 14.25M7.53241 12.375L9.40741 14.25M3.31148 5.06248L11.7552 9.93748M3.31148 5.06248L0.750183 5.74878M3.31148 5.06248L2.62518 2.50118M11.7552 9.93748L12.4415 12.4988M11.7552 9.93748L14.3165 9.25118M3.31148 9.93748L11.7552 5.06248M3.31148 9.93748L2.62518 12.4988M3.31148 9.93748L0.750183 9.25118M11.7552 5.06248L14.3165 5.74878M11.7552 5.06248L12.4415 2.50118"
                          stroke="url(#paint0_linear_cold)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    )}
                    {iconKey === "message" && (
                      <path
                        d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 10.0158 2.47439 10.9792 2.87631 11.8434C2.95266 12.0075 2.97636 12.1923 2.93344 12.3682L2.34945 14.7615C2.21746 15.3024 2.70015 15.7935 3.24328 15.6709L5.73985 15.1071C5.90812 15.0691 6.08371 15.0917 6.24112 15.1623C7.08339 15.5399 8.01716 15.75 9 15.75Z"
                        fill="color-mix(in srgb, var(--color-foreground) 40%, transparent)"
                      />
                    )}
                    {iconKey === "blurb" && (
                      <>
                        <circle cx="5.8125" cy="5.8125" r="3.75" fill="url(#paint0_linear_blurb)" />
                        <circle cx="10.5" cy="13.3125" r="2.625" fill="url(#paint1_linear_blurb)" />
                        <circle cx="13.875" cy="6.9375" r="2.0625" fill="url(#paint2_linear_blurb)" />
                      </>
                    )}
                    {iconKey === "star" && (
                      <g transform="translate(-7, -6.5)">
                        <path
                          d="M14.2645 12.4585C14.8763 11.2452 15.1822 10.6386 15.6294 10.5289C15.786 10.4905 15.9495 10.4905 16.106 10.5289C16.5533 10.6386 16.8592 11.2452 17.4709 12.4585C17.6414 12.7966 17.7267 12.9656 17.8566 13.0871C17.9238 13.1499 17.9994 13.2032 18.0811 13.2453C18.2392 13.3269 18.4248 13.35 18.7959 13.3963L18.9316 13.4132C20.1437 13.5644 20.7498 13.64 21.0024 13.9419C21.1726 14.1454 21.255 14.4082 21.2315 14.6724C21.1965 15.0645 20.7422 15.4726 19.8335 16.2889C19.564 16.531 19.4293 16.652 19.3472 16.8021C19.2904 16.9061 19.2525 17.0194 19.2353 17.1367C19.2105 17.3059 19.2455 17.485 19.3156 17.8432C19.5519 19.0509 19.6701 19.6547 19.4473 19.9951C19.3195 20.1903 19.1275 20.3347 18.9045 20.4033C18.5156 20.5229 17.9728 20.2441 16.8872 19.6865L16.6893 19.5849C16.3325 19.4016 16.1541 19.3099 15.9632 19.2916C15.8997 19.2855 15.8357 19.2855 15.7722 19.2916C15.5814 19.3099 15.4029 19.4016 15.0461 19.5849L14.8482 19.6865C13.7626 20.2441 13.2198 20.5229 12.8309 20.4033C12.6079 20.3347 12.4159 20.1903 12.2882 19.9951C12.0653 19.6547 12.1835 19.0509 12.4198 17.8432C12.4899 17.485 12.5249 17.3059 12.5001 17.1367C12.483 17.0194 12.4451 16.9061 12.3882 16.8021C12.3062 16.652 12.1714 16.531 11.902 16.2889C10.9933 15.4726 10.5389 15.0645 10.504 14.6724C10.4804 14.4082 10.5628 14.1454 10.7331 13.9419C10.9856 13.64 11.5917 13.5644 12.8038 13.4132L12.9395 13.3963C13.3107 13.35 13.4962 13.3269 13.6543 13.2453C13.7361 13.2032 13.8116 13.1499 13.8789 13.0871C14.0088 12.9656 14.094 12.7966 14.2645 12.4585Z"
                          fill="url(#paint0_linear_star)"
                          stroke="#673F00"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    )}
                  </g>
                ) : (
                  // Stroke version - with transforms to center in 18x18 viewBox
                  <g style={{ transition: "stroke 0.3s ease-out" }}>
                    {iconKey === "hot" && (
                      <g transform="translate(2.5, 1.5)">
                        <path
                          d="M6.375 14.2235C9.4816 14.2235 12 11.5985 12 8.22355C12 4.47153 8.68446 1.80661 7.32303 0.870491C7.00362 0.650862 6.57989 0.745201 6.35759 1.06277L4.62113 3.54343C4.36231 3.91317 3.83239 3.95957 3.51325 3.64043C3.22979 3.35697 2.76724 3.35521 2.51297 3.66512C1.33766 5.09765 0.75 6.88237 0.75 8.22355C0.75 11.5985 3.2684 14.2235 6.375 14.2235ZM6.375 14.2235C7.61764 14.2235 8.625 13.0737 8.625 11.6553C8.625 10.0929 7.37766 8.95462 6.74043 8.47506C6.52146 8.31027 6.22854 8.31027 6.00957 8.47506C5.37234 8.95462 4.125 10.0929 4.125 11.6553C4.125 13.0737 5.13236 14.2235 6.375 14.2235Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    )}
                    {iconKey === "cold" && (
                      <g transform="translate(1, 1.5)">
                        <path
                          d="M7.53241 2.625V12.375M7.53241 2.625L5.65741 0.75M7.53241 2.625L9.40741 0.75M7.53241 12.375L5.65741 14.25M7.53241 12.375L9.40741 14.25M3.31148 5.06248L11.7552 9.93748M3.31148 5.06248L0.750183 5.74878M3.31148 5.06248L2.62518 2.50118M11.7552 9.93748L12.4415 12.4988M11.7552 9.93748L14.3165 9.25118M3.31148 9.93748L11.7552 5.06248M3.31148 9.93748L2.62518 12.4988M3.31148 9.93748L0.750183 9.25118M11.7552 5.06248L14.3165 5.74878M11.7552 5.06248L12.4415 2.50118"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    )}
                    {iconKey === "message" && (
                      <g transform="translate(1.5, 1.5)">
                        <path
                          d="M7.5 14.25C11.2279 14.25 14.25 11.2279 14.25 7.5C14.25 3.77208 11.2279 0.75 7.5 0.75C3.77208 0.75 0.75 3.77208 0.75 7.5C0.75 8.51582 0.97439 9.47923 1.37631 10.3434C1.45266 10.5075 1.47636 10.6923 1.43344 10.8682L0.849454 13.2615C0.717461 13.8024 1.20015 14.2935 1.74328 14.1709L4.23985 13.6071C4.40812 13.5691 4.58371 13.5917 4.74112 13.6623C5.58339 14.0399 6.51716 14.25 7.5 14.25Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    )}
                    {iconKey === "blurb" && (
                      <>
                        <path
                          d="M9.5625 5.8125C9.5625 7.88357 7.88357 9.5625 5.8125 9.5625C3.74143 9.5625 2.0625 7.88357 2.0625 5.8125C2.0625 3.74143 3.74143 2.0625 5.8125 2.0625C7.88357 2.0625 9.5625 3.74143 9.5625 5.8125Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.125 13.3125C13.125 14.7622 11.9497 15.9375 10.5 15.9375C9.05025 15.9375 7.875 14.7622 7.875 13.3125C7.875 11.8628 9.05025 10.6875 10.5 10.6875C11.9497 10.6875 13.125 11.8628 13.125 13.3125Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.9375 6.9375C15.9375 8.07659 15.0141 9 13.875 9C12.7359 9 11.8125 8.07659 11.8125 6.9375C11.8125 5.79841 12.7359 4.875 13.875 4.875C15.0141 4.875 15.9375 5.79841 15.9375 6.9375Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    )}
                    {iconKey === "star" && (
                      <g transform="translate(-7, -6.5)">
                        <path
                          d="M14.2645 12.4585C14.8763 11.2452 15.1822 10.6386 15.6294 10.5289C15.786 10.4905 15.9495 10.4905 16.106 10.5289C16.5533 10.6386 16.8592 11.2452 17.4709 12.4585C17.6414 12.7966 17.7267 12.9656 17.8566 13.0871C17.9238 13.1499 17.9994 13.2032 18.0811 13.2453C18.2392 13.3269 18.4248 13.35 18.7959 13.3963L18.9316 13.4132C20.1437 13.5644 20.7498 13.64 21.0024 13.9419C21.1726 14.1454 21.255 14.4082 21.2315 14.6724C21.1965 15.0645 20.7422 15.4726 19.8335 16.2889C19.564 16.531 19.4293 16.652 19.3472 16.8021C19.2904 16.9061 19.2525 17.0194 19.2353 17.1367C19.2105 17.3059 19.2455 17.485 19.3156 17.8432C19.5519 19.0509 19.6701 19.6547 19.4473 19.9951C19.3195 20.1903 19.1275 20.3347 18.9045 20.4033C18.5156 20.5229 17.9728 20.2441 16.8872 19.6865L16.6893 19.5849C16.3325 19.4016 16.1541 19.3099 15.9632 19.2916C15.8997 19.2855 15.8357 19.2855 15.7722 19.2916C15.5814 19.3099 15.4029 19.4016 15.0461 19.5849L14.8482 19.6865C13.7626 20.2441 13.2198 20.5229 12.8309 20.4033C12.6079 20.3347 12.4159 20.1903 12.2882 19.9951C12.0653 19.6547 12.1835 19.0509 12.4198 17.8432C12.4899 17.485 12.5249 17.3059 12.5001 17.1367C12.483 17.0194 12.4451 16.9061 12.3882 16.8021C12.3062 16.652 12.1714 16.531 11.902 16.2889C10.9933 15.4726 10.5389 15.0645 10.504 14.6724C10.4804 14.4082 10.5628 14.1454 10.7331 13.9419C10.9856 13.64 11.5917 13.5644 12.8038 13.4132L12.9395 13.3963C13.3107 13.35 13.4962 13.3269 13.6543 13.2453C13.7361 13.2032 13.8116 13.1499 13.8789 13.0871C14.0088 12.9656 14.094 12.7966 14.2645 12.4585Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    )}
                  </g>
                )}
                {/* Gradients definitions */}
                <defs>
                  <linearGradient id="paint0_linear_fire" x1="2.625" y1="16.4999" x2="16.8337" y2="14.9567" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF4D00" />
                    <stop offset="1" stopColor="#FFB800" />
                  </linearGradient>
                  <linearGradient id="paint0_linear_cold" x1="2.21484" y1="15.75" x2="17.2643" y2="13.821" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#002FFF" />
                    <stop offset="1" stopColor="#3D7EFF" />
                  </linearGradient>
                  <linearGradient id="paint0_linear_blurb" x1="2.0625" y1="15.9375" x2="17.4568" y2="13.9739" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7700FF" />
                    <stop offset="1" stopColor="#B300FF" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_blurb" x1="2.0625" y1="15.9375" x2="17.4568" y2="13.9739" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7700FF" />
                    <stop offset="1" stopColor="#B300FF" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_blurb" x1="2.0625" y1="15.9375" x2="17.4568" y2="13.9739" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7700FF" />
                    <stop offset="1" stopColor="#B300FF" />
                  </linearGradient>
                  <linearGradient id="paint0_linear_star" x1="10.504" y1="20.4033" x2="21.2315" y2="18.7689" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF9D00" />
                    <stop offset="1" stopColor="#F2FF3D" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          );
        })}
      </div>
    );
  }
);

React_Icons.displayName = "React";

export { React_Icons, type ReactProps };
