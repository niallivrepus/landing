/**
 * **Purpose:** Profile **Network** row under the ID photo — parity `ProfileNetworkStrip.tsx` / `profile-network-strip.swift`.
 * **Connects to:** `ProfilePodPanel`, `landing-profile-pod.css`, `formatConnectionCountLabel`.
 */

import { cn } from "@jokuh/gooey";
import {
  formatConnectionCountLabel,
  type ProfileDemoNetworkPeer,
} from "../../lib/public-profile-demo";

export type ProfileNetworkStripPanelProps = {
  connectionCount: number;
  peers: ProfileDemoNetworkPeer[];
  /** Replaces default people-count caption (privacy / loading copy). */
  countLabelOverride?: string | null;
  className?: string;
};

const STRIP_AVATAR_W = 30;
const STRIP_AVATAR_H = 41;

/** One dimmed preview capsule — tap target is the whole strip row in the app; landing is display-only. */
function NetworkStripAvatarCell({ peer }: { peer: ProfileDemoNetworkPeer }) {
  return (
    <div className="profile-network-strip__avatar-wrap">
      {peer.avatarUrl ? (
        <img
          src={peer.avatarUrl}
          alt=""
          className="profile-network-strip__avatar-img"
          width={STRIP_AVATAR_W}
          height={STRIP_AVATAR_H}
          draggable={false}
          loading="lazy"
        />
      ) : (
        <div className="profile-network-strip__avatar-ph" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="rgba(255,255,255,0.45)"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * **Renders** the Network preview row with hero title + connection metric centered over avatars.
 * **Side effects:** none — display-only on the marketing profile pod.
 */
export function ProfileNetworkStripPanel({
  connectionCount,
  peers,
  countLabelOverride,
  className,
}: ProfileNetworkStripPanelProps) {
  const caption = countLabelOverride?.trim() || formatConnectionCountLabel(connectionCount);
  const previewPeers = peers.slice(0, 8);

  return (
    <section
      className={cn("profile-network-strip profile-network-strip--embedded", className)}
      aria-label={`Network, ${caption}`}
    >
      <div className="profile-network-strip__layout">
        <div className="profile-network-strip__stack profile-network-strip__stack--embedded">
          <div className="profile-network-strip__avatar-backdrop">
            <div className="profile-network-strip__avatars-scroll">
              {previewPeers.length > 0 ? (
                <div className="profile-network-strip__avatars-row">
                  {previewPeers.map((peer) => (
                    <NetworkStripAvatarCell key={peer.userId} peer={peer} />
                  ))}
                </div>
              ) : (
                <div className="profile-network-strip__avatars-spacer" aria-hidden="true" />
              )}
            </div>
          </div>
          <div className="profile-network-strip__hero-overlay" aria-hidden="true">
            <div className="profile-network-strip__hero-title profile-network-strip__hero-title--embedded">
              Network
            </div>
            {caption ? (
              <div className="profile-network-strip__connections-badge">
                <span className="profile-network-strip__connections-badge-text">{caption}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
