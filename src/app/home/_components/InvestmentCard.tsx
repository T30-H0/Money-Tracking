import { ArrowUpRight } from "lucide-react";

import { AreaChart } from "@/components/finance/AreaChart";
import { HoldingList } from "@/components/finance/HoldingList";
import { OverviewCard } from "@/components/finance/OverviewCard";
import { INVESTMENT_CARD_COPY } from "@/constants/finance.constants";
import type { InvestmentSummary } from "@/types/finance";

interface InvestmentCardProps {
  summary: InvestmentSummary;
  format: (amount: number) => string;
  onViewDetails?: () => void;
}

export function InvestmentCard({
  summary,
  format,
  onViewDetails,
}: InvestmentCardProps) {
  const isPositive = summary.direction === "up";
  const sign = isPositive ? "+" : "-";
  const changeLabel = `${sign}${format(Math.abs(summary.dailyChange))}`;
  const returnLabel = `${sign}${Math.abs(summary.totalReturnPercent)}% ${INVESTMENT_CARD_COPY.totalReturnLabel}`;

  return (
    <OverviewCard
      icon={<ArrowUpRight className="size-5" />}
      title={INVESTMENT_CARD_COPY.title}
      actionLabel={INVESTMENT_CARD_COPY.action}
      withChevron
      onAction={onViewDetails}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {INVESTMENT_CARD_COPY.pnlLabel}
      </p>
      <p className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-emerald-300">
          {changeLabel}
        </span>
        <span className="text-sm text-slate-400">
          {INVESTMENT_CARD_COPY.todaySuffix}
        </span>
      </p>
      <p className="mt-1 text-sm font-medium text-orange-300">{returnLabel}</p>

      <div className="mt-5">
        <AreaChart
          points={summary.performance}
          ariaLabel="Portfolio performance trend"
        />
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">
          {INVESTMENT_CARD_COPY.holdingsTitle}
        </h3>
        <HoldingList holdings={summary.holdings} />
      </div>
    </OverviewCard>
  );
}
