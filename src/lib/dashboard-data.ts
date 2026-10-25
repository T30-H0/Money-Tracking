import { addMonths, fromLocalDateString, monthKey, toLocalDateString } from "./date";
import { sortTransactions } from "./transactions";
import type { Transaction } from "@/types/finance";

export const DEFAULT_LARGE_EXPENSE_THRESHOLD = 500_000;
export type TrendRange = "week" | "month" | "year";
export interface TransactionFilters {
  month: string;
  category?: string;
  type?: "income" | "expense";
  threshold?: number;
  query?: string;
}

export function validMonth(value: string | null): value is string {
  return !!value && /^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(value);
}

export function parseThreshold(value: string | null) {
  if (!value?.trim()) return undefined;
  const amount = Number(value);
  return Number.isSafeInteger(amount) && amount >= 0 ? amount : undefined;
}

export function filterTransactions(transactions: Transaction[], filters: TransactionFilters) {
  return sortTransactions(transactions.filter((item) =>
    item.date.startsWith(`${filters.month}-`) &&
    (!filters.category || item.categoryId === filters.category) &&
    (!filters.type || item.type === filters.type) &&
    (filters.threshold === undefined || (item.type === "expense" && item.amount > filters.threshold)) &&
    (!filters.query || item.note.toLocaleLowerCase().includes(filters.query.trim().toLocaleLowerCase())),
  ));
}

export function summarize(transactions: Transaction[]) {
  const income = transactions.reduce((sum, item) => sum + (item.type === "income" ? item.amount : 0), 0);
  const expense = transactions.reduce((sum, item) => sum + (item.type === "expense" ? item.amount : 0), 0);
  return { income, expense, net: income - expense };
}

export function buildDashboardData(transactions: Transaction[], month: string, threshold = DEFAULT_LARGE_EXPENSE_THRESHOLD) {
  const monthly = filterTransactions(transactions, { month });
  const expenses = monthly.filter((item) => item.type === "expense");
  const summary = summarize(monthly);
  const byCategory = new Map<string, { categoryId: string; amount: number; count: number }>();
  for (const item of expenses) {
    const group = byCategory.get(item.categoryId) ?? { categoryId: item.categoryId, amount: 0, count: 0 };
    group.amount += item.amount;
    group.count++;
    byCategory.set(item.categoryId, group);
  }
  const groups = [...byCategory.values()].sort((a, b) => b.amount - a.amount || a.categoryId.localeCompare(b.categoryId))
    .map((group) => ({ ...group, share: summary.expense > 0 ? group.amount / summary.expense : 0 }));
  const large = expenses.filter((item) => item.amount > threshold)
    .sort((a, b) => b.amount - a.amount || b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 5);
  const previousMonth = monthKey(addMonths(fromLocalDateString(`${month}-01`), -1));
  return {
    summary, groups, recent: monthly.slice(0, 5), large,
    largeTotal: large.reduce((sum, item) => sum + item.amount, 0),
    expenseCount: expenses.length,
    previous: summarize(filterTransactions(transactions, { month: previousMonth })),
  };
}

export type DashboardData = ReturnType<typeof buildDashboardData>;

export function transactionsHref(filters: TransactionFilters) {
  const params = new URLSearchParams({ month: filters.month });
  if (filters.category) params.set("category", filters.category);
  if (filters.type) params.set("type", filters.type);
  if (filters.threshold !== undefined) params.set("threshold", String(filters.threshold));
  if (filters.query) params.set("q", filters.query);
  return `/transactions?${params}`;
}

export function buildTrendData(transactions: Transaction[], month: string, range: TrendRange, locale: string, now = new Date()) {
  const selected = fromLocalDateString(`${month}-01`);
  const expenses = transactions.filter((item) => item.type === "expense");
  if (range === "year") {
    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(selected.getFullYear(), index, 1);
      const key = monthKey(date);
      return { label: date.toLocaleDateString(locale, { month: "short" }), date: key, spending: expenses.filter((item) => item.date.startsWith(`${key}-`)).reduce((sum, item) => sum + item.amount, 0) };
    });
  }
  const days = new Date(selected.getFullYear(), selected.getMonth() + 1, 0).getDate();
  const end = month === monthKey(now) ? now.getDate() : days;
  // A reporting week stays within the selected month, including its first partial week.
  const start = range === "week" ? Math.max(1, end - 6) : 1;
  const count = range === "week" ? end - start + 1 : days;
  return Array.from({ length: count }, (_, index) => {
    const day = start + index;
    const key = toLocalDateString(new Date(selected.getFullYear(), selected.getMonth(), day));
    return { label: String(day), date: key, spending: expenses.filter((item) => item.date === key).reduce((sum, item) => sum + item.amount, 0) };
  });
}
