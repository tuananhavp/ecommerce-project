import React from "react";

import { usePathname } from "next/navigation";

import { capitalizeFirstLetter } from "@/helpers";

const AppHeader = () => {
  const pathName = usePathname().split("/")[2];

  return (
    <div className="navbar flex flex-wrap items-center bg-layout-primary gap-3 p-4">
      <div className="flex items-center">
        <a className="btn btn-ghost text-xl">{capitalizeFirstLetter(pathName || "Dashboard")}</a>
      </div>

      <div className="flex-1 min-w-[200px] max-w-md">
        <label className="input w-full bg-white px-6 py-1.5 border-none shadow-md rounded-2xl focus:outline-none flex items-center gap-2">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" className="grow px-3 bg-transparent outline-none" placeholder="Search" />
        </label>
      </div>
    </div>
  );
};

export default AppHeader;
