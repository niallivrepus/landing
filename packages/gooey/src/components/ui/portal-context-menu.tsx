import * as React from "react";

import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

import { MenuContext, MenuContextOptionData, Joki } from "./menu-context";

export interface PortalContextMenuProps {
  position: { x: number; y: number } | null;
  onClose: () => void;
  options: MenuContextOptionData[];
  jokis?: Joki[];
  className?: string;
}

export function PortalContextMenu({
  position,
  onClose,
  options,
  jokis,
  className,
}: PortalContextMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!position) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [position, onClose]);

  if (!position) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {position && (
        <motion.div
          key="context-menu"
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            position: "fixed",
            top: position.y,
            left: position.x,
            zIndex: 99999,
          }}
          className={className}
        >
          <MenuContext options={options} jokis={jokis} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
