import { resourceDateRange } from "@/lib/finance-resources";
import { getCategories, getTransactionsInRange } from "@/lib/supabase/finance";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const headers = { "Cache-Control": "private, no-store" };
  const resource = new URL(request.url).searchParams.get("resource") ?? "";
  const range = resourceDateRange(resource);
  if (resource !== "categories" && !range) return Response.json({ error: "Invalid resource" }, { status: 400, headers });
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return Response.json({ error: "Unauthorized" }, { status: 401, headers });
    const result = range
      ? { transactions: await getTransactionsInRange(supabase, data.user.id, range.start, range.end) }
      : { categories: await getCategories(supabase) };
    return Response.json(result, { headers });
  } catch {
    return Response.json({ error: "Could not load data" }, { status: 500, headers });
  }
}
