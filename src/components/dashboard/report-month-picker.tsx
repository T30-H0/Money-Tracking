"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { enUS, vi } from "react-day-picker/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/context/language-context";
import { addMonths, fromLocalDateString, monthKey } from "@/lib/date";

export function ReportMonthPicker({ month, onChange }: { month: string; onChange: (month: string) => void }) {
  const { t, locale, intlLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(month);
  const selected = fromLocalDateString(`${month}-01`);

  return (
    <div className="flex min-w-0 items-center gap-1">
      <Button variant="ghost" size="icon" className="size-8" aria-label={t("dashboard.previousMonth")} onClick={() => onChange(monthKey(addMonths(selected, -1)))}>
        <ChevronLeft className="size-4" />
      </Button>
      <Popover open={open} onOpenChange={(nextOpen) => {
        if (nextOpen) setCalendarMonth(month);
        setOpen(nextOpen);
      }}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10 w-48 justify-start gap-2 bg-card font-normal tabular-nums" aria-label={t("transactions.monthPicker")}>
            <CalendarDays className="size-4 text-muted-foreground" />
            {selected.toLocaleDateString(intlLocale, { month: "long", year: "numeric" })}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            locale={locale === "vi" ? vi : enUS}
            mode="single"
            captionLayout="dropdown"
            month={fromLocalDateString(`${calendarMonth}-01`)}
            onMonthChange={(date) => setCalendarMonth(monthKey(date))}
            startMonth={new Date(selected.getFullYear() - 100, 0, 1)}
            endMonth={new Date(selected.getFullYear() + 20, 11, 1)}
            selected={selected}
            autoFocus
            onSelect={(date) => {
              if (!date) return;
              onChange(monthKey(date));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <Button variant="ghost" size="icon" className="size-8" aria-label={t("dashboard.nextMonth")} onClick={() => onChange(monthKey(addMonths(selected, 1)))}>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
