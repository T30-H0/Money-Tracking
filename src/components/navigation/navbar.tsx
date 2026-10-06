"use client";

import { LogOut, Settings, WalletCards } from "lucide-react";
import Link from "next/link";

import { signOut } from "@/app/actions/auth";
import { CurrencySelector } from "@/components/finance/CurrencySelector";
import { TransactionSearch } from "@/components/navigation/transaction-search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFinance } from "@/context/finance-context";
import { useLanguage } from "@/context/language-context";
import { APP_NAME } from "@/i18n/config";

interface NavbarProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

export function Navbar(props: NavbarProps) {
  const { currency, currencies, setCurrency } = useFinance();

  return (
    <header className="fixed inset-x-0 top-0 z-30 h-16 border-b bg-background/95 backdrop-blur md:left-60">
      <div className="flex h-full items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mr-auto flex min-w-0 items-center gap-2 font-semibold tracking-tight md:hidden"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <WalletCards className="size-5" />
          </span>
          <span className="hidden truncate min-[430px]:inline">
            {APP_NAME}
          </span>
        </Link>
        <TransactionSearch />
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <CurrencySelector
            currency={currency}
            currencies={currencies}
            onChange={setCurrency}
          />
          <AccountMenu {...props} />
        </div>
      </div>
    </header>
  );
}

function AccountMenu({ name, email, avatarUrl }: NavbarProps) {
  const { t } = useLanguage();
  const initials = (name || email)
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="rounded-full"
          aria-label={t("account.openMenu")}
        >
          <Avatar>
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="max-w-56">
          <span className="block truncate">{name}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="size-4" />
            {t("account.settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOut}>
          <DropdownMenuItem asChild>
            <Button
              type="submit"
              variant="ghost"
              className="h-auto w-full justify-start px-2 py-2 font-normal"
            >
              <LogOut className="size-4" />
              {t("account.signOut")}
            </Button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
