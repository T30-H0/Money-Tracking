import Link from "next/link";
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
  href?: string;
  children: ReactNode;
  className?: string;
}

// Shared styling for both action elements (the link's <span> and the <Button>).
const actionBase =
  "mt-7 h-auto w-full rounded-full border border-white/20 bg-transparent py-3 text-sm text-white";

export function OverviewCard({
  icon,
  title,
  actionLabel,
  withChevron = false,
  onAction,
  href,
  children,
  className,
}: OverviewCardProps) {
  const actionContent = (
    <>
      {actionLabel}
      {withChevron ? <span aria-hidden="true">›</span> : null}
    </>
  );

  const card = (
    <Card
      className={cn(
        "flex h-full flex-col rounded-3xl border-white/5 bg-gradient-to-b from-slate-700 to-slate-900 p-6 text-slate-100 transition-all duration-300 ease-out sm:p-7",
        href &&
          "group cursor-pointer shadow-lg hover:scale-[1.02] hover:shadow-[0_24px_60px_-12px_rgba(16,185,129,0.55)]",
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

      {href ? (
        <span
          className={cn(
            actionBase,
            "inline-flex items-center justify-center transition-colors group-hover:border-emerald-300/60 group-hover:bg-white/5 group-hover:text-emerald-200",
          )}
        >
          {actionContent}
        </span>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={onAction}
          className={cn(
            actionBase,
            "hover:border-emerald-300/60 hover:bg-white/5 hover:text-emerald-200 focus-visible:ring-emerald-300/60",
          )}
        >
          {actionContent}
        </Button>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${title} – ${actionLabel}`}
        className="block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        {card}
      </Link>
    );
  }

  return card;
}
