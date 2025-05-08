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

  // Initialize auth state when component mounts
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Check user role both from auth store and localStorage
  useEffect(() => {
    const checkUserRole = () => {
      // First try to get role from auth store (preferred)
      if (!isLoading) {
        if (isAuthenticated && user?.role === "admin") {
          setIsAuthorized(true);
          return;
        }

        // If user is authenticated but not admin, or not authenticated
        if (isAuthenticated || !isAuthenticated) {
          // Fallback to localStorage as backup
          try {
            const userString = localStorage.getItem("user");

            if (userString) {
              const userData = JSON.parse(userString);
              if (userData && userData.role === "admin") {
                setIsAuthorized(true);
                return;
              }
            }

            // If we got here, user is not authorized
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

  // Redirect unauthorized users to home page
  useEffect(() => {
    if (isAuthorized === false) {
      const redirectTimeout = setTimeout(() => {
        router.push("/");
      }, 100);

      return () => clearTimeout(redirectTimeout);
    }
  }, [isAuthorized, router]);

  // Show loading state while checking authorization
  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-layout-primary">
        <Loading />
      </div>
    );
  }

  // Show unauthorized message if not authorized (this will be briefly shown before redirect)
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

  // Only render the dashboard if authorized
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
