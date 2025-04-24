"use client";
import React, { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { IoTrashOutline, IoCartOutline } from "react-icons/io5";
import Swal from "sweetalert2";

import NotFound from "@/components/NotFound";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favouriteStore";
import { CartItem } from "@/types/cart.types";
import { FavoriteItem } from "@/types/favourite.types";

const FavoritePage = () => {
  const { favorites, fetchFavorites, removeFromFavorites, clearFavorites } = useFavoriteStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = async (productID: string, productName: string) => {
    Swal.fire({
      title: "Remove from Favorites",
      text: `Are you sure you want to remove ${productName} from your favorites?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await removeFromFavorites(productID);
        Swal.fire({
          title: "Removed!",
          text: `${productName} has been removed from your favorites.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleClearFavorites = () => {
    Swal.fire({
      title: "Clear Favorites",
      text: "Are you sure you want to remove all items from your favorites?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "No, keep items",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await clearFavorites();
        Swal.fire({
          title: "Cleared!",
          text: "Your favorites have been cleared.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleAddToCart = async (favorite: FavoriteItem) => {
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
  };

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 py-36 flex-col">
        <NotFound title="Your favorites list is empty" />
        <Link href="/" className="btn btn-primary mt-4">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto md:w-8/12 lg:w-10/12 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Favorites</h2>
        <button className="btn btn-sm btn-error" onClick={handleClearFavorites}>
          Clear Favorites
        </button>
      </div>

      <div className="space-y-4">
        {favorites.map((favorite) => (
          <div
            key={favorite.productID}
            className="flex shadow-md p-4 rounded-lg bg-gray-50 items-center hover:shadow-lg transition"
          >
            <div className="w-20 h-20 relative flex-shrink-0">
              <Image src={favorite.imgUrl} alt={favorite.name} fill className="object-cover rounded" />
            </div>

            <div className="ml-4 flex-1">
              <Link href={`/product/${favorite.productID}`}>
                <h3 className="font-medium hover:text-purple-primary">{favorite.name}</h3>
              </Link>
              <p className="text-gray-600">${favorite.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Added on: {new Date(favorite.addedAt).toLocaleDateString()}</p>
            </div>

            <div className="flex flex-col items-end justify-between gap-2">
              <button
                className="btn btn-xs btn-error btn-outline"
                onClick={() => handleRemoveFavorite(favorite.productID, favorite.name)}
              >
                <IoTrashOutline className="size-4" />
                Remove
              </button>

              <button className="btn btn-xs btn-primary btn-outline" onClick={() => handleAddToCart(favorite)}>
                <IoCartOutline className="size-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;
