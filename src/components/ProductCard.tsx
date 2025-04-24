import React, { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import Swal from "sweetalert2";

import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favouriteStore";
import { CartItem } from "@/types/cart.types";
import { ProductCardProps } from "@/types/product.types";

const ProductCard = ({
  id,
  name,
  description,
  oldPrice,
  newPrice,
  stockQuantity,
  trending,
  imgUrl,
}: ProductCardProps) => {
  const { addToCart } = useCartStore();
  const { addToFavorites, removeFromFavorites, isFavorite, fetchFavorites } = useFavoriteStore();
  const [isFav, setIsFav] = useState(false);

  // Calculate the effective price
  const price = (newPrice ?? 0) > 0 ? newPrice : oldPrice ?? 0;

  useEffect(() => {
    fetchFavorites();
    setIsFav(isFavorite(id));
  }, [id, isFavorite, fetchFavorites]);

  const handleAddToCart = async () => {
    // Create a cart item with the required properties
    const cartItem: CartItem = {
      productID: id,
      name: name,
      price: price ?? 0,
      imgUrl: imgUrl[0],
      quantity: 1, // Default quantity is 1 when adding to cart
    };

    try {
      // Add to cart
      await addToCart(cartItem);

      // Show success notification
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
      // Show error notification
      Swal.fire({
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to add item to cart",
        icon: "error",
        draggable: true,
      });
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFav) {
        await removeFromFavorites(id);
        setIsFav(false);
        Swal.fire({
          title: "Removed from Favorites",
          text: `${name} has been removed from your favorites.`,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        await addToFavorites({
          productID: id,
          name: name,
          price: price ?? 0,
          imgUrl: imgUrl[0],
        });
        setIsFav(true);
        Swal.fire({
          title: "Added to Favorites",
          text: `${name} has been added to your favorites.`,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to update favorites",
        icon: "error",
        draggable: true,
      });
    }
  };

  return (
    <div className="card bg-base-100 shadow-sm flex flex-col h-full hover:shadow-lg relative">
      <div className="absolute top-2 right-2 z-10">
        <button onClick={handleToggleFavorite} className="btn btn-circle btn-sm bg-white hover:bg-gray-100">
          {isFav ? <IoHeart className="size-5 text-red-500" /> : <IoHeartOutline className="size-5 text-gray-600" />}
        </button>
      </div>

      <Link href={`/product/${id}`} className="flex justify-center">
        <figure className="pt-4">
          <Image src={imgUrl[0]} alt={name} className="object-cover" width={177} height={177} />
        </figure>
      </Link>

      <div className="card-body flex flex-col flex-1">
        <Link href={`/product/${id}`} className="flex-1 flex flex-col">
          <div className="min-h-14">
            <span className="card-title lg:text-base sm:text-xs text-[10px]">{name}</span>
          </div>

          <div className="min-h-16 mb-2">
            {description.length <= 64 ? (
              <span className="text-gray-primary text-xs">{description}</span>
            ) : (
              <span className="text-gray-primary text-xs">{description.slice(0, 64)}...</span>
            )}
          </div>
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-2">
            <span
              className={clsx("text-red-primary font-bold lg:text-xl sm:text-sm text-xs", newPrice == 0 && "hidden")}
            >
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

          <span className="text-sm font-bold text-green-600">IN STOCK</span>
          <span className="text-gray-secondary text-xs block mb-2">
            Available only: <strong className="text-sm text-text-primary">{stockQuantity}</strong>
          </span>

          <div className="card-actions">
            <button
              className="btn btn-primary w-full bg-purple-primary"
              onClick={handleAddToCart}
              disabled={stockQuantity <= 0}
            >
              {stockQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
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

export default ProductCard;
