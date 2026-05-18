import { PreviewCard } from "./preview-card";
import { Avatar } from "./avatar";
import { Verified } from "./verified";
import { ActionCircleButton } from "./action-circle-button";
import { Cancel01Icon, Tick01Icon } from "hugeicons-react";

interface ConnectionRequestCardProps {
  /** Display name */
  name: string;
  /** Avatar image URL */
  avatarSrc?: string;
  /** Force elevated (hover) state */
  elevated?: boolean;
  className?: string;
  onDecline?: () => void;
  onApprove?: () => void;
}

/**
 * ConnectionRequestCard — 80px connection request row with verified avatar,
 * name, and approve/decline action circles.
 */
function ConnectionRequestCard({
  name,
  avatarSrc,
  elevated,
  className,
  onDecline,
  onApprove,
}: ConnectionRequestCardProps) {
  return (
    <PreviewCard elevated={elevated} className={className}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Avatar with verified badge */}
        <div className="relative shrink-0">
          <Avatar
            src={avatarSrc}
            size="medium"
            borderStyle="origins"
            originColor="insight"
            showStoryRing={false}
            disableNavigation
          />
          <div className="absolute -top-[5px] -right-[5px] z-10">
            <Verified size={16} variant="life" />
          </div>
        </div>

        {/* Name */}
        <span className="font-sans font-bold text-base leading-[1.4] text-light-space truncate flex-1 min-w-0">
          {name}
        </span>
      </div>

      {/* Decline / Approve actions */}
      <div className="flex gap-1 shrink-0">
        <ActionCircleButton
          energy="red"
          variant="secondary"
          icon={<Cancel01Icon size={20} />}
          onClick={onDecline}
        />
        <ActionCircleButton
          energy="green"
          variant="secondary"
          icon={<Tick01Icon size={20} />}
          onClick={onApprove}
        />
      </div>
    </PreviewCard>
  );
}

export { ConnectionRequestCard, type ConnectionRequestCardProps };
