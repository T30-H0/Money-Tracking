"use client";

import { ArrowDownRight, ArrowUpRight, BadgeDollarSign, Shapes, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/finance-context";
import { useLanguage } from "@/context/language-context";
import { getCategoryName } from "@/i18n/categories";
import { getSpendingComparison } from "@/lib/dashboard-kpis";
import type { DashboardData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  icon: typeof Wallet;
  label: string;
  value: string;
  detail?: string;
  positive?: boolean;
  featured?: boolean;
}

export function KpiCards({ data }: { data: DashboardData }) {
  const { categories, format } = useFinance();
  const { t, intlLocale } = useLanguage();
  const comparison = getSpendingComparison(data.summary.expense, data.previous.expense, t);
  const top = data.groups[0];
  const category = categories.find((item) => item.id === top?.categoryId);
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
      <KpiCard featured icon={Wallet} label={t("dashboard.monthlySpending")} value={format(data.summary.expense)}
        detail={data.previous.expense > 0 ? comparison.detail : undefined} positive={comparison.positive} />
      <KpiCard icon={Shapes} label={t("dashboard.topCategory")}
        value={top ? (category ? getCategoryName(category, t) : t("dashboard.unknownCategory")) : t("dashboard.noSpending")}
        detail={top ? `${format(top.amount)} · ${t("dashboard.share", { percent: Intl.NumberFormat(intlLocale, { style: "percent", maximumFractionDigits: 1 }).format(top.share) })}` : undefined} />
      <KpiCard icon={BadgeDollarSign} label={t("dashboard.netCashFlow")} value={format(data.summary.net)}
        detail={t("dashboard.incomeAmount", { amount: format(data.summary.income) })} />
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, detail, positive, featured }: KpiCardProps) {
  return (
    <Card className={cn("min-w-0 shadow-none", featured && "relative col-span-2 overflow-hidden border-emerald-700 bg-emerald-700 text-white after:pointer-events-none after:absolute after:-right-10 after:-top-12 after:size-44 after:rounded-full after:border-[24px] after:border-white/5 lg:col-span-1")}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn("text-xs sm:text-sm", featured ? "text-emerald-100" : "text-muted-foreground")}>{label}</p>
            <p className="mt-3 break-words text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">{value}</p>
          </div>
          <span className={cn("hidden size-9 shrink-0 place-items-center rounded-xl sm:grid", featured ? "bg-white/10 text-emerald-100" : "bg-primary/5 text-primary")}><Icon className="size-4" /></span>
        </div>
        {detail ? <p className={cn("mt-4 flex items-start gap-1 text-xs", featured ? "text-emerald-100" : "text-muted-foreground")}>
          {featured && (positive ? <ArrowDownRight className="size-3.5 shrink-0" /> : <ArrowUpRight className="size-3.5 shrink-0" />)}{detail}
        </p> : null}
      </CardContent>
    </Card>
  );
}
