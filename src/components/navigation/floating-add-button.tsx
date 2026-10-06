"use client";

import { Plus } from "lucide-react";

import { useQuickAdd } from "@/components/transactions/quick-add-modal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function FloatingAddButton() {
  const { openQuickAdd } = useQuickAdd();
  const { t } = useLanguage();

  return (
    <Button
      type="button"
      size="icon-lg"
      onClick={openQuickAdd}
      aria-label={t("transaction.add")}
      title={t("transaction.add")}
      className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 z-40 size-14 rounded-full shadow-xl md:bottom-6 md:right-6"
    >
      <Plus className="size-6" />
    </Button>
  );
}
