import type { MessageKey, TranslationParams } from "@/i18n/messages";

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
