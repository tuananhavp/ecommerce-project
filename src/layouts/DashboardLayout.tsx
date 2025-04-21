"use client";
import React from "react";

import AppHeader from "./dashboard/AppHeader";
import AppSidebar from "./dashboard/AppSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-layout-primary font-dashboard">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
