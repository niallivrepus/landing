import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";

/**
 * Active Calls Stack — overlapping pill-shaped avatars with an optional count badge.
 *
 * Variants (driven by participants.length):
 *  - 1 participant: single avatar, no badge
 *  - 2 participants: two overlapping avatars, no badge
 *  - 3+ participants: three overlapping avatars + "+N" badge
 */

interface Participant {
  src: string;
  borderColor: string;
}

interface ActiveCallsProps {
  participants: Participant[];
  count?: number;
  className?: string;
}

const AVATAR_SHADOW =
  "0px 2px 8px 0px rgba(0,0,0,0.1)";

export function ActiveCalls({ participants, count, className }: ActiveCallsProps) {
  // Show at most 3 avatars
  const visible = participants.slice(0, 3);
  const showBadge = participants.length >= 3 && count != null;

  return (
    <div className={cn("flex items-center", className)}>
      {/* Avatar row */}
      <div className="flex items-center">
        {visible.map((p, i) => (
          <img
            key={i}
            src={p.src}
            alt=""
            className="rounded-full object-cover"
            style={{
              width: 18,
              height: 24,
              border: `1.5px solid ${p.borderColor}`,
              boxShadow: AVATAR_SHADOW,
              marginRight: i < visible.length - 1 ? -8 : 0,
              zIndex: i + 1,
              position: "relative",
            }}
          />
        ))}
      </div>

      {/* Count badge */}
      {showBadge && (
        <Badge
          label={`+${count}`}
          variant="outline"
          color="neutral"
          type="text"
          size="tag"
          className="ml-1.5"
        />
      )}
    </div>
  );
}
