import { cn } from "../../lib/utils";

interface MessagePreviewProps {
  /** Message snippet text */
  text: string;
  /** Brightens glass bg (light-glass-5 → light-glass-20) */
  hovered?: boolean;
  className?: string;
}

/**
 * MessagePreview — plain message snippet line.
 *
 * Single-line truncated, muted text. Brightens slightly on hover.
 */
function MessagePreview({ text, hovered = false, className }: MessagePreviewProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden",
        "font-sans font-normal text-sm leading-[20px] truncate",
        "transition-colors duration-150",
        hovered ? "text-light-space/80" : "text-light-space/55",
        className,
      )}
    >
      {text}
    </div>
  );
}

export { MessagePreview, type MessagePreviewProps };
