import React from "react";

const ProductStat = () => {
  return (
    <div className="flex flex-col sm:flex-row w-full lg:w-1/2 gap-4 sm:gap-5 mt-4 lg:mt-0">
      <div className="card rounded-box grid grow place-items-center w-full sm:w-1/2">
        <div className="stats stats-vertical gap-3 sm:gap-4 md:gap-6 bg-layout-primary w-full">
          <div className="stat bg-white shadow-xs">
            <div className="stat-title text-xs sm:text-sm">Downloads</div>
            <div className="stat-value text-lg sm:text-xl md:text-2xl">31K</div>
            <div className="stat-desc text-xs sm:text-sm">Jan 1st - Feb 1st</div>
          </div>

          <div className="stat bg-white shadow-xs">
            <div className="stat-title text-xs sm:text-sm">New Users</div>
            <div className="stat-value text-lg sm:text-xl md:text-2xl">4,200</div>
            <div className="stat-desc text-xs sm:text-sm">↗︎ 400 (22%)</div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block divider divider-horizontal"></div>

      <div className="card rounded-box grid grow place-items-center w-full sm:w-1/2">
        <div className="stats stats-vertical gap-3 sm:gap-4 md:gap-6 bg-layout-primary w-full">
          <div className="stat bg-white shadow-xs">
            <div className="stat-title text-xs sm:text-sm">Downloads</div>
            <div className="stat-value text-lg sm:text-xl md:text-2xl">31K</div>
            <div className="stat-desc text-xs sm:text-sm">Jan 1st - Feb 1st</div>
          </div>

          <div className="stat bg-white shadow-xs">
            <div className="stat-title text-xs sm:text-sm">New Users</div>
            <div className="stat-value text-lg sm:text-xl md:text-2xl">4,200</div>
            <div className="stat-desc text-xs sm:text-sm">↗︎ 400 (22%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStat;
