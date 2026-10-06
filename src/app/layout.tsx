import "./globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/context/language-context";
import { getServerTranslator } from "@/i18n/server";
import { APP_NAME } from "@/i18n/config";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();
  return {
    title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
    description: t("meta.app.description"),
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { locale } = await getServerTranslator();
  return (
    <html lang={locale} className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
