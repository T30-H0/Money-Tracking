import type { Transaction } from "@/types/finance";

export function sortTransactions(transactions: Transaction[]) {
  return [...transactions].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || b.id.localeCompare(a.id),
  );
}

export function groupTransactionsByDate(transactions: Transaction[]) {
  const groups = new Map<string, Transaction[]>();
  for (const transaction of sortTransactions(transactions)) {
    const date = transaction.date;
    const items = groups.get(date) ?? [];
    items.push(transaction);
    groups.set(date, items);
  }
  return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a));
}
