import {
  CURRENCY_BY_CODE,
  DEFAULT_CURRENCY,
  EXCHANGE_RATES,
  REGION_TO_CURRENCY,
} from "@/constants/currency.constants";
import type { CurrencyCode, CurrencyMeta } from "@/types/currency";

export function isSupportedCurrency(value: unknown): value is CurrencyCode {
  return typeof value === "string" && value in CURRENCY_BY_CODE;
}

export function getCurrencyMeta(code: CurrencyCode): CurrencyMeta {
  return CURRENCY_BY_CODE[code] ?? CURRENCY_BY_CODE[DEFAULT_CURRENCY];
}

function getRegionFromLocale(locale: string): string | undefined {
  try {
    const resolved = new Intl.Locale(locale);
    const region = resolved.region ?? resolved.maximize?.().region ?? undefined;
    return region?.toUpperCase();
  } catch {
    const parts = locale.split(/[-_]/);
    return parts[1]?.toUpperCase();
  }
}

export function detectCurrencyFromLocale(): CurrencyCode {
  if (typeof navigator === "undefined") {
    return DEFAULT_CURRENCY;
  }

  const locale = navigator.language || navigator.languages?.[0];
  if (!locale) {
    return DEFAULT_CURRENCY;
  }

  const region = getRegionFromLocale(locale);
  if (region && region in REGION_TO_CURRENCY) {
    return REGION_TO_CURRENCY[region];
  }

  return DEFAULT_CURRENCY;
}

export function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  if (from === to) {
    return amount;
  }
  const amountInUsd = amount / EXCHANGE_RATES[from];
  return amountInUsd * EXCHANGE_RATES[to];
}

export function formatCurrency(
  amount: number,
  code: CurrencyCode,
  options: Intl.NumberFormatOptions = {},
): string {
  const meta = getCurrencyMeta(code);

  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: meta.code,
      ...options,
    }).format(amount);
  } catch {
    return `${meta.symbol}${amount.toFixed(2)}`;
  }
}
