import { LogIn, WalletCards } from "lucide-react";
import type { Metadata } from "next";

import { signInWithGoogle } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerTranslator } from "@/i18n/server";
import { APP_NAME } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();
  return { title: t("meta.login") };
}

function safeNext(value: string | undefined) {
  if (!value) return "/";
  try {
    const candidate = new URL(value, "http://internal.local");
    return candidate.origin === "http://internal.local"
      ? `${candidate.pathname}${candidate.search}${candidate.hash}`
      : "/";
  } catch {
    return "/";
  }
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  const { t } = await getServerTranslator();
  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-7 flex items-center justify-center gap-2.5 font-semibold tracking-tight">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><WalletCards className="size-5" /></span>
          {APP_NAME}
        </div>
        <Card className="shadow-lg shadow-slate-900/5">
          <CardHeader className="text-center">
            <CardTitle>{t("login.welcome")}</CardTitle>
            <CardDescription>{t("login.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signInWithGoogle}>
              <input type="hidden" name="next" value={next} />
              <Button type="submit" variant="outline" className="h-11 w-full"><LogIn className="size-4" />{t("login.google")}</Button>
            </form>
            <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">{t("login.security")}</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
