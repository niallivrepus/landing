import { useGooeyViewport, type GooeyViewportPreference } from "../../hooks/use-viewport";
import { cn } from "../../lib/utils";
import { ClaimIdentity } from "./claim-identity";
import { NotificationPreviewCard } from "./notification-preview-card";
import { ConnectionRequestCard } from "./connection-request-card";
import { ContactItem } from "./contact-item";
import type { AvatarProps } from "./avatar";
import type { OriginColor } from "./avatar-hype-train";

interface ActionCardContactsProps {
  /** Control ClaimIdentity visibility and variant */
  showClaimIdentity?: boolean;
  claimIdentityVariant?: "get-identity" | "get-your-identity";
  onClaimIdentityClick?: () => void;

  /** Notification sections (missed calls, new connections) */
  notifications?: Array<{
    title: string;
    badgeCount: number;
    badgeColor: "red" | "green" | "blue" | "purple";
    colors: [OriginColor, OriginColor, OriginColor];
    avatarSrcs: [string, string, string];
    onClick?: () => void;
  }>;

  /** Connection requests (max 3 shown) */
  connectionRequests?: Array<{
    name: string;
    avatarSrc?: string;
    onDecline?: () => void;
    onApprove?: () => void;
  }>;

  /** Contact entries */
  contacts?: Array<{
    name: string;
    avatarSrc?: string;
    userId?: string;
    showOO?: boolean;
    originColor?: AvatarProps["originColor"];
    onCall?: () => void;
    onMessage?: () => void;
    onMore?: () => void;
  }>;

  viewport?: GooeyViewportPreference;
  isDesktop?: boolean;
  className?: string;
}

/**
 * ActionCardContacts — 474px glass action card composing ClaimIdentity,
 * notification previews, connection requests, and contact rows.
 *
 * Matches the Figma "cards / contacts" (3:38967) composition.
 */
function ActionCardContacts({
  showClaimIdentity = true,
  claimIdentityVariant = "get-your-identity",
  onClaimIdentityClick,
  notifications = [],
  connectionRequests = [],
  contacts = [],
  viewport = "auto",
  isDesktop,
  className,
}: ActionCardContactsProps) {
  const resolvedViewport = useGooeyViewport(viewport, isDesktop);
  const isCompact = resolvedViewport === "phone" || resolvedViewport === "tablet";

  return (
    <div
      className={cn(
        "flex w-full max-w-[474px] flex-col items-center gap-1 rounded-[40px] border-2 border-light-glass-10 bg-dark-glass-5 p-3 backdrop-blur-[10px]",
        isCompact && "rounded-[28px]",
        className,
      )}
    >
      {showClaimIdentity && (
        <ClaimIdentity
          variant={claimIdentityVariant}
          onClick={onClaimIdentityClick}
          className="w-full"
        />
      )}

      {notifications.map((notif, i) => (
        <NotificationPreviewCard
          key={`notif-${i}`}
          className="w-full"
          title={notif.title}
          badgeCount={notif.badgeCount}
          badgeColor={notif.badgeColor}
          colors={notif.colors}
          avatarSrcs={notif.avatarSrcs}
          onClick={notif.onClick}
        />
      ))}

      {connectionRequests.slice(0, 3).map((req, i) => (
        <ConnectionRequestCard
          key={`req-${i}`}
          className="w-full"
          name={req.name}
          avatarSrc={req.avatarSrc}
          onDecline={req.onDecline}
          onApprove={req.onApprove}
        />
      ))}

      {contacts.map((contact, i) => (
        <ContactItem
          key={`contact-${i}`}
          className="w-full"
          name={contact.name}
          avatarSrc={contact.avatarSrc}
          userId={contact.userId}
          showOO={contact.showOO}
          originColor={contact.originColor}
          viewport={resolvedViewport}
          onCall={contact.onCall}
          onMessage={contact.onMessage}
          onMore={contact.onMore}
        />
      ))}
    </div>
  );
}

export { ActionCardContacts, type ActionCardContactsProps };
