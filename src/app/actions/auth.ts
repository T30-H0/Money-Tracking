"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function safeNext(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "/";
  try {
    const candidate = new URL(value, "http://internal.local");
    return candidate.origin === "http://internal.local"
      ? `${candidate.pathname}${candidate.search}${candidate.hash}`
      : "/";
  } catch {
    return "/";
  }
}

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const next = safeNext(formData.get("next"));

  if (!origin) redirect("/login?error=origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
