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

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon as CategoryIconName,
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

export async function getFinanceData(supabase: SupabaseClient) {
  const [categoriesResult, transactionsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id,name,icon,color,type")
      .order("type")
      .order("name"),
    supabase
      .from("transactions")
      .select("id,type,amount,category_id,date,note,created_at")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (transactionsResult.error) throw transactionsResult.error;

  return {
    categories: (categoriesResult.data as CategoryRow[]).map(mapCategory),
    transactions: (transactionsResult.data as TransactionRow[]).map(
      mapTransaction,
    ),
  };
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
