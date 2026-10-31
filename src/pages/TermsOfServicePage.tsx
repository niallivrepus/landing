import { DocAppShell } from "../components/docs/DocAppShell";

/**
 * Hosted Terms of Service for Jokuh apps and related sites.
 * Age floor matches the App Store 17+ rating. Wallet is live (2026-10-30): § 3 Wallet paragraphs match what jokuh-live
 * origin/main does (see the Privacy Policy header for the evidence list); legal wording open items are in the trim report.
 *
 * Renders as a Jokuh Doc in the app shell (`DocAppShell`, 2026-10-27). The legal text is unchanged by that move.
 */
const TOC_ITEMS = [
  { id: "who-may-use", label: "Who may use the Service" },
  { id: "accounts", label: "Accounts and Bond sign-in" },
  { id: "what-we-provide", label: "What the Service provides" },
  { id: "your-content", label: "Your content" },
  { id: "ai-features", label: "AI features" },
  { id: "arcade", label: "Arcade" },
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

export function TermsOfServicePage() {
  return (
    <DocAppShell title="Terms of Service" sharePath="/terms" updated="Last updated August 24, 2026" toc={TOC_ITEMS}>
      <p className="doc-lede">
        Last updated August 24, 2026. These Terms of Service (“Terms”) govern your access to and
          use of Jokuh LLC’s applications, websites, and related services (the “Service”). By
          creating an account, signing in, or otherwise using the Service, you agree to these Terms.
      </p>

      <section id="who-may-use">
        <h2>1. Who may use the Service</h2>
        <p>
          You must be at least{" "}
          <strong>17</strong> years old (or the
          age of majority in your country, if higher). If you use the Service on behalf of an
          organization, you represent that you have authority to bind that organization.
        </p>
      </section>

      <section id="accounts">
        <h2>2. Accounts and Bond sign-in</h2>
        <p>
          Jokuh uses passwordless sign-in with your device (“Bond” / passkeys). You are responsible
          for activities under your account and for keeping your devices secure. Notify us at{" "}
          <a href="mailto:legal@jokuh.com">legal@jokuh.com</a> if you suspect
          unauthorized access. We may ask you to capture a face portrait during onboarding to
          create a profile image; that is not a substitute for keeping your device and passkeys
          secure.
        </p>
      </section>

      <section id="what-we-provide">
        <h2>3. What the Service provides</h2>
        <p>
          Jokuh offers tools that may include messaging, voice and video calling, a personal
          timeline (“Spine”), reminders and planning, profiles and social posts, optional AI
          assistance, an in-app browser, and optional Arcade games. Features may change as we
          improve the product. Some capabilities depend on device permissions (for example
          microphone, camera, photos, or notifications).
        </p>
        <p>
          <strong>Wallet.</strong> Jokuh Wallet lets you hold and move coins. Batcoin, Fuel, Bitcoin, Solana,
          Avalanche (AVAX) and USD Coin (USDC) are balances Jokuh holds for you on our servers. Zcash on iPhone and
          Mac is self-custody: it lives on your device and we never hold it.
        </p>
        <p>
          <strong>Batcoin and Fuel.</strong> Batcoin is Jokuh&apos;s in-app coin. You can get it in the app, send it
          to people on Jokuh and tip with it. It can&apos;t be sold, swapped for other coins or withdrawn. Fuel is a
          play credit for the Arcade that you get with Batcoin; it can&apos;t be sent, swapped, withdrawn or turned
          back into Batcoin or cash. We may give Batcoin as rewards and may change or end those rewards.
        </p>
        <p>
          <strong>Withdrawals and fees.</strong> Withdrawals to outside addresses are held for a period before they
          are sent and are subject to minimum and daily limits. We may hold, limit or pause withdrawals to protect
          your account or the Service. Blockchain transfers can&apos;t be reversed once sent, so check the address.
          Swaps and withdrawals may carry a fee.
        </p>
        <p>
          <strong>Your Zcash keys.</strong> You hold the keys to your Zcash. Keep your recovery phrase safe. If you
          lose both the phrase and access to your passkey backup, we can&apos;t recover your Zcash, and we can&apos;t
          reverse a Zcash payment.
        </p>
        <p>
          <strong>Deleting your account.</strong> Deleting your account deletes your Wallet and the balances Jokuh
          holds for you. Move coins you can withdraw out first.
        </p>
      </section>

      <section id="your-content">
        <h2>4. Your content</h2>
        <p>
          You retain rights to content you submit. To operate the Service, you grant Jokuh a
          worldwide, non-exclusive license to host, store, reproduce, transmit, and display your
          content solely as needed to provide the Service to you and to the people you interact
          with (for example messages you send). We do not claim a license to train our own
          foundation models on your content.
        </p>
        <p>
          You are responsible for your content and for complying with law. Do not upload malware
          or attempt to disrupt the Service.
        </p>
      </section>

      <section id="ai-features">
        <h2>5. AI features</h2>
        <p>
          Optional AI features send prompts and related context to third-party model providers to
          generate a response or image. Outputs can be inaccurate or inappropriate. They are not
          legal, medical, financial, or other professional advice. You remain responsible for how
          you use outputs. Do not submit content you are not allowed to share with those providers.
        </p>
      </section>

      <section id="arcade">
        <h2>6. Arcade</h2>
        <p>
          Arcade games are optional entertainment, and casual games are free. Jack the Pot tickets cost Fuel and
          prizes are paid in Fuel, which can&apos;t be turned into cash. We do not offer real-money wagering, cash
          tickets or cash payouts. We may change,
          pause, or remove games at any time.
        </p>
      </section>

      <section id="acceptable-use">
        <h2>7. Acceptable use</h2>
        <p>You agree not to misuse the Service. For example, you must not:</p>
        <ul>
          <li>Violate applicable law or infringe others’ rights;</li>
          <li>Harass, threaten, or harm people, or distribute illegal content;</li>
          <li>Attempt to gain unauthorized access to systems, accounts, or data;</li>
          <li>Scrape, overload, or interfere with the normal operation of the Service;</li>
          <li>Use the Service to send spam or deceptive communications;</li>
          <li>Bypass age, safety, or game-fairness controls.</li>
        </ul>
        <p>
          We have zero tolerance for objectionable content and abusive users. You can report a
          message, blurb, or profile, or block someone, from inside the app. We review reports
          within 24 hours and remove violating content and the accounts that post it.
        </p>
        <p>
          We may investigate and suspend or terminate accounts that violate these rules or create
          risk. Report abuse to{" "}
          <a href="mailto:support@jokuh.com">support@jokuh.com</a>.
        </p>
      </section>

      <section id="third-party">
        <h2>8. Third-party services and links</h2>
        <p>
          The Service may link to or embed third-party sites or services (including websites in
          the in-app browser, AI model providers, and media infrastructure). Their terms and
          privacy policies apply to your use of them. Jokuh is not responsible for third-party
          content or practices.
        </p>
      </section>

      <section id="privacy">
        <h2>9. Privacy</h2>
        <p>
          Our <a href="/privacy">Privacy Policy</a> explains how we handle
          personal information.
        </p>
      </section>

      <section id="disclaimers">
        <h2>10. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY
          LAW, JOKUH DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
          WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.
        </p>
      </section>

      <section id="liability">
        <h2>11. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, JOKUH AND ITS AFFILIATES, OFFICERS, EMPLOYEES,
          AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
          OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM OR RELATED
          TO THE SERVICE OR THESE TERMS, EVEN IF ADVISED OF THE POSSIBILITY.
        </p>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF
          OR RELATING TO THE SERVICE OR THESE TERMS IS LIMITED TO THE GREATER OF{" "}
          <strong>U.S. $100</strong> OR THE
          AMOUNTS YOU PAID JOKUH FOR THE SERVICE IN THE{" "}
          <strong>SIX (6) MONTHS</strong> BEFORE
          THE CLAIM (IF ANY). SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; IN THOSE CASES,
          OUR LIABILITY IS LIMITED TO THE FULLEST EXTENT ALLOWED BY LAW.
        </p>
      </section>

      <section id="indemnity">
        <h2>12. Indemnity</h2>
        <p>
          You will defend and indemnify Jokuh against claims, damages, losses, and expenses
          (including reasonable attorneys’ fees) arising from your content, your use of the
          Service, or your violation of these Terms, to the extent permitted by law.
        </p>
      </section>

      <section id="termination">
        <h2>13. Termination</h2>
        <p>
          You may stop using the Service at any time and may delete your account in Settings. We
          may suspend or terminate access if you violate these Terms, if we must comply with law,
          or if we discontinue the Service (where we will provide reasonable notice when
          practicable). Provisions that by their nature should survive will survive termination.
        </p>
      </section>

      <section id="governing-law">
        <h2>14. Governing law and disputes</h2>
        <p>
          These Terms are governed by the laws of the{" "}
          <strong>State of Delaware</strong>,
          United States, excluding conflict-of-law rules. You agree that state and federal courts
          located in Delaware have exclusive jurisdiction for disputes, subject to mandatory
          consumer protections in your country of residence where applicable.
        </p>
        <p>
          Before filing a claim, you agree to try to resolve the dispute informally by contacting{" "}
          <a href="mailto:legal@jokuh.com">legal@jokuh.com</a>.
        </p>
      </section>

      <section id="changes">
        <h2>15. Changes</h2>
        <p>
          We may modify these Terms. We will post the updated Terms with a new “Last updated”
          date. If changes are material, we will provide additional notice as appropriate (for
          example in the app). Continued use after the effective date constitutes acceptance of
          the updated Terms where permitted by law.
        </p>
      </section>

      <section id="contact">
        <h2>16. Contact</h2>
        <p>
          General legal: <a href="mailto:legal@jokuh.com">legal@jokuh.com</a>
          <br />
          Privacy: <a href="mailto:privacy@jokuh.com">privacy@jokuh.com</a>
        </p>
      </section>
    </DocAppShell>
  );
}
