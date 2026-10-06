import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { TransactionDetailScreen } from "@/components/transactions/transaction-detail-screen";
import { getTransactionById } from "@/lib/supabase/finance";
import { createClient } from "@/lib/supabase/server";
import { getServerTranslator } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();
  return { title: t("meta.transactionDetails") };
}

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
