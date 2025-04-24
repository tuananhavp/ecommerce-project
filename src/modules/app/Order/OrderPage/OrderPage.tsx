"use client";
import React, { useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Timestamp } from "firebase/firestore";

import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";

const OrdersPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { orders, fetchUserOrders, isLoading, error } = useOrderStore();

  useEffect(() => {
    // if (!user) {
    //   router.push("/login");
    //   return;
    // }

    fetchUserOrders();
  }, [user, fetchUserOrders, router]);

  //   if (!user) {
  //     return null; // Will redirect in useEffect
  //   }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-700">{error}</p>
        </div>
        <Link href="/" className="btn btn-primary">
          Go to Homepage
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Process":
        return "bg-blue-100 text-blue-800";
      case "Shipping":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">You haven not placed any orders yet.</h2>
          <p className="text-gray-600 mb-6">Looking for something to buy?</p>
          <Link href="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                      #{order.id?.substring(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.createdAt instanceof Timestamp
                      ? order.createdAt.toDate().toLocaleDateString()
                      : "Processing"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.orderItems.length} items</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link href={`/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Details
                    </Link>
                    {order.orderStatus === "Pending" && (
                      <button className="text-red-600 hover:text-red-900">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
