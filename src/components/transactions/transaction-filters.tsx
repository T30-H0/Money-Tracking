"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinance } from "@/context/finance-context";
import { useLanguage } from "@/context/language-context";
import { getCategoryName } from "@/i18n/categories";
import { updateReportParams } from "@/hooks/use-reporting-month";
import type { TransactionFilters } from "@/lib/dashboard-data";

export function TransactionFilterControls({ filters }: { filters: TransactionFilters }) {
  const { categories } = useFinance();
  const { t } = useLanguage();
  const update = (values: Record<string, string | undefined>, replace = false) => updateReportParams({ month: filters.month, ...values }, replace);
  return (
    <div className="flex flex-wrap gap-3 rounded-xl border bg-card p-4">
      <Input className="min-w-40 flex-1" value={filters.query ?? ""} aria-label={t("search.placeholder")} placeholder={t("search.placeholder")}
        onChange={(event) => update({ q: event.target.value || undefined }, true)} />
      <Select value={filters.category ?? "all"} onValueChange={(value) => update({ category: value === "all" ? undefined : value })}>
        <SelectTrigger className="w-full sm:w-48" aria-label={t("filters.allCategories")}><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">{t("filters.allCategories")}</SelectItem>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{getCategoryName(category, t)}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={filters.type ?? "all"} onValueChange={(value) => update({ type: value === "all" ? undefined : value, ...(value === "income" ? { threshold: undefined } : {}) })}>
        <SelectTrigger className="w-full sm:w-44" aria-label={t("filters.allTypes")}><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">{t("filters.allTypes")}</SelectItem><SelectItem value="expense">{t("transactions.expense")}</SelectItem><SelectItem value="income">{t("transactions.income")}</SelectItem></SelectContent>
      </Select>
      <Button variant="ghost" className="text-primary" onClick={() => update({ category: undefined, type: undefined, threshold: undefined, q: undefined })}>{t("filters.clear")}</Button>
    </div>
  );
}
