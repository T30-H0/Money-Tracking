import { addMonths, toLocalDateString } from "@/lib/date";
import type { Category, Transaction } from "@/types/finance";

export const mockCategories: Category[] = [
  { id: "00000000-0000-4000-8000-000000000001", name: "Food", icon: "utensils", color: "amber", type: "expense" },
  { id: "00000000-0000-4000-8000-000000000002", name: "Bills", icon: "receipt-text", color: "blue", type: "expense" },
  { id: "00000000-0000-4000-8000-000000000003", name: "Transport", icon: "car", color: "cyan", type: "expense" },
  { id: "00000000-0000-4000-8000-000000000008", name: "Salary", icon: "wallet-cards", color: "emerald", type: "income" },
];

export function createMockTransactions(referenceDate = new Date()): Transaction[] {
  const templates = [
    { categoryId: mockCategories[3].id, type: "income" as const, amount: 32_000_000, note: "Monthly salary", day: 1 },
    { categoryId: mockCategories[0].id, type: "expense" as const, amount: 185_000, note: "Dinner", day: 7 },
    { categoryId: mockCategories[1].id, type: "expense" as const, amount: 1_250_000, note: "Utilities", day: 12 },
    { categoryId: mockCategories[2].id, type: "expense" as const, amount: 95_000, note: "Ride home", day: 18 },
  ];

  return [0, -1, -2].flatMap((offset) => {
    const month = addMonths(referenceDate, offset);
    return templates.map((template, index) => {
      const date = new Date(month.getFullYear(), month.getMonth(), template.day);
      return {
        id: `mock-${offset}-${index}`,
        type: template.type,
        amount: template.amount,
        categoryId: template.categoryId,
        date: toLocalDateString(date),
        note: template.note,
        createdAt: date.toISOString(),
      };
    });
  });
}
