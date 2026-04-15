import "./globals.css";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-gray-50 text-gray-900">
        <div className="flex">
          <Sidebar />
          <main className="min-h-screen flex-1 pl-48 p-24">{children}</main>
        </div>
      </body>
    </html>
  );
}
