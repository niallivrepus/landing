/**
 * **Purpose:** Shared marketing-form email check — requires a local part, `@`, and a dotted TLD.
 * Stronger than HTML5 `type="email"` (which accepts `a@b`).
 * **Connects to:** `ContactSalesPage`, `WaitlistSection`, `contact-sales-service.ts`.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/** **Returns** true when `value` looks like a deliverable email address. */
export function isValidMarketingEmail(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 6 || trimmed.length > 240) return false;
  if (trimmed.includes("..") || trimmed.startsWith(".") || trimmed.endsWith(".")) return false;
  return EMAIL_PATTERN.test(trimmed);
}
