import { DocAppShell } from "../components/docs/DocAppShell";

/**
 * Hosted Privacy Policy for the Jokuh apps and marketing site.
 * Keep this page aligned with what the product actually collects (Bond, Spine, messaging,
 * calls, AI, face-scan onboarding, location, Arcade, Wallet).
 * 2026-10-27: encryption scope, OO on by default in chats and model providers brought in line with `/security`
 * (jokuh-live `docs/privacy-truth-program.md`).
 * 2026-10-30: Wallet is live (Sean). Wallet facts checked against jokuh-live origin/main: ledger assets vs device
 * custody (`wallet_crypto_assets.custody`, 20260908180000), Batcoin buy-only swap (20260924214805), Fuel never moves
 * (20261015064752), tips public unless anonymous (20260909130000), PRF-wrapped seed backup (`wallet_key_vault`),
 * Zcash data never sent to Supabase (`Sources/wallet-zcash/zcash-shielded-store.swift`), wallet rows cascade on
 * account delete (20260606170000). Keep in step with Terms § 3 and Support.
 *
 * Renders as a Jokuh Doc in the app shell (`DocAppShell`, 2026-10-27). The legal text is unchanged by that move.
 */
const TOC_ITEMS = [
  { id: "who-we-are", label: "Who we are" },
  { id: "information-we-collect", label: "Information we collect" },
  { id: "how-we-use-information", label: "How we use information" },
  { id: "ai-features", label: "AI features" },
  { id: "wallet", label: "Wallet" },
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

export function PrivacyPolicyPage() {
  return (
    <DocAppShell title="Privacy Policy" sharePath="/privacy" updated="Last updated October 27, 2026" toc={TOC_ITEMS}>
      <p className="doc-lede">
        Last updated October 27, 2026. This Privacy Policy describes how Jokuh LLC (“Jokuh,” “we,” “us,” or “our”) handles information when you use the Jokuh applications, websites, and related services (together, the “Service”).
      </p>

      <section id="who-we-are">
        <h2>Who we are</h2>
        <p>
          Jokuh is a communication and personal-organization product: messaging, voice and video
          calling, a personal timeline (“Spine”), built-in intelligence (“OO”, also called
          “Cortex”), profile and social features, optional Arcade games, and Jokuh Wallet. How Wallet
          handles your information is in the <a href="#wallet">Wallet</a> section.
        </p>
        <p>
          Questions:{" "}
          <a href="mailto:privacy@jokuh.com">privacy@jokuh.com</a>.
        </p>
      </section>

      <section id="information-we-collect">
        <h2>Information we collect</h2>
        <p>
          We collect information needed to run the Service. Categories include:
        </p>
        <ul>
          <li>
            <strong>Account and authentication.</strong>{" "}
            A username and passwordless sign-in with your device’s passkey / biometrics (“Bond”).
            We store passkey credentials and a technical account identifier required by our auth
            system (formatted like an email address) so we can issue a session. We do not use that
            identifier to send marketing email. Jokuh does not receive your Face ID / Touch ID /
            fingerprint templates — those stay on your device.
          </li>
          <li>
            <strong>Profile.</strong> Display name,
            biography, username, profile photo, and other fields you add (for example music, gallery,
            or a public location on your profile).
          </li>
          <li>
            <strong>Face-scan onboarding.</strong>{" "}
            New accounts are asked to capture photos of their face so we can generate a profile
            portrait with an AI image model. Those photos and the generated image are stored with
            your account as identity / profile images. This is a portrait capture, not a government
            ID check, and we do not use it to unlock the device (that is Bond / the OS).
          </li>
          <li>
            <strong>Spine and activity.</strong>{" "}
            Timeline entries, notes, reminders, planner data, files you import, optional call
            recaps, and other content you create or sync into Spine (including optional calendar
            or reminders access you grant on the device).
          </li>
          <li>
            <strong>Messages and social content.</strong>{" "}
            Direct messages, group messages, Blurbs, and related metadata (for example delivery or
            read state). Recipients keep copies of content you send them. Direct and group message
            text and attachments are encrypted on your device before they are sent. OO is on in
            your chats by default: it is a member of those chats, so its key, which we hold, can
            decrypt them, and we process them to provide OO’s help. You can turn OO off for chats
            in Settings. We can still see metadata such as who is in a chat, when messages are sent,
            group names and photos, and notices such as who joined. Messages sent before encryption
            was added to Jokuh, and call summaries that Jokuh posts into a chat, are stored without
            end-to-end encryption. Our{" "}
            <a href="/security">Security page</a> lists exactly what is and
            is not end-to-end encrypted.
          </li>
          <li>
            <strong>Jokuh Mail.</strong> Each
            account has an email address (username@jokuh.com). We store the email you send and
            receive — senders and recipients, subjects, message bodies, attachments, and the original
            message file — so you can read it on all your devices. Unlike chat messages, email is
            not end-to-end encrypted: it is stored encrypted at rest on our servers and is readable by
            our systems to deliver it, file it (for example People vs. Updates), check it for spam and
            phishing, and send you notifications. Images inside emails are loaded through a Jokuh
            proxy so senders cannot see your IP address or device; you can turn remote images off in
            Settings. We keep delivery status of mail you send and may pause sending from an account
            that generates spam complaints.
          </li>
          <li>
            <strong>Calls and live audio/video.</strong>{" "}
            Session details needed to connect voice/video calls and optional live rooms. If you
            enable call recap or related features, audio may be transcribed and stored as described
            in the app. Live features may use real-time media providers to route audio and video.
            One-to-one calls between two Jokuh accounts are end-to-end encrypted. Group calls,
            meeting-link calls, calls with guests or agents, and calls that are transcribed or live
            are not end-to-end encrypted.
          </li>
          <li>
            <strong>Contacts and relationships.</strong>{" "}
            People you connect with in Jokuh (connection requests, roster, in-app contacts). We do
            not require access to your device address book; if a feature asks for it, it is optional
            and described in the system permission prompt.
          </li>
          <li>
            <strong>Location.</strong> Precise
            location when you tap to share location in a conversation, or when you publish a
            location on your profile. Optional Sky Lens / birth-chart features also store birth
            date, time, and place you enter.
          </li>
          <li>
            <strong>Notifications.</strong> Device
            tokens and preferences needed to deliver alerts you ask for (messages, calls, and similar).
          </li>
          <li>
            <strong>Voice memos and dictation.</strong>{" "}
            Audio you record or dictate may be processed on device or sent for transcription as
            described in the feature.
          </li>
          <li>
            <strong>In-app browser.</strong> Sites
            you open inside Jokuh collect information under their own policies. Jokuh may store
            normal browser data (cookies, cache) on your device until you clear it.
          </li>
          <li>
            <strong>Arcade.</strong> Gameplay events
            for optional games. Jack the Pot tickets cost Fuel and prizes are paid in Fuel (see{" "}
            <a href="#wallet">Wallet</a>). There is no cash play and there are no cash prizes.
          </li>
          <li>
            <strong>Technical and diagnostic data.</strong>{" "}
            App version, device type, crash reports, and error logs (including reports sent to our
            crash-monitoring provider) to keep the Service reliable and secure.
          </li>
        </ul>
      </section>

      <section id="how-we-use-information">
        <h2>How we use information</h2>
        <p>We use information to:</p>
        <ul>
          <li>Provide, operate, and secure the Service;</li>
          <li>Authenticate you and sync your account across devices;</li>
          <li>Deliver messages, calls, notifications, and Spine content you request;</li>
          <li>Generate optional AI responses and portraits you ask for;</li>
          <li>Improve performance, fix bugs, and detect abuse;</li>
          <li>Comply with law and respond to lawful requests.</li>
        </ul>
        <p>
          We do <strong>not</strong> sell your
          personal information. The Jokuh app does{" "}
          <strong>not</strong> use your content to
          serve third-party advertising, and we do not track you across other companies’ apps or
          websites for ads.
        </p>
      </section>

      <section id="ai-features">
        <h2>AI features</h2>
        <p>
          OO is on in your chats by default and reads along to help; you can turn it off for chats
          in Settings. When you use OO, or features such as call recap, Spine briefs and news,
          mail summaries, image generation, and face-scan portraits, we send the prompts and
          relevant context to model providers. That context can include Spine notes, chat
          messages in chats OO is in, call transcripts, photos you submit, or other content you
          ask OO to use.
        </p>
        <p>
          OO’s main models are open-weight models hosted by Chutes, which runs them inside secure
          hardware enclaves (TEEs) on the Bittensor network. When those are unavailable, requests
          may go to backup providers that do not use enclaves. Other features use model providers
          reached through OpenRouter (which may route to vendors such as Anthropic) and OpenAI
          (for example, for portraits).
        </p>
        <p>
          Those providers process the data to return a result under their own terms. We do not
          currently train our own foundation models on your content. We do not sell that content.
          AI outputs can be wrong; they are not professional advice.
        </p>
      </section>

      <section id="wallet">
        <h2>Wallet</h2>
        <p>Jokuh Wallet keeps two kinds of balance, and we handle them differently.</p>
        <ul>
          <li>
            <strong>Balances Jokuh holds for you.</strong> Batcoin, Fuel, Bitcoin, Solana, Avalanche (AVAX) and USD
            Coin (USDC) are kept as balances in your account on our servers. We store those balances, your transfers,
            swaps, tips and payment requests, the deposit addresses we create for you, the outside addresses you
            withdraw to, and the holds and limits on your withdrawals.
          </li>
          <li>
            <strong>Zcash on your device.</strong> On iPhone and Mac, Zcash is a self-custody wallet. Its address,
            balance and history stay on your device and are never sent to us. Your recovery phrase is kept on your
            device; we also store a backup of it that is locked with your passkey, so you can restore it on a new
            device, and we can&apos;t read it. To sync, the app connects to public Zcash servers from a list we recommend.
          </li>
          <li>
            <strong>Who can see what.</strong> People you pay, tip or ask for money see that payment. Tips are public
            by default: signed-in people can see the totals on a profile, blurb or stream and the names of the top
            tippers, unless you tip anonymously. Coins sent to or from outside addresses travel on public blockchains,
            where those addresses and amounts are visible to anyone.
          </li>
          <li>
            <strong>Spine and OO.</strong> On iPhone and Mac, payments, swaps and withdrawals are added to your Spine
            timeline. If you ask OO about your wallet, it can read your balances and activity, and a payment it
            prepares only goes through after you confirm it.
          </li>
          <li>
            <strong>Rewards.</strong> We may give you Batcoin, for example when you join, invite a friend or post on
            consecutive days. We record these grants with your balance.
          </li>
        </ul>
      </section>

      <section id="how-we-share-information">
        <h2>How we share information</h2>
        <p>We share information only as needed:</p>
        <ul>
          <li>
            <strong>Service providers.</strong>{" "}
            Vendors that host data and run the product, including cloud database / auth / storage
            (Supabase), real-time media (LiveKit and similar), push delivery (Apple and Google),
            crash diagnostics (Sentry), AI model hosting and routing (Chutes, OpenRouter and the
            model vendors it uses, and OpenAI), email sending and receiving for Jokuh Mail (Resend, which uses Amazon Web
            Services), blockchain and price services for Wallet (for example mempool.space, Solana and Avalanche
            network services, CoinGecko for prices, and public Zcash servers), and our hosting provider. They are limited by contract to
            providing services to us.
          </li>
          <li>
            <strong>Other users.</strong> Content
            you send or publish (messages, calls, profile fields you make visible) is shared as
            you direct.
          </li>
          <li>
            <strong>Legal and safety.</strong> When
            required by law, or to protect rights, safety, and integrity of users and the Service.
          </li>
          <li>
            <strong>Business transfers.</strong> If
            we are involved in a merger or acquisition, information may transfer as part of that
            transaction, subject to this Policy or equivalent protections.
          </li>
        </ul>
      </section>

      <section id="cookies">
        <h2>Cookies (marketing site)</h2>
        <p>
          jokuh.com / www.jokuh.com uses essential cookies to run the site. With your consent, we
          may also load Google Analytics and advertising cookies (analytics and marketing toggles
          in the cookie banner). You can refuse optional cookies. The signed-in Jokuh app is
          separate from those marketing-site cookies.
        </p>
      </section>

      <section id="retention">
        <h2>Retention</h2>
        <p>
          We keep information as long as your account is active and as needed to provide the
          Service, comply with law, resolve disputes, and enforce our agreements. You may delete
          certain content in the app and may delete your account in Settings. Deleting your
          account removes your profile, Spine data, your Jokuh Mail mailbox (messages and
          attachments) and your Wallet with the balances we hold for you, so move any coins out first (Batcoin and
          Fuel can&apos;t be withdrawn). It also deletes the passkey-locked backup of your Zcash recovery phrase; Zcash
          on your device can still be restored with the phrase itself. Messages and email you already sent
          may remain in other people’s inboxes; some copies may persist in backups for a limited
          period.
        </p>
      </section>

      <section id="security">
        <h2>Security</h2>
        <p>
          We use administrative, technical, and organizational safeguards designed to protect
          information. No method of transmission or storage is 100% secure. See our{" "}
          <a href="/security">Security page</a> for what is and is not
          end-to-end encrypted.
        </p>
      </section>

      <section id="your-choices">
        <h2>Your choices and rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, or export
          personal information, and to object to or restrict certain processing. In the app you
          can manage many choices in Settings (for example notifications, call-recap preferences,
          and account deletion). To exercise other rights, contact{" "}
          <a href="mailto:privacy@jokuh.com">privacy@jokuh.com</a>. You may
          appeal our response where applicable law requires.
        </p>
      </section>

      <section id="children">
        <h2>Children</h2>
        <p>
          The Service is intended for users{" "}
          <strong>17</strong> or older (or the
          age of majority in your country, if higher). We do not knowingly collect personal
          information from children under 17. If you believe we have, contact us and we will
          delete it.
        </p>
      </section>

      <section id="international">
        <h2>International users</h2>
        <p>
          We may process and store information in the United States and other countries where we
          or our providers operate. Those countries may have different data-protection laws than
          your own.
        </p>
      </section>

      <section id="california">
        <h2>California (U.S.) notice</h2>
        <p>
          California residents may request to know, delete, and correct certain personal
          information, and may limit use of sensitive personal information where applicable. We
          do not sell personal information. On the marketing website, if you consent to marketing
          cookies, identifiers may be disclosed to Google in a way that California law treats as
          “sharing” for cross-context advertising. You can refuse those cookies. The Jokuh app
          does not use App Tracking Transparency tracking. To submit a request, email{" "}
          <a href="mailto:privacy@jokuh.com">privacy@jokuh.com</a>.
        </p>
      </section>

      <section id="changes">
        <h2>Changes</h2>
        <p>
          We may update this Policy. We will post the new date at the top and, when changes are
          material, provide additional notice as required by law.
        </p>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>
          Privacy: <a href="mailto:privacy@jokuh.com">privacy@jokuh.com</a>
          <br />
          Legal: <a href="mailto:legal@jokuh.com">legal@jokuh.com</a>
          <br />
          Terms: <a href="/terms">Terms of Service</a>
        </p>
      </section>
    </DocAppShell>
  );
}
