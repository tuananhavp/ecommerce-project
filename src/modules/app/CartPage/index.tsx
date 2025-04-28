"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Swal from "sweetalert2";

import NotFound from "@/components/NotFound";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

const CartPage = () => {
  const router = useRouter();
  const {
    items,
    selectedItems,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    getSelectedItemsCount,
    getSelectedItemsTotal,
  } = useCartStore();

  const { user } = useAuthStore();
  const [isAllSelected, setIsAllSelected] = useState(false);

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    if (user?.uid) {
      useCartStore.getState().fetchCart();
    }
  }, [user]);

  // Update isAllSelected when items or selectedItems change
  useEffect(() => {
    setIsAllSelected(items.length > 0 && selectedItems.length === items.length);
  }, [items, selectedItems]);

  // Handle item removal with confirmation
  const handleRemoveItem = (productID: string, productName: string) => {
    Swal.fire({
      title: "Remove Item",
      text: `Are you sure you want to remove ${productName} from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(productID);
        Swal.fire({
          title: "Removed!",
          text: `${productName} has been removed from your cart.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Handle clear cart with confirmation
  const handleClearCart = () => {
    Swal.fire({
      title: "Clear Cart",
      text: "Are you sure you want to remove all items from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "No, keep items",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire({
          title: "Cleared!",
          text: "Your cart has been cleared.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Handle toggle all items selection
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      deselectAllItems();
    } else {
      selectAllItems();
    }
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    const selectedCount = getSelectedItemsCount();
    if (selectedCount === 0) {
      Swal.fire({
        title: "No Items Selected",
        text: "Please select at least one item to proceed to checkout.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 py-36">
        <NotFound title="Your cart is Empty" />
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto md:w-8/12 lg:w-10/12 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button className="btn btn-sm btn-error" onClick={handleClearCart}>
          Clear Cart
        </button>
      </div>

      {/* Selection header */}
      <div className="flex justify-between items-center p-2 bg-gray-100 rounded mb-4">
        <div className="flex items-center">
          <input type="checkbox" className="checkbox mr-2" checked={isAllSelected} onChange={handleToggleSelectAll} />
          <span>Select All Items</span>
        </div>
        <div className="text-sm">
          {getSelectedItemsCount()} of {items.length} items selected
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productID}
            className={`flex shadow-md p-4 rounded-lg items-center hover:shadow-lg transition ${
              selectedItems.includes(item.productID) ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center mr-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={selectedItems.includes(item.productID)}
                onChange={() => toggleItemSelection(item.productID)}
              />
            </div>

            <div className="w-20 h-20 relative flex-shrink-0">
              <Image src={item.imgUrl} alt={item.name} fill className="object-cover rounded" />
            </div>

            <div className="ml-4 flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>

              <div className="flex items-center mt-2">
                <button
                  className="btn btn-xs btn-outline"
                  onClick={() => updateCartItemQuantity(item.productID, Math.max(1, item.quantity - 1))}
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  className="btn btn-xs btn-outline"
                  onClick={() => updateCartItemQuantity(item.productID, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <button
                className="btn btn-xs btn-error btn-outline"
                onClick={() => handleRemoveItem(item.productID, item.name)}
              >
                Remove
              </button>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Cart Total:</span>
            <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-purple-700">
            <span className="font-medium">Selected Items Total:</span>
            <span className="font-bold text-lg">${getSelectedItemsTotal().toFixed(2)}</span>
          </div>
        </div>

        <button
          className={`btn ${getSelectedItemsCount() > 0 ? "bg-purple-primary" : "bg-gray-400"} text-white w-full mt-4`}
          onClick={handleProceedToCheckout}
          disabled={getSelectedItemsCount() === 0}
        >
          {getSelectedItemsCount() === 0
            ? "Select items to checkout"
            : `Proceed to Checkout (${getSelectedItemsCount()} items)`}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
