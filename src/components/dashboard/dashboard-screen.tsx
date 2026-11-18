"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useFinanceData } from "@/hooks/use-finance-data";
import { dashboardResources } from "@/lib/finance-resources";
import { DataLoadError } from "@/components/loading/data-load-error";
import { Skeleton } from "@/components/ui/skeleton";

import { KpiCards } from "@/components/dashboard/kpi-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { ReportMonthPicker } from "@/components/dashboard/report-month-picker";
import { DashboardLoadingSkeleton } from "@/components/loading/page-skeletons";
import { useFinance } from "@/context/finance-context";
import { useLanguage } from "@/context/language-context";
import { useReportingMonth, updateReportParams } from "@/hooks/use-reporting-month";
import { buildDashboardData } from "@/lib/dashboard-data";

const SpendingChart = dynamic(() => import("@/components/dashboard/spending-chart").then((module) => module.SpendingChart), {
  loading: () => <Skeleton className="h-96 w-full rounded-xl" />,
});
const CategoryChart = dynamic(() => import("@/components/dashboard/category-chart").then((module) => module.CategoryChart), {
  loading: () => <Skeleton className="h-96 w-full rounded-xl" />,
});

export function DashboardScreen() {
  const { t } = useLanguage();
  const { transactions, largeExpenseThreshold } = useFinance();
  const month = useReportingMonth();
  const loading = useFinanceData(dashboardResources(month));
  const data = useMemo(() => month ? buildDashboardData(transactions, month, largeExpenseThreshold) : null, [transactions, month, largeExpenseThreshold]);
  if (loading.error) return <DataLoadError retry={loading.retry} />;
  if (!month || !loading.ready || !data) return <DashboardLoadingSkeleton />;
  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("dashboard.title")}</h1>
        <ReportMonthPicker month={month} onChange={(value) => updateReportParams({ month: value })} />
      </header>
      <KpiCards data={data} />
      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="min-w-0 max-xl:order-2"><SpendingChart month={month} /></div>
        <CategoryChart data={data} month={month} />
      </div>
      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <RecentTransactions data={data} month={month} />
        <RecentTransactions data={data} month={month} highlighted />
      </div>
    </div>
  );
}
