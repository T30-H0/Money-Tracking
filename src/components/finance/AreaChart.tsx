"use client";

import { Area, AreaChart as RechartsAreaChart } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

interface AreaChartProps {
  points: number[];
  ariaLabel: string;
}

const chartConfig = {
  value: { label: "Performance", color: "rgb(110 231 183)" },
} satisfies ChartConfig;

export function AreaChart({ points, ariaLabel }: AreaChartProps) {
  const data = points.map((value, index) => ({ index, value }));

  return (
    <ChartContainer
      config={chartConfig}
      role="img"
      aria-label={ariaLabel}
      className="block aspect-auto h-28 w-full"
    >
      <RechartsAreaChart
        data={data}
        margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="fillPerformance" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-value)"
              stopOpacity={0.35}
            />
            <stop
              offset="100%"
              stopColor="var(--color-value)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural"
          stroke="var(--color-value)"
          strokeWidth={2}
          fill="url(#fillPerformance)"
          dot={false}
          isAnimationActive
          animationDuration={900}
        />
      </RechartsAreaChart>
    </ChartContainer>
  );
}
