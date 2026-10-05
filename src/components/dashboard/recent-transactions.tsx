"use client";

import { ArrowRight, ReceiptText } from "lucide-react";
import Link from "next/link";

import { TransactionItem } from "@/components/transactions/transaction-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/finance-context";

export function RecentTransactions() {
  const { transactions } = useFinance();
  const recent = transactions.slice(0, 10);
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between p-5 pb-2">
        <CardTitle className="text-lg">Recent transactions</CardTitle>
        <Button asChild variant="ghost" size="sm"><Link href="/transactions">View all<ArrowRight className="size-4" /></Link></Button>
      </CardHeader>
      <CardContent className="px-5 pb-3">
        {recent.length ? <div className="divide-y">{recent.map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} />)}</div> : (
          <div className="flex min-h-56 flex-col items-center justify-center text-center">
            <span className="grid size-11 place-items-center rounded-xl bg-muted text-muted-foreground"><ReceiptText className="size-5" /></span>
            <p className="mt-3 text-sm font-semibold">Nothing here yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Press N to add your first transaction.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
