"use client";

import { ArrowDownRight, ArrowUpRight, BadgeDollarSign, Shapes, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/finance-context";
import { addMonths, monthKey } from "@/lib/date";
import { useLanguage } from "@/context/language-context";
import { getCategoryName } from "@/i18n/categories";

export function KpiCards() {
  const { transactions, categories, format, getMonthSummary } = useFinance();
  const { t } = useLanguage();
  const now = new Date();
  const currentMonth = monthKey(now);
  const previousMonth = monthKey(addMonths(now, -1));
  const current = getMonthSummary(currentMonth);
  const previous = getMonthSummary(previousMonth);
  const difference = previous.expense > 0 ? ((current.expense - previous.expense) / previous.expense) * 100 : null;
  const spendingByCategory = transactions
    .filter((item) => item.type === "expense" && item.date.startsWith(currentMonth))
    .reduce<Record<string, number>>((totals, item) => ({ ...totals, [item.categoryId]: (totals[item.categoryId] ?? 0) + item.amount }), {});
  const topEntry = Object.entries(spendingByCategory).sort(([, a], [, b]) => b - a)[0];
  const topCategory = topEntry ? categories.find((item) => item.id === topEntry[0]) : undefined;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <KpiCard icon={Wallet} label={t("dashboard.monthlySpending")} value={format(current.expense)} detail={difference === null ? t("dashboard.noPreviousSpending") : t(difference <= 0 ? "dashboard.lessThanLastMonth" : "dashboard.moreThanLastMonth", { percent: Math.abs(difference).toFixed(1) })} positive={difference !== null && difference <= 0} />
      <KpiCard icon={Shapes} label={t("dashboard.topCategory")} value={topCategory ? getCategoryName(topCategory, t) : t("dashboard.noSpending")} detail={topEntry ? format(topEntry[1]) : t("dashboard.addExpenseInsight")} />
      <KpiCard icon={BadgeDollarSign} label={t("dashboard.netCashFlow")} value={format(current.net)} detail={t("dashboard.incomeAmount", { amount: format(current.income) })} positive={current.net >= 0} />
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, detail, positive }: { icon: typeof Wallet; label: string; value: string; detail: string; positive?: boolean }) {
  const TrendIcon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <Card>
      <CardContent className="p-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 truncate text-2xl font-bold tracking-tight tabular-nums">{value}</p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
        </div>
        <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">{positive !== undefined ? <TrendIcon className={positive ? "size-3.5 text-emerald-600" : "size-3.5 text-rose-600"} /> : null}{detail}</p>
      </CardContent>
    </Card>
  );
}
