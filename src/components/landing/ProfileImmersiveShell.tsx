import { GooeyViewportProvider } from "@jokuh/gooey";
import { motion } from "motion/react";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { ImmersiveCenterColumn } from "../system/ImmersiveCenterColumn";
import { ImmersiveProductBackdrop } from "./ImmersiveProductBackdrop";
import { ProfilePeopleSearchPanel } from "./ProfilePeopleSearchPanel";
import { ClaimIdentityCta } from "./ClaimIdentityCta";
import { ProfilePodsDemo } from "./ProfilePodsDemo";

/**
 * **Purpose:** Full-viewport Profile product page — Lego-style pod demo (`ProfilePodsDemo`) + claim CTA in center, live people search below.
 * **Connects to:** `ProfilePodsDemo`, `ClaimIdentityCta`, `ProfilePeopleSearchPanel`, `profile-demo-identity.ts`, `/download` intercept.
 * **Parity:** web `AddFriendSheet.tsx` frosted search chrome; `MessagesImmersiveShell` Gooey viewport + prompt bar.
 */
export function ProfileImmersiveShell() {
  return (
    <GooeyViewportProvider>
      <ProfileImmersiveShellInner />
    </GooeyViewportProvider>
  );
}

function ProfileImmersiveShellInner() {
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

      {/* Extra bottom room: the people-search composer is taller than the standard corner-pill row. */}
      <ImmersiveCenterColumn maxWidthClass="max-w-[520px]" className="pb-[calc(env(safe-area-inset-bottom,0px)+148px)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <ProfilePodsDemo />

          <p className="mt-5 text-center font-sans text-[clamp(1.5rem,5vw,2.5rem)] md:mt-7 font-semibold tracking-[-0.02em] text-light-space light:text-zinc-950">
            Your identity, your keys
          </p>
          <p className="mx-auto mt-2 max-w-[420px] text-center font-sans text-[15px] leading-relaxed text-white/55 light:text-zinc-600">
            Snap together pods for your music, photos, links and bookings.
            <span className="max-md:hidden"> You sign in with a passkey that never leaves your device.</span>
          </p>
          <div className="mt-4 flex justify-center md:mt-6">
            <ClaimIdentityCta href="/download?intent=identity">Claim your identity</ClaimIdentityCta>
          </div>
        </motion.div>
      </ImmersiveCenterColumn>
    </section>
  );
}
