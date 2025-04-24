"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { doc, FieldValue, getDoc, Timestamp } from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { useAuthStore } from "@/store/authStore";

// Use the same Order type defined in the CheckoutPage
type OrderItem = {
  productID: string;
  productName: string;
  productImage: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
};

type OrderStatus = "Pending" | "In Process" | "Shipping" | "Completed" | "Cancelled" | "Refunded";

type Order = {
  id?: string;
  customerID: string;
  customerName: string;
  email: string;
  phone: string;
  createdAt: FieldValue | Date; // ISO string format
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  orderStatus: OrderStatus;
  orderItems: OrderItem[];
  totalAmount: number;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: "COD" | "Card" | "Paypal";
  notes?: string;
};

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        if (!orderId) {
          setError("Order ID is missing");
          setLoading(false);
          return;
        }

        const orderRef = doc(db, "orders", orderId as string);
        const orderDoc = await getDoc(orderRef);

        if (!orderDoc.exists()) {
          setError("Order not found");
          setLoading(false);
          return;
        }

        // Check if the order belongs to the current user
        const orderData = orderDoc.data() as Order;
        if (orderData.customerID !== user.uid) {
          setError("You don't have permission to view this order");
          setLoading(false);
          return;
        }

        setOrder({ ...orderData, id: orderDoc.id });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
        setLoading(false);
      }
    };

    if (user) {
      fetchOrderDetails();
    }
  }, [orderId, router, user]);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error || "Order not found"}</p>
          <div className="flex justify-between">
            <Link href="/cart" className="btn btn-outline">
              Back to Cart
            </Link>
            <Link href="/" className="btn bg-purple-700 text-white">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format date
  const orderDate = order.createdAt instanceof Timestamp ? order.createdAt.toDate().toLocaleDateString() : "Processing";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold">Order Confirmation</h1>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {order.orderStatus}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Thank You for Your Order!</h2>
          <p className="text-gray-600 mb-4">
            Your order has been received and is now being processed. Your order details are shown below for your
            reference.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Order Information</h3>
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Date:</strong> {orderDate}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong> {order.orderStatus}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <p>{order.customerName}</p>
              <p>{order.deliveryAddress.street}</p>
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
              </p>
              <p>{order.deliveryAddress.country}</p>
              <p>Phone: {order.phone}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.orderItems.map((item) => (
                  <tr key={item.productID}>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-12 h-12 relative mr-3">
                          <Image src={item.productImage} alt={item.productName} fill className="object-cover rounded" />
                        </div>
                        <span>{item.productName}</span>
                      </div>
                    </td>
                    <td className="p-3">${item.pricePerUnit.toFixed(2)}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3 text-right">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2">
                <tr>
                  <td colSpan={3} className="p-3 text-right font-medium">
                    Subtotal
                  </td>
                  <td className="p-3 text-right">${(order.totalAmount - order.shippingCost).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-3 text-right font-medium">
                    Shipping ({order.shippingMethod})
                  </td>
                  <td className="p-3 text-right">${order.shippingCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-3 text-right font-bold">
                    Total
                  </td>
                  <td className="p-3 text-right font-bold">${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {order.notes && (
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-medium mb-2">Order Notes</h3>
            <p className="text-gray-700">{order.notes}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Link href="/" className="btn btn-outline">
            Continue Shopping
          </Link>
          <Link href="/orders" className="btn bg-purple-700 text-white">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
