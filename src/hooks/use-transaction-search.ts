"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/language-context";
import { getCategoryName } from "@/i18n/categories";
import type { Category, Transaction } from "@/types/finance";

export function useTransactionSearch(query: string, categories: Category[], enabled: boolean) {
  const { t } = useLanguage();
  const normalized = query.trim().slice(0, 200);
  const matchingIds = categories.filter((category) =>
    category.name.toLocaleLowerCase().includes(normalized.toLocaleLowerCase()) ||
    getCategoryName(category, t).toLocaleLowerCase().includes(normalized.toLocaleLowerCase()),
  ).map((category) => category.id).sort().join(",");
  const key = `${normalized}:${matchingIds}`;
  const [state, setState] = useState<{ key: string; results: Transaction[]; error: boolean }>({ key: "", results: [], error: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled || !normalized) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: normalized });
        if (matchingIds) for (const id of matchingIds.split(",")) params.append("category", id);
        const response = await fetch(`/api/finance/search?${params}`, { cache: "no-store", signal: controller.signal });
        if (!response.ok || response.redirected) throw new Error("Search failed");
        const data = await response.json();
        if (!controller.signal.aborted) setState({ key, results: data.transactions, error: false });
      } catch {
        if (!controller.signal.aborted) setState({ key, results: [], error: true });
      }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [enabled, normalized, matchingIds, key, attempt]);

  return {
    results: enabled && normalized && state.key === key ? state.results : [],
    loading: Boolean(normalized) && (!enabled || state.key !== key),
    error: state.key === key && state.error,
    retry: () => { setState({ key: "", results: [], error: false }); setAttempt((value) => value + 1); },
  };
}
