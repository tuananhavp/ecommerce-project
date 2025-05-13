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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button className="btn btn-sm btn-error text-xs sm:text-sm" onClick={onClearCart} aria-label="Clear cart">
          Clear Cart
        </button>
      </div>

      {/* Selection header */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center p-2 bg-gray-100 rounded mb-4 gap-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="select-all"
            className="checkbox mr-2"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            aria-label="Select all items"
          />
          <label htmlFor="select-all" className="text-sm sm:text-base">
            Select All Items
          </label>
        </div>
        <div className="text-xs sm:text-sm">
          {selectedCount} of {totalCount} items selected
        </div>
      </div>
    </>
  );
};

export default React.memo(CartHeader);
