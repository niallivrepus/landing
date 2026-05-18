import * as React from "react";

import { getSvgPath } from "figma-squircle";

import { cn } from "../../lib/utils";

function useMeasure<T extends HTMLElement>() {
  const [bounds, setBounds] = React.useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const box = entry.borderBoxSize?.[0];
        if (box) {
          setBounds({ width: box.inlineSize, height: box.blockSize });
        } else {
          setBounds({ width: entry.contentRect.width, height: entry.contentRect.height });
        }
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, bounds] as const;
}

interface SquircleProps extends React.ComponentPropsWithoutRef<"div"> {
  cornerRadius?: number | number[];
  cornerSmoothing?: number;
  strokeClassName?: string;
  showBorder?: boolean;
  borderWidth?: number;
  allowOverflow?: boolean;
  rimLight?: boolean;
}

function Squircle({
  children,
  cornerRadius = 40,
  cornerSmoothing = 1,
  strokeClassName,
  showBorder = true,
  borderWidth = 2.5,
  allowOverflow = false,
  rimLight = false,
  ...props
}: SquircleProps) {
  const id = React.useId();
  const [ref, bounds] = useMeasure<HTMLDivElement>();

  /* Safe expansion of cornerRadius array to 4 values (TL, TR, BR, BL) matching CSS standards */
  const corners = React.useMemo(() => {
    if (!Array.isArray(cornerRadius)) {
      return [cornerRadius, cornerRadius, cornerRadius, cornerRadius];
    }
    const c = cornerRadius;
    if (c.length === 0) return [0, 0, 0, 0];
    if (c.length === 1) return [c[0], c[0], c[0], c[0]];
    if (c.length === 2) return [c[0], c[1], c[0], c[1]]; // TL/BR, TR/BL
    if (c.length === 3) return [c[0], c[1], c[2], c[1]]; // TL, TR/BL, BR
    return [c[0], c[1], c[2], c[3]]; // TL, TR, BR, BL
  }, [cornerRadius]);

  const path = getSvgPath({
    cornerSmoothing,
    width: bounds.width,
    height: bounds.height,
    topLeftCornerRadius: corners[0],
    topRightCornerRadius: corners[1],
    bottomRightCornerRadius: corners[2],
    bottomLeftCornerRadius: corners[3],
  });

  const useClipPath =
    path && bounds.width > 0 && bounds.height > 0 && !allowOverflow;

  return (
    <div
      ref={ref}
      {...props}
      className={cn("relative", props.className)}
      style={{
        borderRadius: `${corners[0]}px ${corners[1]}px ${corners[2]}px ${corners[3]}px`,
        ...(useClipPath && { clipPath: `path('${path}')` }),
        overflow: allowOverflow ? "visible" : "hidden",
        ...props.style,
      }}
    >
      {(showBorder || rimLight) && path && bounds.width > 0 && bounds.height > 0 && (
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width={bounds.width}
          height={bounds.height}
          style={{
            shapeRendering: "geometricPrecision",
            zIndex: 2,
          }}
        >
          {rimLight && (
            <>
              <defs>
                <linearGradient id={`rim-grad-${id}`} x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity={0.25} />
                  <stop offset="35%" stopColor="white" stopOpacity={0} />
                </linearGradient>
                <filter id={`rim-blur-${id}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                </filter>
              </defs>
              <path
                d={path}
                fill="none"
                stroke={`url(#rim-grad-${id})`}
                strokeWidth={8}
                filter={`url(#rim-blur-${id})`}
              />
            </>
          )}
          {showBorder && (
            <path
              className={cn(
                "stroke-black/10 dark:stroke-white/10",
                strokeClassName
              )}
              d={path}
              fill="none"
              strokeWidth={borderWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      )}
      {children}
    </div>
  );
}

export { Squircle, type SquircleProps };
export default Squircle;
