"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { doc, FieldValue, getDoc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";

import { db } from "@/firebase/firebase";
import { Order, OrderStatus } from "@/store/orderStore";

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
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          setOrder({ ...orderSnap.data(), id: orderSnap.id } as Order);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Order not found",
          });
          router.push("/dashboard/order");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load order details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  // Format date
  const formatDate = (timestamp: Timestamp | FieldValue | null | undefined) => {
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

      return "Invalid date";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setProcessing(true);

      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Update Order Status",
        text: `Are you sure you want to change this order status to ${newStatus}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4F46E5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        // Update in Firestore
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
          orderStatus: newStatus,
        });

        // Update local state
        setOrder((order) => (order ? { ...order, orderStatus: newStatus } : null));

        Swal.fire("Updated!", "Order status has been updated successfully.", "success");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <FaSpinner className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Order not found</p>
        <Link href="/dashboard/order" className="btn btn-primary mt-4">
          Back to Orders
        </Link>
      </div>
    );
  }

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
          </span>

          <div className="mt-3">
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
          </div>
        </div>
      </div>

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
      </div>
    </div>
  );
};

export default OrderDetail;
