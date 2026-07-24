/**
 * **Purpose:** Claim-identity + browser-entry handoff URLs from marketing → signed-in web app.
 *
 * **Landing-only UX:** Username is collected first here (`ClaimIdentityLandingOverlay`).
 * The **app** always starts unauth onboarding at **language → birthday → claim** (handle pre-filled
 * when present) — never username-first. Attribution travels in the query string because
 * `sessionStorage` does not cross `jokuh.com` → `app.jokuh.com`.
 *
 * **Connects to:** `ClaimIdentityLandingOverlay`, `DownloadImmersiveShell`, `resolveWebAppOrigin`.
 * Parity: `frontend/src/utils/claim-identity-handoff.ts`.
 */

import { resolveWebAppOrigin } from '../config/download-links';
import { isValidJokuhUsername, normalizeUsernameInput } from './jokuh-username';

export const CLAIM_HANDLE_QUERY_PARAM = 'claimHandle';
export const HANDOFF_FROM_QUERY_PARAM = 'from';
export const HANDOFF_SOURCE_QUERY_PARAM = 'source';
export const HANDOFF_INTENT_QUERY_PARAM = 'intent';
export const HANDOFF_REF_QUERY_PARAM = 'ref';
export const HANDOFF_OPEN_ONBOARDING_QUERY_PARAM = 'openOnboarding';
/** Homepage proof power (memory, spine, calendar, …) continued into app onboarding. */
export const HANDOFF_POWER_QUERY_PARAM = 'power';

export type ClaimIdentityHandoffSource =
  | 'hero'
  | 'identity-block'
  | 'demo'
  | 'download';

export type ClaimIdentityHandoffOptions = {
  /** Landing surface that started the handoff. */
  source?: ClaimIdentityHandoffSource;
  /** Download / product intent id when relevant. */
  intent?: string;
  /** Optional referral user id (UUID) — app stashes via `stashInboundReferralFromUrl`. */
  ref?: string;
  /** Homepage “See it work” power id so the app can continue that beat. */
  power?: string;
};

/** Appends shared marketing→app attribution params (cross-origin safe). */
function appendHandoffAttribution(
  params: URLSearchParams,
  options: ClaimIdentityHandoffOptions = {},
): void {
  params.set(HANDOFF_FROM_QUERY_PARAM, 'landing');
  if (options.source) {
    params.set(HANDOFF_SOURCE_QUERY_PARAM, options.source);
  }
  if (options.intent?.trim()) {
    params.set(HANDOFF_INTENT_QUERY_PARAM, options.intent.trim());
  }
  if (options.ref?.trim()) {
    params.set(HANDOFF_REF_QUERY_PARAM, options.ref.trim());
  }
  if (options.power?.trim()) {
    params.set(HANDOFF_POWER_QUERY_PARAM, options.power.trim());
  }
}

/**
 * **Purpose:** Builds the app URL that opens real onboarding with a pre-filled handle.
 * App order stays language → birthday → claim (seeded) → Bond — not username-first.
 */
export function buildClaimIdentityAppHandoffUrl(
  handle: string,
  options: ClaimIdentityHandoffOptions = {},
): string {
  const normalized = normalizeUsernameInput(handle);
  if (!isValidJokuhUsername(normalized)) {
    throw new Error('Invalid handle for claim-identity handoff');
  }
  const origin = resolveWebAppOrigin();
  const params = new URLSearchParams({ [CLAIM_HANDLE_QUERY_PARAM]: normalized });
  appendHandoffAttribution(params, { source: options.source ?? 'hero', ...options });
  return `${origin}/?${params.toString()}`;
}

/**
 * **Purpose:** Browser entry without a handle yet (Windows/Linux “Open in browser”, mobile web fallback).
 * App shows its normal language-first unauth onboarding; `openOnboarding=1` marks intentional entry.
 */
export function buildWebAppOnboardingHandoffUrl(
  options: ClaimIdentityHandoffOptions = {},
): string {
  const origin = resolveWebAppOrigin();
  const params = new URLSearchParams();
  params.set(HANDOFF_OPEN_ONBOARDING_QUERY_PARAM, '1');
  appendHandoffAttribution(params, { source: options.source ?? 'download', ...options });
  return `${origin}/?${params.toString()}`;
}
