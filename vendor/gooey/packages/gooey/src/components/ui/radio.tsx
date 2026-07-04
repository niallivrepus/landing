import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { useShouldAnimate } from "../../hooks/use-reduced-motion";

interface RadioProps {
  /**
   * Whether the radio is selected
   */
  checked?: boolean;
  /**
   * Change handler
   */
  onChange?: (checked: boolean) => void;
  /**
   * Whether the radio is disabled
   */
  disabled?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Radio - A 13x13px radio button with glass border and blue fill when selected
 *
 * Visual is 13x13 but touch target is 44x44 for WCAG 2.5.5 compliance.
 */
function Radio({ checked = false, onChange, disabled, className }: RadioProps) {
  const shouldAnimate = useShouldAnimate();

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
    >
      <span
        className="relative size-[13px] rounded-full shrink-0"
        style={{
          border: "1.5px solid var(--color-light-space)",
        }}
      >
        {checked && (
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: 3,
              backgroundColor: "var(--color-blue-4)",
              boxShadow: "none",
            }}
            initial={shouldAnimate ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            exit={shouldAnimate ? { scale: 0, opacity: 0 } : undefined}
            transition={shouldAnimate ? {
              type: "spring",
              stiffness: 500,
              damping: 30,
            } : { duration: 0 }}
          />
        )}
      </span>
    </button>
  );
}

export { Radio, type RadioProps };
