"use client";

import { navItems } from "@/constants/sidebar.constant";
import { createClient } from "@/lib/supabase/client";
import { signInWithGoogle, signOut } from "@/lib/supabase/actions";
import { isActiveHref } from "@/utils/sidebar";
import CurrencyDollarIcon from "@heroicons/react/24/solid/esm/CurrencyDollarIcon";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const isCollapsed = !isHovered;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

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

      <div className="border-t border-gray-200 p-4">
        {user ? (
          <div className="flex items-center gap-3">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className="size-9 rounded-full flex-shrink-0 object-cover"
              />
            ) : (
              <div className="size-9 rounded-full bg-gray-200 flex-shrink-0 grid place-items-center text-sm font-semibold text-gray-600">
                {user.email?.[0]?.toUpperCase()}
              </div>
            )}
            <div
              className={`flex flex-1 flex-col min-w-0 transition-opacity ${
                isCollapsed ? "opacity-0 duration-200" : "opacity-100 duration-300"
              }`}
            >
              <span className="text-sm font-medium text-gray-900 truncate">
                {user.user_metadata?.full_name ?? user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors text-left"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        ) : (
          <form action={signInWithGoogle}>
            <button
              type="submit"
              title={isCollapsed ? "Sign in with Google" : undefined}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                <GoogleIcon />
              </span>
              <span
                className={`whitespace-nowrap transition-opacity ${
                  isCollapsed ? "opacity-0 duration-200" : "opacity-100 duration-300"
                }`}
              >
                Sign in with Google
              </span>
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
