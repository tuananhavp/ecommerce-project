"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/Chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function AreaChartBar() {
  return (
    <Card className="w-full border-0">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Area Chart - Stacked</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Showing total visitors for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 md:px-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px] sm:max-h-[220px] md:max-h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 8,
              right: 8,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.slice(0, 3)}
              fontSize={10}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-1 md:gap-2 text-xs sm:text-sm">
          <div className="grid gap-1 md:gap-2">
            <div className="flex items-center gap-1 md:gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
            </div>
            <div className="flex items-center gap-1 md:gap-2 leading-none text-muted-foreground text-xs">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
