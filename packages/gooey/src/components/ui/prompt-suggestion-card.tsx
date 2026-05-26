import * as React from "react";
import { cn } from "../../lib/utils";

interface PromptSuggestionCardProps {
  /** Category title displayed top-left */
  title: string;
  /** Category icon displayed before title */
  icon?: React.ReactNode;
  /** List of prompt strings */
  prompts: string[];
  /** Close button callback */
  onClose?: () => void;
  /** Called when a prompt row is clicked */
  onSelect?: (prompt: string) => void;
  /** Called when a prompt row is hovered */
  onHover?: (prompt: string | null) => void;
  className?: string;
}

/**
 * PromptSuggestionCard — glass card listing prompt suggestions for a category.
 *
 * Header: icon + title (left), close button (right).
 * Rows: prompt text with a › chevron, separated by subtle borders.
 * Hover state highlights the row.
 */
function PromptSuggestionCard({
  title,
  icon,
  prompts,
  onClose,
  onSelect,
  onHover,
  className,
}: PromptSuggestionCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-[24px] backdrop-blur-[25px] overflow-hidden",
        "bg-light-glass-5 border border-light-glass-20",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-sm font-bold text-light-space/60">
          {icon && <>{icon} </>}{title}
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex size-[24px] items-center justify-center rounded-full text-light-space/40 hover:text-light-space hover:bg-light-glass-10 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Prompt rows */}
      <div className="flex flex-col" onMouseLeave={() => onHover?.(null)}>
        {prompts.map((prompt, i) => (
          <button
            key={prompt}
            type="button"
            onMouseEnter={() => onHover?.(prompt)}
            onClick={() => onSelect?.(prompt)}
            className="flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-light-space transition-colors hover:bg-light-glass-10"
            style={{
              borderTop: i > 0 ? "1px solid var(--color-light-glass-10)" : undefined,
            }}
          >
            <span>{prompt}</span>
            <span className="text-light-space/30 ml-2">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { PromptSuggestionCard, type PromptSuggestionCardProps };
