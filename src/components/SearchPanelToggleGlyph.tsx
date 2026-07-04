import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function SearchPanelToggleGlyph({
  open,
  className,
  whenOpen = "square",
}: {
  open: boolean;
  className?: string;
  whenOpen?: "square" | "close";
}) {
  return (
    <span className={className}>
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.span
            key={whenOpen === "close" ? "close" : "square"}
            initial={{ scale: 0.72, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.72, opacity: 0, rotate: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex size-[18px] items-center justify-center"
            aria-hidden
          >
            {whenOpen === "close" ? (
              <X className="size-[17px]" strokeWidth={1.75} aria-hidden />
            ) : (
              <span className="size-[10px] rounded-[3px] bg-current" />
            )}
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
            <Search className="size-[17px]" strokeWidth={1.75} aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
