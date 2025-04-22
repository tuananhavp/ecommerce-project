"use client";
import React, { useState } from "react";

import Link from "next/link";

// interface OrderSummaryProps {
//   products: Array<{
//     id: string;
//     name: string;
//     quantity: number;
//     price: number;
//   }>;
//   shippingMethods: Array<{
//     id: string;
//     name: string;
//     price: number;
//   }>;
//   onPlaceOrder?: () => void;
// }

const OrderSummaryAside = () => {
  const products = [
    { id: "1", name: "Product 1", quantity: 2, price: 20 },
    { id: "2", name: "Product 2", quantity: 1, price: 15 },
    { id: "3", name: "Product 3", quantity: 3, price: 10 },
  ];
  const shippingMethods = [
    { id: "flat_rate", name: "Flat rate", price: 10 },
    { id: "free_shipping", name: "Free shipping", price: 0 },
    { id: "local_pickup", name: "Local pickup", price: 5 },
  ];
  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0]?.id || "");
  const [selectedPayment, setSelectedPayment] = useState("bank_transfer");
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Calculate subtotal
  const subtotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

  // Find selected shipping method
  const selectedShippingMethod = shippingMethods.find((method) => method.id === selectedShipping);
  const shippingCost = selectedShippingMethod?.price || 0;

  // Calculate total
  const total = subtotal + shippingCost;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Your order</h2>

      <div className="flex justify-between text-gray-500 mb-2">
        <span>Product</span>
        <span>Subtotal</span>
      </div>

      <div className="border-t border-gray-200 py-4">
        {products.map((product) => (
          <div key={product.id} className="flex justify-between mb-2">
            <div>
              {product.name} <span className="text-gray-500">× {product.quantity}</span>
            </div>
            <div>${product.price.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t border-gray-200 py-4 text-gray-500">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between items-center border-t border-gray-200 py-4">
        <span className="text-gray-500">Shipping:</span>
        <div className="flex flex-col space-y-2">
          {shippingMethods.map((method) => (
            <label key={method.id} className="flex items-center justify-end gap-2">
              <span>{method.name === "Flat rate" ? `${method.name}: $${method.price.toFixed(2)}` : method.name}</span>
              <input
                type="radio"
                name="shipping"
                value={method.id}
                checked={selectedShipping === method.id}
                onChange={() => setSelectedShipping(method.id)}
                className="radio"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between border-t border-gray-200 py-4 font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-200 py-4">
        <label className="flex items-center mb-4">
          <input
            type="radio"
            name="payment"
            value="bank_transfer"
            checked={selectedPayment === "bank_transfer"}
            onChange={() => setSelectedPayment("bank_transfer")}
            className="radio mr-2"
          />
          <span className="font-bold">Direct Bank Transfer</span>
        </label>

        {selectedPayment === "bank_transfer" && (
          <p className="text-gray-600 text-sm ml-6 mb-4">
            Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your
            order will not be shipped until the funds have cleared in our account.
          </p>
        )}

        <label className="flex items-center mb-4">
          <input
            type="radio"
            name="payment"
            value="check"
            checked={selectedPayment === "check"}
            onChange={() => setSelectedPayment("check")}
            className="radio mr-2"
          />
          <span className="font-bold">Check Payments</span>
        </label>

        <label className="flex items-center mb-4">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={selectedPayment === "cod"}
            onChange={() => setSelectedPayment("cod")}
            className="radio mr-2"
          />
          <span className="font-bold">Cash On Delivery</span>
        </label>
      </div>

      <div className="text-gray-600 text-sm mb-4">
        Your personal data will be used to process your order, support your experience throughout this website, and for
        other purposes described in our{" "}
        <Link href="/privacy-policy" className="text-purple-700 underline">
          privacy policy
        </Link>
        .
      </div>

      <label className="flex items-start mb-6">
        <input
          type="checkbox"
          checked={termsAgreed}
          onChange={() => setTermsAgreed(!termsAgreed)}
          className="checkbox mt-1 mr-2"
        />
        <span className="text-sm">
          I have read and agree to the website{" "}
          <Link href="/terms" className="text-purple-700 underline">
            terms and conditions
          </Link>{" "}
          *
        </span>
      </label>

      <button
        // onClick={onPlaceOrder}
        disabled={!termsAgreed}
        className="w-full bg-purple-700 text-white py-3 rounded-md font-medium hover:bg-purple-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        Place order
      </button>
    </div>
  );
};

export default OrderSummaryAside;
