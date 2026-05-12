"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatBookingDate } from "@/utils/booking";

interface BookingDateFieldProps {
  label: string;
  value: Date | null | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled: (date: Date) => boolean;
  fromDate: Date;
  toDate: Date;
  error?: string;
}

export function BookingDateField({
  label,
  value,
  onSelect,
  disabled,
  fromDate,
  toDate,
  error,
}: BookingDateFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-11 w-full justify-between rounded-xl px-4 text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <span>{formatBookingDate(value)}</span>
            <CalendarIcon className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={(date) => {
              onSelect(date);
              if (date) {
                setOpen(false);
              }
            }}
            disabled={disabled}
            startMonth={fromDate}
            endMonth={toDate}
            defaultMonth={value ?? fromDate}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
