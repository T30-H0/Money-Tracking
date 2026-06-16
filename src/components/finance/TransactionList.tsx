import type { Transaction } from "@/types/finance";

interface TransactionListProps {
  transactions: Transaction[];
  format: (amount: number) => string;
}

export function TransactionList({
  transactions,
  format,
}: TransactionListProps) {
  return (
    <ol className="flex flex-col gap-2.5">
      {transactions.map((transaction, index) => (
        <li
          key={transaction.id}
          className="flex items-center justify-between gap-4 text-sm"
        >
          <span className="min-w-0 truncate text-slate-300">
            <span className="text-slate-500">{index + 1}.</span>{" "}
            {transaction.date} &middot; {transaction.description}
          </span>
          <span className="shrink-0 font-medium text-slate-100">
            {format(transaction.amount)}
          </span>
        </li>
      ))}
    </ol>
  );
}
