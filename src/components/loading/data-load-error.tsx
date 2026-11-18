"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function DataLoadError({ retry }: { retry: () => void }) {
  const { t } = useLanguage();
  return <div role="alert" className="space-y-3 rounded-xl border p-5 text-sm">
    <p>{t("error.serverUnavailable")}</p>
    <Button variant="outline" onClick={retry}>{t("common.retry")}</Button>
  </div>;
}
