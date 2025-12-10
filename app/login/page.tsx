import LoginForm from "@/app/login/components/login-form";
import React from "react";

export default function LoginPage() {
  return (
    <div className="flex h-full w-full">
      <div className="flex bg-blue-500 h-full w-1/2 justify-center items-center">
        <h1>Logo</h1>
      </div>
      <div className="flex h-full w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}
