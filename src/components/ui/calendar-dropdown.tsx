"use client";

import { useDayPicker, type DropdownProps } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function CalendarDropdown({ kind, options, value, disabled, "aria-label": label }: DropdownProps & { kind: "month" | "year" }) {
  const { months, goToMonth } = useDayPicker();

  return (
    <Select
      value={String(value)}
      disabled={disabled}
      onValueChange={(next) => {
        const displayed = months[0].date;
        goToMonth(new Date(
          kind === "year" ? Number(next) : displayed.getFullYear(),
          kind === "month" ? Number(next) : displayed.getMonth(),
          1,
        ));
      }}
    >
      <SelectTrigger aria-label={label} className="h-8 gap-1 border-0 bg-transparent px-2 py-1 text-sm shadow-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-64" position="popper">
        {options?.map((option) => (
          <SelectItem key={option.value} value={String(option.value)} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CalendarMonthsDropdown(props: DropdownProps) {
  return <CalendarDropdown {...props} kind="month" />;
}

export function CalendarYearsDropdown(props: DropdownProps) {
  return <CalendarDropdown {...props} kind="year" />;
}
