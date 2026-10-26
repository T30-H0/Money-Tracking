"use client";

import { useState } from "react";
import { CalendarDay, Root, useDayPicker, type RootProps } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function CalendarRoot({ children, ...props }: RootProps) {
  const { t } = useLanguage();
  const { dayPickerProps, getModifiers, goToMonth } = useDayPicker();
  const [today] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const modifiers = getModifiers(new CalendarDay(today, today));
  const { startMonth, endMonth } = dayPickerProps;
  const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const outsideBounds =
    (startMonth && todayMonth < new Date(startMonth.getFullYear(), startMonth.getMonth(), 1)) ||
    (endMonth && todayMonth > new Date(endMonth.getFullYear(), endMonth.getMonth(), 1));

  return (
    <Root {...props}>
      {children}
      {dayPickerProps.mode === "single" && dayPickerProps.onSelect && (
        <div className="mt-2 flex justify-center">
          <Button
            type="button"
            variant="link"
            size="sm"
            disabled={Boolean(modifiers.disabled || modifiers.hidden || outsideBounds)}
            onClick={(event) => {
              goToMonth(today);
              if (dayPickerProps.mode === "single") {
                dayPickerProps.onSelect?.(today, today, modifiers, event);
              }
            }}
          >
            {t("transactions.today")}
          </Button>
        </div>
      )}
    </Root>
  );
}
