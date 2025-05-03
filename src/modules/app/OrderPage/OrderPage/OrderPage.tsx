"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Timestamp } from "firebase/firestore";
import { FaBox, FaCalendarAlt, FaLock } from "react-icons/fa";
import { HiOutlineDocumentText, HiOutlineStatusOnline } from "react-icons/hi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import Swal from "sweetalert2";

import { getStatusColor } from "@/helpers";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";

const OrdersPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { orders, fetchOrders, cancelOrder, isLoading, error } = useOrderStore();
  const [cancelProcessing, setCancelProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.uid) {
      fetchOrders(user.uid);
    }
  }, [user, fetchOrders, router]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-700 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-red-500 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
        <Link
          href="/"
          className="btn btn-primary px-6 py-3 rounded-lg shadow-md inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Go to Homepage
        </Link>
      </div>
    );
  }

  // Handle order cancellation with reason
  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancelProcessing(true);

      // Show cancellation reason form
      const { value: cancelReason, isConfirmed } = await Swal.fire({
        title: "Cancel Order",
        html: `
          <div class="text-left mb-4">
            <p class="mb-2">Please tell us why you're cancelling this order:</p>
            <select id="cancel-reason-preset" class="w-full p-2 border border-gray-300 rounded mb-3">
              <option value="">-- Select a reason --</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Found a better price elsewhere">Found a better price elsewhere</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Shipping takes too long">Shipping takes too long</option>
              <option value="Payment issues">Payment issues</option>
              <option value="Other">Other</option>
            </select>
            <p class="mb-2 text-sm text-gray-600">If "Other", please provide details:</p>
          </div>
        `,
        input: "textarea",
        inputPlaceholder: "Additional details about your cancellation...",
        inputAttributes: {
          "aria-label": "Additional details about your cancellation",
        },
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, cancel order",
        cancelButtonText: "No, keep order",
        inputValidator: (value) => {
          // Custom validation function to use with SweetAlert2
          const selectElement = document.getElementById("cancel-reason-preset") as HTMLSelectElement;
          const selectedReason = selectElement ? selectElement.value : "";

          if (!selectedReason && !value.trim()) {
            return "Please select a reason or provide details for cancellation";
          }
          return null;
        },
        preConfirm: () => {
          const selectElement = document.getElementById("cancel-reason-preset") as HTMLSelectElement;
          const selectedReason = selectElement ? selectElement.value : "";
          const additionalDetails = (document.querySelector(".swal2-textarea") as HTMLTextAreaElement).value;

          if (selectedReason === "Other") {
            return additionalDetails.trim() ? additionalDetails : "Other reasons";
          } else if (selectedReason) {
            return additionalDetails.trim() ? `${selectedReason} - ${additionalDetails}` : selectedReason;
          }
          return additionalDetails;
        },
      });

      if (isConfirmed && cancelReason) {
        // Call the updated cancelOrder method with reason
        const success = await cancelOrder(orderId, cancelReason);

        if (success) {
          Swal.fire({
            icon: "success",
            title: "Order Cancelled",
            text: "Your order has been cancelled successfully.",
          });
        } else {
          throw new Error("Failed to cancel order");
        }
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to cancel order. Please try again or contact customer support.",
      });
    } finally {
      setCancelProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">My Orders</h1>
        <div className="h-1 w-20 bg-purple-600 rounded"></div>
      </div>

      {/* Orders Summary Cards */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm border border-blue-200">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-full mr-4">
                <HiOutlineDocumentText className="text-white text-xl" />
              </div>
              <div>
                <p className="text-blue-700 text-sm font-semibold">Total Orders</p>
                <p className="text-2xl font-bold text-blue-800">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-sm border border-green-200">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-full mr-4">
                <HiOutlineStatusOnline className="text-white text-xl" />
              </div>
              <div>
                <p className="text-green-700 text-sm font-semibold">Completed</p>
                <p className="text-2xl font-bold text-green-800">
                  {orders.filter((order) => order.orderStatus === "Completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl shadow-sm border border-yellow-200">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-3 rounded-full mr-4">
                <FaBox className="text-white text-xl" />
              </div>
              <div>
                <p className="text-yellow-700 text-sm font-semibold">In Progress</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {orders.filter((order) => ["Pending", "In Process", "Shipping"].includes(order.orderStatus)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl shadow-sm border border-purple-200">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-full mr-4">
                <RiMoneyDollarCircleLine className="text-white text-xl" />
              </div>
              <div>
                <p className="text-purple-700 text-sm font-semibold">Total Spent</p>
                <p className="text-2xl font-bold text-purple-800">
                  ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white shadow-lg rounded-xl p-10 text-center border border-gray-100">
          <div className="mb-6 mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">You have not placed any orders yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Explore our wide range of products and find something you will love.
          </p>
          <Link
            href="/"
            className="btn btn-primary bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <HiOutlineDocumentText />
                      Order ID
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <HiOutlineStatusOnline />
                      Status
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <RiMoneyDollarCircleLine />
                      Total
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaBox />
                      Items
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        #{order.id?.substring(0, 8)}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <span>
                          {order.createdAt instanceof Timestamp
                            ? order.createdAt.toDate().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Processing"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                        {order.orderStatus === "Completed" && <FaLock className="ml-1 inline text-xs" />}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {order.orderItems.length} {order.orderItems.length === 1 ? "item" : "items"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
                      >
                        <span className="text-sm">Details</span>
                      </Link>

                      {order.orderStatus === "Pending" && (
                        <button
                          className="inline-flex items-center text-red-600 hover:text-red-900 px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                          onClick={() => handleCancelOrder(order.id as string)}
                          disabled={cancelProcessing}
                        >
                          <span className="text-sm">{cancelProcessing ? "Cancelling..." : "Cancel"}</span>
                        </button>
                      )}

                      {order.orderStatus === "Completed" && (
                        <span className="inline-flex items-center text-gray-400 px-3 py-1 border border-gray-200 rounded-lg bg-gray-50">
                          <FaLock className="mr-1 text-xs" />
                          <span className="text-sm">Completed</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order List Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {orders.length} {orders.length === 1 ? "order" : "orders"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
