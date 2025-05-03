import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { db } from "@/firebase/firebase";
import { ProductCardProps, ProductState } from "@/types/product.types";

export const useProductStore = create<ProductState>((set, get) => ({
  products: null,
  product: null,
  isLoading: true,
  error: null,
  filters: {
    priceRange: { min: 0, max: 100 },
    category: null,
    trending: false,
    inStock: false,
    rating: null,
  },

  setPriceRange: (min, max) => {
    set((state) => ({
      filters: { ...state.filters, priceRange: { min, max } },
    }));
    get().applyFilters();
  },

  setCategory: (category) => {
    set((state) => ({
      filters: { ...state.filters, category },
    }));
    get().applyFilters();
  },

  toggleTrending: () => {
    set((state) => ({
      filters: { ...state.filters, trending: !state.filters.trending },
    }));
    get().applyFilters();
  },

  toggleInStock: () => {
    set((state) => ({
      filters: { ...state.filters, inStock: !state.filters.inStock },
    }));
    get().applyFilters();
  },

  setRating: (rating) => {
    set((state) => ({
      filters: { ...state.filters, rating },
    }));
    get().applyFilters();
  },

  clearFilters: () => {
    set(() => ({
      filters: {
        priceRange: { min: 0, max: 100 },
        category: null,
        trending: false,
        inStock: false,
        rating: null,
      },
    }));
    get().getAllProduct();
  },

  applyFilters: async () => {
    try {
      set({ isLoading: true, error: null });

      const { filters } = get();
      let q = query(collection(db, "product"));

      if (filters.category) {
        q = query(q, where("category", "==", filters.category));
      }

      if (filters.trending) {
        q = query(q, where("trending", "==", true));
      }
      if (filters.inStock) {
        q = query(q, where("stockQuantity", ">", 0));
      }
      if (filters.rating) {
        q = query(q, where("rating", ">=", filters.rating));
      }

      const products: ProductCardProps[] = [];
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const product = {
          id: doc.id,
          ...(doc.data() as Omit<ProductCardProps, "id">),
        };

        // Apply price range filter locally since Firestore doesn't support range queries on multiple fields
        const priceToFilter =
          product.newPrice !== null && product.newPrice !== undefined ? product.newPrice : product.oldPrice;

        if (priceToFilter >= filters.priceRange.min && priceToFilter <= filters.priceRange.max) {
          products.push(product);
        }
      });

      set({ products, isLoading: false });
    } catch (error) {
      console.error("Error applying filters:", error);
      set({ products: null, isLoading: false, error: "Failed to apply filters" });
    }
  },

  getTrendingProduct: async () => {
    try {
      const q = query(collection(db, "product"), where("trending", "==", true));
      const products: ProductCardProps[] = [];
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...(doc.data() as Omit<ProductCardProps, "id">),
        });
      });
      set({ products, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ products: null, isLoading: false, error: "Failed to fetch the products" });
    }
  },

  getAllProduct: async () => {
    try {
      set({ isLoading: true, error: null });
      const q = query(collection(db, "product"));
      const products: ProductCardProps[] = [];
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...(doc.data() as Omit<ProductCardProps, "id">),
        });
      });
      set({ products, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ products: null, isLoading: false, error: "Failed to fetch the products" });
    }
  },

  getAProduct: async (productId: string) => {
    try {
      set({ isLoading: true });
      const productRef = doc(db, "product", productId);
      const docSnap = await getDoc(productRef);
      if (docSnap.exists()) {
        set({
          product: {
            id: docSnap.id,
            ...(docSnap.data() as Omit<ProductCardProps, "id">),
          },
          isLoading: false,
        });
      } else {
        set({ product: null, isLoading: false, error: "Failed to get this product, try again!!" });
      }
    } catch (error) {
      console.error(error);
    }
  },

  createProduct: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const productData = {
        ...data,
        createdAt: new Date().toISOString(),
      };

      const productRef = collection(db, "product");
      const newProductDoc = await addDoc(productRef, productData);

      const newProductSnapshot = await getDoc(newProductDoc);
      if (newProductSnapshot.exists()) {
        const newProduct = {
          id: newProductSnapshot.id,
          ...(newProductSnapshot.data() as Omit<ProductCardProps, "id">),
        };

        set((state) => ({
          product: newProduct,
          products: state.products ? [...state.products, newProduct] : state.products,
          isLoading: false,
        }));

        return newProduct;
      } else {
        throw new Error("Failed to retrieve the newly created product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      set({ isLoading: false, error: "Failed to create the product" });
      throw error;
    }
  },

  deleteProduct: async (productId: string) => {
    try {
      set({ isLoading: true, error: null });

      await deleteDoc(doc(db, "product", productId));

      set((state) => ({
        products: state.products ? state.products.filter((product) => product.id !== productId) : null,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      set({ isLoading: false, error: "Failed to delete the product" });
      throw error;
    }
  },

  updateProduct: async (productId: string, data: Partial<Omit<ProductCardProps, "id">>) => {
    try {
      set({ isLoading: true, error: null });

      const productRef = doc(db, "product", productId);
      await updateDoc(productRef, data);

      const updatedDocSnap = await getDoc(productRef);
      if (updatedDocSnap.exists()) {
        const updatedProduct = {
          id: updatedDocSnap.id,
          ...(updatedDocSnap.data() as Omit<ProductCardProps, "id">),
        };

        set((state) => ({
          product: updatedProduct,
          products: state.products ? state.products.map((p) => (p.id === productId ? updatedProduct : p)) : null,
          isLoading: false,
        }));

        return updatedProduct;
      } else {
        throw new Error("Failed to retrieve the updated product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      set({ isLoading: false, error: "Failed to update the product" });
      throw error;
    }
  },
  shallow,
}));
