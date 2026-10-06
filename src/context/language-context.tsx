"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { setLocaleAction } from "@/app/actions/locale";
import { toIntlLocale, type Locale } from "@/i18n/config";
import {
  translate,
  type MessageKey,
  type TranslationParams,
} from "@/i18n/messages";

interface LanguageContextValue {
  locale: Locale;
  intlLocale: string;
  isChangingLocale: boolean;
  t: (key: MessageKey, params?: TranslationParams) => string;
  setLocale: (locale: Locale) => void;
  formatDate: (value: Date | string, options?: Intl.DateTimeFormatOptions) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState(initialLocale);
  const [isChangingLocale, setIsChangingLocale] = useState(false);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) return;
      setLocaleState(nextLocale);
      document.documentElement.lang = nextLocale;
      setIsChangingLocale(true);
      startTransition(async () => {
        const result = await setLocaleAction(nextLocale);
        if (!result.ok) {
          setLocaleState(locale);
          document.documentElement.lang = locale;
        }
        router.refresh();
        setIsChangingLocale(false);
      });
    },
    [locale, router],
  );

  const t = useCallback(
    (key: MessageKey, params?: TranslationParams) =>
      translate(locale, key, params),
    [locale],
  );

  const formatDate = useCallback(
    (value: Date | string, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(toIntlLocale(locale), options).format(
        typeof value === "string" ? new Date(value) : value,
      ),
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      intlLocale: toIntlLocale(locale),
      isChangingLocale,
      t,
      setLocale,
      formatDate,
    }),
    [formatDate, isChangingLocale, locale, setLocale, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
