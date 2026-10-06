import type { CurrencyCode } from "@/types/currency";
import type { MessageKey } from "@/i18n/messages";

export type TransactionType = "income" | "expense";

export type CategoryIconName =
  | "utensils"
  | "receipt-text"
  | "car"
  | "shopping-bag"
  | "heart-pulse"
  | "party-popper"
  | "circle-ellipsis"
  | "wallet-cards"
  | "briefcase-business"
  | "badge-dollar-sign";

export type CategoryColor =
  | "amber"
  | "blue"
  | "cyan"
  | "violet"
  | "rose"
  | "pink"
  | "slate"
  | "emerald"
  | "indigo"
  | "teal";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  note: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: CategoryIconName;
  color: CategoryColor;
  type: TransactionType;
}

export interface TransactionMutationInput {
  type: TransactionType;
  displayAmount: string;
  currency: CurrencyCode;
  categoryId: string;
  date: string;
  note: string;
}

export type TransactionActionResult =
  | { ok: true; transaction: Transaction }
  | {
      ok: false;
      message: MessageKey;
      fieldErrors?: Record<string, MessageKey[]>;
    };

export interface MonthSummary {
  income: number;
  expense: number;
  net: number;
}
