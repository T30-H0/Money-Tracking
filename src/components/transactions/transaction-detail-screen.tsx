"use client";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  LoaderCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type MouseEvent } from "react";

import { TransactionForm } from "@/components/transactions/transaction-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_ICONS, CATEGORY_STYLES } from "@/constants/category.constants";
import { useFinance } from "@/context/finance-context";
import { fromLocalDateString } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { TransactionInput } from "@/schemas/transaction";
import type { Transaction } from "@/types/finance";
import { toDisplayAmountInput } from "@/utils/currency";
import { useLanguage } from "@/context/language-context";
import { getCategoryName } from "@/i18n/categories";
import type { MessageKey } from "@/i18n/messages";

export function TransactionDetailScreen({
  initialTransaction,
}: {
  initialTransaction: Transaction;
}) {
  const router = useRouter();
  const {
    categories,
    currency,
    format,
    updateTransaction,
    deleteTransaction,
  } = useFinance();
  const { intlLocale, t } = useLanguage();
  const [transaction, setTransaction] = useState(initialTransaction);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<MessageKey | null>(null);
  const category = categories.find(
    (item) => item.id === transaction.categoryId,
  );

  const defaultValues = useMemo<TransactionInput>(
    () => ({
      type: transaction.type,
      displayAmount: toDisplayAmountInput(transaction.amount, currency),
      currency,
      categoryId: transaction.categoryId,
      date: transaction.date,
      note: transaction.note,
    }),
    [currency, transaction],
  );

  if (!category) return null;
  const Icon = CATEGORY_ICONS[category.icon];
  const isIncome = transaction.type === "income";
  const categoryName = getCategoryName(category, t);

  const handleDelete = async (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (deleting) return;
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteTransaction(transaction.id);
    if (!result.ok) {
      setDeleteError(result.message ?? "error.deleteTransaction");
      setDeleting(false);
      setDeleteOpen(false);
      return;
    }
    router.replace("/transactions");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button asChild variant="ghost" className="-ml-2">
        <Link href="/transactions">
          <ArrowLeft className="size-4" />
          {t("transaction.back")}
        </Link>
      </Button>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{t("transaction.details")}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {transaction.note || categoryName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("transaction.detailsDescription")}
          </p>
        </div>
        {!editing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Pencil className="size-4" />
              {t("transaction.edit")}
            </Button>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="size-4" />
                  {t("transaction.delete")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("transaction.deleteTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("transaction.deleteDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
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
          </div>
        ) : null}
      </header>

      {deleteError ? (
        <p
          role="alert"
          className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {t(deleteError)}
        </p>
      ) : null}

      {editing ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("transaction.editTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm
              key={`${transaction.id}-${currency}-${transaction.amount}-${transaction.categoryId}-${transaction.date}-${transaction.note}`}
              defaultValues={defaultValues}
              submitLabel={t("transaction.saveChanges")}
              onSubmit={(values) => updateTransaction(transaction.id, values)}
              onSuccess={(updated) => {
                setTransaction(updated);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col items-center border-b px-6 py-10 text-center">
              <span
                className={cn(
                  "grid size-16 place-items-center rounded-2xl",
                  CATEGORY_STYLES[category.color],
                )}
                aria-hidden="true"
              >
                <Icon className="size-8" />
              </span>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                {categoryName}
              </p>
              <p
                className={cn(
                  "mt-1 text-3xl font-bold tabular-nums",
                  isIncome ? "text-emerald-600" : "text-foreground",
                )}
              >
                {isIncome ? "+" : "−"}
                {format(transaction.amount)}
              </p>
              <span
                className={cn(
                  "mt-3 rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                  isIncome
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700",
                )}
              >
                {t(isIncome ? "transaction.type.income" : "transaction.type.expense")}
              </span>
            </div>
            <dl className="divide-y px-5 sm:px-6">
              <DetailRow
                icon={CalendarDays}
                label={t("transaction.transactionDate")}
                value={fromLocalDateString(transaction.date).toLocaleDateString(
                  intlLocale,
                  { dateStyle: "long" },
                )}
              />
              <DetailRow
                icon={Clock3}
                label={t("transaction.created")}
                value={new Date(transaction.createdAt).toLocaleString(
                  intlLocale,
                  { dateStyle: "medium", timeStyle: "short" },
                )}
              />
              <div className="py-5">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("transaction.note")}
                </dt>
                <dd className="mt-2 whitespace-pre-wrap text-sm">
                  {transaction.note || t("transaction.noNote")}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-5">
      <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}
