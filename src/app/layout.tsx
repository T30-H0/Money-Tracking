import "./globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "Money Tracking", template: "%s · Money Tracking" },
  description: "A focused dashboard for tracking income and expenses.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
