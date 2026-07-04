import type { SiteLanguage } from "../data/site-languages";
import { SITE_LANGUAGES, getActiveTranslateCode } from "../data/site-languages";

export const JOKUH_LANG_STORAGE_KEY = "jokuh-site-lang-key";

const GOOGTRANS = "googtrans";

export function clearGoogTransCookies(): void {
  const expires = "Thu, 01 Jan 1970 00:00:01 GMT";
  document.cookie = `${GOOGTRANS}=;path=/;expires=${expires}`;
  const host = location.hostname;
  if (host.startsWith("www.")) {
    document.cookie = `${GOOGTRANS}=;path=/;domain=.${host.slice(4)};expires=${expires}`;
  }
}

/** Apply language and reload. English clears machine translation. */
export function applySiteLanguage(lang: SiteLanguage): void {
  try {
    localStorage.setItem(JOKUH_LANG_STORAGE_KEY, lang.key);
  } catch {
    /* ignore */
  }
  if (lang.translateCode === "en") {
    clearGoogTransCookies();
  } else {
    document.cookie = `${GOOGTRANS}=/en/${lang.translateCode};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
  }
  window.location.reload();
}

export function getStoredLanguageKey(): string | null {
  try {
    return localStorage.getItem(JOKUH_LANG_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Unique translate codes for the Google widget `includedLanguages` option. */
export function includedLanguagesParam(): string {
  const set = new Set<string>();
  for (const l of SITE_LANGUAGES) {
    if (l.translateCode !== "en") set.add(l.translateCode);
  }
  return [...set].sort().join(",");
}

export function syncLangKeyFromCookie(): void {
  if (typeof localStorage === "undefined") return;
  if (getStoredLanguageKey()) return;
  const code = getActiveTranslateCode();
  if (!code) return;
  const lang = SITE_LANGUAGES.find((l) => l.translateCode === code);
  if (!lang) return;
  try {
    localStorage.setItem(JOKUH_LANG_STORAGE_KEY, lang.key);
  } catch {
    /* ignore */
  }
}

let translateScriptRequested = false;

type GTranslateWindow = Window & {
  google?: {
    translate?: {
      TranslateElement?: new (options: Record<string, unknown>, elementId: string) => unknown;
    };
  };
  googleTranslateElementInit?: () => void;
};

/** Load hidden Google Translate element when a non-English translation is active. */
export function initGoogleTranslateIfNeeded(): void {
  if (typeof document === "undefined") return;
  syncLangKeyFromCookie();
  const m = document.cookie.match(/googtrans=([^;]+)/);
  if (!m?.[1]) return;
  const pair = decodeURIComponent(m[1]!.trim());
  if (!pair || pair === "/en/en") return;
  const target = pair.split("/").pop();
  if (!target || target === "en") return;
  if (translateScriptRequested) return;
  translateScriptRequested = true;

  const w = window as GTranslateWindow;
  w.googleTranslateElementInit = () => {
    const T = w.google?.translate?.TranslateElement;
    if (!T) return;
    new T(
      {
        pageLanguage: "en",
        includedLanguages: includedLanguagesParam(),
        autoDisplay: false,
      },
      "google_translate_element",
    );
  };

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.head.appendChild(s);
}
