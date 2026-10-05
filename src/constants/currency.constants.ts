import type { CurrencyCode, CurrencyMeta } from "@/types/currency";

export const DEFAULT_CURRENCY: CurrencyCode = "VND";
export const BASE_CURRENCY: CurrencyCode = "VND";

// Number of currency units per one USD. These fixed rates are intentionally
// presentation-only and are not intended to model historical FX values.
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  JPY: 157,
  AUD: 1.52,
  SGD: 1.35,
  VND: 26250,
};

export const CURRENCY_STORAGE_KEY = "money-tracking:currency";

export const SUPPORTED_CURRENCIES: CurrencyMeta[] = [
  { code: "VND", label: "Vietnamese Dong", symbol: "₫", locale: "vi-VN" },
  { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "EUR", label: "Euro", symbol: "€", locale: "de-DE" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥", locale: "ja-JP" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$", locale: "en-AU" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$", locale: "en-SG" },
];

export const CURRENCY_BY_CODE = Object.fromEntries(
  SUPPORTED_CURRENCIES.map((currency) => [currency.code, currency]),
) as Partial<Record<CurrencyCode, CurrencyMeta>>;

export const REGION_TO_CURRENCY: Partial<Record<string, CurrencyCode>> = {
  US: "USD",
  JP: "JPY",
  AU: "AUD",
  SG: "SGD",
  VN: "VND",
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
