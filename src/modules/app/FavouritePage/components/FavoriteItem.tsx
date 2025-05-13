import React, { useCallback } from "react";

import Image from "next/image";
import Link from "next/link";

import { IoTrashOutline, IoCartOutline } from "react-icons/io5";
import Swal from "sweetalert2";

import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favouriteStore";
import { CartItem } from "@/types/cart.types";
import { FavoriteItem as FavoriteItemType } from "@/types/favourite.types";

interface FavoriteItemProps {
  favorite: FavoriteItemType;
}

const FavoriteItem = ({ favorite }: FavoriteItemProps) => {
  const { removeFromFavorites } = useFavoriteStore();
  const { addToCart } = useCartStore();

  const handleRemoveFavorite = useCallback(async () => {
    Swal.fire({
      title: "Remove from Favorites",
      text: `Are you sure you want to remove ${favorite.name} from your favorites?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await removeFromFavorites(favorite.productID);
        Swal.fire({
          title: "Removed!",
          text: `${favorite.name} has been removed from your favorites.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }, [favorite.name, favorite.productID, removeFromFavorites]);

  const handleAddToCart = useCallback(async () => {
    const cartItem: CartItem = {
      productID: favorite.productID,
      name: favorite.name,
      price: favorite.price,
      imgUrl: favorite.imgUrl,
      quantity: 1,
    };

    try {
      await addToCart(cartItem);
      Swal.fire({
        title: "Added to Cart",
        text: `${favorite.name} has been added to your cart.`,
        icon: "success",
        timer: 1500,
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
  }, [favorite, addToCart]);

  // Format date for better accessibility and readability
  const formattedDate = new Date(favorite.addedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row shadow-md p-3 sm:p-4 rounded-lg bg-gray-50 items-start sm:items-center hover:shadow-lg transition gap-3 sm:gap-0">
      <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0 self-start">
        <Image
          src={favorite.imgUrl}
          alt={favorite.name}
          fill
          className="object-cover rounded"
          sizes="(max-width: 640px) 64px, 80px"
          loading="lazy"
        />
      </div>

      <div className="ml-0 sm:ml-4 flex-1">
        <Link href={`/product/${favorite.productID}`}>
          <h3 className="font-medium text-sm sm:text-base line-clamp-1 hover:text-purple-primary">{favorite.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm sm:text-base">${favorite.price.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-1" title={formattedDate}>
          Added on: {formattedDate}
        </p>
      </div>

      <div className="flex flex-row sm:flex-col w-full sm:w-auto justify-between sm:justify-end items-center sm:items-end gap-2 mt-2 sm:mt-0">
        <button
          className="btn btn-xs btn-error btn-outline flex-1 sm:flex-auto justify-center"
          onClick={handleRemoveFavorite}
          aria-label={`Remove ${favorite.name} from favorites`}
        >
          <IoTrashOutline className="size-3 sm:size-4" />
          <span className="ml-1 text-xs sm:text-sm">Remove</span>
        </button>

        <button
          className="btn btn-xs btn-primary btn-outline flex-1 sm:flex-auto justify-center"
          onClick={handleAddToCart}
          aria-label={`Add ${favorite.name} to cart`}
        >
          <IoCartOutline className="size-3 sm:size-4" />
          <span className="ml-1 text-xs sm:text-sm">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(FavoriteItem);
