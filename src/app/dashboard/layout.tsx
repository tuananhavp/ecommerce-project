import React from "react";

import { Poppins } from "next/font/google";

import DashboardLayout from "@/layouts/DashboardLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const AdminDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={`${poppins.className}`}>
      <DashboardLayout>{children}</DashboardLayout>
    </main>
  );
};

export default AdminDashboard;
