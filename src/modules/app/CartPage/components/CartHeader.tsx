import React from "react";

interface CartHeaderProps {
  onClearCart: () => void;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  selectedCount: number;
  totalCount: number;
}

const CartHeader = ({ onClearCart, isAllSelected, onToggleSelectAll, selectedCount, totalCount }: CartHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button className="btn btn-sm btn-error" onClick={onClearCart} aria-label="Clear cart">
          Clear Cart
        </button>
      </div>

      {/* Selection header */}
      <div className="flex justify-between items-center p-2 bg-gray-100 rounded mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="select-all"
            className="checkbox mr-2"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            aria-label="Select all items"
          />
          <label htmlFor="select-all">Select All Items</label>
        </div>
        <div className="text-sm">
          {selectedCount} of {totalCount} items selected
        </div>
      </div>
    </>
  );
};

export default React.memo(CartHeader);
