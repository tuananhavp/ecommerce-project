import React from "react";

const ProductStat = () => {
  return (
    <div className="flex w-1/2 gap-5 px-10 mt-6">
      <div className="card rounded-box grid grow place-items-center">
        <div className="stats stats-vertical gap-6 bg-layout-primary w-full">
          <div className="stat bg-white shadow-xs">
            <div className="stat-title">Downloads</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">Jan 1st - Feb 1st</div>
          </div>

          <div className="stat bg-white shadow-xs">
            <div className="stat-title">New Users</div>
            <div className="stat-value">4,200</div>
            <div className="stat-desc">↗︎ 400 (22%)</div>
          </div>
        </div>
      </div>
      <div className="divider divider-horizontal"></div>
      <div className="card rounded-box grid grow place-items-center">
        <div className="stats stats-vertical gap-6 bg-layout-primary w-full">
          <div className="stat bg-white shadow-xs">
            <div className="stat-title">Downloads</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">Jan 1st - Feb 1st</div>
          </div>

          <div className="stat bg-white shadow-xs">
            <div className="stat-title">New Users</div>
            <div className="stat-value">4,200</div>
            <div className="stat-desc">↗︎ 400 (22%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStat;
