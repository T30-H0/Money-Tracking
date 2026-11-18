import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Category,
  CategoryColor,
  CategoryIconName,
  Transaction,
  TransactionType,
} from "@/types/finance";

interface CategoryRow {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
}

export interface TransactionRow {
  id: string;
  type: string;
  amount: number;
  category_id: string;
  date: string;
  note: string | null;
  created_at: string;
}

// Keep database icon names readable by older deployed clients during rollout.
const CATEGORY_ICON_OVERRIDES: Record<string, CategoryIconName> = {
  "00000000-0000-4000-8000-000000000016": "gift",
  "00000000-0000-4000-8000-000000000011": "users",
  "00000000-0000-4000-8000-000000000012": "paw-print",
  "00000000-0000-4000-8000-000000000013": "house",
  "00000000-0000-4000-8000-000000000014": "landmark",
  "00000000-0000-4000-8000-000000000015": "shield-check",
};

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    icon: CATEGORY_ICON_OVERRIDES[row.id] ?? row.icon as CategoryIconName,
    color: row.color as CategoryColor,
    type: row.type as TransactionType,
  };
}

export function mapTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type as TransactionType,
    amount: Number(row.amount),
    categoryId: row.category_id,
    date: row.date,
    note: row.note ?? "",
    createdAt: row.created_at,
  };
}

export async function getCategories(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("categories")
    .select("id,name,icon,color,type").order("type").order("name");
  if (error) throw error;
  return (data as CategoryRow[]).map(mapCategory);
}

export async function getTransactionsInRange(supabase: SupabaseClient, userId: string, start: string, end: string) {
  const transactions: Transaction[] = [];
  // Page through the requested period; never silently truncate a report at the API row limit.
  let offset = 0;
  while (true) {
    // Each page depends on the actual number of rows returned by the previous page.
    // oxlint-disable-next-line no-await-in-loop
    const { data, error } = await supabase.from("transactions")
      .select("id,type,amount,category_id,date,note,created_at")
      .eq("user_id", userId).gte("date", start).lt("date", end)
      .order("created_at", { ascending: false }).order("id", { ascending: false })
      .range(offset, offset + 499);
    if (error) throw error;
    if (!data.length) break;
    transactions.push(...(data as TransactionRow[]).map(mapTransaction));
    offset += data.length;
  }
  return transactions;
}

export async function getTransactionById(
  supabase: SupabaseClient,
  id: string,
): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from("transactions")
    .select("id,type,amount,category_id,date,note,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapTransaction(data as TransactionRow) : null;
}

export async function searchTransactions(supabase: SupabaseClient, userId: string, query: string, categoryIds: string[]) {
  const select = () => supabase.from("transactions")
    .select("id,type,amount,category_id,date,note,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false }).order("id", { ascending: false }).limit(8);
  // Escape LIKE metacharacters: search input is literal text, not a wildcard expression.
  const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;
  const results = await Promise.all([
    select().ilike("note", pattern),
    ...(categoryIds.length ? [select().in("category_id", categoryIds)] : []),
  ]);
  const unique = new Map<string, Transaction>();
  for (const result of results) {
    if (result.error) throw result.error;
    for (const row of result.data as TransactionRow[]) unique.set(row.id, mapTransaction(row));
  }
  return [...unique.values()].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || b.id.localeCompare(a.id)).slice(0, 8);
}
