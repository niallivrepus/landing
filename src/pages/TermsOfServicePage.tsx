import { TertiaryDocBody, TertiaryPageHero } from "../components/system";
import { CompanyPageLayout } from "../components/CompanyPageLayout";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const TOC_ITEMS = [
  { id: "who-may-use", label: "Who may use the Service" },
  { id: "accounts", label: "Accounts and Bond sign-in" },
  { id: "what-we-provide", label: "What the Service provides" },
  { id: "your-content", label: "Your content" },
  { id: "acceptable-use", label: "Acceptable use" },
  { id: "third-party", label: "Third-party services and links" },
  { id: "privacy", label: "Privacy" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "liability", label: "Limitation of liability" },
  { id: "indemnity", label: "Indemnity" },
  { id: "termination", label: "Termination" },
  { id: "governing-law", label: "Governing law and disputes" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

const bodyText = "font-sans text-[16px] leading-[1.72] text-light-space/75 light:text-zinc-700";
const sectionTitle = "font-sans text-[22px] font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-[24px]";
const linkClass = "rounded-sm text-[var(--color-blue-4)] transition-colors hover:underline";

export function TermsOfServicePage() {
  useDocumentTitle("Terms of Service — Jokuh");

  return (
    <CompanyPageLayout>
      <>
        <TertiaryPageHero
          eyebrow="Legal"
          title="Terms of Service"
          intro={
            <>
              Last updated August 10, 2026. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use
              of Jokuh&rsquo;s applications, websites, and related services (the &ldquo;Service&rdquo;). By creating an
              account, signing in, or otherwise using the Service, you agree to these Terms.
            </>
          }
        />
        <TertiaryDocBody tocItems={TOC_ITEMS}>
          <section id="who-may-use" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>1. Who may use the Service</h2>
            <p className={`mt-4 ${bodyText}`}>
              You must be at least <strong className="text-light-space light:text-zinc-950">13</strong> years old (or
              the age of digital consent in your country, if higher). If you use the Service on behalf of an
              organization, you represent that you have authority to bind that organization.
            </p>
          </section>

          <section id="accounts" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>2. Accounts and Bond sign-in</h2>
            <p className={`mt-4 ${bodyText}`}>
              Jokuh uses passwordless sign-in with your device (&ldquo;Bond&rdquo; / passkeys). You are responsible for
              activities under your account and for keeping your devices secure. Notify us at{" "}
              <a href="mailto:legal@jokuh.com" className={linkClass}>legal@jokuh.com</a> if you suspect unauthorized
              access.
            </p>
          </section>

          <section id="what-we-provide" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>3. What the Service provides</h2>
            <p className={`mt-4 ${bodyText}`}>
              Jokuh offers tools that may include messaging, voice and video calling, a personal timeline
              (&ldquo;Spine&rdquo;), reminders and planning features, an in-app browser, and optional utilities (such
              as translation or downloads). Features may change as we improve the product. Some capabilities depend on
              your device permissions (for example microphone, camera, or notifications).
            </p>
          </section>

          <section id="your-content" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>4. Your content</h2>
            <p className={`mt-4 ${bodyText}`}>
              You retain rights to content you submit. To operate the Service, you grant Jokuh a worldwide,
              non-exclusive license to host, store, reproduce, and display your content solely to provide and improve
              the Service for you and, where applicable, to other users you interact with (for example messages you
              send).
            </p>
            <p className={`mt-4 ${bodyText}`}>
              You are responsible for your content and for complying with law. Do not upload malware or attempt to
              disrupt the Service.
            </p>
          </section>

          <section id="acceptable-use" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>5. Acceptable use</h2>
            <p className={`mt-4 ${bodyText}`}>You agree not to misuse the Service. For example, you must not:</p>
            <ul className={`mt-4 space-y-2 pl-5 ${bodyText} list-disc marker:text-light-space/35 light:marker:text-zinc-400`}>
              <li>Violate applicable law or infringe others&rsquo; rights;</li>
              <li>Harass, threaten, or harm people, or distribute illegal content;</li>
              <li>Attempt to gain unauthorized access to systems, accounts, or data;</li>
              <li>Scrape, overload, or interfere with the normal operation of the Service;</li>
              <li>Use the Service to send spam or deceptive communications.</li>
            </ul>
            <p className={`mt-4 ${bodyText}`}>
              We may investigate and suspend or terminate accounts that violate these rules or create risk.
            </p>
          </section>

          <section id="third-party" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>6. Third-party services and links</h2>
            <p className={`mt-4 ${bodyText}`}>
              The Service may link to or embed third-party sites or services. Their terms and privacy policies apply
              to your use of them. Jokuh is not responsible for third-party content or practices.
            </p>
          </section>

          <section id="privacy" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>7. Privacy</h2>
            <p className={`mt-4 ${bodyText}`}>
              Our <a href="/privacy" className={linkClass}>Privacy Policy</a> explains how we handle personal
              information.
            </p>
          </section>

          <section id="disclaimers" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>8. Disclaimers</h2>
            <p className={`mt-4 ${bodyText}`}>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE.&rdquo; TO THE MAXIMUM EXTENT
              PERMITTED BY LAW, JOKUH DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
              SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.
            </p>
          </section>

          <section id="liability" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>9. Limitation of liability</h2>
            <p className={`mt-4 ${bodyText}`}>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, JOKUH AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AND SUPPLIERS WILL
              NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS, DATA, OR GOODWILL, ARISING FROM OR RELATED TO THE SERVICE OR THESE TERMS, EVEN IF ADVISED OF THE
              POSSIBILITY.
            </p>
            <p className={`mt-4 ${bodyText}`}>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO
              THE SERVICE OR THESE TERMS IS LIMITED TO THE GREATER OF{" "}
              <strong className="text-light-space light:text-zinc-950">U.S. $100</strong> OR THE AMOUNTS YOU PAID
              JOKUH FOR THE SERVICE IN THE <strong className="text-light-space light:text-zinc-950">SIX (6) MONTHS</strong>{" "}
              BEFORE THE CLAIM (IF ANY). SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; IN THOSE CASES, OUR
              LIABILITY IS LIMITED TO THE FULLEST EXTENT ALLOWED BY LAW.
            </p>
          </section>

          <section id="indemnity" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>10. Indemnity</h2>
            <p className={`mt-4 ${bodyText}`}>
              You will defend and indemnify Jokuh against claims, damages, losses, and expenses (including reasonable
              attorneys&rsquo; fees) arising from your content, your use of the Service, or your violation of these
              Terms, to the extent permitted by law.
            </p>
          </section>

          <section id="termination" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>11. Termination</h2>
            <p className={`mt-4 ${bodyText}`}>
              You may stop using the Service at any time. We may suspend or terminate access if you violate these
              Terms, if we must comply with law, or if we discontinue the Service (where we will provide reasonable
              notice when practicable). Provisions that by their nature should survive will survive termination.
            </p>
          </section>

          <section id="governing-law" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>12. Governing law and disputes</h2>
            <p className={`mt-4 ${bodyText}`}>
              These Terms are governed by the laws of the{" "}
              <strong className="text-light-space light:text-zinc-950">State of Delaware</strong>, United States,
              excluding conflict-of-law rules. You agree that state and federal courts located in Delaware have
              exclusive jurisdiction for disputes, subject to mandatory consumer protections in your country of
              residence where applicable.
            </p>
            <p className={`mt-4 ${bodyText}`}>
              Before filing a claim, you agree to try to resolve the dispute informally by contacting{" "}
              <a href="mailto:legal@jokuh.com" className={linkClass}>legal@jokuh.com</a>.
            </p>
          </section>

          <section id="changes" className="scroll-mt-24 pb-10">
            <h2 className={sectionTitle}>13. Changes</h2>
            <p className={`mt-4 ${bodyText}`}>
              We may modify these Terms. We will post the updated Terms with a new &ldquo;Last updated&rdquo; date. If
              changes are material, we will provide additional notice as appropriate (for example in the app or by
              email). Continued use after the effective date constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section id="contact" className="scroll-mt-24">
            <h2 className={sectionTitle}>14. Contact</h2>
            <p className={`mt-4 ${bodyText}`}>
              General legal: <a href="mailto:legal@jokuh.com" className={linkClass}>legal@jokuh.com</a>
              <br />
              Privacy: <a href="mailto:privacy@jokuh.com" className={linkClass}>privacy@jokuh.com</a>
            </p>
          </section>
        </TertiaryDocBody>
      </>
    </CompanyPageLayout>
  );
}
