export const COOKIE_CONSENT_STORAGE_KEY = "jokuh.cookieConsent";
export const COOKIE_PREFS_STORAGE_KEY = "jokuh.cookiePreferences";
export const COOKIE_CONSENT_COOKIE = "jokuh_cookie_consent";
export const COOKIE_CONSENT_UPDATED_EVENT = "jokuh-cookie-consent-updated";

export type CookiePrefs = { analytics: boolean; marketing: boolean };
export type CookieConsentRecord = {
  version: 1;
  prefs: CookiePrefs;
  createdAt: string;
  updatedAt: string;
};

const DEFAULT_PREFS: CookiePrefs = { analytics: true, marketing: true };
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

function canUseBrowserStorage(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function normalizePrefs(value: Partial<CookiePrefs> | null | undefined): CookiePrefs | null {
  if (!value || typeof value.analytics !== "boolean" || typeof value.marketing !== "boolean") return null;
  return { analytics: value.analytics, marketing: value.marketing };
}

function normalizeRecord(value: Partial<CookieConsentRecord> | Partial<CookiePrefs> | null | undefined): CookieConsentRecord | null {
  if (!value) return null;

  if ("prefs" in value) {
    const prefs = normalizePrefs(value.prefs);
    if (!prefs || value.version !== 1 || typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") {
      return null;
    }

    return {
      version: 1,
      prefs,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
    };
  }

  const prefs = normalizePrefs(value as Partial<CookiePrefs>);
  if (!prefs) return null;

  const now = new Date().toISOString();
  return {
    version: 1,
    prefs,
    createdAt: now,
    updatedAt: now,
  };
}

function cookieDomainAttribute(): string {
  const configuredDomain = import.meta.env.VITE_COOKIE_DOMAIN?.trim();
  if (!configuredDomain || !canUseBrowserStorage()) return "";

  const normalized = configuredDomain.startsWith(".") ? configuredDomain.slice(1) : configuredDomain;
  const hostname = window.location.hostname;
  if (hostname !== normalized && !hostname.endsWith(`.${normalized}`)) return "";

  return `Domain=.${normalized}`;
}

function readStoredRecord(): CookieConsentRecord | null {
  try {
    const raw = localStorage.getItem(COOKIE_PREFS_STORAGE_KEY);
    if (!raw) return null;
    return normalizeRecord(JSON.parse(raw) as Partial<CookieConsentRecord> | Partial<CookiePrefs>);
  } catch {
    return null;
  }
}

export function readCookieConsentRecord(): CookieConsentRecord | null {
  if (!canUseBrowserStorage()) return null;

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_CONSENT_COOKIE}=`));

  if (!cookie) return null;

  try {
    const value = decodeURIComponent(cookie.slice(COOKIE_CONSENT_COOKIE.length + 1));
    return normalizeRecord(JSON.parse(value) as Partial<CookieConsentRecord> | Partial<CookiePrefs>);
  } catch {
    return null;
  }
}

export function hasCookieConsentDecision(): boolean {
  if (!canUseBrowserStorage()) return false;

  try {
    return Boolean(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) || readCookieConsentRecord());
  } catch {
    return Boolean(readCookieConsentRecord());
  }
}

export function readCookiePrefsWithDefaults(): CookiePrefs {
  const cookieRecord = readCookieConsentRecord();
  if (cookieRecord) return cookieRecord.prefs;

  const storedRecord = readStoredRecord();
  if (storedRecord) return storedRecord.prefs;

  try {
    const legacy = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (legacy === "accepted") return { analytics: true, marketing: true };
    if (legacy === "declined") return { analytics: false, marketing: false };
  } catch {
    return DEFAULT_PREFS;
  }

  return DEFAULT_PREFS;
}

export function saveCookieConsent(prefs: CookiePrefs): void {
  if (!canUseBrowserStorage()) return;

  const normalized = normalizePrefs(prefs) ?? DEFAULT_PREFS;
  const previous = readCookieConsentRecord() ?? readStoredRecord();
  const now = new Date().toISOString();
  const record: CookieConsentRecord = {
    version: 1,
    prefs: normalized,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
  const encoded = encodeURIComponent(JSON.stringify(record));

  try {
    localStorage.setItem(COOKIE_PREFS_STORAGE_KEY, JSON.stringify(record));
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "custom");
  } catch {
    /* Local storage can be disabled; the cookie is still the source of truth. */
  }

  document.cookie = [
    `${COOKIE_CONSENT_COOKIE}=${encoded}`,
    "Path=/",
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
    cookieDomainAttribute(),
    window.location.protocol === "https:" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  window.dispatchEvent(
    new CustomEvent<CookiePrefs>(COOKIE_CONSENT_UPDATED_EVENT, {
      detail: normalized,
    }),
  );
}

export function hasOptionalCookieConsent(category: keyof CookiePrefs): boolean {
  return readCookiePrefsWithDefaults()[category];
}
