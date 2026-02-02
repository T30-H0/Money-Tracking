import LoginForm from "@/app/login/components/login-form";
import LoginHero from "@/app/login/components/login-hero";
import React from "react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      <LoginHero />
      <LoginForm />
    </div>
  );
}
