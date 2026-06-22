import type * as React from "react";
import { useGooeyViewport, type GooeyViewportPreference } from "../../hooks/use-viewport";
import { cn } from "../../lib/utils";
import { ClaimIdentity } from "./claim-identity";
import { ContactItem } from "./contact-item";
import type { AvatarProps } from "./avatar";

interface ActionCardUsersProps {
  /** Control ClaimIdentity visibility */
  showClaimIdentity?: boolean;
  onClaimIdentityClick?: () => void;

  /** Contact entries */
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

  /** Optional header content rendered above contacts (e.g. DirectMessageHead) */
  header?: React.ReactNode;

  viewport?: GooeyViewportPreference;
  isDesktop?: boolean;
  className?: string;
}

/**
 * ActionCardUsers — 474px glass action card composing ClaimIdentity
 * ("get-identity" variant) with contact rows underneath.
 *
 * Simplified version of ActionCardContacts without notifications
 * or connection requests.
 */
function ActionCardUsers({
  showClaimIdentity = true,
  onClaimIdentityClick,
  contacts = [],
  header,
  viewport = "auto",
  isDesktop,
  className,
}: ActionCardUsersProps) {
  const resolvedViewport = useGooeyViewport(viewport, isDesktop);
  const isCompact = resolvedViewport === "phone" || resolvedViewport === "tablet";

  return (
    <div
      className={cn(
        "flex w-full max-w-[474px] flex-col items-center gap-1 rounded-[40px] border border-light-glass-10 bg-dark-glass-5 p-3 backdrop-blur-[10px]",
        isCompact && "rounded-[28px]",
        className,
      )}
    >
      {header && <div className="w-full">{header}</div>}
      {showClaimIdentity && (
        <ClaimIdentity
          variant="get-identity"
          onClick={onClaimIdentityClick}
          className="w-full"
        />
      )}

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

export { ActionCardUsers, type ActionCardUsersProps };
