import { db } from "@/firebase/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { create } from "zustand";

interface ProductState {
  products: ProductCardProps[] | null;
  product: ProductCardProps | null;
  isLoading: boolean;
  error: string | null;
  getTrendingProduct: () => void;
  getAllProduct: () => void;
  getAProduct: (productId: string) => void;
}

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  stockQuantity: number;
  category: string;
  trending: boolean;
  imgUrl: string;
}

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
      const productRef = doc(db, "product", productId); // 'products' is your collection name
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
}));
