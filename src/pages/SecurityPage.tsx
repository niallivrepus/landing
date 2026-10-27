/**
 * **Purpose:** Plain public page that says exactly what is and isn't end-to-end encrypted, backing the homepage
 * "Private by design" strip. App Store reviewers open it, so every line must be true of the shipped product.
 * **Claims (2026-10-27, jokuh-live `docs/privacy-truth-program.md` "Now" column):** identity key on device; messages
 * and 1:1 calls between Jokuh accounts are E2EE; OO is on in chats by default, its key is held server-side, so
 * Jokuh can read chats OO is in; OO's main models run on open models inside TEEs, with non-TEE fallbacks; Spine,
 * Docs, Mail, group/meeting calls and metadata are not E2EE; legacy messages are stored as sent. Never: "Jokuh
 * can't read", FHE, zero knowledge (the passport check is untested end to end), Mail or Spine in an encryption
 * line.
 * The OO encrypted-group figure (`public/figures/oo-e2ee-vault/`) is no longer embedded here: it showed a server
 * that only holds sealed boxes, which isn't true while OO is on by default.
 * **Connects to:** `/security` route in `App.tsx`, `SiteFooter`, homepage trust strip, `/privacy`.
 */
import { DocAppShell } from "../components/docs/DocAppShell";
import { SiteLink } from "../components/SiteLink";

const TOC_ITEMS = [
  { id: "keys", label: "Sign-in and keys" },
  { id: "encrypted", label: "What is end-to-end encrypted" },
  { id: "oo-in-chats", label: "OO in your chats" },
  { id: "oo-answers", label: "Where OO's answers come from" },
  { id: "not-encrypted", label: "What isn't end-to-end encrypted" },
  { id: "report", label: "Report a problem" },
];

/** Renders the /security explainer as a Jokuh Doc (`DocAppShell`, the recap-style Docs sheet). */
export function SecurityPage() {
  return (
    <DocAppShell title="Security" sharePath="/security" updated="Updated October 27, 2026" toc={TOC_ITEMS}>
      <p className="doc-lede">
        Messages are encrypted on your device before they&apos;re sent. OO reads along in chats to help, and you can turn
        that off in Settings. This page says exactly what is and isn&apos;t covered.
      </p>

      <section id="keys">
        <h2>Sign-in and keys</h2>
        <p>
          You sign in with a passkey, using Face ID, Touch ID or your device passcode. Your identity key stays on your
          device, so there is no password to steal or phish.
        </p>
        <p>The keys that unlock your messages are kept on your devices.</p>
      </section>

      <section id="encrypted">
        <h2>What is end-to-end encrypted</h2>
        <ul>
          <li>
            Direct and group messages, and the photos, voice notes and files in them. They&apos;re encrypted on your
            device before they&apos;re sent and opened on the devices in the chat.
          </li>
          <li>One-to-one voice and video calls between two Jokuh accounts.</li>
        </ul>
      </section>

      <section id="oo-in-chats">
        <h2>OO in your chats</h2>
        <p>
          OO is on in your chats by default. It joins as a member of the chat with its own key, so it can read the chat
          and help with things like summaries, plans and reminders. OO&apos;s key is held on Jokuh&apos;s servers, which
          means our systems can read the chats OO is in.
        </p>
        <p>If you want a chat to stay between people only, turn OO off for chats in Settings.</p>
      </section>

      <section id="oo-answers">
        <h2>Where OO&apos;s answers come from</h2>
        <p>
          OO&apos;s main models are open models that run inside secure hardware enclaves (TEEs). When those aren&apos;t
          available, a backup provider may answer instead. A few features use other model providers, for example to make
          your profile portrait. The <SiteLink href="/privacy#ai-features">Privacy Policy</SiteLink> lists them.
        </p>
      </section>

      <section id="not-encrypted">
        <h2>What isn&apos;t end-to-end encrypted</h2>
        <ul>
          <li>Spine, Docs and what OO remembers for you. They&apos;re private to your account and stored on our servers.</li>
          <li>Jokuh Mail. Email is stored on our servers so it can be delivered, sorted and checked for spam.</li>
          <li>Group calls, meeting links, calls with guests or agents, and calls that are transcribed or live.</li>
          <li>Call summaries that Jokuh posts into a chat after a call.</li>
          <li>
            Who you talk to and when, group names and photos, and the notes Jokuh adds to a chat, such as who joined.
          </li>
          <li>
            Messages sent before Jokuh added encryption. They&apos;re stored the way they were sent, and we&apos;re
            working on encrypting them without anyone losing their history.
          </li>
        </ul>
      </section>

      <section id="report">
        <h2>Report a problem</h2>
        <p>
          Found a security issue? Email <a href="mailto:support@jokuh.com">support@jokuh.com</a>. How we collect and keep
          account data is in the <SiteLink href="/privacy">Privacy Policy</SiteLink>.
        </p>
      </section>
    </DocAppShell>
  );
}
