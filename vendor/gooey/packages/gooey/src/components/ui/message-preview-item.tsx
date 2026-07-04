import * as React from "react";
import { cn } from "../../lib/utils";
import { useGooeyViewport, type GooeyViewportPreference } from "../../hooks/use-viewport";
import { Avatar, type AvatarProps } from "./avatar";
import { Badge } from "./badge";

import { ImageStack } from "./image-stack";
import { MessagePreview } from "./message-preview";

interface MessagePreviewItemBadge {
  type: "ai" | "count" | "mail" | "missed-call";
  value?: string | number;
}

interface MessagePreviewItemProps {
  /** Display name */
  name: string;
  /** Message snippet text */
  messagePreview: string;
  /** Avatar source URL */
  avatarSrc?: string;
  /** Origin color for avatar border */
  originColor?: AvatarProps["originColor"];
  /** Category icon next to name (e.g. diamond) */
  categoryIcon?: React.ReactNode;
  /** Right-side badges */
  badges?: MessagePreviewItemBadge[];
  /** Show image stack before badges */
  showImageStack?: boolean;
  /** Image URLs for the image stack */
  imageStackSrcs?: string[];
  /** Elevate/glow the card (hover state) */
  elevated?: boolean;
  viewport?: GooeyViewportPreference;
  isDesktop?: boolean;
  className?: string;
  onClick?: () => void;
}

function UnreadCountBadge({ value }: { value?: string | number }) {
  const label = String(value ?? "");

  return (
    <span
      aria-label={`${label} unread`}
      className={cn(
        "inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-green-4 px-2 font-sans text-xs font-semibold leading-none text-green-1 tabular-nums shadow-[0px_1px_4px_rgba(0,0,0,0.1)] select-none",
        label.length <= 1 && "px-0",
      )}
    >
      {label}
    </span>
  );
}

/**
 * MessagePreviewItem — 80px-tall conversation list row.
 *
 * Composes Avatar, MessagePreview, Badge, and ImageStack
 * into a glass card with default and elevated states.
 */
function MessagePreviewItem({
  name,
  messagePreview,
  avatarSrc,
  originColor,
  categoryIcon,
  badges = [],
  showImageStack = false,
  imageStackSrcs = [],
  elevated = false,
  viewport = "auto",
  isDesktop,
  className,
  onClick,
}: MessagePreviewItemProps) {
  const [hovered, setHovered] = React.useState(false);
  const isElevated = elevated || hovered;
  const resolvedViewport = useGooeyViewport(viewport, isDesktop);
  const isCompact = resolvedViewport === "phone" || resolvedViewport === "tablet";

  return (
    <div
      className={cn(
        "flex w-full max-w-[434px] rounded-[16px] border p-3 cursor-pointer transition-all duration-200",
        isCompact
          ? "min-h-[104px] flex-col items-stretch gap-3"
          : "min-h-[80px] items-center gap-3",
        isElevated
          ? "bg-light-glass-5 border-light-glass-20 backdrop-blur-[25px] shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]"
          : "bg-dark-glass-20 border-light-glass-10 backdrop-blur-[10px]",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Avatar — plain image with a simple inside stroke (no origin ring) */}
      <div className={cn("relative flex-shrink-0", isCompact && "self-start")}>
        <Avatar
          src={avatarSrc}
          size="medium"
          borderStyle="none"
          originColor={originColor}
          showStoryRing={false}
          disableNavigation
        />
        <span className="pointer-events-none absolute inset-0 rounded-[999px] shadow-[inset_0_0_0_1px_var(--color-light-glass-20)]" />
      </div>

      {/* Name + message preview */}
      <div className={cn("flex min-w-0 flex-1 flex-col gap-1", isCompact && "w-full gap-0.5")}>
        <div className="flex items-center gap-1">
          <span className={cn("font-sans font-medium text-sm text-light-space truncate", isCompact && "text-[0.95rem]")}>
            {name}
          </span>
          {categoryIcon && (
            <span className="flex-shrink-0 flex items-center">{categoryIcon}</span>
          )}
        </div>
        <MessagePreview text={messagePreview} hovered={isElevated} />
      </div>

      {/* Right-side badges */}
      {(badges.length > 0 || showImageStack) && (
        <div className={cn("flex flex-shrink-0 items-center gap-1.5", isCompact && "w-full flex-wrap justify-end")}>
          {showImageStack && imageStackSrcs.length > 0 && (
            <ImageStack images={imageStackSrcs} className={cn("size-[40px]", isCompact && "size-8")} />
          )}
          {badges.map((badge, i) => {
            switch (badge.type) {
              case "ai":
                // dark pill behind so the badge's glass refracts a dark backdrop
                // (crisp, like the spine) instead of the washed-out card surface.
                return (
                  <span key={i} className="relative isolate inline-flex">
                    <span className="absolute inset-0 rounded-full bg-dark-space" />
                    <Badge color="neutral" variant="outline" label="AI" className="relative" />
                  </span>
                );
              case "count":
                return <UnreadCountBadge key={i} value={badge.value} />;
              case "missed-call":
                return <Badge key={i} color="red" variant="filled" label={String(badge.value ?? "")} className="h-auto py-0.5 px-1.5" />;
              case "mail":
                return <Badge key={i} color="blue" variant="outline" label="Mail" />;
              default:
                return null;
            }
          })}
        </div>
      )}
    </div>
  );
}

export { MessagePreviewItem, type MessagePreviewItemProps, type MessagePreviewItemBadge };
