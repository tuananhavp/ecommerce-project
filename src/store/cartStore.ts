import { doc, getDoc, updateDoc } from "firebase/firestore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { db } from "@/firebase/firebase";
import { CartItem } from "@/types/cart.types";

import { useAuthStore } from "./authStore";

const CART_STORAGE_KEY = "guest_cart_items";
const SELECTED_ITEMS_STORAGE_KEY = "selected_cart_items";

interface CartState {
  items: CartItem[];
  selectedItems: string[];
  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productID: string) => Promise<void>;
  updateCartItemQuantity: (productID: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeLocalCartWithUserCart: () => Promise<void>;

  toggleItemSelection: (productID: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  getSelectedItems: () => CartItem[];
  getSelectedItemsCount: () => number;
  getSelectedItemsTotal: () => number;
  clearSelectedItems: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItems: [],
      isLoading: false,
      error: null,

      fetchCart: async () => {
        const { user } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          if (user?.uid) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
              set({ error: "User profile not found", isLoading: false });
              return;
            }

            const userData = userDoc.data();
            set({
              items: userData.cart || [],
              isLoading: false,
            });
          } else {
            const storedItems = localStorage.getItem(CART_STORAGE_KEY);
            set({
              items: storedItems ? JSON.parse(storedItems) : [],
              isLoading: false,
            });
          }

          const storedSelectedItems = localStorage.getItem(SELECTED_ITEMS_STORAGE_KEY);
          set({ selectedItems: storedSelectedItems ? JSON.parse(storedSelectedItems) : [] });
        } catch (error) {
          console.error("Error fetching cart:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addToCart: async (item: CartItem) => {
        const { user } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const currentItems = [...get().items];
          const existingItemIndex = currentItems.findIndex((cartItem) => cartItem.productID === item.productID);

          if (existingItemIndex >= 0) {
            currentItems[existingItemIndex].quantity += item.quantity;
          } else {
            currentItems.push(item);
          }

          if (user?.uid) {
            await updateDoc(doc(db, "users", user.uid), { cart: currentItems });
          } else {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentItems));
          }

          set({ items: currentItems, isLoading: false });
        } catch (error) {
          console.error("Error adding item to cart:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      removeFromCart: async (productID: string) => {
        const { user } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const currentItems = get().items;
          const updatedItems = currentItems.filter((item) => item.productID !== productID);

          const currentSelectedItems = get().selectedItems.filter((id) => id !== productID);

          if (user?.uid) {
            await updateDoc(doc(db, "users", user.uid), { cart: updatedItems });
          } else {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
          }

          localStorage.setItem(SELECTED_ITEMS_STORAGE_KEY, JSON.stringify(currentSelectedItems));
          set({ items: updatedItems, selectedItems: currentSelectedItems, isLoading: false });
        } catch (error) {
          console.error("Error removing item from cart:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      updateCartItemQuantity: async (productID: string, quantity: number) => {
        const { user } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          let currentItems = [...get().items];
          const itemIndex = currentItems.findIndex((item) => item.productID === productID);

          if (itemIndex >= 0) {
            if (quantity > 0) {
              currentItems[itemIndex].quantity = quantity;
            } else {
              currentItems = currentItems.filter((item) => item.productID !== productID);
              const updatedSelectedItems = get().selectedItems.filter((id) => id !== productID);
              localStorage.setItem(SELECTED_ITEMS_STORAGE_KEY, JSON.stringify(updatedSelectedItems));
              set({ selectedItems: updatedSelectedItems });
            }

            if (user?.uid) {
              await updateDoc(doc(db, "users", user.uid), { cart: currentItems });
            } else {
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentItems));
            }

            set({ items: currentItems, isLoading: false });
          } else {
            set({ error: "Item not found in cart", isLoading: false });
          }
        } catch (error) {
          console.error("Error updating cart item quantity:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      clearCart: async () => {
        const { user } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          if (user?.uid) {
            await updateDoc(doc(db, "users", user.uid), { cart: [] });
          } else {
            localStorage.removeItem(CART_STORAGE_KEY);
          }

          localStorage.removeItem(SELECTED_ITEMS_STORAGE_KEY);
          set({ items: [], selectedItems: [], isLoading: false });
        } catch (error) {
          console.error("Error clearing cart:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      mergeLocalCartWithUserCart: async () => {
        const { user } = useAuthStore.getState();
        if (!user?.uid) return;

        try {
          set({ isLoading: true, error: null });

          const storedItems = localStorage.getItem(CART_STORAGE_KEY);
          const localCartItems: CartItem[] = storedItems ? JSON.parse(storedItems) : [];

          if (localCartItems.length === 0) {
            set({ isLoading: false });
            return;
          }

          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists()) {
            set({ error: "User profile not found", isLoading: false });
            return;
          }

          const userData = userDoc.data();
          const userCartItems: CartItem[] = userData.cart || [];

          const mergedItems = [...userCartItems];

          for (const localItem of localCartItems) {
            const existingItemIndex = mergedItems.findIndex((item) => item.productID === localItem.productID);

            if (existingItemIndex >= 0) {
              mergedItems[existingItemIndex].quantity = Math.max(
                mergedItems[existingItemIndex].quantity,
                localItem.quantity
              );
            } else {
              mergedItems.push(localItem);
            }
          }

          await updateDoc(doc(db, "users", user.uid), { cart: mergedItems });
          localStorage.removeItem(CART_STORAGE_KEY);

          set({ items: mergedItems, isLoading: false });
        } catch (error) {
          console.error("Error merging carts:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      toggleItemSelection: (productID: string) => {
        const currentSelectedItems = [...get().selectedItems];
        const index = currentSelectedItems.indexOf(productID);

        if (index >= 0) {
          currentSelectedItems.splice(index, 1);
        } else {
          currentSelectedItems.push(productID);
        }

        localStorage.setItem(SELECTED_ITEMS_STORAGE_KEY, JSON.stringify(currentSelectedItems));
        set({ selectedItems: currentSelectedItems });
      },

      selectAllItems: () => {
        const allItemIDs = get().items.map((item) => item.productID);
        localStorage.setItem(SELECTED_ITEMS_STORAGE_KEY, JSON.stringify(allItemIDs));
        set({ selectedItems: allItemIDs });
      },

      deselectAllItems: () => {
        localStorage.setItem(SELECTED_ITEMS_STORAGE_KEY, JSON.stringify([]));
        set({ selectedItems: [] });
      },

      getSelectedItems: () => {
        const { items, selectedItems } = get();
        return items.filter((item) => selectedItems.includes(item.productID));
      },

      getSelectedItemsCount: () => get().selectedItems.length,

      getSelectedItemsTotal: () => {
        const { items, selectedItems } = get();
        return items
          .filter((item) => selectedItems.includes(item.productID))
          .reduce((total, item) => total + item.price * item.quantity, 0);
      },

      clearSelectedItems: () => {
        localStorage.removeItem(SELECTED_ITEMS_STORAGE_KEY);
        set({ selectedItems: [] });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        selectedItems: state.selectedItems,
      }),
    }
  )
);
