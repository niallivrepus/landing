import { TertiaryDocBody, TertiaryPageHero } from "../components/system";
import { CompanyPageLayout } from "../components/CompanyPageLayout";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const TOC_ITEMS = [
  { id: "who-we-are", label: "Who we are" },
  { id: "information-we-collect", label: "Information we collect" },
  { id: "how-we-use-information", label: "How we use information" },
  { id: "how-we-share-information", label: "How we share information" },
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
          intro="Last updated August 10, 2026. This Privacy Policy describes how Jokuh (“we,” “us,” or “our”) handles information when you use the Jokuh applications and related web experiences (together, the “Service”)."
        />
        <TertiaryDocBody tocItems={TOC_ITEMS}>
          <section id="who-we-are" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Who we are</h2>
            <p className={`mt-4 ${bodyText}`}>
              Jokuh provides communication and personal organization tools, including messaging, calling, and your
              personal timeline (&ldquo;Spine&rdquo;). If you have questions about this policy, contact{" "}
              <a href="mailto:privacy@jokuh.com" className={linkClass}>privacy@jokuh.com</a>.
            </p>
          </section>

          <section id="information-we-collect" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Information we collect</h2>
            <p className={`mt-4 ${bodyText}`}>We collect information needed to run the Service. Categories include:</p>
            <ul className={`mt-4 space-y-3 pl-5 ${bodyText} list-disc marker:text-light-space/35 light:marker:text-zinc-400`}>
              <li><strong className="text-light-space light:text-zinc-950">Account and authentication.</strong> A username and security credentials created with your device&rsquo;s passkey / biometric sign-in (&ldquo;Bond&rdquo;). We use a technical account identifier required by our authentication system (formatted like an email address) so your session can be issued securely; we do not use it to send marketing email.</li>
              <li><strong className="text-light-space light:text-zinc-950">Profile.</strong> Information you add such as display name, biography, and profile photo.</li>
              <li><strong className="text-light-space light:text-zinc-950">Spine and activity.</strong> Timeline entries, reminders, planner-related data, and other content you create or import into Spine, including optional memories from calls when that feature is on.</li>
              <li><strong className="text-light-space light:text-zinc-950">Messages.</strong> Content and metadata for direct messages you send or receive (for example delivery and read state).</li>
              <li><strong className="text-light-space light:text-zinc-950">Calls.</strong> When you place or receive calls through Jokuh, we process session details needed to connect the call. If you and other participants have call-related features enabled, call transcripts or related audio may be processed and stored as described in the app.</li>
              <li><strong className="text-light-space light:text-zinc-950">Contacts and relationships.</strong> Information about people you connect with in Jokuh (for example connection requests and roster data).</li>
              <li><strong className="text-light-space light:text-zinc-950">Notifications.</strong> Device tokens and preferences needed to deliver alerts you ask for (for example messages or calls).</li>
              <li><strong className="text-light-space light:text-zinc-950">In-app browser.</strong> If you open websites inside Jokuh, those sites may collect information under their own policies. Jokuh may store normal browser data (such as cookies or cache) on your device until you clear it.</li>
              <li><strong className="text-light-space light:text-zinc-950">Voice features.</strong> If you use voice memos or dictation features, audio may be processed on your device or sent for processing as described in the feature.</li>
              <li><strong className="text-light-space light:text-zinc-950">Optional gadgets.</strong> Features such as translation or downloads may send the text or links you submit to our or third-party services to return results.</li>
              <li><strong className="text-light-space light:text-zinc-950">Technical data.</strong> Basic diagnostics such as app version, device type, and error logs to keep the Service reliable and secure.</li>
            </ul>
          </section>

          <section id="how-we-use-information" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>How we use information</h2>
            <p className={`mt-4 ${bodyText}`}>We use information to:</p>
            <ul className={`mt-4 space-y-2 pl-5 ${bodyText} list-disc marker:text-light-space/35 light:marker:text-zinc-400`}>
              <li>Provide, operate, and secure the Service;</li>
              <li>Authenticate you and sync your account across devices;</li>
              <li>Deliver messages, calls, and notifications you request;</li>
              <li>Store and display your Spine content;</li>
              <li>Improve performance, fix bugs, and detect abuse;</li>
              <li>Comply with law and respond to lawful requests.</li>
            </ul>
            <p className={`mt-4 ${bodyText}`}>
              We do <strong className="text-light-space light:text-zinc-950">not</strong> sell your personal information.
              We do <strong className="text-light-space light:text-zinc-950">not</strong> use your content to serve third-party advertising.
            </p>
          </section>

          <section id="how-we-share-information" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>How we share information</h2>
            <p className={`mt-4 ${bodyText}`}>We share information only as needed:</p>
            <ul className={`mt-4 space-y-3 pl-5 ${bodyText} list-disc marker:text-light-space/35 light:marker:text-zinc-400`}>
              <li><strong className="text-light-space light:text-zinc-950">Service providers.</strong> With vendors that host data, route calls or media, deliver push notifications, or provide security and infrastructure — under contracts that limit use to providing services to us.</li>
              <li><strong className="text-light-space light:text-zinc-950">Other users.</strong> Content you send (messages, calls, profile fields you make visible) is shared as you direct.</li>
              <li><strong className="text-light-space light:text-zinc-950">Legal and safety.</strong> When required by law, or to protect rights, safety, and integrity of users and the Service.</li>
              <li><strong className="text-light-space light:text-zinc-950">Business transfers.</strong> If we are involved in a merger or acquisition, information may transfer as part of that transaction, subject to this Policy or equivalent protections.</li>
            </ul>
          </section>

          <section id="retention" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Retention</h2>
            <p className={`mt-4 ${bodyText}`}>
              We keep information as long as your account is active and as needed to provide the Service, comply with
              law, resolve disputes, and enforce our agreements. You may delete certain content in the app; some copies
              may persist in backups for a limited period.
            </p>
          </section>

          <section id="security" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Security</h2>
            <p className={`mt-4 ${bodyText}`}>
              We use administrative, technical, and physical safeguards designed to protect information. No method of
              transmission or storage is 100% secure.
            </p>
          </section>

          <section id="your-choices" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Your choices and rights</h2>
            <p className={`mt-4 ${bodyText}`}>
              Depending on where you live, you may have rights to access, correct, delete, or export personal
              information, and to object to or restrict certain processing. You can manage some choices in Settings
              (for example call transcript preferences). To exercise other rights, contact{" "}
              <a href="mailto:privacy@jokuh.com" className={linkClass}>privacy@jokuh.com</a>. You may appeal our
              response where applicable law requires.
            </p>
          </section>

          <section id="children" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Children</h2>
            <p className={`mt-4 ${bodyText}`}>
              The Service is not intended for children under <strong className="text-light-space light:text-zinc-950">13</strong>,
              and we do not knowingly collect their personal information. If you believe we have, contact us and we
              will delete it.
            </p>
          </section>

          <section id="international" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>International users</h2>
            <p className={`mt-4 ${bodyText}`}>
              We may process and store information in the United States and other countries where we or our providers
              operate. Those countries may have different data protection laws than your own.
            </p>
          </section>

          <section id="california" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>California (U.S.) notice</h2>
            <p className={`mt-4 ${bodyText}`}>
              California residents may request to know, delete, and correct certain personal information, and may
              limit use of sensitive personal information where applicable. We do not &ldquo;sell&rdquo; or
              &ldquo;share&rdquo; personal information as those terms are defined under the CCPA/CPRA for targeted
              advertising. To submit a request, email{" "}
              <a href="mailto:privacy@jokuh.com" className={linkClass}>privacy@jokuh.com</a>.
            </p>
          </section>

          <section id="changes" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>Changes</h2>
            <p className={`mt-4 ${bodyText}`}>
              We may update this Policy. We will post the new date at the top and, when changes are material, provide
              additional notice as required by law.
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
