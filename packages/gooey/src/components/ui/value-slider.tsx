import { useCallback, useRef } from "react";
import { SliderPoint } from "./slider-point";

const ENERGY_GRADIENT =
  "linear-gradient(90deg, rgb(255, 10, 0) 0%, rgb(255, 98, 9) 14%, rgb(255, 184, 0) 28.5%, rgb(0, 209, 8) 100%)";

interface ValueSliderProps {
  value: number;
  onChange?: (value: number) => void;
  step?: number;
  className?: string;
}

export function ValueSlider({ value, onChange, step, className }: ValueSliderProps) {
  const isDragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const computeValue = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return value;
      let v = (clientX - rect.left) / rect.width;
      v = Math.max(0, Math.min(1, v));
      if (step) v = Math.round(v / step) * step;
      return v;
    },
    [value, step],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      onChange?.(computeValue(e.clientX));

      const onMove = (ev: PointerEvent) => {
        if (!isDragging.current) return;
        onChange?.(computeValue(ev.clientX));
      };

      const onUp = () => {
        isDragging.current = false;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [onChange, computeValue],
  );

  const pct = `${value * 100}%`;
  const bgSize = value > 0 ? `${(1 / value) * 100}% 100%` : "100% 100%";

  return (
    <div
      ref={trackRef}
      className={`relative h-6 w-full cursor-pointer rounded-full bg-light-glass-5 ${className ?? ""}`}
      onPointerDown={onPointerDown}
    >
      {/* Gradient fill */}
      <div
        className="absolute left-0 top-0 h-full overflow-hidden rounded-full"
        style={{ width: pct }}
      >
        <div
          className="h-full w-full"
          style={{
            background: ENERGY_GRADIENT,
            backgroundSize: bgSize,
          }}
        />
      </div>

      {/* Thumb */}
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ left: pct }}
      >
        <SliderPoint className="size-8 border-[3px]" />
      </div>
    </div>
  );
}
