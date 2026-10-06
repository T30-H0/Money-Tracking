"use client";

import Link from "next/link";

import { CATEGORY_ICONS, CATEGORY_STYLES } from "@/constants/category.constants";
import { useFinance } from "@/context/finance-context";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/finance";
import { useLanguage } from "@/context/language-context";
import { getCategoryName } from "@/i18n/categories";

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { categories, format } = useFinance();
  const { t } = useLanguage();
  const category = categories.find((item) => item.id === transaction.categoryId);
  if (!category) return null;
  const Icon = CATEGORY_ICONS[category.icon];
  const isIncome = transaction.type === "income";
  const categoryName = getCategoryName(category, t);

  return (
    <Link
      href={`/transactions/${transaction.id}`}
      className="flex items-center gap-3 rounded-lg py-3.5 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={t("transactions.view", { name: transaction.note || categoryName })}
    >
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", CATEGORY_STYLES[category.color])} aria-hidden="true">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{transaction.note || categoryName}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{categoryName}</p>
      </div>
      <p className={cn("shrink-0 text-sm font-semibold tabular-nums", isIncome ? "text-emerald-600" : "text-foreground")}>
        {isIncome ? "+" : "−"}{format(transaction.amount)}
      </p>
    </Link>
  );
}
