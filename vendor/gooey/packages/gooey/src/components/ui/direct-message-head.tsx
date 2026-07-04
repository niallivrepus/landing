import { ArrowLeft01Icon, Search01Icon } from "hugeicons-react";

import { Avatar, type AvatarProps } from "./avatar";
import { type OriginColor } from "./avatar-hype-train";
import { RightHandButton } from "./right-hand-button";

interface DirectMessageHeadProps {
  variant: "group" | "single" | "email";
  /** Display name — "Family", "Sean", "Stripe" */
  title: string;
  /** Secondary line — "6 members", "@sean", "info@stripe.com" */
  subtitle: string;
  /** Group variant — 3 avatar URLs for AvatarHypeTrain */
  avatarSrcs?: [string, string, string];
  /** Group variant — one origin color per avatar (back → middle → front) */
  colors?: [OriginColor, OriginColor, OriginColor];
  /** Single variant — avatar image URL */
  avatarSrc?: string;
  /** Single variant — avatar border color */
  originColor?: AvatarProps["originColor"];
  onBack?: () => void;
  onSearch?: () => void;
  className?: string;
}

/**
 * DirectMessageHead — 372px DM conversation header bar.
 *
 * Three variants:
 * - **group**: back btn | 3-avatar hype train + title/members | search btn
 * - **single**: back btn | single avatar + title/handle | search btn
 * - **email**: back btn | centered title/email | search btn
 */
function DirectMessageHead({
  variant,
  title,
  subtitle,
  avatarSrc,
  originColor = "aether",
  onBack,
  onSearch,
  className,
}: DirectMessageHeadProps) {
  return (
    <div
      className={`flex items-center justify-between w-full relative ${className ?? ""}`}
    >
      {/* Left — Back button */}
      <RightHandButton
        aria-label="Go back"
        icon={<ArrowLeft01Icon size={18} className="text-[var(--color-light-space)]" />}
        onClick={onBack}
      />

      {/* Center content — group chats carry their own single avatar */}
      {variant === "group" && (
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            src={avatarSrc}
            borderStyle="origins"
            originColor={originColor}
            disableNavigation
          />
          <div className="flex flex-col">
            <span className="font-bold text-[16px] leading-[1.4] text-light-space">
              {title}
            </span>
            <span className="text-[14px] leading-[1.4] text-light-space/40">
              {subtitle}
            </span>
          </div>
        </div>
      )}

      {variant === "single" && (
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            src={avatarSrc}
            borderStyle="origins"
            originColor={originColor}
            disableNavigation
          />
          <div className="flex flex-col">
            <span className="font-bold text-[16px] leading-[1.4] text-light-space">
              {title}
            </span>
            <span className="text-[14px] leading-[1.4] text-light-space/40">
              {subtitle}
            </span>
          </div>
        </div>
      )}

      {variant === "email" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <span className="font-bold text-[16px] leading-[1.4] text-light-space">
            {title}
          </span>
          <span className="text-[14px] leading-[1.4] text-light-space/40">
            {subtitle}
          </span>
        </div>
      )}

      {/* Right — Search button */}
      <RightHandButton
        aria-label="Search conversation"
        icon={<Search01Icon size={18} className="text-[var(--color-light-space)]" />}
        onClick={onSearch}
      />
    </div>
  );
}

export { DirectMessageHead, type DirectMessageHeadProps };
