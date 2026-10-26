"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { enUS, vi } from "react-day-picker/locale";

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
import { CategoryPicker } from "@/components/transactions/category-picker";
import { useFinance } from "@/context/finance-context";
import { fromLocalDateString, toLocalDateString } from "@/lib/date";
import {
  transactionSchema,
  type TransactionInput,
} from "@/schemas/transaction";
import type { Transaction, TransactionActionResult } from "@/types/finance";
import { formatAmountInput } from "@/utils/currency";
import { useLanguage } from "@/context/language-context";
import type { MessageKey } from "@/i18n/messages";

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
  pendingLabel,
  onSubmit,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const { categories } = useFinance();
  const { locale, intlLocale, t } = useLanguage();
  const [serverError, setServerError] = useState<MessageKey | null>(null);
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
  const selectedDate = useWatch({ control, name: "date" });
  const filteredCategories = categories.filter(
    (category) => category.type === type,
  );

  const submit = handleSubmit(async (values) => {
    setServerError(null);
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
              <TabsTrigger value="expense">
                {t("transaction.type.expense")}
              </TabsTrigger>
              <TabsTrigger value="income">
                {t("transaction.type.income")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      />

      <div className="space-y-2">
        <Label htmlFor="transaction-amount">
          {t("transaction.amount", { currency: defaultValues.currency })}
        </Label>
        <Controller
          control={control}
          name="displayAmount"
          render={({ field }) => (
            <Input
              {...field}
              id="transaction-amount"
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
            {t(errors.displayAmount.message as MessageKey)}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="transaction-category">{t("transaction.category")}</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <CategoryPicker
              categories={filteredCategories}
              type={type}
              value={field.value}
              onChange={(value) => setValue("categoryId", value, { shouldValidate: true, shouldDirty: true })}
              onBlur={field.onBlur}
              triggerRef={field.ref}
              invalid={Boolean(errors.categoryId)}
            />
          )}
        />
        {errors.categoryId ? (
          <p className="text-xs text-destructive">
            {t(errors.categoryId.message as MessageKey)}
          </p>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t("transaction.date")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full justify-start font-normal"
              >
                <CalendarIcon className="size-4 text-muted-foreground" />
                {fromLocalDateString(selectedDate).toLocaleDateString(
                  intlLocale,
                  { dateStyle: "medium" },
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto">
              <Calendar
                locale={locale === "vi" ? vi : enUS}
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
            {t("transaction.note")}{" "}
            <span className="font-normal text-muted-foreground">
              {t("transaction.optional")}
            </span>
          </Label>
          <Textarea
            id="transaction-note"
            placeholder={t("transaction.notePlaceholder")}
            maxLength={160}
            {...register("note")}
            className="h-20 text-base sm:text-sm"
          />
        </div>
      </div>

      {serverError ? (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {t(serverError)}
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
            {t("transaction.cancel")}
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting} className="min-w-28">
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : null}
          {isSubmitting
            ? (pendingLabel ?? t("transaction.saving"))
            : submitLabel}
        </Button>
      </div>
    </form>
  );
}
