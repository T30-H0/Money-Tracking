"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/language-context";

function LoadingStatus() {
  const { t } = useLanguage();
  return (
    <span className="sr-only" role="status" aria-live="polite">
      {t("common.loading")}
    </span>
  );
}

function PageHeaderSkeleton() {
  return (
    <header className="space-y-2">
      <Skeleton className="h-8 w-52 sm:w-64" />
      <Skeleton className="h-4 w-full max-w-sm" />
    </header>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6" aria-busy="true">
      <LoadingStatus />
      <PageHeaderSkeleton />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-5 pt-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-36" />
                </div>
                <Skeleton className="size-10 rounded-xl" />
              </div>
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
        <Card>
          <CardHeader className="space-y-2 p-5 pb-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-3 w-52" />
          </CardHeader>
          <CardContent className="p-5">
            <Skeleton className="h-72 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-5 pb-2">
            <Skeleton className="h-6 w-44" />
          </CardHeader>
          <CardContent className="space-y-1 px-5 pb-5">
            {Array.from({ length: 5 }, (_, index) => (
              <TransactionRowSkeleton key={index} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function TransactionsLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6" aria-busy="true">
      <LoadingStatus />
      <PageHeaderSkeleton />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-28 shrink-0 rounded-full" />
        ))}
      </div>
      <Card>
        <CardContent className="grid grid-cols-3 gap-3 p-5 pt-5">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-24 max-w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-1 px-5 py-3">
          {Array.from({ length: 6 }, (_, index) => (
            <TransactionRowSkeleton key={index} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function TransactionDetailLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6" aria-busy="true">
      <LoadingStatus />
      <Skeleton className="h-9 w-44" />
      <PageHeaderSkeleton />
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col items-center space-y-4 border-b px-6 py-10">
            <Skeleton className="size-16 rounded-2xl" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-5 px-5 py-5 sm:px-6">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6" aria-busy="true">
      <LoadingStatus />
      <PageHeaderSkeleton />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-3 w-full max-w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <Skeleton className="size-10 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-36 max-w-full" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function AppLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background" aria-busy="true">
      <aside className="fixed inset-y-0 left-0 hidden w-60 space-y-8 border-r bg-card p-6 md:block" aria-hidden="true">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-10 w-full" />)}
        </div>
      </aside>
      <div className="fixed inset-x-0 top-0 flex h-20 items-center justify-between border-b bg-card px-4 sm:px-6 md:left-60" aria-hidden="true">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="size-9 rounded-full" />
      </div>
      <main className="min-h-screen px-4 pb-28 pt-24 sm:px-6 md:ml-60 md:pb-12 lg:px-8">
        <DashboardLoadingSkeleton />
      </main>
      <div className="fixed inset-x-0 bottom-0 flex h-20 items-center justify-around border-t bg-card md:hidden" aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-10 w-16" />)}
      </div>
    </div>
  );
}
