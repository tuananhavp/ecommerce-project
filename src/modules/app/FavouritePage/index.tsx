"use client";
import React, { useEffect } from "react";

import NotFound from "@/components/NotFound";
import { useFavoriteStore } from "@/store/favouriteStore";

import FavoriteHeader from "./components/FavoriteHeader";
import FavoriteList from "./components/FavoriteList";

const FavoritePage: React.FC = () => {
  const { favorites, fetchFavorites } = useFavoriteStore();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 py-36 flex-col">
        <NotFound title="Your favorites list is empty" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 mx-auto w-full sm:w-11/12 md:w-10/12 lg:w-10/12 xl:w-9/12 bg-white shadow-md rounded-lg">
      <FavoriteHeader />
      <FavoriteList favorites={favorites} />
    </div>
  );
};

export default FavoritePage;
