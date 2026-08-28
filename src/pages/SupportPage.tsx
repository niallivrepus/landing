import { cn } from "@jokuh/gooey";
import { TERTIARY_PAGE_SHELL, TertiaryPageHero } from "../components/system";
import { CompanyPageLayout } from "../components/CompanyPageLayout";
import { FaqSection } from "../components/FaqSection";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/**
 * Public support / FAQ for App Store Connect Support URL and in-app Settings → Support.
 * Wallet is not currently offered; keep copy aligned with Privacy + Terms.
 */
const bodyText = "font-sans text-[15px] leading-relaxed text-light-space/60 light:text-zinc-600";
const linkClass = "rounded-sm text-[var(--color-blue-4)] transition-colors hover:underline";

export function SupportPage() {
  useDocumentTitle("Support — Jokuh");

  return (
    <CompanyPageLayout>
      <>
        <TertiaryPageHero
          eyebrow="Help"
          title="Support"
          intro="Need help with Jokuh? Start here, or reach us directly — we usually reply within one business day."
        />

        <div className={cn(TERTIARY_PAGE_SHELL, "pb-8")}>
          <div className="max-w-[720px] rounded-[20px] border border-light-space/[0.08] bg-white/[0.02] p-6 light:border-black/[0.1] light:bg-section-grey-light">
            <p className={bodyText}>
              <strong className="text-light-space light:text-zinc-950">Email:</strong>{" "}
              <a href="mailto:support@jokuh.com" className={linkClass}>support@jokuh.com</a>
            </p>
            <p className={cn(bodyText, "mt-2")}>
              Signed in? You can also send feedback from{" "}
              <strong className="text-light-space light:text-zinc-950">Settings → Support</strong>{" "}
              inside the app — it goes straight to our team.
            </p>
          </div>
        </div>

        <div className={cn(TERTIARY_PAGE_SHELL, "space-y-16 pb-24")}>
          <section className="scroll-mt-24">
            <h2 className="font-sans text-xl font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-2xl">
              Getting started
            </h2>
            <ul className={cn("mt-6 max-w-[720px] space-y-4 pl-5 list-disc marker:text-light-space/35 light:marker:text-zinc-400", bodyText)}>
              <li>
                <strong className="text-light-space light:text-zinc-950">Signing in.</strong> Jokuh
                uses passwordless sign-in with your device’s passkey/biometrics (“Bond”) — no password
                to remember or reset. If you’re stuck at sign-in, make sure your device has Face ID,
                Touch ID, or a passcode enabled, and that you’re using the same device (or an iCloud
                Keychain–synced device) you signed up with.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Age.</strong> Jokuh is for
                people 17 and older.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Face portrait.</strong> New
                accounts may be asked to take photos so we can generate a profile portrait. Camera
                permission is required for that step. You can change your profile photo later in ID.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Spine.</strong> Your personal
                timeline for planning, notes, and synced calendar/reminder events. Grant Calendar or
                Reminders access in Settings if you want two-way sync.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Calls.</strong> Voice and
                video calls need Microphone and Camera permission. If a call won’t connect, check
                Settings → Privacy on your device to confirm Jokuh has both.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">AI (Cortex / OO).</strong>{" "}
                Optional assistants that can use context from your Spine and conversations you choose
                to include. They can be wrong. Do not paste passwords or recovery codes into chat.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Arcade.</strong> Optional
                games, including simulated prize play. Paid tickets and Jokuh Wallet are not currently
                available.
              </li>
            </ul>
          </section>

          <section className="scroll-mt-24">
            <h2 className="font-sans text-xl font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-2xl">
              Safety and abuse reports
            </h2>
            <p className={cn("mt-6 max-w-[640px]", bodyText)}>
              To report abusive content, harassment, or a security concern, email{" "}
              <a href="mailto:support@jokuh.com" className={linkClass}>support@jokuh.com</a> with as
              much detail as you can (usernames, screenshots, timestamps). Urgent safety issues are
              prioritized.
            </p>
          </section>

          <FaqSection
            title="Common issues"
            items={[
              {
                question: "Notifications aren't arriving.",
                answer:
                  "Confirm notifications are allowed for Jokuh in your device Settings, and that you have a network connection. Reinstalling the app or signing out and back in can also refresh your device's push token.",
              },
              {
                question: "A call has poor quality.",
                answer:
                  "Try switching from Wi-Fi to cellular (or vice versa); call quality depends heavily on your current network conditions.",
              },
              {
                question: "I want to delete my account.",
                answer:
                  "Go to Settings → Account → Delete Account inside the app. This removes your profile and Spine data we hold for you. Messages you already sent may remain in other people's conversations. See the Privacy Policy for backups and retention.",
              },
              {
                question: "Where is Wallet?",
                answer:
                  "Jokuh Wallet is not currently available. If we enable it later, Privacy and Terms will be updated first.",
              },
              {
                question: "I found a bug or have a feature request.",
                answer:
                  "Use Settings → Support → Send Feedback in the app, or email us — include your device model and OS version if it's a bug.",
              },
            ]}
          />

          <section className="scroll-mt-24">
            <h2 className="font-sans text-xl font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-2xl">
              Legal
            </h2>
            <p className={cn("mt-4", bodyText)}>
              <a href="/terms" className={linkClass}>Terms of Service</a>
              <span className="mx-2 text-light-space/30 light:text-zinc-300" aria-hidden>
                ·
              </span>
              <a href="/privacy" className={linkClass}>Privacy Policy</a>
            </p>
          </section>

          <section className="scroll-mt-24">
            <h2 className="font-sans text-xl font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-2xl">
              Contact
            </h2>
            <p className={cn("mt-4", bodyText)}>
              Support: <a href="mailto:support@jokuh.com" className={linkClass}>support@jokuh.com</a>
              <br />
              Privacy: <a href="mailto:privacy@jokuh.com" className={linkClass}>privacy@jokuh.com</a>
              <br />
              Legal: <a href="mailto:legal@jokuh.com" className={linkClass}>legal@jokuh.com</a>
            </p>
          </section>
        </div>
      </>
    </CompanyPageLayout>
  );
}
