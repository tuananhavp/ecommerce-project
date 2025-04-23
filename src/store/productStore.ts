import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { db } from "@/firebase/firebase";
import { ProductCardProps, ProductState } from "@/types/product.types";

export const useProductStore = create<ProductState>((set) => ({
  products: null,
  product: null,
  isLoading: true,
  error: null,
  getTrendingProduct: async () => {
    try {
      const q = query(collection(db, "product"), where("trending", "==", true));
      const products: ProductCardProps[] = [];
      const querySnapshot = await getDocs(q);

      console.log(querySnapshot.metadata);
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...(doc.data() as Omit<ProductCardProps, "id">),
        });
      });
      set({ products: products, isLoading: false });
    } catch (error) {
      console.log(error);
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
      set({ products: products, isLoading: false });
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  },
  createProduct: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const productData = {
        name: data.name || "",
        description: data.description || "",
        oldPrice: data.oldPrice || 0,
        newPrice: data.newPrice || 0,
        stockQuantity: data.stockQuantity || 0,
        category: data.category || "",
        trending: data.trending === true, // Convert to boolean explicitly
        imgUrl: Array.isArray(data.imgUrl) ? data.imgUrl : [],
        createdAt: new Date().toISOString(),
      };

      console.log("Product data to be added:", productData);

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
