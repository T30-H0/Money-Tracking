"use server";

import { cookies } from "next/headers";

import {
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "@/i18n/config";

export async function setLocaleAction(locale: Locale) {
  if (!isSupportedLocale(locale)) return { ok: false as const };
  (await cookies()).set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return { ok: true as const };
}
