"use client";

import { KpiCards } from "@/components/dashboard/kpi-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { ReportMonthPicker } from "@/components/dashboard/report-month-picker";
import { DashboardLoadingSkeleton } from "@/components/loading/page-skeletons";
import { useFinance } from "@/context/finance-context";
import { useLanguage } from "@/context/language-context";
import { useReportingMonth, updateReportParams } from "@/hooks/use-reporting-month";
import { buildDashboardData } from "@/lib/dashboard-data";

export function DashboardScreen() {
  const { t } = useLanguage();
  const { transactions, largeExpenseThreshold } = useFinance();
  const month = useReportingMonth();
  if (!month) return <DashboardLoadingSkeleton />;
  const data = buildDashboardData(transactions, month, largeExpenseThreshold);
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
