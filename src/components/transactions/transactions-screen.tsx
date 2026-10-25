"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TransactionsLoadingSkeleton } from "@/components/loading/page-skeletons";
import { ReportMonthPicker } from "@/components/dashboard/report-month-picker";
import { TransactionFilterControls } from "@/components/transactions/transaction-filters";
import { useReportingMonth, updateReportParams } from "@/hooks/use-reporting-month";
import { filterTransactions, parseThreshold, summarize, type TransactionFilters } from "@/lib/dashboard-data";

import { TransactionFeed } from "@/components/transactions/transaction-feed";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/finance-context";
import { useLanguage } from "@/context/language-context";

export function TransactionsScreen() {
  const { transactions, format } = useFinance();
  const { t } = useLanguage();
  const params = useSearchParams();
  const selectedMonth = useReportingMonth();
  if (!selectedMonth) return <TransactionsLoadingSkeleton />;
  const requestedType = params.get("type");
  const threshold = parseThreshold(params.get("threshold"));
  const filters: TransactionFilters = {
    month: selectedMonth,
    category: params.get("category") || undefined,
    type: threshold !== undefined ? "expense" : requestedType === "income" || requestedType === "expense" ? requestedType : undefined,
    threshold,
    query: params.get("q") || undefined,
  };
  const selectedTransactions = filterTransactions(transactions, filters);
  const summary = summarize(selectedTransactions);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {t("transactions.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("transactions.description")}
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" className="text-primary"><Link href={`/?month=${selectedMonth}`}>← {t("filters.back")}</Link></Button>
        <ReportMonthPicker month={selectedMonth} onChange={(month) => updateReportParams({ month })} />
      </div>
      <TransactionFilterControls filters={filters} />

      <Card>
        <CardContent className="grid grid-cols-3 gap-2 p-3 pt-3 sm:gap-6 sm:p-5 sm:pt-5">
          <SummaryItem
            label={t("transactions.income")}
            value={format(summary.income)}
            tone="income"
          />
          <SummaryItem
            label={t("transactions.expense")}
            value={format(summary.expense)}
            tone="expense"
          />
          <SummaryItem
            label={t("transactions.netCashFlow")}
            value={format(summary.net)}
            tone={summary.net >= 0 ? "income" : "expense"}
          />
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground" role="status">{t("dashboard.count", { count: selectedTransactions.length })}</p>
      {selectedTransactions.length ? <TransactionFeed transactions={selectedTransactions} /> : <Card><CardContent className="py-16 text-center text-sm text-muted-foreground">{t("filters.empty")}</CardContent></Card>}
    </div>
  );
}

function SummaryItem({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "income" | "expense";
}) {
  return (
    <div className="min-w-0 text-center sm:text-left">
      <p className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
        {label}
      </p>
      <p
        className={
          tone === "income"
            ? "mt-1 truncate text-sm font-bold tabular-nums text-emerald-600 sm:text-lg"
            : "mt-1 truncate text-sm font-bold tabular-nums text-rose-600 sm:text-lg"
        }
      >
        {value}
      </p>
    </div>
  );
}
