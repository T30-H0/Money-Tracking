import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  icon: ReactNode;
  title: string;
  actionLabel: string;
  withChevron?: boolean;
  onAction?: () => void;
  children: ReactNode;
  className?: string;
}

export function OverviewCard({
  icon,
  title,
  actionLabel,
  withChevron = false,
  onAction,
  children,
  className,
}: OverviewCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col rounded-3xl border-white/5 bg-gradient-to-b from-slate-800 to-slate-900 p-6 text-slate-100 shadow-xl sm:p-7",
        className,
      )}
    >
      <span className="grid size-10 place-items-center rounded-full text-slate-200 ring-1 ring-white/15">
        {icon}
      </span>

      <h2 className="mt-5 text-xl font-semibold leading-snug text-white">
        {title}
      </h2>

      <div className="mt-5 flex flex-1 flex-col">{children}</div>

      <Button
        type="button"
        variant="outline"
        onClick={onAction}
        className="mt-7 h-auto w-full rounded-full border-white/20 bg-transparent py-3 text-sm text-white hover:border-emerald-300/60 hover:bg-white/5 hover:text-emerald-200 focus-visible:ring-emerald-300/60 dark:border-white/20 dark:bg-transparent dark:hover:bg-white/5"
      >
        {actionLabel}
        {withChevron ? <span aria-hidden="true">›</span> : null}
      </Button>
    </Card>
  );
}
