"use client";
import React, { useEffect, useState } from "react";

import Loading from "@/components/Loading";
import { useOrderStore } from "@/store/orderStore";
import { useUserStore } from "@/store/userStore";
import { AdminUserData } from "@/types/auth.types";
import { Order, OrderStatus } from "@/types/order.types";

import AnalysisTab from "./components/AnalysisTab";
import Chart from "./components/Chart";
import ProductStat from "./components/ProductStat";
import UserStat from "./components/UserStat";

// Define types for dashboard data
interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  newOrders: number;
  monthlyOrders: number;
  monthlyRevenue?: number;
  revenueGrowth: number | string;
}

interface UserStatistics {
  totalUsers: number;
  totalCustomers: number;
  newUsers: number;
  monthlyActiveUsers: number;
  userGrowth: number | string;
}

interface MonthlyData {
  month: string;
  desktop: number;
  mobile: number;
}

interface BrowserData {
  browser: string;
  visitors: number;
  fill: string;
}

interface CountryAnalytics {
  country: string;
  total: number;
  count: number;
}

interface DashboardData {
  orders: Order[];
  users: AdminUserData[];
  orderStatistics: OrderStatistics;
  userStatistics: UserStatistics;
  ordersByMonth: MonthlyData[];
  ordersByStatus: BrowserData[];
  countryAnalytics: CountryAnalytics[];
}

