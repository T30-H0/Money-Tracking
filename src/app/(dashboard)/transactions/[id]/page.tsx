import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { TransactionDetailScreen } from "@/components/transactions/transaction-detail-screen";
import { getTransactionById } from "@/lib/supabase/finance";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Transaction details" };

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login");

  const transaction = await getTransactionById(supabase, id);
  if (!transaction) notFound();

  return <TransactionDetailScreen initialTransaction={transaction} />;
}
