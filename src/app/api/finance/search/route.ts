import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { searchTransactions } from "@/lib/supabase/finance";

export async function GET(request: Request) {
  const headers = { "Cache-Control": "private, no-store" };
  const params = new URL(request.url).searchParams;
  const query = params.get("q")?.trim() ?? "";
  const categoryIds = params.getAll("category");
  if (!query || query.length > 200 || categoryIds.length > 100 || categoryIds.some((id) => !z.uuid().safeParse(id).success)) {
    return Response.json({ error: "Invalid search" }, { status: 400, headers });
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return Response.json({ error: "Unauthorized" }, { status: 401, headers });
    const transactions = await searchTransactions(supabase, data.user.id, query, categoryIds);
    return Response.json({ transactions }, { headers });
  } catch {
    return Response.json({ error: "Could not search" }, { status: 500, headers });
  }
}
