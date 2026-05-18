import * as React from "react";

import { motion } from "motion/react";

interface RippleEffectProps {
  onTap?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function RippleEffect({
  onTap,
  children,
  className,
}: RippleEffectProps) {
  const [ripples, setRipples] = React.useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleTap = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      onTap?.();
    },
    [onTap]
  );

  return (
    <div
      className={className}
      onClick={handleTap}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          initial={{
            x: ripple.x,
            y: ripple.y,
            width: 0,
            height: 0,
            opacity: 0.8,
          }}
          animate={{
            width: 200,
            height: 200,
            x: ripple.x - 100,
            y: ripple.y - 100,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
