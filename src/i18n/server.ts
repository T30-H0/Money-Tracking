import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "@/i18n/config";
import { translate } from "@/i18n/messages";

function localeFromAcceptLanguage(value: string | null): Locale {
  if (!value) return DEFAULT_LOCALE;
  const preferred = value
    .split(",")
    .map((entry) => entry.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);
  return preferred.some((language) => language === "vi" || language?.startsWith("vi-"))
    ? "vi"
    : DEFAULT_LOCALE;
}

export async function getRequestLocale(): Promise<Locale> {
  const stored = (await cookies()).get(LOCALE_COOKIE_NAME)?.value;
  if (isSupportedLocale(stored)) return stored;
  return localeFromAcceptLanguage((await headers()).get("accept-language"));
}

export async function getServerTranslator() {
  const locale = await getRequestLocale();
  return {
    locale,
    t: translate.bind(null, locale),
  };
}
