import {
  addMonths,
  differenceInCalendarDays,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";

import { BOOKING_WINDOW_MONTHS } from "@/constants/booking.constants";

export function getBookingMinDate(referenceDate = new Date()) {
  return startOfDay(referenceDate);
}

export function getBookingMaxDate(referenceDate = new Date()) {
  return addMonths(getBookingMinDate(referenceDate), BOOKING_WINDOW_MONTHS);
}

export function isDateOutsideBookingWindow(
  date: Date,
  referenceDate = new Date(),
) {
  const currentDate = startOfDay(date);
  const minDate = getBookingMinDate(referenceDate);
  const maxDate = getBookingMaxDate(referenceDate);

  return isBefore(currentDate, minDate) || isAfter(currentDate, maxDate);
}

export function calculateBookingDays(
  checkIn: Date | null | undefined,
  checkOut: Date | null | undefined,
) {
  if (!checkIn || !checkOut) {
    return 0;
  }

  const numberOfDays = differenceInCalendarDays(
    startOfDay(checkOut),
    startOfDay(checkIn),
  );

  return numberOfDays > 0 ? numberOfDays : 0;
}

export function calculateTotalPrice(price: number, numberOfDays: number) {
  return price * numberOfDays;
}

export function formatBookingDate(date: Date | null | undefined) {
  if (!date) {
    return "Select date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isDateOnOrAfter(candidate: Date, comparisonDate: Date) {
  return !isBefore(startOfDay(candidate), startOfDay(comparisonDate));
}

export function isDateOnOrBefore(candidate: Date, comparisonDate: Date) {
  return !isAfter(startOfDay(candidate), startOfDay(comparisonDate));
}
