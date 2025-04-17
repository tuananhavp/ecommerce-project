import React from "react";
import Chart from "./components/Chart";
import UserStat from "./components/UserStat";
import ProductStat from "./components/ProductStat";
import AnalysisTab from "./components/AnalysisTab";

const Dashboard = () => {
  return (
    <>
      <Chart />
      <UserStat />
      <div className="flex gap-5">
        <ProductStat />
        <AnalysisTab />
      </div>
    </>
  );
};

export default Dashboard;
