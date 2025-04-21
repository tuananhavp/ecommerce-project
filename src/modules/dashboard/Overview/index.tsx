import React from "react";

import AnalysisTab from "./components/AnalysisTab";
import Chart from "./components/Chart";
import ProductStat from "./components/ProductStat";
import UserStat from "./components/UserStat";

const Dashboard = () => {
  return (
    <div className="flex flex-col w-full gap-4 px-4 sm:px-6 md:px-8 lg:px-10">
      <Chart />
      <UserStat />
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
        <ProductStat />
        <AnalysisTab />
      </div>
    </div>
  );
};

export default Dashboard;
