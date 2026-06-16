"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  BASE_CURRENCY,
  CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
} from "@/constants/currency.constants";
import type { CurrencyCode } from "@/types/currency";
import {
  convertAmount,
  detectCurrencyFromLocale,
  formatCurrency,
  getCurrencyMeta,
  isSupportedCurrency,
} from "@/utils/currency";

interface UseCurrencyResult {
  currency: CurrencyCode;
  currencies: typeof SUPPORTED_CURRENCIES;
  setCurrency: (code: CurrencyCode) => void;
  format: (amount: number, options?: Intl.NumberFormatOptions) => string;
  convert: (amount: number) => number;
}

export function useCurrency(): UseCurrencyResult {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (isSupportedCurrency(stored)) {
      setCurrencyState(stored);
      return;
    }
    setCurrencyState(detectCurrencyFromLocale());
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch {}
  }, []);

  const convert = useCallback(
    (amount: number) => convertAmount(amount, BASE_CURRENCY, currency),
    [currency],
  );

  const format = useCallback(
    (amount: number, options?: Intl.NumberFormatOptions) =>
      formatCurrency(
        convertAmount(amount, BASE_CURRENCY, currency),
        currency,
        options,
      ),
    [currency],
  );

  return useMemo(
    () => ({
      currency,
      currencies: SUPPORTED_CURRENCIES,
      setCurrency,
      format,
      convert,
    }),
    [currency, setCurrency, format, convert],
  );
}

export { getCurrencyMeta };
