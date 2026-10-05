"use client";

import { Plus } from "lucide-react";

import { useQuickAdd } from "@/components/transactions/quick-add-modal";
import { Button } from "@/components/ui/button";

export function FloatingAddButton() {
  const { openQuickAdd } = useQuickAdd();

  return (
    <Button
      type="button"
      size="icon-lg"
      onClick={openQuickAdd}
      aria-label="Add transaction"
      title="Add transaction"
      className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 z-40 size-14 rounded-full shadow-xl md:bottom-6 md:right-6"
    >
      <Plus className="size-6" />
    </Button>
  );
}
