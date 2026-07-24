/**
 * **Purpose:** Live miniature profile UI mockups for `/profile` highlight carousel slides.
 * **Connects to:** `ProductDetailMedia`, `profile-demo-identity.ts`, `ProfileNetworkStripPanel`.
 * **Variants:** identity, biography, network, personality, customize, claim — each depicts real profile chrome.
 */

import { Avatar as GooeyAvatar, cn } from "@jokuh/gooey";
import { Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  PROFILE_DEMO_HERO_AGENT,
  PROFILE_DEMO_CONNECTION_COUNT,
  PROFILE_DEMO_PLACEHOLDER,
  profileDemoNetworkPeers,
} from "../../lib/profile-demo-identity";
import { ProfileNetworkStripPanel } from "./ProfileNetworkStripPanel";
import { IdPodSquircleShell } from "./IdPodSquircleShell";

/** Carousel-scale profile squircle — tighter radius than full immersive pod. */
function HighlightSquircle({ children }: { children: React.ReactNode }) {
  return (
    <IdPodSquircleShell cornerRadius={28} contentClassName="p-[1.1rem]">
      {children}
    </IdPodSquircleShell>
  );
}

/** Carousel slide variants — one mini mockup per profile highlight theme. */
export type ProfileHighlightVariant =
  | "identity"
  | "biography"
  | "network"
  | "personality"
  | "customize"
  | "claim";

type ProfileHighlightVisualProps = {
  variant: ProfileHighlightVariant;
  active?: boolean;
  className?: string;
};

