import { ArrowLeftRight, LayoutDashboard, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { MessageKey } from "@/i18n/messages";

export interface NavigationItem {
  href: string;
  labelKey: MessageKey;
  icon: LucideIcon;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/transactions", labelKey: "nav.transactions", icon: ArrowLeftRight },
  { href: "/settings", labelKey: "nav.settings", icon: Settings },
];

export function isNavigationItemActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
