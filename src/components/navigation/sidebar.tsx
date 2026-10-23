"use client";

import { WalletCards } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { APP_NAME } from "@/i18n/config";
import { NavigationLinkContent } from "@/components/navigation/navigation-link-content";
import {
  NAVIGATION_ITEMS,
  isNavigationItemActive,
} from "@/components/navigation/navigation-items";

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
        {NAVIGATION_ITEMS.map((item) => {
          const active = isNavigationItemActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block h-11 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <NavigationLinkContent
                icon={item.icon}
                label={t(item.labelKey)}
                active={active}
                variant="sidebar"
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
