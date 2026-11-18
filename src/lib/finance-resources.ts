import { addMonths, fromLocalDateString, monthKey } from "./date";
import { buildTrendData, validMonth, type TrendRange } from "./dashboard-data";
import type { Transaction } from "@/types/finance";

export type FinanceResource = "categories" | `month:${string}` | `year:${string}`;

export function resourceDateRange(resource: string) {
  if (resource.startsWith("month:") && validMonth(resource.slice(6))) {
    const month = resource.slice(6);
    return { start: `${month}-01`, end: `${monthKey(addMonths(fromLocalDateString(`${month}-01`), 1))}-01` };
  }
  if (/^year:[1-9]\d{3}$/.test(resource)) {
    const year = Number(resource.slice(5));
    return { start: `${year}-01-01`, end: `${year + 1}-01-01` };
  }
  return null;
}

export function dashboardResources(month: string): FinanceResource[] {
  if (!validMonth(month)) return [];
  const previous = monthKey(addMonths(fromLocalDateString(`${month}-01`), -1));
  return ["categories", `month:${month}`, `month:${previous}`];
}

export function trendResources(month: string, range: TrendRange, now = new Date()): FinanceResource[] {
  if (range === "year") return [`year:${month.slice(0, 4)}`];
  if (range === "month") return [`month:${month}`];
  return [...new Set(buildTrendData([], month, "week", "en-US", now).map((day) => `month:${day.date.slice(0, 7)}` as const))];
}

// A response started before a local edit/delete must not undo that mutation.
export function mergeLoadedTransactions(current: Transaction[], incoming: Transaction[], protectedIds: ReadonlySet<string>) {
  const merged = new Map(current.map((item) => [item.id, item]));
  for (const item of incoming) {
    if (!protectedIds.has(item.id)) merged.set(item.id, item);
  }
  return [...merged.values()];
}
