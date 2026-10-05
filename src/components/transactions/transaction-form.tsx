"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_ICONS, CATEGORY_STYLES } from "@/constants/category.constants";
import { useFinance } from "@/context/finance-context";
import { fromLocalDateString, toLocalDateString } from "@/lib/date";
import { cn } from "@/lib/utils";
import {
  transactionSchema,
  type TransactionInput,
} from "@/schemas/transaction";
import type { Transaction, TransactionActionResult } from "@/types/finance";
import { formatAmountInput } from "@/utils/currency";

interface TransactionFormProps {
  defaultValues: TransactionInput;
  submitLabel: string;
  pendingLabel?: string;
  onSubmit: (values: TransactionInput) => Promise<TransactionActionResult>;
  onSuccess?: (transaction: Transaction) => void;
  onCancel?: () => void;
}

export function TransactionForm({
  defaultValues,
  submitLabel,
  pendingLabel = "Saving",
  onSubmit,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const { categories } = useFinance();
  const [serverError, setServerError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  const type = useWatch({ control, name: "type" });
  const selectedCategory = useWatch({ control, name: "categoryId" });
  const selectedDate = useWatch({ control, name: "date" });
  const filteredCategories = categories.filter(
    (category) => category.type === type,
  );

  const submit = handleSubmit(async (values) => {
    setServerError("");
    const result = await onSubmit(values);
    if (!result.ok) {
      setServerError(result.message);
      return;
    }
    onSuccess?.(result.transaction);
  });

  return (
    <form onSubmit={submit} className="space-y-5">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Tabs
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              setValue("categoryId", "", { shouldValidate: true });
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">Expense</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      />

      <div className="space-y-2">
        <Label htmlFor="transaction-amount">
          Amount ({defaultValues.currency})
        </Label>
        <Controller
          control={control}
          name="displayAmount"
          render={({ field }) => (
            <Input
              {...field}
              id="transaction-amount"
              autoFocus
              inputMode="decimal"
              placeholder="0"
              aria-invalid={Boolean(errors.displayAmount)}
              className="h-14 text-2xl font-semibold tabular-nums"
              onChange={(event) =>
                field.onChange(formatAmountInput(event.target.value))
              }
            />
          )}
        />
        {errors.displayAmount ? (
          <p className="text-xs text-destructive">
            {errors.displayAmount.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {filteredCategories.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon];
            const selected = selectedCategory === category.id;
            return (
              <Button
                key={category.id}
                type="button"
                variant="outline"
                aria-pressed={selected}
                onClick={() =>
                  setValue("categoryId", category.id, {
                    shouldValidate: true,
                  })
                }
                className={cn(
                  "h-auto min-h-20 flex-col gap-2 whitespace-normal px-2 py-3 text-xs",
                  selected &&
                    "border-primary bg-primary/5 ring-2 ring-primary/15",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-lg",
                    CATEGORY_STYLES[category.color],
                  )}
                >
                  <Icon className="size-4" />
                </span>
                {category.name}
              </Button>
            );
          })}
        </div>
        {errors.categoryId ? (
          <p className="text-xs text-destructive">
            {errors.categoryId.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full justify-start font-normal"
              >
                <CalendarIcon className="size-4 text-muted-foreground" />
                {fromLocalDateString(selectedDate).toLocaleDateString(
                  undefined,
                  { dateStyle: "medium" },
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto">
              <Calendar
                mode="single"
                selected={fromLocalDateString(selectedDate)}
                onSelect={(date) =>
                  date &&
                  setValue("date", toLocalDateString(date), {
                    shouldValidate: true,
                  })
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transaction-note">
            Note{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Textarea
            id="transaction-note"
            placeholder="What was this for?"
            maxLength={160}
            {...register("note")}
            className="h-10 min-h-10"
          />
        </div>
      </div>

      {serverError ? (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting} className="min-w-28">
          {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {isSubmitting ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
