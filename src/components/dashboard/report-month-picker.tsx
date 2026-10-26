"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/context/language-context";
import { addMonths, formatMonthName, fromLocalDateString, monthKey } from "@/lib/date";

export function ReportMonthPicker({ month, onChange }: { month: string; onChange: (month: string) => void }) {
  const { t, intlLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [displayedYear, setDisplayedYear] = useState(() => fromLocalDateString(`${month}-01`).getFullYear());
  const selected = fromLocalDateString(`${month}-01`);

  const years = Array.from({ length: 121 }, (_, index) => selected.getFullYear() - 100 + index);
  const chooseMonth = (date: Date) => {
    onChange(monthKey(date));
    setOpen(false);
  };

  return (
    <div className="flex min-w-0 items-center gap-1">
      <Button variant="ghost" size="icon" className="size-8" aria-label={t("dashboard.previousMonth")} onClick={() => onChange(monthKey(addMonths(selected, -1)))}>
        <ChevronLeft className="size-4" />
      </Button>
      <Popover open={open} onOpenChange={(nextOpen) => {
        if (nextOpen) setDisplayedYear(selected.getFullYear());
        setOpen(nextOpen);
      }}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10 w-48 justify-start gap-2 bg-card font-normal tabular-nums" aria-label={t("transactions.monthPicker")}>
            <CalendarDays className="size-4 text-muted-foreground" />
            {formatMonthName(selected, intlLocale)} {selected.getFullYear()}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 space-y-3 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">{t("dashboard.year")}</span>
            <Select value={String(displayedYear)} onValueChange={(value) => setDisplayedYear(Number(value))}>
              <SelectTrigger aria-label={t("dashboard.year")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label={t("transactions.monthPicker")}>
            {Array.from({ length: 12 }, (_, index) => {
              const date = new Date(displayedYear, index, 1);
              const isSelected = monthKey(date) === month;
              return (
                <Button
                  key={index}
                  type="button"
                  variant={isSelected ? "default" : "ghost"}
                  className="h-10 px-1"
                  aria-pressed={isSelected}
                  onClick={() => chooseMonth(date)}
                >
                  {formatMonthName(date, intlLocale)}
                </Button>
              );
            })}
          </div>
          <div className="flex justify-center">
            <Button type="button" variant="link" size="sm" onClick={() => chooseMonth(new Date())}>
              {t("dashboard.thisMonth")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Button variant="ghost" size="icon" className="size-8" aria-label={t("dashboard.nextMonth")} onClick={() => onChange(monthKey(addMonths(selected, 1)))}>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
