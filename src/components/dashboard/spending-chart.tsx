"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinance } from "@/context/finance-context";
import { buildTrendData, type TrendRange } from "@/lib/dashboard-data";
import { useLanguage } from "@/context/language-context";

export function SpendingChart({ month }: { month: string }) {
  const { transactions, format } = useFinance();
  const { intlLocale, t } = useLanguage();
  const [range, setRange] = useState<TrendRange>("month");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const data = useMemo(() => buildTrendData(transactions, month, range, intlLocale), [transactions, month, range, intlLocale]);
  const chartConfig = { spending: { label: t("dashboard.spending"), color: "hsl(var(--chart-1))" } } satisfies ChartConfig;

  return (
    <Card className="h-full min-w-0 shadow-none">
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 p-5 pb-2">
        <div>
          <CardTitle className="text-base">{t("dashboard.spendingTrend")}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">{t("dashboard.expensesCurrency")}</p>
        </div>
        <Tabs value={range} onValueChange={(value) => setRange(value as TrendRange)}>
          <TabsList>
            <TabsTrigger value="week">{t("dashboard.week")}</TabsTrigger>
            <TabsTrigger value="month">{t("dashboard.month")}</TabsTrigger>
            <TabsTrigger value="year">{t("dashboard.year")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-3 pt-4 sm:p-5 sm:pt-4">
        <ChartContainer config={chartConfig} className="h-60 w-full aspect-auto">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={12} />
            <YAxis tickLine={false} axisLine={false} width={68} tickFormatter={(value) => format(Number(value), { notation: "compact", maximumFractionDigits: 1 })} />
            <ChartTooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent labelFormatter={(_, payload) => payload?.[0]?.payload?.date} formatter={(value) => <span className="font-mono font-medium">{format(Number(value))}</span>} />} />
            <Bar dataKey="spending" fill="var(--color-spending)" radius={[6, 6, 0, 0]} isAnimationActive={!reduceMotion} />
          </BarChart>
        </ChartContainer>
        <p className="mt-3 text-center text-xs text-muted-foreground">{t("dashboard.reportingPeriod", { period: range === "year" ? month.slice(0, 4) : `${data[0]?.date} – ${data.at(-1)?.date}` })}</p>
      </CardContent>
    </Card>
  );
}
