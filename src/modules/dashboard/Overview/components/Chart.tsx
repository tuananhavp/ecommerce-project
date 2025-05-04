import React from "react";

import { FaSpinner } from "react-icons/fa";

import { AreaChartBar } from "./AreaChart";
import { PieChartBar } from "./PieChart";

interface MonthlyData {
  month: string;
  desktop: number;
  mobile: number;
}

interface BrowserData {
  browser: string;
  visitors: number;
  fill: string;
}

interface ChartProps {
  areaChartData: MonthlyData[];
  pieChartData: BrowserData[];
  isLoading: boolean;
}

const Chart: React.FC<ChartProps> = ({ areaChartData, pieChartData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-2">
        <div className="card rounded-box w-full md:w-1/2 place-items-center bg-white h-64 flex items-center justify-center">
          <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
        <div className="hidden md:block divider divider-horizontal"></div>
        <div className="card rounded-box w-full md:w-1/2 place-items-center bg-white h-64 flex items-center justify-center">
          <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full gap-4 md:gap-2">
      <div className="card rounded-box w-full md:w-1/2 place-items-center bg-white">
        <AreaChartBar data={areaChartData} />
      </div>
      <div className="hidden md:block divider divider-horizontal"></div>
      <div className="card rounded-box w-full md:w-1/2 place-items-center bg-white">
        <PieChartBar data={pieChartData} />
      </div>
    </div>
  );
};

export default Chart;
