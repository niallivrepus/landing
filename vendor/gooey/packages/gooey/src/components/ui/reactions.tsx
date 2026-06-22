import * as React from "react";
import { motion } from "motion/react";

import { IconOnlyButton } from "./icon-only-button";
import { useTheme } from "../../hooks/use-theme";
import { cn } from "../../lib/utils";

interface ReactionItem {
  id: string;
  icon: React.ReactNode;
  label?: string;
}

interface ReactionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of reaction buttons to display
   */
  reactions?: ReactionItem[];
  /**
   * Callback when a reaction button is clicked
   */
  onReactionClick?: (reactionId: string) => void;
  /**
   * Callback when the close button is clicked
   */
  onClose?: () => void;
  /**
   * Show the close button
   * @default true
   */
  showCloseButton?: boolean;
}

const Reactions = React.forwardRef<HTMLDivElement, ReactionsProps>(
  (
    {
      className,
      reactions = [
        { id: "rainbow", icon: "🌈", label: "Rainbow" },
        { id: "reaction-1", icon: "😊", label: "Happy" },
        { id: "reaction-2", icon: "😢", label: "Sad" },
        { id: "reaction-3", icon: "🔥", label: "Fire" },
      ],
      onReactionClick,
      onClose,
      showCloseButton = true,
      ...props
    },
    ref
  ) => {
    const { isDarkMode } = useTheme();
    const [closeButtonHovered, setCloseButtonHovered] = React.useState(false);
    const [closeButtonPressed, setCloseButtonPressed] = React.useState(false);

    const handleCloseClick = () => {
      onClose?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-full backdrop-blur-sm",
          className
        )}
        style={{
          backdropFilter: "blur(10px)",
          backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
          border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(0, 0, 0, 0.1)",
          padding: "4px 12px 4px 4px",
          height: "40px",
          width: "fit-content",
        }}
        data-slot="reactions"
        data-node-id="3:99936"
        {...props}
      >
        {/* Close Button - Using IconOnlyButton with interactive states */}
        {showCloseButton && (
          <IconOnlyButton
            size="medium"
            state={
              closeButtonPressed ? "active" : closeButtonHovered ? "hover" : "default"
            }
            onClick={handleCloseClick}
            onMouseEnter={() => setCloseButtonHovered(true)}
            onMouseLeave={() => {
              setCloseButtonHovered(false);
              setCloseButtonPressed(false);
            }}
            onMouseDown={() => setCloseButtonPressed(true)}
            onMouseUp={() => setCloseButtonPressed(false)}
            aria-label="Close reactions"
            style={{ width: "32px", height: "32px" }}
            icon={
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2L14 14M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        )}

        {/* Reaction Buttons */}
        {reactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            className="flex items-center justify-center cursor-pointer shrink-0"
            onClick={() => onReactionClick?.(reaction.id)}
            role="button"
            tabIndex={0}
            aria-label={reaction.label || `Reaction: ${reaction.id}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onReactionClick?.(reaction.id);
              }
            }}
            style={{
              width: "16px",
              height: "16px",
              fontSize: "16px",
              lineHeight: "1",
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
          >
            {reaction.icon}
          </motion.div>
        ))}
      </div>
    );
  }
);

Reactions.displayName = "Reactions";

export { Reactions, type ReactionsProps, type ReactionItem };
