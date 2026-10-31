import { DocAppShell } from "../components/docs/DocAppShell";
import { SiteLink } from "../components/SiteLink";

/**
 * Public support / FAQ for App Store Connect Support URL and in-app Settings → Support.
 * Wallet is live (2026-10-30); keep the Wallet answers aligned with Privacy (Wallet section) and Terms (section 3).
 * Renders as a Jokuh Doc in the app shell (`DocAppShell`, 2026-10-27).
 */
const TOC_ITEMS = [
  { id: "getting-started", label: "Getting started" },
  { id: "safety", label: "Safety and abuse reports" },
  { id: "common-issues", label: "Common issues" },
  { id: "legal", label: "Legal" },
  { id: "contact", label: "Contact" },
];

const FAQ = [
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
      "Go to Settings → Account → Delete Account inside the app. This removes your profile, Spine data and your Wallet with the balances we hold for you, so move coins out first. Zcash on your device can still be restored with its recovery phrase. Messages you already sent may remain in other people's conversations. See the Privacy Policy for backups and retention.",
  },
  {
    question: "Where is Wallet, and what can it do?",
    answer:
      "Open Wallet from your ID in the app. You can send Batcoin to people on Jokuh, tip with it, and ask for money in a chat. You can also receive and send Bitcoin, Solana and Avalanche (AVAX), swap between coins, and use them to get Batcoin. Batcoin can be bought but not sold or withdrawn. On iPhone and Mac, Zcash is a private wallet that lives on your device; keep its recovery phrase safe.",
  },
  {
    question: "I sent coins to the wrong address.",
    answer:
      "Withdrawals to an outside address wait before they are sent: currently 24 hours to an address you haven't used before and 30 minutes to one you have. Until then you can cancel it in Wallet. Once it has been sent on the blockchain it can't be reversed, and we can't get it back. Payments to people on Jokuh go straight to their Wallet.",
  },
  {
    question: "I found a bug or have a feature request.",
    answer:
      "Use Settings → Support → Send Feedback in the app, or email us — include your device model and OS version if it's a bug.",
  },
];

export function SupportPage() {
  return (
    <DocAppShell title="Support" sharePath="/support" toc={TOC_ITEMS}>
      <p className="doc-lede">
        Need help with Jokuh? Start here, or reach us directly. We usually reply within one business day.
      </p>

      <div className="doc-callout">
        <p>
          <strong>Email:</strong> <a href="mailto:support@jokuh.com">support@jokuh.com</a>
        </p>
        <p>
          Signed in? You can also send feedback from <strong>Settings → Support</strong> inside the app. It goes straight
          to our team.
        </p>
      </div>

      <section id="getting-started">
        <h2>Getting started</h2>
        <ul>
          <li>
            <strong>Signing in.</strong> Jokuh uses passwordless sign-in with your device’s passkey (Face ID, Touch ID, or
            Windows Hello), so there is no password to remember or reset. If you’re stuck at sign-in, make sure your
            device has biometrics or a passcode enabled, and that you’re using the same device (or an iCloud
            Keychain–synced device) you signed up with.
          </li>
          <li>
            <strong>Age.</strong> Jokuh is for people 17 and older.
          </li>
          <li>
            <strong>Face portrait.</strong> New accounts may be asked to take photos so we can generate a profile
            portrait. Camera permission is required for that step. You can change your profile photo later in ID.
          </li>
          <li>
            <strong>Spine.</strong> Your personal timeline for planning, notes, and synced calendar/reminder events.
            Grant Calendar or Reminders access in Settings if you want two-way sync.
          </li>
          <li>
            <strong>Calls.</strong> Voice and video calls need Microphone and Camera permission. If a call won’t
            connect, check Settings → Privacy on your device to confirm Jokuh has both.
          </li>
          <li>
            <strong>OO.</strong> Jokuh&apos;s built-in intelligence. OO is on in your chats by default and reads along to
            help; you can turn it off for chats in Settings. It can use context from your Spine and conversations. It
            can be wrong. Do not paste passwords or recovery codes into chat.
          </li>
          <li>
            <strong>Arcade.</strong> Optional games. Casual games are free. Jack the Pot tickets cost Fuel, a play
            credit you get with Batcoin, and prizes are paid in Fuel. Fuel can&apos;t be sent, swapped or withdrawn, and
            there is no cash play.
          </li>
        </ul>
      </section>

      <section id="safety">
        <h2>Safety and abuse reports</h2>
        <p>
          To report abusive content, harassment, or a security concern, email{" "}
          <a href="mailto:support@jokuh.com">support@jokuh.com</a> with as much detail as you can (usernames,
          screenshots, timestamps). Urgent safety issues are prioritized.
        </p>
      </section>

      <section id="common-issues">
        <h2>Common issues</h2>
        {FAQ.map((item) => (
          <details key={item.question} className="doc-qa">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>

      <section id="legal">
        <h2>Legal</h2>
        <p>
          <SiteLink href="/terms">Terms of Service</SiteLink> · <SiteLink href="/privacy">Privacy Policy</SiteLink>
        </p>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>
          Support: <a href="mailto:support@jokuh.com">support@jokuh.com</a>
          <br />
          Privacy: <a href="mailto:privacy@jokuh.com">privacy@jokuh.com</a>
          <br />
          Legal: <a href="mailto:legal@jokuh.com">legal@jokuh.com</a>
        </p>
      </section>
    </DocAppShell>
  );
}
