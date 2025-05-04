import React from "react";

import Image from "next/image";

import { FaSpinner } from "react-icons/fa";

// Flag image mapping - you should create your own mapping or use a flag library
const countryFlags: Record<string, string> = {
  Vietnam: "/vietnam-flag.png",
  USA: "/usa-flag.png",
  China: "/china-flag.png",
  Thailand: "/thailand-flag.png",
  // Add more country flags as needed
  // Default flag for fallback
  default: "/avatar.png",
};

interface CountryAnalytics {
  country: string;
  total: number;
  count: number;
}

interface AnalysisTabProps {
  countryData: CountryAnalytics[];
  isLoading: boolean;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ countryData, isLoading }) => {
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
      <div className="overflow-x-auto w-full lg:w-1/2 mt-4 lg:mt-0 lg:mr-4 h-auto md:h-60 flex justify-center items-center">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  // If no country data, show placeholder data
  const displayData: CountryAnalytics[] =
    countryData.length > 0
      ? countryData
      : [
          { country: "Vietnam", total: 1636.34, count: 12 },
          { country: "USA", total: 1245.89, count: 8 },
          { country: "China", total: 975.65, count: 5 },
          { country: "Thailand", total: 854.23, count: 4 },
        ];

  return (
    <div className="overflow-x-auto w-full lg:w-1/2 mt-4 lg:mt-0 lg:mr-4 h-auto md:h-60">
      <table className="table bg-white table-pin-rows">
        <thead>
          <tr>
            <th className="text-xs sm:text-sm">ID</th>
            <th className="text-xs sm:text-sm">Country</th>
            <th className="text-xs sm:text-sm">Totals</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((item, index) => (
            <tr key={index}>
              <th className="text-xs sm:text-sm">{index + 1}</th>
              <td>
                <div className="flex gap-2 items-center">
                  <div>
                    <Image
                      className="size-6 sm:size-8 md:size-10 rounded-box"
                      src={countryFlags[item.country] || countryFlags.default}
                      alt={item.country}
                      width={40}
                      height={40}
                    />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm">{item.country}</span>
                </div>
              </td>
              <td className="text-xs sm:text-sm">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalysisTab;
