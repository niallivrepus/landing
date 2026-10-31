/**
 * **Purpose:** Reads what a visitor types into the Batcoin page's Gulp+ bar and turns it into something for the bats
 * to fly. Purely visual: nothing here talks to a wallet or the network, and the reply says so.
 * - "tip 5 to Maya", "send Sam 3", "give 2": a coin flock out of the Tips district, landing with "+N for Name".
 * - "send a flock", "bats": a flock with one coin between two districts.
 * - "wake the city", "swarm", "everyone": the Big sweep (the app's "big moment" swarm).
 * - anything else: read as a friend's name, one coin to them.
 */

export type BatcoinCommand =
  | { kind: "deliver"; coins: number; name: string | null; from: "tips" | "any" }
  | { kind: "sweep" }
  | { kind: "none" };

const STOP = new Set(["tip", "tips", "send", "give", "pay", "to", "a", "an", "the", "batcoin", "bat", "bats", "coin", "coins", "please", "my", "friend"]);

function titleCase(s: string): string {
  return s.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

export function parseBatcoinCommand(raw: string): BatcoinCommand {
  const text = raw.trim().replace(/\s+/g, " ").slice(0, 80);
  if (!text) return { kind: "none" };
  const low = text.toLowerCase();
  if (/\b(swarm|sweep|everyone|everybody|wake|party|all the bats)\b/.test(low)) return { kind: "sweep" };
  const num = low.match(/\b(\d{1,4})\b/);
  const coins = num ? Math.max(1, Math.min(9999, parseInt(num[1]!, 10))) : 1;
  const isTip = /\b(tip|tips|send|give|pay)\b/.test(low);
  if (/\b(flock|bats)\b/.test(low) && !/\bto\b/.test(low)) return { kind: "deliver", coins: num ? coins : 1, name: null, from: "any" };
  // The name: after "to", else whatever is left once the verbs and the number are taken out.
  const after = low.match(/\bto\s+(.+)$/);
  const words = (after ? after[1]! : low)
    .replace(/\d+/g, " ")
    .split(/[^\p{L}'.]+/u)
    .filter((w) => w && !STOP.has(w));
  const name = words.length ? titleCase(words.slice(0, 2).join(" ")).slice(0, 24) : null;
  return { kind: "deliver", coins, name, from: isTip ? "tips" : "any" };
}

/** What the bar says back. Plain, short, and honest that it is a show. */
export function batcoinReply(cmd: BatcoinCommand): string {
  if (cmd.kind === "sweep") return "The whole city is up.";
  if (cmd.kind === "deliver") {
    const n = cmd.coins === 1 ? "1 Batcoin" : `${cmd.coins} Batcoin`;
    return cmd.name ? `${n} flying to ${cmd.name}.` : `A flock is carrying ${n} across town.`;
  }
  return "";
}

/** Coins drawn in the air for an amount (the flock can only carry so many). */
export function coinsToDraw(n: number): number {
  return Math.max(1, Math.min(9, n));
}
