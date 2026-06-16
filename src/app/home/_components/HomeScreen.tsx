"use client";

import { CurrencySelector } from "@/components/finance/CurrencySelector";
import { FINANCIAL_OVERVIEW_COPY } from "@/constants/finance.constants";
import { useCurrency } from "@/hooks/useCurrency";
import type { FinancialOverview } from "@/types/finance";

import { ExpenseCard } from "./ExpenseCard";
import { InvestmentCard } from "./InvestmentCard";

interface HomeScreenProps {
  overview: FinancialOverview;
}

export function HomeScreen({ overview }: HomeScreenProps) {
  const { currency, currencies, setCurrency, format } = useCurrency();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {FINANCIAL_OVERVIEW_COPY.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {FINANCIAL_OVERVIEW_COPY.subtitle}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <CurrencySelector
            currency={currency}
            currencies={currencies}
            onChange={setCurrency}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExpenseCard summary={overview.expense} format={format} />
        <InvestmentCard summary={overview.investment} format={format} />
      </div>
    </div>
  );
}
