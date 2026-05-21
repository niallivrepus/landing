import { PreviewCard } from "./preview-card";
import { AvatarHypeTrain, type OriginColor } from "./avatar-hype-train";
import { Badge } from "./badge";
import { IconOnlyButton } from "./icon-only-button";
import { ChevronRight } from "./chevron-right";

interface NotificationPreviewCardProps {
  /** Card title, e.g. "Missed Calls" */
  title: string;
  /** Number shown in the badge */
  badgeCount: number;
  /** Badge fill color */
  badgeColor: "red" | "green" | "blue" | "purple";
  /** One origin color per avatar (back → middle → front) */
  colors: [OriginColor, OriginColor, OriginColor];
  /** 3 avatar image URLs for the hype train */
  avatarSrcs: [string, string, string];
  /** Force elevated (hover) state */
  elevated?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * NotificationPreviewCard — 80px notification row with avatar hype train,
 * title, count badge, and chevron CTA.
 *
 * Used for grouped notification types like "Missed Calls" and
 * "Other New Connections".
 */
function NotificationPreviewCard({
  title,
  badgeCount,
  badgeColor,
  colors,
  avatarSrcs,
  elevated,
  className,
  onClick,
}: NotificationPreviewCardProps) {
  return (
    <PreviewCard elevated={elevated} className={className} onClick={onClick}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <AvatarHypeTrain avatarSrcs={avatarSrcs} colors={colors} />
        <div className="flex flex-col items-start gap-1 min-w-0">
          <span className="font-sans font-bold text-base leading-[1.4] text-light-space truncate">
            {title}
          </span>
          <Badge color={badgeColor} variant="filled" label={String(badgeCount)} />
        </div>
      </div>
      <div className="shrink-0">
        <IconOnlyButton
          size="medium"
          state="default"
          icon={<ChevronRight size={20} />}
        />
      </div>
    </PreviewCard>
  );
}

export { NotificationPreviewCard, type NotificationPreviewCardProps };
