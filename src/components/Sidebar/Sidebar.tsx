"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/home" },
  { label: "Posts", href: "/posts" },
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
];

const isActiveHref = (pathname: string, href: string): boolean => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white px-4 py-5">
      <Link
        href="/home"
        className="mb-6 flex items-center gap-2 px-2 border-b border-gray-200 pb-4"
      >
        <div className="grid size-9 place-items-center rounded-lg bg-gray-900 text-sm font-semibold text-white">
          MT
        </div>
        <div className="text-sm font-semibold text-gray-900">
          Money Tracking
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-4">
        {navItems.map((item) => {
          const active = isActiveHref(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 text-xs text-gray-400">v1.0.0</div>
    </aside>
  );
};
