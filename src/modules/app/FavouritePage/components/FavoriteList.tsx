import React from "react";

import { FavoriteItem as FavoriteItemType } from "@/types/favourite.types";

import FavoriteItem from "./FavoriteItem";

interface FavoriteListProps {
  favorites: FavoriteItemType[];
}

const FavoriteList: React.FC<FavoriteListProps> = ({ favorites }) => {
  return (
    <div className="space-y-4">
      {favorites.map((favorite) => (
        <FavoriteItem key={favorite.productID} favorite={favorite} />
      ))}
    </div>
  );
};

export default React.memo(FavoriteList);
