"use client";

import { useCallback, useEffect, useState } from "react";
import { useFinance } from "@/context/finance-context";
import type { FinanceResource } from "@/lib/finance-resources";

export function useFinanceData(resources: FinanceResource[]) {
  const { loadResource, loadedResources } = useFinance();
  const key = [...new Set(resources)].sort().join(",");
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const ready = resources.every((resource) => loadedResources.includes(resource));

  useEffect(() => {
    let active = true;
    if (!key) return;
    Promise.all(key.split(",").map((resource) => loadResource(resource as FinanceResource)))
      .catch(() => { if (active) setFailedKey(key); });
    return () => { active = false; };
  }, [key, loadResource, attempt]);

  const retry = useCallback(() => {
    setFailedKey(null);
    setAttempt((value) => value + 1);
  }, []);
  return { ready, error: !ready && failedKey === key, retry };
}
