"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinance } from "@/context/finance-context";
import { useLanguage } from "@/context/language-context";
import { CategoryOptions } from "@/components/transactions/category-options";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { updateReportParams } from "@/hooks/use-reporting-month";
import type { TransactionFilters } from "@/lib/dashboard-data";

export function TransactionFilterControls({ filters }: { filters: TransactionFilters }) {
  const { categories } = useFinance();
  const { t } = useLanguage();
  const params = useSearchParams();
  const mode = filters.category ? "category" : filters.group ? "group" : params.get("categoryView") === "category" ? "category" : "group";
  const availableCategories = categories.filter((category) => !filters.type || category.type === filters.type);
  const update = (values: Record<string, string | undefined>, replace = false) => updateReportParams({ month: filters.month, ...values }, replace);
  return (
    <div className="flex flex-wrap gap-3 rounded-xl border bg-card p-4">
      <Input className="min-w-40 flex-1" value={filters.query ?? ""} aria-label={t("search.placeholder")} placeholder={t("search.placeholder")}
        onChange={(event) => update({ q: event.target.value || undefined }, true)} />
      <Tabs value={mode} onValueChange={(value) => update({ categoryView: value, category: undefined, group: undefined })}>
        <TabsList aria-label={t("categories.viewMode")}>
          <TabsTrigger value="group">{t("categories.byGroup")}</TabsTrigger>
          <TabsTrigger value="category">{t("categories.byCategory")}</TabsTrigger>
        </TabsList>
      </Tabs>
      <Select value={(mode === "category" ? filters.category : filters.group) ?? "all"}
        onValueChange={(value) => update({ categoryView: mode, category: mode === "category" && value !== "all" ? value : undefined, group: mode === "group" && value !== "all" ? value : undefined })}>
        <SelectTrigger className="w-full sm:w-56" aria-label={t(mode === "group" ? "categories.allGroups" : "filters.allCategories")}><SelectValue /></SelectTrigger>
        <SelectContent className="max-h-[min(20rem,var(--radix-select-content-available-height))]">
          <SelectItem value="all">{t(mode === "group" ? "categories.allGroups" : "filters.allCategories")}</SelectItem>
          <CategoryOptions categories={availableCategories} groupsOnly={mode === "group"} />
        </SelectContent>
      </Select>
      <Select value={filters.type ?? "all"} onValueChange={(value) => update({ categoryView: mode, type: value === "all" ? undefined : value, category: undefined, group: undefined, ...(value === "income" ? { threshold: undefined } : {}) })}>
        <SelectTrigger className="w-full sm:w-44" aria-label={t("filters.allTypes")}><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">{t("filters.allTypes")}</SelectItem><SelectItem value="expense">{t("transactions.expense")}</SelectItem><SelectItem value="income">{t("transactions.income")}</SelectItem></SelectContent>
      </Select>
      <Button variant="ghost" className="text-primary" onClick={() => update({ category: undefined, group: undefined, type: undefined, threshold: undefined, q: undefined })}>{t("filters.clear")}</Button>
    </div>
  );
}
