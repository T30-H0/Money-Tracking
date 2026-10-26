import {
  BASE_CURRENCY,
  CURRENCY_BY_CODE,
  DEFAULT_CURRENCY,
  EXCHANGE_RATES,
  REGION_TO_CURRENCY,
} from "@/constants/currency.constants";
import type { CurrencyCode } from "@/types/currency";
import type { CurrencyMeta } from "@/types/currency";

export function isSupportedCurrency(value: unknown): value is CurrencyCode {
  return typeof value === "string" && value in CURRENCY_BY_CODE;
}

export function getCurrencyMeta(code: CurrencyCode): CurrencyMeta {
  return CURRENCY_BY_CODE[code] ?? CURRENCY_BY_CODE[DEFAULT_CURRENCY]!;
}

function getRegionFromLocale(locale: string): string | undefined {
  try {
    return new Intl.Locale(locale).maximize().region?.toUpperCase();
  } catch {
    return locale.split(/[-_]/)[1]?.toUpperCase();
  }
}

export function detectCurrencyFromLocale(): CurrencyCode {
  if (typeof navigator === "undefined") return DEFAULT_CURRENCY;
  const locale = navigator.language || navigator.languages?.[0];
  const region = locale ? getRegionFromLocale(locale) : undefined;
  const detected = region ? REGION_TO_CURRENCY[region] : undefined;
  return detected && isSupportedCurrency(detected) ? detected : DEFAULT_CURRENCY;
}

export function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  if (from === to) return amount;
  return (amount / EXCHANGE_RATES[from]) * EXCHANGE_RATES[to];
}

export function toBaseVnd(amount: number, from: CurrencyCode): number {
  return Math.round(convertAmount(amount, from, BASE_CURRENCY));
}

export function formatCurrency(
  amountInVnd: number,
  code: CurrencyCode,
  locale?: string,
  options: Intl.NumberFormatOptions = {},
): string {
  const meta = getCurrencyMeta(code);
  const converted = convertAmount(amountInVnd, BASE_CURRENCY, code);

  return new Intl.NumberFormat(locale ?? meta.locale, {
    style: "currency",
    currency: meta.code,
    maximumFractionDigits: code === "VND" || code === "JPY" ? 0 : 2,
    ...options,
  }).format(converted);
}

export function parseDisplayAmount(value: string): number {
  return Number(value.replace(/,/g, "").trim());
}

/** Short chart label; currency is indicated by the app's currency selector. */
export function formatChartAmount(
  amountInVnd: number,
  code: CurrencyCode,
  locale: string,
): string {
  const amount = convertAmount(amountInVnd, BASE_CURRENCY, code);
  const units = code === "VND"
    ? [{ divisor: 1e9, suffix: "tỷ" }, { divisor: 1e6, suffix: "tr" }, { divisor: 1e3, suffix: "k" }]
    : [{ divisor: 1e12, suffix: "T" }, { divisor: 1e9, suffix: "B" }, { divisor: 1e6, suffix: "M" }, { divisor: 1e3, suffix: "K" }];
  const unit = units.find(({ divisor }) => Math.abs(amount) >= divisor);
  const value = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(amount / (unit?.divisor ?? 1));
  return `${value}${unit?.suffix ?? ""}`;
}

export function formatAmountInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole = "", ...fractionParts] = cleaned.split(".");
  const grouped = whole
    .replace(/^0+(?=\d)/, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fractionParts.length > 0
    ? `${grouped || "0"}.${fractionParts.join("").slice(0, 2)}`
    : grouped;
}

export function toDisplayAmountInput(
  amountInVnd: number,
  code: CurrencyCode,
): string {
  const converted = convertAmount(amountInVnd, BASE_CURRENCY, code);
  const value =
    code === "VND" || code === "JPY"
      ? String(Math.round(converted))
      : converted
          .toFixed(2)
          .replace(/(\.\d*[1-9])0+$/, "$1")
          .replace(/\.0+$/, "");

  return formatAmountInput(value);
}
