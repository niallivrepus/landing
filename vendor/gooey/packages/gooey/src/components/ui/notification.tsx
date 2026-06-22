import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface NotificationProps {
  /**
   * Color variant of the notification dot
   * @default "alert"
   */
  variant?: "alert" | "success";
  /**
   * Size of the notification dot in pixels
   * @default 11
   */
  size?: number;
  /**
   * Number of projectile dots for burst animation
   * @default 5
   */
  count?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

interface NotificationRef {
  burst: () => void;
}

const MAX_PROJECTILES = 12;

/**
 * ProjectileDot — follows an elliptical orbit that starts and ends at the center.
 *
 * Parametric ellipse through origin (t: 0→2π):
 *   px(t) = a × (1 − cos(t))
 *   py(t) = −b × sin(t)
 * Rotated by θ = π/2 + angle so initial velocity aims outward at `angle`.
 */
function ProjectileDot({
  index,
  total,
  size,
  color,
  duration = 0.7,
  stagger = 0.05,
}: {
  index: number;
  total: number;
  size: number;
  color: string;
  duration?: number;
  stagger?: number;
}) {
  const a = size * 2;
  const b = size * 0.8;
  const dotSize = size * 0.5;
  const angle = (2 * Math.PI * index) / total;
  const theta = Math.PI / 2 + angle;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  // Sample 60 keyframe positions along the ellipse
  const steps = 60;
  const xKeys: number[] = [];
  const yKeys: number[] = [];
  const opacityKeys: number[] = [];
  const times: number[] = [];

  for (let s = 0; s <= steps; s++) {
    const progress = s / steps;
    // Non-uniform timing: fast launch → slow apex → fast return
    const t = (0.5 - 0.5 * Math.cos(progress * Math.PI)) * 2 * Math.PI;
    const px = a * (1 - Math.cos(t));
    const py = -b * Math.sin(t);
    xKeys.push(px * cosT - py * sinT);
    yKeys.push(px * sinT + py * cosT);
    times.push(progress);

    // Opacity: fade in over first 15%, full in middle, fade out last 15%
    let opacity = 1;
    if (progress < 0.15) opacity = progress / 0.15;
    else if (progress > 0.85) opacity = (1 - progress) / 0.15;
    opacityKeys.push(opacity);
  }

  return (
    <motion.div
      style={{
        position: "absolute",
        width: dotSize,
        height: dotSize,
        borderRadius: "50%",
        backgroundColor: color,
        top: "50%",
        left: "50%",
        marginTop: -dotSize / 2,
        marginLeft: -dotSize / 2,
      }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{ x: xKeys, y: yKeys, opacity: opacityKeys }}
      transition={{
        duration,
        delay: index * stagger,
        times,
        ease: "linear",
      }}
    />
  );
}

/**
 * Notification - A small circular indicator dot with burst animation
 *
 * Used to show notification status, unread counts, or activity indicators.
 * Call `burst()` via ref to trigger projectile dots that orbit out and return.
 */
const Notification = React.forwardRef<NotificationRef, NotificationProps>(
  function Notification({ variant = "alert", size = 11, count = 5, className }, ref) {
    const [burstKey, setBurstKey] = React.useState(0);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const color = variant === "success" ? "#21dc11" : "#ff0700";
    const visibleCount = Math.min(Math.max(count, 0), MAX_PROJECTILES);
    const totalDuration = 0.7 + visibleCount * 0.05;

    React.useImperativeHandle(ref, () => ({
      burst() {
        if (timerRef.current) clearTimeout(timerRef.current);
        setBurstKey((k) => k + 1);
        setIsAnimating(true);
        timerRef.current = setTimeout(() => {
          setIsAnimating(false);
        }, totalDuration * 1000 + 50);
      },
    }));

    React.useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    return (
      <div className={cn("relative", className)} style={{ overflow: "visible" }}>
        {/* Screen reader announcement */}
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {isAnimating ? (variant === "success" ? "Success notification" : "Alert notification") : ""}
        </span>
        {/* Main dot */}
        <div
          className="relative overflow-hidden rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
          data-slot="notification"
        >
          {/* Rimlight inner shadow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ boxShadow: "none" }}
          />
        </div>

        {/* Projectile dots */}
        {isAnimating &&
          Array.from({ length: visibleCount }, (_, i) => (
            <ProjectileDot
              key={`${burstKey}-${i}`}
              index={i}
              total={visibleCount}
              size={size}
              color={color}
            />
          ))}
      </div>
    );
  },
);

export { Notification, type NotificationProps, type NotificationRef };
