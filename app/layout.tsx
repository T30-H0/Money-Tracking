import "./globals.css";

import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-red-gray">
        <main className="mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
