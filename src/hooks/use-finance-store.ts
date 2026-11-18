"use client";

import { useCallback, useRef, useState, type SetStateAction } from "react";
import { mergeLoadedTransactions, type FinanceResource } from "@/lib/finance-resources";
import { fetchFinanceResource } from "@/services/finance";
import type { Category, Transaction } from "@/types/finance";

export function useFinanceStore() {
  const [store, setStore] = useState<{ transactions: Transaction[]; protectedIds: Set<string> }>({ transactions: [], protectedIds: new Set() });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadedResources, setLoadedResources] = useState<FinanceResource[]>([]);
  const loaded = useRef(new Set<FinanceResource>());
  const pending = useRef(new Map<FinanceResource, Promise<void>>());

  const setTransactions = useCallback((update: SetStateAction<Transaction[]>) => {
    setStore((state) => {
      const current = state.transactions;
      const protectedIds = new Set(state.protectedIds);
      const next = typeof update === "function" ? update(current) : update;
      const before = new Map(current.map((item) => [item.id, item]));
      const after = new Map(next.map((item) => [item.id, item]));
      for (const [id, item] of before) if (after.get(id) !== item) protectedIds.add(id);
      for (const [id, item] of after) if (before.get(id) !== item) protectedIds.add(id);
      return { transactions: next, protectedIds };
    });
  }, []);

  const rememberTransaction = useCallback((transaction: Transaction) => {
    setStore((state) => state.transactions.some((item) => item.id === transaction.id) || state.protectedIds.has(transaction.id)
      ? state : { ...state, transactions: [...state.transactions, transaction] });
  }, []);

  const loadResource = useCallback((resource: FinanceResource): Promise<void> => {
    if (loaded.current.has(resource)) return Promise.resolve();
    const existing = pending.current.get(resource);
    if (existing) return existing;
    const request = fetchFinanceResource(resource).then((data) => {
      if (data.categories) setCategories(data.categories);
      const incoming = data.transactions;
      if (incoming) setStore((state) => ({ ...state, transactions: mergeLoadedTransactions(state.transactions, incoming, state.protectedIds) }));
      loaded.current.add(resource);
      if (resource.startsWith("year:")) {
        for (let month = 1; month <= 12; month++) loaded.current.add(`month:${resource.slice(5)}-${String(month).padStart(2, "0")}`);
      }
      setLoadedResources([...loaded.current]);
    }).finally(() => { pending.current.delete(resource); });
    pending.current.set(resource, request);
    return request;
  }, []);

  return { transactions: store.transactions, categories, setTransactions, rememberTransaction, loadResource, loadedResources };
}
