import { Cancel01Icon } from "hugeicons-react";
import { AnimatePresence, motion } from "motion/react";

import { useTheme } from "../../hooks/use-theme";
import { useTrayContext } from "../../hooks/use-tray-context";
import { useShouldAnimate } from "../../hooks/use-reduced-motion";
import { cn } from "../../lib/utils";
import { getSpringTransition } from "../../lib/utils/animations";

const TRAY_HEIGHTS = {
  small: 200,
  medium: 320,
  large: 440,
  xlarge: 560,
  auto: "auto" as const,
};

function getTrayHeight(
  index: number,
  height?: number | "auto"
): number | "auto" {
  if (height === "auto") return "auto";
  if (typeof height === "number") return height;

  const baseHeights = [
    TRAY_HEIGHTS.medium,
    TRAY_HEIGHTS.large,
    TRAY_HEIGHTS.xlarge,
    TRAY_HEIGHTS.medium,
  ];
  return baseHeights[index % baseHeights.length]!;
}

export function TrayContainer() {
  const { trays, closeTray, navigateBack } = useTrayContext();
  const shouldAnimate = useShouldAnimate();
  const { isDarkMode } = useTheme();

  if (trays.length === 0) return null;

  return (
    <AnimatePresence>
      {trays.map((tray, index) => {
        const height = getTrayHeight(index, tray.height);
        const canNavigateBack = tray.canNavigateBack !== false && index > 0;
        const theme = tray.theme || (isDarkMode ? "dark" : "light");

        return (
          <motion.div
            key={tray.id}
            initial={shouldAnimate ? { opacity: 0, y: 20, scale: 0.95 } : {}}
            animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : {}}
            exit={shouldAnimate ? { opacity: 0, y: 20, scale: 0.95 } : {}}
            transition={
              shouldAnimate ? getSpringTransition("standard") : { duration: 0 }
            }
            style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "420px",
              height: typeof height === "number" ? `${height}px` : height,
              maxHeight: "80vh",
              zIndex: 10000 + index,
            }}
            className={cn(
              "rounded-2xl shadow-2xl overflow-hidden",
              theme === "dark"
                ? "bg-gray-900 border border-gray-800"
                : "bg-white border border-gray-200"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div
                className={cn(
                  "flex items-center justify-between px-6 py-4 border-b",
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  {canNavigateBack && (
                    <button
                      type="button"
                      onClick={() => navigateBack()}
                      className={cn(
                        "p-1.5 rounded-lg ",
                        theme === "dark"
                          ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                          : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 12L6 8L10 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                  {tray.icon && (
                    <div
                      className={cn(
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      {tray.icon}
                    </div>
                  )}
                  <h3
                    className={cn(
                      "text-lg font-semibold",
                      theme === "dark" ? "text-light-space" : "text-gray-900"
                    )}
                  >
                    {tray.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => closeTray(tray.id)}
                  className={cn(
                    "p-1.5 rounded-lg ",
                    theme === "dark"
                      ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Cancel01Icon className="h-4 w-4" />
                </button>
              </div>
              <div
                className={cn(
                  "flex-1 overflow-y-auto",
                  theme === "dark" ? "text-gray-200" : "text-gray-900"
                )}
              >
                {tray.content}
              </div>
            </div>
          </motion.div>
        );
      })}
      {trays.length > 0 && (
        <motion.div
          initial={shouldAnimate ? { opacity: 0 } : {}}
          animate={shouldAnimate ? { opacity: 1 } : {}}
          exit={shouldAnimate ? { opacity: 0 } : {}}
          transition={shouldAnimate ? { duration: 0.2 } : { duration: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
          onClick={() => closeTray()}
        />
      )}
    </AnimatePresence>
  );
}
