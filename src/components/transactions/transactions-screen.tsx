"use client";

import { useMemo, useState } from "react";

import { MonthScroller } from "@/components/transactions/month-scroller";
import { TransactionFeed } from "@/components/transactions/transaction-feed";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentMonthKey, useFinance } from "@/context/finance-context";

export function TransactionsScreen() {
  const { transactions, format, getTransactionsForMonth, getMonthSummary } =
    useFinance();
  const currentMonth = getCurrentMonthKey();
  const months = useMemo(
    () =>
      Array.from(
        new Set([
          currentMonth,
          ...transactions.map((item) => item.date.slice(0, 7)),
        ]),
      )
        .sort()
        .reverse(),
    [currentMonth, transactions],
  );
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const selectedTransactions = getTransactionsForMonth(selectedMonth);
  const summary = getMonthSummary(selectedMonth);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review income and spending month by month.
        </p>
      </header>

      <MonthScroller
        months={months}
        selectedMonth={selectedMonth}
        onSelect={setSelectedMonth}
      />

      <Card>
        <CardContent className="grid grid-cols-3 gap-2 p-3 pt-3 sm:gap-6 sm:p-5 sm:pt-5">
          <SummaryItem
            label="Income"
            value={format(summary.income)}
            tone="income"
          />
          <SummaryItem
            label="Expense"
            value={format(summary.expense)}
            tone="expense"
          />
          <SummaryItem
            label="Net cash flow"
            value={format(summary.net)}
            tone={summary.net >= 0 ? "income" : "expense"}
          />
        </CardContent>
      </Card>

      <TransactionFeed transactions={selectedTransactions} />
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
