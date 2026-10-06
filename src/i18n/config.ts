export const SUPPORTED_LOCALES = ["en", "vi"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "money-tracking:locale";
export const APP_NAME = "Money Tracking";

export const LANGUAGE_OPTIONS: ReadonlyArray<{
  value: Locale;
  label: string;
}> = [
  { value: "en", label: "English" },
  { value: "vi", label: "Tiếng Việt" },
];

export function isSupportedLocale(value: unknown): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function toIntlLocale(locale: Locale) {
  return locale === "vi" ? "vi-VN" : "en-US";
}
