"use client";

import { ArrowRight, ReceiptText } from "lucide-react";
import Link from "next/link";
import { TransactionItem } from "@/components/transactions/transaction-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/finance-context";
import { useLanguage } from "@/context/language-context";
import { transactionsHref, type DashboardData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export function RecentTransactions({ data, month, highlighted = false }: { data: DashboardData; month: string; highlighted?: boolean }) {
  const { format, largeExpenseThreshold } = useFinance();
  const { t } = useLanguage();
  const items = highlighted ? data.large : data.recent;
  const href = transactionsHref({ month, ...(highlighted ? { type: "expense", threshold: largeExpenseThreshold } : {}) });
  const viewAll = <Button asChild variant="ghost" size="sm" className="shrink-0 text-primary"><Link href={href}>{t("dashboard.viewAll")}<ArrowRight className="size-3.5" /></Link></Button>;
  return (
    <Card className={cn("flex min-w-0 flex-col overflow-hidden shadow-none", highlighted && "max-xl:order-first")}>
      <CardHeader className="flex-row items-center justify-between gap-2 p-5 pb-2">
        <CardTitle className="text-base">{t(highlighted ? "dashboard.largeExpenses" : "dashboard.recentTransactions")}</CardTitle>
        {!highlighted && viewAll}
      </CardHeader>
      <CardContent className="flex-1 px-5 pb-3">
        {items.length ? <div className="divide-y">{items.map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} showDate />)}</div> : (
          <div className="flex min-h-56 flex-col items-center justify-center text-center">
            <span className="grid size-11 place-items-center rounded-xl bg-muted text-muted-foreground"><ReceiptText className="size-5" /></span>
            <p className="mt-3 text-sm text-muted-foreground">{highlighted ? t("dashboard.noLargeExpenses", { amount: format(largeExpenseThreshold) }) : t("dashboard.emptyTitle")}</p>
          </div>
        )}
      </CardContent>
      {highlighted && <div className="flex flex-wrap items-center justify-between gap-1 border-t bg-muted/20 px-5 py-2">
        <p className="text-xs text-muted-foreground">{t("dashboard.largeSummary", { count: items.length })}<strong className="ml-2 font-semibold text-foreground">{format(data.largeTotal)}</strong></p>{viewAll}
      </div>}
    </Card>
  );
}
