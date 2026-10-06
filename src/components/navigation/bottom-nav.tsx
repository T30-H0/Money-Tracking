"use client";

import { ArrowLeftRight, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

const items = [
  { href: "/", labelKey: "nav.dashboard" as const, icon: LayoutDashboard },
  { href: "/transactions", labelKey: "nav.transactions" as const, icon: ArrowLeftRight },
  { href: "/settings", labelKey: "nav.settings" as const, icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 h-20 border-t bg-background/95 px-5 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label={t("nav.primary")}>
      <div className="mx-auto grid h-full max-w-sm grid-cols-3 items-center">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground", active && "text-primary")}>
              <Icon className="size-5" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
