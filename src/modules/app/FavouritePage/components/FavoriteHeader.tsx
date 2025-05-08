import React from "react";

import Swal from "sweetalert2";

import { useFavoriteStore } from "@/store/favouriteStore";

const FavoriteHeader = () => {
  const { clearFavorites } = useFavoriteStore();

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

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Your Favorites</h2>
      <button className="btn btn-sm btn-error" onClick={handleClearFavorites} aria-label="Clear favorites list">
        Clear Favorites
      </button>
    </div>
  );
};

export default React.memo(FavoriteHeader);
