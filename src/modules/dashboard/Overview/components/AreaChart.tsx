"use client";

import { JSX } from "react";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface AreaChartData {
  month: string;
  desktop: number;
  mobile: number;
}

interface AreaChartBarProps {
  data: AreaChartData[];
}

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

export function AreaChartBar({ data }: AreaChartBarProps): JSX.Element {
  // Calculate total orders and growth
  const totalOrders = data.reduce((acc, month) => acc + month.desktop + month.mobile, 0);

  // Calculate month-over-month growth
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2] || { desktop: 0, mobile: 0 };

  const currentTotal = currentMonth ? currentMonth.desktop + currentMonth.mobile : 0;
  const previousTotal = previousMonth ? previousMonth.desktop + previousMonth.mobile : 0;

  const growthPercent = previousTotal > 0 ? (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1) : "0";

  const growthIsPositive = parseFloat(growthPercent) > 0;

  return (
    <Card className="w-full border-0">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Order Trends</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Order distribution by device for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 md:px-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px] sm:max-h-[220px] md:max-h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
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
              {growthIsPositive ? (
                <>
                  Trending up by {growthPercent}% this month{" "}
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                </>
              ) : (
                <>
                  Trending down by {Math.abs(parseFloat(growthPercent))}% this month{" "}
                  <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                </>
              )}
            </div>
            <div className="flex items-center gap-1 md:gap-2 leading-none text-muted-foreground text-xs">
              Total Orders: {totalOrders}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
