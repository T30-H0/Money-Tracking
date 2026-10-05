export type CurrencyCode =
  | "USD"
  | "EUR"
  | "JPY"
  | "AUD"
  | "SGD"
  | "VND";

export interface CurrencyMeta {
  code: CurrencyCode;
  label: string;
  symbol: string;
  locale: string;
}
