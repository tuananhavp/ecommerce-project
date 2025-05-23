import React from "react";

import Image from "next/image";

import Swal from "sweetalert2";

import { useCartStore } from "@/store/cartStore";

interface CartItemProps {
  item: {
    productID: string;
    name: string;
    price: number;
    quantity: number;
    imgUrl: string;
  };
  isSelected: boolean;
}

const CartItem = ({ item, isSelected }: CartItemProps) => {
  const { toggleItemSelection, updateCartItemQuantity, removeFromCart } = useCartStore();

  // Handle item removal with confirmation
  const handleRemoveItem = () => {
    Swal.fire({
      title: "Remove Item",
      text: `Are you sure you want to remove ${item.name} from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(item.productID);
        Swal.fire({
          title: "Removed!",
          text: `${item.name} has been removed from your cart.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Decrement quantity with a minimum of 1
  const decrementQuantity = () => {
    updateCartItemQuantity(item.productID, Math.max(1, item.quantity - 1));
  };

  // Increment quantity
  const incrementQuantity = () => {
    updateCartItemQuantity(item.productID, item.quantity + 1);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row shadow-md p-3 sm:p-4 rounded-lg items-start sm:items-center hover:shadow-lg transition gap-3 sm:gap-0 ${
        isSelected ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center mr-2 self-start">
        <input
          type="checkbox"
          className="checkbox"
          checked={isSelected}
          onChange={() => toggleItemSelection(item.productID)}
          aria-label={`Select ${item.name}`}
        />
      </div>

      <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0">
        <Image
          src={item.imgUrl}
          alt={item.name}
          fill
          className="object-cover rounded"
          sizes="(max-width: 640px) 64px, 80px"
          loading="lazy"
        />
      </div>

      <div className="ml-0 sm:ml-4 flex-1">
        <h3 className="font-medium text-sm sm:text-base line-clamp-1">{item.name}</h3>
        <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>

        <div className="flex items-center mt-2">
          <button
            className="btn btn-xs btn-outline px-2 h-6"
            onClick={decrementQuantity}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="mx-2 text-sm">{item.quantity}</span>
          <button
            className="btn btn-xs btn-outline px-2 h-6"
            onClick={incrementQuantity}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col w-full sm:w-auto items-center sm:items-end justify-between sm:justify-between gap-2 mt-2 sm:mt-0">
        <button
          className="btn btn-xs btn-error btn-outline whitespace-nowrap"
          onClick={handleRemoveItem}
          aria-label={`Remove ${item.name} from cart`}
        >
          Remove
        </button>
        <p className="font-medium text-sm sm:text-base">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default React.memo(CartItem);
