import type { FinancialOverview } from "@/types/finance";

export const mockFinancialOverview: FinancialOverview = {
  expense: {
    bars: [
      { label: "Current", amount: 2480, tone: "primary" },
      { label: "Week 2", amount: 620, tone: "muted" },
      { label: "Week 3", amount: 2510, tone: "primary" },
      { label: "Previous", amount: 1180, tone: "muted" },
    ],
    transactions: [
      { id: "1", date: "Oct 25", description: "Coffee Shop", amount: 18.5 },
      { id: "2", date: "Oct 24", description: "Groceries", amount: 75.2 },
      { id: "3", date: "Oct 22", description: "Online Course", amount: 199.99 },
    ],
  },
  investment: {
    dailyChange: 5320.15,
    totalReturnPercent: 8.5,
    direction: "up",
    performance: [0.18, 0.24, 0.2, 0.32, 0.42, 0.38, 0.5, 0.62, 0.58, 0.72, 0.85, 0.95],
    holdings: [
      { id: "1", name: "Northwind Index", allocation: 90 },
      { id: "2", name: "Atlas Growth Fund", allocation: 40 },
    ],
  },
};
