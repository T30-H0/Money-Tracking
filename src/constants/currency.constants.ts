import type { CurrencyCode, CurrencyMeta } from "@/types/currency";

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

export const BASE_CURRENCY: CurrencyCode = "USD";

export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 157,
  CAD: 1.36,
  AUD: 1.52,
  INR: 83.3,
  SGD: 1.35,
  VND: 26250,
};

export const CURRENCY_STORAGE_KEY = "money-tracking:currency";

export const SUPPORTED_CURRENCIES: CurrencyMeta[] = [
  { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "EUR", label: "Euro", symbol: "€", locale: "de-DE" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥", locale: "ja-JP" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$", locale: "en-AU" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$", locale: "en-SG" },
  { code: "VND", label: "Vietnamese Dong", symbol: "₫", locale: "vi-VN" },
];

export const CURRENCY_BY_CODE: Record<CurrencyCode, CurrencyMeta> =
  SUPPORTED_CURRENCIES.reduce(
    (acc, meta) => {
      acc[meta.code] = meta;
      return acc;
    },
    {} as Record<CurrencyCode, CurrencyMeta>,
  );

export const REGION_TO_CURRENCY: Record<string, CurrencyCode> = {
  US: "USD",
  GB: "GBP",
  JP: "JPY",
  AU: "AUD",
  SG: "SGD",
  VN: "VND",
  // Eurozone members map to EUR.
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  IE: "EUR",
  PT: "EUR",
  AT: "EUR",
  BE: "EUR",
  FI: "EUR",
};
