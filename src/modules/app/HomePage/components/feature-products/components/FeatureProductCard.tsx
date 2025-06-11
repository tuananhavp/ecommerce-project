import React, { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Import star icons
import { FiPlusCircle } from "react-icons/fi";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import Swal from "sweetalert2";

import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favouriteStore";
import { CartItem } from "@/types/cart.types";
import { ProductCardProps } from "@/types/product.types";

const FeatureProductCard = ({
  id,
  name,
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
  const rating = productRating || 0;

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

  return (
    <div className="card lg:card-side bg-base-100 shadow-sm hover:shadow-lg relative">
      {/* Favorite button - positioned at the top right */}
      <div className="absolute top-2 right-2 z-10">
        <button onClick={handleToggleFavorite} className="btn btn-circle btn-sm bg-white hover:bg-gray-100">
          {productIsFavorite ? (
            <IoHeart className="size-5 text-red-500" />
          ) : (
            <IoHeartOutline className="size-5 text-gray-600" />
          )}
        </button>
      </div>

      <div className="w-full md:w-1/3 flex-shrink-0 p-2">
        <Link href={`/product/${id}`}>
          <figure>
            <Image src={imgUrl[0]} alt={name} className="object-cover" width={177} height={177} />
          </figure>
        </Link>
      </div>

      <div className="card-body">
        <Link href={`/product/${id}`}>
          <span className="card-title lg:text-base sm:text-xs text-[10px]">{name}</span>
        </Link>

        {/* Enhanced Rating Stars */}
        {renderRatingStars(rating)}

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
