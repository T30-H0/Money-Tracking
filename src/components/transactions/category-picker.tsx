"use client";

import type { Ref } from "react";
import { CategoryOptions } from "@/components/transactions/category-options";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORY_ICONS,
  QUICK_CATEGORY_IDS,
} from "@/constants/category.constants";
import { useLanguage } from "@/context/language-context";
import { getCategoryName } from "@/i18n/categories";
import { cn } from "@/lib/utils";
import type { Category, TransactionType } from "@/types/finance";

interface CategoryPickerProps {
  categories: Category[];
  type: TransactionType;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  triggerRef: Ref<HTMLButtonElement>;
  invalid: boolean;
}

export function CategoryPicker({
  categories,
  type,
  value,
  onChange,
  onBlur,
  triggerRef,
  invalid,
}: CategoryPickerProps) {
  const { t } = useLanguage();
  const quickCategories = QUICK_CATEGORY_IDS.flatMap((id) =>
    categories.filter((category) => category.id === id),
  );

  return (
    <div className="space-y-2">
      {type === "expense" && (
        <div className="grid grid-cols-3 gap-2">
          {quickCategories.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon];
            return (
              <Button
                key={category.id}
                type="button"
                variant="outline"
                aria-pressed={value === category.id}
                onClick={() => onChange(category.id)}
                className={cn(
                  "h-auto min-h-11 min-w-0 gap-1.5 whitespace-normal px-2 py-2 text-xs",
                  value === category.id &&
                    "border-primary bg-primary/5 ring-2 ring-primary/15",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {getCategoryName(category, t)}
              </Button>
            );
          })}
        </div>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="transaction-category"
          ref={triggerRef}
          onBlur={onBlur}
          aria-invalid={invalid}
          className="h-11 w-full min-w-0"
        >
          <SelectValue placeholder={t("transaction.chooseCategory")} />
        </SelectTrigger>
        <SelectContent className="max-h-[min(20rem,var(--radix-select-content-available-height))]">
          <CategoryOptions categories={categories} variant="grouped" />
        </SelectContent>
      </Select>
    </div>
  );
}
