import { Search01Icon } from "hugeicons-react";
import { AnimatePresence, motion } from "motion/react";

export function SearchPanelToggleGlyph({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <span className={className}>
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.span
            key="square"
            initial={{ scale: 0.72, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.72, opacity: 0, rotate: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex size-[18px] items-center justify-center"
            aria-hidden
          >
            <span className="size-[10px] rounded-[3px] bg-current" />
          </motion.span>
        ) : (
          <motion.span
            key="search"
            initial={{ scale: 0.72, opacity: 0, rotate: 10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.72, opacity: 0, rotate: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex size-[18px] items-center justify-center"
            aria-hidden
          >
            <Search01Icon size={17} strokeWidth={1.5} aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
