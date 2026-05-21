"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { useHaptics } from "../../hooks/use-haptics";
import { getSpringTransition } from "../../lib/utils/animations";

type RecordState = "off" | "expanding" | "on";

export interface RecordButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  recording?: boolean;
  onRecordChange?: (recording: boolean) => void;
}

export function RecordButton({
  recording,
  onRecordChange,
  className,
  ...props
}: RecordButtonProps) {
  const haptics = useHaptics();
  const isControlled = recording !== undefined;
  const [internalState, setInternalState] = React.useState<RecordState>("off");
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive visual state from controlled prop or internal state
  const state: RecordState = isControlled
    ? internalState === "expanding"
      ? "expanding"
      : recording
        ? "on"
        : "off"
    : internalState;

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = React.useCallback(() => {
    if (state === "off") {
      haptics.expand();
      setInternalState("expanding");

      timerRef.current = setTimeout(() => {
        setInternalState("on");
        onRecordChange?.(true);
      }, 1200);
    } else if (state === "on") {
      haptics.light();
      setInternalState("off");
      onRecordChange?.(false);
    }
    // Ignore clicks during expanding
  }, [state, haptics, onRecordChange]);

  const isActive = state === "expanding" || state === "on";

  return (
    <motion.button
      type="button"
      data-slot="record-button"
      onClick={handleClick}
      animate={{
        width: state === "expanding" ? 57 : 32,
      }}
      transition={
        state === "expanding"
          ? getSpringTransition("snappy")
          : getSpringTransition("standard")
      }
      className={className}
      style={{
        height: 32,
        padding: 12,
        borderRadius: 888,
        background: isActive
          ? "var(--gradient-fruta)"
          : "var(--color-smoke-1)",
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(25px)",
        boxShadow:
          "0px 1px 4px rgba(0,0,0,0.1), inset 0px 2px 4px rgba(255,255,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: state === "expanding" ? "default" : "pointer",
        border: "none",
        outline: "none",
        overflow: "hidden",
        flexShrink: 0,
      }}
      whileHover={state !== "expanding" ? { scale: 1.08 } : undefined}
      whileTap={state !== "expanding" ? { scale: 0.92 } : undefined}
      {...(props as any)}
    >
      {/* White dot */}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--color-light-space)",
          boxShadow:
            "0px 0.5px 1px white, 0px -0.5px 1px rgba(0,0,0,0.5)",
          flexShrink: 0,
        }}
      />

      {/* REC text — visible only during expanding state */}
      <AnimatePresence>
        {state === "expanding" && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={getSpringTransition("snappy")}
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: 9,
              fontWeight: 700,
              color: "var(--color-light-space)",
              lineHeight: 1,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textShadow:
                "0px 0.5px 1px rgba(0,0,0,0.3)",
            }}
          >
            REC
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
