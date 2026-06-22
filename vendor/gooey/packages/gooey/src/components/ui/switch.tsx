import * as React from "react";
import { motion } from "motion/react";
import { IncognitoIcon } from "hugeicons-react";

import { useHaptics } from "../../hooks/use-haptics";
import { useShouldAnimate } from "../../hooks/use-reduced-motion";
import { cn } from "../../lib/utils";
import { getSpringTransition } from "../../lib/utils/animations";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "incognito";
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  variant = "default",
}: SwitchProps) {
  const haptics = useHaptics();
  const shouldAnimate = useShouldAnimate();

  const handleClick = React.useCallback(() => {
    if (!disabled) {
      haptics.light();
      onCheckedChange(!checked);
    }
  }, [disabled, checked, onCheckedChange, haptics]);

  const track = (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
      transition={getSpringTransition("microPop")}
      className={cn(
        "relative inline-flex h-10 w-16 shrink-0 cursor-pointer items-center rounded-[24px] p-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        background: checked
          ? "var(--color-blue-5)"
          : "var(--color-light-glass-5)",
        border: checked
          ? "1px solid var(--color-light-glass-40)"
          : "1px solid var(--color-light-glass-10)",
        boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
        transition: "background 0.2s ease-out, border-color 0.2s ease-out",
      }}
    >
      <motion.span
        className="pointer-events-none block h-[30px] w-[30px] rounded-full"
        animate={{ x: checked ? 26 : 0 }}
        transition={shouldAnimate ? getSpringTransition("bouncy") : { duration: 0 }}
        style={{
          marginLeft: 3,
          background: checked
            ? "var(--color-light-space)"
            : "var(--color-smoke-4)",
          border: checked
            ? "1px solid var(--color-dark-glass-10)"
            : "1px solid var(--color-light-glass-20)",
          boxShadow: checked
            ? "none"
            : "none",
        }}
      />
    </motion.button>
  );

  if (variant === "incognito") {
    return (
      <div className="flex items-center gap-1">
        {track}
        <motion.button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
          transition={getSpringTransition("microPop")}
          className="flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: "var(--color-light-glass-5)",
            border: "1px solid var(--color-light-glass-20)",
            boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <IncognitoIcon
            size={20}
            color={checked ? "var(--color-light-space)" : "var(--color-smoke-4)"}
            style={{ transition: "color 0.2s ease-out" }}
          />
        </motion.button>
      </div>
    );
  }

  return track;
}
