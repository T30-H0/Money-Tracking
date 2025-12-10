import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex h-screen bg-white">{children}</div>;
}
