import React from "react";

import { FaSpinner, FaHeart, FaEye } from "react-icons/fa";

interface UserStatistics {
  totalUsers: number;
  totalCustomers: number;
  newUsers: number;
  monthlyActiveUsers: number;
  userGrowth: number | string;
}

interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  newOrders: number;
  monthlyOrders: number;
  revenueGrowth: number | string;
}

interface UserStatProps {
  statistics: UserStatistics;
  orderStats: OrderStatistics;
  isLoading: boolean;
}

const UserStat: React.FC<UserStatProps> = ({ statistics, orderStats, isLoading }) => {
  // Format large numbers with K or M suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

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
      <div className="w-full flex justify-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  // Calculate the active user percentage safely
  const activePercentage =
    statistics.totalCustomers > 0 ? Math.round((statistics.monthlyActiveUsers / statistics.totalCustomers) * 100) : 0;

  return (
    <div className="w-full">
      <div className="stats w-full flex-col sm:flex-row gap-2 sm:gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-6">
        <div className="stat bg-white">
          <div className="stat-figure text-primary">
            <FaHeart className="inline-block h-6 w-6 md:h-8 md:w-8 stroke-current" />
          </div>
          <div className="stat-title text-xs sm:text-sm">Total Customers</div>
          <div className="stat-value text-primary text-lg sm:text-xl md:text-2xl lg:text-3xl">
            {formatNumber(statistics.totalCustomers || 0)}
          </div>
          <div className="stat-desc text-xs sm:text-sm">{statistics.userGrowth || 0}% new this month</div>
        </div>

        <div className="stat bg-white">
          <div className="stat-figure text-secondary">
            <FaEye className="inline-block h-6 w-6 md:h-8 md:w-8 stroke-current" />
          </div>
          <div className="stat-title text-xs sm:text-sm">Total Revenue</div>
          <div className="stat-value text-secondary text-lg sm:text-xl md:text-2xl lg:text-3xl">
            {formatCurrency(orderStats.totalRevenue || 0)}
          </div>
          <div className="stat-desc text-xs sm:text-sm">{orderStats.revenueGrowth || 0}% more than last month</div>
        </div>

        <div className="stat bg-white">
          <div className="stat-figure text-secondary">
            <div className="avatar online">
              <div className="w-8 sm:w-12 md:w-16 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
              </div>
            </div>
          </div>
          <div className="stat-value text-lg sm:text-xl md:text-2xl lg:text-3xl">{activePercentage}%</div>
          <div className="stat-title text-xs sm:text-sm">Active Users</div>
          <div className="stat-desc text-secondary text-xs sm:text-sm">
            {statistics.monthlyActiveUsers} active this month
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStat;
