import { cn } from "../../lib/utils";

interface PlusProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size in pixels
   * @default 16
   */
  size?: number;
}

/**
 * Plus - Plus/add icon
 */
function Plus({ className, size = 16 }: PlusProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M8 2.5V8M8 8V13.5M8 8H2.5M8 8H13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { Plus, type PlusProps };
