"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

export function MonthScroller({ months, selectedMonth, onSelect }: { months: string[]; selectedMonth: string; onSelect: (month: string) => void }) {
  const { intlLocale, t } = useLanguage();
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
      <div className="flex w-max gap-2" role="tablist" aria-label={t("transactions.monthPicker")}>
        {months.map((month) => {
          const date = new Date(`${month}-01T00:00:00`);
          const active = month === selectedMonth;
          return (
            <Button key={month} type="button" role="tab" aria-selected={active} variant={active ? "default" : "outline"} onClick={() => onSelect(month)} className={cn("rounded-full px-4", !active && "text-muted-foreground")}>
              {date.toLocaleDateString(intlLocale, { month: "short", year: "numeric" })}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
