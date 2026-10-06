import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { createClient } from "@/lib/supabase/server";
import { getServerTranslator } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();
  return { title: t("meta.dashboard") };
}

export default async function DashboardPage() {
  const { t } = await getServerTranslator();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  const name = data.user.user_metadata?.full_name ?? data.user.email ?? t("account.fallbackName");
  return <DashboardScreen name={name} />;
}
