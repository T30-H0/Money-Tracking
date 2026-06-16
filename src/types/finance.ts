export type TrendDirection = "up" | "down";

export interface ExpenseBar {
  label: string;
  amount: number;
  tone: "primary" | "muted";
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface ExpenseSummary {
  bars: ExpenseBar[];
  transactions: Transaction[];
}

export interface Holding {
  id: string;
  name: string;
  allocation: number;
}

export interface InvestmentSummary {
  dailyChange: number;
  totalReturnPercent: number;
  direction: TrendDirection;
  performance: number[];
  holdings: Holding[];
}

export interface FinancialOverview {
  expense: ExpenseSummary;
  investment: InvestmentSummary;
}
