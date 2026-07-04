/**
 * **Purpose:** Inspirational identity preview for the marketing `/profile` page — "this could be you."
 * **Connects to:** `profile-demo-identity.ts`, `ProfileNetworkStripPanel`, `/download` signup gate.
 * **Data:** Static Agents of Chaos demo portrait + mock network; no live `peek_public_profile` fetch.
 */

import { cn } from "@jokuh/gooey";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import {
  PROFILE_DEMO_CONNECTION_COUNT,
  PROFILE_DEMO_HERO_AGENT,
  PROFILE_DEMO_PLACEHOLDER,
  profileDemoNetworkPeers,
} from "../../lib/profile-demo-identity";
import { ProfileNetworkStripPanel } from "./ProfileNetworkStripPanel";

type ProfilePodPanelProps = {
  className?: string;
};

/**
 * **Renders** the ID profile pod stack: squircle (placeholder name, agent portrait, mock network strip).
 * **Side effects:** Connect / Message route unsigned visitors to `/download`.
 */
export function ProfilePodPanel({ className }: ProfilePodPanelProps) {
  const { intercept } = useDownloadIntercept("profile-demo");
  const handle = PROFILE_DEMO_PLACEHOLDER.handle;
  const networkPeers = profileDemoNetworkPeers();

  return (
    <div className={cn("id-page-profile-stack id-page-profile-stack--no-biography landing-profile-pod", className)}>
      <div className="id-pod-squircle">
        <div className="landing-profile-pod__identity">
          <p className="landing-profile-pod__display-name">{PROFILE_DEMO_PLACEHOLDER.displayName}</p>
          <p className="landing-profile-pod__handle">{handle}</p>
          <p className="landing-profile-pod__tagline">{PROFILE_DEMO_PLACEHOLDER.tagline}</p>
        </div>

        <div className="id-pod-profile-photo-frame">
          <img
            src={PROFILE_DEMO_HERO_AGENT.avatarPath}
            alt="Example profile portrait"
            className="id-pod-profile-photo-frame__media"
          />
        </div>

        <div className="landing-profile-pod__network-wrap">
          <ProfileNetworkStripPanel
            connectionCount={PROFILE_DEMO_CONNECTION_COUNT}
            peers={networkPeers}
          />
        </div>
      </div>

      <div className="landing-profile-pod__actions">
        <button
          type="button"
          className="landing-profile-pod__btn landing-profile-pod__btn--primary"
          onClick={() => intercept("connect", { ref: handle })}
        >
          Connect
        </button>
        <button
          type="button"
          className="landing-profile-pod__btn landing-profile-pod__btn--secondary"
          onClick={() => intercept("send-message", { ref: handle })}
        >
          Message
        </button>
      </div>
    </div>
  );
}
