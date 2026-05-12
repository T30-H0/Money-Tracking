"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import {
  bookingFormSchema,
  type BookingFormValues,
} from "@/constants/booking.schema";
import {
  calculateBookingDays,
  calculateTotalPrice,
  getBookingMaxDate,
  getBookingMinDate,
  isDateOnOrAfter,
  isDateOnOrBefore,
  isDateOutsideBookingWindow,
} from "@/utils/booking";

export function useBookingForm(price: number) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      checkIn: null,
      checkOut: null,
    },
    mode: "onChange",
  });

  const [checkIn, checkOut] = useWatch({
    control: form.control,
    name: ["checkIn", "checkOut"],
  });

  const minDate = getBookingMinDate();
  const maxDate = getBookingMaxDate();
  const numberOfDays = calculateBookingDays(checkIn, checkOut);
  const totalPrice = calculateTotalPrice(price, numberOfDays);
  const canBook = numberOfDays > 0;

  const disableCheckInDate = (date: Date) => {
    if (isDateOutsideBookingWindow(date)) {
      return true;
    }

    if (checkOut) {
      return isDateOnOrAfter(date, checkOut);
    }

    return false;
  };

  const disableCheckOutDate = (date: Date) => {
    if (isDateOutsideBookingWindow(date)) {
      return true;
    }

    if (checkIn) {
      return isDateOnOrBefore(date, checkIn);
    }

    return false;
  };

  return {
    form,
    checkIn,
    checkOut,
    minDate,
    maxDate,
    numberOfDays,
    totalPrice,
    canBook,
    disableCheckInDate,
    disableCheckOutDate,
  };
}
