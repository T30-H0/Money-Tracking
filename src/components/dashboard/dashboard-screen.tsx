"use client";

import { KpiCards } from "@/components/dashboard/kpi-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { useLanguage } from "@/context/language-context";

export function DashboardScreen({ name }: { name: string }) {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">{t("dashboard.welcome", { name: name.split(" ")[0] })}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{t("dashboard.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.description")}</p>
      </header>
      <KpiCards />
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
        <SpendingChart />
        <RecentTransactions />
      </div>
    </div>
  );
}
