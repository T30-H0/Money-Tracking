"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinance } from "@/context/finance-context";
import { toLocalDateString } from "@/lib/date";

type Range = "week" | "month" | "year";
const chartConfig = { spending: { label: "Spending", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;

export function SpendingChart() {
  const { transactions, format } = useFinance();
  const [range, setRange] = useState<Range>("month");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const data = useMemo(() => buildChartData(transactions, range), [transactions, range]);

  return (
    <Card className="min-w-0">
      <CardHeader className="flex-row items-center justify-between gap-3 p-5 pb-2">
        <div>
          <CardTitle className="text-lg">Spending trend</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Expenses in your selected currency</p>
        </div>
        <Tabs value={range} onValueChange={(value) => setRange(value as Range)}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-3 pt-4 sm:p-5 sm:pt-4">
        <ChartContainer config={chartConfig} className="h-72 w-full aspect-auto">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={12} />
            <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(value) => Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(Number(value))} />
            <ChartTooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent formatter={(value) => <span className="font-mono font-medium">{format(Number(value))}</span>} />} />
            <Bar dataKey="spending" fill="var(--color-spending)" radius={[6, 6, 0, 0]} isAnimationActive={!reduceMotion} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function buildChartData(transactions: ReturnType<typeof useFinance>["transactions"], range: Range) {
  const now = new Date();
  const expenses = transactions.filter((item) => item.type === "expense");
  if (range === "week") {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index));
      const key = toLocalDateString(date);
      return { label: date.toLocaleDateString(undefined, { weekday: "short" }), spending: expenses.filter((item) => item.date === key).reduce((sum, item) => sum + item.amount, 0) };
    });
  }
  if (range === "year") {
    return Array.from({ length: 12 }, (_, index) => {
      const key = `${now.getFullYear()}-${String(index + 1).padStart(2, "0")}`;
      return { label: new Date(now.getFullYear(), index, 1).toLocaleDateString(undefined, { month: "short" }), spending: expenses.filter((item) => item.date.startsWith(key)).reduce((sum, item) => sum + item.amount, 0) };
    });
  }
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), index + 1);
    const key = toLocalDateString(date);
    return { label: String(index + 1), spending: expenses.filter((item) => item.date === key).reduce((sum, item) => sum + item.amount, 0) };
  });
}
