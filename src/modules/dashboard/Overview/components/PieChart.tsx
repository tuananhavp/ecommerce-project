"use client";

import { JSX, useMemo } from "react";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface PieChartData {
  browser: string;
  visitors: number;
  fill: string;
}

interface PieChartBarProps {
  data: PieChartData[];
}

const chartConfig = {
  visitors: {
    label: "Orders",
  },
  chrome: {
    label: "Pending",
    color: "#2563eb",
  },
  safari: {
    label: "Processing",
    color: "#60a5fa",
  },
  firefox: {
    label: "Shipping",
    color: "#634C9F",
  },
  edge: {
    label: "Completed",
    color: "#0DCAF0",
  },
  other: {
    label: "Other",
    color: "#0891B2",
  },
} satisfies ChartConfig;

export function PieChartBar({ data }: PieChartBarProps): JSX.Element {
  const totalOrders = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [data]);

  // Calculate completed orders percentage
  const completedOrders = data.find((item) => item.browser === "edge")?.visitors || 0;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  // Determine if completion rate is trending up or down (simulated)
  const trendingUp = completionRate > 50;

  interface ViewBox {
    cx?: number;
    cy?: number;
    innerRadius?: number;
    outerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }

  return (
    <Card className="flex flex-col w-full border-0">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg md:text-xl">Order Status Distribution</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Current order processing status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 px-2 sm:px-4 md:px-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px] sm:max-h-[220px] md:max-h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="visitors" nameKey="browser" innerRadius={45} strokeWidth={4}>
              <Label
                content={({ viewBox }: { viewBox?: ViewBox }) => {
                  if (viewBox && typeof viewBox.cx === "number" && typeof viewBox.cy === "number") {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl sm:text-2xl md:text-3xl font-bold"
                        >
                          {totalOrders.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={viewBox.cy + 20} className="fill-muted-foreground text-xs sm:text-sm">
                          Orders
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 md:gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-1 md:gap-2 font-medium leading-none">
          {trendingUp ? (
            <>
              Completion rate: {completionRate}% <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
            </>
          ) : (
            <>
              Completion rate: {completionRate}% <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-amber-500" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground text-xs">
          {completedOrders} of {totalOrders} orders completed
        </div>
      </CardFooter>
    </Card>
  );
}
