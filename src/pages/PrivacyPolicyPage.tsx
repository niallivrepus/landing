import { TertiaryDocBody, TertiaryPageHero } from "../components/system";
import { CompanyPageLayout } from "../components/CompanyPageLayout";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/**
 * Hosted Privacy Policy for the Jokuh apps and marketing site.
 * Keep this page aligned with what the product actually collects (Bond, Spine, messaging,
 * calls, AI, face-scan onboarding, location, Arcade). Jokuh Wallet is not currently offered.
 */
const TOC_ITEMS = [
  { id: "who-we-are", label: "Who we are" },
  { id: "information-we-collect", label: "Information we collect" },
  { id: "how-we-use-information", label: "How we use information" },
  { id: "ai-features", label: "AI features" },
  { id: "how-we-share-information", label: "How we share information" },
  { id: "cookies", label: "Cookies (marketing site)" },
  { id: "retention", label: "Retention" },
  { id: "security", label: "Security" },
  { id: "your-choices", label: "Your choices and rights" },
  { id: "children", label: "Children" },
  { id: "international", label: "International users" },
  { id: "california", label: "California (U.S.) notice" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

const bodyText = "font-sans text-[16px] leading-[1.72] text-light-space/75 light:text-zinc-700";
const sectionTitle = "font-sans text-[22px] font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-[24px]";
const linkClass = "rounded-sm text-[var(--color-blue-4)] transition-colors hover:underline";

export function PrivacyPolicyPage() {
  useDocumentTitle("Privacy Policy — Jokuh");

  return (
    <CompanyPageLayout>
      <>
        <TertiaryPageHero
          eyebrow="Legal"
          title="Privacy Policy"
          intro="Last updated August 24, 2026. This Privacy Policy describes how Jokuh LLC (“Jokuh,” “we,” “us,” or “our”) handles information when you use the Jokuh applications, websites, and related services (together, the “Service”)."
        />
        <TertiaryDocBody tocItems={TOC_ITEMS}>
          <section id="who-we-are" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Who we are</h2>
            <p className={`mt-4 ${bodyText}`}>
              Jokuh is a communication and personal-organization product: messaging, voice and video
              calling, a personal timeline (“Spine”), optional AI assistance (“Cortex” and “OO”),
              profile and social features, and optional Arcade games. Jokuh Wallet (custodial balances
              and self-custody vault) is{" "}
              <strong className="text-light-space light:text-zinc-950">not currently offered</strong>.
              We will update this Policy before enabling Wallet or any paid money features.
            </p>
            <p className={`mt-4 ${bodyText}`}>
              Questions:{" "}
              <a href="mailto:privacy@jokuh.com" className={linkClass}>privacy@jokuh.com</a>.
            </p>
          </section>

          <section id="information-we-collect" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Information we collect</h2>
            <p className={`mt-4 ${bodyText}`}>
              We collect information needed to run the Service. Categories include:
            </p>
            <ul className={`mt-4 space-y-3 pl-5 ${bodyText} list-disc marker:text-light-space/35 light:marker:text-zinc-400`}>
              <li>
                <strong className="text-light-space light:text-zinc-950">Account and authentication.</strong>{" "}
                A username and passwordless sign-in with your device’s passkey / biometrics (“Bond”).
                We store passkey credentials and a technical account identifier required by our auth
                system (formatted like an email address) so we can issue a session. We do not use that
                identifier to send marketing email. Jokuh does not receive your Face ID / Touch ID /
                fingerprint templates — those stay on your device.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Profile.</strong> Display name,
                biography, username, profile photo, and other fields you add (for example music, gallery,
                or a public location on your profile).
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Face-scan onboarding.</strong>{" "}
                New accounts are asked to capture photos of their face so we can generate a profile
                portrait with an AI image model. Those photos and the generated image are stored with
                your account as identity / profile images. This is a portrait capture, not a government
                ID check, and we do not use it to unlock the device (that is Bond / the OS).
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Spine and activity.</strong>{" "}
                Timeline entries, notes, reminders, planner data, files you import, optional call
                recaps, and other content you create or sync into Spine (including optional calendar
                or reminders access you grant on the device).
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Messages and social content.</strong>{" "}
                Direct messages, group messages, Blurbs, and related metadata (for example delivery or
                read state). Recipients keep copies of content you send them.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Calls and live audio/video.</strong>{" "}
                Session details needed to connect voice/video calls and optional live rooms. If you
                enable call recap or related features, audio may be transcribed and stored as described
                in the app. Live features may use real-time media providers to route audio and video.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Contacts and relationships.</strong>{" "}
                People you connect with in Jokuh (connection requests, roster, in-app contacts). We do
                not require access to your device address book; if a feature asks for it, it is optional
                and described in the system permission prompt.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Location.</strong> Precise
                location when you tap to share location in a conversation, or when you publish a
                location on your profile. Optional Sky Lens / birth-chart features also store birth
                date, time, and place you enter.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Notifications.</strong> Device
                tokens and preferences needed to deliver alerts you ask for (messages, calls, and similar).
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Voice memos and dictation.</strong>{" "}
                Audio you record or dictate may be processed on device or sent for transcription as
                described in the feature.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">In-app browser.</strong> Sites
                you open inside Jokuh collect information under their own policies. Jokuh may store
                normal browser data (cookies, cache) on your device until you clear it.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Arcade.</strong> Gameplay events
                for optional games (including simulated prize play). Paid tickets and real-money play
                are not currently offered.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Technical and diagnostic data.</strong>{" "}
                App version, device type, crash reports, and error logs (including reports sent to our
                crash-monitoring provider) to keep the Service reliable and secure.
              </li>
            </ul>
          </section>

          <section id="how-we-use-information" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>How we use information</h2>
            <p className={`mt-4 ${bodyText}`}>We use information to:</p>
            <ul className={`mt-4 space-y-2 pl-5 ${bodyText} list-disc marker:text-light-space/35 light:marker:text-zinc-400`}>
              <li>Provide, operate, and secure the Service;</li>
              <li>Authenticate you and sync your account across devices;</li>
              <li>Deliver messages, calls, notifications, and Spine content you request;</li>
              <li>Generate optional AI responses and portraits you ask for;</li>
              <li>Improve performance, fix bugs, and detect abuse;</li>
              <li>Comply with law and respond to lawful requests.</li>
            </ul>
            <p className={`mt-4 ${bodyText}`}>
              We do <strong className="text-light-space light:text-zinc-950">not</strong> sell your
              personal information. The Jokuh app does{" "}
              <strong className="text-light-space light:text-zinc-950">not</strong> use your content to
              serve third-party advertising, and we do not track you across other companies’ apps or
              websites for ads.
            </p>
          </section>

          <section id="ai-features" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>AI features</h2>
            <p className={`mt-4 ${bodyText}`}>
              Optional features (including Cortex, OO, call recap, Spine news, image generation, and
              face-scan portraits) send the prompts and relevant context you provide to third-party
              model providers (for example via OpenRouter, which may route to vendors such as Anthropic
              or OpenAI). That context can include Spine notes, conversation snippets the feature
              includes, photos you submit, or other content you ask the assistant to use.
            </p>
            <p className={`mt-4 ${bodyText}`}>
              Those providers process the data to return a result under their own terms. We do not
              currently train our own foundation models on your content. We do not sell that content.
              AI outputs can be wrong; they are not professional advice.
            </p>
          </section>

          <section id="how-we-share-information" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>How we share information</h2>
            <p className={`mt-4 ${bodyText}`}>We share information only as needed:</p>
            <ul className={`mt-4 space-y-3 pl-5 ${bodyText} list-disc marker:text-light-space/35 light:marker:text-zinc-400`}>
              <li>
                <strong className="text-light-space light:text-zinc-950">Service providers.</strong>{" "}
                Vendors that host data and run the product, including cloud database / auth / storage
                (Supabase), real-time media (LiveKit and similar), push delivery (Apple and Google),
                crash diagnostics (Sentry), AI model routing (OpenRouter and the model vendors it
                uses), email delivery, and our hosting provider. They are limited by contract to
                providing services to us.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Other users.</strong> Content
                you send or publish (messages, calls, profile fields you make visible) is shared as
                you direct.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Legal and safety.</strong> When
                required by law, or to protect rights, safety, and integrity of users and the Service.
              </li>
              <li>
                <strong className="text-light-space light:text-zinc-950">Business transfers.</strong> If
                we are involved in a merger or acquisition, information may transfer as part of that
                transaction, subject to this Policy or equivalent protections.
              </li>
            </ul>
          </section>

          <section id="cookies" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Cookies (marketing site)</h2>
            <p className={`mt-4 ${bodyText}`}>
              jokuh.com / www.jokuh.com uses essential cookies to run the site. With your consent, we
              may also load Google Analytics and advertising cookies (analytics and marketing toggles
              in the cookie banner). You can refuse optional cookies. The signed-in Jokuh app is
              separate from those marketing-site cookies.
            </p>
          </section>

          <section id="retention" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Retention</h2>
            <p className={`mt-4 ${bodyText}`}>
              We keep information as long as your account is active and as needed to provide the
              Service, comply with law, resolve disputes, and enforce our agreements. You may delete
              certain content in the app and may delete your account in Settings. Deleting your
              account removes your profile and Spine data we hold for you; messages you already sent
              may remain in other people’s inboxes; some copies may persist in backups for a limited
              period.
            </p>
          </section>

          <section id="security" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Security</h2>
            <p className={`mt-4 ${bodyText}`}>
              We use administrative, technical, and organizational safeguards designed to protect
              information. No method of transmission or storage is 100% secure.
            </p>
          </section>

          <section id="your-choices" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Your choices and rights</h2>
            <p className={`mt-4 ${bodyText}`}>
              Depending on where you live, you may have rights to access, correct, delete, or export
              personal information, and to object to or restrict certain processing. In the app you
              can manage many choices in Settings (for example notifications, call-recap preferences,
              and account deletion). To exercise other rights, contact{" "}
              <a href="mailto:privacy@jokuh.com" className={linkClass}>privacy@jokuh.com</a>. You may
              appeal our response where applicable law requires.
            </p>
          </section>

          <section id="children" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Children</h2>
            <p className={`mt-4 ${bodyText}`}>
              The Service is intended for users{" "}
              <strong className="text-light-space light:text-zinc-950">17</strong> or older (or the
              age of majority in your country, if higher). We do not knowingly collect personal
              information from children under 17. If you believe we have, contact us and we will
              delete it.
            </p>
          </section>

          <section id="international" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>International users</h2>
            <p className={`mt-4 ${bodyText}`}>
              We may process and store information in the United States and other countries where we
              or our providers operate. Those countries may have different data-protection laws than
              your own.
            </p>
          </section>

          <section id="california" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>California (U.S.) notice</h2>
            <p className={`mt-4 ${bodyText}`}>
              California residents may request to know, delete, and correct certain personal
              information, and may limit use of sensitive personal information where applicable. We
              do not sell personal information. On the marketing website, if you consent to marketing
              cookies, identifiers may be disclosed to Google in a way that California law treats as
              “sharing” for cross-context advertising. You can refuse those cookies. The Jokuh app
              does not use App Tracking Transparency tracking. To submit a request, email{" "}
              <a href="mailto:privacy@jokuh.com" className={linkClass}>privacy@jokuh.com</a>.
            </p>
          </section>

          <section id="changes" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Changes</h2>
            <p className={`mt-4 ${bodyText}`}>
              We may update this Policy. We will post the new date at the top and, when changes are
              material, provide additional notice as required by law. If we enable Jokuh Wallet or
              paid play, we will update this Policy first.
            </p>
          </section>

          <section id="contact" className="scroll-mt-24">
            <h2 className={sectionTitle}>Contact</h2>
            <p className={`mt-4 ${bodyText}`}>
              Privacy: <a href="mailto:privacy@jokuh.com" className={linkClass}>privacy@jokuh.com</a>
              <br />
              Legal: <a href="mailto:legal@jokuh.com" className={linkClass}>legal@jokuh.com</a>
              <br />
              Terms: <a href="/terms" className={linkClass}>Terms of Service</a>
            </p>
          </section>
        </TertiaryDocBody>
      </>
    </CompanyPageLayout>
  );
}
