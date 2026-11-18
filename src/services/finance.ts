import type { FinanceResource } from "@/lib/finance-resources";
import type { Category, Transaction } from "@/types/finance";

export interface FinanceResourceData {
  categories?: Category[];
  transactions?: Transaction[];
}

export async function fetchFinanceResource(resource: FinanceResource): Promise<FinanceResourceData> {
  const response = await fetch(`/api/finance?resource=${encodeURIComponent(resource)}`, { cache: "no-store" });
  if (!response.ok || response.redirected) throw new Error("Could not load finance data");
  return response.json();
}
