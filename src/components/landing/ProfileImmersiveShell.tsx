import { motion } from "motion/react";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { ImmersiveCenterColumn } from "../system/ImmersiveCenterColumn";
import { ImmersiveProductBackdrop } from "./ImmersiveProductBackdrop";
import { ProfilePeopleSearchPanel } from "./ProfilePeopleSearchPanel";
import { ProfilePodPanel } from "./ProfilePodPanel";

/**
 * **Purpose:** Full-viewport Profile product page — inspirational identity preview in center, live people search below.
 * **Connects to:** `ProfilePodPanel`, `ProfilePeopleSearchPanel`, `profile-demo-identity.ts`, `/download` intercept.
 */
export function ProfileImmersiveShell() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden" aria-label="Profile preview">
      <ImmersiveProductBackdrop productId="profile" />

      <ImmersiveAppChrome
        activeAction="id"
        bottomCenter={
          <ProfilePeopleSearchPanel
            variant="bottomComposer"
            className="landing-profile-people-search--profile-bottom"
          />
        }
      />

      <ImmersiveCenterColumn maxWidthClass="max-w-[520px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <ProfilePodPanel />

          <p className="mt-6 text-center font-sans text-[clamp(1.5rem,5vw,2.5rem)] font-semibold tracking-[-0.02em] text-light-space light:text-zinc-950">
            Your identity, your network
          </p>
          <p className="mt-2 text-center font-sans text-[15px] leading-relaxed text-white/55 light:text-zinc-600">
            Start with a name, a photo, and the people you want in your orbit.
          </p>
        </motion.div>
      </ImmersiveCenterColumn>
    </section>
  );
}
