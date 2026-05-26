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
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M4.5 2L8.5 5.99999L4.5 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { ChevronRight, type ChevronRightProps };
