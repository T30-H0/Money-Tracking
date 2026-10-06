import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SettingsScreen } from "@/components/settings/settings-screen";
import { getServerTranslator } from "@/i18n/server";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();
  return { title: t("meta.settings") };
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login");

  return (
    <SettingsScreen
      name={data.user.user_metadata?.full_name as string | undefined}
      email={data.user.email}
      avatarUrl={data.user.user_metadata?.avatar_url as string | undefined}
    />
  );
}
