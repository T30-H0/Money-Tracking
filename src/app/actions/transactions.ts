"use server";

import { createClient } from "@/lib/supabase/server";
import { mapTransaction, type TransactionRow } from "@/lib/supabase/finance";
import { transactionSchema, type TransactionInput } from "@/schemas/transaction";
import type { TransactionActionResult } from "@/types/finance";
import { parseDisplayAmount, toBaseVnd } from "@/utils/currency";
import type { MessageKey } from "@/i18n/messages";

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
  if (!auth) return { error: "error.sessionExpired" as const };

  const { data, error } = await auth.supabase
    .from("categories")
    .select("id,type")
    .eq("id", categoryId)
    .eq("type", type)
    .maybeSingle();

  if (error || !data) {
    return { error: "error.invalidCategory" as const };
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
      message: "error.reviewFields",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, import("@/i18n/messages").MessageKey[]>,
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

  if (error) return { ok: false, message: "error.saveTransaction" };
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
      message: "error.reviewFields",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, import("@/i18n/messages").MessageKey[]>,
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

  if (error || !data) return { ok: false, message: "error.updateTransaction" };
  return { ok: true, transaction: mapTransaction(data as TransactionRow) };
}

export async function deleteTransactionAction(
  id: string,
): Promise<{ ok: true } | { ok: false; message: MessageKey }> {
  const auth = await authenticatedClient();
  if (!auth) return { ok: false, message: "error.sessionExpired" };

  const { error } = await auth.supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.userId);

  return error
    ? { ok: false, message: "error.deleteTransaction" }
    : { ok: true };
}
