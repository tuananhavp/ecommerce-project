import React, { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";
import { BsCart2 } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
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
  const [isHovered, setIsHovered] = useState(false);

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
      Toast.fire({
        icon: "success",
        title: `Added ${name} to cart`,
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
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: "450px" }} // Fixed card height
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {trending && <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">NEW</div>}
        {discountPercentage > 0 && (
          <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-md">
            {discountPercentage}% OFF
          </div>
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
              className={`object-contain transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
              width={180}
              height={180}
              style={{ maxHeight: "100%", width: "auto" }}
            />
          </div>
        </Link>

        {/* Quick action buttons */}
        <div
          className={`absolute left-0 right-0 bottom-0 flex justify-center gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
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
            className={`bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-all ${
              stockQuantity <= 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={stockQuantity <= 0}
            title={stockQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
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
            {newPrice && newPrice > 0 && <span className="text-purple-600 font-bold text-lg">${newPrice}</span>}
            <span
              className={clsx("text-gray-500", {
                "text-purple-600 font-bold text-lg": newPrice === 0,
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
              {stockQuantity > 0 ? (
                <span className="text-xs font-medium text-green-600">In Stock</span>
              ) : (
                <span className="text-xs font-medium text-red-500">Out of Stock</span>
              )}
            </div>
            {stockQuantity > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (stockQuantity / 40) * 100)}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Add to cart button */}
          <button
            className={clsx(
              "w-full py-2 rounded-md font-medium transition-colors text-sm",
              stockQuantity <= 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-primary hover:bg-purple-700 text-white"
            )}
            onClick={handleAddToCart}
            disabled={stockQuantity <= 0}
          >
            {stockQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
