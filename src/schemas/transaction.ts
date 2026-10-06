import { z } from "zod";

import { parseDisplayAmount } from "@/utils/currency";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  displayAmount: z
    .string()
    .trim()
    .min(1, "error.amountRequired")
    .refine((value) => {
      const amount = parseDisplayAmount(value);
      return Number.isFinite(amount) && amount > 0;
    }, "error.amountPositive"),
  currency: z.enum(["VND", "USD", "EUR", "JPY", "AUD", "SGD"]),
  categoryId: z.uuid("error.categoryRequired"),
  date: z.iso.date("error.dateInvalid"),
  note: z.string().trim().max(160, "error.noteTooLong"),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
