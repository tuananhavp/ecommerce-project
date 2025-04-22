// src/store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { CartState } from "@/types/cart.types";

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((cartItem) => cartItem.productID === item.productID);

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.productID === item.productID ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
              ),
            };
          } else {
            return {
              items: [...state.items, { ...item, quantity: 1 }],
            };
          }
        }),

      removeItem: (productID) =>
        set((state) => ({
          items: state.items.filter((item) => item.productID !== productID),
        })),

      updateQuantity: (productID, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.productID === productID ? { ...item, quantity } : item)),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.length;
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
