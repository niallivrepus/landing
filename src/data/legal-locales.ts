export type LegalLocale = { code: string; label: string; nativeLabel: string };

/** Region + language codes for privacy document URLs (`/legal/privacy/customer/read/:code`). */
export const LEGAL_PRIVACY_LOCALES: LegalLocale[] = [
  { code: "en-ww", label: "English", nativeLabel: "English" },
  { code: "de-de", label: "German", nativeLabel: "Deutsch" },
  { code: "es-es", label: "Spanish", nativeLabel: "Español" },
  { code: "fr-fr", label: "French", nativeLabel: "Français" },
  { code: "it-it", label: "Italian", nativeLabel: "Italiano" },
  { code: "ja-jp", label: "Japanese", nativeLabel: "日本語" },
  { code: "ko-kr", label: "Korean", nativeLabel: "한국어" },
  { code: "pt-br", label: "Portuguese (Brazil)", nativeLabel: "Português (Brasil)" },
  { code: "zh-cn", label: "Chinese (Simplified)", nativeLabel: "简体中文" },
  { code: "zh-tw", label: "Chinese (Traditional)", nativeLabel: "繁體中文" },
  { code: "ar-sa", label: "Arabic", nativeLabel: "العربية" },
  { code: "nl-nl", label: "Dutch", nativeLabel: "Nederlands" },
];

export function localeFromCode(code: string): LegalLocale | undefined {
  return LEGAL_PRIVACY_LOCALES.find((l) => l.code === code);
}
