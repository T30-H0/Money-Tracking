import type { Transaction } from "@/types/finance";
import { toLocalDateString } from "./date";

export function sortTransactions(transactions: Transaction[]) {
  return [...transactions].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || b.id.localeCompare(a.id),
  );
}

export function groupTransactionsByCreatedDate(transactions: Transaction[]) {
  const groups = new Map<string, Transaction[]>();
  for (const transaction of sortTransactions(transactions)) {
    const date = toLocalDateString(new Date(transaction.createdAt));
    const items = groups.get(date) ?? [];
    items.push(transaction);
    groups.set(date, items);
  }
  return [...groups.entries()];
}
