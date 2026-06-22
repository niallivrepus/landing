import * as React from "react";

import { motion } from "motion/react";

interface ConfettiProps {
  onComplete?: () => void;
  particleCount?: number;
  duration?: number;
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
];

export function Confetti({
  onComplete,
  particleCount = 50,
  duration = 2000,
}: ConfettiProps) {
  const [particles, setParticles] = React.useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      angle: number;
      velocity: number;
    }>
  >([]);

  React.useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: (Math.random() - 0.5) * 360,
      velocity: 0.5 + Math.random() * 0.5,
    }));

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timeout);
  }, [particleCount, duration, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100000] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{
            rotate: particle.angle,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: particle.angle + 720,
            x: Math.cos((particle.angle * Math.PI) / 180) * 200,
            scale: [1, 1.2, 0.8, 0],
            opacity: [1, 1, 1, 0],
          }}
          transition={{
            duration: duration / 1000,
            ease: "easeOut",
            delay: Math.random() * 0.2,
          }}
        />
      ))}
    </div>
  );
}
