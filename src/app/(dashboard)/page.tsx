import { Suspense } from "react";
import { DashboardLoadingSkeleton } from "@/components/loading/page-skeletons";
import type { Metadata } from "next";
import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { getServerTranslator } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();
  return { title: t("meta.dashboard") };
}

export default function DashboardPage() {
  return <Suspense fallback={<DashboardLoadingSkeleton />}><DashboardScreen /></Suspense>;
}
