import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { AppLoadingSkeleton } from "@/components/loading/page-skeletons";

import { BottomNav } from "@/components/navigation/bottom-nav";
import { FloatingAddButton } from "@/components/navigation/floating-add-button";
import { Navbar } from "@/components/navigation/navbar";
import { Sidebar } from "@/components/navigation/sidebar";
import { QuickAddProvider } from "@/components/transactions/quick-add-modal";
import { FinanceProvider } from "@/context/finance-context";
import { UserProvider, type AppUser } from "@/context/user-context";
import { getFinanceData } from "@/lib/supabase/finance";
import { createClient } from "@/lib/supabase/server";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AppLoadingSkeleton />}>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </Suspense>
  );
}

async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login");

  const finance = await getFinanceData(supabase);
  const user: AppUser = {
    name: data.user.user_metadata?.full_name as string | undefined,
    email: data.user.email ?? "",
    avatarUrl: data.user.user_metadata?.avatar_url as string | undefined,
  };

  return (
    <UserProvider user={user}>
      <FinanceProvider initialTransactions={finance.transactions} categories={finance.categories}>
        <QuickAddProvider>
          <Sidebar />
          <Navbar />
          <main className="min-h-screen px-4 pb-28 pt-24 sm:px-6 md:ml-60 md:pb-12 md:pt-24 lg:px-8">
            {children}
          </main>
          <FloatingAddButton />
          <BottomNav />
        </QuickAddProvider>
      </FinanceProvider>
    </UserProvider>
  );
}
