import { cn } from "../../lib/utils";

interface MessagePreviewProps {
  /** Message snippet text */
  text: string;
  /** Brightens glass bg (light-glass-5 → light-glass-20) */
  hovered?: boolean;
  className?: string;
}

/**
 * MessagePreview — glass text bubble showing a message snippet.
 *
 * Asymmetric border radius (4px top-left, 16px rest) gives a
 * "tail-less speech bubble" feel. Single-line truncated.
 */
function MessagePreview({ text, hovered = false, className }: MessagePreviewProps) {
  return (
    <div
      className={cn(
        "min-w-[177px] max-w-[320px] w-full overflow-hidden",
        "font-sans font-medium text-sm leading-[20px] text-light-space truncate",
        "border-2 border-light-glass-10",
        "backdrop-blur-[10px]",
        "transition-colors duration-150",
        hovered ? "bg-light-glass-20" : "bg-light-glass-5",
        className,
      )}
      style={{
        borderRadius: "4px 16px 16px 16px",
        padding: "8px 8px 8px 12px",
      }}
    >
      {text}
    </div>
  );
}

export { MessagePreview, type MessagePreviewProps };
