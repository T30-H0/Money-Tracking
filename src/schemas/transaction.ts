import { z } from "zod";

import { parseDisplayAmount } from "@/utils/currency";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  displayAmount: z
    .string()
    .trim()
    .min(1, "Enter an amount")
    .refine((value) => {
      const amount = parseDisplayAmount(value);
      return Number.isFinite(amount) && amount > 0;
    }, "Amount must be greater than zero"),
  currency: z.enum(["VND", "USD", "EUR", "JPY", "AUD", "SGD"]),
  categoryId: z.uuid("Choose a category"),
  date: z.iso.date("Choose a valid date"),
  note: z.string().trim().max(160, "Note must be 160 characters or fewer"),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
