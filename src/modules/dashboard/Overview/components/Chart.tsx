import React from "react";

import { AreaChartBar } from "./AreaChart";
import { PieChartBar } from "./PieChart";

const Chart = () => {
  return (
    <div className="flex flex-col md:flex-row w-full gap-4 md:gap-2">
      <div className="card rounded-box w-full md:w-1/2 place-items-center bg-white">
        <AreaChartBar />
      </div>
      <div className="hidden md:block divider divider-horizontal"></div>
      <div className="card rounded-box w-full md:w-1/2 place-items-center bg-white">
        <PieChartBar />
      </div>
    </div>
  );
};

export default Chart;
