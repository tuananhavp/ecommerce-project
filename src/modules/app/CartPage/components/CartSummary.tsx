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
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Cart Total:</span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-purple-700">
          <span className="font-medium">Selected Items Total:</span>
          <span className="font-bold text-lg">${selectedItemsTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        className={`btn ${!isCheckoutDisabled ? "bg-purple-primary" : "bg-gray-400"} text-white w-full mt-4`}
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        aria-label={isCheckoutDisabled ? "Select items to checkout" : "Proceed to checkout"}
      >
        {isCheckoutDisabled ? "Select items to checkout" : `Proceed to Checkout (${selectedItemsCount} items)`}
      </button>
    </div>
  );
};

export default React.memo(CartSummary);
