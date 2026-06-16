import { ShoppingCart } from "lucide-react";

import { BarChart } from "@/components/finance/BarChart";
import { OverviewCard } from "@/components/finance/OverviewCard";
import { TransactionList } from "@/components/finance/TransactionList";
import { EXPENSE_CARD_COPY } from "@/constants/finance.constants";
import type { ExpenseSummary } from "@/types/finance";

interface ExpenseCardProps {
  summary: ExpenseSummary;
  format: (amount: number) => string;
  onViewDetails?: () => void;
}

export function ExpenseCard({
  summary,
  format,
  onViewDetails,
}: ExpenseCardProps) {
  return (
    <OverviewCard
      icon={<ShoppingCart className="size-5" />}
      title={EXPENSE_CARD_COPY.title}
      actionLabel={EXPENSE_CARD_COPY.action}
      onAction={onViewDetails}
      withChevron
    >
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-emerald-300" />
          {EXPENSE_CARD_COPY.chartLegendCurrent}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-orange-300" />
          {EXPENSE_CARD_COPY.chartLegendPrevious}
        </span>
      </div>

      <div className="mt-4">
        <BarChart bars={summary.bars} ariaLabel="Monthly spending comparison" />
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">
          {EXPENSE_CARD_COPY.transactionsTitle}
        </h3>
        <TransactionList transactions={summary.transactions} format={format} />
      </div>
    </OverviewCard>
  );
}
