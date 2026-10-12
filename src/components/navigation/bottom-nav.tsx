"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/context/language-context";
import { NavigationLinkContent } from "@/components/navigation/navigation-link-content";
import { NAVIGATION_ITEMS, isNavigationItemActive } from "@/components/navigation/navigation-items";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 h-20 border-t bg-background/95 px-5 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label={t("nav.primary")}>
      <div className="mx-auto grid h-full max-w-sm grid-cols-3 items-center">
        {NAVIGATION_ITEMS.map((item) => {
          const active = isNavigationItemActive(pathname, item.href);
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className="h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <NavigationLinkContent
                icon={item.icon}
                label={t(item.labelKey)}
                active={active}
                variant="bottom"
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
