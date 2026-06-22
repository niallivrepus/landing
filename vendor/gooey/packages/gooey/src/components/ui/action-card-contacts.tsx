import * as React from "react";
import { useGooeyViewport, type GooeyViewportPreference } from "../../hooks/use-viewport";
import { cn } from "../../lib/utils";
import { ClaimIdentity } from "./claim-identity";
import { NotificationPreviewCard } from "./notification-preview-card";
import { ConnectionRequestCard } from "./connection-request-card";
import { ContactItem } from "./contact-item";
import { Badge } from "./badge";
import { IconOnlyButton } from "./icon-only-button";
import { ChevronRight } from "./chevron-right";
import type { AvatarProps } from "./avatar";
import type { HypeTrainColor } from "./avatar-hype-train";

/** A single person inside a notification's detail view. */
interface DetailPerson {
  name: string;
  avatarSrc?: string;
  originColor?: AvatarProps["originColor"];
  /** connections variant */
  onApprove?: () => void;
  onDecline?: () => void;
  /** calls variant */
  onCall?: () => void;
  onMessage?: () => void;
  onMore?: () => void;
}

/** Top-right action button for a detail view header. */
interface DetailAction {
  icon: React.ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
  /** Clear every row from the list when pressed (e.g. "clear notifications"). */
  clearsList?: boolean;
}

/** Collapsed batch view behind a notification row. */
interface NotificationDetail {
  /** Row rendering: accept/decline cards vs call-back rows. */
  variant?: "connections" | "calls";
  items: DetailPerson[];
  /** Optional top-right action in the detail header. */
  action?: DetailAction;
}

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
    colors: [HypeTrainColor, HypeTrainColor, HypeTrainColor];
    avatarSrcs: [string, string, string];
    onClick?: () => void;
    /**
     * Collapsed batch behind this notification. When provided, tapping the
     * row replaces the card with a detail view (back on the top-left, an
     * optional action on the top-right) listing every person in the batch.
     */
    detail?: NotificationDetail;
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

  const [detailIndex, setDetailIndex] = React.useState<number | null>(null);
  const detail = detailIndex !== null ? notifications[detailIndex] : undefined;

  return (
    <div
      className={cn(
        "flex w-full max-w-[474px] flex-col items-center gap-1 rounded-[40px] border border-light-glass-10 bg-dark-glass-5 p-3 backdrop-blur-[10px]",
        isCompact && "rounded-[28px]",
        className,
      )}
    >
      {detail && detail.detail ? (
        <NotificationDetailView
          title={detail.title}
          badgeColor={detail.badgeColor}
          variant={detail.detail.variant}
          items={detail.detail.items}
          action={detail.detail.action}
          resolvedViewport={resolvedViewport}
          onBack={() => setDetailIndex(null)}
        />
      ) : (
      <>
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
          onClick={() => {
            notif.onClick?.();
            if (notif.detail) setDetailIndex(i);
          }}
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
      </>
      )}
    </div>
  );
}

/**
 * NotificationDetailView — the collapsed batch view. Replaces the card body
 * with a header (back on the top-left, an optional action on the top-right)
 * and the full list of people. "connections" rows accept / decline and drop
 * out as they resolve; "calls" rows offer call-back / message / more. The
 * count badge always tracks the remaining batch.
 */
function NotificationDetailView({
  title,
  badgeColor,
  variant = "connections",
  items: initialItems,
  action,
  resolvedViewport,
  onBack,
}: {
  title: string;
  badgeColor: "red" | "green" | "blue" | "purple";
  variant?: "connections" | "calls";
  items: DetailPerson[];
  action?: DetailAction;
  resolvedViewport: ReturnType<typeof useGooeyViewport>;
  onBack: () => void;
}) {
  const [items, setItems] = React.useState(() =>
    initialItems.map((c, i) => ({ ...c, id: i })),
  );

  const remove = (id: number) => setItems((prev) => prev.filter((it) => it.id !== id));

  return (
    <>
      <div className="flex w-full items-center gap-3 px-1 py-2">
        <IconOnlyButton
          size="small"
          icon={<ChevronRight size={20} className="rotate-180" />}
          onClick={onBack}
          aria-label="Back"
        />
        <span className="min-w-0 flex-1 truncate font-sans text-base font-bold leading-[1.4] text-light-space">
          {title}
        </span>
        <Badge color={badgeColor} variant="filled" label={String(items.length)} />
        {action && (
          <IconOnlyButton
            size="small"
            icon={action.icon}
            aria-label={action.ariaLabel}
            onClick={() => {
              action.onClick?.();
              if (action.clearsList) setItems([]);
            }}
          />
        )}
      </div>

      <div className="flex max-h-[60vh] w-full flex-col gap-1 overflow-y-auto">
        {items.map((it) =>
          variant === "calls" ? (
            <ContactItem
              key={it.id}
              className="w-full"
              name={it.name}
              avatarSrc={it.avatarSrc}
              originColor={it.originColor}
              viewport={resolvedViewport}
              onCall={() => {
                it.onCall?.();
                remove(it.id);
              }}
              onMessage={it.onMessage}
              onMore={() => {
                it.onMore?.();
                remove(it.id);
              }}
            />
          ) : (
            <ConnectionRequestCard
              key={it.id}
              className="w-full"
              name={it.name}
              avatarSrc={it.avatarSrc}
              onApprove={() => {
                it.onApprove?.();
                remove(it.id);
              }}
              onDecline={() => {
                it.onDecline?.();
                remove(it.id);
              }}
            />
          ),
        )}
        {items.length === 0 && (
          <p className="py-6 text-center font-sans text-sm text-text-secondary">
            all caught up
          </p>
        )}
      </div>
    </>
  );
}

export { ActionCardContacts, type ActionCardContactsProps };
