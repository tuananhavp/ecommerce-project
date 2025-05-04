import React from "react";

import { FaSpinner, FaShoppingCart, FaUsers, FaDollarSign, FaStore } from "react-icons/fa";

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

interface ProductStatProps {
  orderStats: OrderStatistics;
  userStats: UserStatistics;
  isLoading: boolean;
}

const ProductStat: React.FC<ProductStatProps> = ({ orderStats, userStats, isLoading }) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row w-full lg:w-1/2 gap-4 sm:gap-5 mt-4 lg:mt-0 justify-center items-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  // Calculate average order value
  const avgOrderValue = orderStats.totalOrders > 0 ? orderStats.totalRevenue / orderStats.totalOrders : 0;

  // Calculate conversion rate
  const conversionRate =
    userStats.totalCustomers > 0 ? ((orderStats.totalOrders / userStats.totalCustomers) * 100).toFixed(1) : "0";

  return (
    <div className="flex flex-col sm:flex-row w-full lg:w-1/2 gap-4 sm:gap-5 mt-4 lg:mt-0">
      <div className="card rounded-box grid grow place-items-center w-full sm:w-1/2">
        <div className="stats stats-vertical gap-3 sm:gap-4 md:gap-6 bg-layout-primary w-full">
          <div className="stat bg-white shadow-xs">
            <div className="flex items-center gap-2">
              <FaShoppingCart className="text-indigo-500" />
              <div className="stat-title text-xs sm:text-sm">Total Orders</div>
            </div>
            <div className="stat-value text-lg sm:text-xl md:text-2xl">{orderStats.totalOrders || 0}</div>
            <div className="stat-desc text-xs sm:text-sm">{orderStats.newOrders || 0} new today</div>
          </div>

          <div className="stat bg-white shadow-xs">
            <div className="flex items-center gap-2">
              <FaUsers className="text-green-500" />
              <div className="stat-title text-xs sm:text-sm">Conversion Rate</div>
            </div>
            <div className="stat-value text-lg sm:text-xl md:text-2xl">{conversionRate}%</div>
            <div className="stat-desc text-xs sm:text-sm">Of total customers</div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block divider divider-horizontal"></div>

      <div className="card rounded-box grid grow place-items-center w-full sm:w-1/2">
        <div className="stats stats-vertical gap-3 sm:gap-4 md:gap-6 bg-layout-primary w-full">
          <div className="stat bg-white shadow-xs">
            <div className="flex items-center gap-2">
              <FaDollarSign className="text-blue-500" />
              <div className="stat-title text-xs sm:text-sm">Avg. Order Value</div>
            </div>
            <div className="stat-value text-lg sm:text-xl md:text-2xl">{formatCurrency(avgOrderValue)}</div>
            <div className="stat-desc text-xs sm:text-sm">Per transaction</div>
          </div>

          <div className="stat bg-white shadow-xs">
            <div className="flex items-center gap-2">
              <FaStore className="text-purple-500" />
              <div className="stat-title text-xs sm:text-sm">Monthly Revenue</div>
            </div>
            <div className="stat-value text-lg sm:text-xl md:text-2xl">
              {formatCurrency(orderStats.monthlyRevenue || 0)}
            </div>
            <div className="stat-desc text-xs sm:text-sm">{orderStats.monthlyOrders || 0} orders this month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStat;
