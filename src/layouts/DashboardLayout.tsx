"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Loading from "@/components/Loading";
import { useAuthStore } from "@/store/authStore";

import AppHeader from "./dashboard/AppHeader";
import AppSidebar from "./dashboard/AppSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, initialize } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const checkUserRole = () => {
      if (!isLoading) {
        if (isAuthenticated && user?.role === "admin") {
          setIsAuthorized(true);
          return;
        }

        if (isAuthenticated || !isAuthenticated) {
          try {
            const userString = localStorage.getItem("user");

            if (userString) {
              const userData = JSON.parse(userString);
              if (userData && userData.role === "admin") {
                setIsAuthorized(true);
                return;
              }
            }

            setIsAuthorized(false);
          } catch (error) {
            console.error("Error checking user role in localStorage:", error);
            setIsAuthorized(false);
          }
        }
      }
    };

    checkUserRole();
  }, [isLoading, isAuthenticated, user]);

  useEffect(() => {
    if (isAuthorized === false) {
      const redirectTimeout = setTimeout(() => {
        router.push("/");
      }, 100);

      return () => clearTimeout(redirectTimeout);
    }
  }, [isAuthorized, router]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-layout-primary">
        <Loading />
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="flex items-center justify-center h-screen bg-layout-primary">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You do not have permission to access the dashboard.</p>
          <p className="text-gray-500 text-sm">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

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
