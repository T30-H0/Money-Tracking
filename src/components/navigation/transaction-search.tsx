"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { CATEGORY_ICONS, CATEGORY_STYLES } from "@/constants/category.constants";
import { useFinance } from "@/context/finance-context";
import { fromLocalDateString } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Category, Transaction } from "@/types/finance";

const MAX_RESULTS = 8;

export function TransactionSearch() {
  const { transactions, categories, format } = useFinance();
  const router = useRouter();
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return [];
    return transactions
      .filter((transaction) => {
        const category = categoryById.get(transaction.categoryId);
        return (
          transaction.note.toLocaleLowerCase().includes(normalized) ||
          category?.name.toLocaleLowerCase().includes(normalized)
        );
      })
      .slice(0, MAX_RESULTS);
  }, [categoryById, query, transactions]);

  const closeSearch = () => {
    setDesktopOpen(false);
    setMobileOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (window.matchMedia("(min-width: 768px)").matches) {
          setDesktopOpen(true);
          desktopInputRef.current?.focus();
        } else {
          setMobileOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectResult = (transaction: Transaction) => {
    closeSearch();
    router.push(`/transactions/${transaction.id}`);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setDesktopOpen(false);
      setMobileOpen(false);
      return;
    }
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (current) => (current - 1 + results.length) % results.length,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectResult(results[activeIndex] ?? results[0]);
    }
  };

  const sharedInputProps = {
    value: query,
    onKeyDown: handleInputKeyDown,
    placeholder: "Search transactions",
    role: "combobox",
    "aria-autocomplete": "list" as const,
    "aria-expanded": desktopOpen || mobileOpen,
    "aria-controls": "transaction-search-results",
    "aria-activedescendant": results[activeIndex]
      ? `transaction-search-${results[activeIndex].id}`
      : undefined,
  };

  return (
    <>
      <div className="mx-auto hidden w-full max-w-md md:block">
        <Popover open={desktopOpen} onOpenChange={setDesktopOpen}>
          <PopoverAnchor asChild>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...sharedInputProps}
                ref={desktopInputRef}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                  setDesktopOpen(true);
                }}
                onFocus={() => setDesktopOpen(true)}
                className="h-10 bg-muted/60 pl-9 pr-14"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </PopoverAnchor>
          <PopoverContent
            align="start"
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="w-[var(--radix-popover-anchor-width)] overflow-hidden"
          >
            <SearchResults
              query={query}
              results={results}
              categoryById={categoryById}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
              onSelect={closeSearch}
              format={format}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        className="md:hidden"
        aria-label="Search transactions"
        onClick={() => setMobileOpen(true)}
      >
        <Search className="size-5" />
      </Button>
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Search transactions</DialogTitle>
            <DialogDescription>
              Search by transaction note or category.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...sharedInputProps}
                autoFocus
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }
                }
                className="h-11 pl-9"
              />
            </div>
            <SearchResults
              query={query}
              results={results}
              categoryById={categoryById}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
              onSelect={closeSearch}
              format={format}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SearchResults({
  query,
  results,
  categoryById,
  activeIndex,
  onActiveIndexChange,
  onSelect,
  format,
}: {
  query: string;
  results: Transaction[];
  categoryById: Map<string, Category>;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: () => void;
  format: (amount: number) => string;
}) {
  if (!query.trim()) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        Type a note or category to start searching.
      </p>
    );
  }

  if (!results.length) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        No transactions match “{query.trim()}”.
      </p>
    );
  }

  return (
    <div
      id="transaction-search-results"
      role="listbox"
      aria-label="Transaction search results"
      className="max-h-80 overflow-y-auto p-1"
    >
      {results.map((transaction, index) => {
        const category = categoryById.get(transaction.categoryId);
        if (!category) return null;
        const Icon = CATEGORY_ICONS[category.icon];
        const isIncome = transaction.type === "income";
        return (
          <Link
            key={transaction.id}
            id={`transaction-search-${transaction.id}`}
            role="option"
            aria-selected={index === activeIndex}
            href={`/transactions/${transaction.id}`}
            onMouseEnter={() => onActiveIndexChange(index)}
            onClick={onSelect}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors",
              index === activeIndex && "bg-muted",
            )}
          >
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-lg",
                CATEGORY_STYLES[category.color],
              )}
              aria-hidden="true"
            >
              <Icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {transaction.note || category.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {category.name} ·{" "}
                {fromLocalDateString(transaction.date).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric", year: "numeric" },
                )}
              </span>
            </span>
            <span
              className={cn(
                "shrink-0 text-sm font-semibold tabular-nums",
                isIncome ? "text-emerald-600" : "text-foreground",
              )}
            >
              {isIncome ? "+" : "−"}
              {format(transaction.amount)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
