/**
 * **Purpose:** Handle normalization + validation for claim-identity — parity with
 * `frontend/src/lib/jokuh-auth-email.ts` and `isValidJokuhUsername` in `jokuh-auth-store.ts`.
 */

const AUTH_EMAIL_DOMAIN = 'jokuh.com';

/** Strips trailing `@jokuh.com` and lowercases. */
export function normalizeUsernameInput(raw: string): string {
  let s = raw.trim().toLowerCase();
  const suffix = `@${AUTH_EMAIL_DOMAIN}`;
  if (s.endsWith(suffix)) {
    s = s.slice(0, -suffix.length);
  }
  return s;
}

/** Live tidy: spaces/underscores → hyphen; preserves `@` for domain suffix entry. */
export function tidyUsernameFieldInput(raw: string): string {
  return raw.toLowerCase().replace(/[\s_]+/g, '-');
}

/** Validates kebab-style username aligned with `public.accounts` check constraint. */
export function isValidJokuhUsername(username: string): boolean {
  const u = normalizeUsernameInput(username);
  if (u.length < 3 || u.length > 32) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(u);
}
