import React from "react";
import { AreaChartBar } from "./AreaChart";
import { PieChartBar } from "./PieChart";

const Chart = () => {
  return (
    <div className="flex w-full px-10">
      <div className="card rounded-box grid grow place-items-center bg-white">
        <AreaChartBar />
      </div>
      <div className="divider divider-horizontal"></div>
      <div className="card rounded-box grid grow place-items-center flex-1 bg-white">
        <PieChartBar />
      </div>
    </div>
  );
};

export default Chart;
