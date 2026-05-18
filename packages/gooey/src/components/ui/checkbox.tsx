import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { useShouldAnimate } from "../../hooks/use-reduced-motion";

interface CheckboxProps {
  /**
   * Whether the checkbox is checked
   */
  checked?: boolean;
  /**
   * Change handler
   */
  onChange?: (checked: boolean) => void;
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Checkbox - A 13x13px checkbox with glass border and blue fill when checked
 *
 * Visual is 13x13 but touch target is 44x44 for WCAG 2.5.5 compliance.
 */
function Checkbox({ checked = false, onChange, disabled, className }: CheckboxProps) {
  const shouldAnimate = useShouldAnimate();

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative flex items-center justify-center min-w-[44px] min-h-[44px] rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
    >
      <span
        className="relative size-[13px] rounded-[4px] shrink-0"
        style={{
          border: "1.5px solid var(--color-light-space)",
        }}
      >
        {checked && (
          <motion.div
            className="absolute rounded-[2px]"
            style={{
              inset: 3,
              backgroundColor: "var(--color-blue-4)",
              boxShadow: "inset 0px 1px 1px 0px var(--color-light-glass-20)",
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

export { Checkbox, type CheckboxProps };
