"use client";
import React, { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { FieldValue, Timestamp } from "firebase/firestore";
import { FaBox, FaCheckCircle, FaMapMarkerAlt, FaShippingFast, FaUser } from "react-icons/fa";
import { HiOutlineDocumentText, HiOutlineStatusOnline } from "react-icons/hi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

import { getStatusColor } from "@/helpers";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentOrder, isLoading, error, getOrderById } = useOrderStore();

  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchOrderDetails = async () => {
      if (!orderId) {
        return;
      }

      const order = await getOrderById(orderId as string);

      // Check if order exists and belongs to current user
      if (order && order.customerID !== user.uid) {
        router.push("/orders");
      }
    };

    if (user) {
      fetchOrderDetails();
    }
  }, [orderId, router, user, getOrderById]);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-700 font-medium">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h1>
            <p className="text-gray-600">{error || "We couldn't locate the order you're looking for."}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/cart"
              className="btn btn-outline bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg transition w-full text-center"
            >
              Back to Cart
            </Link>
            <Link
              href="/"
              className="btn bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition w-full text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (timestamp: Timestamp | FieldValue | Date | null | undefined) => {
    if (!timestamp) return "Processing";

    try {
      // For Firestore timestamps that have toDate() method
      if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // For regular JS Date objects
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      return "Processing";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Processing";
    }
  };

  const order = currentOrder;
  const orderDate = formatDate(order.createdAt);

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="white" />
            <path d="M0,0 L100,0 L0,100 Z" fill="white" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4 mx-auto">
            <FaCheckCircle className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Your order has been received and is now being processed. We will send you an update when it ships.
          </p>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-purple-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                <HiOutlineStatusOnline className="mr-1.5" />
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Order Info Panels */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Order Information */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <HiOutlineDocumentText className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-blue-800">Order Information</h3>
              </div>
              <div className="space-y-2 text-blue-900">
                <p className="flex justify-between">
                  <span className="text-blue-700">Order ID:</span>
                  <span className="font-mono">{order.id?.substring(0, 12)}...</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-blue-700">Date:</span>
                  <span>{orderDate}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-blue-700">Payment Method:</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-blue-700">Shipping Method:</span>
                  <span>{order.shippingMethod}</span>
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <FaMapMarkerAlt className="text-purple-600 text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-purple-800">Shipping Address</h3>
              </div>
              <div className="space-y-2 text-purple-900">
                <p className="flex items-center">
                  <FaUser className="text-purple-400 mr-2 text-sm" />
                  <span>{order.customerName}</span>
                </p>
                <p className="flex items-center">
                  <FaMapMarkerAlt className="text-purple-400 mr-2 text-sm" />
                  <span>{order.deliveryAddress.street}</span>
                </p>
                <p className="ml-6">
                  {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
                </p>
                <p className="ml-6">{order.deliveryAddress.country}</p>
                <p className="flex items-center mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{order.phone}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <FaBox className="text-gray-600 text-xl mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Order Items</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="p-4 text-gray-600 font-medium">Product</th>
                    <th className="p-4 text-gray-600 font-medium">Price</th>
                    <th className="p-4 text-gray-600 font-medium">Quantity</th>
                    <th className="p-4 text-gray-600 font-medium text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.orderItems.map((item) => (
                    <tr key={item.productID} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 relative rounded overflow-hidden border border-gray-200 mr-4 flex-shrink-0">
                            <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{item.productName}</h4>
                            <p className="text-xs text-gray-500">ID: {item.productID.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">${item.pricePerUnit.toFixed(2)}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-gray-800">${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr className="border-t-2 border-gray-200">
                    <td colSpan={3} className="p-4 text-right text-gray-600 font-medium">
                      Subtotal
                    </td>
                    <td className="p-4 text-right text-gray-800 font-medium">
                      ${(order.totalAmount - order.shippingCost).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="p-4 text-right text-gray-600 font-medium">
                      <div className="flex items-center justify-end">
                        <FaShippingFast className="mr-2 text-gray-500" />
                        Shipping ({order.shippingMethod})
                      </div>
                    </td>
                    <td className="p-4 text-right text-gray-800 font-medium">${order.shippingCost.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="p-4 text-right text-gray-900 font-bold text-lg">
                      <div className="flex items-center justify-end">
                        <RiMoneyDollarCircleLine className="mr-2 text-gray-700" />
                        Total
                      </div>
                    </td>
                    <td className="p-4 text-right text-indigo-600 font-bold text-lg">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Order Notes (if any) */}
          {order.notes && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-amber-800">Order Notes</h3>
              </div>
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-gray-700 italic">{order.notes}</p>
              </div>
            </div>
          )}

          {/* What's Next Information */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              What&apos;s Next?
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-green-700 font-medium">Order Processing</h4>
                  <p className="text-green-600">
                    We are preparing your order for shipment. You will receive an email when it is ready.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-green-700 font-medium">Shipping</h4>
                  <p className="text-green-600">
                    Your order will be shipped via {order.shippingMethod}. We will provide tracking information.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-green-700 font-medium">Delivery</h4>
                  <p className="text-green-600">
                    Enjoy your purchase! Do not forget to leave a review after you receive your items.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link
              href="/"
              className="btn btn-outline bg-white border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
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
              Continue Shopping
            </Link>
            <div className="flex gap-4 w-full sm:w-auto">
              <Link
                href="/orders"
                className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
              >
                <HiOutlineDocumentText className="text-lg" />
                View All Orders
              </Link>
              <button
                onClick={() => window.print()}
                className="btn bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all"
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
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
