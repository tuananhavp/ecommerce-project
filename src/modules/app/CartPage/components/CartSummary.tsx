import React from "react";

interface CartSummaryProps {
  totalPrice: number;
  selectedItemsTotal: number;
  selectedItemsCount: number;
  onCheckout: () => void;
}

const CartSummary = ({ totalPrice, selectedItemsTotal, selectedItemsCount, onCheckout }: CartSummaryProps) => {
  const isCheckoutDisabled = selectedItemsCount === 0;

  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-8">
        <div className="flex justify-between sm:flex-col sm:items-end">
          <span className="text-gray-500 text-sm">Cart Total:</span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between sm:flex-col sm:items-end text-purple-700">
          <span className="font-medium text-sm">Selected Items Total:</span>
          <span className="font-bold text-base sm:text-lg">${selectedItemsTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 sm:flex sm:justify-end">
        <button
          className={`btn ${
            !isCheckoutDisabled ? "bg-purple-primary" : "bg-gray-400"
          } text-white w-full sm:w-auto sm:min-w-[240px]`}
          onClick={onCheckout}
          disabled={isCheckoutDisabled}
          aria-label={isCheckoutDisabled ? "Select items to checkout" : "Proceed to checkout"}
        >
          {isCheckoutDisabled ? "Select items to checkout" : `Proceed to Checkout (${selectedItemsCount})`}
        </button>
      </div>
    </div>
  );
};

export default React.memo(CartSummary);
