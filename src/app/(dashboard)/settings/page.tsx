import type { Metadata } from "next";
import { SettingsScreen } from "@/components/settings/settings-screen";
import { getServerTranslator } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();
  return { title: t("meta.settings") };
}

export default function SettingsPage() {
  return <SettingsScreen />;
}
