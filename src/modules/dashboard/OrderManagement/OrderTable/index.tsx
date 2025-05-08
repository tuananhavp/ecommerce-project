"use client";
import React, { useState, useEffect } from "react";

import Link from "next/link";

import { Timestamp, serverTimestamp, FieldValue } from "firebase/firestore";
import { FaEye, FaSpinner, FaLock } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdCheckCircle, MdLocalShipping, MdCancel } from "react-icons/md";
import { RiFileListLine } from "react-icons/ri";
import Swal from "sweetalert2";

import Loading from "@/components/Loading";
import { useOrderStore } from "@/store/orderStore";
import { Order, OrderStatus } from "@/types/order.types";

// Define filter options
type FilterOption = {
  label: string;
  value: OrderStatus | "all";
};

const filterOptions: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "In Process", value: "In Process" },
  { label: "Shipping", value: "Shipping" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Refunded", value: "Refunded" },
];

// Status color mapping
const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Process": "bg-blue-100 text-blue-800",
  Shipping: "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Refunded: "bg-gray-100 text-gray-800",
};

// Status icon mapping
const statusIcons = {
  Pending: <RiFileListLine className="mr-1" />,
  "In Process": <FaSpinner className="mr-1 animate-spin" />,
  Shipping: <MdLocalShipping className="mr-1" />,
  Completed: <MdCheckCircle className="mr-1" />,
  Cancelled: <MdCancel className="mr-1" />,
  Refunded: <MdCancel className="mr-1" />,
};

// Admin view component - shows all orders
const OrdersTable = () => {
  // Get orders and methods from OrderStore
  const { orders, isLoading, error, fetchOrders, updateOrderStatus } = useOrderStore();

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Fetch all orders (admin view) - no customerId filter
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Apply filters
  useEffect(() => {
    let result = orders;

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }

    // Apply search filter (search by customer name, email, or ID)
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.customerName.toLowerCase().includes(lowerSearchTerm) ||
          order.email.toLowerCase().includes(lowerSearchTerm) ||
          order.id?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59); // Include the entire end day

      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      result = result.filter((order) => {
        if (!order.createdAt || !("toDate" in order.createdAt)) return false;

        // Now we know createdAt has toDate method
        return order.createdAt >= startTimestamp && order.createdAt <= endTimestamp;
      });
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchTerm, dateRange]);

  // Handle status change using the store
  const handleStatusChange = async (orderId: string, currentStatus: OrderStatus, newStatus: OrderStatus) => {
    // Check if the order is already completed, if so, don't allow changes
    if (currentStatus === "Completed") {
      Swal.fire({
        icon: "info",
        title: "Status Locked",
        text: "This order is already completed and its status cannot be changed.",
      });
      return;
    }

    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Update Order Status",
        text: `Are you sure you want to change this order status to ${newStatus}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4F46E5",
        cancelButtonColor: "gray",
        cancelButtonText: "No, keep it!",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        // Use OrderStore to update status
        const success = await updateOrderStatus(orderId, newStatus);

        if (success) {
          Swal.fire("Updated!", "Order status has been updated successfully.", "success");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to update order status",
          });
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update order status",
      });
    }
  };

  // Format date
  const formatDate = (timestamp: Timestamp | FieldValue | Date | null | undefined) => {
    if (!timestamp) return "N/A";

    try {
      // For serverTimestamp() that hasn't been set yet
      if (timestamp === serverTimestamp()) {
        return "Pending...";
      }

      // For Firestore timestamps that have toDate() method
      if ("toDate" in timestamp && typeof timestamp.toDate === "function") {
        return timestamp.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // For JavaScript Date objects
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      return "Invalid date";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Show error message if OrderStore reports an error
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="alert alert-error">
          <div className="flex-1">
            <span>Error loading orders: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Orders Management</h2>
        <div className="stats bg-purple-50 border border-purple-100">
          <div className="stat">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value text-purple-600">{orders.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select
            className="select select-bordered w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">No orders found matching the filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="hidden lg:table-cell">Order ID</th>
                <th>Customer</th>
                <th className="hidden md:table-cell">Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th className="hidden md:table-cell">Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover">
                  <td className="hidden lg:table-cell">
                    <span className="text-xs font-mono">#{order.id?.substring(0, 8)}...</span>
                  </td>
                  <td>
                    <div>
                      <div className="font-semibold">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">{formatDate(order.createdAt)}</td>
                  <td>
                    <span className="badge badge-ghost">{order.orderItems.length} items</span>
                  </td>
                  <td className="font-semibold">${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[order.orderStatus]
                      }`}
                    >
                      {statusIcons[order.orderStatus]}
                      {order.orderStatus}
                      {order.orderStatus === "Completed" && <FaLock className="ml-1 text-xs" />}
                    </span>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="badge badge-outline">{order.paymentMethod}</span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-3">
                      <Link href={`/dashboard/order/${order.id}`} className="btn btn-ghost btn-xs">
                        <FaEye className="text-blue-600" />
                      </Link>

                      {order.orderStatus === "Completed" || order.orderStatus === "Cancelled" ? (
                        <button
                          className="btn btn-ghost btn-xs opacity-50 cursor-not-allowed flex items-center gap-1"
                          disabled
                          title="Completed orders cannot be modified"
                        >
                          <FaLock className="text-xs" />
                          Locked
                        </button>
                      ) : (
                        <div className="dropdown dropdown-bottom border-2 border-gray-200 rounded-lg">
                          <label tabIndex={0} className="btn btn-ghost btn-xs">
                            Status
                            <IoMdArrowDropdown />
                          </label>

                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
                          >
                            {Object.keys(statusColors).map((status) => (
                              <li key={status}>
                                <button
                                  onClick={() =>
                                    handleStatusChange(order.id as string, order.orderStatus, status as OrderStatus)
                                  }
                                  disabled={order.orderStatus === status}
                                >
                                  {status}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination placeholder - could be implemented if needed */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
        <div className="join">
          <button className="join-item btn">«</button>
          <button className="join-item btn">1</button>
          <button className="join-item btn btn-active">2</button>
          <button className="join-item btn">3</button>
          <button className="join-item btn">»</button>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
