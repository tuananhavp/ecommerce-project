import React from "react";

import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";
import { FiPlusCircle } from "react-icons/fi";
import Swal from "sweetalert2";

import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/types/cart.types";
import { ProductCardProps } from "@/types/product.types";

const FeatureProductCard = ({ id, name, oldPrice, newPrice, stockQuantity, trending, imgUrl }: ProductCardProps) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = async () => {
    const price = (newPrice ?? 0) > 0 ? newPrice : oldPrice ?? 0;

    const cartItem: CartItem = {
      productID: id,
      name: name,
      price: price ?? 0,
      imgUrl: imgUrl[0],
      quantity: 1,
    };

    try {
      await addToCart(cartItem);

      Swal.fire({
        title: "Added to Cart",
        text: `${name} has been added to your cart.`,
        icon: "success",
        draggable: true,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to add item to cart",
        icon: "error",
        draggable: true,
      });
    }
  };

  const rating = 3;

  return (
    <div className="card lg:card-side bg-base-100 shadow-sm hover:shadow-lg">
      <Link href={`/product/${id}`}>
        <figure>
          <Image src={imgUrl[0]} alt={name} className="object-cover" width={177} height={177} />
        </figure>
      </Link>

      <div className="card-body">
        <Link href={`/product/${id}`}>
          <span className="card-title lg:text-base sm:text-xs text-[10px]">{name}</span>
        </Link>

        <div className="rating rating-xs">
          {Array.from({ length: 5 }).map((_, index) => {
            return index + 1 == rating ? (
              <input
                key={index}
                type="radio"
                name="rating-5"
                className="mask mask-star-2 bg-orange-400"
                aria-label={`${index + 1} star`}
                defaultChecked
              />
            ) : (
              <input
                key={index}
                type="radio"
                name="rating-5"
                className="mask mask-star-2 bg-orange-400"
                aria-label={`${index + 1} star`}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className={clsx("text-red-primary font-bold lg:text-xl sm:text-sm text-xs", newPrice == 0 && "hidden")}>
            ${newPrice}
          </span>
          <span
            className={clsx("text-text-primary lg:text-base sm: text-xs text-[10px]", {
              "text-red-primary font-bold lg:text-xl sm:text-sm text-xs": newPrice == 0,
              "line-through": newPrice !== 0,
            })}
          >
            ${oldPrice}
          </span>
        </div>

        <span className="text-gray-secondary text-xs">
          Available only: <strong className="text-sm text-text-primary">{stockQuantity}</strong>
        </span>

        <div className="card-actions">
          <button
            className="btn w-full rounded-2xl border-2 border-[#634C9F] text-[#634C9F]"
            onClick={handleAddToCart}
            disabled={stockQuantity <= 0}
          >
            {stockQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
            {stockQuantity > 0 && <FiPlusCircle className="size-4" />}
          </button>
        </div>
      </div>

      {trending && (
        <div className="rounded-full size-10 text-xs bg-red-600 absolute inset-1.5 flex items-center justify-center text-white animate-wiggle ease-in">
          New
        </div>
      )}
    </div>
  );
};

export default FeatureProductCard;
