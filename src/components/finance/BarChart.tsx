"use client";

import { Bar, BarChart as RechartsBarChart, Cell, XAxis } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { ExpenseBar } from "@/types/finance";

interface BarChartProps {
  bars: ExpenseBar[];
  ariaLabel: string;
}

const TONE_COLORS: Record<ExpenseBar["tone"], string> = {
  primary: "rgb(110 231 183)", // emerald-300
  muted: "rgb(253 186 116)", // orange-300
};

const chartConfig = {
  amount: { label: "Spending" },
} satisfies ChartConfig;

/**
 * Spending bar chart built on the shadcn Chart (Recharts) primitive for
 * animation and styling consistency. Each bar is coloured by its tone.
 */
export function BarChart({ bars, ariaLabel }: BarChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      role="img"
      aria-label={ariaLabel}
      className="block aspect-auto h-32 w-full"
    >
      <RechartsBarChart
        data={bars}
        margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
      >
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "rgb(148 163 184)", fontSize: 11 }}
          interval={0}
        />
        <Bar dataKey="amount" radius={6} isAnimationActive animationDuration={800}>
          {bars.map((bar) => (
            <Cell key={bar.label} fill={TONE_COLORS[bar.tone]} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ChartContainer>
  );
}
