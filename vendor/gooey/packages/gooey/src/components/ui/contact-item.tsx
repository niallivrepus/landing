import * as React from "react";
import { cn } from "../../lib/utils";
import { useGooeyViewport, type GooeyViewportPreference } from "../../hooks/use-viewport";
import { Avatar, type AvatarProps } from "./avatar";
import { RightHandMenu } from "./right-hand-menu";
import { Call02Icon, MessageMultiple01Icon, MoreHorizontalIcon } from "hugeicons-react";

interface ContactItemProps {
  name: string;
  avatarSrc?: string;
  /** Convex user ID — pass "jokuh-bot" for AI avatar */
  userId?: string;
  /** Show OO mascot avatar instead of profile image */
  showOO?: boolean;
  originColor?: AvatarProps["originColor"];
  onCall?: () => void;
  onMessage?: () => void;
  onMore?: () => void;
  /** Force elevated (hover) state */
  elevated?: boolean;
  viewport?: GooeyViewportPreference;
  isDesktop?: boolean;
  className?: string;
}

/**
 * ContactItem — 80px-tall contacts list row.
 *
 * Composes Avatar and IconOnlyButton into a glass card
 * with default and elevated states matching MessagePreviewItem.
 */
function ContactItem({
  name,
  avatarSrc,
  userId,
  showOO,
  originColor,
  onCall,
  onMessage,
  onMore,
  elevated = false,
  viewport = "auto",
  isDesktop,
  className,
}: ContactItemProps) {
  const [hovered, setHovered] = React.useState(false);
  const isElevated = elevated || hovered;
  const resolvedViewport = useGooeyViewport(viewport, isDesktop);
  const isCompact = resolvedViewport === "phone" || resolvedViewport === "tablet";

  return (
    <div
      className={cn(
        "flex w-full rounded-[16px] border p-3 cursor-pointer transition-all duration-200",
        isCompact
          ? "min-h-[112px] flex-col items-stretch gap-3"
          : "h-[80px] items-center gap-3",
        isElevated
          // raise the whole row above sibling cards so the menu's drop-down
          // tooltip isn't clipped by the next card's stacking context.
          ? "relative z-30 bg-light-glass-5 border-light-glass-20 backdrop-blur-[25px] shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]"
          : "bg-dark-glass-20 border-light-glass-10 backdrop-blur-[10px]",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div className={cn("flex-shrink-0", isCompact && "self-start")}>
        <Avatar
          src={avatarSrc}
          userId={userId}
          showOO={showOO}
          size="compact"
          borderStyle={originColor ? "origins" : "default"}
          originColor={originColor}
          showStoryRing={false}
          disableNavigation
        />
      </div>

      {/* Name */}
      <span className={cn("flex-1 min-w-0 truncate font-sans font-bold leading-[1.4] text-light-space", isCompact ? "text-[0.95rem]" : "text-base")}>
        {name}
      </span>

      {/* Action buttons — horizontal right-hand-menu pill, revealed on hover */}
      {isElevated && (
        <div className={cn("flex flex-shrink-0 items-center", isCompact && "w-full justify-end")}>
          <RightHandMenu
            side="bottom"
            className="py-1"
            items={[
              { id: "call", icon: <Call02Icon size={20} />, label: `Call ${name}`, onSelect: onCall },
              { id: "message", icon: <MessageMultiple01Icon size={20} />, label: `Message ${name}`, onSelect: onMessage },
              { id: "more", icon: <MoreHorizontalIcon size={20} />, label: `More options for ${name}`, onSelect: onMore },
            ]}
          />
        </div>
      )}
    </div>
  );
}

export { ContactItem, type ContactItemProps };
