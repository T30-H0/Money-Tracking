"use client";

import { ReceiptText } from "lucide-react";

import { TransactionItem } from "@/components/transactions/transaction-item";
import { useFinance } from "@/context/finance-context";
import { fromLocalDateString, toLocalDateString } from "@/lib/date";
import type { Transaction } from "@/types/finance";
import { useLanguage } from "@/context/language-context";

function dateLabel(date: string, locale: string, todayLabel: string, yesterdayLabel: string) {
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  if (date === toLocalDateString(today)) return todayLabel;
  if (date === toLocalDateString(yesterday)) return yesterdayLabel;
  return fromLocalDateString(date).toLocaleDateString(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function TransactionFeed({ transactions }: { transactions: Transaction[] }) {
  const { format } = useFinance();
  const { intlLocale, t } = useLanguage();
  const groups = Object.entries(
    transactions.reduce<Record<string, Transaction[]>>((result, transaction) => {
      (result[transaction.date] ??= []).push(transaction);
      return result;
    }, {}),
  ).sort(([a], [b]) => b.localeCompare(a));

  if (!groups.length) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><ReceiptText className="size-6" /></span>
        <h2 className="mt-4 font-semibold">{t("transactions.emptyMonth")}</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("transactions.emptyMonthDescription")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map(([date, items]) => {
        const dailySpend = items.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
        return (
          <section key={date} className="rounded-2xl border bg-card px-4 shadow-sm sm:px-5">
            <header className="flex items-center justify-between border-b py-3">
              <div>
                <h2 className="text-sm font-semibold">{dateLabel(date, intlLocale, t("transactions.today"), t("transactions.yesterday"))}</h2>
                <p className="text-xs text-muted-foreground">{date}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{t("transactions.spent")}</p>
                <p className="text-sm font-semibold tabular-nums">{format(dailySpend)}</p>
              </div>
            </header>
            <div className="divide-y">
              {items.map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
