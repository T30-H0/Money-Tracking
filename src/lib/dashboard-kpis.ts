import { getCategoryName } from "@/i18n/categories";
import type { MessageKey, TranslationParams } from "@/i18n/messages";
import type { Category, Transaction } from "@/types/finance";

type Translate = (key: MessageKey, params?: TranslationParams) => string;

export function getSpendingComparison(
  currentExpense: number,
  previousExpense: number,
  t: Translate,
) {
  if (previousExpense <= 0) {
    return { detail: t("dashboard.noPreviousSpending"), positive: false };
  }

  const difference = ((currentExpense - previousExpense) / previousExpense) * 100;
  const positive = difference <= 0;
  const messageKey = positive
    ? "dashboard.lessThanLastMonth"
    : "dashboard.moreThanLastMonth";

  return {
    detail: t(messageKey, { percent: Math.abs(difference).toFixed(1) }),
    positive,
  };
}

function getTopCategorySpending(transactions: Transaction[], month: string) {
  const spendingByCategory: Record<string, number> = {};

  for (const transaction of transactions) {
    if (transaction.type !== "expense" || !transaction.date.startsWith(month)) {
      continue;
    }

    const { categoryId, amount } = transaction;
    spendingByCategory[categoryId] = (spendingByCategory[categoryId] ?? 0) + amount;
  }

  const topEntry = Object.entries(spendingByCategory).sort(
    ([, firstAmount], [, secondAmount]) => secondAmount - firstAmount,
  )[0];

  if (!topEntry) return null;

  const [categoryId, amount] = topEntry;
  return { categoryId, amount };
}

export function getTopCategoryInsight({
  transactions,
  categories,
  month,
  format,
  t,
}: {
  transactions: Transaction[];
  categories: Category[];
  month: string;
  format: (amount: number) => string;
  t: Translate;
}) {
  const topSpending = getTopCategorySpending(transactions, month);

  if (!topSpending) {
    return {
      value: t("dashboard.noSpending"),
      detail: t("dashboard.addExpenseInsight"),
    };
  }

  const category = categories.find((item) => item.id === topSpending.categoryId);

  return {
    value: category ? getCategoryName(category, t) : t("dashboard.noSpending"),
    detail: format(topSpending.amount),
  };
}
