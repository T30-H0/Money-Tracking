"use client";

import { LoaderCircle, ReceiptText, Trash2 } from "lucide-react";
import { useState, type MouseEvent } from "react";

import { TransactionItem } from "@/components/transactions/transaction-item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFinance } from "@/context/finance-context";
import type { MessageKey } from "@/i18n/messages";
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
  const { deleteTransaction, format } = useFinance();
  const { intlLocale, t } = useLanguage();
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<MessageKey | null>(null);
  const groups = Object.entries(
    transactions.reduce<Record<string, Transaction[]>>((result, transaction) => {
      (result[transaction.date] ??= []).push(transaction);
      return result;
    }, {}),
  ).sort(([a], [b]) => b.localeCompare(a));

  const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!transactionToDelete || deleting) return;

    setDeleting(true);
    setDeleteError(null);
    const result = await deleteTransaction(transactionToDelete.id);

    if (!result.ok) {
      setDeleteError(result.message ?? "error.deleteTransaction");
      setDeleting(false);
      return;
    }

    setDeleting(false);
    setTransactionToDelete(null);
  };

  const feed = !groups.length ? (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><ReceiptText className="size-6" /></span>
        <h2 className="mt-4 font-semibold">{t("transactions.emptyMonth")}</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("transactions.emptyMonthDescription")}</p>
      </div>
  ) : (
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
              {items.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  showDelete
                  onDeleteRequest={() => {
                    setDeleteError(null);
                    setTransactionToDelete(transaction);
                  }}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );

  return (
    <>
      {feed}
      <AlertDialog
        open={transactionToDelete !== null}
        onOpenChange={(open) => {
          if (open || deleting) return;
          setDeleteError(null);
          setTransactionToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("transaction.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("transaction.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError ? (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {t(deleteError)}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              {t("transaction.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {deleting ? t("transaction.deleting") : t("transaction.deleteAction")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
