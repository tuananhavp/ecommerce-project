"use client";
import React, { useEffect, useState, useCallback } from "react";

import { useRouter } from "next/navigation";

import Swal from "sweetalert2";

import NotFound from "@/components/NotFound";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

import CartHeader from "./components/CartHeader";
import CartItemList from "./components/CartItemList";
import CartSummary from "./components/CartSummary";

const CartPage: React.FC = () => {
  const router = useRouter();
  const {
    items,
    selectedItems,
    clearCart,
    selectAllItems,
    deselectAllItems,
    getSelectedItemsCount,
    getSelectedItemsTotal,
    fetchCart,
  } = useCartStore();

  const { user } = useAuthStore();
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchCart();
    }
  }, [user, fetchCart]);

  // Update isAllSelected when items or selectedItems change
  useEffect(() => {
    setIsAllSelected(items.length > 0 && selectedItems.length === items.length);
  }, [items, selectedItems]);

  // Handle clear cart with confirmation
  const handleClearCart = useCallback(() => {
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
  }, [clearCart]);

  // Handle toggle all items selection
  const handleToggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      deselectAllItems();
    } else {
      selectAllItems();
    }
  }, [isAllSelected, selectAllItems, deselectAllItems]);

  // Handle proceed to checkout
  const handleProceedToCheckout = useCallback(() => {
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
  }, [getSelectedItemsCount, router]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 py-36">
        <NotFound title="Your cart is Empty" />
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto md:w-8/12 lg:w-10/12 bg-white shadow-md rounded-lg">
      <CartHeader
        onClearCart={handleClearCart}
        isAllSelected={isAllSelected}
        onToggleSelectAll={handleToggleSelectAll}
        selectedCount={getSelectedItemsCount()}
        totalCount={items.length}
      />

      <CartItemList items={items} selectedItems={selectedItems} />

      <CartSummary
        totalPrice={items.reduce((total, item) => total + item.price * item.quantity, 0)}
        selectedItemsTotal={getSelectedItemsTotal()}
        selectedItemsCount={getSelectedItemsCount()}
        onCheckout={handleProceedToCheckout}
      />
    </div>
  );
};

export default CartPage;
