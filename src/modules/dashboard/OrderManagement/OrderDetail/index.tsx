"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { FieldValue, serverTimestamp, Timestamp } from "firebase/firestore";
import { FaArrowLeft, FaExclamationTriangle, FaLock, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";

import { useOrderStore } from "@/store/orderStore";
import { OrderStatus } from "@/types/order.types";

// Status color mapping (same as in OrdersTable)
const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Process": "bg-blue-100 text-blue-800",
  Shipping: "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Refunded: "bg-gray-100 text-gray-800",
};

const OrderDetail = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  // Get state and methods from OrderStore
  const { currentOrder, isLoading, error, getOrderById, updateOrderStatus } = useOrderStore();
  const [processing, setProcessing] = useState(false);

  // Fetch order details using the store
  useEffect(() => {
    const fetchOrder = async () => {
      const result = await getOrderById(orderId);

      if (!result) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Order not found",
        });
        router.push("/dashboard/order");
      }
    };

    fetchOrder();
  }, [orderId, router, getOrderById]);

  // Show error if there's any
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
    }
  }, [error]);

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

  // Handle status change using the store
  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!currentOrder) return;

    // Check if order is already completed, if so, don't allow changes
    if (currentOrder.orderStatus === "Completed") {
      Swal.fire({
        icon: "info",
        title: "Status Locked",
        text: "This order is already completed and its status cannot be changed.",
      });
      return;
    }

    try {
      setProcessing(true);

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
        // Update order status using OrderStore
        const success = await updateOrderStatus(orderId, newStatus);

        if (success) {
          Swal.fire("Updated!", "Order status has been updated successfully.", "success");
        } else {
          throw new Error("Failed to update order status");
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update order status",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <FaSpinner className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Order not found</p>
        <Link href="/dashboard/order" className="btn btn-primary mt-4">
          Back to Orders
        </Link>
      </div>
    );
  }

  // For simplicity, use order alias for currentOrder
  const order = currentOrder;
  // Check if the order status is completed (for conditional rendering)
  const isCompleted = order.orderStatus === "Completed";
  // Check if the order is cancelled
  const isCancelled = order.orderStatus === "Cancelled";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard/order" className="btn btn-ghost">
              <FaArrowLeft />
            </Link>
            <h2 className="text-2xl font-semibold">Order Details</h2>
          </div>
          <div className="text-gray-500 mb-2">
            Order ID: <span className="font-mono">{order.id}</span>
          </div>
          <div className="text-gray-500">Placed on: {formatDate(order.createdAt)}</div>
        </div>

        <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[order.orderStatus]
            }`}
          >
            {order.orderStatus}
            {isCompleted && <FaLock className="ml-1 text-xs" />}
          </span>

          <div className="mt-3">
            {isCompleted ? (
              // If completed, show a disabled button
              <button className="btn btn-primary btn-sm opacity-50 cursor-not-allowed flex items-center gap-1" disabled>
                <FaLock className="text-xs" /> Status Locked
              </button>
            ) : (
              // If not completed, show the dropdown
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-primary btn-sm">
                  {processing ? <FaSpinner className="animate-spin mr-2" /> : null}
                  Update Status
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                  {Object.keys(statusColors).map((status) => (
                    <li key={status}>
                      <button
                        onClick={() => handleStatusChange(status as OrderStatus)}
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
        </div>
      </div>

      {/* Cancellation Reason Section - Only show for cancelled orders */}
      {isCancelled && order.cancellationReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <FaExclamationTriangle className="text-red-500 text-lg" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Cancellation Reason</h3>
              <div className="mt-2 text-red-700">
                <p>{order.cancellationReason}</p>
              </div>
              {order.cancelledAt && (
                <p className="mt-1 text-sm text-red-500">Cancelled on: {formatDate(order.cancelledAt)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Customer Information */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-lg">Customer Information</h3>
            <div className="mt-2">
              <p className="font-semibold">{order.customerName}</p>
              <p className="text-gray-600">{order.email}</p>
              <p className="text-gray-600">{order.phone}</p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-lg">Shipping Information</h3>
            <div className="mt-2">
              <p className="text-gray-600">{order.deliveryAddress.street}</p>
              <p className="text-gray-600">
                {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
              </p>
              <p className="text-gray-600">{order.deliveryAddress.country}</p>
              <p className="mt-2 text-sm">
                <span className="font-semibold">Shipping Method:</span> {order.shippingMethod}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <h3 className="card-title text-lg">Payment Information</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-semibold">Payment Method</p>
              <p className="badge badge-outline">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Payment Status</p>
              <p className="badge badge-outline">{order.paymentMethod === "COD" ? "Cash On Delivery" : "Paid"}</p>
            </div>
            {order.trackingNumber && (
              <div>
                <p className="text-sm font-semibold">Tracking Number</p>
                <p className="font-mono text-sm">{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-12 h-12 relative">
                            <Image
                              src={item.productImage || "/placeholder-product.png"}
                              alt={item.productName}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">{item.productName}</div>
                          <div className="text-xs text-gray-500">ID: {item.productID.substring(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td>${item.pricePerUnit.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td className="text-right">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="text-right font-semibold">
                    Subtotal
                  </td>
                  <td className="text-right">${(order.totalAmount - order.shippingCost).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right font-semibold">
                    Shipping
                  </td>
                  <td className="text-right">${order.shippingCost.toFixed(2)}</td>
                </tr>
                <tr className="text-lg">
                  <td colSpan={3} className="text-right font-bold">
                    Total
                  </td>
                  <td className="text-right font-bold">${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="card bg-base-100 shadow-sm mb-6">
          <div className="card-body">
            <h3 className="card-title text-lg">Order Notes</h3>
            <div className="mt-2 bg-gray-50 p-4 rounded">{order.notes}</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Link href="/dashboard/order" className="btn btn-outline">
          Back to Orders
        </Link>
        {!isCompleted ? (
          <div className="space-x-2">
            <button
              className="btn btn-outline btn-error"
              disabled={["Cancelled", "Refunded"].includes(order.orderStatus)}
              onClick={() => handleStatusChange("Cancelled")}
            >
              Cancel Order
            </button>
            {order.orderStatus === "Pending" && (
              <button className="btn btn-primary" onClick={() => handleStatusChange("In Process")}>
                Process Order
              </button>
            )}
            {order.orderStatus === "In Process" && (
              <button className="btn btn-primary" onClick={() => handleStatusChange("Shipping")}>
                Mark as Shipped
              </button>
            )}
            {order.orderStatus === "Shipping" && (
              <button className="btn btn-success" onClick={() => handleStatusChange("Completed")}>
                Mark as Delivered
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-green-600 mr-2">
              <FaLock />
            </span>
            <span className="text-gray-600">This order is completed and cannot be modified</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
