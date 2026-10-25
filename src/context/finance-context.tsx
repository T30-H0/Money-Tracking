"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  createTransactionAction,
  deleteTransactionAction,
  updateTransactionAction,
} from "@/app/actions/transactions";
import {
  CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
} from "@/constants/currency.constants";
import { useLanguage } from "@/context/language-context";
import { DEFAULT_LARGE_EXPENSE_THRESHOLD, summarize as summarizeTransactions } from "@/lib/dashboard-data";
import { sortTransactions } from "@/lib/transactions";
import { monthKey } from "@/lib/date";
import type { TransactionInput } from "@/schemas/transaction";
import type { CurrencyCode } from "@/types/currency";
import type {
  Category,
  MonthSummary,
  Transaction,
  TransactionActionResult,
} from "@/types/finance";
import type { MessageKey } from "@/i18n/messages";
import {
  detectCurrencyFromLocale,
  formatCurrency,
  isSupportedCurrency,
  parseDisplayAmount,
  toBaseVnd,
} from "@/utils/currency";

interface FinanceContextValue {
  transactions: Transaction[];
  categories: Category[];
  largeExpenseThreshold: number;
  currency: CurrencyCode;
  currencies: typeof SUPPORTED_CURRENCIES;
  setCurrency: (currency: CurrencyCode) => void;
  format: (amountInVnd: number, options?: Intl.NumberFormatOptions) => string;
  getTransactionsForMonth: (month: string) => Transaction[];
  getMonthSummary: (month: string) => MonthSummary;
  totalSummary: MonthSummary;
  addTransaction: (input: TransactionInput) => Promise<TransactionActionResult>;
  updateTransaction: (id: string, input: TransactionInput) => Promise<TransactionActionResult>;
  deleteTransaction: (id: string) => Promise<{ ok: boolean; message?: MessageKey }>;
}

export interface FinanceProviderProps {
  initialTransactions: Transaction[];
  categories: Category[];
  children: ReactNode;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({
  initialTransactions,
  categories,
  children,
}: FinanceProviderProps) {
  const { intlLocale } = useLanguage();
  const [transactions, setTransactions] = useState(() =>
    sortTransactions(initialTransactions),
  );
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      let stored: string | null = null;
      try { stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY); } catch { /* Use detected currency. */ }
      setCurrencyState(
        isSupportedCurrency(stored) ? stored : detectCurrencyFromLocale(),
      );
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    try {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, next);
    } catch {
      // The in-memory preference still works when storage is unavailable.
    }
  }, []);

  const format = useCallback(
    (amount: number, options?: Intl.NumberFormatOptions) =>
      formatCurrency(amount, currency, intlLocale, options),
    [currency, intlLocale],
  );

  const getTransactionsForMonth = useCallback(
    (month: string) => transactions.filter((item) => item.date.startsWith(month)),
    [transactions],
  );

  const getMonthSummary = useCallback(
    (month: string) => summarizeTransactions(getTransactionsForMonth(month)),
    [getTransactionsForMonth],
  );

  const totalSummary = useMemo(() => summarizeTransactions(transactions), [transactions]);

  const addTransaction = useCallback(async (input: TransactionInput) => {
    const temporaryId = `optimistic-${crypto.randomUUID()}`;
    const optimistic: Transaction = {
      id: temporaryId,
      type: input.type,
      amount: toBaseVnd(parseDisplayAmount(input.displayAmount), input.currency),
      categoryId: input.categoryId,
      date: input.date,
      note: input.note.trim(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((current) => sortTransactions([optimistic, ...current]));

    let result: TransactionActionResult;
    try {
      result = await createTransactionAction(input);
    } catch {
      result = { ok: false, message: "error.serverUnavailable" };
    }
    if (!result.ok) {
      setTransactions((current) => current.filter((item) => item.id !== temporaryId));
      return result;
    }

    setTransactions((current) =>
      sortTransactions(
        current.map((item) =>
          item.id === temporaryId ? result.transaction : item,
        ),
      ),
    );
    return result;
  }, []);

  const updateTransaction = useCallback(
    async (id: string, input: TransactionInput) => {
      const original = transactions.find((item) => item.id === id);
      if (!original) return { ok: false as const, message: "error.transactionNotFound" as const };

      const optimistic: Transaction = {
        ...original,
        type: input.type,
        amount: toBaseVnd(parseDisplayAmount(input.displayAmount), input.currency),
        categoryId: input.categoryId,
        date: input.date,
        note: input.note.trim(),
      };
      setTransactions((current) => sortTransactions(current.map((item) => item.id === id ? optimistic : item)));
      let result: TransactionActionResult;
      try {
        result = await updateTransactionAction(id, input);
      } catch {
        result = { ok: false, message: "error.serverUnavailable" };
      }
      setTransactions((current) => sortTransactions(current.map((item) => item.id === id ? (result.ok ? result.transaction : original) : item)));
      return result;
    },
    [transactions],
  );

  const deleteTransaction = useCallback(
    async (id: string): Promise<{ ok: boolean; message?: MessageKey }> => {
      const original = transactions.find((item) => item.id === id);
      if (!original) return { ok: false, message: "error.transactionNotFound" };
      setTransactions((current) => current.filter((item) => item.id !== id));
      let result: { ok: true } | { ok: false; message: MessageKey };
      try {
        result = await deleteTransactionAction(id);
      } catch {
        result = { ok: false, message: "error.serverUnavailable" };
      }
      if (!result.ok) setTransactions((current) => sortTransactions([original, ...current]));
      return result;
    },
    [transactions],
  );

  const value = useMemo<FinanceContextValue>(
    () => ({
      transactions,
      categories,
      currency,
      largeExpenseThreshold: DEFAULT_LARGE_EXPENSE_THRESHOLD,
      currencies: SUPPORTED_CURRENCIES,
      setCurrency,
      format,
      getTransactionsForMonth,
      getMonthSummary,
      totalSummary,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }),
    [transactions, categories, currency, setCurrency, format, getTransactionsForMonth, getMonthSummary, totalSummary, addTransaction, updateTransaction, deleteTransaction],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error("useFinance must be used inside FinanceProvider");
  return context;
}

export function getCurrentMonthKey() {
  return monthKey(new Date());
}
