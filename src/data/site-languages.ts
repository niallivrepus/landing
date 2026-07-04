/**
 * Site language picker + Google Translate widget (`googtrans=/en/<translateCode>`).
 * `translateCode` must match codes the free translate element accepts (see Google Cloud language list).
 */
export type SiteLanguage = {
  key: string;
  translateCode: string;
  native: string;
  english: string;
  region?: string;
};

export const DEFAULT_SITE_LANGUAGE: SiteLanguage = {
  key: "en-US",
  translateCode: "en",
  native: "English",
  english: "English",
  region: "United States",
};

export const SITE_LANGUAGES: SiteLanguage[] = [
  DEFAULT_SITE_LANGUAGE,
  { key: "en-GB", translateCode: "en", native: "English", english: "English", region: "United Kingdom" },
  { key: "sq", translateCode: "sq", native: "Shqip", english: "Albanian" },
  { key: "ar", translateCode: "ar", native: "العربية", english: "Arabic" },
  { key: "hy", translateCode: "hy", native: "Հայերեն", english: "Armenian" },
  { key: "az", translateCode: "az", native: "Azərbaycan", english: "Azerbaijani" },
  { key: "eu", translateCode: "eu", native: "Euskara", english: "Basque" },
  { key: "be", translateCode: "be", native: "Беларуская", english: "Belarusian" },
  { key: "bn", translateCode: "bn", native: "বাংলা", english: "Bengali" },
  { key: "bs", translateCode: "bs", native: "Bosanski", english: "Bosnian" },
  { key: "bg", translateCode: "bg", native: "Български", english: "Bulgarian" },
  { key: "ca", translateCode: "ca", native: "Català", english: "Catalan" },
  { key: "zh-CN", translateCode: "zh-CN", native: "中文", english: "Chinese (Simplified)", region: "China" },
  { key: "zh-TW", translateCode: "zh-TW", native: "中文", english: "Chinese (Traditional)", region: "Taiwan" },
  { key: "hr", translateCode: "hr", native: "Hrvatski", english: "Croatian" },
  { key: "cs", translateCode: "cs", native: "Čeština", english: "Czech" },
  { key: "da", translateCode: "da", native: "Dansk", english: "Danish" },
  { key: "nl", translateCode: "nl", native: "Nederlands", english: "Dutch" },
  { key: "et", translateCode: "et", native: "Eesti", english: "Estonian" },
  { key: "fil", translateCode: "tl", native: "Filipino", english: "Filipino" },
  { key: "fi", translateCode: "fi", native: "Suomi", english: "Finnish" },
  { key: "fr", translateCode: "fr", native: "Français", english: "French", region: "France" },
  { key: "fr-CA", translateCode: "fr", native: "Français", english: "French", region: "Canada" },
  { key: "gl", translateCode: "gl", native: "Galego", english: "Galician" },
  { key: "ka", translateCode: "ka", native: "ქართული", english: "Georgian" },
  { key: "de", translateCode: "de", native: "Deutsch", english: "German" },
  { key: "el", translateCode: "el", native: "Ελληνικά", english: "Greek" },
  { key: "gu", translateCode: "gu", native: "ગુજરાતી", english: "Gujarati" },
  { key: "he", translateCode: "iw", native: "עברית", english: "Hebrew" },
  { key: "hi", translateCode: "hi", native: "हिन्दी", english: "Hindi" },
  { key: "hu", translateCode: "hu", native: "Magyar", english: "Hungarian" },
  { key: "is", translateCode: "is", native: "Íslenska", english: "Icelandic" },
  { key: "id", translateCode: "id", native: "Bahasa Indonesia", english: "Indonesian" },
  { key: "ga", translateCode: "ga", native: "Gaeilge", english: "Irish" },
  { key: "it", translateCode: "it", native: "Italiano", english: "Italian" },
  { key: "ja", translateCode: "ja", native: "日本語", english: "Japanese" },
  { key: "kn", translateCode: "kn", native: "ಕನ್ನಡ", english: "Kannada" },
  { key: "kk", translateCode: "kk", native: "Қазақ", english: "Kazakh" },
  { key: "ko", translateCode: "ko", native: "한국어", english: "Korean" },
  { key: "lv", translateCode: "lv", native: "Latviešu", english: "Latvian" },
  { key: "lt", translateCode: "lt", native: "Lietuvių", english: "Lithuanian" },
  { key: "mk", translateCode: "mk", native: "Македонски", english: "Macedonian" },
  { key: "ms", translateCode: "ms", native: "Bahasa Melayu", english: "Malay" },
  { key: "ml", translateCode: "ml", native: "മലയാളം", english: "Malayalam" },
  { key: "mr", translateCode: "mr", native: "मराठी", english: "Marathi" },
  { key: "no", translateCode: "no", native: "Norsk", english: "Norwegian" },
  { key: "fa", translateCode: "fa", native: "فارسی", english: "Persian" },
  { key: "pl", translateCode: "pl", native: "Polski", english: "Polish" },
  { key: "pt-BR", translateCode: "pt", native: "Português", english: "Portuguese", region: "Brazil" },
  { key: "pt-PT", translateCode: "pt", native: "Português", english: "Portuguese", region: "Portugal" },
  { key: "pa", translateCode: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi" },
  { key: "ro", translateCode: "ro", native: "Română", english: "Romanian" },
  { key: "ru", translateCode: "ru", native: "Русский", english: "Russian" },
  { key: "sr", translateCode: "sr", native: "Српски", english: "Serbian" },
  { key: "sk", translateCode: "sk", native: "Slovenčina", english: "Slovak" },
  { key: "sl", translateCode: "sl", native: "Slovenščina", english: "Slovenian" },
  { key: "es", translateCode: "es", native: "Español", english: "Spanish" },
  { key: "sw", translateCode: "sw", native: "Kiswahili", english: "Swahili" },
  { key: "sv", translateCode: "sv", native: "Svenska", english: "Swedish" },
  { key: "ta", translateCode: "ta", native: "தமிழ்", english: "Tamil" },
  { key: "te", translateCode: "te", native: "తెలుగు", english: "Telugu" },
  { key: "th", translateCode: "th", native: "ไทย", english: "Thai" },
  { key: "tr", translateCode: "tr", native: "Türkçe", english: "Turkish" },
  { key: "uk", translateCode: "uk", native: "Українська", english: "Ukrainian" },
  { key: "ur", translateCode: "ur", native: "اردو", english: "Urdu" },
  { key: "vi", translateCode: "vi", native: "Tiếng Việt", english: "Vietnamese" },
  { key: "cy", translateCode: "cy", native: "Cymraeg", english: "Welsh" },
];

export function getActiveTranslateCode(): string | null {
  const m = typeof document !== "undefined" ? document.cookie.match(/googtrans=([^;]+)/) : null;
  if (!m?.[1]) return null;
  const raw = decodeURIComponent(m[1]!.trim());
  const parts = raw.split("/").filter(Boolean);
  const target = parts[parts.length - 1];
  if (!target || target === "en") return null;
  return target;
}

export function findSiteLanguageForActive(): SiteLanguage {
  const code = typeof document !== "undefined" ? getActiveTranslateCode() : null;
  if (!code) return DEFAULT_SITE_LANGUAGE;
  const byCookie = SITE_LANGUAGES.find((l) => l.translateCode === code);
  if (byCookie) return byCookie;
  return {
    key: `x-${code}`,
    translateCode: code,
    native: code,
    english: code,
  };
}

export function matchesLanguageQuery(lang: SiteLanguage, raw: string): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return true;
  const parts = [lang.native, lang.english, lang.translateCode, lang.region].filter(Boolean) as string[];
  return parts.some((p) => p.toLowerCase().includes(q));
}