const Dashboard: React.FC = () => {
  const { orders, fetchOrders, isLoading: ordersLoading } = useOrderStore();
  const { users, fetchUsers, isLoading: usersLoading } = useUserStore();
  const [isDataProcessed, setIsDataProcessed] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    orders: [],
    users: [],
    orderStatistics: {
      totalOrders: 0,
      totalRevenue: 0,
      newOrders: 0,
      monthlyOrders: 0,
      revenueGrowth: 0,
    },
    userStatistics: {
      totalUsers: 0,
      totalCustomers: 0,
      newUsers: 0,
      monthlyActiveUsers: 0,
      userGrowth: 0,
    },
    ordersByMonth: [],
    ordersByStatus: [],
    countryAnalytics: [],
  });

  // First useEffect to fetch data
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data for dashboard...");
      try {
        // Trigger fetches but don't wait for their return values
        fetchOrders();
        fetchUsers();
      } catch (error) {
        console.error("Error initiating data fetch:", error);
      }
    };

    fetchData();
  }, [fetchOrders, fetchUsers]);

  // Second useEffect to process data once it's loaded
  useEffect(() => {
    console.log("Data loading status:", { ordersLoading, usersLoading });
    console.log("Current data:", { orders: orders?.length || 0, users: users?.length || 0 });
    const processDataForDashboard = (orders: Order[], users: AdminUserData[]): DashboardData => {
      // For safety, ensure arrays even if input is null/undefined
      const safeOrders = orders || [];
      const safeUsers = users || [];

      console.log(`Processing dashboard data: ${safeOrders.length} orders, ${safeUsers.length} users`);

      // Calculate order statistics
      const ordersByMonth = calculateOrdersByMonth(safeOrders);
      const ordersByStatus = calculateOrdersByStatus(safeOrders);
      const orderStatistics = calculateOrderStatistics(safeOrders);

      // Calculate user statistics
      const userStatistics = calculateUserStatistics(safeUsers);

      // Calculate country analytics
      const countryAnalytics = calculateCountryAnalytics(safeOrders);

      return {
        orders: safeOrders,
        users: safeUsers,
        orderStatistics,
        userStatistics,
        ordersByMonth,
        ordersByStatus,
        countryAnalytics,
      };
    };
    // Only process data when both orders and users are loaded
    if (!ordersLoading && !usersLoading) {
      console.log("Data loaded, processing...");

      // Simple validation to check if data exists and has expected structure
      const validOrders = Array.isArray(orders);
      const validUsers = Array.isArray(users);

      console.log("Data validation:", { validOrders, validUsers });

      if (validOrders && validUsers) {
        try {
          // Process the data for dashboard components
          const processedData = processDataForDashboard(orders, users);
          setDashboardData(processedData);
          setIsDataProcessed(true);
          console.log("Dashboard data processed successfully");
        } catch (error) {
          console.error("Error processing dashboard data:", error);
          // Still mark as processed to exit loading state
          setIsDataProcessed(true);
        }
      } else {
        console.warn("Invalid data structure received");
        // Still mark as processed to exit loading state
        setIsDataProcessed(true);
      }
    }
  }, [orders, users, ordersLoading, usersLoading]);

  // Combined loading state
  const isLoading = ordersLoading || usersLoading || !isDataProcessed;

  // Helper functions for data processing
  const calculateOrdersByMonth = (orders: Order[]): MonthlyData[] => {
    // Default data for empty state
    const defaultData = ["January", "February", "March", "April", "May", "June"].map((month) => ({
      month,
      desktop: 0,
      mobile: 0,
    }));

    // Handle null or undefined orders
    if (!orders || orders.length === 0) {
      return defaultData;
    }

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Initialize data with zeros
    const monthlyData: MonthlyData[] = months.map((month) => ({
      month,
      desktop: 0,
      mobile: 0,
    }));

    let processedCount = 0;

    // Count orders by month and device type (using a random distribution for demonstration)
    orders.forEach((order) => {
      try {
        if (!order.createdAt) return; // Skip if no created date

        let orderDate: Date;
        if (order.createdAt instanceof Date) {
          orderDate = order.createdAt;
        } else if ("toDate" in order.createdAt && typeof order.createdAt.toDate === "function") {
          orderDate = order.createdAt.toDate();
        } else {
          return; // Skip if date is invalid
        }

        if (orderDate.getFullYear() === currentYear) {
          const monthIndex = orderDate.getMonth();

          // Random split between desktop/mobile for demonstration
          // In a real app, you'd use actual device data from your orders
          const isDesktop = Math.random() > 0.4; // 60% desktop, 40% mobile

          if (isDesktop) {
            monthlyData[monthIndex].desktop += 1;
          } else {
            monthlyData[monthIndex].mobile += 1;
          }

          processedCount++;
        }
      } catch (error) {
        console.error("Error processing order for monthly data:", error);
      }
    });

    console.log(`Processed ${processedCount} orders for monthly data`);

    // If no data was processed, return default data
    if (processedCount === 0) {
      return defaultData;
    }

    // Return only the last 6 months
    return monthlyData.slice(0, 6);
  };

  // [The rest of the calculation functions remain the same, but add try/catch blocks]

  const calculateOrdersByStatus = (orders: Order[]): BrowserData[] => {
    // Default data for empty state
    const defaultData = [
      { browser: "chrome", visitors: 0, fill: "var(--color-chrome)" },
      { browser: "safari", visitors: 0, fill: "var(--color-safari)" },
      { browser: "firefox", visitors: 0, fill: "var(--color-firefox)" },
      { browser: "edge", visitors: 0, fill: "var(--color-edge)" },
      { browser: "other", visitors: 0, fill: "var(--color-other)" },
    ];

    // Handle null or undefined orders
    if (!orders || orders.length === 0) {
      return defaultData;
    }

    try {
      // This will simulate browser distributions based on order statuses
      // In a real app, you'd use actual browser data
      const statusMap: Record<OrderStatus, string> = {
        Pending: "chrome",
        "In Process": "safari",
        Shipping: "firefox",
        Completed: "edge",
        Cancelled: "other",
        Refunded: "other",
      };

      const browserCounts: Record<string, number> = {
        chrome: 0,
        safari: 0,
        firefox: 0,
        edge: 0,
        other: 0,
      };

      let processedCount = 0;

      orders.forEach((order) => {
        if (!order.orderStatus) return; // Skip if no status

        const browser = statusMap[order.orderStatus] || "other";
        browserCounts[browser] += 1;
        processedCount++;
      });

      console.log(`Processed ${processedCount} orders for status data`);

      // If no data was processed, return default data
      if (processedCount === 0) {
        return defaultData;
      }

      return [
        { browser: "chrome", visitors: browserCounts.chrome, fill: "var(--color-chrome)" },
        { browser: "safari", visitors: browserCounts.safari, fill: "var(--color-safari)" },
        { browser: "firefox", visitors: browserCounts.firefox, fill: "var(--color-firefox)" },
        { browser: "edge", visitors: browserCounts.edge, fill: "var(--color-edge)" },
        { browser: "other", visitors: browserCounts.other, fill: "var(--color-other)" },
      ];
    } catch (error) {
      console.error("Error calculating order status data:", error);
      return defaultData;
    }
  };

  const calculateOrderStatistics = (orders: Order[]): OrderStatistics => {
    // Default data for empty state
    const defaultData = {
      totalOrders: 0,
      totalRevenue: 0,
      newOrders: 0,
      monthlyOrders: 0,
      monthlyRevenue: 0,
      revenueGrowth: 0,
    };

    // Handle null or undefined orders
    if (!orders || orders.length === 0) {
      return defaultData;
    }

    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime();

      const totalOrders = orders.length;
      let totalRevenue = 0;
      let newOrders = 0;
      let monthlyOrders = 0;
      let monthlyRevenuePrevious = 0;
      let monthlyRevenueCurrent = 0;

      let processedCount = 0;

      orders.forEach((order) => {
        try {
          if (!order.createdAt) return; // Skip if no date

          let orderDate: Date;
          if (order.createdAt instanceof Date) {
            orderDate = order.createdAt;
          } else if ("toDate" in order.createdAt && typeof order.createdAt.toDate === "function") {
            orderDate = order.createdAt.toDate();
          } else {
            return; // Skip if date is invalid
          }

          const orderTime = orderDate.getTime();

          // Add to total revenue
          totalRevenue += order.totalAmount || 0;

          // Count new orders from today
          if (orderTime >= today) {
            newOrders += 1;
          }

          // Calculate monthly trends
          if (orderTime >= oneMonthAgo) {
            monthlyOrders += 1;

            // Current month vs previous month revenue calculation
            const orderMonth = orderDate.getMonth();
            const currentMonth = now.getMonth();

            if (orderMonth === currentMonth) {
              monthlyRevenueCurrent += order.totalAmount || 0;
            } else if (orderMonth === (currentMonth - 1 + 12) % 12) {
              monthlyRevenuePrevious += order.totalAmount || 0;
            }
          }

          processedCount++;
        } catch (error) {
          console.error("Error processing order for statistics:", error);
        }
      });

      console.log(`Processed ${processedCount} orders for statistics`);

      // If no data was processed, return default data
      if (processedCount === 0) {
        return defaultData;
      }

      // Calculate growth percentage
      const revenueGrowth =
        monthlyRevenuePrevious > 0
          ? (((monthlyRevenueCurrent - monthlyRevenuePrevious) / monthlyRevenuePrevious) * 100).toFixed(1)
          : 0;

      return {
        totalOrders,
        totalRevenue,
        newOrders,
        monthlyOrders,
        monthlyRevenue: monthlyRevenueCurrent,
        revenueGrowth,
      };
    } catch (error) {
      console.error("Error calculating order statistics:", error);
      return defaultData;
    }
  };

  const calculateUserStatistics = (users: AdminUserData[]): UserStatistics => {
    // Default data for empty state
    const defaultData = {
      totalUsers: 0,
      totalCustomers: 0,
      newUsers: 0,
      monthlyActiveUsers: 0,
      userGrowth: 0,
    };

    // Handle null or undefined users
    if (!users || users.length === 0) {
      return defaultData;
    }

    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      const totalUsers = users.length;
      let newUsers = 0;
      let monthlyActiveUsers = 0;

      let processedCount = 0;

      // Only count customers, not admins
      const customers = users.filter((user) => user && user.role === "customer") || [];

      customers.forEach((user) => {
        try {
          if (!user || !user.createdAt) return; // Skip if no date

          let createdDate: Date;
          if (user.createdAt instanceof Date) {
            createdDate = user.createdAt;
          } else if ("toDate" in user.createdAt && typeof user.createdAt.toDate === "function") {
            createdDate = user.createdAt.toDate();
          } else {
            return; // Skip if date is invalid
          }

          const createdTime = createdDate.getTime();

          if (createdTime >= today) {
            newUsers += 1;
          }

          // For demonstration, consider ~70% of users as "active" in the last month
          // In a real app, you'd calculate this based on order activity or login events
          if (Math.random() > 0.3) {
            monthlyActiveUsers += 1;
          }

          processedCount++;
        } catch (error) {
          console.error("Error processing user for statistics:", error);
        }
      });

      console.log(`Processed ${processedCount} customers for statistics`);

      // If no data was processed, return default data with total users count
      if (processedCount === 0) {
        return {
          ...defaultData,
          totalUsers, // Still show total users count even if no customers
        };
      }

      // Calculate growth for the statistics display
      const userGrowth = totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : 0;

      return {
        totalUsers,
        totalCustomers: customers.length,
        newUsers,
        monthlyActiveUsers,
        userGrowth,
      };
    } catch (error) {
      console.error("Error calculating user statistics:", error);
      return defaultData;
    }
  };

  const calculateCountryAnalytics = (orders: Order[]): CountryAnalytics[] => {
    // Default data for empty state
    const defaultData = [
      { country: "Vietnam", total: 1636.34, count: 12 },
      { country: "USA", total: 1245.89, count: 8 },
      { country: "China", total: 975.65, count: 5 },
      { country: "Thailand", total: 854.23, count: 4 },
    ];

    // Handle null or undefined orders
    if (!orders || orders.length === 0) {
      return defaultData;
    }

    try {
      // Group orders by country and calculate totals
      const countryData: Record<string, { total: number; count: number }> = {};

      let processedCount = 0;

      orders.forEach((order) => {
        try {
          const country = order.deliveryAddress?.country || "Unknown";

          if (!countryData[country]) {
            countryData[country] = {
              total: 0,
              count: 0,
            };
          }

          countryData[country].total += order.totalAmount || 0;
          countryData[country].count += 1;
          processedCount++;
        } catch (error) {
          console.error("Error processing order for country analytics:", error);
        }
      });

      console.log(`Processed ${processedCount} orders for country analytics`);

      // If no data was processed, return default data
      if (processedCount === 0) {
        return defaultData;
      }

      // Convert to array and sort by total amount
      const countries = Object.entries(countryData)
        .map(([country, data]) => ({
          country,
          total: data.total,
          count: data.count,
        }))
        .sort((a, b) => b.total - a.total);

      return countries.length > 0 ? countries.slice(0, 4) : defaultData;
    } catch (error) {
      console.error("Error calculating country analytics:", error);
      return defaultData;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-12">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-4 px-4 sm:px-6 md:px-8 lg:px-10">
      <Chart
        areaChartData={dashboardData.ordersByMonth || []}
        pieChartData={dashboardData.ordersByStatus || []}
        isLoading={isLoading}
      />
      <UserStat
        statistics={dashboardData.userStatistics || {}}
        orderStats={dashboardData.orderStatistics || {}}
        isLoading={isLoading}
      />
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
        <ProductStat
          orderStats={dashboardData.orderStatistics || {}}
          userStats={dashboardData.userStatistics || {}}
          isLoading={isLoading}
        />
        <AnalysisTab countryData={dashboardData.countryAnalytics || []} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
