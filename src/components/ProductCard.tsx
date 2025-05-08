import React, { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";
import { BsCart2 } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
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
  const [isHovered, setIsHovered] = useState(false);

  // Check if product is out of stock
  const isOutOfStock = stockQuantity <= 0;

  // Calculate the effective price
  const price = (newPrice ?? 0) > 0 ? newPrice : oldPrice ?? 0;

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-right",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  // Calculate discount percentage
  const discountPercentage =
    oldPrice && newPrice && newPrice < oldPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0;

  useEffect(() => {
    fetchFavorites();
    setIsFav(isFavorite(id));
  }, [id, isFavorite, fetchFavorites]);

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      Toast.fire({
        icon: "error",
        title: `${name} is currently out of stock`,
      });
      return;
    }

    const cartItem: CartItem = {
      productID: id,
      name: name,
      price: price ?? 0,
      imgUrl: imgUrl[0],
      quantity: 1,
    };

    try {
      await addToCart(cartItem);
      Toast.fire({
        icon: "success",
        title: `Added ${name} to cart`,
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
    <div
      className={clsx(
        "bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative overflow-hidden",
        { "opacity-90 grayscale-[30%]": isOutOfStock }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: "450px" }} // Fixed card height
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {trending && !isOutOfStock && (
          <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">NEW</div>
        )}
        {discountPercentage > 0 && !isOutOfStock && (
          <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-md">
            {discountPercentage}% OFF
          </div>
        )}
        {isOutOfStock && (
          <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">OUT OF STOCK</div>
        )}
      </div>

      {/* Favorite button */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow-sm transition-all duration-200 hover:bg-gray-100"
      >
        {isFav ? <IoHeart className="text-red-500 text-lg" /> : <IoHeartOutline className="text-gray-600 text-lg" />}
      </button>

      {/* Product Image with fixed height */}
      <div className="relative h-48 flex items-center justify-center pt-4 pb-2 px-4">
        <Link href={`/product/${id}`} className="w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={imgUrl[0]}
              alt={name}
              className={clsx(
                "object-contain transition-transform duration-500",
                isHovered ? "scale-110" : "scale-100"
              )}
              width={180}
              height={180}
              style={{ maxHeight: "100%", width: "auto" }}
            />

            {/* Overlay for out of stock products */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white bg-opacity-30 flex items-center justify-center">
                <div className="bg-red-500 bg-opacity-75 text-white px-3 py-2 rounded-full flex items-center shadow-lg">
                  <MdOutlineRemoveShoppingCart className="mr-1" />
                  <span className="text-sm font-medium">Out of Stock</span>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Quick action buttons */}
        <div
          className={clsx(
            "absolute left-0 right-0 bottom-0 flex justify-center gap-2 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Link
            href={`/product/${id}`}
            className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-all"
            title="View Details"
          >
            <FiEye className="text-gray-700" />
          </Link>
          <button
            onClick={handleAddToCart}
            className={clsx("bg-white p-2 rounded-full shadow-md transition-all", {
              "cursor-not-allowed opacity-50 hover:bg-gray-100": isOutOfStock,
              "hover:bg-gray-100": !isOutOfStock,
            })}
            disabled={isOutOfStock}
            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
          >
            <BsCart2 className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Product Details with fixed heights */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/product/${id}`} className="block group">
            <h3 className="font-medium text-gray-800 h-12 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {name}
            </h3>
          </Link>

          <div className="text-gray-500 text-sm h-12 line-clamp-2 mt-2">
            {description.length <= 64 ? description : `${description.slice(0, 64)}...`}
          </div>
        </div>

        {/* Price and actions - at the bottom */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-2">
            {newPrice != null && newPrice !== undefined && newPrice > 0 && (
              <span className={clsx("font-bold text-lg", isOutOfStock ? "text-gray-500" : "text-purple-600")}>
                ${newPrice}
              </span>
            )}
            <span
              className={clsx("text-gray-500", {
                "text-purple-600 font-bold text-lg": newPrice === 0 && !isOutOfStock,
                "text-gray-500 font-bold text-lg": newPrice === 0 && isOutOfStock,
                "text-sm line-through": newPrice !== 0,
              })}
            >
              ${oldPrice}
            </span>
          </div>

          {/* Stock information */}
          <div className="flex flex-col mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Available: <span className="font-medium">{stockQuantity}</span>
              </span>
              <span className={clsx("text-xs font-medium", isOutOfStock ? "text-red-500" : "text-green-600")}>
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className={clsx("h-1.5 rounded-full", isOutOfStock ? "bg-red-500" : "bg-green-500")}
                style={{ width: isOutOfStock ? "100%" : `${Math.min(100, (stockQuantity / 40) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Add to cart button */}
          <button
            className={clsx(
              "w-full py-2 rounded-md font-medium transition-colors text-sm",
              isOutOfStock
                ? "bg-red-100 text-red-500 cursor-not-allowed border border-red-300"
                : "bg-purple-primary hover:bg-purple-700 text-white"
            )}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
