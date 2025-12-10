import type { Metadata } from "next";
import "./ui/globals.css";
import { geistMono, geistSans } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "Money Tracking",
  description: "Easily tracking your financial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
