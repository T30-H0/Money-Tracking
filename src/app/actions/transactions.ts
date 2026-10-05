"use server";

import { createClient } from "@/lib/supabase/server";
import { mapTransaction, type TransactionRow } from "@/lib/supabase/finance";
import { transactionSchema, type TransactionInput } from "@/schemas/transaction";
import type { TransactionActionResult } from "@/types/finance";
import { parseDisplayAmount, toBaseVnd } from "@/utils/currency";

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { supabase, userId: data.user.id };
}

async function validateCategory(
  categoryId: string,
  type: TransactionInput["type"],
) {
  const auth = await authenticatedClient();
  if (!auth) return { error: "Your session has expired. Please sign in again." };

  const { data, error } = await auth.supabase
    .from("categories")
    .select("id,type")
    .eq("id", categoryId)
    .eq("type", type)
    .maybeSingle();

  if (error || !data) {
    return { error: "The selected category is not valid for this transaction type." };
  }

  return auth;
}

export async function createTransactionAction(
  input: TransactionInput,
): Promise<TransactionActionResult> {
  const parsed = transactionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const auth = await validateCategory(parsed.data.categoryId, parsed.data.type);
  if ("error" in auth) return { ok: false, message: auth.error };

  const amount = toBaseVnd(
    parseDisplayAmount(parsed.data.displayAmount),
    parsed.data.currency,
  );

  const { data, error } = await auth.supabase
    .from("transactions")
    .insert({
      user_id: auth.userId,
      type: parsed.data.type,
      amount,
      category_id: parsed.data.categoryId,
      date: parsed.data.date,
      note: parsed.data.note,
    })
    .select("id,type,amount,category_id,date,note,created_at")
    .single();

  if (error) return { ok: false, message: "Could not save the transaction." };
  return { ok: true, transaction: mapTransaction(data as TransactionRow) };
}

export async function updateTransactionAction(
  id: string,
  input: TransactionInput,
): Promise<TransactionActionResult> {
  const parsed = transactionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const auth = await validateCategory(parsed.data.categoryId, parsed.data.type);
  if ("error" in auth) return { ok: false, message: auth.error };

  const amount = toBaseVnd(
    parseDisplayAmount(parsed.data.displayAmount),
    parsed.data.currency,
  );
  const { data, error } = await auth.supabase
    .from("transactions")
    .update({
      type: parsed.data.type,
      amount,
      category_id: parsed.data.categoryId,
      date: parsed.data.date,
      note: parsed.data.note,
    })
    .eq("id", id)
    .eq("user_id", auth.userId)
    .select("id,type,amount,category_id,date,note,created_at")
    .maybeSingle();

  if (error || !data) return { ok: false, message: "Could not update the transaction." };
  return { ok: true, transaction: mapTransaction(data as TransactionRow) };
}

export async function deleteTransactionAction(
  id: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const auth = await authenticatedClient();
  if (!auth) return { ok: false, message: "Your session has expired. Please sign in again." };

  const { error } = await auth.supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.userId);

  return error
    ? { ok: false, message: "Could not delete the transaction." }
    : { ok: true };
}
