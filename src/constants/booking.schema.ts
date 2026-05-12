import { z } from "zod";

export const bookingFormSchema = z
  .object({
    checkIn: z.date().nullable(),
    checkOut: z.date().nullable(),
  })
  .superRefine((value, ctx) => {
    if (!value.checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkIn"],
        message: "Select a check-in date.",
      });
    }

    if (!value.checkOut) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Select a check-out date.",
      });
    }

    if (value.checkIn && value.checkOut && value.checkOut <= value.checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Check-out must be after check-in.",
      });
    }
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
