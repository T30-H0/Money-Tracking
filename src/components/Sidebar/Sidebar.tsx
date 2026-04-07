"use client";

import { navItems } from "@/constants/sidebar.constant";
import { isActiveHref } from "@/utils/sidebar";
import CurrencyDollarIcon from "@heroicons/react/24/solid/esm/CurrencyDollarIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-5">
        <Link
          href="/home"
          className={`flex items-center gap-2 px-2 border-b border-gray-200 pb-4 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="grid size-9 place-items-center rounded-lg bg-gray-900 text-sm font-semibold text-white flex-shrink-0">
            <CurrencyDollarIcon />
          </div>
          {!isCollapsed && (
            <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
              Money Tracking
            </div>
          )}
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-4 px-4 py-4">
        {navItems.map((item) => {
          const active = isActiveHref(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isCollapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none"
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? "→" : "←"}
      </button>
    </aside>
  );
};
