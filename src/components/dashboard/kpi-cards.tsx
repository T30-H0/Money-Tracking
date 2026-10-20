"use client";

import { ArrowDownRight, ArrowUpRight, BadgeDollarSign, Shapes, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/finance-context";
import { addMonths, monthKey } from "@/lib/date";
import { useLanguage } from "@/context/language-context";
import { getSpendingComparison, getTopCategoryInsight } from "@/lib/dashboard-kpis";

interface KpiCardProps {
  icon: typeof Wallet;
  label: string;
  value: string;
  detail: string;
  positive?: boolean;
}

export function KpiCards() {
  const { transactions, categories, format, getMonthSummary, totalSummary } = useFinance();
  const { t } = useLanguage();
  const now = new Date();
  const currentMonth = monthKey(now);
  const previousMonth = monthKey(addMonths(now, -1));
  const current = getMonthSummary(currentMonth);
  const previous = getMonthSummary(previousMonth);
  const spendingComparison = getSpendingComparison(current.expense, previous.expense, t);
  const topCategory = getTopCategoryInsight({
    transactions,
    categories,
    month: currentMonth,
    format,
    t,
  });
  const incomeDetail = t("dashboard.incomeAmount", { amount: format(totalSummary.income) });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <KpiCard
        icon={Wallet}
        label={t("dashboard.monthlySpending")}
        value={format(current.expense)}
        detail={spendingComparison.detail}
        positive={spendingComparison.positive}
      />
      <KpiCard
        icon={Shapes}
        label={t("dashboard.topCategory")}
        value={topCategory.value}
        detail={topCategory.detail}
      />
      <KpiCard
        icon={BadgeDollarSign}
        label={t("dashboard.netCashFlow")}
        value={format(totalSummary.net)}
        detail={incomeDetail}
        positive={totalSummary.net >= 0}
      />
    </div>
  );
}

function KpiTrendIcon({ positive }: Pick<KpiCardProps, "positive">) {
  if (positive === undefined) return null;
  if (positive) return <ArrowUpRight className="size-3.5 text-emerald-600" />;

  return <ArrowDownRight className="size-3.5 text-rose-600" />;
}

function KpiCard({ icon: Icon, label, value, detail, positive }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 truncate text-2xl font-bold tracking-tight tabular-nums">{value}</p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
        </div>
        <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <KpiTrendIcon positive={positive} />
          {detail}
        </p>
      </CardContent>
    </Card>
  );
}
