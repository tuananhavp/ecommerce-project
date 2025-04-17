"use client";
import React from "react";

import AppHeader from "./dashboard/AppHeader";
import AppSidebar from "./dashboard/AppSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex bg-layout-primary font-dashboard">
        <AppSidebar />
        <div className="flex flex-col flex-grow">
          <AppHeader></AppHeader>
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
