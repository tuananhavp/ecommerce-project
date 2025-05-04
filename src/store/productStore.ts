import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { db } from "@/firebase/firebase";
import { ProductCardProps, ProductReview, ProductState } from "@/types/product.types";

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

  addReview: async (productId, userId, userName, data, userAvatar) => {
    try {
      set({ isLoading: true, error: null });

      const productRef = doc(db, "product", productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      // Fetch user data from Firestore if userId is provided
      let userDisplayName = userName;
      let userProfileAvatar = userAvatar;

      if (userId) {
        try {
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            // Use the user data from Firestore if available
            userDisplayName = userData.username || userData.name || userName || "Anonymous";
            userProfileAvatar = userAvatar || userData.photoURL || userData.avatar || null;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Continue with the original userName if user fetch fails
        }
      }

      const productData = productSnap.data();
      const currentRating = productData.rating || 0;
      const currentReviewsCount = productData.reviewsCount || 0;

      // Calculate new average rating
      const newRating = (currentRating * currentReviewsCount + data.rating) / (currentReviewsCount + 1);

      // Create new review object with JavaScript Date instead of serverTimestamp
      const newReview = {
        id: uuidv4(),
        userId: userId,
        userName: userDisplayName, // Use the fetched or provided user name
        userAvatar: userProfileAvatar, // Use the fetched or provided avatar
        rating: data.rating,
        comment: data.comment || "",
        createdAt: new Date(), // Use JavaScript Date instead of serverTimestamp()
        helpful: 0,
        reported: false,
      };

      // Update product with new review and updated rating
      await updateDoc(productRef, {
        reviews: arrayUnion(newReview),
        rating: newRating,
        reviewsCount: currentReviewsCount + 1,
      });

      // Get updated product
      const updatedProductSnap = await getDoc(productRef);
      if (updatedProductSnap.exists()) {
        const updatedProduct = {
          id: updatedProductSnap.id,
          ...(updatedProductSnap.data() as Omit<ProductCardProps, "id">),
        };

        set({
          product: updatedProduct,
          isLoading: false,
        });

        return updatedProduct;
      } else {
        throw new Error("Failed to retrieve the updated product");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      set({ isLoading: false, error: "Failed to add review" });
      throw error;
    }
  },

  updateReview: async (productId, reviewId, data) => {
    try {
      set({ isLoading: true, error: null });

      const productRef = doc(db, "product", productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      interface Review {
        id: string;
        userId: string;
        userName: string;
        userAvatar: string | null;
        rating: number;
        comment: string;
        createdAt: FieldValue | Date | Timestamp; // Firebase server timestamp or Date object
        helpful: number;
        reported: boolean;
      }

      const productData = productSnap.data();
      const reviews = productData.reviews || [];
      const targetReviewIndex = reviews.findIndex((review: Review) => review.id === reviewId);

      if (targetReviewIndex === -1) {
        throw new Error("Review not found");
      }

      // Calculate rating update if necessary
      if (data.rating !== undefined && data.rating !== reviews[targetReviewIndex].rating) {
        const oldRating = reviews[targetReviewIndex].rating;
        const currentRating = productData.rating || 0;
        const reviewsCount = productData.reviewsCount || 0;

        // Remove old rating and add new one
        const newRating = (currentRating * reviewsCount - oldRating + data.rating) / reviewsCount;

        // Update product rating
        await updateDoc(productRef, {
          rating: newRating,
        });
      }

      // Create updated review with JavaScript Date instead of serverTimestamp
      const updatedReview = {
        ...reviews[targetReviewIndex],
        ...data,
        updatedAt: new Date(), // Use JavaScript Date instead of serverTimestamp()
      };

      // First remove the old review
      await updateDoc(productRef, {
        reviews: arrayRemove(reviews[targetReviewIndex]),
      });

      // Then add the updated review
      await updateDoc(productRef, {
        reviews: arrayUnion(updatedReview),
      });

      // Get updated product
      const updatedProductSnap = await getDoc(productRef);
      if (updatedProductSnap.exists()) {
        const updatedProduct = {
          id: updatedProductSnap.id,
          ...(updatedProductSnap.data() as Omit<ProductCardProps, "id">),
        };

        set({
          product: updatedProduct,
          isLoading: false,
        });

        return updatedProduct;
      } else {
        throw new Error("Failed to retrieve the updated product");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      set({ isLoading: false, error: "Failed to update review" });
      throw error;
    }
  },

  deleteReview: async (productId, reviewId) => {
    try {
      set({ isLoading: true, error: null });

      const productRef = doc(db, "product", productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      const productData = productSnap.data();
      const reviews = productData.reviews || [];
      const targetReview = reviews.find((review: ProductReview) => review.id === reviewId);

      if (!targetReview) {
        throw new Error("Review not found");
      }

      // Adjust rating
      const currentRating = productData.rating || 0;
      const currentReviewsCount = productData.reviewsCount || 0;

      let newRating = 0;
      const newReviewsCount = currentReviewsCount - 1;

      if (newReviewsCount > 0) {
        // Calculate new average rating by removing this review's rating
        newRating = (currentRating * currentReviewsCount - targetReview.rating) / newReviewsCount;
      }

      // Remove review and update rating
      await updateDoc(productRef, {
        reviews: arrayRemove(targetReview),
        rating: newRating,
        reviewsCount: newReviewsCount,
      });

      // Get updated product
      const updatedProductSnap = await getDoc(productRef);
      if (updatedProductSnap.exists()) {
        const updatedProduct = {
          id: updatedProductSnap.id,
          ...(updatedProductSnap.data() as Omit<ProductCardProps, "id">),
        };

        set({
          product: updatedProduct,
          isLoading: false,
        });

        return updatedProduct;
      } else {
        throw new Error("Failed to retrieve the updated product");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      set({ isLoading: false, error: "Failed to delete review" });
      throw error;
    }
  },

  markReviewHelpful: async (productId, reviewId) => {
    try {
      set({ isLoading: true, error: null });

      const productRef = doc(db, "product", productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      const productData = productSnap.data();
      const reviews = productData.reviews || [];
      const targetReview = reviews.find((review: ProductReview) => review.id === reviewId);

      if (!targetReview) {
        throw new Error("Review not found");
      }

      // Create updated review with incremented helpful count
      const updatedReview = {
        ...targetReview,
        helpful: (targetReview.helpful || 0) + 1,
      };

      // First remove the old review
      await updateDoc(productRef, {
        reviews: arrayRemove(targetReview),
      });

      // Then add the updated review
      await updateDoc(productRef, {
        reviews: arrayUnion(updatedReview),
      });

      // Get updated product
      const updatedProductSnap = await getDoc(productRef);
      if (updatedProductSnap.exists()) {
        const updatedProduct = {
          id: updatedProductSnap.id,
          ...(updatedProductSnap.data() as Omit<ProductCardProps, "id">),
        };

        set({
          product: updatedProduct,
          isLoading: false,
        });

        return updatedProduct;
      } else {
        throw new Error("Failed to retrieve the updated product");
      }
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      set({ isLoading: false, error: "Failed to mark review as helpful" });
      throw error;
    }
  },

  reportReview: async (productId, reviewId) => {
    try {
      set({ isLoading: true, error: null });

      const productRef = doc(db, "product", productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      const productData = productSnap.data();
      const reviews = productData.reviews || [];
      const targetReview = reviews.find((review: ProductReview) => review.id === reviewId);

      if (!targetReview) {
        throw new Error("Review not found");
      }

      // Create updated review with reported flag
      const updatedReview = {
        ...targetReview,
        reported: true,
      };

      // First remove the old review
      await updateDoc(productRef, {
        reviews: arrayRemove(targetReview),
      });

      // Then add the updated review
      await updateDoc(productRef, {
        reviews: arrayUnion(updatedReview),
      });

      // Get updated product
      const updatedProductSnap = await getDoc(productRef);
      if (updatedProductSnap.exists()) {
        const updatedProduct = {
          id: updatedProductSnap.id,
          ...(updatedProductSnap.data() as Omit<ProductCardProps, "id">),
        };

        set({
          product: updatedProduct,
          isLoading: false,
        });

        return updatedProduct;
      } else {
        throw new Error("Failed to retrieve the updated product");
      }
    } catch (error) {
      console.error("Error reporting review:", error);
      set({ isLoading: false, error: "Failed to report review" });
      throw error;
    }
  },
  shallow,
}));
