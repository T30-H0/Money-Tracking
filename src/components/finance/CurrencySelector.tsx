"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { CurrencyCode, CurrencyMeta } from "@/types/currency";
import { getCurrencyMeta, isSupportedCurrency } from "@/utils/currency";

interface CurrencySelectorProps {
  currency: CurrencyCode;
  currencies: CurrencyMeta[];
  onChange: (code: CurrencyCode) => void;
  label?: string;
}

export function CurrencySelector({
  currency,
  currencies,
  onChange,
  label = "Select currency",
}: CurrencySelectorProps) {
  const active = getCurrencyMeta(currency);

  const handleChange = (value: string) => {
    if (isSupportedCurrency(value)) {
      onChange(value);
    }
  };

  return (
    <Select value={currency} onValueChange={handleChange}>
      <SelectTrigger aria-label={label} className="w-[7.5rem]">
        <span>{active.code}</span>
      </SelectTrigger>

      <SelectContent align="start" className="w-fit">
        {currencies.map((meta) => (
          <SelectItem key={meta.code} value={meta.code}>
            <span className="flex items-center gap-2">
              <span className="font-medium">{meta.code}</span>
              <span className="text-muted-foreground">{meta.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
