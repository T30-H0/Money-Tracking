"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tooltip } from "radix-ui";
import { Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useFinance } from "@/context/finance-context";
import { useLanguage } from "@/context/language-context";
import { getCategoryName } from "@/i18n/categories";
import { transactionsHref, type DashboardData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import type { CategoryColor } from "@/types/finance";

// Color is tied to category metadata, never its rank in the selected month.
const COLORS: Record<CategoryColor, { fill: string; dot: string }> = {
  amber: { fill: "fill-amber-400", dot: "bg-amber-400" },
  blue: { fill: "fill-blue-400", dot: "bg-blue-400" },
  cyan: { fill: "fill-cyan-500", dot: "bg-cyan-500" },
  violet: { fill: "fill-violet-400", dot: "bg-violet-400" },
  rose: { fill: "fill-rose-400", dot: "bg-rose-400" },
  pink: { fill: "fill-pink-400", dot: "bg-pink-400" },
  slate: { fill: "fill-slate-400", dot: "bg-slate-400" },
  emerald: { fill: "fill-emerald-600", dot: "bg-emerald-600" },
  indigo: { fill: "fill-indigo-400", dot: "bg-indigo-400" },
  teal: { fill: "fill-teal-500", dot: "bg-teal-500" },
};

export function CategoryChart({ data, month }: { data: DashboardData; month: string }) {
  const { categories, format } = useFinance();
  const { t, intlLocale } = useLanguage();
  const router = useRouter();
  const groups = data.groups.map((group) => {
    const category = categories.find((item) => item.id === group.categoryId);
    const name = category ? getCategoryName(category, t) : t("dashboard.unknownCategory");
    const percent = Intl.NumberFormat(intlLocale, { style: "percent", maximumFractionDigits: 1 }).format(group.share);
    const count = t("dashboard.count", { count: group.count });
    return { ...group, name, percent, countLabel: count, colors: COLORS[category?.color ?? "slate"],
      href: transactionsHref({ month, type: "expense", category: group.categoryId }),
      description: `${name} · ${percent} · ${format(group.amount)} · ${count}`,
    };
  });
  return (
    <Card className="flex min-w-0 flex-col shadow-none">
      <CardHeader className="p-5 pb-0"><CardTitle className="text-base">{t("dashboard.categories")}</CardTitle></CardHeader>
      <CardContent className="flex flex-1 items-center justify-center p-4 sm:p-5">
        {data.summary.expense > 0 ? <Tooltip.Provider delayDuration={0}>
          <div className="flex flex-col items-center gap-2 min-[390px]:flex-row">
            <div className="relative w-32 shrink-0 sm:w-48 xl:w-44">
              <ChartContainer config={{ amount: { label: t("dashboard.spending") } }} className="aspect-square h-32 w-full sm:h-48 xl:h-44">
                <PieChart role="group" aria-label={t("dashboard.categories")}>
                  <Pie data={groups} dataKey="amount" nameKey="name" innerRadius="65%" outerRadius="85%" paddingAngle={groups.length > 1 ? 2 : 0}
                    startAngle={90} endAngle={-270} isAnimationActive={false}
                    activeIndex={groups.map((_, index) => index)}
                    activeShape={(props: unknown) => {
                      const sector = props as PieSectorDataItem & { payload: (typeof groups)[number] };
                      const group = sector.payload;
                      return <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <g role="link" tabIndex={0} aria-label={group.description}
                            className={cn("cursor-pointer outline-none focus-visible:stroke-foreground focus-visible:stroke-[3px]", group.colors.fill)}
                            onClick={() => router.push(group.href)}
                            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); router.push(group.href); } }}>
                            <Sector cx={sector.cx} cy={sector.cy} innerRadius={sector.innerRadius} outerRadius={sector.outerRadius} startAngle={sector.startAngle} endAngle={sector.endAngle} className="fill-inherit" />
                          </g>
                        </Tooltip.Trigger>
                        <Tooltip.Portal><Tooltip.Content sideOffset={8} className="z-50 max-w-64 rounded-lg bg-foreground px-3 py-2 text-xs text-background shadow-lg">{group.description}</Tooltip.Content></Tooltip.Portal>
                      </Tooltip.Root>;
                    }} />
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 px-5 text-center sm:px-8">
                <span className="text-[10px] text-muted-foreground">{t("dashboard.spending")}</span>
                <strong className="max-w-full break-words text-sm font-semibold tabular-nums sm:text-base">{format(data.summary.expense, { notation: "compact", maximumFractionDigits: 1 })}</strong>
                <span className="text-[10px] text-muted-foreground">{month}</span>
              </div>
            </div>
            <div className="grid w-full min-w-0 gap-1">
              {groups.map((group) => <Tooltip.Root key={group.categoryId}>
                <Tooltip.Trigger asChild>
                  <Button asChild variant="ghost" className="h-auto w-full justify-start gap-2 whitespace-normal px-2 py-2 text-left">
                    <Link href={group.href} aria-label={group.description}>
                      <span className={cn("size-2 shrink-0 rounded-full", group.colors.dot)} />
                      <span className="min-w-0 flex-1"><span className="block truncate text-xs">{group.name}</span><span className="mt-1 block text-[10px] font-normal text-muted-foreground">{group.countLabel}</span></span>
                      <span className="text-right text-xs tabular-nums">{group.percent}<span className="mt-1 block text-[10px] font-normal text-muted-foreground">{format(group.amount)}</span></span>
                    </Link>
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal><Tooltip.Content sideOffset={4} className="z-50 max-w-64 rounded-lg bg-foreground px-3 py-2 text-xs text-background shadow-lg">{group.description}</Tooltip.Content></Tooltip.Portal>
              </Tooltip.Root>)}
            </div>
          </div>
        </Tooltip.Provider> : <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">{t("dashboard.noSpending")}</p>
        </div>}
      </CardContent>
      <p className="border-t px-4 py-3 text-center text-xs text-muted-foreground">{t("dashboard.categoryHint")}</p>
    </Card>
  );
}
