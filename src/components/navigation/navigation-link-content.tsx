"use client";

import { type LucideIcon } from "lucide-react";
import { useLinkStatus } from "next/link";

import { cn } from "@/lib/utils";

export function NavigationLinkContent({
  icon: Icon,
  label,
  active,
  variant,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  variant: "sidebar" | "bottom";
}) {
  const { pending } = useLinkStatus();
  const selected = active || pending;

  return (
    <span
      data-pending={pending || undefined}
      className={cn(
        "transition-colors",
        variant === "sidebar" &&
          "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
        variant === "bottom" &&
          "flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground",
        selected &&
          variant === "sidebar" &&
          "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
        selected && variant === "bottom" && "text-primary",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
