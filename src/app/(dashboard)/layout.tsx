import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { BottomNav } from "@/components/navigation/bottom-nav";
import { FloatingAddButton } from "@/components/navigation/floating-add-button";
import { Navbar } from "@/components/navigation/navbar";
import { Sidebar } from "@/components/navigation/sidebar";
import { QuickAddProvider } from "@/components/transactions/quick-add-modal";
import { FinanceProvider } from "@/context/finance-context";
import { getFinanceData } from "@/lib/supabase/finance";
import { createClient } from "@/lib/supabase/server";
import { getServerTranslator } from "@/i18n/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { t } = await getServerTranslator();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login");

  const finance = await getFinanceData(supabase);
  const name = data.user.user_metadata?.full_name ?? data.user.email ?? t("account.fallbackName");
  const avatarUrl = data.user.user_metadata?.avatar_url as string | undefined;

  return (
    <FinanceProvider initialTransactions={finance.transactions} categories={finance.categories}>
      <QuickAddProvider>
        <Sidebar />
        <Navbar name={name} email={data.user.email ?? ""} avatarUrl={avatarUrl} />
        <main className="min-h-screen px-4 pb-28 pt-24 sm:px-6 md:ml-60 md:pb-12 md:pt-24 lg:px-8">
          {children}
        </main>
        <FloatingAddButton />
        <BottomNav />
      </QuickAddProvider>
    </FinanceProvider>
  );
}
