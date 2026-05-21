import * as React from "react";
import { cn } from "../../lib/utils";
import { useGooeyViewport, type GooeyViewportPreference } from "../../hooks/use-viewport";

interface PreviewCardProps {
  children: React.ReactNode;
  /** Force elevated (hover) state */
  elevated?: boolean;
  viewport?: GooeyViewportPreference;
  isDesktop?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * PreviewCard — 80px glass-morphism shell shared by all preview card types.
 *
 * Encapsulates the default/elevated state transition so each card variant
 * (MessagePreviewItem, ContactItem, NotificationPreviewCard, etc.)
 * gets consistent hover behaviour without duplicating styles.
 */
function PreviewCard({
  children,
  elevated = false,
  viewport = "auto",
  isDesktop,
  className,
  onClick,
}: PreviewCardProps) {
  const [hovered, setHovered] = React.useState(false);
  const isElevated = elevated || hovered;
  const resolvedViewport = useGooeyViewport(viewport, isDesktop);
  const isCompact = resolvedViewport === "phone" || resolvedViewport === "tablet";

  return (
    <div
      className={cn(
        "flex w-full rounded-[20px] border-2 p-3 cursor-pointer transition-all duration-200",
        isCompact
          ? "min-h-[104px] flex-col items-stretch justify-start gap-3"
          : "min-h-[80px] items-center justify-between",
        isElevated
          ? "bg-light-glass-5 border-light-glass-20 backdrop-blur-[25px] shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),inset_0px_1px_2px_0px_rgba(255,255,255,0.1)]"
          : "bg-dark-glass-20 border-light-glass-10 backdrop-blur-[10px]",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export { PreviewCard, type PreviewCardProps };
