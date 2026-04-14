"use client";

import { navItems } from "@/constants/sidebar.constant";
import { isActiveHref } from "@/utils/sidebar";
import CurrencyDollarIcon from "@heroicons/react/24/solid/esm/CurrencyDollarIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const isCollapsed = !isHovered;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden border-r border-gray-200 bg-white ${
        isCollapsed
          ? "w-20 transition-all duration-500"
          : "w-64 shadow-lg transition-all duration-300"
      }`}
    >
      <Link
        href="/home"
        className="flex items-center px-2 border-b border-gray-200 pb-5"
      >
        <div className="pt-5 px-4 inline-flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-gray-900 text-sm font-semibold text-white flex-shrink-0">
            <CurrencyDollarIcon />
          </div>
          <span
            className={`text-sm font-semibold text-gray-900 whitespace-nowrap transition-opacity ${
              isCollapsed
                ? "opacity-0 duration-200"
                : "opacity-100 duration-300"
            }`}
          >
            Money Tracking
          </span>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-4 p-4">
        {navItems.map((item) => {
          const active = isActiveHref(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
              <span
                className={`whitespace-nowrap transition-opacity ${
                  isCollapsed
                    ? "opacity-0 duration-200"
                    : "opacity-100 duration-300"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
