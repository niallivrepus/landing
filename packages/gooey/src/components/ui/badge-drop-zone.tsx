import * as React from "react";
import Matter from "matter-js";

const BADGES = [
  { label: "Developer", color: "orange" },
  { label: "Engineer", color: "green" },
  { label: "Designer", color: "blue" },
  { label: "Architect", color: "purple" },
  { label: "Musician", color: "red" },
  { label: "Artist", color: "yellow" },
] as const;

type BadgeColor = (typeof BADGES)[number]["color"];

const COLORS: Record<BadgeColor, { bg: string; border: string; text: string }> =
  {
    orange: {
      bg: "var(--color-orange-1)",
      border: "var(--color-orange-3)",
      text: "var(--color-orange-4)",
    },
    green: {
      bg: "var(--color-green-1)",
      border: "var(--color-green-3)",
      text: "var(--color-green-5)",
    },
    blue: {
      bg: "var(--color-blue-1)",
      border: "var(--color-blue-2)",
      text: "var(--color-blue-4)",
    },
    purple: {
      bg: "var(--color-purple-1)",
      border: "var(--color-purple-3)",
      text: "var(--color-purple-5)",
    },
    red: {
      bg: "var(--color-red-1)",
      border: "var(--color-red-3)",
      text: "var(--color-red-4)",
    },
    yellow: {
      bg: "var(--color-yellow-1)",
      border: "var(--color-yellow-4)",
      text: "var(--color-yellow-4)",
    },
  };

interface BadgeDropZoneProps {
  variant?: "desktop" | "phone";
  selectedBadge: string | null;
  onSelectBadge: (label: string) => void;
}

export function BadgeDropZone({
  variant = "desktop",
  selectedBadge,
  onSelectBadge,
}: BadgeDropZoneProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const badgeRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const engineRef = React.useRef<any>(null);
  const rafRef = React.useRef<number>(0);
  const bodiesRef = React.useRef<any[]>([]);
  const didDragRef = React.useRef(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const isDesktop = variant === "desktop";
  const badgeHeight = isDesktop ? 56 : 48;
  const fontSize = isDesktop ? 28 : 24;
  const borderWidth = isDesktop ? 4.667 : 4;

  // Measure badge widths using canvas
  const badgeWidths = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return BADGES.map(() => 160);
    ctx.font = `${fontSize}px "Geist Mono", monospace`;
    return BADGES.map((b) => {
      const textWidth = ctx.measureText(b.label).width;
      return textWidth + 48 + borderWidth * 2; // padding (24px each side) + border
    });
  }, [fontSize, borderWidth]);

  // Physics setup
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    // Reduced motion — skip physics, place badges statically
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      BADGES.forEach((_, i) => {
        const el = badgeRefs.current[i];
        if (!el) return;
        const bw = badgeWidths[i];
        const x = width / 2 + (i - 2.5) * 30 - bw / 2;
        const y = height - badgeHeight - 10 - (i % 2) * 20;
        const rot = (i - 2.5) * 0.12;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}rad)`;
      });
      return;
    }

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1 } });
    engineRef.current = engine;

    const wallThickness = 60;
    const floor = Matter.Bodies.rectangle(
      width / 2,
      height + wallThickness / 2,
      width + 200,
      wallThickness,
      { isStatic: true },
    );
    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true },
    );
    const rightWall = Matter.Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true },
    );

    Matter.Composite.add(engine.world, [floor, leftWall, rightWall]);

    // Create badge bodies
    const bodies: any[] = [];
    const margin = 40;
    BADGES.forEach((_, i) => {
      const bw = badgeWidths[i];
      const x = margin + Math.random() * (width - 2 * margin - bw) + bw / 2;
      const y = -80 - i * 60;
      const body = Matter.Bodies.rectangle(x, y, bw, badgeHeight, {
        chamfer: { radius: badgeHeight / 2 },
        restitution: 0.3,
        friction: 0.1,
        frictionAir: 0.01,
        angle: (Math.random() - 0.5) * 0.5,
      });
      bodies.push(body);
    });

    Matter.Composite.add(engine.world, bodies);
    bodiesRef.current = bodies;

    // Mouse constraint for drag-to-fling
    const mouse = Matter.Mouse.create(container);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.Composite.add(engine.world, mouseConstraint);

    // Click vs drag disambiguation
    let dragStartPos = { x: 0, y: 0 };

    Matter.Events.on(mouseConstraint, "startdrag", (e: any) => {
      if (e.body) {
        dragStartPos = { x: mouse.position.x, y: mouse.position.y };
        didDragRef.current = false;
        setIsDragging(true);
      }
    });

    Matter.Events.on(mouseConstraint, "enddrag", () => {
      const dx = mouse.position.x - dragStartPos.x;
      const dy = mouse.position.y - dragStartPos.y;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        didDragRef.current = true;
      }
      setIsDragging(false);
    });

    // Handle mouse released outside container
    const handleWindowMouseUp = () => {
      if (mouseConstraint.body) {
        mouseConstraint.body = null;
        setIsDragging(false);
      }
    };
    window.addEventListener("mouseup", handleWindowMouseUp);

    // Animation loop — always running for drag interaction
    const tick = () => {
      Matter.Engine.update(engine, 16.67);

      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        const el = badgeRefs.current[i];
        if (!el) continue;

        const bw = badgeWidths[i];
        const tx = body.position.x - bw / 2;
        const ty = body.position.y - badgeHeight / 2;
        el.style.transform = `translate(${tx}px, ${ty}px) rotate(${body.angle}rad)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mouseup", handleWindowMouseUp);
      Matter.Events.off(mouseConstraint, "startdrag", undefined as any);
      Matter.Events.off(mouseConstraint, "enddrag", undefined as any);
      Matter.Composite.remove(engine.world, mouseConstraint);
      Matter.Engine.clear(engine);
      Matter.Composite.clear(engine.world, false);
    };
  }, [badgeWidths, badgeHeight]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ cursor: isDragging ? "grabbing" : undefined }}
    >
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, color-mix(in srgb, var(--color-smoke-3) 55%, transparent) 0%, color-mix(in srgb, var(--color-dark-space) 92%, transparent) 100%)",
        }}
      />

      {/* Badge pills */}
      {BADGES.map((badge, i) => {
        const colors = COLORS[badge.color];
        const isSelected = selectedBadge === badge.label;
        return (
          <button
            key={badge.label}
            ref={(el) => {
              badgeRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 select-none whitespace-nowrap"
            style={{
              height: badgeHeight,
              padding: "0 24px",
              backgroundColor: isSelected
                ? "var(--color-dark-space)"
                : colors.bg,
              borderWidth,
              borderStyle: "solid",
              borderColor: isSelected ? "transparent" : colors.border,
              color: isSelected ? "var(--color-light-space)" : colors.text,
              borderRadius: 9999,
              cursor: "grab",
              backdropFilter: "blur(58px)",
              boxShadow: `0px 2px 9px rgba(0,0,0,0.1), inset 0px ${isDesktop ? 4.667 : 4}px ${isDesktop ? 9.333 : 8}px rgba(255,255,255,0.15)`,
              fontFamily: "'Geist Mono', monospace",
              fontSize,
              lineHeight: "normal",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition:
                "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease",
              willChange: "transform",
            }}
            onClick={() => {
              if (didDragRef.current) {
                didDragRef.current = false;
                return;
              }
              onSelectBadge(badge.label);
            }}
          >
            {badge.label}
          </button>
        );
      })}
    </div>
  );
}
