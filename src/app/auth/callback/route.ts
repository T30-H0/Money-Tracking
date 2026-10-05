import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function safeNext(value: string | null, origin: string) {
  if (!value) return "/";
  try {
    const candidate = new URL(value, origin);
    return candidate.origin === origin
      ? `${candidate.pathname}${candidate.search}${candidate.hash}`
      : "/";
  } catch {
    return "/";
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"), origin);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(new URL(next, origin));
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
  }

  return NextResponse.redirect(new URL("/login?error=callback", origin));
}
