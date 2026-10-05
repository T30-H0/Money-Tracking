import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  const name = data.user.user_metadata?.full_name ?? data.user.email ?? "there";
  return <DashboardScreen name={name} />;
}
