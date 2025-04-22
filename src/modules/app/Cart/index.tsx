"use client";
import React from "react";

import Image from "next/image";

import NotFound from "@/components/NotFound";
import useCartStore from "@/store/cartStore";

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 py-36">
        <NotFound title="Your cart is Empty" />
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto md:w-8/12 lg:w-10/12 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button className="btn btn-sm btn-error" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productID}
            className="flex shadow-md p-4 rounded-lg bg-gray-50 items-center hover:shadow-lg transition"
          >
            <div className="w-20 h-20 relative flex-shrink-0">
              <Image src={item.imgUrl} alt={item.name} fill className="object-cover rounded" />
            </div>

            <div className="ml-4 flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>

              <div className="flex items-center mt-2">
                <button
                  className="btn btn-xs btn-outline"
                  onClick={() => updateQuantity(item.productID, Math.max(1, item.quantity - 1))}
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  className="btn btn-xs btn-outline"
                  onClick={() => updateQuantity(item.productID, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <button className="btn btn-xs btn-error btn-outline" onClick={() => removeItem(item.productID)}>
                Remove
              </button>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="font-bold">Total:</span>
          <span className="font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
        </div>

        <button className="btn bg-purple-primary text-white w-full mt-4">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
