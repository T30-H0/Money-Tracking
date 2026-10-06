"use client";

import { ArrowLeftRight, LayoutDashboard, Settings, WalletCards } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { APP_NAME } from "@/i18n/config";

const items = [
  { href: "/", labelKey: "nav.dashboard" as const, icon: LayoutDashboard },
  { href: "/transactions", labelKey: "nav.transactions" as const, icon: ArrowLeftRight },
  { href: "/settings", labelKey: "nav.settings" as const, icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r bg-card md:flex md:flex-col">
      <Link
        href="/"
        className="flex h-16 shrink-0 items-center gap-2.5 border-b px-5 font-semibold tracking-tight"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
          <WalletCards className="size-5" />
        </span>
        {APP_NAME}
      </Link>
      <nav className="space-y-1 p-3" aria-label={t("nav.primary")}>
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                active && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
              )}
            >
              <Icon className="size-5" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
