"use client";

import { useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { monthKey } from "@/lib/date";
import { validMonth } from "@/lib/dashboard-data";

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  window.addEventListener("focus", onChange);
  return () => { window.clearInterval(timer); window.removeEventListener("focus", onChange); };
}

export function useLocalMonth() {
  return useSyncExternalStore(subscribe, () => monthKey(new Date()), () => "");
}

export function useReportingMonth() {
  const params = useSearchParams();
  const localMonth = useLocalMonth();
  const requestedMonth = params.get("month");
  return validMonth(requestedMonth) ? requestedMonth : localMonth;
}

export function updateReportParams(values: Record<string, string | undefined>, replace = false) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  if (replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
}
