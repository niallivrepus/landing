import * as React from "react";

import { motion } from "motion/react";

interface SequinEffectProps {
  onSwipe?: () => void;
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
}

export function SequinEffect({
  onSwipe,
  children,
  className,
  enabled = true,
}: SequinEffectProps) {
  const [sequins, setSequins] = React.useState<
    Array<{ id: number; x: number; y: number; angle: number }>
  >([]);
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!enabled) return;
      const touch = e.touches[0]!;
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [enabled]
  );

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!enabled || !touchStartRef.current) return;
      const touch = e.touches[0]!;
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > 10) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        const id = Date.now() + Math.random();
        setSequins((prev) => [...prev, { id, x, y, angle }]);

        setTimeout(() => {
          setSequins((prev) => prev.filter((s) => s.id !== id));
        }, 1000);

        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        onSwipe?.();
      }
    },
    [enabled, onSwipe]
  );

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled || !(e.buttons === 1)) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const angle = (Math.random() - 0.5) * 360;

      const id = Date.now() + Math.random();
      setSequins((prev) => {
        if (prev.length > 20) return prev;
        return [...prev, { id, x, y, angle }];
      });

      setTimeout(() => {
        setSequins((prev) => prev.filter((s) => s.id !== id));
      }, 1000);

      onSwipe?.();
    },
    [enabled, onSwipe]
  );

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseMove={handleMouseMove}
      style={{ position: "relative", overflow: "visible" }}
    >
      {children}
      {sequins.map((sequin) => (
        <motion.div
          key={sequin.id}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300 pointer-events-none"
          style={{
            left: sequin.x,
            top: sequin.y,
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.8)",
          }}
          initial={{
            scale: 0,
            rotate: sequin.angle,
            opacity: 1,
          }}
          animate={{
            scale: [0, 1.2, 1],
            rotate: sequin.angle + 180,
            opacity: [1, 1, 0],
            x: Math.cos((sequin.angle * Math.PI) / 180) * 30,
            y: Math.sin((sequin.angle * Math.PI) / 180) * 30,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