/** Floating OO context chip shared across slides. */
function OoContextChip({ children }: { children: string }) {
  return (
    <div className="profile-highlight-visual__oo-chip">
      <span className="profile-highlight-visual__oo-chip-dot" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

/** Identity row — photo, name, @handle; OO reads this as the anchor. */
function IdentityHighlightMockup() {
  return (
    <div className="profile-highlight-visual__stage">
      <HighlightSquircle>
        <div className="profile-highlight-visual__identity-row">
          <img
            src={PROFILE_DEMO_HERO_AGENT.avatarPath}
            alt=""
            className="profile-highlight-visual__identity-photo"
            draggable={false}
          />
          <div className="profile-highlight-visual__identity-text">
            <p className="profile-highlight-visual__identity-name">
              {PROFILE_DEMO_HERO_AGENT.displayName}
            </p>
            <p className="profile-highlight-visual__identity-handle">@{PROFILE_DEMO_HERO_AGENT.username}</p>
          </div>
        </div>
      </HighlightSquircle>
      <OoContextChip>OO reads this as your anchor</OoContextChip>
    </div>
  );
}

/** Biography pod — editable story block with inline cursor. */
function BiographyHighlightMockup({ active }: { active: boolean }) {
  return (
    <div className="profile-highlight-visual__stage">
      <HighlightSquircle>
        <div className="profile-highlight-visual__bio-card">
          <p className="profile-highlight-visual__bio-label">Biography pod</p>
          <p className="profile-highlight-visual__bio-title">The story behind the squircle</p>
          <p className="profile-highlight-visual__bio-line">
            Builder, night owl, prefers voice notes over walls of text.
          </p>
          <p className="profile-highlight-visual__bio-line">
            Currently shipping Profile Live and teaching OO how I show up
            {active ? <span className="profile-highlight-visual__bio-cursor" aria-hidden /> : null}
          </p>
        </div>
      </HighlightSquircle>
      <OoContextChip>OO learns your voice from what you write here</OoContextChip>
    </div>
  );
}

/** Network strip — mutual connections; OO helps navigate relationships. */
function NetworkHighlightMockup() {
  const peers = profileDemoNetworkPeers();

  return (
    <div className="profile-highlight-visual__stage">
      <HighlightSquircle>
        <div className="profile-highlight-visual__network-wrap">
          <ProfileNetworkStripPanel
            connectionCount={PROFILE_DEMO_CONNECTION_COUNT}
            peers={peers.slice(0, 6)}
          />
        </div>
      </HighlightSquircle>
      <OoContextChip>OO helps you show up in real relationships</OoContextChip>
    </div>
  );
}

/** Personality & context — profile feeds Spine/OO for smarter, personal AI. */
function PersonalityHighlightMockup() {
  return (
    <div className="profile-highlight-visual__stage">
      <HighlightSquircle>
        <div className="profile-highlight-visual__context-flow">
          <div className="profile-highlight-visual__context-mini">
            <img
              src={PROFILE_DEMO_HERO_AGENT.avatarPath}
              alt=""
              className="profile-highlight-visual__context-photo"
              draggable={false}
            />
            <p className="profile-highlight-visual__context-label">Profile</p>
          </div>

          <div className="profile-highlight-visual__context-bridge" aria-hidden>
            <Sparkles className="size-3.5" strokeWidth={2.1} />
            <span className="profile-highlight-visual__context-bridge-line" />
          </div>

          <div className="profile-highlight-visual__context-mini">
            <GooeyAvatar
              showOO
              ooExpression="default"
              size="small"
              borderStyle="origins"
              originColor="life"
              disableNavigation
            />
            <p className="profile-highlight-visual__context-label">OO memory</p>
          </div>
        </div>

        <div className="profile-highlight-visual__memory-chips">
          <span className="profile-highlight-visual__memory-chip profile-highlight-visual__memory-chip--accent">
            Personality
          </span>
          <span className="profile-highlight-visual__memory-chip">Boundaries</span>
          <span className="profile-highlight-visual__memory-chip">Rhythms</span>
          <span className="profile-highlight-visual__memory-chip">Connections</span>
        </div>
      </HighlightSquircle>
      <OoContextChip>Not a generic chatbot — context that compounds</OoContextChip>
    </div>
  );
}

/** Customize — wallpaper, status, interests preview. */
function CustomizeHighlightMockup() {
  return (
    <div className="profile-highlight-visual__stage">
      <div className="profile-highlight-visual__customize-frame">
        <div className="profile-highlight-visual__wallpaper" aria-hidden />
        <div className="profile-highlight-visual__customize-content">
          <span className="profile-highlight-visual__status-pill">
            <span className="profile-highlight-visual__status-dot" aria-hidden />
            Available for collab
          </span>
          <div className="profile-highlight-visual__interest-row">
            {["Design", "Music", "Climbing", "OO"].map((tag) => (
              <span key={tag} className="profile-highlight-visual__interest-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <OoContextChip>Every choice teaches OO how you want to be seen</OoContextChip>
    </div>
  );
}

/** Claim yours — empty placeholder morphs into a filled profile. */
function ClaimHighlightMockup({ active }: { active: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const [showFilled, setShowFilled] = useState(false);

  useEffect(() => {
    if (!active || shouldReduceMotion) {
      setShowFilled(true);
      return;
    }

    setShowFilled(false);
    const fillTimer = window.setTimeout(() => setShowFilled(true), 1400);
    const replay = window.setInterval(() => {
      setShowFilled(false);
      window.setTimeout(() => setShowFilled(true), 1400);
    }, 5200);

    return () => {
      window.clearTimeout(fillTimer);
      window.clearInterval(replay);
    };
  }, [active, shouldReduceMotion]);

  return (
    <div className="profile-highlight-visual__stage">
      <div className="profile-highlight-visual__claim-stack">
        <AnimatePresence mode="wait" initial={false}>
          {!showFilled ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.34 }}
              className="profile-highlight-visual__claim-card"
            >
              <p className="profile-highlight-visual__claim-placeholder">
                {PROFILE_DEMO_PLACEHOLDER.displayName}
              </p>
              <p className="profile-highlight-visual__claim-placeholder">
                {PROFILE_DEMO_PLACEHOLDER.handle}
              </p>
              <p className="profile-highlight-visual__claim-cta">{PROFILE_DEMO_PLACEHOLDER.tagline}</p>
            </motion.div>
          ) : (
            <motion.div
              key="filled"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className={cn(
                "profile-highlight-visual__claim-card",
                "profile-highlight-visual__claim-card--filled",
              )}
            >
              <img
                src={PROFILE_DEMO_HERO_AGENT.avatarPath}
                alt=""
                className="profile-highlight-visual__claim-photo"
                draggable={false}
              />
              <p className="profile-highlight-visual__identity-name">
                {PROFILE_DEMO_HERO_AGENT.displayName}
              </p>
              <p className="profile-highlight-visual__identity-handle">@{PROFILE_DEMO_HERO_AGENT.username}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <OoContextChip>Claim yours — OO starts learning from day one</OoContextChip>
    </div>
  );
}

/**
 * **Renders** the profile highlight mini-mockup for a carousel slide variant.
 * **Inputs:** `variant` selects which profile UI replica to show; `active` drives subtle motion.
 */
export function ProfileHighlightVisual({
  variant,
  active = false,
  className,
}: ProfileHighlightVisualProps) {
  return (
    <div className={cn("profile-highlight-visual", className)} aria-hidden>
      {variant === "identity" ? <IdentityHighlightMockup /> : null}
      {variant === "biography" ? <BiographyHighlightMockup active={active} /> : null}
      {variant === "network" ? <NetworkHighlightMockup /> : null}
      {variant === "personality" ? <PersonalityHighlightMockup /> : null}
      {variant === "customize" ? <CustomizeHighlightMockup /> : null}
      {variant === "claim" ? <ClaimHighlightMockup active={active} /> : null}
    </div>
  );
}
