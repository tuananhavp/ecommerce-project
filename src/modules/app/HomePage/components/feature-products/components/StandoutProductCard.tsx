import React, { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from "react-icons/fa"; // Import star icons
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import Swal from "sweetalert2";

import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favouriteStore";
import { CartItem } from "@/types/cart.types";
import { ProductCardProps } from "@/types/product.types";

const StandoutProductCard = ({
  id,
  name,
  description,
  oldPrice,
  newPrice,
  stockQuantity,
  trending,
  imgUrl,
  rating: productRating,
}: ProductCardProps) => {
  const { addToCart } = useCartStore();
  const { addToFavorites, removeFromFavorites, isFavorite, fetchFavorites } = useFavoriteStore();
  const [isMounted, setIsMounted] = useState(false);

  // Calculate the effective price
  const price = (newPrice ?? 0) > 0 ? newPrice : oldPrice ?? 0;
  // Use product rating or default to 3
  const rating = productRating || 3;

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

  useEffect(() => {
    const init = async () => {
      await fetchFavorites();
      setIsMounted(true);
    };

    init();
  }, [fetchFavorites]);

  const handleAddToCart = async () => {
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
      if (isFavorite(id)) {
        await removeFromFavorites(id);
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

  // Check if product is in favorites
  const productIsFavorite = isMounted && isFavorite(id);

  // Function to render stars with a more visually appealing approach
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          // For whole stars
          if (star <= Math.floor(rating)) {
            return <FaStar key={star} className="text-yellow-400 text-xs" />;
          }
          // For half stars
          else if (star <= Math.ceil(rating) && rating % 1 >= 0.3 && rating % 1 <= 0.7) {
            return <FaStarHalfAlt key={star} className="text-yellow-400 text-xs" />;
          }
          // For empty stars
          else {
            return <FaRegStar key={star} className="text-yellow-400 text-xs" />;
          }
        })}
        <span className="ml-1 text-xs text-gray-500">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Calculate stock percentage for the progress bar
  const stockPercentage = Math.min((stockQuantity / 10) * 100, 100); // Assume 10 is max stock for visualization

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-xl transition-shadow duration-300 relative h-full w-full border-2 border-[#DC2626] rounded-lg overflow-hidden">
      {/* Favorite button - positioned at the top right, with better positioning */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleToggleFavorite}
          className="btn btn-circle btn-sm bg-white hover:bg-gray-100 shadow-md"
          aria-label={productIsFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {productIsFavorite ? (
            <IoHeart className="size-5 text-red-500" />
          ) : (
            <IoHeartOutline className="size-5 text-gray-600" />
          )}
        </button>
      </div>

      <Link href={`/product/${id}`} className="block pt-4 px-4">
        <figure className="relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105">
          <Image src={imgUrl[0]} alt={name} className="object-contain w-full" width={360} height={360} />
        </figure>
      </Link>

      <div className="card-body p-4">
        {/* Enhanced Rating Stars */}
        {renderRatingStars(rating)}

        <Link href={`/product/${id}`} className="group">
          <h3 className="font-bold text-lg mt-2 mb-1 group-hover:text-[#DC2626] transition-colors duration-200">
            {name}
          </h3>

          {description && <p className="text-gray-600 text-xs mb-3 line-clamp-2">{description}</p>}
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <span className={clsx("text-[#DC2626] font-bold text-xl", newPrice == 0 && "hidden")}>${newPrice}</span>
          <span
            className={clsx("text-gray-700", {
              "text-[#DC2626] font-bold text-xl": newPrice == 0,
              "line-through text-gray-500 text-sm": newPrice !== 0,
            })}
          >
            ${oldPrice}
          </span>
        </div>

        {/* Stock indicator with badge style */}
        <div className="mb-2">
          <span
            className={clsx(
              "px-3 py-1 rounded-full text-xs font-medium",
              stockQuantity > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}
          >
            {stockQuantity > 0 ? "IN STOCK" : "OUT OF STOCK"}
          </span>
        </div>

        {/* Improved stock indicator */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs">Stock running low</span>
            <span className="text-gray-800 text-xs font-semibold">{stockQuantity} left</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-400"
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Enhanced add to cart button */}
        <div className="card-actions mt-auto">
          <button
            className={clsx(
              "btn w-full text-white font-medium hover:opacity-90 transition-opacity",
              stockQuantity > 0 ? "bg-[#16A34A] hover:bg-[#15803d]" : "bg-gray-400 cursor-not-allowed"
            )}
            onClick={handleAddToCart}
            disabled={stockQuantity <= 0}
          >
            <FaShoppingCart className="mr-2" />
            {stockQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {trending && (
        <div className="rounded-full size-11 text-xs font-bold bg-red-600 absolute top-2 left-2 flex items-center justify-center text-white animate-pulse shadow-md">
          New
        </div>
      )}

      {/* Sale tag for products with discounted price */}
      {newPrice !== null && newPrice !== undefined && newPrice > 0 && newPrice < oldPrice && (
        <div className="absolute top-14 left-0 bg-[#DC2626] text-white text-xs py-1 px-3 font-semibold shadow-md">
          SALE
        </div>
      )}
    </div>
  );
};

export default StandoutProductCard;
