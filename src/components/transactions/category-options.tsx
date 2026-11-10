"use client";

import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import { CATEGORY_ICONS, CATEGORY_STYLES } from "@/constants/category.constants";
import { useLanguage } from "@/context/language-context";
import { getCategoryName } from "@/i18n/categories";
import { getCategorySections } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/finance";

export function CategoryOptions({ categories, groupsOnly = false, variant = "plain" }: { categories: Category[]; groupsOnly?: boolean; variant?: "plain" | "grouped" }) {
  const { t } = useLanguage();
  function option(category: Category, child = false) {
    const Icon = CATEGORY_ICONS[category.icon];
    const name = getCategoryName(category, t);
    return <SelectItem key={category.id} value={category.id} textValue={name}>
      <span className={cn("flex items-center gap-2", child && "pl-4")}>
        <span className={cn("grid size-6 shrink-0 place-items-center rounded-md", CATEGORY_STYLES[category.color])}>
          <Icon className="size-4" />
        </span>
        {name}
      </span>
    </SelectItem>;
  }
  return getCategorySections(categories).map(({ root, children }) => {
    const hasChildren = !groupsOnly && children.length > 0;
    if (variant === "plain" && !hasChildren) return option(root);
    return (
      <SelectGroup key={root.id} className={cn(variant === "grouped" && "mb-2 rounded-lg border border-border bg-background p-1 shadow-sm last:mb-0")}>
        {hasChildren && <SelectLabel className={cn(variant === "grouped" && "mb-1 rounded-md bg-muted/60 px-2 py-2 font-semibold text-foreground")}>{getCategoryName(root, t)}</SelectLabel>}
        {option(root)}
        {hasChildren && children.map((child) => option(child, true))}
      </SelectGroup>
    );
  });
}
