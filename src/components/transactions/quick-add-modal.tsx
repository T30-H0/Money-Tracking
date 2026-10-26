"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { TransactionForm } from "@/components/transactions/transaction-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFinance } from "@/context/finance-context";
import { toLocalDateString } from "@/lib/date";
import type { TransactionInput } from "@/schemas/transaction";
import { useLanguage } from "@/context/language-context";

interface QuickAddContextValue {
  openQuickAdd: () => void;
}

const QuickAddContext = createContext<QuickAddContextValue | null>(null);

export function QuickAddProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openQuickAdd = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";
      if (
        !isEditable &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        event.key.toLowerCase() === "n"
      ) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(() => ({ openQuickAdd }), [openQuickAdd]);

  return (
    <QuickAddContext.Provider value={value}>
      {children}
      <QuickAddModal open={open} onOpenChange={setOpen} />
    </QuickAddContext.Provider>
  );
}

export function useQuickAdd() {
  const context = useContext(QuickAddContext);
  if (!context) {
    throw new Error("useQuickAdd must be used inside QuickAddProvider");
  }
  return context;
}

function QuickAddModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { currency, addTransaction } = useFinance();
  const { t } = useLanguage();
  const defaultValues: TransactionInput = {
    type: "expense",
    displayAmount: "",
    currency,
    categoryId: "",
    date: toLocalDateString(new Date()),
    note: "",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[92dvh] flex-col overflow-hidden p-0 sm:p-0"
        onOpenAutoFocus={(event) => {
          if (window.matchMedia("(pointer: coarse)").matches) {
            event.preventDefault();
            titleRef.current?.focus();
          }
        }}
      >
        <DialogHeader className="shrink-0 px-5 pb-3 pt-5 pr-12 sm:px-6 sm:pt-6 sm:pr-12">
          <DialogTitle ref={titleRef} tabIndex={-1} className="outline-none">{t("transaction.add")}</DialogTitle>
          <DialogDescription>
            {t("transaction.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-6">
          <TransactionForm
            key={`${open}-${currency}`}
            defaultValues={defaultValues}
            submitLabel={t("transaction.add")}
            onSubmit={addTransaction}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
