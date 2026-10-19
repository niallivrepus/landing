/**
 * **Purpose:** Landing → web app OO handoff encoder. The homepage's "Ask OO…" sends the visitor into the web app's
 * signed-out OO (`/oo`), which answers there, so the landing never renders a reply.
 * **Contract (jokuh-live `frontend/src/guest-home/landing-handoff.ts`, `buildLandingHandoffUrl` — keep in sync):**
 * - one visitor prompt → `${origin}/oo#q=<encodeURIComponent(prompt)>&theme=<dark|light>`
 * - a conversation → `${origin}/oo#oo=<base64url(UTF-8 JSON)>`, JSON `{ v: 1, messages: [{ role, content }], theme? }`
 * - caps: ≤ 8 visitor turns, ≤ 800 chars per message; the fragment never reaches a server.
 * **Origin:** `VITE_OO_HANDOFF_ORIGIN` (e.g. `http://localhost:5173` for a local web app), default `https://app.jokuh.com`.
 * **Connects to:** `GooHero` (first send / suggestion tap, Continue in app), `config/download-links.ts` (`resolveWebStartUrl`).
 */

export type HandoffMessage = { role: "user" | "assistant"; content: string };
export type HandoffTheme = "dark" | "light";

export const HANDOFF_MAX_VISITOR_TURNS = 8;
export const HANDOFF_MAX_MESSAGE_CHARS = 800;
const GUEST_OO_PATH = "/oo";

/** **Returns** the web app origin the handoff goes to (env override for local testing). */
export function resolveHandoffOrigin(): string {
  const configured = (import.meta.env.VITE_OO_HANDOFF_ORIGIN as string | undefined)?.trim();
  return (configured || "https://app.jokuh.com").replace(/\/+$/, "");
}

function utf8ToBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Same cleaning as the app: trim + cap each message, keep the newest 8 visitor turns, never start on OO. */
function sanitize(messages: HandoffMessage[]): HandoffMessage[] {
  const out: HandoffMessage[] = [];
  for (const m of messages) {
    if (m.role !== "user" && m.role !== "assistant") continue;
    const content = m.content.trim().slice(0, HANDOFF_MAX_MESSAGE_CHARS);
    if (content) out.push({ role: m.role, content });
  }
  while (out.filter((m) => m.role === "user").length > HANDOFF_MAX_VISITOR_TURNS) out.shift();
  while (out.length && out[0]!.role !== "user") out.shift();
  return out;
}

/** **Returns** the web app URL that continues this conversation (or one prompt) in OO. */
export function buildLandingHandoffUrl(messages: HandoffMessage[], theme?: HandoffTheme, origin = resolveHandoffOrigin()): string {
  const clean = sanitize(messages);
  const base = `${origin}${GUEST_OO_PATH}`;
  if (clean.length === 1 && clean[0]!.role === "user") {
    return `${base}#q=${encodeURIComponent(clean[0]!.content)}${theme ? `&theme=${theme}` : ""}`;
  }
  if (!clean.length) return base;
  const payload = utf8ToBase64Url(JSON.stringify({ v: 1, messages: clean, ...(theme ? { theme } : {}) }));
  return `${base}#oo=${payload}`;
}

/** **Returns** the plain guest OO page (Start on the web). */
export function resolveGuestOoUrl(): string {
  return `${resolveHandoffOrigin()}${GUEST_OO_PATH}`;
}
