import type { Metadata } from "next";

import { TransactionsScreen } from "@/components/transactions/transactions-screen";
import { getServerTranslator } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();
  return { title: t("meta.transactions") };
}

export default function TransactionsPage() {
  return <TransactionsScreen />;
}
