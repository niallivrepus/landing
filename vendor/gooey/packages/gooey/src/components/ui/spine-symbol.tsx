import * as React from "react";

import { cn } from "../../lib/utils";

export interface SpineSymbolProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
}

function SpineSymbol({ className, size = 20, style, ...props }: SpineSymbolProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0 items-center justify-center text-current", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 3V17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path d="M6 4H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 13H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 16H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export { SpineSymbol };
