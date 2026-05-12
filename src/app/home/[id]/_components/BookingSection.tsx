"use client";

import { Controller } from "react-hook-form";

import { BOOKING_SECTION_COPY } from "@/constants/booking.constants";
import { useBookingForm } from "@/hooks/useBookingForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingDateField } from "./BookingDateField";
import { formatCurrency } from "@/utils/booking";

interface BookingSectionProps {
  price: number;
}

export function BookingSection({ price }: BookingSectionProps) {
  const {
    form,
    minDate,
    maxDate,
    numberOfDays,
    totalPrice,
    canBook,
    disableCheckInDate,
    disableCheckOutDate,
  } = useBookingForm(price);

  const submitBooking = form.handleSubmit(() => undefined);

  return (
    <Card className="rounded-[28px] border-gray-100 shadow-none">
      <CardHeader className="gap-2 pb-4">
        <CardTitle>{BOOKING_SECTION_COPY.title}</CardTitle>
        <CardDescription>{BOOKING_SECTION_COPY.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <form className="space-y-5" onSubmit={submitBooking}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="checkIn"
              render={({ field, fieldState }) => (
                <BookingDateField
                  label={BOOKING_SECTION_COPY.checkInLabel}
                  value={field.value}
                  onSelect={field.onChange}
                  disabled={disableCheckInDate}
                  fromDate={minDate}
                  toDate={maxDate}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="checkOut"
              render={({ field, fieldState }) => (
                <BookingDateField
                  label={BOOKING_SECTION_COPY.checkOutLabel}
                  value={field.value}
                  onSelect={field.onChange}
                  disabled={disableCheckOutDate}
                  fromDate={minDate}
                  toDate={maxDate}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className="rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
            {BOOKING_SECTION_COPY.availabilityLabel}
          </div>

          <div className="space-y-3 rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {BOOKING_SECTION_COPY.nightlyRateLabel}
              </span>
              <span className="font-medium text-foreground">
                {formatCurrency(price)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {BOOKING_SECTION_COPY.stayLengthLabel}
              </span>
              <span className="font-medium text-foreground">
                {numberOfDays} {numberOfDays === 1 ? "day" : "days"}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3 text-base">
              <span className="font-medium text-foreground">
                {BOOKING_SECTION_COPY.totalPriceLabel}
              </span>
              <span className="text-lg font-semibold text-foreground">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>

          {!canBook ? (
            <p className="text-sm text-muted-foreground">
              {BOOKING_SECTION_COPY.noDatesSelected}
            </p>
          ) : null}

          <Button
            className="h-11 w-full rounded-xl text-sm font-semibold"
            disabled={!canBook}
            type="submit"
          >
            {BOOKING_SECTION_COPY.bookingActionPrefix}{" "}
            {formatCurrency(totalPrice)}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
