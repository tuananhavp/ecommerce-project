import { doc, getDoc, updateDoc } from "firebase/firestore";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { db } from "@/firebase/firebase";
import { FavoriteItem } from "@/types/favourite.types";

import { useAuthStore } from "./authStore";

interface FavoriteState {
  favorites: FavoriteItem[];
  isLoading: boolean;
  error: string | null;

  fetchFavorites: () => Promise<void>;
  addToFavorites: (item: Omit<FavoriteItem, "addedAt">) => Promise<void>;
  removeFromFavorites: (productID: string) => Promise<void>;
  isFavorite: (productID: string) => boolean;
  clearFavorites: () => Promise<void>;
  mergeFavoritesWithUserFavorites: () => Promise<void>;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,
      error: null,

      fetchFavorites: async () => {
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
              favorites: userData.favorites || [],
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addToFavorites: async (item: Omit<FavoriteItem, "addedAt">) => {
        const { user } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const currentFavorites = [...get().favorites];
          const existingItemIndex = currentFavorites.findIndex((favItem) => favItem.productID === item.productID);

          if (existingItemIndex >= 0) {
            set({ isLoading: false });
            return;
          }

          const favoriteItem: FavoriteItem = {
            ...item,
            addedAt: Date.now(),
          };

          const updatedFavorites = [...currentFavorites, favoriteItem];

          if (user?.uid) {
            await updateDoc(doc(db, "users", user.uid), {
              favorites: updatedFavorites,
            });
          }

          set({
            favorites: updatedFavorites,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error adding item to favorites:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      removeFromFavorites: async (productID: string) => {
        const { user } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const currentFavorites = get().favorites;
          const updatedFavorites = currentFavorites.filter((item) => item.productID !== productID);

          if (user?.uid) {
            await updateDoc(doc(db, "users", user.uid), {
              favorites: updatedFavorites,
            });
          }

          set({
            favorites: updatedFavorites,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error removing item from favorites:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      isFavorite: (productID: string) => {
        return get().favorites.some((item) => item.productID === productID);
      },

      clearFavorites: async () => {
        const { user } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          if (user?.uid) {
            await updateDoc(doc(db, "users", user.uid), {
              favorites: [],
            });
          }

          set({
            favorites: [],
            isLoading: false,
          });
        } catch (error) {
          console.error("Error clearing favorites:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      mergeFavoritesWithUserFavorites: async () => {
        const { user } = useAuthStore.getState();
        if (!user?.uid) {
          return;
        }

        try {
          set({ isLoading: true, error: null });

          const localFavorites = get().favorites;

          if (localFavorites.length === 0) {
            set({ isLoading: false });
            return;
          }

          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists()) {
            set({ error: "User profile not found", isLoading: false });
            return;
          }

          const userData = userDoc.data();
          const userFavorites: FavoriteItem[] = userData.favorites || [];

          const mergedFavorites = [...userFavorites];

          for (const localItem of localFavorites) {
            const existingItemIndex = mergedFavorites.findIndex((item) => item.productID === localItem.productID);

            if (existingItemIndex === -1) {
              mergedFavorites.push(localItem);
            }
          }

          await updateDoc(doc(db, "users", user.uid), {
            favorites: mergedFavorites,
          });

          set({
            favorites: mergedFavorites,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error merging favorites:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
