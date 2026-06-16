import type { Holding } from "@/types/finance";

interface HoldingListProps {
  holdings: Holding[];
}

export function HoldingList({ holdings }: HoldingListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {holdings.map((holding) => (
        <li key={holding.id} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="min-w-0 truncate text-slate-300">
              {holding.name}
            </span>
            <span className="shrink-0 font-medium text-emerald-300">
              {holding.allocation}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-300"
              style={{
                width: `${Math.min(Math.max(holding.allocation, 0), 100)}%`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
