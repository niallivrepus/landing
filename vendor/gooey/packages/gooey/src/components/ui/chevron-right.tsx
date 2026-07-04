import { cn } from "../../lib/utils";

interface ChevronRightProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size in pixels
   * @default 12
   */
  size?: number;
}

/**
 * ChevronRight - Right-pointing chevron icon for breadcrumbs and navigation
 */
function ChevronRight({ className, size = 12 }: ChevronRightProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M9 5L16 12L9 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { ChevronRight, type ChevronRightProps };
