"use client";

import { useMemo } from "react";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/Chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "#2563eb",
  },
  safari: {
    label: "Safari",
    color: "#60a5fa",
  },
  firefox: {
    label: "Firefox",
    color: "#634C9F",
  },
  edge: {
    label: "Edge",
    color: "#0DCAF0",
  },
  other: {
    label: "Other",
    color: "#0891B2",
  },
} satisfies ChartConfig;

export function PieChartBar() {
  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="flex flex-col w-full border-0">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg md:text-xl">Pie Chart - Donut with Text</CardTitle>
        <CardDescription className="text-xs sm:text-sm">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 px-2 sm:px-4 md:px-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px] sm:max-h-[220px] md:max-h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={45} strokeWidth={4}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl sm:text-2xl md:text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs sm:text-sm"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 md:gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-1 md:gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
        </div>
        <div className="leading-none text-muted-foreground text-xs">Showing total visitors for the last 6 months</div>
      </CardFooter>
    </Card>
  );
}
