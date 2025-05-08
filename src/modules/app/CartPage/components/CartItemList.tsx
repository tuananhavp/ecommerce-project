import React from "react";

import CartItem from "./CartItem";

interface CartItemListProps {
  items: Array<{
    productID: string;
    name: string;
    price: number;
    quantity: number;
    imgUrl: string;
  }>;
  selectedItems: string[];
}

const CartItemList = ({ items, selectedItems }: CartItemListProps) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem key={item.productID} item={item} isSelected={selectedItems.includes(item.productID)} />
      ))}
    </div>
  );
};

export default React.memo(CartItemList);
